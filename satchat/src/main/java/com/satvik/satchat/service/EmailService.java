package com.satvik.satchat.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

  private final JavaMailSender mailSender;
  private final TemplateEngine templateEngine;

  @Autowired
  public EmailService(JavaMailSender mailSender, TemplateEngine templateEngine) {
    this.mailSender = mailSender;
    this.templateEngine = templateEngine;
  }

  public void sendNewPasswordEmail(String to, String username, String newPassword)
      throws MessagingException {
    Context context = new Context();
    context.setVariable("username", username);
    context.setVariable("newPassword", newPassword);

    String htmlContent = templateEngine.process("reset-password", context);
    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

    helper.setTo(to);
    helper.setSubject("Password Recovery - Connected");
    helper.setText(htmlContent, true);
    helper.setFrom("stephenduizz3101@gmail.com");

    mailSender.send(message);
  }
}
