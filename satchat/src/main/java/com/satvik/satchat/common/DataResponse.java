package com.satvik.satchat.common;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DataResponse<T> {
  private T data;
}
