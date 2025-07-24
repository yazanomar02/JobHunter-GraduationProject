import React, { useState, useEffect } from "react";
import EditProfile from "../components/UserProfile/EditProfile";
import UpdateResume from "../components/UserProfile/UpdateResume";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { userService } from "../services/userService";

function UserProfile() {
  const { status, userData } = useSelector((store) => store.auth);

  if (userData.role === "employer") {
    return <Navigate to="/" />;
  }
  const [selectedSection, setSelectedSection] = useState("editProfile");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cpLoading, setCpLoading] = useState(false);
  const [cpSuccess, setCpSuccess] = useState("");
  const [cpError, setCpError] = useState("");

  const switchSection = (section) => {
    setSelectedSection(section);
  };

  const navigate = useNavigate();

  const openPublicProfile = () => {
    navigate(`/user/${userData._id}`);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setCpSuccess("");
    setCpError("");
    setCpLoading(true);
    if (newPassword.length < 6) {
      setCpError("Password must be at least 6 characters.");
      setCpLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setCpError("Passwords do not match.");
      setCpLoading(false);
      return;
    }
    try {
      const res = await userService.changePassword({ currentPassword, newPassword });
      setCpSuccess(res?.message || "Password changed successfully");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err) {
      setCpError(err.response?.data?.message || "Failed to change password. Try again.");
    } finally {
      setCpLoading(false);
    }
  };

  useEffect(() => {
    if (cpSuccess) {
      const timer = setTimeout(() => setShowChangePassword(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [cpSuccess]);

  return (
    <div className="mt-20 xl:px-28 px-5">
      <div>
        <div>
          <h2 className="font-medium text-4xl">Edit your Jobhunter profile</h2>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between border-b mt-10 md:items-center pb-3 md:pb-0">
          <div className="flex gap-6 mb-3 md:mb-0 ">
            <div
              className={`hover:cursor-pointer text-gray-600 ${
                selectedSection === "editProfile"
                  ? "text-black border-b-2 border-gray-600"
                  : "hover:border-b-2 hover:border-gray-300"
              } pb-3 hover:text-green-500`}
              onClick={() => switchSection("editProfile")}
            >
              Profile
            </div>
            <div
              className={`hover:cursor-pointer text-gray-600 ${
                selectedSection === "resume"
                  ? "text-black border-b-2 border-gray-600"
                  : "hover:border-b-2 hover:border-gray-300"
              } pb-3 hover:text-green-500`}
              onClick={() => switchSection("resume")}
            >
              Resume / CV
            </div>
          </div>

            <div className="flex gap-4">
                <div
                className="text-sm font-medium text-blue-500 hover:cursor-pointer"
                onClick={() => setShowChangePassword((v) => !v)}
              >
                Change your password
              </div>

              <div
              className="text-sm font-medium text-green-500 hover:cursor-pointer"
              onClick={openPublicProfile}
            >
              View public profile
            </div>
            </div>
        
        </div>
      </div>
      {/* نموذج تغيير كلمة المرور */}
      {showChangePassword && (
        <div className="flex justify-center items-center w-full min-h-[300px]">
          <form onSubmit={handleChangePassword} className="mt-6 max-w-md w-full bg-white border rounded-lg p-6 flex flex-col gap-3 shadow">
            <label className="font-semibold">Current Password:</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="rounded h-10 text-base pl-5 mb-2 border border-gray-400"
              placeholder="Enter current password"
            />
            <label className="font-semibold">New Password:</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="rounded h-10 text-base pl-5 mb-2 border border-gray-400"
              placeholder="Enter new password"
            />
            <label className="font-semibold">Confirm New Password:</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="rounded h-10 text-base pl-5 mb-2 border border-gray-400"
              placeholder="Confirm new password"
            />
            <button className="bg-black rounded-md text-white font-normal text-sm h-11 mt-2" disabled={cpLoading}>
              {cpLoading ? "Changing..." : "Change Password"}
            </button>
            {cpSuccess && <span className="text-green-600 text-sm mt-2">{cpSuccess}</span>}
            {cpError && <span className="text-red-600 text-sm mt-2">{cpError}</span>}
          </form>
        </div>
      )}
      <div className="border my-5 ">
        {selectedSection === "editProfile" && <EditProfile />}
        {selectedSection === "resume" && <UpdateResume />}
      </div>
    </div>
  );
}

export default UserProfile;
