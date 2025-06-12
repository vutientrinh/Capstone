package com.satvik.satchat.service;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.common.PageResponse;
import com.satvik.satchat.dto.ProductFilter;
import com.satvik.satchat.entity.Ecommerce.CategoryEntity;
import com.satvik.satchat.entity.Ecommerce.ProductEntity;
import com.satvik.satchat.entity.SocialNetwork.FileEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.handler.CustomException;
import com.satvik.satchat.mapper.ProductMapper;
import com.satvik.satchat.payload.file.FileResponse;
import com.satvik.satchat.payload.product.ProductRequest;
import com.satvik.satchat.payload.product.ProductResponse;
import com.satvik.satchat.repository.CategoryRepository;
import com.satvik.satchat.repository.FileRepository;
import com.satvik.satchat.repository.ProductRepository;
import com.satvik.satchat.utils.FileTypeUtils;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProductService {
  private final ProductRepository productRepository;
  private final CategoryRepository categoryRepository;
  private final FileRepository fileRepository;
  private final MinioService minioService;
  private final ProductMapper productMapper;

  public ProductService(
      ProductRepository productRepository,
      CategoryRepository categoryRepository,
      FileRepository fileRepository,
      MinioService minioService,
      ProductMapper productMapper) {
    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;
    this.fileRepository = fileRepository;
    this.minioService = minioService;
    this.productMapper = productMapper;
  }

  @Transactional
  @CacheEvict(
      value = {"product:list", "product:detail"},
      allEntries = true)
  public ProductResponse createProduct(ProductRequest request) {
    CategoryEntity category =
        categoryRepository
            .findById(request.getCategoryId())
            .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    // Image to be uploaded to S3
    List<FileEntity> images = new ArrayList<>();
    if (request.getImages() != null) {
      for (MultipartFile image : request.getImages()) {
        String fileType = "";
        if (image != null && !image.isEmpty()) {
          fileType = FileTypeUtils.getFileType(image);
        }

        FileResponse object = minioService.putObject(image, "commons", fileType);
        FileEntity entity =
            fileRepository
                .findByFilename(object.getFilename())
                .orElseThrow(() -> new AppException(ErrorCode.FILE_NOT_EXISTED));
        images.add(entity);
      }
    }
    ProductEntity entity =
        ProductEntity.builder()
            .id(UUID.randomUUID())
            .name(request.getName())
            .description(request.getDescription())
            .category(category)
            .weight(request.getWeight())
            .height(request.getHeight())
            .width(request.getWidth())
            .length(request.getLength())
            .price(request.getPrice())
            .images(images)
            .stockQuantity(request.getStockQuantity() == null ? 0 : request.getStockQuantity())
            .build();
    productRepository.save(entity);
    return productMapper.toResponse(entity);
  }

  @Cacheable(value = "product:detail", key = "'product:' + #id")
  public ProductResponse getProductById(UUID id) {
    ProductEntity product =
        productRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    if (product.isDeleted()) {
      throw new AppException(ErrorCode.PRODUCT_IS_DELETED);
    } else {
      return productMapper.toResponse(product);
    }
  }

  @Transactional
  @CacheEvict(
      value = {"product:list", "product:detail"},
      allEntries = true)
  public ProductResponse updateProduct(UUID id, ProductRequest request) {
    ProductEntity reqProduct =
        productRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

    CategoryEntity category =
        categoryRepository
            .findById(request.getCategoryId())
            .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

    // Upload to S3
    List<FileEntity> images = new ArrayList<>();
    if (request.getImages() != null) {
      for (MultipartFile image : request.getImages()) {
        String fileType = "";
        if (image != null && !image.isEmpty()) {
          fileType = FileTypeUtils.getFileType(image);
        }

        FileResponse object = minioService.putObject(image, "commons", fileType);
        FileEntity entity =
            fileRepository
                .findByFilename(object.getFilename())
                .orElseThrow(() -> new AppException(ErrorCode.FILE_NOT_EXISTED));
        images.add(entity);
      }
    }

    // Update product entity
    reqProduct.setName(request.getName());
    reqProduct.setDescription(request.getDescription());
    reqProduct.setPrice(request.getPrice());
    reqProduct.setWeight(request.getWeight());
    reqProduct.setHeight(request.getHeight());
    reqProduct.setWidth(request.getWidth());
    reqProduct.setLength(request.getLength());
    reqProduct.setStockQuantity(
        request.getStockQuantity() == null ? 0 : request.getStockQuantity());
    reqProduct.setImages(images);
    reqProduct.setCategory(category);
    productRepository.save(reqProduct);

    ProductEntity product =
        productRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    return productMapper.toResponse(product);
  }

  @Cacheable(
      value = "product:list",
      key =
          "'page=' + #page + "
              + "':size=' + #size + "
              + "':search=' + (#filter?.filters?.search != null ? #filter.filters.search : '') + "
              + "':category=' + (#filter?.filters?.category != null ? #filter.filters.category : 'null') + "
              + "':minPrice=' + (#filter?.filters?.minPrice != null ? #filter.filters.minPrice : 'null') + "
              + "':maxPrice=' + (#filter?.filters?.maxPrice != null ? #filter.filters.maxPrice : 'null') + "
              + "':rating=' + (#filter?.filters?.rating != null ? #filter.filters.rating : 'null') + "
              + "':inStock=' + (#filter?.filters?.inStock != null ? #filter.filters.inStock : 'null') + "
              + "':field=' + (#filter?.sort?.field != null ? #filter.sort.field : 'null') + "
              + "':direction=' + (#filter?.sort?.direction != null ? #filter.sort.direction : 'null')")
  public PageResponse<ProductResponse> getAllProduct(int page, int size, ProductFilter filter) {
    if (page < 0 || size < 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }
    Pageable pageable =
        PageRequest.of(
            page - 1,
            size,
            Sort.by(
                Sort.Direction.fromString(filter.getSort().getDirection()),
                filter.getSort().getField()));
    ProductFilter.FilterCriteria f = filter.getFilters();
    var products =
        productRepository.findAllProducts(
            pageable,
            f.getSearch() != null && !f.getSearch().isEmpty() ? String.valueOf(f.getSearch()) : "",
            f.getCategory() != null && !f.getCategory().isEmpty() ? f.getCategory() : null,
            f.getMinPrice() != null ? new BigDecimal(f.getMinPrice()) : null,
            f.getMaxPrice() != null ? new BigDecimal(f.getMaxPrice()) : null,
            f.getRating() != null ? Integer.valueOf(f.getRating()) : 0,
            f.getInStock() != null ? f.getInStock() : null);

    return PageResponse.<ProductResponse>builder()
        .currentPage(page)
        .pageSize(products.getSize())
        .totalPages(products.getTotalPages())
        .totalElements(products.getTotalElements())
        .data(products.getContent().stream().map(productMapper::toResponse).toList())
        .build();
  }

  @Transactional
  @CacheEvict(
      value = {"product:list", "product:detail"},
      allEntries = true)
  public Boolean deleteProduct(UUID id) {
    ProductEntity product =
        productRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    if (product.isDeleted()) {
      throw new AppException(ErrorCode.PRODUCT_IS_DELETED);
    }
    product.setDeleted(true);
    productRepository.save(product);

    // Check if the product is deleted
    ProductEntity deletedProduct =
        productRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    if (!product.isDeleted()) {
      throw new AppException(ErrorCode.PRODUCT_NOT_DELETED);
    }

    // TODO:  Delete the product from S3
    return true;
  }

  public Boolean setVisibleProduct(UUID id, boolean visible) {
    ProductEntity product =
        productRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    if (product.isDeleted()) {
      throw new AppException(ErrorCode.PRODUCT_IS_DELETED);
    }
    product.setVisible(visible);
    productRepository.save(product);

    // Check if the product is visible
    ProductEntity updatedProduct =
        productRepository
            .findById(id)
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    return updatedProduct.isVisible() == visible;
  }

  public void outOfStock(UUID productId, int quantity) {
    ProductEntity product =
        productRepository
            .findById(productId)
            .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    if (product.isDeleted()) {
      throw new AppException(ErrorCode.PRODUCT_IS_DELETED);
    }
    if (product.getStockQuantity() < quantity || product.getStockQuantity() <= 0) {
      throw new CustomException(ErrorCode.PRODUCT_OUT_OF_STOCK, product.getName());
    }
  }
}
