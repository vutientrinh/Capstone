package org.example.sink;

import java.io.Serializable;
import org.apache.flink.streaming.api.functions.sink.SinkFunction;
import org.example.dto.PostLiked;
import org.example.utils.HttpHelper;

public class PostLikedSink implements SinkFunction<PostLiked>, Serializable {
  private static final long serialVersionUID = 1L;
  private static final String URL = "http://host.docker.internal:8180/api/liked-post";
  private final transient HttpHelper httpHelper;

  public PostLikedSink() {
    this.httpHelper = new HttpHelper();
  }

  @Override
  public void invoke(PostLiked liked, Context context) {
    try {
      String json = liked.toJson();
      System.out.println("JSON: " + json);
      HttpHelper.postJson(URL, json);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
