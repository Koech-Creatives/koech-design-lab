# n8n Webhook Setup for Koech Design Lab Feedback System

This document explains how to set up n8n webhooks to receive feedback from your Koech Design Lab application.

## Overview

The app sends three types of feedback to n8n webhooks:
- **Feature Requests** - User suggestions for new features
- **Bug Reports** - Issues and problems users encounter
- **General Feedback** - Overall thoughts and comments

## Current Configuration

Your app is configured to use: `https://n8n-service-u0dv.onrender.com/webhook/koech-labs-feedback`

## Webhook Payload Structure

Each feedback submission sends a JSON payload with this structure:

```json
{
  "type": "feature|bug|general",
  "message": "User's feedback message",
  "user": {
    "email": "user@example.com",
    "name": "John Doe",
    "id": "user-uuid"
  },
  "timestamp": "2024-01-20T10:30:00.000Z",
  "app_version": "0.1.0-beta",
  "user_agent": "Mozilla/5.0...",
  "url": "https://your-app.com/current-page"
}
```

## n8n Workflow Setup

### 1. Create a New Workflow

1. Open your n8n instance
2. Create a new workflow
3. Add a **Webhook** node as the trigger

### 2. Configure the Webhook Node

- **HTTP Method**: POST
- **Path**: `/webhook/koech-labs-feedback`
- **Authentication**: None (or add if needed)
- **Response Mode**: Respond Immediately
- **Response Code**: 200

### 3. Add Processing Nodes

Here's a suggested workflow structure:

```
Webhook → Switch → [Feature/Bug/General Processing] → [Notification/Storage]
```

#### Switch Node Configuration:
- **Mode**: Expression
- **Expression**: `{{$json.type}}`
- **Routing Rules**:
  - `feature` → Feature processing branch
  - `bug` → Bug processing branch  
  - `general` → General processing branch

### 4. Example Processing Branches

#### For Feature Requests:
```
Switch → Set (Add Labels) → Slack/Email → Airtable/Notion
```

#### For Bug Reports:
```
Switch → Set (Priority) → GitHub Issues → Slack Alert
```

#### For General Feedback:
```
Switch → Set (Category) → Google Sheets → Email Summary
```

## Environment Variables

Update your `.env.local` file with your actual webhook URLs:

```env
# Single webhook for all feedback types (recommended)
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/koech-labs-feedback

# Or separate webhooks for each type
VITE_N8N_FEATURE_WEBHOOK=https://your-n8n-instance.com/webhook/feature-request
VITE_N8N_BUG_WEBHOOK=https://your-n8n-instance.com/webhook/bug-report
VITE_N8N_GENERAL_WEBHOOK=https://your-n8n-instance.com/webhook/general-feedback
```

## Testing the Webhook

1. **Test from the app**: Use the Settings modal to submit feedback
2. **Test manually**: Send a POST request to your webhook:

```bash
curl -X POST https://your-n8n-instance.com/webhook/koech-labs-feedback \
  -H "Content-Type: application/json" \
  -d '{
    "type": "feature",
    "message": "Test feedback message",
    "user": {
      "email": "test@example.com",
      "name": "Test User"
    },
    "timestamp": "2024-01-20T10:30:00.000Z",
    "app_version": "0.1.0-beta"
  }'
```

## Workflow Examples

### Basic Slack Notification

```
Webhook → Set → Slack
```

Set node adds:
```json
{
  "channel": "#feedback",
  "text": "New {{$json.type}} feedback from {{$json.user.email}}: {{$json.message}}"
}
```

### Advanced Processing

```
Webhook → Switch → Set → HTTP Request → Slack
```

This could:
1. Route by feedback type
2. Add metadata (priority, labels)
3. Create tickets in external systems
4. Send notifications

## Security Considerations

1. **Authentication**: Add webhook authentication if needed
2. **Rate Limiting**: Implement rate limiting to prevent spam
3. **Validation**: Validate incoming payload structure
4. **Logging**: Log all feedback for audit purposes

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure your n8n instance allows requests from your app domain
2. **Timeout**: Check if your n8n workflow completes within reasonable time
3. **Payload Issues**: Verify the JSON structure matches expectations

### Debug Mode:

The app logs all webhook attempts to the browser console. Check for:
- `📤 Sending feedback to n8n`
- `✅ Feedback sent successfully`
- `❌ Failed to send feedback`

### Fallback Behavior:

If the webhook fails, feedback is stored locally in `localStorage` with status `webhook_failed`. You can retrieve this data later for manual processing.

## Next Steps

1. Set up your n8n workflow using the structure above
2. Update the webhook URL in your environment variables
3. Test the integration
4. Set up notifications and storage as needed
5. Monitor feedback volume and adjust processing accordingly 