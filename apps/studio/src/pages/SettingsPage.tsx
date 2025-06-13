import React from 'react';
import { Settings, User, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            <a href="#" className="bg-blue-50 border-blue-500 text-blue-700 border-l-4 block pl-3 pr-4 py-2 text-sm font-medium">
              Profile
            </a>
            <a href="#" className="text-gray-900 hover:text-gray-900 hover:bg-gray-50 block pl-3 pr-4 py-2 text-sm font-medium">
              Notifications
            </a>
            <a href="#" className="text-gray-900 hover:text-gray-900 hover:bg-gray-50 block pl-3 pr-4 py-2 text-sm font-medium">
              Security
            </a>
            <a href="#" className="text-gray-900 hover:text-gray-900 hover:bg-gray-50 block pl-3 pr-4 py-2 text-sm font-medium">
              Preferences
            </a>
          </nav>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about yourself"
                />
              </div>
              
              <div className="flex justify-end">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 