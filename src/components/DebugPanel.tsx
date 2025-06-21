import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, testConnection } from '../lib/supabase';
import { Bug, ChevronDown, ChevronUp, User, Database, Wifi, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export function DebugPanel() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [supabaseSession, setSupabaseSession] = useState<any>(null);
  const [authLogs, setAuthLogs] = useState<any[]>([]);

  // Test Supabase connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testConnection();
        setConnectionStatus(result.success ? 'connected' : 'error');
      } catch (error) {
        setConnectionStatus('error');
      }
    };

    checkConnection();
  }, []);

  // Monitor Supabase session
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!error) {
          setSupabaseSession(session);
        }
      } catch (error) {
        console.error('Debug panel session error:', error);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔍 [DEBUG] Auth event:', event, session?.user?.email);
        setSupabaseSession(session);
        
        // Log auth events
        setAuthLogs(prev => [...prev.slice(-9), {
          timestamp: new Date().toISOString(),
          event,
          userEmail: session?.user?.email,
          userId: session?.user?.id,
          hasSession: !!session
        }]);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-400 animate-pulse" />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg border border-gray-700 hover:bg-gray-800 transition-colors"
      >
        <Bug className="w-4 h-4" />
  {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronUp className="w-4 h-4" />
        )}
      </button>

      {/* Debug Panel */}
      {isExpanded && (
        <div className="absolute bottom-12 right-0 w-96 max-h-96 overflow-y-auto bg-gray-900 border border-gray-700 rounded-lg shadow-xl">
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-gray-700 pb-2">
              <Bug className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-semibold">Debug Panel</h3>
            </div>

            {/* Connection Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Supabase Connection</span>
                {getStatusIcon(connectionStatus)}
              </div>
              <div className="text-xs text-gray-400 ml-6">
                Status: {connectionStatus}
              </div>
            </div>

            {/* Auth Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">Authentication</span>
                {isAuthenticated ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div className="text-xs text-gray-400 ml-6 space-y-1">
                <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
                <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
                <div>User ID: {user?.id || 'None'}</div>
                <div>Email: {user?.email || 'None'}</div>
                <div>Name: {user?.first_name} {user?.last_name}</div>
                <div>Phone: {user?.phone || 'Not provided'}</div>
              </div>
            </div>

            {/* Supabase Session */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" style={{ color: '#ff4940' }} />
                <span className="text-sm text-gray-300">Supabase Session</span>
              </div>
              <div className="text-xs text-gray-400 ml-6 space-y-1">
                <div>Has Session: {supabaseSession ? 'Yes' : 'No'}</div>
                {supabaseSession && (
                  <>
                    <div>User ID: {supabaseSession.user?.id}</div>
                    <div>Email: {supabaseSession.user?.email}</div>
                    <div>Email Confirmed: {supabaseSession.user?.email_confirmed_at ? 'Yes' : 'No'}</div>
                    <div>Created: {supabaseSession.user?.created_at ? new Date(supabaseSession.user.created_at).toLocaleString() : 'Unknown'}</div>
                    <div>Metadata: {JSON.stringify(supabaseSession.user?.user_metadata || {}, null, 2)}</div>
                  </>
                )}
              </div>
            </div>

            {/* Auth Event Log */}
            {authLogs.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Recent Auth Events</span>
                </div>
                <div className="text-xs text-gray-400 ml-6 space-y-1 max-h-32 overflow-y-auto">
                  {authLogs.slice(-5).reverse().map((log, index) => (
                    <div key={index} className="border-l-2 border-gray-600 pl-2">
                      <div className="text-yellow-400">
                        [{log.timestamp.split('T')[1].split('.')[0]}] {log.event}
                      </div>
                      {log.userEmail && (
                        <div className="text-gray-500">Email: {log.userEmail}</div>
                      )}
                      {log.userId && (
                        <div className="text-gray-500">ID: {log.userId.substring(0, 8)}...</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Environment Info */}
            <div className="space-y-2 border-t border-gray-700 pt-2">
              <div className="text-xs text-gray-500">
                <div>Environment: {import.meta.env.MODE}</div>
                <div>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing'}</div>
                <div>Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 border-t border-gray-700 pt-2">
              <div className="text-sm text-gray-300 mb-2">Quick Actions:</div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    console.log('🔍 Current Auth State:', {
                      user,
                      isLoading,
                      isAuthenticated,
                      supabaseSession
                    });
                  }}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                >
                  Log State
                </button>
                <button
                  onClick={() => setAuthLogs([])}
                  className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded"
                >
                  Clear Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 