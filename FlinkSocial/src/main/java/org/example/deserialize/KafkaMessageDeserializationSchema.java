package org.example.deserialize;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import org.apache.flink.api.common.typeinfo.TypeInformation;
import org.apache.flink.connector.kafka.source.reader.deserializer.KafkaRecordDeserializationSchema;
import org.apache.flink.util.Collector;
import org.apache.kafka.clients.consumer.ConsumerRecord;

public class KafkaMessageDeserializationSchema implements KafkaRecordDeserializationSchema<String> {
  private static final long serialVersionUID = 1L;
  private final ObjectMapper objectMapper;

  public KafkaMessageDeserializationSchema() {
    this.objectMapper = new ObjectMapper();
    this.objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
  }

  @Override
  public void deserialize(ConsumerRecord<byte[], byte[]> record, Collector<String> out)
      throws JsonProcessingException {
    if (record.value() == null) return;
    String jsonString = new String(record.value(), StandardCharsets.UTF_8);
    JsonNode rootNode = objectMapper.readTree(jsonString);

    String jsonMessage = objectMapper.writeValueAsString(rootNode);
    System.out.println("[INFO] msg: " + jsonMessage);
    try {
      out.collect(jsonMessage);
    } catch (Exception e) {
      System.out.println("[ERROR] Failed to deserialize message: " + e.getMessage());
      e.printStackTrace();
    }
  }

  @Override
  public TypeInformation<String> getProducedType() {
    return TypeInformation.of(String.class);
  }
}
