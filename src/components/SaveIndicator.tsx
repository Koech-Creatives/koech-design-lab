import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader2, Cloud, Zap } from 'lucide-react';

interface SaveIndicatorProps {
  isSaving?: boolean;
  lastSaved?: Date | null;
  platform?: string;
  format?: string;
}

export function SaveIndicator({ isSaving = false, lastSaved, platform, format }: SaveIndicatorProps) {
  const [showSaved, setShowSaved] = useState(false);
  const [isRealTimeSync, setIsRealTimeSync] = useState(false);

  useEffect(() => {
    if (!isSaving && lastSaved) {
      setShowSaved(true);
      setIsRealTimeSync(true);
      
      const timer = setTimeout(() => {
        setShowSaved(false);
        setIsRealTimeSync(false);
      }, 2000); // Faster fade for real-time feel
      
      return () => clearTimeout(timer);
    }
  }, [isSaving, lastSaved]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isSaving && !showSaved && !lastSaved) return null;

  return (
    <div className="fixed top-20 right-4 z-30 flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-200 animate-in fade-in">
      <div 
        className={`flex items-center space-x-2 ${
          isSaving 
            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' 
            : showSaved && isRealTimeSync
              ? 'bg-green-500/30 text-green-200 border-green-400/40' 
              : showSaved 
                ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                : 'bg-gray-700/80 text-gray-300 border-gray-600/50'
        } border rounded-lg px-2 py-1 transition-all duration-200`}
      >
        {isSaving ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="text-xs font-medium">Syncing...</span>
          </>
        ) : showSaved && isRealTimeSync ? (
          <>
            <Zap className="w-3 h-3 animate-pulse" />
            <span className="text-xs font-medium">Real-time Sync ⚡</span>
          </>
        ) : showSaved ? (
          <>
            <CheckCircle className="w-3 h-3" />
            <span className="text-xs font-medium">Saved</span>
          </>
        ) : lastSaved ? (
          <>
            <Cloud className="w-3 h-3" />
            <span className="text-xs font-medium">
              Saved {formatTime(lastSaved)}
            </span>
          </>
        ) : null}
        
        {(platform && format) && (
          <span className="text-xs opacity-75 ml-1">
            • {platform} {format}
          </span>
        )}
      </div>
    </div>
  );
} 