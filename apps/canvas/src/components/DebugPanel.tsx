import React, { useState, useEffect } from 'react';
import { Bug, X, RefreshCw, Trash2, Info } from 'lucide-react';
import { debugUtils, testConnection } from '../lib/directus';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [errorLogs, setErrorLogs] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load error logs
  const loadErrorLogs = () => {
    const logs = debugUtils.getErrorLogs();
    setErrorLogs(logs);
  };

  // Test connection
  const handleTestConnection = async () => {
    setIsLoading(true);
    const result = await testConnection();
    setConnectionStatus(result);
    setIsLoading(false);
  };

  // Clear error logs
  const handleClearLogs = () => {
    debugUtils.clearErrorLogs();
    setErrorLogs([]);
  };

  // Load logs when panel opens
  useEffect(() => {
    if (isOpen) {
      loadErrorLogs();
      handleTestConnection();
    }
  }, [isOpen]);

  // Show debug button only in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 rounded-full shadow-lg z-50 text-white hover:opacity-80 transition-opacity"
        style={{ backgroundColor: '#ff4940' }}
        title="Open Debug Panel"
      >
        <Bug className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 rounded-lg shadow-2xl z-50 border overflow-hidden"
         style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: '#004080' }}>
        <div className="flex items-center space-x-2">
          <Bug className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-medium text-white">Debug Panel</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadErrorLogs}
            className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3 overflow-y-auto max-h-80">
        {/* Connection Status */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-gray-300">Connection Status</h4>
            <button
              onClick={handleTestConnection}
              disabled={isLoading}
              className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test'}
            </button>
          </div>
          <div className={`p-2 rounded text-xs ${
            connectionStatus?.success 
              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {connectionStatus?.success ? (
              <div>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Connected to Directus</span>
                </div>
                {connectionStatus.data && (
                  <div className="mt-1 text-xs opacity-75">
                    Version: {connectionStatus.data.directus?.version || 'Unknown'}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  <span>Connection Failed</span>
                </div>
                {connectionStatus?.error && (
                  <div className="mt-1 text-xs opacity-75">
                    {connectionStatus.error.message || 'Unknown error'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Error Logs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-gray-300">
              Error Logs ({errorLogs.length})
            </h4>
            {errorLogs.length > 0 && (
              <button
                onClick={handleClearLogs}
                className="text-xs text-red-400 hover:text-red-300"
                title="Clear all logs"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>

          {errorLogs.length === 0 ? (
            <div className="p-2 rounded text-xs text-gray-400 bg-gray-800/50">
              No errors logged
            </div>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {errorLogs.slice().reverse().map((log, index) => (
                <div
                  key={index}
                  className="p-2 rounded text-xs bg-red-500/10 border border-red-500/20"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-red-400">{log.operation}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-red-300">
                    {log.error.message}
                  </div>
                  {log.error.status && (
                    <div className="text-gray-400 mt-1">
                      Status: {log.error.status} {log.error.statusText}
                    </div>
                  )}
                  {log.context && (
                    <details className="mt-1">
                      <summary className="text-gray-400 cursor-pointer">
                        Context
                      </summary>
                      <pre className="text-xs text-gray-300 mt-1 overflow-x-auto">
                        {JSON.stringify(log.context, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h4 className="text-xs font-medium text-gray-300 mb-2">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                console.log('🧪 Running endpoint tests...');
                debugUtils.testAllEndpoints();
              }}
              className="p-2 rounded text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20"
            >
              Test Endpoints
            </button>
            <button
              onClick={() => {
                console.log('📊 Current localStorage data:', {
                  directus_token: localStorage.getItem('directus_token'),
                  brandAssets: localStorage.getItem('brandAssets'),
                  currentDesign: localStorage.getItem('currentDesign')
                });
              }}
              className="p-2 rounded text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20"
            >
              Show Storage
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-2 rounded text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <div className="flex items-center space-x-1 mb-1">
            <Info className="w-3 h-3" />
            <span className="font-medium">Debug Info</span>
          </div>
          <div>Open browser console for detailed logs</div>
        </div>
      </div>
    </div>
  );
} 