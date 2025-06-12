package com.satvik.satchat.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class MinioServiceAspect {

  @Before(value = "execution(* com.satvik.satchat.service.MinioService.*(..))")
  public void beforeAdvice(JoinPoint joinPoint) {
    log.info("* Before MinioService method got called");
  }

  @After(value = "execution(* com.satvik.satchat.service.MinioService.*(..))")
  public void afterAdvice(JoinPoint joinPoint) {
    log.info("* After MinioService method got called");
  }

  @AfterReturning(value = "execution(* com.satvik.satchat.service.MinioService.*(..))")
  public void afterReturningAdvice(JoinPoint joinPoint) {
    log.info("* AfterReturning MinioService method got called");
  }
}
