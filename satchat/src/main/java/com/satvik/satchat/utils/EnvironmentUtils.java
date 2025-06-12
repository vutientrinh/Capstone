package com.satvik.satchat.utils;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@PropertySource("classpath:application.yml")
public class EnvironmentUtils implements EnvironmentAware {
  private static Environment env;

  static {
    System.setProperty("SERVER_PORT", dotenv().get("SERVER_PORT"));
    System.setProperty("SERVER_CONTEXT_PATH", dotenv().get("SERVER_CONTEXT_PATH"));
    System.setProperty("POSTGRES_URL", dotenv().get("POSTGRES_URL"));
    System.setProperty("POSTGRES_USER", dotenv().get("POSTGRES_USER"));
    System.setProperty("POSTGRES_PASSWORD", dotenv().get("POSTGRES_PASSWORD"));
    System.setProperty("REDIS_HOST", dotenv().get("REDIS_HOST"));
    System.setProperty("REDIS_PORT", dotenv().get("REDIS_PORT"));
    System.setProperty("REDIS_PASSWORD", dotenv().get("REDIS_PASSWORD"));
    System.setProperty("FRONTEND_URL", dotenv().get("FRONTEND_URL"));
    System.setProperty("MINIO_ENDPOINT", dotenv().get("MINIO_ENDPOINT"));
    System.setProperty("MINIO_PORT", dotenv().get("MINIO_PORT"));
    System.setProperty("MINIO_ACCESS_KEY", dotenv().get("MINIO_ACCESS_KEY"));
    System.setProperty("MINIO_SECRET_KEY", dotenv().get("MINIO_SECRET_KEY"));
    System.setProperty("MINIO_SECURE", dotenv().get("MINIO_SECURE"));
    System.setProperty("MINIO_BUCKET_NAME", dotenv().get("MINIO_BUCKET_NAME"));
    System.setProperty("GHN_URL", dotenv().get("GHN_URL"));
    System.setProperty("GHN_TOKEN", dotenv().get("GHN_TOKEN"));
    System.setProperty("GHN_SHOPID", dotenv().get("GHN_SHOPID"));
    System.setProperty("MINIO_ACCESS_URL", dotenv().get("MINIO_ACCESS_URL"));
    System.setProperty("SPRINGAI_URL_POSTS", dotenv().get("SPRINGAI_URL_POSTS"));
    System.setProperty("SPRINGAI_URL_PRODUCTS", dotenv().get("SPRINGAI_URL_PRODUCTS"));
    System.setProperty("SEMANTIC_SEARCH_URL", dotenv().get("SEMANTIC_SEARCH_URL"));
    System.setProperty("GOOGLE_CLIENT_ID", dotenv().get("GOOGLE_CLIENT_ID"));
    System.setProperty("GOOGLE_CLIENT_SECRET", dotenv().get("GOOGLE_CLIENT_SECRET"));
    System.setProperty("SMTP_HOST", dotenv().get("SMTP_HOST"));
    System.setProperty("SMTP_PORT", dotenv().get("SMTP_PORT"));
    System.setProperty("SMTP_USERNAME", dotenv().get("SMTP_USERNAME"));
    System.setProperty("SMTP_PASSWORD", dotenv().get("SMTP_PASSWORD"));
    System.setProperty("BASE_URL", dotenv().get("BASE_URL"));
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
