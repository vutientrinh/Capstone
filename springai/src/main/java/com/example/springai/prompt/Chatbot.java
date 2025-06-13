package com.example.springai.prompt;

public interface Chatbot {
  String buildPrompt(String input, String question);

  String contentPolicy(String input);
}
