package com.satvik.satchat.config.redis;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.satvik.satchat.listeners.redis.*;
import com.satvik.satchat.mapper.NotificationMapper;
import com.satvik.satchat.mapper.PostMapper;
import com.satvik.satchat.repository.*;
import com.satvik.satchat.service.NotificationService;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jmx.JmxAutoConfiguration;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import redis.clients.jedis.JedisPool;

@Configuration
@EnableCaching
@EnableAutoConfiguration(exclude = {JmxAutoConfiguration.class})
public class CacheConfig {

  private static final String[] LIST_CACHE = {
    "cache", "post:list", "post:detail", "product:list", "product:detail", "comment:list"
  };
  private static final Map<String, String> CACHE_TOPIC =
      new HashMap<>() {
        {
          put("cache", "cache_topic");
          put("follow", "follow_count"); // count, notification
          put("unfollow", "unfollow_count");
          put("like", "like_count"); // count, notification
          put("unlike", "unlike_count");
          put("post-create", "post_create");
          put("post-delete", "post_delete");
          put("comment-liked", "comment_liked"); // count, notification
          put("comment-unliked", "comment_unliked");
          put("comment-create", "comment_create"); // count, notification
          put("comment-delete", "comment_delete");
          put("friend-request", "friend_request"); // notification
          put("friend-accept", "friend_accept"); // count, notification
          put("unfriend", "unfriend");
        }
      };
  private final SimpMessagingTemplate messagingTemplate;
  private final ObjectMapper objectMapper;
  private final NotificationService notificationService;
  private final NotificationRepository notificationRepository;
  private final NotificationMapper notificationMapper;
  private final UserRepository userRepository;
  private final PostRepository postRepository;
  private final CommentRepository commentRepository;
  private final CommentLikedRepository commentLikedRepository;
  private final PostMapper postMapper;

  @Value("${redis.host}")
  private String redisHost;

  @Value("${redis.port}")
  private int redisPort;

  @Value("${redis.password}")
  private String redisPassword;

  public CacheConfig(
      NotificationService notificationService,
      NotificationRepository notificationRepository,
      NotificationMapper notificationMapper,
      UserRepository userRepository,
      PostRepository postRepository,
      PostMapper postMapper,
      SimpMessagingTemplate messagingTemplate,
      ObjectMapper objectMapper,
      CommentRepository commentRepository,
      CommentLikedRepository commentLikedRepository) {
    this.notificationService = notificationService;
    this.notificationRepository = notificationRepository;
    this.notificationMapper = notificationMapper;
    this.userRepository = userRepository;
    this.postRepository = postRepository;
    this.postMapper = postMapper;
    this.messagingTemplate = messagingTemplate;
    this.objectMapper = objectMapper;
    this.commentRepository = commentRepository;
    this.commentLikedRepository = commentLikedRepository;
  }

  @Bean
  public JedisPool jedisPool() {
    return new JedisPool(redisHost, redisPort, null, redisPassword);
  }

  @Bean
  public RedisConnectionFactory redisConnectionFactory() {
    RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
    redisStandaloneConfiguration.setHostName(redisHost);
    redisStandaloneConfiguration.setPort(redisPort);
    redisStandaloneConfiguration.setPassword(redisPassword);

    return new JedisConnectionFactory(redisStandaloneConfiguration);
  }

  @Bean
  public RedisTemplate<String, Object> redisTemplate(
      RedisConnectionFactory redisConnectionFactory) {
    RedisTemplate<String, Object> template = new RedisTemplate<>();
    template.setConnectionFactory(redisConnectionFactory);
    template.setKeySerializer(new StringRedisSerializer());
    template.setValueSerializer(new GenericJackson2JsonRedisSerializer(objectMapper));
    return template;
  }

  @Bean
  public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.registerModule(new JavaTimeModule());
    objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    objectMapper.activateDefaultTyping(
        LaissezFaireSubTypeValidator.instance,
        ObjectMapper.DefaultTyping.NON_FINAL,
        JsonTypeInfo.As.PROPERTY);

    GenericJackson2JsonRedisSerializer serializer =
        new GenericJackson2JsonRedisSerializer(objectMapper);
    RedisCacheConfiguration defaultCacheConfig =
        RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofHours(24))
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(serializer));
    RedisCacheManager.RedisCacheManagerBuilder builder =
        RedisCacheManager.builder(redisConnectionFactory).cacheDefaults(defaultCacheConfig);

    for (String cacheName : LIST_CACHE) {
      builder.withCacheConfiguration(cacheName, defaultCacheConfig);
    }
    return builder.build();
  }

  @Bean
  public RedisMessageListenerContainer container(RedisConnectionFactory connectionFactory) {
    RedisMessageListenerContainer container = new RedisMessageListenerContainer();
    container.setConnectionFactory(connectionFactory);
    container.addMessageListener(cacheAdapter(), cacheTopic());
    container.addMessageListener(likedAdapter(), likedTopic());
    container.addMessageListener(unlikedAdapter(), unlikedTopic());
    container.addMessageListener(followAdapter(), followTopic());
    container.addMessageListener(unfollowAdapter(), unfollowTopic());
    container.addMessageListener(postCreateAdapter(), postCreateTopic());
    container.addMessageListener(postDeleteAdapter(), postDeleteTopic());
    container.addMessageListener(commentLikedAdapter(), commentLikedTopic());
    container.addMessageListener(commentUnlikedAdapter(), commentUnlikedTopic());
    container.addMessageListener(commentCreateAdapter(), commentCreateTopic());
    container.addMessageListener(commentDeleteAdapter(), commentDeleteTopic());
    container.addMessageListener(friendRequestAdapter(), friendRequestTopic());
    container.addMessageListener(friendAcceptAdapter(), friendAcceptTopic());
    container.addMessageListener(unfriendAdapter(), unfriendTopic());
    return container;
  }

  @Bean
  public MessageListenerAdapter cacheAdapter() {
    return new MessageListenerAdapter(new CacheSubscriber(), "onMessage");
  }

  @Bean
  public MessageListenerAdapter likedAdapter() {
    return new MessageListenerAdapter(
        new LikedSubscriber(
            notificationService,
            notificationRepository,
            notificationMapper,
            userRepository,
            postRepository,
            postMapper,
            messagingTemplate),
        "onMessage");
  }

  @Bean
  public MessageListenerAdapter unlikedAdapter() {
    return new MessageListenerAdapter(
        new UnLikedSubscriber(postRepository, postMapper, messagingTemplate), "onMessage");
  }

  @Bean
  public MessageListenerAdapter followAdapter() {
    return new MessageListenerAdapter(
        new FollowSubscriber(
            notificationService,
            notificationRepository,
            notificationMapper,
            userRepository,
            messagingTemplate),
        "onMessage");
  }

  @Bean
  public MessageListenerAdapter unfollowAdapter() {
    return new MessageListenerAdapter(
        new UnFollowSubscriber(userRepository, messagingTemplate), "onMessage");
  }

  @Bean
  public MessageListenerAdapter postCreateAdapter() {
    return new MessageListenerAdapter(
        new PostCreateSubscriber(postRepository, userRepository, postMapper, messagingTemplate),
        "onMessage");
  }

  @Bean
  public MessageListenerAdapter postDeleteAdapter() {
    return new MessageListenerAdapter(
        new PostDeleteSubscriber(postRepository, userRepository, postMapper, messagingTemplate),
        "onMessage");
  }

  @Bean
  public MessageListenerAdapter commentLikedAdapter() {
    return new MessageListenerAdapter(
        new CommentLikedSubscriber(
            commentLikedRepository,
            commentRepository,
            notificationService,
            notificationRepository,
            notificationMapper,
            userRepository,
            postRepository,
            postMapper,
            messagingTemplate),
        "onMessage");
  }

  @Bean
  public MessageListenerAdapter commentUnlikedAdapter() {
    return new MessageListenerAdapter(
        new CommentUnLikedSubscriber(
            commentRepository, postRepository, userRepository, postMapper, messagingTemplate),
        "onMessage");
  }

  @Bean
  public MessageListenerAdapter commentCreateAdapter() {
    return new MessageListenerAdapter(
        new CommentCreateSubscriber(
            notificationService,
            notificationRepository,
            notificationMapper,
            userRepository,
            postRepository,
            postMapper,
            messagingTemplate),
        "onMessage");
  }

  @Bean
  public MessageListenerAdapter commentDeleteAdapter() {
    return new MessageListenerAdapter(
        new CommentDeleteSubscriber(postRepository, userRepository, postMapper, messagingTemplate),
        "onMessage");
  }

  @Bean
  public MessageListenerAdapter friendRequestAdapter() {
    return new MessageListenerAdapter(
        new FriendRequestSubscriber(
            notificationService,
            notificationRepository,
            notificationMapper,
            userRepository,
            messagingTemplate),
        "onMessage");
  }

  @Bean
  public MessageListenerAdapter friendAcceptAdapter() {
    return new MessageListenerAdapter(
        new FriendAcceptSubscriber(
            notificationService,
            notificationRepository,
            notificationMapper,
            userRepository,
            messagingTemplate),
        "onMessage");
  }

  @Bean
  public MessageListenerAdapter unfriendAdapter() {
    return new MessageListenerAdapter(
        new UnFriendSubscriber(userRepository, messagingTemplate), "onMessage");
  }

  @Bean
  public ChannelTopic cacheTopic() {
    return new ChannelTopic(CACHE_TOPIC.get("cache"));
  }

  @Bean
  public ChannelTopic likedTopic() {
    return new ChannelTopic(CACHE_TOPIC.get("like"));
  }

  @Bean
  public ChannelTopic unlikedTopic() {
    return new ChannelTopic(CACHE_TOPIC.get("unlike"));
  }

  @Bean
  public ChannelTopic followTopic() {
    return new ChannelTopic(CACHE_TOPIC.get("follow"));
  }

  @Bean
  public ChannelTopic unfollowTopic() {
    return new ChannelTopic(CACHE_TOPIC.get("unfollow"));
  }

  @Bean
  public ChannelTopic postCreateTopic() {
    return new ChannelTopic(CACHE_TOPIC.get("post-create"));
  }

  @Bean
  public ChannelTopic postDeleteTopic() {
    return new ChannelTopic(CACHE_TOPIC.get("post-delete"));
  }

  @Bean
  public ChannelTopic commentLikedTopic() {
    return new ChannelTopic(CACHE_TOPIC.get("comment-liked"));
  }

  @Bean
  public ChannelTopic commentUnlikedTopic() {
    return new ChannelTopic(CACHE_TOPIC.get("comment-unliked"));
  }

  @Bean
  public ChannelTopic commentCreateTopic() {
    return new ChannelTopic(CACHE_TOPIC.get("comment-create"));
  }

  @Bean
  public ChannelTopic commentDeleteTopic() {
    return new ChannelTopic(CACHE_TOPIC.get("comment-delete"));
  }

  @Bean
  public ChannelTopic friendRequestTopic() {
    return new ChannelTopic(CACHE_TOPIC.get("friend-request"));
  }

  @Bean
  public ChannelTopic friendAcceptTopic() {
    return new ChannelTopic(CACHE_TOPIC.get("friend-accept"));
  }

  @Bean
  public ChannelTopic unfriendTopic() {
    return new ChannelTopic(CACHE_TOPIC.get("unfriend"));
  }
}
