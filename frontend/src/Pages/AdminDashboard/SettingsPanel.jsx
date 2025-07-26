import React, { useState } from "react";
import {
  FaMoon, FaBell, FaLanguage, FaLock, FaCog, FaEnvelope, FaUser, FaImage, FaGlobe, FaPaintBrush, FaRegEye, FaRobot, FaGoogle, FaFacebook, FaRegSave
} from "react-icons/fa";
import { showSuccessToast } from "../../utils/toast";

// Section definitions in English
const SECTIONS = [
  { key: "account", label: "Account", icon: FaUser, desc: "Manage your account information, password, and profile picture." },
  { key: "site", label: "Site", icon: FaGlobe, desc: "Site name, logo, default language, and general information settings." },
  { key: "appearance", label: "Appearance", icon: FaPaintBrush, desc: "Customize site colors, dark mode, and background image." },
  { key: "email", label: "Email", icon: FaEnvelope, desc: "Official contact email and SMTP settings for sending emails." },
  { key: "auth", label: "Authentication", icon: FaLock, desc: "Registration, verification, and login method options." },
  { key: "notifications", label: "Notifications", icon: FaBell, desc: "Enable or disable email and system notifications." },
  { key: "ai", label: "AI", icon: FaRobot, desc: "Set AI usage limits for users." },
];

// أنماط الحقول والأزرار (مصغرة)
const inputBase = "border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition text-sm bg-white";
const inputFile = "border-0 bg-transparent p-0 text-xs";
const saveBtn = "bg-gray-100 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center gap-2 mt-6 shadow-md hover:shadow-lg text-base border border-gray-300";

const SettingsPanel = () => {
  // States
  const [selectedSection, setSelectedSection] = useState("account");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [siteName, setSiteName] = useState("Job Hunter");
  const [siteDesc, setSiteDesc] = useState("");
  const [logo, setLogo] = useState(null);
  const [favicon, setFavicon] = useState(null);
  const [defaultLang, setDefaultLang] = useState("en");
  const [darkMode, setDarkMode] = useState(false);
  const [themeColor, setThemeColor] = useState("#141a2f");
  const [bgImage, setBgImage] = useState(null);
  const [contactEmail, setContactEmail] = useState("");
  const [smtpServer, setSmtpServer] = useState("");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [emailVerification, setEmailVerification] = useState(false);
  const [googleLogin, setGoogleLogin] = useState(false);
  const [facebookLogin, setFacebookLogin] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [systemNotif, setSystemNotif] = useState(true);
  const [aiLimit, setAiLimit] = useState(10);
  const [aiPeriod, setAiPeriod] = useState("day");
  
  // Handle language change
  const handleLanguageChange = (newLang) => {
    setDefaultLang(newLang);
    showSuccessToast(`Language changed to ${newLang === 'ar' ? 'Arabic' : 'English'}`);
  };

  // محتوى كل قسم
  const renderSection = () => {
    const section = SECTIONS.find(s => s.key === selectedSection);
    switch (selectedSection) {
      case "account":
        return (
          <div className="w-full">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-brand"><FaUser size={20}/> Account Settings</h3>
            <p className="text-gray-500 mb-6 text-sm">{section.desc}</p>
            <div className="flex flex-col md:flex-row gap-3 items-center mb-4">
              <input type="email" className={inputBase} placeholder="New Email" value={email} onChange={e => setEmail(e.target.value)} />
              <input type="password" className={inputBase} placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="flex flex-col md:flex-row gap-3 items-center mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <FaImage /> Profile Picture:
                <input type="file" accept="image/*" className={inputFile} onChange={e => setAvatar(e.target.files[0])} />
                <span className="text-xs text-gray-500">{avatar?.name}</span>
              </label>
            </div>
            <button className={saveBtn} onClick={() => showSuccessToast("Account settings saved!")}> <FaRegSave /> Save </button>
          </div>
        );
      case "site":
        return (
          <div className="w-full">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-brand"><FaGlobe size={20}/> Site General Settings</h3>
            <p className="text-gray-500 mb-6 text-sm break-words">{section.desc}</p>
            
            {/* Basic Site Settings */}
            <div className="flex flex-col md:flex-row md:flex-wrap gap-3 items-center mb-4 w-full">
              <input type="text" className={inputBase + ' max-w-xs flex-1'} placeholder="Site Name" value={siteName} onChange={e => setSiteName(e.target.value)} />
              <input type="text" className={inputBase + ' max-w-xs flex-1'} placeholder="Site Description" value={siteDesc} onChange={e => setSiteDesc(e.target.value)} />
            </div>
            
            {/* File Uploads */}
            <div className="flex flex-col md:flex-row md:flex-wrap gap-3 items-center mb-4 w-full">
              <label className="flex items-center gap-2 cursor-pointer truncate">
                <FaImage /> Site Logo:
                <input type="file" accept="image/*" className={inputFile} onChange={e => setLogo(e.target.files[0])} />
                <span className="text-xs text-gray-500 truncate">{logo?.name}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer truncate">
                <FaImage /> Site Favicon:
                <input type="file" accept="image/*" className={inputFile} onChange={e => setFavicon(e.target.files[0])} />
                <span className="text-xs text-gray-500 truncate">{favicon?.name}</span>
              </label>
            </div>
            
            {/* Language Settings */}
            <div className="flex items-center gap-3 mb-4 w-full flex-wrap">
              <FaLanguage className="text-gray-500" />
              <span className="truncate">Default Language:</span>
              <select 
                className={inputBase + " w-32"} 
                value={defaultLang} 
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
                <option value="fr">Français</option>
              </select>
            </div>
            
            <button className={saveBtn} onClick={() => showSuccessToast("Site settings saved!")}> <FaRegSave /> Save </button>
          </div>
        );
      case "appearance":
        return (
          <div className="w-full">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-brand"><FaPaintBrush size={20}/> Appearance Settings</h3>
            <p className="text-gray-500 mb-6 text-sm">{section.desc}</p>
            <div className="flex items-center gap-3 mb-4">
              <FaMoon className="text-gray-500" />
              <span>Dark Mode:</span>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={() => setDarkMode(v => !v)} />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <FaRegEye className="text-gray-500" />
              <span>Primary Color:</span>
              <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} className="w-8 h-8 border-2 border-gray-300 rounded" />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <FaImage className="text-gray-500" />
              <span>Background Image:</span>
              <input type="file" accept="image/*" className={inputFile} onChange={e => setBgImage(e.target.files[0])} />
              <span className="text-xs text-gray-500">{bgImage?.name}</span>
            </div>
            <button className={saveBtn} onClick={() => showSuccessToast("Appearance settings saved!")}> <FaRegSave /> Save </button>
          </div>
        );
      case "email":
        return (
          <div className="w-full">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-brand"><FaEnvelope size={20}/> Email Settings</h3>
            <p className="text-gray-500 mb-6 text-sm">{section.desc}</p>
            <div className="flex flex-col md:flex-row gap-3 items-center mb-4">
              <input type="email" className={inputBase} placeholder="Official Contact Email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
              <input type="text" className={inputBase} placeholder="SMTP Server" value={smtpServer} onChange={e => setSmtpServer(e.target.value)} />
            </div>
            <div className="flex flex-col md:flex-row gap-3 items-center mb-4">
              <input type="text" className={inputBase} placeholder="SMTP Username" value={smtpUser} onChange={e => setSmtpUser(e.target.value)} />
              <input type="password" className={inputBase} placeholder="SMTP Password" value={smtpPass} onChange={e => setSmtpPass(e.target.value)} />
            </div>
            <button className={saveBtn} onClick={() => showSuccessToast("Email settings saved!")}> <FaRegSave /> Save </button>
          </div>
        );
      case "auth":
        return (
          <div className="w-full">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-brand"><FaLock size={20}/> Authentication Settings</h3>
            <p className="text-gray-500 mb-6 text-sm">{section.desc}</p>
            <div className="flex items-center gap-3 mb-4">
              <span>Enable registration for new users:</span>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={registrationEnabled} onChange={() => setRegistrationEnabled(v => !v)} />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span>Enable email verification:</span>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={emailVerification} onChange={() => setEmailVerification(v => !v)} />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <FaGoogle className="text-gray-500" />
              <span>Enable Google login:</span>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={googleLogin} onChange={() => setGoogleLogin(v => !v)} />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <FaFacebook className="text-gray-500" />
              <span>Enable Facebook login:</span>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={facebookLogin} onChange={() => setFacebookLogin(v => !v)} />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>
            <button className={saveBtn} onClick={() => showSuccessToast("Authentication settings saved!")}> <FaRegSave /> Save </button>
          </div>
        );
      case "notifications":
        return (
          <div className="w-full">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-brand"><FaBell size={20}/> Notifications Settings</h3>
            <p className="text-gray-500 mb-6 text-sm">{section.desc}</p>
            <div className="flex items-center gap-3 mb-4">
              <span>Enable email notifications:</span>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={emailNotif} onChange={() => setEmailNotif(v => !v)} />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span>Enable system notifications (Toasts):</span>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={systemNotif} onChange={() => setSystemNotif(v => !v)} />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
              </label>
            </div>
            <button className={saveBtn} onClick={() => showSuccessToast("Notifications settings saved!")}> <FaRegSave /> Save </button>
          </div>
        );
      case "ai":
        return (
          <div className="w-full">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-brand"><FaRobot size={20}/> AI Settings</h3>
            <p className="text-gray-500 mb-6 text-sm">{section.desc}</p>
            <div className="flex flex-col md:flex-row md:flex-wrap gap-3 items-center mb-4 w-full">
              <span className="min-w-[120px]">Max usage:</span>
              <input type="number" min={1} className={inputBase + " max-w-xs flex-1"} value={aiLimit} onChange={e => setAiLimit(e.target.value)} />
              <select className={inputBase + " w-24"} value={aiPeriod} onChange={e => setAiPeriod(e.target.value)}>
                <option value="day">per day</option>
                <option value="month">per month</option>
              </select>
            </div>
            <button className={saveBtn} onClick={() => showSuccessToast("AI settings saved!")}> <FaRegSave /> Save </button>
          </div>
        );
      default:
        return null;
    }
  };

  // واجهة الإعدادات الرئيسية (Tabs أفقي مصغرة)
  return (
    <div className="w-full max-w-4xl mx-auto font-sans min-h-[600px] flex flex-col">
      {/* شريط Tabs أفقي مصغر */}
      <nav className="flex gap-1 md:gap-2 overflow-x-auto border-b border-gray-200 pb-2 mb-6 bg-transparent">
        {SECTIONS.map(sec => {
          const Icon = sec.icon;
          const isActive = selectedSection === sec.key;
          return (
            <button
              key={sec.key}
              className={`flex items-center gap-1 px-3 md:px-4 py-2 rounded-t-lg transition font-medium text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-brand/60
                ${isActive ? "bg-[#c5f8d7] text-black shadow-sm active:bg-[#c5f8d7] active:text-black select-none" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              onClick={() => setSelectedSection(sec.key)}
              type="button"
            >
              <Icon className={isActive ? "text-black" : "text-gray-600"} size={16} />
              {sec.label}
            </button>
          );
        })}
      </nav>
      {/* Main Content مصغر */}
      <main className="flex-1 flex justify-center items-start">
        <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default SettingsPanel; 