package com.satvik.satchat.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.satvik.satchat.mapper.GhnResponseMapper;
import com.satvik.satchat.payload.order.ghn.EstimateFee;
import com.satvik.satchat.payload.order.ghn.ShippingOrder;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GHNService {
  @Value("${ghn.url}")
  private String GHN_URL;

  @Value("${ghn.token}")
  private String GHN_TOKEN;

  @Value("${ghn.shopId}")
  private String GHN_SHOPID;

  private final ObjectMapper objectMapper = new ObjectMapper();
  private final GhnResponseMapper ghnResponseMapper;

  public GHNService(GhnResponseMapper ghnResponseMapper) {
    this.ghnResponseMapper = ghnResponseMapper;
  }

  // api/shipping/ghn/shops: get all shops
  public List<Map<String, Object>> getShops() {
    RestTemplate restTemplate = new RestTemplate();

    HttpHeaders headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    headers.set("Token", GHN_TOKEN);

    HttpEntity<String> entity = new HttpEntity<>(headers);

    ResponseEntity<Map<String, Object>> response =
        restTemplate.exchange(
            GHN_URL + "/shop/all",
            HttpMethod.GET,
            entity,
            new ParameterizedTypeReference<Map<String, Object>>() {});

    if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
      Map<String, Object> responseBody = response.getBody();
      Object data = responseBody.get("data");
      if (data instanceof Map) {
        Map<String, Object> dataMap = (Map<String, Object>) data;
        Object shops = dataMap.get("shops");
        if (shops instanceof List) {
          return (List<Map<String, Object>>) shops;
        }
      }
    }
    return Collections.emptyList();
  }

  // api/shipping/ghn/create: create order
  public Object createOrder(ShippingOrder shippingOrder) throws JsonProcessingException {
    if (shippingOrder == null) {
      return Collections.emptyMap();
    }

    Map<String, Object> orderData =
        objectMapper.convertValue(shippingOrder, new TypeReference<Map<String, Object>>() {});

    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Token", GHN_TOKEN);

    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(orderData, headers);

    ResponseEntity<String> response =
        restTemplate.exchange(
            GHN_URL + "/shipping-order/create", HttpMethod.POST, entity, String.class);

    if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
      return objectMapper.readValue(
          response.getBody(), new TypeReference<Map<String, Object>>() {});
    }
    return Collections.emptyMap();
  }

  // api/shipping/ghn/update: update order
  // api/shipping/ghn/detail: get order detail
  public Object getOrderDetail(String orderCode) throws JsonProcessingException {
    if (orderCode == null || orderCode.isEmpty()) {
      return Collections.emptyMap();
    }

    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Token", GHN_TOKEN);

    // raw-data
    Map<String, String> requestBody = new HashMap<>();
    requestBody.put("order_code", orderCode);
    String jsonBody = objectMapper.writeValueAsString(requestBody);

    HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

    ResponseEntity<String> response =
        restTemplate.exchange(
            GHN_URL + "/shipping-order/detail", HttpMethod.POST, entity, String.class);

    if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
      return objectMapper.readValue(
          response.getBody(), new TypeReference<Map<String, Object>>() {});
    }
    return Collections.emptyMap();
  }

  // api/shipping/ghn/cancel: cancel order
  public Object cancelOrder(List<String> orderCode) throws JsonProcessingException {
    if (orderCode == null || orderCode.isEmpty()) {
      return Collections.emptyMap();
    }

    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Token", GHN_TOKEN);
    headers.set("shop_id", GHN_SHOPID);

    // raw-data
    Map<String, List<String>> requestBody = new HashMap<>();
    requestBody.put("order_codes", orderCode);
    String jsonBody = objectMapper.writeValueAsString(requestBody);
    HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

    ResponseEntity<String> response =
        restTemplate.exchange(
            GHN_URL + "/switch-status/cancel", HttpMethod.POST, entity, String.class);

    if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
      return objectMapper.readValue(
          response.getBody(), new TypeReference<Map<String, Object>>() {});
    }
    return Collections.emptyMap();
  }

  // api/shipping/ghn/leadtime: get lead time for a specific order
  // api/shipping/ghn/preview: preview order information without creating an order
  public Object previewOrder(ShippingOrder shippingOrder) throws JsonProcessingException {
    if (shippingOrder == null) {
      return Collections.emptyMap();
    }

    Map<String, Object> orderData =
        objectMapper.convertValue(shippingOrder, new TypeReference<Map<String, Object>>() {});

    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Token", GHN_TOKEN);

    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(orderData, headers);

    ResponseEntity<String> response =
        restTemplate.exchange(
            GHN_URL + "/shipping-order/preview", HttpMethod.POST, entity, String.class);

    if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
      return objectMapper.readValue(
          response.getBody(), new TypeReference<Map<String, Object>>() {});
    }
    return Collections.emptyMap();
  }

  // api/shipping/ghn/fee: estimate shipping fee
  public Object getEstimateFee(EstimateFee estimateFee) throws JsonProcessingException {
    if (estimateFee == null) {
      return Collections.emptyMap();
    }

    Map<String, Object> estimateInfo =
        objectMapper.convertValue(estimateFee, new TypeReference<Map<String, Object>>() {});

    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Token", GHN_TOKEN);

    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(estimateInfo, headers);
    ResponseEntity<String> response =
        restTemplate.exchange(
            GHN_URL + "/shipping-order/fee", HttpMethod.POST, entity, String.class);

    if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
      return objectMapper.readValue(
          response.getBody(), new TypeReference<Map<String, Object>>() {});
    }
    return Collections.emptyMap();
  }

  // api/shipping/ghn/soc: shipping by order_code
  public Object getShippingByOrderCode(String orderCode) throws JsonProcessingException {
    if (orderCode == null || orderCode.isEmpty()) {
      return Collections.emptyMap();
    }

    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Token", GHN_TOKEN);

    // raw-data
    Map<String, String> requestBody = new HashMap<>();
    requestBody.put("order_code", orderCode);
    requestBody.put("shop_id", GHN_SHOPID);
    String jsonBody = objectMapper.writeValueAsString(requestBody);

    HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);
    ResponseEntity<String> response =
        restTemplate.exchange(
            GHN_URL + "/shipping-order/soc", HttpMethod.POST, entity, String.class);

    if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
      return objectMapper.readValue(
          response.getBody(), new TypeReference<Map<String, Object>>() {});
    }
    return Collections.emptyMap();
  }

  // /gen-token
  public Object genCodeToPrint(String orderCode) throws JsonProcessingException {
    if (orderCode == null || orderCode.isEmpty()) {
      return Collections.emptyMap();
    }

    RestTemplate restTemplate = new RestTemplate();
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Token", GHN_TOKEN);

    // raw-data
    Map<String, Object> requestBody = new HashMap<>();
    requestBody.put("order_codes", Collections.singletonList(orderCode));
    String jsonBody = objectMapper.writeValueAsString(requestBody);

    HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);
    ResponseEntity<String> response =
        restTemplate.exchange(GHN_URL + "/a5/gen-token", HttpMethod.POST, entity, String.class);

    if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
      return objectMapper.readValue(
          response.getBody(), new TypeReference<Map<String, Object>>() {});
    }
    return Collections.emptyMap();
  }
}
