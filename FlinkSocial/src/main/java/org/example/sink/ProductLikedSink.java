package org.example.sink;

import java.io.Serializable;
import org.apache.flink.streaming.api.functions.sink.SinkFunction;
import org.example.dto.ProductLiked;
import org.example.utils.HttpHelper;

public class ProductLikedSink implements SinkFunction<ProductLiked>, Serializable {
  private static final long serialVersionUID = 1L;
  private static final String URL = "http://host.docker.internal:8180/api/liked-product";
  private final transient HttpHelper httpHelper;

  public ProductLikedSink() {
    this.httpHelper = new HttpHelper();
  }

  @Override
  public void invoke(ProductLiked liked, Context context) {
    try {
      String json = liked.toJson();
      System.out.println("JSON: " + json);
      HttpHelper.postJson(URL, json);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
