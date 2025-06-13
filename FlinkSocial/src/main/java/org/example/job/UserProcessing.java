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
import org.example.dto.User;
import org.example.mapping.MapFunction;
import org.example.sink.UserSink;
import org.example.utils.HttpHelper;

public class UserProcessing {
  private static final String USER_TOPICS = "cdc.public.users";
  private final StreamExecutionEnvironment env;
  private final HttpHelper httpHelper;

  public UserProcessing(StreamExecutionEnvironment env, HttpHelper httpHelper) {
    this.env = env;
    this.httpHelper = httpHelper;
  }

  public void process() {
    KafkaSource<String> source =
        KafkaSource.<String>builder()
            .setBootstrapServers("broker:29092")
            .setTopics(USER_TOPICS)
            .setGroupId("flink-group")
            .setStartingOffsets(OffsetsInitializer.committedOffsets(OffsetResetStrategy.EARLIEST))
            .setDeserializer(new KafkaMessageDeserializationSchema())
            .build();

    DataStreamSource<String> kafkaUsers =
        env.fromSource(source, WatermarkStrategy.noWatermarks(), "Kafka Users Source")
            .setParallelism(1);

    kafkaUsers
        .map(new MapFunction<User>(User.class))
        .returns(new TypeHint<OperationDTO<User>>() {})
        .filter(opDto -> opDto.getOp() == 'c' || opDto.getOp() == 'u')
        .map(OperationDTO::getData)
        .returns(new TypeHint<User>() {})
        .addSink(new UserSink())
        .name("Kafka Users Sink")
        .setParallelism(1);
  }
}
