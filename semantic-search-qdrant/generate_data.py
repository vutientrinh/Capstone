# Re-import required modules after execution state reset
import json

data = []

categories = {
    "Billing Issue": [
        ("I was charged twice for my subscription.", "We apologize for the inconvenience. We have refunded the duplicate charge."),
        ("Why is my bill higher than expected?", "Your bill may include additional fees or a price increase. Please check the breakdown in your account."),
        ("I want to update my payment method.", "You can update your payment details in the billing section of your account settings."),
    ],
    "Technical Support": [
        ("My app keeps crashing on startup.", "Try clearing the app cache or reinstalling the app. Let us know if the issue persists."),
        ("The website is not loading properly.", "Please try clearing your browser cache or using a different browser."),
        ("My camera is not working on video calls.", "Ensure that the app has camera permissions enabled in your device settings."),
    ],
    "Account Access": [
        ("I forgot my password and can't reset it.", "You can reset your password using the 'Forgot Password' link. If you need further assistance, contact support."),
        ("My account was locked after multiple login attempts.", "For security reasons, your account is temporarily locked. Please try again in 30 minutes or reset your password."),
        ("Can I change my email address?", "Yes, you can update your email in the account settings. A verification email will be sent."),
    ],
    "Product Inquiry": [
        ("Does this product come with a warranty?", "Yes, this product includes a 1-year manufacturer's warranty."),
        ("What are the dimensions of this item?", "The product dimensions are listed in the specifications section on the product page."),
        ("Is this item available in other colors?", "Yes, this product is available in multiple colors. Please check the available options on the website."),
    ],
    "Refund Request": [
        ("I want to request a refund for my order.", "You can request a refund through your order history. Refunds are processed within 5-7 business days."),
        ("Why was my refund denied?", "Refunds may be denied if the return policy criteria are not met. Please review our return policy."),
        ("Can I get a refund if I used a promo code?", "Refunds are issued for the amount paid after applying the promo code."),
    ],
    "Shipping Delay": [
        ("My order is delayed. When will it arrive?", "We apologize for the delay. You can check the latest tracking updates in your order history."),
        ("Why is my package stuck in transit?", "Shipping delays may occur due to carrier issues. Please allow additional time for delivery."),
        ("Can I expedite my shipping?", "If your order has not yet shipped, you may upgrade to express shipping in your order settings."),
    ],
    "Subscription Cancellation": [
        ("How do I cancel my subscription?", "You can cancel your subscription in your account settings under the 'Subscription' section."),
        ("Will I be charged if I cancel before the renewal date?", "No, if you cancel before your next billing cycle, you will not be charged."),
        ("Can I pause my subscription instead of canceling?", "Yes, we offer a pause option for up to 3 months."),
    ],
    "Order Tracking": [
        ("Where is my package?", "You can track your package using the tracking number provided in your order confirmation."),
        ("My tracking number is not updating.", "Tracking updates may take up to 24 hours. If there's no update after that, contact the carrier."),
        ("Can I change my delivery address after placing the order?", "Once an order is processed, the delivery address cannot be changed. Please contact support for options."),
    ]
}

# Convert the structured data into JSON format
ticket_id = 1000
for category, issues in categories.items():
    for issue, response in issues:
        data.append({
            "ticket_id": f"TKT-{ticket_id}",
            "category": category,
            "customer_issue": issue,
            "resolution_response": response
        })
        ticket_id += 1

# Save dataset as JSON file
json_filename = "customer_support_data.json"
with open(json_filename, "w") as json_file:
    json.dump(data, json_file, indent=4)

json_filename
