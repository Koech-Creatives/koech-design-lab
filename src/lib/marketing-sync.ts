// Marketing Sync Service
// Handles user data synchronization with CMS platforms and marketing tools

interface UserSignupData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  signupDate: string;
  source?: string;
  metadata?: Record<string, any>;
}

interface MarketingSyncConfig {
  airtable?: {
    apiKey: string;
    baseId: string;
    tableId: string;
  };
  googleSheets?: {
    sheetId: string;
    apiKey: string;
  };
  webhooks?: {
    aiAgent?: string;
    zapier?: string;
    n8n?: string;
  };
}

class MarketingSyncService {
  private config: MarketingSyncConfig;

  constructor(config: MarketingSyncConfig) {
    this.config = config;
  }

  // Main method to sync user data to all configured platforms
  async syncUserSignup(userData: UserSignupData): Promise<void> {
    const syncPromises: Promise<any>[] = [];

    // Sync to Airtable
    if (this.config.airtable) {
      syncPromises.push(this.syncToAirtable(userData));
    }

    // Sync to Google Sheets
    if (this.config.googleSheets) {
      syncPromises.push(this.syncToGoogleSheets(userData));
    }

    // Send to webhooks (AI agents, automation tools)
    if (this.config.webhooks) {
      Object.values(this.config.webhooks).forEach(webhookUrl => {
        if (webhookUrl) {
          syncPromises.push(this.sendToWebhook(webhookUrl, userData));
        }
      });
    }

    // Execute all syncs in parallel
    try {
      await Promise.allSettled(syncPromises);
      console.log('✅ User data synced to all platforms');
    } catch (error) {
      console.error('❌ Error syncing user data:', error);
    }
  }

  // Sync to Airtable
  private async syncToAirtable(userData: UserSignupData): Promise<void> {
    if (!this.config.airtable) return;

    const { apiKey, baseId, tableId } = this.config.airtable;
    
    try {
      const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            'User ID': userData.id,
            'Email': userData.email,
            'First Name': userData.firstName,
            'Last Name': userData.lastName,
            'Full Name': `${userData.firstName} ${userData.lastName}`,
            'Phone': userData.phone || '',
            'Signup Date': userData.signupDate,
            'Source': userData.source || 'Direct',
            'Status': 'New User',
            'Tags': 'Canvas App User',
            'Metadata': JSON.stringify(userData.metadata || {})
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.statusText}`);
      }

      console.log('✅ User synced to Airtable');
    } catch (error) {
      console.error('❌ Airtable sync failed:', error);
      throw error;
    }
  }

  // Sync to Google Sheets
  private async syncToGoogleSheets(userData: UserSignupData): Promise<void> {
    if (!this.config.googleSheets) return;

    const { sheetId, apiKey } = this.config.googleSheets;
    
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Users:append?valueInputOption=RAW&key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: [[
              userData.id,
              userData.email,
              userData.firstName,
              userData.lastName,
              userData.phone || '',
              userData.signupDate,
              userData.source || 'Direct',
              'New User',
              JSON.stringify(userData.metadata || {})
            ]]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Google Sheets API error: ${response.statusText}`);
      }

      console.log('✅ User synced to Google Sheets');
    } catch (error) {
      console.error('❌ Google Sheets sync failed:', error);
      throw error;
    }
  }

  // Send to webhook (for AI agents, Zapier, n8n, etc.)
  private async sendToWebhook(webhookUrl: string, userData: UserSignupData): Promise<void> {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'user_signup',
          data: userData,
          timestamp: new Date().toISOString(),
          source: 'koech-canvas'
        })
      });

      if (!response.ok) {
        throw new Error(`Webhook error: ${response.statusText}`);
      }

      console.log(`✅ User data sent to webhook: ${webhookUrl}`);
    } catch (error) {
      console.error(`❌ Webhook failed (${webhookUrl}):`, error);
      throw error;
    }
  }

  // Track user activity (for marketing segmentation)
  async trackUserActivity(userId: string, activity: string, metadata?: Record<string, any>): Promise<void> {
    const activityData = {
      userId,
      activity,
      timestamp: new Date().toISOString(),
      metadata: metadata || {}
    };

    // Send activity to configured platforms
    if (this.config.webhooks?.aiAgent) {
      try {
        await fetch(this.config.webhooks.aiAgent, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'user_activity',
            data: activityData
          })
        });
      } catch (error) {
        console.error('❌ Activity tracking failed:', error);
      }
    }
  }

  // Get marketing analytics
  async getMarketingAnalytics(): Promise<any> {
    if (!this.config.airtable) return null;

    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${this.config.airtable.baseId}/${this.config.airtable.tableId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.airtable.apiKey}`,
          }
        }
      );

      const data = await response.json();
      
      // Basic analytics
      const users = data.records || [];
      const analytics = {
        totalUsers: users.length,
        newUsersToday: users.filter((user: any) => {
          const signupDate = new Date(user.fields['Signup Date']);
          const today = new Date();
          return signupDate.toDateString() === today.toDateString();
        }).length,
        newUsersThisWeek: users.filter((user: any) => {
          const signupDate = new Date(user.fields['Signup Date']);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return signupDate >= weekAgo;
        }).length,
        sources: users.reduce((acc: any, user: any) => {
          const source = user.fields['Source'] || 'Direct';
          acc[source] = (acc[source] || 0) + 1;
          return acc;
        }, {})
      };

      return analytics;
    } catch (error) {
      console.error('❌ Analytics fetch failed:', error);
      return null;
    }
  }
}

// Create singleton instance
export const marketingSync = new MarketingSyncService({
  airtable: {
    apiKey: import.meta.env.VITE_AIRTABLE_API_KEY || '',
    baseId: import.meta.env.VITE_AIRTABLE_BASE_ID || '',
    tableId: import.meta.env.VITE_AIRTABLE_TABLE_ID || 'Users'
  },
  googleSheets: {
    sheetId: import.meta.env.VITE_GOOGLE_SHEETS_ID || '',
    apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || ''
  },
  webhooks: {
    aiAgent: import.meta.env.VITE_AI_AGENT_WEBHOOK || '',
    zapier: import.meta.env.VITE_ZAPIER_WEBHOOK || '',
    n8n: import.meta.env.VITE_N8N_WEBHOOK || ''
  }
});

export type { UserSignupData, MarketingSyncConfig }; 