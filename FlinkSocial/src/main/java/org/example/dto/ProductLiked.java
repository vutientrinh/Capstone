package org.example.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductLiked {
  private UUID id;

  @JsonProperty("created_at")
  private String createdAt;

  @JsonProperty("updated_at")
  private String updatedAt;

  private UUID author;
  private UUID product;

  public String toJson() {
    return String.format(
        "{\"id\":\"%s\",\"created_at\":\"%s\",\"updated_at\":\"%s\",\"author\":\"%s\",\"product\":\"%s\"}",
        id, createdAt, updatedAt, author, product);
  }
}
