// n8n Webhook Configuration
// Replace these URLs with your actual n8n webhook endpoints

export const N8N_WEBHOOKS = {
  // Feature request webhook
  feature: import.meta.env.VITE_N8N_FEATURE_WEBHOOK || 'https://your-n8n-instance.com/webhook/feature-request',
  
  // Bug report webhook  
  bug: import.meta.env.VITE_N8N_BUG_WEBHOOK || 'https://your-n8n-instance.com/webhook/bug-report',
  
  // General feedback webhook
  general: import.meta.env.VITE_N8N_GENERAL_WEBHOOK || 'https://your-n8n-instance.com/webhook/general-feedback'
};

// Webhook payload interface for TypeScript
export interface WebhookPayload {
  type: 'feature' | 'bug' | 'general';
  message: string;
  user: {
    email?: string;
    name?: string;
    id?: string;
  };
  timestamp: string;
  app_version: string;
  user_agent: string;
  url: string;
}

// Helper function to send feedback to n8n
export const sendFeedbackToN8n = async (payload: WebhookPayload): Promise<boolean> => {
  try {
    const webhookUrl = N8N_WEBHOOKS[payload.type];
    
    console.log(`📤 Sending ${payload.type} feedback to n8n:`, {
      webhook: webhookUrl,
      user: payload.user.email,
      message: payload.message.substring(0, 50) + '...'
    });

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('✅ Feedback sent successfully to n8n');
    return true;
  } catch (error) {
    console.error('❌ Failed to send feedback to n8n:', error);
    return false;
  }
}; 