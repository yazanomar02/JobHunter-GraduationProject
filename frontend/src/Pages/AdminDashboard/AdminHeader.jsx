import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";

const DEFAULT_AVATAR = "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg";

const AdminHeader = () => {
  const userData = useSelector((store) => store.auth.userData);
  // Debug: Print userData
  console.log("[AdminHeader] userData:", userData);
  const avatarUrl = userData?.userProfile?.profilePicture || DEFAULT_AVATAR;
  const displayName = userData?.username || "";
  return (
    <header className="bg-white shadow flex items-center justify-between px-8 py-4">
      <div className="flex items-center gap-2">
        <img src="/vite.svg" alt="logo" className="w-8 h-8" />
        <span className="font-bold text-lg text-green-600">JobHunter</span>
        <Link to="/admin" className="ml-4 px-3 py-1 bg-green-100 text-green-700 rounded font-semibold hover:bg-green-200 transition">Admin Dashboard</Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium">Hello, Admin</span>
        {/* Avatar */}
        {displayName ? (
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-green-500 shadow"
            onError={e => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-500 border-2 border-gray-300">
            <FaUserCircle />
          </div>
        )}
        <button className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition">Logout</button>
      </div>
    </header>
  );
};

export default AdminHeader; 