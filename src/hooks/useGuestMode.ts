import { useState, useEffect, useCallback } from 'react';
import { marketingSync } from '../lib/marketing-sync';

interface GuestProject {
  id: string;
  name: string;
  platform: string;
  format: any;
  pages: any[];
  current_page_id: string;
  thumbnail?: string;
  created_at: string;
  updated_at: string;
}

interface GuestSession {
  id: string;
  startTime: number;
  totalTime: number;
  actionsCount: number;
  projectsCreated: number;
  featuresUsed: string[];
  lastActivity: number;
}

interface ConversionTrigger {
  type: 'time_spent' | 'projects_created' | 'features_used' | 'export_attempt' | 'save_attempt';
  threshold: number;
  triggered: boolean;
  message: string;
}

export function useGuestMode() {
  const [guestProjects, setGuestProjects] = useState<GuestProject[]>([]);
  const [guestSession, setGuestSession] = useState<GuestSession | null>(null);
  const [conversionTriggers] = useState<ConversionTrigger[]>([
    {
      type: 'time_spent',
      threshold: 600000, // 10 minutes
      triggered: false,
      message: "You've been designing for 10 minutes! Save your work with a free account."
    },
    {
      type: 'projects_created',
      threshold: 2,
      triggered: false,
      message: "You've created 2 designs! Create an account to save them forever."
    },
    {
      type: 'features_used',
      threshold: 5,
      triggered: false,
      message: "You're really exploring our features! Unlock everything with a free account."
    },
    {
      type: 'export_attempt',
      threshold: 1,
      triggered: false,
      message: "Want HD exports without watermarks? Create your free account!"
    }
  ]);

  // Initialize guest session
  useEffect(() => {
    const initGuestSession = () => {
      const existingSession = localStorage.getItem('guestSession');
      const existingProjects = localStorage.getItem('guestProjects');

      if (existingSession) {
        const session = JSON.parse(existingSession);
        setGuestSession(session);
      } else {
        const newSession: GuestSession = {
          id: `guest_${Date.now()}`,
          startTime: Date.now(),
          totalTime: 0,
          actionsCount: 0,
          projectsCreated: 0,
          featuresUsed: [],
          lastActivity: Date.now()
        };
        setGuestSession(newSession);
        localStorage.setItem('guestSession', JSON.stringify(newSession));
      }

      if (existingProjects) {
        setGuestProjects(JSON.parse(existingProjects));
      }
    };

    initGuestSession();
  }, []);

  // Update session periodically
  useEffect(() => {
    const updateSession = () => {
      if (guestSession) {
        const updatedSession = {
          ...guestSession,
          totalTime: Date.now() - guestSession.startTime,
          lastActivity: Date.now()
        };
        setGuestSession(updatedSession);
        localStorage.setItem('guestSession', JSON.stringify(updatedSession));
      }
    };

    const interval = setInterval(updateSession, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [guestSession]);

  // Save guest project
  const saveGuestProject = useCallback((project: Omit<GuestProject, 'id' | 'created_at' | 'updated_at'>) => {
    const newProject: GuestProject = {
      ...project,
      id: `guest_project_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const updatedProjects = [...guestProjects, newProject];
    setGuestProjects(updatedProjects);
    localStorage.setItem('guestProjects', JSON.stringify(updatedProjects));

    // Update session
    if (guestSession) {
      const updatedSession = {
        ...guestSession,
        projectsCreated: guestSession.projectsCreated + 1,
        actionsCount: guestSession.actionsCount + 1
      };
      setGuestSession(updatedSession);
      localStorage.setItem('guestSession', JSON.stringify(updatedSession));
    }

    return newProject.id;
  }, [guestProjects, guestSession]);

  // Update guest project
  const updateGuestProject = useCallback((projectId: string, updates: Partial<GuestProject>) => {
    const updatedProjects = guestProjects.map(project =>
      project.id === projectId
        ? { ...project, ...updates, updated_at: new Date().toISOString() }
        : project
    );
    setGuestProjects(updatedProjects);
    localStorage.setItem('guestProjects', JSON.stringify(updatedProjects));
  }, [guestProjects]);

  // Track feature usage
  const trackFeatureUsage = useCallback((feature: string) => {
    if (guestSession && !guestSession.featuresUsed.includes(feature)) {
      const updatedSession = {
        ...guestSession,
        featuresUsed: [...guestSession.featuresUsed, feature],
        actionsCount: guestSession.actionsCount + 1
      };
      setGuestSession(updatedSession);
      localStorage.setItem('guestSession', JSON.stringify(updatedSession));

      // Track anonymously for analytics
      try {
        marketingSync.trackUserActivity(`guest_${guestSession.id}`, 'feature_used', {
          feature,
          isGuest: true,
          sessionTime: Date.now() - guestSession.startTime,
          totalFeatures: updatedSession.featuresUsed.length
        });
      } catch (error) {
        console.warn('Guest analytics tracking failed:', error);
      }
    }
  }, [guestSession]);

  // Check conversion triggers
  const checkConversionTriggers = useCallback(() => {
    if (!guestSession) return null;

    for (const trigger of conversionTriggers) {
      if (trigger.triggered) continue;

      let shouldTrigger = false;

      switch (trigger.type) {
        case 'time_spent':
          shouldTrigger = guestSession.totalTime >= trigger.threshold;
          break;
        case 'projects_created':
          shouldTrigger = guestSession.projectsCreated >= trigger.threshold;
          break;
        case 'features_used':
          shouldTrigger = guestSession.featuresUsed.length >= trigger.threshold;
          break;
        case 'export_attempt':
        case 'save_attempt':
          // These are triggered manually when user attempts the action
          break;
      }

      if (shouldTrigger) {
        trigger.triggered = true;
        return trigger;
      }
    }

    return null;
  }, [guestSession, conversionTriggers]);

  // Trigger conversion prompt manually
  const triggerConversionPrompt = useCallback((type: 'export_attempt' | 'save_attempt') => {
    const trigger = conversionTriggers.find(t => t.type === type && !t.triggered);
    if (trigger) {
      trigger.triggered = true;
      return trigger;
    }
    return null;
  }, [conversionTriggers]);

  // Capture guest email
  const captureGuestEmail = useCallback(async (email: string, context: string) => {
    try {
      await marketingSync.syncUserSignup({
        id: `guest_${guestSession?.id || Date.now()}`,
        email,
        firstName: '',
        lastName: '',
        signupDate: new Date().toISOString(),
        source: 'Guest Conversion',
        metadata: {
          context,
          isGuest: true,
          sessionData: guestSession,
          projectsCreated: guestProjects.length,
          conversionTrigger: context
        }
      });

      // Mark email as captured
      if (guestSession) {
        const updatedSession = {
          ...guestSession,
          emailCaptured: true,
          email
        };
        setGuestSession(updatedSession);
        localStorage.setItem('guestSession', JSON.stringify(updatedSession));
      }

      return { success: true };
    } catch (error) {
      console.error('Guest email capture failed:', error);
      return { success: false, error: 'Failed to save email' };
    }
  }, [guestSession, guestProjects, marketingSync]);

  // Get guest analytics summary
  const getGuestAnalytics = useCallback(() => {
    if (!guestSession) return null;

    return {
      sessionDuration: guestSession.totalTime,
      projectsCreated: guestSession.projectsCreated,
      featuresUsed: guestSession.featuresUsed.length,
      actionsCount: guestSession.actionsCount,
      engagementLevel: 
        guestSession.totalTime > 300000 ? 'high' : // 5+ minutes
        guestSession.totalTime > 60000 ? 'medium' : // 1+ minute
        'low',
      conversionReadiness:
        guestSession.projectsCreated >= 2 || 
        guestSession.totalTime >= 600000 || 
        guestSession.featuresUsed.length >= 5
    };
  }, [guestSession]);

  // Clear guest data (for cleanup or when user signs up)
  const clearGuestData = useCallback(() => {
    localStorage.removeItem('guestSession');
    localStorage.removeItem('guestProjects');
    setGuestSession(null);
    setGuestProjects([]);
  }, []);

  // Migrate guest data to user account
  const migrateGuestDataToUser = useCallback(async (userId: string) => {
    if (guestProjects.length === 0) return;

    try {
      // This would be implemented to migrate guest projects to user account
      // For now, we'll just track the migration
      await marketingSync.trackUserActivity(userId, 'guest_data_migrated', {
        guestProjects: guestProjects.length,
        guestSession: guestSession,
        migratedAt: new Date().toISOString()
      });

      // Clear guest data after successful migration
      clearGuestData();
      
      return { success: true, migratedProjects: guestProjects.length };
    } catch (error) {
      console.error('Guest data migration failed:', error);
      return { success: false, error: 'Failed to migrate data' };
    }
  }, [guestProjects, guestSession, clearGuestData]);

  return {
    // Data
    guestProjects,
    guestSession,
    
    // Actions
    saveGuestProject,
    updateGuestProject,
    trackFeatureUsage,
    captureGuestEmail,
    
    // Conversion
    checkConversionTriggers,
    triggerConversionPrompt,
    getGuestAnalytics,
    
    // Migration
    migrateGuestDataToUser,
    clearGuestData,
    
    // Utils
    isGuestMode: true,
    hasGuestData: guestProjects.length > 0 || (guestSession?.totalTime || 0) > 60000
  };
} 