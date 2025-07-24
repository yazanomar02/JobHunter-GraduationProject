import React, { useEffect, useState } from "react";
import { contentService } from "../../services/contentService";

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await contentService.getAllFeedbackMessages();
        setMessages(res || []);
      } catch (err) {
        setError("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-10 px-2">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Feedback Messages</h2>
      {loading && <div className="text-gray-500">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && messages.length === 0 && (
        <div className="text-gray-400">No feedback messages yet.</div>
      )}
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {messages.map((msg) => (
          <div key={msg._id} className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-200 flex flex-col gap-1">
            <div className="flex gap-3 items-center mb-1">
              <span className="font-semibold text-blue-700 flex items-center gap-1">
                <i className="fa-regular fa-user"></i> {msg.userName || "Anonymous"}
              </span>
              {msg.email && (
                <a href={`mailto:${msg.email}`} className="text-xs text-blue-600 hover:underline ml-2">
                  {msg.email}
                </a>
              )}
              <span className="text-xs text-gray-400 ml-auto">
                {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
              </span>
            </div>
            <div className="text-gray-700 text-base whitespace-pre-line">{msg.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages; 