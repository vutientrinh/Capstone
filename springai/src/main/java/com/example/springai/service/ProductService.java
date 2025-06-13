package com.example.springai.service;

import com.example.springai.dto.Parts;
import com.example.springai.dto.Prompt;
import com.example.springai.entity.ProductKeyword;
import com.example.springai.entity.UserInterestKeyword;
import com.example.springai.model.Product;
import com.example.springai.repository.ProductKeywordRepository;
import com.example.springai.repository.ProductRepository;
import com.example.springai.repository.UserInterestKeywordRepository;
import com.example.springai.repository.UserRepository;
import com.example.springai.utils.RequestUtils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ProductService {
  private final UserRepository userRepository;
  public final ProductRepository productRepository;
  public final ProductKeywordRepository productKeywordRepository;
  private final UserInterestKeywordRepository userInterestKeywordRepository;
  private final AppService appService;
  private final RequestUtils requestUtils;

  public ProductService(
      UserRepository userRepository,
      ProductRepository productRepository,
      ProductKeywordRepository productKeywordRepository,
      UserInterestKeywordRepository userInterestKeywordRepository,
      AppService appService,
      RequestUtils requestUtils) {
    this.userRepository = userRepository;
    this.productRepository = productRepository;
    this.productKeywordRepository = productKeywordRepository;
    this.userInterestKeywordRepository = userInterestKeywordRepository;
    this.appService = appService;
    this.requestUtils = requestUtils;
  }

  public void insertProduct(String json) throws Exception {
    log.info("Inserting product data: {}", json);
    json = json.replaceAll("\"null\"", "null");
    ObjectMapper mapper = new ObjectMapper();
    mapper.findAndRegisterModules();
    Product product = mapper.readValue(json, Product.class);

    if (!productRepository.existsById(product.getId())) {
      log.info("Product does not exist, inserting new product: {}", product.getId());
      productRepository.insertProduct(
          product.getId(),
          product.getCreatedAt(),
          product.getUpdatedAt(),
          product.getCurrency(),
          product.getDescription(),
          product.getHeight(),
          product.getIsDeleted(),
          product.getIsLiked(),
          product.getLength(),
          product.getName(),
          product.getPrice(),
          product.getRating(),
          product.getSalesCount(),
          product.getStockQuantity(),
          product.getVisible(),
          product.getWeight(),
          product.getWidth(),
          product.getCategory() != null ? product.getCategory() : null);

      if (!productKeywordRepository.isExistKeywords(product.getId())) {
        // set post's keywords
        Parts parts = new Parts();
        parts.setText(product.getName());
        Prompt prompt = requestUtils.bodyExtractKeywords(parts);
        String keywords = appService.getKeywords(prompt, parts);

        productKeywordRepository.save(
            ProductKeyword.builder().productId(product.getId()).keyword(keywords).build());
      }
    }
  }

  public void setUserKeywords(String json) throws Exception {
    log.info("[LIKED_PRODUCT] Setting user keywords: {}", json);
    json = json.replaceAll("\"null\"", "null");
    ObjectMapper mapper = new ObjectMapper();
    mapper.findAndRegisterModules();
    Map<String, Object> postLiked =
        mapper.readValue(json, new TypeReference<Map<String, Object>>() {});

    // Get information from JSON
    String productId = (String) postLiked.get("product");
    String authorId = (String) postLiked.get("author");

    if (productId.length() == 36 && authorId.length() == 36) {
      String keywords = productRepository.getKeywordsByProductId(productId);
      String reKeywords = userRepository.keywordExists(authorId);

      if (keywords != null && keywords.length() > 0) {
        keywords = keywords.replace("[", "").replace("]", "");
      }
      if (reKeywords != null && reKeywords.length() > 0) {
        reKeywords = reKeywords.replace("[", "").replace("]", "");
      }

      Set<String> mergedKeywords = new LinkedHashSet<>();
      if (keywords != null && !keywords.isEmpty()) {
        for (String keyword : keywords.split(",")) {
          mergedKeywords.add(keyword.trim());
        }
      }
      if (reKeywords != null && !reKeywords.isEmpty()) {
        for (String keyword : reKeywords.split(",")) {
          mergedKeywords.add(keyword.trim());
        }
      }

      String result = "[" + String.join(",", mergedKeywords) + "]";
      if (userInterestKeywordRepository.existsRecord(authorId, result)) {
        log.info("User interest keyword already exists for userId: {}", authorId);
        return;
      }

      Optional<UserInterestKeyword> existing = userInterestKeywordRepository.findByUserId(authorId);
      if (existing.isPresent()) {
        UserInterestKeyword entity = existing.get();
        entity.setKeyword(result);
        userInterestKeywordRepository.save(entity);
        log.info("Updated user interest keyword for userId: {}", authorId);
      } else {
        userInterestKeywordRepository.save(
            UserInterestKeyword.builder().userId(authorId).keyword(result).build());
        log.info("Inserted new user interest keyword for userId: {}", authorId);
      }
    }
  }
}
