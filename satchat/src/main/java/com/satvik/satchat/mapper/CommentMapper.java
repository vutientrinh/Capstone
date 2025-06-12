package com.satvik.satchat.mapper;

import com.satvik.satchat.entity.SocialNetwork.CommentEntity;
import com.satvik.satchat.payload.comment.CommentLikedResponse;
import com.satvik.satchat.payload.comment.CommentResponse;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class CommentMapper {

  private final ModelMapper modelMapper = new ModelMapper();

  public <D, T> D map(T entity, Class<D> outClass) {
    try {
      return modelMapper.map(entity, outClass);
    } catch (Exception e) {
      log.error("Error in mapping {} to {}", entity, outClass, e);
      return null;
    }
  }

  public CommentResponse toCommentResponse(CommentEntity comment) {
    return CommentResponse.builder()
        .id(comment.getId())
        .authorId(comment.getAuthor().getId())
        .postId(comment.getPost().getId())
        .content(comment.getContent())
        .likedCount(comment.getLikedCount())
        .status(comment.getStatus())
        .author(
            CommentResponse.author
                .builder()
                .id(comment.getAuthor().getId())
                .username(comment.getAuthor().getUsername())
                .firstName(comment.getAuthor().getFirstName())
                .lastName(comment.getAuthor().getLastName())
                .avatar(comment.getAuthor().getAvatar())
                .build())
        .build();
  }

  public CommentLikedResponse toCommentLikedResponse(CommentEntity comment, Boolean hasLiked) {
    return CommentLikedResponse.builder()
        .id(comment.getId())
        .authorId(comment.getAuthor().getId())
        .postId(comment.getPost().getId())
        .content(comment.getContent())
        .likedCount(comment.getLikedCount())
        .hasLiked(hasLiked)
        .status(comment.getStatus())
        .author(
            CommentResponse.author
                .builder()
                .id(comment.getAuthor().getId())
                .username(comment.getAuthor().getUsername())
                .firstName(comment.getAuthor().getFirstName())
                .lastName(comment.getAuthor().getLastName())
                .avatar(comment.getAuthor().getAvatar())
                .build())
        .build();
  }
}
