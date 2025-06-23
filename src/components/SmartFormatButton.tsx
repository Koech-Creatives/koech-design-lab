import React, { useState } from 'react';
import { useCanvas } from '../contexts/CanvasContext';
import { Zap, Settings, Brain, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface SmartFormatButtonProps {
  currentFormat: any;
  targetFormat: any;
  onFormatChange?: (format: any) => void;
  compact?: boolean;
}

export function SmartFormatButton({ 
  currentFormat, 
  targetFormat, 
  onFormatChange,
  compact = false 
}: SmartFormatButtonProps) {
  const { smartTransformLayout, validateLayout, elements } = useCanvas();
  const [isTransforming, setIsTransforming] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [lastValidation, setLastValidation] = useState<{ isValid: boolean; issues: string[]; suggestions: string[] } | null>(null);
  
  const [transformOptions, setTransformOptions] = useState({
    usePresets: true,
    enableWorker: true,
    responsiveMode: true,
    validateAfter: true
  });

  const handleSmartTransform = async () => {
    if (!currentFormat || !targetFormat || elements.length === 0) {
      console.warn('🚫 Cannot transform: missing format or elements');
      return;
    }

    setIsTransforming(true);
    
    try {
      console.log(`🎯 Smart Transform: ${currentFormat.name} → ${targetFormat.name}`);
      
      // Perform smart transformation
      await smartTransformLayout(currentFormat, targetFormat, transformOptions);
      
      // Validate the layout after transformation if enabled
      if (transformOptions.validateAfter) {
        const validation = await validateLayout(targetFormat);
        setLastValidation(validation);
        
        if (!validation.isValid) {
          console.warn('⚠️ Layout validation found issues:', validation.issues);
        } else {
          console.log('✅ Layout validation passed');
        }
      }
      
      // Trigger format change callback
      if (onFormatChange) {
        onFormatChange(targetFormat);
      }
      
    } catch (error) {
      console.error('❌ Smart transformation failed:', error);
      setLastValidation({
        isValid: false,
        issues: ['Smart transformation failed'],
        suggestions: ['Try using legacy resize mode']
      });
    } finally {
      setIsTransforming(false);
    }
  };

  const handleOptionChange = (option: keyof typeof transformOptions, value: boolean) => {
    setTransformOptions(prev => ({ ...prev, [option]: value }));
  };

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={handleSmartTransform}
          disabled={isTransforming || elements.length === 0}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all
            ${isTransforming 
              ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed' 
              : elements.length === 0
                ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-transparent text-white hover:shadow-lg'
            }
          `}
          title={elements.length === 0 ? 'No elements to transform' : 'Smart format adaptation'}
        >
          {isTransforming ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          Smart Format
        </button>
        
        {lastValidation && (
          <div className={`
            absolute top-full left-0 mt-2 p-3 rounded-lg border text-xs z-50 w-64
            ${lastValidation.isValid 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-yellow-50 border-yellow-200 text-yellow-700'
            }
          `}>
            <div className="flex items-center gap-2 mb-2">
              {lastValidation.isValid ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              )}
              <span className="font-medium">
                {lastValidation.isValid ? 'Layout Optimized' : 'Layout Needs Review'}
              </span>
            </div>
            
            {lastValidation.issues.length > 0 && (
              <div className="mb-2">
                <div className="font-medium mb-1">Issues:</div>
                <ul className="list-disc list-inside space-y-1">
                  {lastValidation.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {lastValidation.suggestions.length > 0 && (
              <div>
                <div className="font-medium mb-1">Suggestions:</div>
                <ul className="list-disc list-inside space-y-1">
                  {lastValidation.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <button
              onClick={() => setLastValidation(null)}
              className="mt-2 text-xs underline opacity-70 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Smart Format Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSmartTransform}
          disabled={isTransforming || elements.length === 0}
          className={`
            flex items-center gap-3 px-6 py-3 rounded-xl border text-base font-semibold transition-all
            ${isTransforming 
              ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed' 
              : elements.length === 0
                ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-transparent text-white hover:shadow-xl transform hover:scale-105'
            }
          `}
          title={elements.length === 0 ? 'No elements to transform' : 'Intelligent layout adaptation with role-based reflow'}
        >
          {isTransforming ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Brain className="w-5 h-5" />
          )}
          {isTransforming ? 'Adapting Layout...' : 'Smart Format'}
        </button>

        <button
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
          title="Transform options"
        >
          <Settings className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Format Information */}
      <div className="text-sm text-gray-600">
        <div className="font-medium mb-1">Transformation:</div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="font-mono">
              {currentFormat?.name || 'Current'} ({currentFormat?.width}×{currentFormat?.height})
            </span>
            <span className="mx-3 text-gray-400">→</span>
            <span className="font-mono">
              {targetFormat?.name || 'Target'} ({targetFormat?.width}×{targetFormat?.height})
            </span>
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            Elements: {elements.length} • 
            Scale: {currentFormat && targetFormat ? 
              `${(targetFormat.width / currentFormat.width * 100).toFixed(0)}%` : 'N/A'
            }
          </div>
        </div>
      </div>

      {/* Options Panel */}
      {showOptions && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Transform Options</h4>
            <button
              onClick={() => setShowOptions(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={transformOptions.usePresets}
                onChange={(e) => handleOptionChange('usePresets', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-sm">Use Layout Presets</div>
                <div className="text-xs text-gray-600">Apply role-based positioning rules for optimal layouts</div>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={transformOptions.enableWorker}
                onChange={(e) => handleOptionChange('enableWorker', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-sm">Enable Web Worker</div>
                <div className="text-xs text-gray-600">Use background processing for better performance</div>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={transformOptions.responsiveMode}
                onChange={(e) => handleOptionChange('responsiveMode', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-sm">Responsive Mode</div>
                <div className="text-xs text-gray-600">Use percentage-based positioning and smart anchoring</div>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={transformOptions.validateAfter}
                onChange={(e) => handleOptionChange('validateAfter', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-sm">Validate After Transform</div>
                <div className="text-xs text-gray-600">Check layout quality and suggest improvements</div>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Validation Results */}
      {lastValidation && (
        <div className={`
          p-4 rounded-lg border
          ${lastValidation.isValid 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
          }
        `}>
          <div className="flex items-center gap-2 mb-3">
            {lastValidation.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            )}
            <span className={`font-medium ${lastValidation.isValid ? 'text-green-700' : 'text-yellow-700'}`}>
              {lastValidation.isValid ? 'Layout Successfully Optimized' : 'Layout Needs Review'}
            </span>
          </div>
          
          {lastValidation.issues.length > 0 && (
            <div className="mb-3">
              <div className="font-medium text-sm mb-2 text-yellow-700">Issues Found:</div>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-600">
                {lastValidation.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          
          {lastValidation.suggestions.length > 0 && (
            <div className="mb-3">
              <div className="font-medium text-sm mb-2 text-yellow-700">Suggestions:</div>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-600">
                {lastValidation.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
          
          <button
            onClick={() => setLastValidation(null)}
            className="text-sm underline opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Quick Tips */}
      <div className="text-xs text-gray-500 bg-blue-50 rounded-lg p-3">
        <div className="font-medium mb-1">💡 Smart Format Tips:</div>
        <ul className="space-y-1">
          <li>• Elements are automatically categorized by role (heading, image, CTA, etc.)</li>
          <li>• Layout presets optimize positioning for different aspect ratios</li>
          <li>• Responsive mode uses percentage-based positioning for better scaling</li>
          <li>• Web workers prevent UI freezing during complex transformations</li>
        </ul>
      </div>
    </div>
  );
} 