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
import org.example.dto.PostSaved;
import org.example.mapping.MapFunction;
import org.example.sink.PostSavedSink;

public class PostSavedProcessing {
  private static final String POST_SAVED = "cdc.public.post_saved";
  private final StreamExecutionEnvironment env;

  public PostSavedProcessing(StreamExecutionEnvironment env) {
    this.env = env;
  }

  public void process() {
    KafkaSource<String> source =
        KafkaSource.<String>builder()
            .setBootstrapServers("broker:29092")
            .setTopics(POST_SAVED)
            .setGroupId("flink-group")
            .setStartingOffsets(OffsetsInitializer.committedOffsets(OffsetResetStrategy.EARLIEST))
            .setDeserializer(new KafkaMessageDeserializationSchema())
            .build();

    DataStreamSource<String> kafkaSaved =
        env.fromSource(source, WatermarkStrategy.noWatermarks(), "Kafka Post Saved Source")
            .setParallelism(1);

    kafkaSaved
        .map(new MapFunction<PostSaved>(PostSaved.class))
        .returns(new TypeHint<OperationDTO<PostSaved>>() {})
        .filter(opDto -> opDto.getOp() == 'c' || opDto.getOp() == 'u')
        .map(OperationDTO::getData)
        .returns(new TypeHint<PostSaved>() {})
        .addSink(new PostSavedSink())
        .name("Kafka Post Saved Sink")
        .setParallelism(1);
  }
}
