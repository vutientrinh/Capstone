package org.example.sink;

import java.io.Serializable;
import org.apache.flink.streaming.api.functions.sink.SinkFunction;
import org.example.dto.User;
import org.example.utils.HttpHelper;

public class UserSink implements SinkFunction<User>, Serializable {
  private static final long serialVersionUID = 1L;
  private static final String URL = "http://host.docker.internal:8180/api/get-user";
  private final transient HttpHelper httpHelper;

  public UserSink() {
    this.httpHelper = new HttpHelper();
  }

  @Override
  public void invoke(User user, Context context) {
    try {
      String json = user.toJson();
      System.out.println("JSON: " + json);
      HttpHelper.postJson(URL, json);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
