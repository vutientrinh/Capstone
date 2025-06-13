package org.example.dto;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OperationDTO<T> implements Serializable {
  private T data;
  private Character op;

  public OperationDTO(Character op, T data) {
    this.op = op;
    this.data = data;
  }
}
