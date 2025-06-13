package org.example.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class PayloadDTO<T> implements Serializable {
  private T before;
  private T after;
  private Object source;
  private Character op;
}
