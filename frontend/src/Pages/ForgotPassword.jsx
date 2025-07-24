import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../components/assets/media/JobHunter.png";
import { userService } from "../services/userService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      await userService.forgotPassword({ email });
      setSuccess("If this email exists, a reset link has been sent.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link. Please check your email or try again later.");
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
              Forgot your password?
            </h2>
            <p className="hidden sm:block font-light sm:pl-3 sm:text-lg text-white xl:text-xl xl:pl-16">
              Enter your email and we'll send you a reset link.
            </p>
          </div>
        </div>
        <div className="w-full sm:w-3/6 pt-7 sm:pt-14 md:w-2/5">
          <div className="p-3 sm:p-10">
            <h2 className="text-3xl font-bold">Forgot Password</h2>
            <p className="mt-3">Enter your email to reset your password.</p>
            <form className="mt-6" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label className="font-semibold">Email:</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="rounded h-10 text-base pl-5 mb-3 border-x border-y border-gray-400"
                  placeholder="Email"
                />
                <button className="bg-black rounded-md text-white font-normal text-sm h-11 mt-2" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword; 