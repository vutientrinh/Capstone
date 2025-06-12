package com.satvik.satchat.mapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.satvik.satchat.entity.Ecommerce.LineItemEntity;
import com.satvik.satchat.payload.order.ghn.CategoryOrder;
import com.satvik.satchat.payload.order.ghn.ItemOrder;
import com.satvik.satchat.payload.order.ghn.ShippingOrder;
import com.satvik.satchat.payload.order.request.ShippingInfoRequest;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class GhnResponseMapper {

  public static String filterServiceFields(String rawJson) throws Exception {
    ObjectMapper objectMapper = new ObjectMapper();
    JsonNode rootNode = objectMapper.readTree(rawJson);

    // Get metadata
    int code = rootNode.get("code").asInt();
    String message = rootNode.get("message").asText("");
    String codeMessageValue = rootNode.get("code_message_value").asText("");

    // Process "data" array
    List<Map<String, Object>> filteredServices = new ArrayList<>();
    JsonNode dataArray = rootNode.get("data");

    for (JsonNode item : dataArray) {
      Map<String, Object> simplified = new LinkedHashMap<>();
      simplified.put("service_id", item.get("service_id").asInt());
      simplified.put("short_name", item.get("short_name").asText());
      simplified.put("service_type_id", item.get("service_type_id").asInt());
      filteredServices.add(simplified);
    }

    // Construct final result
    Map<String, Object> finalResult = new LinkedHashMap<>();
    finalResult.put("code", code);
    finalResult.put("code_message_value", codeMessageValue);
    finalResult.put("data", filteredServices);
    finalResult.put("message", message);

    return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(finalResult);
  }

  public static ShippingOrder toShippingOrder(
      ShippingInfoRequest shippingInfo, List<LineItemEntity> items) {
    // Default values of shop
    String shop_id = "196276";
    String from_name = "Connected";
    String from_phone = "0364484261";
    String from_address = "484 Lê Văn Việt, Tăng Nhơn Phú A, Thủ Đức";
    String from_ward_name = "Phường Tăng Nhơn Phú A";
    String from_district_name = "TP Thủ Đức";
    String from_province_name = "TP Hồ Chí Minh";

    ShippingOrder shiip =
        ShippingOrder.builder()
            .shopId(Integer.parseInt(shop_id))
            .fromName(from_name)
            .fromPhone(from_phone)
            .fromAddress(from_address)
            .fromWardName(from_ward_name)
            .fromDistrictName(from_district_name)
            .fromProvinceName(from_province_name)
            .toName(shippingInfo.getReceiverName())
            .toPhone(shippingInfo.getReceiverPhone())
            .toAddress(shippingInfo.getAddress())
            .toWardCode(shippingInfo.getWardCode())
            .toDistrictId(shippingInfo.getDistrictId())
            .weight(Integer.parseInt(shippingInfo.getWeight()))
            .serviceId(Integer.parseInt(shippingInfo.getServiceId()))
            .serviceTypeId(Integer.parseInt(shippingInfo.getServiceTypeId()))
            .paymentTypeId(2) // 1. Seller; 2. Buyer
            .requiredNote("CHOXEMHANGKHONGTHU")
            .coupon(null)
            .items(
                items.stream()
                    .map(
                        item ->
                            ItemOrder.builder()
                                .name(item.getProduct().getName())
                                .code(String.valueOf(item.getProduct().getId()))
                                .quantity(item.getQuantity())
                                .price(item.getPrice().intValue())
                                .length(item.getProduct().getLength().intValue())
                                .width(item.getProduct().getWidth().intValue())
                                .height(item.getProduct().getHeight().intValue())
                                .weight(item.getProduct().getWeight().intValue())
                                .category(
                                    CategoryOrder.builder()
                                        .level1(item.getProduct().getCategory().getName())
                                        .build())
                                .build())
                    .toList())
            .build();

    return shiip;
  }
}
