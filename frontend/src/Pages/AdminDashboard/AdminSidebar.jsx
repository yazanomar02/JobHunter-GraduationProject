import React from "react";
import { FaUsers, FaBuilding, FaBriefcase, FaCommentDots, FaChartPie, FaCog } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";
import { userService } from "../../services/userService";

const sections = [
  { label: "Statistics", key: "stats", icon: <FaChartPie size={18} /> },
  { label: "Users", key: "users", icon: <FaUsers size={18} /> },
  { label: "Companies", key: "companies", icon: <FaBuilding size={18} /> },
  { label: "Jobs", key: "jobs", icon: <FaBriefcase size={18} /> },
  { label: "Feedback", key: "feedback", icon: <FaCommentDots size={18} /> },
  { label: "Settings", key: "settings", icon: <FaCog size={18} /> },
];

const AdminSidebar = ({ section, setSection }) => {
  const { userData } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    userService
      .logout()
      .then(() => {
        dispatch(logout());
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <aside className="bg-white shadow-lg w-64 h-screen flex flex-col border-r">
      {/* Header */}
      <div className="mb-10 flex flex-col items-center pt-5">
        <span className="text-xl font-extrabold text-green-600 tracking-wide">JobHunter</span>
        <div className="text-xs text-gray-400 mt-1 font-medium">Admin Panel</div>
      </div>
      
      {/* Navigation - Scrollable */}
      <nav className="flex-1 overflow-y-auto px-4">
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

      {/* User Info Section - Sticky at bottom */}
      <div className="ie-user items-center gap-3 px-3 flex py-4 bg-white border-t border-gray-200 sticky bottom-0">
        <div className="h-10 w-10 rounded-full p-px overflow-hidden border bg-green-600 flex items-center justify-center text-white font-semibold">
          {userData?.username?.charAt(0)?.toUpperCase() || 'A'}
        </div>
        <div className="ie-userDetails">
          <div className="flex justify-between gap-2">
            <span className="text-base font-semibold text-gray-700">
              {userData?.username || 'Admin'}
            </span>
            <div className="group flex cursor-pointer items-center gap-1 rounded-full bg-gray-100 px-2 py-1 transition-all hover:bg-gray-50">
              <span
                className="text-xs font-medium text-gray-700 group-hover:text-red-700"
                onClick={handleLogout}
              >
                Logout
              </span>
            </div>
          </div>
          <span className="mt-1 block text-sm font-medium text-gray-700">
            Logged in as Administrator
          </span>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;