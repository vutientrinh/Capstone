package com.satvik.satchat.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.satvik.satchat.common.DataResponse;
import com.satvik.satchat.model.Enum.MessageType;
import com.satvik.satchat.payload.order.ghn.EstimateFee;
import com.satvik.satchat.payload.order.ghn.ShippingOrder;
import com.satvik.satchat.service.GHNService;
import com.satvik.satchat.service.TestService;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping(
    value = "/api/test",
    produces = {"application/json; charset=UTF-8"})
public class TestController {

  private final MessageSource messageSource;
  private final TestService testService;
  private final GHNService ghnService;
  private final SimpMessagingTemplate messagingTemplate;

  public TestController(
      TestService testService,
      MessageSource messageSource,
      GHNService ghnService,
      SimpMessagingTemplate messagingTemplate) {
    this.testService = testService;
    this.messageSource = messageSource;
    this.ghnService = ghnService;
    this.messagingTemplate = messagingTemplate;
  }

  @GetMapping("/all")
  public String allAccess() {
    return "Public Content.";
  }

  @GetMapping("/user")
  @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
  public String userAccess() {
    return "User Content.";
  }

  @GetMapping("/admin")
  @PreAuthorize("hasRole('ADMIN')")
  public String adminAccess() {
    return "Admin Board.";
  }

  @GetMapping("/cache")
  public ResponseEntity<?> cache() {
    return ResponseEntity.ok(testService.saveCache());
  }

  @GetMapping("/pubsub")
  public ResponseEntity<?> pubsub() {
    testService.testPubSub();
    return ResponseEntity.ok("Published message to cache_topic");
  }

  @GetMapping("/locale")
  public String locale(
      @RequestHeader(value = "Accept-Language", required = false) String language) {
    Locale locale = (language != null) ? Locale.forLanguageTag(language) : Locale.getDefault();
    return messageSource.getMessage("GREETING", null, locale);
  }

  @PostMapping("/socket")
  public String socket() {
    Map<String, String> obj = new HashMap<>();
    obj.put("message", "Socket test");
    obj.put("messageType", String.valueOf(MessageType.LIKE_COUNT));
    messagingTemplate.convertAndSend("/topic/notifications", obj);
    return "Socket test";
  }

  @GetMapping("/get-shop")
  public ResponseEntity<?> getShops() {
    return ResponseEntity.ok(DataResponse.builder().data(ghnService.getShops()).build());
  }

  @PostMapping("/create-order")
  public ResponseEntity<?> createOrder(@RequestBody ShippingOrder shippingOrder)
      throws JsonProcessingException {
    return ResponseEntity.ok(ghnService.createOrder(shippingOrder));
  }

  @PostMapping("/get-detail")
  public ResponseEntity<?> getDetail(@RequestParam("orderCode") String orderCode)
      throws JsonProcessingException {
    return ResponseEntity.ok(ghnService.getOrderDetail(orderCode));
  }

  @PostMapping("/preview-order")
  public ResponseEntity<?> previewOrder(@RequestBody ShippingOrder shippingOrder)
      throws JsonProcessingException {
    return ResponseEntity.ok(ghnService.previewOrder(shippingOrder));
  }

  @PostMapping("/cancel-order")
  public ResponseEntity<?> cancelOrder(@RequestBody Map<String, List<String>> requestBody)
      throws JsonProcessingException {
    List<String> orderCode = requestBody.get("orderCode");
    return ResponseEntity.ok(ghnService.cancelOrder(orderCode));
  }

  @PostMapping("/shipping-fee")
  public ResponseEntity<?> getShippingByOrderCode(@RequestParam("orderCode") String orderCode)
      throws JsonProcessingException {
    return ResponseEntity.ok(ghnService.getShippingByOrderCode(orderCode));
  }

  @PostMapping("/estimate-shipping-fee")
  public ResponseEntity<?> estimateShippingFee(@Valid @RequestBody EstimateFee estimateFee)
      throws JsonProcessingException {
    return ResponseEntity.ok(ghnService.getEstimateFee(estimateFee));
  }
}
