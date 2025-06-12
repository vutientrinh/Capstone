package com.satvik.satchat.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductFilter {
  private FilterCriteria filters;
  private SortCriteria sort;

  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class FilterCriteria {
    private String search;
    private String category;
    private String minPrice;
    private String maxPrice;
    private Integer rating; // 0–5
    private Boolean inStock;
  }

  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @Builder
  public static class SortCriteria {
    private String field;
    private String direction; // asc or desc
  }
}
