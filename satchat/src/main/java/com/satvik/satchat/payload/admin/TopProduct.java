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
public class TopProduct {
  private String name;
  private String category;
  private long sold;
  private BigDecimal revenue;
}
