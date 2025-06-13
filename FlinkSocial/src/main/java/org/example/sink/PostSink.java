package org.example.sink;

import java.io.Serializable;
import org.apache.flink.streaming.api.functions.sink.SinkFunction;
import org.example.dto.Post;
import org.example.utils.HttpHelper;

public class PostSink implements SinkFunction<Post>, Serializable {
  private static final long serialVersionUID = 1L;
  private static final String SPRINGAI_URL = "http://host.docker.internal:8180/api/get-post";
  private static final String SEARCH_URL = "http://host.docker.internal:8000/receive-post";
  private final transient HttpHelper httpHelper;

  public PostSink() {
    this.httpHelper = new HttpHelper();
  }

  @Override
  public void invoke(Post post, Context context) {
    try {
      String json = post.toJson();
      System.out.println("JSON: " + json);
      HttpHelper.postJson(SPRINGAI_URL, json);
      HttpHelper.postJson(SEARCH_URL, json);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
