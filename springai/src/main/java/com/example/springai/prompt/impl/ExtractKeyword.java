package com.example.springai.prompt.impl;

import com.example.springai.prompt.PromptBuilder;
import org.springframework.stereotype.Component;

@Component
public class ExtractKeyword implements PromptBuilder {
  String extract_prompt =
      "Extract main keywords from this text. Return only a JSON array [\"keyword1\", \"keyword2\", ...]\n"
          + "Only use words/phrases from the original text. Don't translate or add new terms.\n"
          + "Keep the original language and remove duplicates.\n\n"
          + "Content:\n";

  @Override
  public String buildPrompt(String input) {
    return extract_prompt + input;
  }
}
