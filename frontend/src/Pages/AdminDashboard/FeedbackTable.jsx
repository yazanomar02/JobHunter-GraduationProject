import React, { useEffect, useState } from "react";
import { getAllFeedback, deleteFeedback } from "../../services/adminService";
import { FaTrash, FaSearch } from "react-icons/fa";
import { showSuccessToast, showErrorToast, showLoadingToast, dismissLoadingToast, dismissLoadingToastWithError } from "../../utils/toast";
import ConfirmationModal from "../../components/Common/ConfirmationModal";

const FeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [search, setSearch] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getAllFeedback();
      setFeedbacks(data);
    } catch (err) {
      setError("Failed to fetch feedback messages");
      showErrorToast("فشل في جلب رسائل التغذية الراجعة");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id) => {
    const loadingToast = showLoadingToast("جاري حذف الرسالة...");
    setActionLoading(id);
    try {
      await deleteFeedback(id);
      dismissLoadingToast(loadingToast, "تم حذف الرسالة بنجاح!");
      fetchFeedbacks();
    } catch (err) {
      dismissLoadingToastWithError(loadingToast, "فشل في حذف الرسالة!");
    }
    setActionLoading("");
  };

  const showDeleteConfirm = (id) => {
    setConfirmAction(() => () => handleDelete(id));
    setShowConfirmModal(true);
  };

  // بحث
  const filteredFeedbacks = feedbacks.filter((f) => {
    return (
      f.email?.toLowerCase().includes(search.toLowerCase()) ||
      f.message?.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!Array.isArray(feedbacks)) return <div className="text-red-500">Unexpected error: feedbacks is not an array.</div>;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 font-sans">
      <h2 className="text-2xl font-bold mb-4">User Feedback Review</h2>
      {/* شريط البحث */}
      <div className="flex items-center bg-gray-100 rounded px-2 py-1 w-full md:w-1/3 mb-4">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search by email or message..."
          className="bg-transparent outline-none w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* الجدول */}
      <div className="overflow-x-auto max-h-96 overflow-y-auto rounded-xl">
        <table className="min-w-full text-right border-separate border-spacing-0 rounded-xl overflow-hidden">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">#</th>
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">Email</th>
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">Message</th>
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">Sent At</th>
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-6">
                  No feedback messages found.
                </td>
              </tr>
            ) : (
              filteredFeedbacks.map((f, idx) => (
                <tr
                  key={f._id}
                  className={
                    `transition hover:bg-green-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`
                  }
                >
                  <td className="p-3 border-b border-gray-100">{idx + 1}</td>
                  <td className="p-3 border-b border-gray-100">{f.email}</td>
                  <td className="p-3 border-b border-gray-100">{f.message}</td>
                  <td className="p-3 border-b border-gray-100">{f.createdAt?.slice(0, 10) || "-"}</td>
                  <td className="p-3 border-b border-gray-100 flex gap-2 justify-end">
                    <button
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition flex items-center justify-center"
                      onClick={() => showDeleteConfirm(f._id)}
                      disabled={actionLoading === f._id}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmAction}
        title="حذف الرسالة"
        message="هل أنت متأكد من حذف هذه الرسالة؟ لا يمكن التراجع عن هذه العملية."
        confirmText="حذف"
        type="danger"
      />
    </div>
  );
};

export default FeedbackTable; 