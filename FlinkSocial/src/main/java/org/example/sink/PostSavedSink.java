package org.example.sink;

import java.io.Serializable;
import org.apache.flink.streaming.api.functions.sink.SinkFunction;
import org.example.dto.PostSaved;
import org.example.utils.HttpHelper;

public class PostSavedSink implements SinkFunction<PostSaved>, Serializable {
  private static final long serialVersionUID = 1L;
  private static final String URL = "http://host.docker.internal:8180/api/saved-post";
  private final transient HttpHelper httpHelper;

  public PostSavedSink() {
    this.httpHelper = new HttpHelper();
  }

  @Override
  public void invoke(PostSaved postSaved, Context context) {
    try {
      String json = postSaved.toJson();
      System.out.println("JSON: " + json);
      HttpHelper.postJson(URL, json);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
