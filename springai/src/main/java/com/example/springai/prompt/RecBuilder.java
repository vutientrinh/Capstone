package com.example.springai.prompt;

public interface RecBuilder {
  String buildPostPrompt(String userInput, String postInput);

  String buildProductPrompt(String userInput, String productInput);

  String userPrompt(String userId, String keywords);

  String postPrompt(String postId, String keywords);

  String productPrompt(String productId, String keywords);
}
