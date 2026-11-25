import React, { useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Settings, Moon, Sun, Monitor, ShieldAlert, Download, Save, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GeneralSettings() {
  const navigate = useNavigate();
  const { theme, setTheme, printerType, defaultPrinter, setPrinterType, setDefaultPrinter } = useSettingsStore();
  
  // Local state for toggles
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">System Settings</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage global configuration for this Counter POS.</p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Appearance Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center">
            <Monitor className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="font-bold text-gray-800 dark:text-gray-200">Appearance & Theme</h3>
          </div>
          <div className="p-6">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Color Scheme</label>
            <div className="grid grid-cols-3 gap-4">
              <button 
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${theme === 'light' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'}`}
              >
                <Sun className="h-6 w-6 mb-2" />
                <span className="font-bold text-sm">Light Mode</span>
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${theme === 'dark' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'}`}
              >
                <Moon className="h-6 w-6 mb-2" />
                <span className="font-bold text-sm">Dark Mode</span>
              </button>
              <button 
                onClick={() => setTheme('system')}
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all ${theme === 'system' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'}`}
              >
                <Monitor className="h-6 w-6 mb-2" />
                <span className="font-bold text-sm">System Default</span>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3">The architecture is now active! Try switching between themes.</p>
          </div>
        </div>

        {/* System Behavior */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center">
            <Settings className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="font-bold text-gray-800 dark:text-gray-200">System Behavior</h3>
          </div>
          <div className="p-6 space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-gray-400" /> Desktop Notifications
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Allow popups for sync errors or shift closing alerts.</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-14 h-8 rounded-full transition-colors relative ${notifications ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${notifications ? 'transform translate-x-6' : ''}`}></div>
              </button>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-6 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center">
                  <Download className="h-4 w-4 mr-2 text-gray-400" /> Automatic Updates
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Download and install new software versions in background.</p>
              </div>
              <button 
                onClick={() => setAutoUpdate(!autoUpdate)}
                className={`w-14 h-8 rounded-full transition-colors relative ${autoUpdate ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform ${autoUpdate ? 'transform translate-x-6' : ''}`}></div>
              </button>
            </div>

          </div>
        </div>

        {/* Audit Logs Link */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center">
            <ShieldAlert className="h-8 w-8 text-blue-500 mr-4" />
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Security & Audit Logs</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">View detailed application event history.</p>
            </div>
          </div>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            View Logs
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            className="flex items-center px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md"
          >
            <Save className="h-5 w-5 mr-2" /> Save Configuration
          </button>
        </div>

      </div>
    </div>
  );
}
