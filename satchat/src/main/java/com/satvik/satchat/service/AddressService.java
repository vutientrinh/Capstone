package com.satvik.satchat.service;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.common.PageResponse;
import com.satvik.satchat.entity.Ecommerce.AddressEntity;
import com.satvik.satchat.entity.UserEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.mapper.UserMapper;
import com.satvik.satchat.payload.product.AddressRequest;
import com.satvik.satchat.payload.product.AddressResponse;
import com.satvik.satchat.payload.user.UserProfileResponse;
import com.satvik.satchat.repository.AddressRepository;
import com.satvik.satchat.repository.UserRepository;
import com.satvik.satchat.security.service.UserDetailsImpl;
import com.satvik.satchat.utils.JwtUtils;
import jakarta.transaction.Transactional;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AddressService {
  private final AddressRepository addressRepository;
  private final UserRepository userRepository;
  private final UserMapper userMapper;
  private final JwtUtils jwtUtils;

  public AddressService(
      AddressRepository addressRepository,
      UserRepository userRepository,
      UserMapper userMapper,
      JwtUtils jwtUtils) {
    this.addressRepository = addressRepository;
    this.userRepository = userRepository;
    this.userMapper = userMapper;
    this.jwtUtils = jwtUtils;
  }

  // Add methods to interact with the address repository as needed
  // For example, you can add methods to save, update, delete, or retrieve addresses
  @Transactional
  public AddressResponse create(AddressRequest request) {
    UserEntity author =
        userRepository
            .findById(request.getUserId())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    // check have deafult address
    Optional<AddressEntity> defaultAddress =
        addressRepository.checkHaveDefaultAddress(author.getId());
    AddressEntity address =
        AddressEntity.builder()
            .id(UUID.randomUUID())
            .user(author)
            .phone(request.getPhone())
            .address(request.getAddress())
            .wardCode(request.getWardCode())
            .wardName(request.getWardName())
            .districtId(request.getDistrictId())
            .districtName(request.getDistrictName())
            .provinceId(request.getProvinceId())
            .provinceName(request.getProvinceName())
            .isDefault(defaultAddress.isEmpty() ? true : false)
            .build();
    addressRepository.save(address);

    return AddressResponse.builder()
        .id(address.getId())
        .user(userMapper.map(author, UserProfileResponse.class))
        .phone(address.getPhone())
        .address(address.getAddress())
        .wardCode(address.getWardCode())
        .wardName(address.getWardName())
        .districtId(address.getDistrictId())
        .districtName(address.getDistrictName())
        .provinceId(address.getProvinceId())
        .provinceName(address.getProvinceName())
        .isDefault(address.getIsDefault())
        .build();
  }

  @Transactional
  public AddressResponse update(UUID addressId, AddressRequest request) {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity currentUser =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    AddressEntity address =
        addressRepository
            .findById(addressId)
            .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_EXISTED));

    if (!address.getUser().getId().equals(currentUser.getId())) {
      throw new AppException(ErrorCode.ADDRESS_NOT_BELONG_TO_USER);
    }

    address.setPhone(request.getPhone());
    address.setAddress(request.getAddress());
    address.setWardCode(request.getWardCode());
    address.setWardName(request.getWardName());
    address.setDistrictId(request.getDistrictId());
    address.setDistrictName(request.getDistrictName());
    address.setProvinceId(request.getProvinceId());
    address.setProvinceName(request.getProvinceName());

    return AddressResponse.builder()
        .id(address.getId())
        .user(userMapper.map(currentUser, UserProfileResponse.class))
        .phone(address.getPhone())
        .address(address.getAddress())
        .wardCode(address.getWardCode())
        .wardName(address.getWardName())
        .districtId(address.getDistrictId())
        .districtName(address.getDistrictName())
        .provinceId(address.getProvinceId())
        .provinceName(address.getProvinceName())
        .isDefault(address.getIsDefault())
        .build();
  }

  @Transactional
  public void delete(UUID addressId) {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity currentUser =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    AddressEntity address =
        addressRepository
            .findById(addressId)
            .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_EXISTED));

    if (!address.getUser().getId().equals(currentUser.getId())) {
      throw new AppException(ErrorCode.ADDRESS_NOT_BELONG_TO_USER);
    }

    addressRepository.deleteByUserAndAddress(currentUser, address);
  }

  public PageResponse<AddressResponse> getAllAddress(int page, int size) {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity currentUser =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    if (page < 1 || size <= 0) {
      throw new AppException(ErrorCode.INVALID_PAGINATION_PARAMS);
    }
    Sort sort = Sort.by("createdAt").descending();
    Pageable pageable = PageRequest.of(page - 1, size, sort);
    var address = addressRepository.findAllByUserId(currentUser.getId(), pageable);
    return PageResponse.<AddressResponse>builder()
        .currentPage(page)
        .pageSize(address.getSize())
        .totalPages(address.getTotalPages())
        .totalElements(address.getTotalElements())
        .data(
            address.getContent().stream()
                .map(
                    item ->
                        AddressResponse.builder()
                            .id(item.getId())
                            .user(userMapper.map(currentUser, UserProfileResponse.class))
                            .phone(item.getPhone())
                            .address(item.getAddress())
                            .wardCode(item.getWardCode())
                            .wardName(item.getWardName())
                            .districtId(item.getDistrictId())
                            .districtName(item.getDistrictName())
                            .provinceId(item.getProvinceId())
                            .provinceName(item.getProvinceName())
                            .isDefault(item.getIsDefault())
                            .build())
                .toList())
        .build();
  }

  @Transactional
  public AddressResponse setDefaultAddress(UUID addressId) {
    UserDetailsImpl userDetails = jwtUtils.getUserDetailsFromJwtToken();
    log.info("User details: {}", userDetails);

    UserEntity currentUser =
        userRepository
            .findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    AddressEntity address =
        addressRepository
            .findById(addressId)
            .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_EXISTED));

    if (!address.getUser().getId().equals(currentUser.getId())) {
      throw new AppException(ErrorCode.ADDRESS_NOT_BELONG_TO_USER);
    }

    // Set all addresses to not default
    addressRepository.setAllAddressesToNotDefault(currentUser.getId());

    // Set the selected address to default
    address.setIsDefault(true);
    addressRepository.save(address);

    return AddressResponse.builder()
        .id(address.getId())
        .user(userMapper.map(currentUser, UserProfileResponse.class))
        .phone(address.getPhone())
        .address(address.getAddress())
        .wardCode(address.getWardCode())
        .wardName(address.getWardName())
        .districtId(address.getDistrictId())
        .districtName(address.getDistrictName())
        .provinceId(address.getProvinceId())
        .provinceName(address.getProvinceName())
        .isDefault(address.getIsDefault())
        .build();
  }
}
