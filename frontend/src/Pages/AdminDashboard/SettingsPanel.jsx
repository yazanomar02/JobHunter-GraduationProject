import React, { useState } from "react";
import { FaMoon, FaBell, FaLanguage, FaLock, FaCog } from "react-icons/fa";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const SettingsPanel = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("en");
  const [password, setPassword] = useState("");

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl mx-auto font-sans">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaCog className="text-brand" /> Settings
      </h2>
      <div className="space-y-6">
        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaMoon className="text-gray-500" />
            <span className="font-medium">Dark Mode</span>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={darkMode}
              onChange={() => setDarkMode((v) => !v)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-brand transition-all relative">
              <div className={`absolute top-0.5 left-1 ${darkMode ? 'translate-x-5' : ''} w-4 h-4 bg-white rounded-full shadow transition-all`}></div>
            </div>
          </label>
        </div>
        {/* Language */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaLanguage className="text-gray-500" />
            <span className="font-medium">Language</span>
          </div>
          <select
            className="border rounded px-3 py-1 text-gray-700"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
            <option value="fr">French</option>
          </select>
        </div>
        {/* Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaBell className="text-gray-500" />
            <span className="font-medium">Enable Notifications</span>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={notifications}
              onChange={() => setNotifications((v) => !v)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-brand transition-all relative">
              <div className={`absolute top-0.5 left-1 ${notifications ? 'translate-x-5' : ''} w-4 h-4 bg-white rounded-full shadow transition-all`}></div>
            </div>
          </label>
        </div>
        {/* Change Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaLock className="text-gray-500" />
            <span className="font-medium">Change Password</span>
          </div>
          <input
            type="password"
            className="border rounded px-3 py-1 text-gray-700 ml-2"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button 
            className="bg-brand text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-light transition"
            onClick={() => {
              showSuccessToast("تم حفظ الإعدادات بنجاح!");
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel; 