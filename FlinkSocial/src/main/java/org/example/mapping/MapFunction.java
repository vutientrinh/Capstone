package org.example.mapping;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.dto.OperationDTO;

public class MapFunction<T>
    implements org.apache.flink.api.common.functions.MapFunction<String, OperationDTO<T>> {
  private static final ObjectMapper objectMapper = new ObjectMapper();
  private final Class<T> clazz;

  public MapFunction(Class<T> clazz) {
    this.clazz = clazz;
  }

  @Override
  public OperationDTO<T> map(String wrapper) throws Exception {
    JsonNode root = objectMapper.readTree(wrapper);
    JsonNode payloadNode = root.get("payload");

    JsonNode beforeNode = payloadNode.get("before");
    JsonNode afterNode = payloadNode.get("after");
    Character op = payloadNode.get("op").asText().charAt(0);

    T before =
        (beforeNode != null && !beforeNode.isNull())
            ? objectMapper.treeToValue(beforeNode, clazz)
            : null;

    T after =
        (afterNode != null && !afterNode.isNull())
            ? objectMapper.treeToValue(afterNode, clazz)
            : null;

    T obj = (after != null) ? after : before;
    return new OperationDTO<T>(op, (T) obj);
  }
}
