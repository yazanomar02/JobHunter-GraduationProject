import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import logo from "../components/assets/media/JobHunter.png";
import { userService } from "../services/userService";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const urlToken = searchParams.get("token");
    if (urlToken) setToken(urlToken);
  }, [searchParams]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate("/login"), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);
    if (!token) {
      setError("Reset token is required.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      const res = await userService.resetPassword({ token, password });
      setSuccess(res?.message || "Password reset successfully! You can now login.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Try again.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="hidden font-semibold text-xl cursor-pointer md:flex items-center text-gray-800 px-16 mt-3">
        <Link to="/" className="flex items-center font-Poppins">
          <img src={logo} className="w-10 rounded-lg mr-3" alt="JobHunter Logo" />
          / jobhunter
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-3/6 sm:h-screen flex items-center justify-center sm:pt-5 sm:pl-5 md:w-3/5 lg:pl-16 lg:pt-5">
          <div className="h-full w-full sm:text-right sm:pr-12 bg-black sm:pt-24 sm:pl-14 text-green-500 sm:rounded-t-lg lg:pt-44">
            <h2 className="py-4 text-xl text-center sm:text-5xl sm:text-right font-bold sm:mb-5 sm:pl-4 xl:text-6xl ">
              Reset your password
            </h2>
            <p className="hidden sm:block font-light sm:pl-3 sm:text-lg text-white xl:text-xl xl:pl-16">
              Enter the reset code you received and choose a new password.
            </p>
          </div>
        </div>
        <div className="w-full sm:w-3/6 pt-7 sm:pt-14 md:w-2/5">
          <div className="p-3 sm:p-10">
            <h2 className="text-3xl font-bold">Reset Password</h2>
            <p className="mt-3">Enter your reset code and new password.</p>
            <form className="mt-6" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label className="font-semibold">Reset Code:</label>
                <input
                  type="text"
                  name="token"
                  required
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  className="rounded h-10 text-base pl-5 mb-3 border-x border-y border-gray-400"
                  placeholder="Paste your reset code here"
                  disabled={!!searchParams.get("token")}
                />
                <label className="font-semibold">New Password:</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="rounded h-10 text-base pl-5 mb-3 border-x border-y border-gray-400"
                  placeholder="Enter new password"
                />
                <label className="font-semibold">Confirm Password:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="rounded h-10 text-base pl-5 mb-3 border-x border-y border-gray-400"
                  placeholder="Confirm new password"
                />
                <button className="bg-black rounded-md text-white font-normal text-sm h-11 mt-2" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
                {success && <span className="text-green-600 text-sm mt-2">{success}</span>}
                {error && <span className="text-red-600 text-sm mt-2">{error}</span>}
              </div>
            </form>
            <div className="mt-5">
              <p className="cursor-pointer text-center">
                Remembered your password? {" "}
                <Link to="/login" className="underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword; 