# Send OTP Email API Documentation

## Overview

The Send OTP API allows you to send one-time password (OTP) verification emails through the NextMailer system. This endpoint is protected and requires proper authentication.

## Endpoint

```
POST /api/send_otp
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

- **`to`** (string): Email address of the recipient
- **`otpCode`** (string): The OTP code to send (e.g., "123456")

### Optional Parameters

- **`recipientName`** (string): Name of the recipient for personalization
- **`title`** (string): Custom title for the email (default: "Your Verification Code")
- **`description`** (string): Custom description text
- **`buttonText`** (string): Text for the verification button (default: "Verify Code")
- **`expiryMinutes`** (number): Minutes until code expires (default: 10)
- **`showFooter`** (boolean): Show/hide footer section (default: false for headless)
- **`showUnsubscribe`** (boolean): Show/hide unsubscribe link (default: false for OTP)
- **`customFooter`** (string): Custom footer HTML content
- **`previewText`** (string): Custom preview text for email clients
- **`logoUrl`** (string): Custom logo URL
- **`footerText`** (string): Custom footer text
- **`unsubscribeUrl`** (string): Custom unsubscribe URL

## Request Examples

### Basic OTP Email (English)

```bash
curl -X POST https://your-domain.com/api/send_otp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_GUARD_KEY" \
  -d '{
    "to": "user@example.com",
    "otpCode": "123456"
  }'
```

### Minimal Headless OTP Email

```bash
curl -X POST https://your-domain.com/api/send_otp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_GUARD_KEY" \
  -d '{
    "to": "user@example.com",
    "otpCode": "123456",
    "showFooter": false
  }'
```

This creates a clean OTP email with just the code and expiry time, no greeting, footer, or unsubscribe link.

### Persian/Farsi OTP Email (Headless)

```bash
curl -X POST https://your-domain.com/api/send_otp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_GUARD_KEY" \
  -d '{
    "to": "user@example.com",
    "otpCode": "123456",
    "title": "کد بازیابی رمز عبور",
    "description": "برای بازنشانی رمز عبور از این کد استفاده کنید",
    "language": "fa",
    "showFooter": false,
    "previewText": "کد بازیابی رمز عبور"
  }'
```

### JavaScript/Node.js Example (Headless)

```javascript
const response = await fetch('https://your-domain.com/api/send_otp', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.API_GUARD_KEY}`
  },
  body: JSON.stringify({
    to: 'user@example.com',
    otpCode: '123456',
    title: 'کد بازیابی رمز عبور',
    description: 'برای بازنشانی رمز عبور از این کد استفاده کنید',
    language: 'fa',
    showFooter: false,
    previewText: 'کد بازیابی رمز عبور'
  })
});

const result = await response.json();
console.log(result);
```

### Python Example

```python
import requests
import json

url = "https://your-domain.com/api/send_otp"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_guard_key}"
}

data = {
    "to": "user@example.com",
    "otpCode": "123456",
    "recipientName": "John Doe",
    "language": "en",
    "expiryMinutes": 10
}

response = requests.post(url, headers=headers, data=json.dumps(data))
result = response.json()
print(result)
```

### PHP Example

```php
<?php
$url = 'https://your-domain.com/api/send_otp';
$apiKey = 'YOUR_API_GUARD_KEY';

$data = [
    'to' => 'user@example.com',
    'otpCode' => '123456',
    'recipientName' => 'John Doe',
    'language' => 'en',
    'expiryMinutes' => 10
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

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "OTP email sent successfully",
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

- **400 Bad Request**: Missing required fields (`to` or `otpCode`)
- **401 Unauthorized**: Invalid or missing API guard key
- **500 Internal Server Error**: Server-side error while sending email

## Common Error Messages

- `"Missing required fields: 'to' and 'otpCode' are required"`
- `"Unauthorized"`
- `"API configuration error"`
- `"Internal server error"`

## Security Considerations

1. **Keep API Key Secure**: Never expose your API guard key in client-side code or public repositories
2. **Use HTTPS**: Always make requests over HTTPS to protect the API key in transit
3. **Validate OTP Codes**: Always validate OTP codes on your server before granting access
4. **Rate Limiting**: Implement rate limiting on your end to prevent abuse
5. **Monitor Usage**: Monitor API usage for suspicious activity

## Email Templates

The OTP emails use responsive HTML templates with:

- **Headless Design**: Minimal, clean layout with optional footer and unsubscribe
- **English Support**: Clean, professional design
- **Persian/Farsi Support**: RTL layout with proper font support
- **Dark/Light Themes**: Automatic theme detection or manual override
- **Mobile Responsive**: Optimized for all screen sizes
- **Customizable Content**: Full control over title, description, and styling
- **Optional Elements**: Show/hide footer, unsubscribe link, and custom content

## Rate Limits

Be aware of potential rate limits imposed by:
- Your email service provider (Resend)
- Your server infrastructure
- NextMailer's built-in protections

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
<parameter name="filePath">/Users/shayanmoradi/Desktop/Work/nextmailer/SEND_OTP.md
