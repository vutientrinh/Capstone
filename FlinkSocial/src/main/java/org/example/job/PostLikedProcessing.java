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
import org.example.dto.PostLiked;
import org.example.mapping.MapFunction;
import org.example.sink.PostLikedSink;

public class PostLikedProcessing {
  private static final String POST_LIKED = "cdc.public.post_liked";
  private final StreamExecutionEnvironment env;

  public PostLikedProcessing(StreamExecutionEnvironment env) {
    this.env = env;
  }

  public void process() {
    KafkaSource<String> source =
        KafkaSource.<String>builder()
            .setBootstrapServers("broker:29092")
            .setTopics(POST_LIKED)
            .setGroupId("flink-group")
            .setStartingOffsets(OffsetsInitializer.committedOffsets(OffsetResetStrategy.EARLIEST))
            .setDeserializer(new KafkaMessageDeserializationSchema())
            .build();

    DataStreamSource<String> kafkaLiked =
        env.fromSource(source, WatermarkStrategy.noWatermarks(), "Kafka Post Liked Source")
            .setParallelism(1);

    kafkaLiked
        .map(new MapFunction<PostLiked>(PostLiked.class))
        .returns(new TypeHint<OperationDTO<PostLiked>>() {})
        .filter(opDto -> opDto.getOp() == 'c' || opDto.getOp() == 'u')
        .map(OperationDTO::getData)
        .returns(new TypeHint<PostLiked>() {})
        .addSink(new PostLikedSink())
        .name("Kafka Post Liked Sink")
        .setParallelism(1);
  }
}
