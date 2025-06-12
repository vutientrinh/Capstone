package com.satvik.satchat.service;

import com.satvik.satchat.common.ErrorCode;
import com.satvik.satchat.entity.Ecommerce.LineItemEntity;
import com.satvik.satchat.entity.Ecommerce.OrderEntity;
import com.satvik.satchat.entity.Ecommerce.ProductEntity;
import com.satvik.satchat.handler.AppException;
import com.satvik.satchat.payload.order.request.LineItemRequest;
import com.satvik.satchat.repository.LineItemRepository;
import com.satvik.satchat.repository.OrderRepository;
import com.satvik.satchat.repository.ProductRepository;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@Log4j2
public class LineItemService {
  private final ProductRepository productRepository;
  private final OrderRepository orderRepository;
  private final LineItemRepository lineItemRepository;

  public LineItemService(
      ProductRepository productRepository,
      OrderRepository orderRepository,
      LineItemRepository lineItemRepository) {
    this.productRepository = productRepository;
    this.orderRepository = orderRepository;
    this.lineItemRepository = lineItemRepository;
  }

  public List<LineItemEntity> getLineItemsByOrderId(UUID orderId) {
    return orderRepository
        .findById(orderId)
        .map(order -> order.getItems())
        .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
  }

  @Transactional
  public OrderEntity addLineItemToOrder(UUID orderId, List<LineItemRequest> items) {
    OrderEntity order =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

    // Items
    List<LineItemEntity> lstItems =
        items.stream()
            .map(
                item -> {
                  ProductEntity product =
                      productRepository
                          .findById(item.getProductId())
                          .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
                  return LineItemEntity.builder()
                      .id(UUID.randomUUID())
                      .order(order)
                      .product(product)
                      .quantity(item.getQuantity())
                      .price(item.getPrice())
                      .total(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                      .build();
                })
            .toList();
    lineItemRepository.saveAll(lstItems);

    // update order
    for (LineItemEntity item : lstItems) {
      order.getItems().add(item);
    }
    order.setTotalAmount(
        order
            .getTotalAmount()
            .add(
                lstItems.stream()
                    .map(LineItemEntity::getTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add)));
    // update shipping fee*
    order.setShippingFee(BigDecimal.ZERO);
    // payment cost = shipping fee + total amount
    order.getPayment().setAmountPaid(order.getShippingFee().add(order.getTotalAmount()));
    return orderRepository.save(order);
  }

  @Transactional
  public OrderEntity removeLineItemFromOrder(UUID orderId, UUID lineItemId) {
    OrderEntity order =
        orderRepository
            .findById(orderId)
            .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

    LineItemEntity lineItem =
        lineItemRepository
            .findById(lineItemId)
            .orElseThrow(() -> new AppException(ErrorCode.LINE_ITEM_NOT_FOUND));

    if (!order.getItems().contains(lineItem)) {
      throw new AppException(ErrorCode.LINE_ITEM_NOT_FOUND);
    }

    order.getItems().remove(lineItem);
    lineItem.setOrder(null);

    order.setTotalAmount(order.getTotalAmount().subtract(lineItem.getTotal()));
    // update shipping fee*
    order.setShippingFee(BigDecimal.ZERO);
    // payment cost = shipping fee + total amount
    order.getPayment().setAmountPaid(order.getShippingFee().add(order.getTotalAmount()));
    return orderRepository.save(order);
  }
}
