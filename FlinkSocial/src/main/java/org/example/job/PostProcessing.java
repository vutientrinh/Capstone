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
import org.example.dto.Post;
import org.example.mapping.MapFunction;
import org.example.sink.PostSink;

public class PostProcessing {
  private static final String POST_TOPICS = "cdc.public.post";
  private final StreamExecutionEnvironment env;

  public PostProcessing(StreamExecutionEnvironment env) {
    this.env = env;
  }

  public void process() {
    KafkaSource<String> source =
        KafkaSource.<String>builder()
            .setBootstrapServers("broker:29092")
            .setTopics(POST_TOPICS)
            .setGroupId("flink-group")
            .setStartingOffsets(OffsetsInitializer.committedOffsets(OffsetResetStrategy.EARLIEST))
            .setDeserializer(new KafkaMessageDeserializationSchema())
            .build();

    DataStreamSource<String> kafkaPost =
        env.fromSource(source, WatermarkStrategy.noWatermarks(), "Kafka Post Source")
            .setParallelism(1);

    kafkaPost
        .map(new MapFunction<Post>(Post.class))
        .returns(new TypeHint<OperationDTO<Post>>() {})
        .filter(opDto -> opDto.getOp() == 'c' || opDto.getOp() == 'u')
        .map(OperationDTO::getData)
        .returns(new TypeHint<Post>() {})
        .addSink(new PostSink())
        .name("Kafka Post Sink")
        .setParallelism(1);
  }
}
