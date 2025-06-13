package com.example.springai.service;

import com.example.springai.entity.PostKeyword;
import com.example.springai.entity.ProductKeyword;
import com.example.springai.entity.UserInterestKeyword;
import com.example.springai.prompt.Chatbot;
import com.example.springai.prompt.impl.RecPrompt;
import com.example.springai.repository.PostKeywordRepository;
import com.example.springai.repository.ProductKeywordRepository;
import com.example.springai.repository.UserInterestKeywordRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class RecService {
  private final PostKeywordRepository postKeywordRepository;
  private final ProductKeywordRepository productKeywordRepository;
  private final UserInterestKeywordRepository userInterestKeywordRepository;
  private final RecPrompt recPrompt;
  private final Chatbot chatbot;

  public RecService(
      PostKeywordRepository postKeywordRepository,
      ProductKeywordRepository productKeywordRepository,
      UserInterestKeywordRepository userInterestKeywordRepository,
      RecPrompt recPrompt,
      Chatbot chatbot) {
    this.postKeywordRepository = postKeywordRepository;
    this.productKeywordRepository = productKeywordRepository;
    this.userInterestKeywordRepository = userInterestKeywordRepository;
    this.recPrompt = recPrompt;
    this.chatbot = chatbot;
  }

  public String buildPostPrompt(String userId) {
    List<PostKeyword> lstPostKeywords = postKeywordRepository.findAll();
    Optional<UserInterestKeyword> author = userInterestKeywordRepository.findByUserId(userId);

    if (lstPostKeywords.size() > 0) {
      String userInp = recPrompt.userPrompt(userId, "[]");
      if (author.isPresent()) {
        userInp = recPrompt.userPrompt(userId, author.get().getKeyword());
      }
      String postInp = "";
      for (PostKeyword postKeyword : lstPostKeywords) {
        if (postKeyword.getPostId() != null && postKeyword.getKeyword() != null) {
          postInp += recPrompt.postPrompt(postKeyword.getPostId(), postKeyword.getKeyword());
        }
      }

      return recPrompt.buildPostPrompt(userInp, postInp);
    }
    return null;
  }

  public String buildProductPrompt(String userId) {
    List<ProductKeyword> lstProductKeywords = productKeywordRepository.findAll();
    Optional<UserInterestKeyword> author = userInterestKeywordRepository.findByUserId(userId);

    if (lstProductKeywords.size() > 0) {
      String userInp = recPrompt.userPrompt(userId, "[]");
      if (author.isPresent()) {
        userInp = recPrompt.userPrompt(userId, author.get().getKeyword());
      }
      String productInp = "";
      for (ProductKeyword productKeyword : lstProductKeywords) {
        if (productKeyword.getProductId() != null && productKeyword.getKeyword() != null) {
          productInp +=
              recPrompt.productPrompt(productKeyword.getProductId(), productKeyword.getKeyword());
        }
      }

      return recPrompt.buildProductPrompt(userInp, productInp);
    }
    return null;
  }

  public String buildChatBotPrompt(String userId, String question) {
    Optional<UserInterestKeyword> author = userInterestKeywordRepository.findByUserId(userId);
    String userInp = recPrompt.userPrompt(userId, "[]");
    if (author.isPresent()) {
      userInp = recPrompt.userPrompt(userId, author.get().getKeyword());
    }
    return chatbot.buildPrompt(userInp, question);
  }

  public String buildContentPolicy(String input) {
    return chatbot.contentPolicy(input);
  }
}
