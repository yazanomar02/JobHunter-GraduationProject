import React from "react";
import { FaUsers, FaBuilding, FaBriefcase, FaCommentDots, FaChartPie, FaCog } from "react-icons/fa";

const sections = [
  { label: "Statistics", key: "stats", icon: <FaChartPie size={18} /> },
  { label: "Users", key: "users", icon: <FaUsers size={18} /> },
  { label: "Companies", key: "companies", icon: <FaBuilding size={18} /> },
  { label: "Jobs", key: "jobs", icon: <FaBriefcase size={18} /> },
  { label: "Feedback", key: "feedback", icon: <FaCommentDots size={18} /> },
  { label: "Settings", key: "settings", icon: <FaCog size={18} /> },
];

const AdminSidebar = ({ section, setSection }) => {
  return (
    <aside className="w-60 bg-white shadow-xl h-screen p-6 flex flex-col">
      <div className="mb-10 flex flex-col items-center">
        <img src="/vite.svg" alt="logo" className="w-10 h-10 mb-2" />
        <span className="text-xl font-extrabold text-green-600 tracking-wide">JobHunter</span>
        <div className="text-xs text-gray-400 mt-1 font-medium">Admin Panel</div>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {sections.map((s) => (
            <li
              key={s.key}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer font-medium transition-all
                ${section === s.key
                  ? "bg-gradient-to-r from-green-100 to-green-200 text-green-700 shadow"
                  : "text-gray-700 hover:bg-gray-100 hover:text-green-600"}
              `}
              onClick={() => setSection(s.key)}
            >
              <span>{s.icon}</span>
              <span className="text-base font-semibold tracking-wide">{s.label}</span>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar; 