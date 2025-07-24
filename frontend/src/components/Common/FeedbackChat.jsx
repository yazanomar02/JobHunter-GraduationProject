import React, { useState } from "react";
import { contentService } from "../../services/contentService";
import { useSelector } from "react-redux";

function FeedbackChat() {
  const { userData } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(userData?.email || "");
  const [name, setName] = useState(userData?.userProfile?.name || userData?.userProfile?.companyName || "");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await contentService.sendFeedbackMessage({
        userId: userData?._id,
        userName: name,
        email,
        message,
      });
      setSuccess(true);
      setMessage("");
    } catch (err) {
      setError("Failed to send message. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* أيقونة عائمة */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all"
        onClick={() => setOpen((v) => !v)}
        title="Send Feedback"
      >
        <i className="fa-regular fa-comment-dots text-2xl"></i>
      </button>
      {/* نافذة الشات */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-blue-200 p-5 flex flex-col gap-3 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-blue-700 text-lg flex items-center gap-2">
              <i className="fa-regular fa-comment-dots"></i> Feedback
            </span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-red-500 text-xl font-bold">×</button>
          </div>
          <form onSubmit={handleSend} className="flex flex-col gap-2">
            <input
              type="text"
              className="border rounded px-3 py-1 text-sm"
              placeholder="Your name (optional)"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              type="email"
              className="border rounded px-3 py-1 text-sm"
              placeholder="Your email (optional)"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <textarea
              className="border rounded px-3 py-2 text-sm min-h-[60px]"
              placeholder="Type your feedback or message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white rounded px-4 py-1.5 font-semibold mt-2 hover:bg-blue-700 transition-all"
              disabled={loading || !message.trim()}
            >
              {loading ? "Sending..." : "Send"}
            </button>
            {success && <div className="text-green-600 text-sm mt-1">Message sent! Thank you for your feedback.</div>}
            {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
          </form>
        </div>
      )}
    </>
  );
}

export default FeedbackChat; 