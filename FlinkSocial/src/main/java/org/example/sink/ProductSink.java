package org.example.sink;

import java.io.Serializable;
import org.apache.flink.streaming.api.functions.sink.SinkFunction;
import org.example.dto.Product;
import org.example.utils.HttpHelper;

public class ProductSink implements SinkFunction<Product>, Serializable {
  private static final long serialVersionUID = 1L;
  private static final String URL = "http://host.docker.internal:8180/api/get-product";
  private final transient HttpHelper httpHelper;

  public ProductSink() {
    this.httpHelper = new HttpHelper();
  }

  @Override
  public void invoke(Product product, SinkFunction.Context context) {
    try {
      String json = product.toJson();
      System.out.println("JSON: " + json);
      HttpHelper.postJson(URL, json);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
