package com.satvik.satchat.payload.admin;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopCustomer {
  private String name;
  private String email;
  private long purchases;
  private BigDecimal totalSpent;
}
