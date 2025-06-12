package com.satvik.satchat.controller;

import com.satvik.satchat.model.Enum.PaymentStatus;
import com.satvik.satchat.service.OrderService;
import com.satvik.satchat.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.UUID;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@CrossOrigin(origins = "*")
public class VNPayController {
  private final VNPayService vnPayService;
  private final OrderService orderService;

  public VNPayController(VNPayService vnPayService, OrderService orderService) {
    this.vnPayService = vnPayService;
    this.orderService = orderService;
  }

  @GetMapping("/vnpay-payment")
  public String GetMapping(HttpServletRequest request, Model model) {
    int paymentStatus = vnPayService.orderReturn(request);

    String orderInfo = request.getParameter("vnp_OrderInfo");
    String paymentTime = request.getParameter("vnp_PayDate");
    String transactionId = request.getParameter("vnp_TransactionNo");
    String totalPrice = request.getParameter("vnp_Amount");

    model.addAttribute("orderId", orderInfo);
    model.addAttribute("totalPrice", totalPrice);
    model.addAttribute("paymentTime", paymentTime);
    model.addAttribute("transactionId", transactionId);

    if (paymentStatus == 1) {
      orderService.updatePayment(UUID.fromString(orderInfo), transactionId, PaymentStatus.SUCCESS);
      return "ordersuccess";
    } else {
      orderService.updatePayment(UUID.fromString(orderInfo), transactionId, PaymentStatus.FAILED);
      return "orderfail";
    }
  }
}
