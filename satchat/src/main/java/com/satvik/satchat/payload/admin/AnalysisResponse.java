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
public class AnalysisResponse {
  private long totalOrders;
  private BigDecimal successRate;
  private long sellingProducts;
  private long totalProducts;
  private BigDecimal revenue;
  private long revenueGeneratingProducts;
  private long totalCustomers;
  private long totalCompletedOrders;
  private orderStatus orderStatus;
  private productStatus productStatus;

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class orderStatus {
    private long pending;
    private long shipped;
    private long delivered;
    private long failed;
    private long cancelled;
  }

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class productStatus {
    private long selling;
    private long hidden;
    private long outOfStock;
    private long sold;
  }
}
