package com.example.springai.utils;

import com.example.springai.dto.Contents;
import com.example.springai.dto.Parts;
import com.example.springai.dto.Prompt;
import com.example.springai.prompt.impl.ExtractKeyword;
import com.example.springai.service.RecService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class RequestUtils {
  private final ExtractKeyword extractKeyword;
  private final RecService recService;

  public RequestUtils(ExtractKeyword extractKeyword, RecService recService) {
    this.extractKeyword = extractKeyword;
    this.recService = recService;
  }

  public Prompt bodyExtractKeywords(Parts parts) {
    Prompt prompt = new Prompt();
    Contents contents = new Contents();

    List<Contents> contentsList = new ArrayList<>();
    List<Parts> partsList = new ArrayList<>();

    // processing parts
    parts.setText(extractKeyword.buildPrompt(parts.getText()));
    partsList.add(parts);

    contents.setParts(partsList);

    contentsList.add(contents);
    prompt.setContents(contentsList);
    return prompt;
  }

  public Prompt bodyRecPost(String userId) {
    Prompt prompt = new Prompt();
    Contents contents = new Contents();

    List<Contents> contentsList = new ArrayList<>();
    List<Parts> partsList = new ArrayList<>();

    // processing parts
    Parts parts = new Parts();
    parts.setText(recService.buildPostPrompt(userId));
    partsList.add(parts);

    contents.setParts(partsList);

    contentsList.add(contents);
    prompt.setContents(contentsList);
    return prompt;
  }

  public Prompt bodyRecProduct(String userId) {
    Prompt prompt = new Prompt();
    Contents contents = new Contents();

    List<Contents> contentsList = new ArrayList<>();
    List<Parts> partsList = new ArrayList<>();

    // processing parts
    Parts parts = new Parts();
    parts.setText(recService.buildProductPrompt(userId));
    partsList.add(parts);

    contents.setParts(partsList);

    contentsList.add(contents);
    prompt.setContents(contentsList);
    return prompt;
  }

  public Prompt bodyChatBot(String userId, String question) {
    Prompt prompt = new Prompt();
    Contents contents = new Contents();

    List<Contents> contentsList = new ArrayList<>();
    List<Parts> partsList = new ArrayList<>();

    // processing parts
    Parts parts = new Parts();
    parts.setText(recService.buildChatBotPrompt(userId, question));
    partsList.add(parts);

    contents.setParts(partsList);

    contentsList.add(contents);
    prompt.setContents(contentsList);
    return prompt;
  }

  public Prompt bodyContentPolicy(String question) {
    Prompt prompt = new Prompt();
    Contents contents = new Contents();

    List<Contents> contentsList = new ArrayList<>();
    List<Parts> partsList = new ArrayList<>();

    // processing parts
    Parts parts = new Parts();
    parts.setText(recService.buildContentPolicy(question));
    partsList.add(parts);

    contents.setParts(partsList);

    contentsList.add(contents);
    prompt.setContents(contentsList);
    return prompt;
  }
}
