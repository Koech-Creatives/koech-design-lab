# n8n Webhook Setup for Feedback Collection

This guide explains how to set up an n8n webhook to receive feedback from your Koech Design Lab application.

## Quick Setup

1. **Set your webhook URL** in `.env.local`:
   ```
   VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/feedback
   ```

2. **Restart your development server** after updating the environment variable

## n8n Workflow Configuration

### 1. Create a Webhook Trigger

In your n8n workflow, add a **Webhook** trigger node with these settings:

- **HTTP Method**: `POST`
- **Path**: `/feedback` (or your preferred path)
- **Authentication**: None (or configure as needed)
- **Response Mode**: Respond When Last Node Finishes

### 2. Expected Data Format

Your webhook will receive JSON data in this format:

```json
{
  "type": "feature|bug|general",
  "message": "User's feedback text",
  "user": {
    "email": "user@example.com",
    "name": "John Doe",
    "id": "user-uuid"
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "source": "koech-design-lab",
  "version": "0.1.0-beta",
  "platform": "localhost"
}
```

### 3. Sample n8n Workflow Nodes

#### Option A: Send to Email
1. **Webhook Trigger** → **Email Send**
   - To: `support@koechcreatives.com`
   - Subject: `[{{$json["type"].toUpperCase()}}] Feedback from {{$json["user"]["name"]}}`
   - Body: Template with user details and feedback

#### Option B: Save to Database
1. **Webhook Trigger** → **Database Insert**
   - Insert the feedback data into your database
   - Optionally add auto-ID and processing status

#### Option C: Slack/Discord Notification
1. **Webhook Trigger** → **Slack/Discord**
   - Send formatted message to your team channel
   - Include user info and feedback type

### 4. Sample Email Template

```html
<h2>New {{$json["type"].toUpperCase()}} from Koech Design Lab</h2>

<p><strong>From:</strong> {{$json["user"]["name"]}} ({{$json["user"]["email"]}})</p>
<p><strong>Type:</strong> {{$json["type"].toUpperCase()}}</p>
<p><strong>Date:</strong> {{$json["timestamp"]}}</p>
<p><strong>Version:</strong> {{$json["version"]}}</p>

<h3>Message:</h3>
<div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
  {{$json["message"]}}
</div>

<hr>
<p><small>Sent from Koech Design Lab v{{$json["version"]}}</small></p>
```

## Environment Variables

Add to your `.env.local` file:

```env
# n8n Webhook Configuration
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/feedback
```

## Testing the Integration

1. **Start your app**: `npm run dev`
2. **Open settings**: Click user menu → Settings
3. **Submit feedback**: Fill out the form and submit
4. **Check logs**: Look in browser console for webhook success/failure
5. **Verify n8n**: Check your n8n workflow executions

## Troubleshooting

### Common Issues

1. **CORS Error**: Configure your n8n instance to allow requests from your domain
2. **Webhook Not Found**: Verify the webhook URL and path are correct
3. **Authentication Error**: Check if your webhook requires authentication

### Fallback Behavior

- If the webhook fails, feedback is automatically stored in `localStorage`
- Users still see success message even if webhook fails
- Check browser console for error details

### Debug Information

View all feedback (including failed webhooks) by:
1. Opening browser console
2. Going to Settings → "View All Feedback (Console)"
3. Checking the logged feedback data

## Example n8n Workflow JSON

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300],
      "parameters": {
        "path": "feedback",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Send Email",
      "type": "n8n-nodes-base.emailSend",
      "position": [450, 300],
      "parameters": {
        "toEmail": "support@koechcreatives.com",
        "subject": "[{{$json[\"type\"].toUpperCase()}}] Feedback from {{$json[\"user\"][\"name\"]}}",
        "text": "Type: {{$json[\"type\"]}}\nFrom: {{$json[\"user\"][\"name\"]}} ({{$json[\"user\"][\"email\"]}})\nMessage: {{$json[\"message\"]}}"
      }
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Send Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## Security Considerations

1. **Rate Limiting**: Consider adding rate limiting to prevent spam
2. **Validation**: Validate incoming data in your n8n workflow
3. **Authentication**: Add webhook authentication for production use
4. **Data Privacy**: Ensure compliance with data protection regulations

## Production Deployment

For production:
1. Use environment-specific webhook URLs
2. Set up monitoring for webhook failures
3. Configure proper authentication
4. Set up backup notification methods 