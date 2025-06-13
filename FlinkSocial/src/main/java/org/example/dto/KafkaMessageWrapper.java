package org.example.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class KafkaMessageWrapper<T> implements Serializable {
  private Object schema;
  private PayloadDTO<T> payload;
}
