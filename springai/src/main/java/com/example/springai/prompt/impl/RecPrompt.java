package com.example.springai.prompt.impl;

import com.example.springai.prompt.RecBuilder;
import org.springframework.stereotype.Component;

@Component
public class RecPrompt implements RecBuilder {

  @Override
  public String buildPostPrompt(String userInput, String postInput) {
    return "Compare the user's keywords with each post's keywords.\n"
        + "If a post shares at least one keyword or topic with the user's keywords, consider it a match.\n"
        + "Return a list of only matching post_id values.\n\n"
        + "Important:\n"
        + "- Respond ONLY with a JSON array of post_id strings. \n"
        + "- No extra text.\n"
        + "- No explanation.\n"
        + "- The output must be pure JSON. For example:\n"
        + "[\"123e4567-e89b-12d3-a456-426614174000\", \"987e6543-e89b-12d3-a456-426614174111\"]\n\n"
        + "User:\n"
        + userInput
        + "Posts:\n"
        + postInput
        + "Your Answer:";
  }

  @Override
  public String buildProductPrompt(String userInput, String productInput) {
    return "Compare the user's keywords with each product's keywords.\n"
        + "If a product shares at least one keyword or topic with the user's keywords, consider it a match.\n"
        + "Return a list of only matching product_id values.\n\n"
        + "Important:\n"
        + "- Respond ONLY with a JSON array of product_id strings. \n"
        + "- No extra text.\n"
        + "- No explanation.\n"
        + "- The output must be pure JSON. For example:\n"
        + "[\"123e4567-e89b-12d3-a456-426614174000\", \"987e6543-e89b-12d3-a456-426614174111\"]\n\n"
        + "User:\n"
        + userInput
        + "Products:\n"
        + productInput
        + "Your Answer:";
  }

  @Override
  public String userPrompt(String userId, String keywords) {
    return "- user_id: " + userId + "\n" + "- keywords: " + keywords + "\n";
  }

  @Override
  public String postPrompt(String postId, String keywords) {
    return "- post_id: " + postId + ", " + "keywords: " + keywords + "\n";
  }

  @Override
  public String productPrompt(String productId, String keywords) {
    return "- product_id: " + productId + ", " + "keywords: " + keywords + "\n";
  }
}
