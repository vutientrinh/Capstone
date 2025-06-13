package org.example.job;

import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.api.common.typeinfo.TypeHint;
import org.apache.flink.connector.kafka.source.KafkaSource;
import org.apache.flink.connector.kafka.source.enumerator.initializer.OffsetsInitializer;
import org.apache.flink.streaming.api.datastream.DataStreamSource;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.kafka.clients.consumer.OffsetResetStrategy;
import org.example.deserialize.KafkaMessageDeserializationSchema;
import org.example.dto.OperationDTO;
import org.example.dto.Product;
import org.example.mapping.MapFunction;
import org.example.sink.ProductSink;

public class ProductProcessing {
  private static final String PRODUCT_TOPICS = "cdc.public.products";
  private final StreamExecutionEnvironment env;

  public ProductProcessing(StreamExecutionEnvironment env) {
    this.env = env;
  }

  public void process() {
    KafkaSource<String> source =
        KafkaSource.<String>builder()
            .setBootstrapServers("broker:29092")
            .setTopics(PRODUCT_TOPICS)
            .setGroupId("flink-group")
            .setStartingOffsets(OffsetsInitializer.committedOffsets(OffsetResetStrategy.EARLIEST))
            .setDeserializer(new KafkaMessageDeserializationSchema())
            .build();

    DataStreamSource<String> kafkaProduct =
        env.fromSource(source, WatermarkStrategy.noWatermarks(), "Kafka Products Source")
            .setParallelism(1);

    kafkaProduct
        .map(new MapFunction<Product>(Product.class))
        .returns(new TypeHint<OperationDTO<Product>>() {})
        .filter(opDto -> opDto.getOp() == 'c' || opDto.getOp() == 'u')
        .map(OperationDTO::getData)
        .returns(new TypeHint<Product>() {})
        .addSink(new ProductSink())
        .name("Kafka Products Sink")
        .setParallelism(1);
  }
}
