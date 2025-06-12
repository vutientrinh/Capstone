package com.satvik.satchat.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.satvik.satchat.mapper.CartMapper;
import com.satvik.satchat.payload.order.request.LineItemRequest;
import com.satvik.satchat.payload.product.LineItemResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class CartService {
  private final RedisTemplate<String, Object> redisTemplate;
  private final CartMapper cartMapper;
  private final ObjectMapper objectMapper;
  private final ProductService productService;

  public CartService(
      RedisTemplate<String, Object> redisTemplate,
      CartMapper cartMapper,
      ObjectMapper objectMapper,
      ProductService productService) {
    this.redisTemplate = redisTemplate;
    this.cartMapper = cartMapper;
    this.objectMapper = objectMapper;
    this.productService = productService;
  }

  private String getCartKey(String userId) {
    return "cart:user:" + userId;
  }

  public List<LineItemResponse> addToCart(String userId, LineItemRequest item) {
    productService.outOfStock(item.getProductId(), item.getQuantity());
    String key = getCartKey(userId);
    Object data = redisTemplate.opsForValue().get(key);
    List<LineItemRequest> currentItems = this.getMapping(data);
    if (currentItems == null) currentItems = new ArrayList<>();
    Optional<LineItemRequest> existing =
        currentItems.stream().filter(i -> i.getProductId().equals(item.getProductId())).findFirst();

    if (existing.isPresent()) {
      LineItemRequest existingItem = existing.get();
      int updatedQuantity = existingItem.getQuantity() + item.getQuantity();

      if (updatedQuantity > 0) {
        existingItem.setQuantity(updatedQuantity);
      } else {
        currentItems.remove(existingItem);
      }
    } else {
      if (item.getQuantity() > 0) {
        currentItems.add(item);
      }
    }

    redisTemplate.opsForValue().set(key, currentItems);
    return cartMapper.toCart(currentItems);
  }

  public List<LineItemResponse> getCartItems(String userId) {
    String key = getCartKey(userId);
    Object data = redisTemplate.opsForValue().get(key);
    List<LineItemRequest> lineItems = this.getMapping(data);

    return cartMapper.toCart(lineItems) != null ? cartMapper.toCart(lineItems) : new ArrayList<>();
  }

  public void clearCart(String userId) {
    redisTemplate.delete(getCartKey(userId));
  }

  public List<LineItemRequest> getMapping(Object data) {
    List<LineItemRequest> lineItems = new ArrayList<>();
    if (data instanceof List<?>) {
      for (Object item : (List<?>) data) {
        LineItemRequest lineItem = objectMapper.convertValue(item, LineItemRequest.class);
        lineItems.add(lineItem);
      }
    }
    return lineItems;
  }
}
