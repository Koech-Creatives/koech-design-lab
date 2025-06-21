import { useCallback } from 'react';
import { marketingSync } from '../lib/marketing-sync';
import { useCanvas } from '../contexts/CanvasContext';

// Marketing event types
export type MarketingEvent = 
  | 'project_created'
  | 'project_saved'
  | 'project_exported'
  | 'text_added'
  | 'brand_created'
  | 'template_used'
  | 'feature_used'
  | 'page_visited'
  | 'tutorial_completed'
  | 'subscription_viewed'
  | 'design_shared';

interface MarketingEventData {
  event: MarketingEvent;
  userId?: string;
  metadata?: Record<string, any>;
}

export function useMarketingTracking() {
  const { elements, selectedElement } = useCanvas();

  // Track marketing events
  const trackEvent = useCallback(async (eventData: MarketingEventData) => {
    try {
      const { event, userId, metadata = {} } = eventData;
      
      // Get current user ID from Supabase session if not provided
      let currentUserId = userId;
      if (!currentUserId) {
        const { supabase } = await import('../lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();
        currentUserId = session?.user?.id;
      }

      if (!currentUserId) {
        console.warn('⚠️ No user ID available for marketing tracking');
        return;
      }

      // Enhanced metadata with context
      const enhancedMetadata = {
        ...metadata,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        // Canvas-specific context
        totalElements: elements.length,
        selectedElement: selectedElement,
        sessionDuration: getSessionDuration(),
      };

      await marketingSync.trackUserActivity(currentUserId, event, enhancedMetadata);
      
      console.log(`📊 Marketing event tracked: ${event}`, enhancedMetadata);
    } catch (error) {
      console.error('❌ Marketing tracking failed:', error);
    }
  }, [elements, selectedElement]);

  // Specific tracking methods for common events
  const trackProjectCreated = useCallback((projectData: any) => {
    trackEvent({
      event: 'project_created',
      metadata: {
        projectName: projectData.name,
        platform: projectData.platform,
        format: projectData.format
      }
    });
  }, [trackEvent]);

  const trackProjectSaved = useCallback((projectData: any) => {
    trackEvent({
      event: 'project_saved',
      metadata: {
        projectId: projectData.id,
        projectName: projectData.name,
        elementsCount: projectData.pages?.[0]?.elements?.length || 0
      }
    });
  }, [trackEvent]);

  const trackProjectExported = useCallback((exportData: any) => {
    trackEvent({
      event: 'project_exported',
      metadata: {
        projectId: exportData.projectId,
        format: exportData.format,
        quality: exportData.quality
      }
    });
  }, [trackEvent]);

  const trackTextAdded = useCallback((textData: any) => {
    trackEvent({
      event: 'text_added',
      metadata: {
        fontSize: textData.fontSize,
        fontFamily: textData.fontFamily,
        textLength: textData.content?.length || 0,
        style: textData.textStyle
      }
    });
  }, [trackEvent]);

  const trackBrandCreated = useCallback((brandData: any) => {
    trackEvent({
      event: 'brand_created',
      metadata: {
        brandName: brandData.name,
        colorsCount: brandData.colors?.length || 0,
        fontsCount: brandData.fonts?.length || 0,
        hasLogo: !!brandData.logo
      }
    });
  }, [trackEvent]);

  const trackFeatureUsed = useCallback((feature: string, featureData?: any) => {
    trackEvent({
      event: 'feature_used',
      metadata: {
        feature,
        ...featureData
      }
    });
  }, [trackEvent]);

  const trackPageVisited = useCallback((pageName: string) => {
    trackEvent({
      event: 'page_visited',
      metadata: {
        page: pageName,
        referrer: document.referrer
      }
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackProjectCreated,
    trackProjectSaved,
    trackProjectExported,
    trackTextAdded,
    trackBrandCreated,
    trackFeatureUsed,
    trackPageVisited
  };
}

// Helper function to calculate session duration
function getSessionDuration(): number {
  const sessionStart = sessionStorage.getItem('sessionStart');
  if (!sessionStart) {
    sessionStorage.setItem('sessionStart', Date.now().toString());
    return 0;
  }
  return Date.now() - parseInt(sessionStart);
}

// Helper function to initialize session tracking
export function initializeSessionTracking(): void {
  if (!sessionStorage.getItem('sessionStart')) {
    sessionStorage.setItem('sessionStart', Date.now().toString());
  }
} 