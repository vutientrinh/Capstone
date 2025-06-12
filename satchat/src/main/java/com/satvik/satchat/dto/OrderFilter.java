package com.satvik.satchat.dto;

import com.satvik.satchat.model.Enum.OrderStatus;
import java.util.UUID;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderFilter {
  private String search;
  private OrderStatus status;
  private UUID customerId;
}
