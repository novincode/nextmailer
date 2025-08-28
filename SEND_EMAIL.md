# Send Generic Email API Documentation

## Overview

The Send Generic Email API allows you to send custom emails through the NextMailer system using the LayoutTemplate. This endpoint is protected and requires proper authentication, making it perfect for server-to-server email sending.

## Endpoint

```
POST /api/send_email
```

## Authentication

This endpoint is protected by an API guard. You must include the API guard key in the `Authorization` header:

```
Authorization: Bearer YOUR_API_GUARD_KEY
```

Replace `YOUR_API_GUARD_KEY` with the actual key provided by the NextMailer administrator.

## Request Format

Send a POST request with JSON body containing the following parameters:

### Required Parameters

- **`to`** (string | string[]): Email address(es) of the recipient(s)
- **`subject`** (string): Email subject line
- **`content`** (string): The main content of the email (supports HTML)

### Optional Parameters

- **`previewText`** (string): Preview text shown in email clients
- **`heading`** (string): Main heading for the email
- **`footerText`** (string): Custom footer text
- **`logoUrl`** (string): URL to custom logo image
- **`subscriberId`** (string): Internal subscriber ID for tracking
- **`campaignId`** (string): Campaign ID for analytics
- **`darkMode`** (boolean): Use dark theme for the email
- **`language`** ('en' | 'fa'): Language for the email ('en' for English, 'fa' for Persian/Farsi)
- **`from`** (string): Custom sender email address
- **`cc`** (string | string[]): CC recipients
- **`bcc`** (string | string[]): BCC recipients
- **`replyTo`** (string): Reply-to email address

## Request Examples

### Basic Email (English)

```bash
curl -X POST https://your-domain.com/api/send_email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_GUARD_KEY" \
  -d '{
    "to": "user@example.com",
    "subject": "Welcome to Our Service",
    "content": "<p>Thank you for joining us! We are excited to have you on board.</p><p>Here are some tips to get started:</p><ul><li>Complete your profile</li><li>Explore our features</li><li>Contact support if needed</li></ul>"
  }'
```

### Rich Email with Custom Styling

```bash
curl -X POST https://your-domain.com/api/send_email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_GUARD_KEY" \
  -d '{
    "to": "user@example.com",
    "subject": "Your Order Confirmation",
    "content": "<h2>Order #12345 Confirmed</h2><p>Thank you for your purchase! Here are the details:</p><div style=\"background-color: #f5f5f5; padding: 15px; border-radius: 5px;\"><strong>Items:</strong><br>• Product A - $29.99<br>• Product B - $15.50<br><strong>Total: $45.49</strong></div><p>Your order will be shipped within 2-3 business days.</p>",
    "previewText": "Your order has been confirmed",
    "heading": "Order Confirmation",
    "footerText": "Thank you for shopping with us!"
  }'
```

### Persian/Farsi Email

```bash
curl -X POST https://your-domain.com/api/send_email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_GUARD_KEY" \
  -d '{
    "to": "user@example.com",
    "subject": "خوش آمدید",
    "content": "<p>از پیوستن شما به ما سپاسگزاریم! ما هیجان‌زده هستیم که شما را در تیم خود داریم.</p><p>برای شروع می‌توانید:</p><ul><li>پروفایل خود را کامل کنید</li><li>امکانات ما را بررسی کنید</li><li>در صورت نیاز با پشتیبانی تماس بگیرید</li></ul>",
    "language": "fa",
    "heading": "خوش آمدید",
    "footerText": "از انتخاب شما سپاسگزاریم"
  }'
```

### Minimal Headless Email

```bash
curl -X POST https://your-domain.com/api/send_email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_GUARD_KEY" \
  -d '{
    "to": "customer@example.com",
    "subject": "Order Update",
    "content": "<p>Your order has been shipped!</p><p>Tracking: 1Z999AA1234567890</p>",
    "showFooter": false
  }'
```

This creates a clean email with just your content, no footer or unsubscribe link.

### JavaScript/Node.js Example

```javascript
const response = await fetch('https://your-domain.com/api/send_email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.API_GUARD_KEY}`
  },
  body: JSON.stringify({
    to: 'user@example.com',
    subject: 'Welcome!',
    content: '<p>Thank you for joining us!</p>',
    heading: 'Welcome Aboard',
    language: 'en',
    darkMode: false
  })
});

const result = await response.json();
console.log(result);
```

### Python Example

```python
import requests
import json

url = "https://your-domain.com/api/send_email"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_guard_key}"
}

data = {
    "to": "user@example.com",
    "subject": "Welcome Email",
    "content": "<p>Thank you for signing up!</p>",
    "heading": "Welcome!",
    "language": "en"
}

response = requests.post(url, headers=headers, data=json.dumps(data))
result = response.json()
print(result)
```

### PHP Example

```php
<?php
$url = 'https://your-domain.com/api/send_email';
$apiKey = 'YOUR_API_GUARD_KEY';

$data = [
    'to' => 'user@example.com',
    'subject' => 'Welcome Email',
    'content' => '<p>Thank you for joining us!</p>',
    'heading' => 'Welcome Aboard',
    'language' => 'en'
];

$headers = [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
echo json_encode($result, JSON_PRETTY_PRINT);
?>
```

## Content Formatting

The `content` field supports HTML formatting. You can use:

- **Paragraphs**: `<p>Your text here</p>`
- **Headings**: `<h1>`, `<h2>`, `<h3>`, etc.
- **Lists**: `<ul><li>Item 1</li><li>Item 2</li></ul>`
- **Links**: `<a href="https://example.com">Link Text</a>`
- **Images**: `<img src="https://example.com/image.jpg" alt="Description">`
- **Tables**: Full table structures
- **Inline Styles**: `<div style="color: red;">Styled text</div>`

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "id": "email_message_id_from_resend"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message description"
}
```

## Error Codes

- **400 Bad Request**: Missing required fields (`to`, `subject`, or `content`)
- **401 Unauthorized**: Invalid or missing API guard key
- **500 Internal Server Error**: Server-side error while sending email

## Common Error Messages

- `"Missing required fields: 'to', 'subject', and 'content' are required"`
- `"Unauthorized"`
- `"API configuration error"`
- `"Internal server error"`

## Security Considerations

1. **Keep API Key Secure**: Never expose your API guard key in client-side code or public repositories
2. **Use HTTPS**: Always make requests over HTTPS to protect the API key in transit
3. **Validate Content**: Sanitize HTML content to prevent XSS attacks
4. **Rate Limiting**: Implement rate limiting on your end to prevent abuse
5. **Monitor Usage**: Monitor API usage for suspicious activity

## Email Templates

The generic emails use the LayoutTemplate with:

- **Headless Design**: Full control over footer, unsubscribe, and branding
- **English Support**: Clean, professional design
- **Persian/Farsi Support**: RTL layout with proper font support
- **Dark/Light Themes**: Automatic theme detection or manual override
- **Mobile Responsive**: Optimized for all screen sizes
- **Rich HTML Content**: Support for tables, images, links, and formatting
- **Optional Elements**: Show/hide footer, unsubscribe link, and custom branding

## Rate Limits

Be aware of potential rate limits imposed by:
- Your email service provider (Resend)
- Your server infrastructure
- NextMailer's built-in protections

## Use Cases

This API is perfect for:

- **Transactional Emails**: Order confirmations, receipts, shipping updates
- **Marketing Emails**: Newsletters, promotions, announcements
- **Notification Emails**: Account alerts, password resets, security notices
- **Welcome Emails**: Onboarding sequences, account activation
- **Custom Communications**: Any email your application needs to send

## Support

For issues or questions about this API:
1. Check the error messages in responses
2. Verify your API key is correct and properly formatted
3. Ensure all required parameters are included
4. Contact the NextMailer administrator for assistance

## Environment Variables

Make sure the NextMailer instance has these environment variables configured:

- `API_GUARD_KEY`: Your API guard key (keep this secret!)
- `RESEND_API_KEY`: Resend email service API key
- `NEXT_PUBLIC_APP_NAME`: Your application name
- `NEXT_PUBLIC_APP_URL`: Your application URL

---

**Note**: This API is designed for server-to-server communication. Never use this endpoint directly from client-side code as it would expose your API key.</content>
<parameter name="filePath">/Users/shayanmoradi/Desktop/Work/nextmailer/SEND_EMAIL.md
