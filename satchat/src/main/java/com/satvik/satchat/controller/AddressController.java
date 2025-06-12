package com.satvik.satchat.controller;

import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.payload.product.AddressRequest;
import com.satvik.satchat.service.AddressService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/address")
@CrossOrigin(origins = "*")
public class AddressController {
  private final AddressService addressService;

  public AddressController(AddressService addressService) {
    this.addressService = addressService;
  }

  @PostMapping("/create")
  public ResponseEntity<?> createAddress(@Valid @RequestBody AddressRequest request) {
    return ResponseEntity.ok(DataResponse.builder().data(addressService.create(request)).build());
  }

  @GetMapping("/all")
  public ResponseEntity<?> getAllAddress(
      @RequestParam(value = "page", required = false, defaultValue = "1") int page,
      @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
    return ResponseEntity.ok(
        DataResponse.builder().data(addressService.getAllAddress(page, size)).build());
  }

  @PutMapping("/update/{id}")
  public ResponseEntity<?> updateAddress(
      @PathVariable("id") UUID id, @Valid @RequestBody AddressRequest request) {
    return ResponseEntity.ok(
        DataResponse.builder().data(addressService.update(id, request)).build());
  }

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<?> deleteAddress(@PathVariable("id") UUID id) {
    addressService.delete(id);
    return ResponseEntity.ok(DataResponse.builder().data(true).build());
  }

  @PostMapping("/set-default/{id}")
  public ResponseEntity<?> setDefaultAddress(@PathVariable("id") UUID id) {
    return ResponseEntity.ok(
        DataResponse.builder().data(addressService.setDefaultAddress(id)).build());
  }
}
