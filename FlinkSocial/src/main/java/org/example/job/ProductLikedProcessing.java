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
import org.example.dto.ProductLiked;
import org.example.mapping.MapFunction;
import org.example.sink.ProductLikedSink;

public class ProductLikedProcessing {
  private static final String PRODUCT_LIKED = "cdc.public.product_liked";
  private final StreamExecutionEnvironment env;

  public ProductLikedProcessing(StreamExecutionEnvironment env) {
    this.env = env;
  }

  public void process() {
    KafkaSource<String> source =
        KafkaSource.<String>builder()
            .setBootstrapServers("broker:29092")
            .setTopics(PRODUCT_LIKED)
            .setGroupId("flink-group")
            .setStartingOffsets(OffsetsInitializer.committedOffsets(OffsetResetStrategy.EARLIEST))
            .setDeserializer(new KafkaMessageDeserializationSchema())
            .build();

    DataStreamSource<String> kafkaLiked =
        env.fromSource(source, WatermarkStrategy.noWatermarks(), "Kafka Product Liked Source")
            .setParallelism(1);

    kafkaLiked
        .map(new MapFunction<ProductLiked>(ProductLiked.class))
        .returns(new TypeHint<OperationDTO<ProductLiked>>() {})
        .filter(opDto -> opDto.getOp() == 'c' || opDto.getOp() == 'u')
        .map(OperationDTO::getData)
        .returns(new TypeHint<ProductLiked>() {})
        .addSink(new ProductLikedSink())
        .name("Kafka Product Liked Sink")
        .setParallelism(1);
  }
}
