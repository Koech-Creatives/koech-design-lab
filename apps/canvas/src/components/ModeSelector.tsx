import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Palette, 
  Code, 
  Sparkles, 
  ArrowRight,
  Layers,
  FileText,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function ModeSelector() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const modes = [
    {
      id: 'canvas',
      title: 'Canvas Editor',
      description: 'Traditional design editor with layers, elements, and full creative control',
      icon: Palette,
      color: 'from-purple-500 to-pink-500',
      features: ['Layer-based editing', 'Custom elements', 'Brand assets', 'Multi-platform export'],
      route: '/canvas'
    },
    {
      id: 'templates',
      title: 'HTML Templates',
      description: 'Quick design generation using HTML-based templates with your brand',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      features: ['HTML-based templates', 'Brand injection', 'Platform optimization', 'Fast export'],
      route: '/templates'
    },
    {
      id: 'ai',
      title: 'AI Mode',
      description: 'AI-powered design generation (Coming Soon)',
      icon: Sparkles,
      color: 'from-green-500 to-emerald-500',
      features: ['AI generation', 'Smart layouts', 'Content suggestions', 'Auto-optimization'],
      route: '/ai',
      comingSoon: true
    }
  ];

  const handleModeSelect = (mode: typeof modes[0]) => {
    if (mode.comingSoon) {
      // Show coming soon message
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-6 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = 'AI Mode coming soon! Stay tuned for updates.';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
      return;
    }
    
    navigate(mode.route);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#1a1a1a' }}>
      {/* Header */}
      <div className="border-b" style={{ backgroundColor: '#002e51', borderColor: '#004080' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-10 h-10 rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'block';
                  }
                }}
              />
              <Palette className="w-8 h-8 hidden" style={{ color: '#ff4940' }} />
              <div>
                <h1 className="text-xl font-bold text-white">Koech Design Lab</h1>
                <p className="text-sm text-gray-400">Choose your creative mode</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Welcome, {user?.first_name || 'User'}</span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" 
                   style={{ backgroundColor: '#ff4940' }}>
                {(user?.first_name?.[0] || 'U').toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-6xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Creative Mode
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Select the design approach that best fits your workflow and project needs
            </p>
          </div>

          {/* Mode Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {modes.map((mode) => {
              const Icon = mode.icon;
              return (
                <div
                  key={mode.id}
                  className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    mode.comingSoon ? 'opacity-75' : ''
                  }`}
                  onClick={() => handleModeSelect(mode)}
                >
                  {/* Card */}
                  <div 
                    className="p-8 rounded-2xl border-2 border-transparent hover:border-white/20 transition-all duration-300"
                    style={{ backgroundColor: '#002e51' }}
                  >
                    {/* Icon with gradient background */}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${mode.color} flex items-center justify-center mb-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                          {mode.title}
                          {mode.comingSoon && (
                            <span className="ml-2 px-2 py-1 text-xs bg-yellow-600 text-white rounded-full">
                              Soon
                            </span>
                          )}
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                          {mode.description}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        {mode.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                            <span className="text-sm text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="pt-4">
                        <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                          mode.comingSoon 
                            ? 'bg-gray-700 cursor-not-allowed' 
                            : 'bg-gradient-to-r ' + mode.color + ' hover:shadow-lg'
                        }`}>
                          <span className="text-white font-medium">
                            {mode.comingSoon ? 'Coming Soon' : 'Get Started'}
                          </span>
                          <ArrowRight className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coming Soon Overlay */}
                  {mode.comingSoon && (
                    <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
                      <div className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium">
                        Coming Soon
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">3</div>
              <div className="text-gray-400">Creative Modes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">∞</div>
              <div className="text-gray-400">Design Possibilities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">1</div>
              <div className="text-gray-400">Unified Brand</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 