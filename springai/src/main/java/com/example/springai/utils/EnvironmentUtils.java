package com.example.springai.utils;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@PropertySource("classpath:application.properties")
public class EnvironmentUtils implements EnvironmentAware {
  private static Environment env;

  static {
    System.setProperty("SERVER_PORT", dotenv().get("SERVER_PORT"));
    System.setProperty("GEMINI_API_KEY", dotenv().get("GEMINI_API_KEY"));
    System.setProperty("REDIS_PASSWORD", dotenv().get("REDIS_PASSWORD"));
    System.setProperty("REDIS_HOST", dotenv().get("REDIS_HOST"));
    System.setProperty("REDIS_PORT", dotenv().get("REDIS_PORT"));
  }

  public static String getEnvironmentValue(String propertyKey) {
    return env.getProperty(propertyKey);
  }

  public static Dotenv dotenv() {
    return Dotenv.configure()
        .directory("./")
        .filename(".env")
        .ignoreIfMalformed()
        .ignoreIfMissing()
        .load();
  }

  @Override
  public void setEnvironment(Environment environment) {
    env = environment;
  }
}
