package com.example.springai.controller;

import com.example.springai.service.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@Slf4j
public class ProductController {
  private ProductService productService;

  public ProductController(ProductService productService) {
    this.productService = productService;
  }

  @PostMapping("/get-product")
  public String getUser(@RequestBody String json) throws Exception {
    log.info("Inserting product data: {}", json);
    productService.insertProduct(json);
    return "Product data";
  }

  @PostMapping("/liked-product")
  public String getLikedProduct(@RequestBody String json) throws Exception {
    log.info("Liked product data: {}", json);
    productService.setUserKeywords(json);
    return "Liked product data";
  }
}
