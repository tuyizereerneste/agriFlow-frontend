import React, { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Lock, Globe, User, Save } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { cn } from '../utils/cn';

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('en');
  const [timeZone, setTimeZone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  
  // Apply dark mode to the document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-8">
        {/* Appearance Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Appearance</h3>
          </div>
          <div className="px-6 py-5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {darkMode ? (
                  <Moon className="h-5 w-5 text-gray-400 dark:text-gray-300 mr-2" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-400 dark:text-gray-300 mr-2" />
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark themes</p>
                </div>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white dark:bg-gray-200 border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="toggle"
                  className={cn(
                    "toggle-label block overflow-hidden h-6 rounded-full cursor-pointer",
                    darkMode ? "bg-primary-600" : "bg-gray-300 dark:bg-gray-700"
                  )}
                ></label>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
          </div>
          <div className="px-6 py-5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-gray-400 dark:text-gray-300 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications about important updates</p>
                </div>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  name="notifications"
                  id="notifications"
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white dark:bg-gray-200 border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="notifications"
                  className={cn(
                    "toggle-label block overflow-hidden h-6 rounded-full cursor-pointer",
                    notificationsEnabled ? "bg-primary-600" : "bg-gray-300 dark:bg-gray-700"
                  )}
                ></label>
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Notification Preferences</h4>
              
              {[
                { id: 'farmer-updates', label: 'Farmer Updates', description: 'New farmer registrations and profile updates' },
                { id: 'data-collection', label: 'Data Collection', description: 'New data entries and collection reminders' },
                { id: 'training-events', label: 'Training Events', description: 'Upcoming training sessions and events' },
                { id: 'market-connections', label: 'Market Connections', description: 'New market opportunities and connections' },
              ].map((item) => (
                <div key={item.id} className="flex items-center">
                  <input
                    id={item.id}
                    name={item.id}
                    type="checkbox"
                    defaultChecked={true}
                    disabled={!notificationsEnabled}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor={item.id} className="ml-3">
                    <span className={cn(
                      "text-sm font-medium",
                      notificationsEnabled ? "text-gray-700 dark:text-gray-200" : "text-gray-400 dark:text-gray-500"
                    )}>
                      {item.label}
                    </span>
                    <p className={cn(
                      "text-xs",
                      notificationsEnabled ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                    )}>
                      {item.description}
                    </p>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Regional Settings</h3>
          </div>
          <div className="px-6 py-5 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="pt">Português</option>
                  <option value="sw">Kiswahili</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time Zone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="EST">EST (Eastern Standard Time)</option>
                  <option value="CST">CST (Central Standard Time)</option>
                  <option value="PST">PST (Pacific Standard Time)</option>
                  <option value="EAT">EAT (East Africa Time)</option>
                  <option value="IST">IST (India Standard Time)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date Format
                </label>
                <select
                  id="dateFormat"
                  name="dateFormat"
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security</h3>
          </div>
          <div className="px-6 py-5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-gray-400 dark:text-gray-300 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Password</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last changed 3 months ago</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-gray-400 dark:text-gray-300 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Enable
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="primary" leftIcon={<Save size={16} />}>
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;