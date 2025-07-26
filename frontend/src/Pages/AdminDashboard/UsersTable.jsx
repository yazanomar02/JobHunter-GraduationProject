import React, { useEffect, useState } from "react";
import { getAllUsers, promoteUser, deleteUser, getAdminsCount } from "../../services/adminService";
import { FaTrash, FaUserShield, FaSearch } from "react-icons/fa";
import { showSuccessToast, showErrorToast, showLoadingToast, dismissLoadingToast, dismissLoadingToastWithError } from "../../utils/toast";
import ConfirmationModal from "../../components/Common/ConfirmationModal";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [adminsCount, setAdminsCount] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersResponse, adminsCountResponse] = await Promise.all([
        getAllUsers(),
        getAdminsCount()
      ]);
      setUsers(usersResponse.data);
      setAdminsCount(adminsCountResponse.data.adminsCount);
    } catch (err) {
      setError("Failed to fetch users");
      showErrorToast("فشل في جلب بيانات المستخدمين");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePromote = async (id) => {
    const loadingToast = showLoadingToast("جاري ترقية المستخدم...");
    setActionLoading(id);
    try {
      await promoteUser(id);
      dismissLoadingToast(loadingToast, "تم ترقية المستخدم بنجاح!");
      fetchUsers();
    } catch (err) {
      dismissLoadingToastWithError(loadingToast, "فشل في ترقية المستخدم!");
    }
    setActionLoading("");
  };

  const showPromoteConfirm = (id) => {
    setConfirmAction(() => () => handlePromote(id));
    setConfirmData({ type: "promote", id });
    setShowConfirmModal(true);
  };

  const handleDelete = async (id) => {
    const loadingToast = showLoadingToast("جاري حذف المستخدم...");
    setActionLoading(id);
    try {
      await deleteUser(id);
      dismissLoadingToast(loadingToast, "تم حذف المستخدم بنجاح!");
      fetchUsers();
    } catch (err) {
      dismissLoadingToastWithError(loadingToast, "فشل في حذف المستخدم!");
    }
    setActionLoading("");
  };

  const showDeleteConfirm = (id) => {
    setConfirmAction(() => () => handleDelete(id));
    setConfirmData({ type: "delete", id });
    setShowConfirmModal(true);
  };

  // فلترة وبحث
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!Array.isArray(users)) return <div className="text-red-500">Unexpected error: users is not an array.</div>;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 font-sans">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      {/* شريط البحث والفلترة */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <div className="flex items-center bg-gray-100 rounded px-2 py-1 w-full md:w-1/3">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by username or email..."
            className="bg-transparent outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border rounded px-3 py-1 text-gray-700"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="employer">Employer</option>
          <option value="jobSeeker">Job Seeker</option>
        </select>
      </div>
      {/* الجدول */}
      <div className="overflow-x-auto max-h-96 overflow-y-auto rounded-xl">
        <table className="min-w-full text-right border-separate border-spacing-0 rounded-xl overflow-hidden">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">#</th>
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">Username</th>
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">Email</th>
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">Role</th>
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">Created At</th>
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-6">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u, idx) => (
                <tr
                  key={u._id}
                  className={
                    `transition hover:bg-green-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`
                  }
                >
                  <td className="p-3 border-b border-gray-100">{idx + 1}</td>
                  <td className="p-3 border-b border-gray-100">{u.username}</td>
                  <td className="p-3 border-b border-gray-100">{u.email}</td>
                  <td className="p-3 border-b border-gray-100 font-bold text-green-600">{u.role}</td>
                  <td className="p-3 border-b border-gray-100">{u.createdAt?.slice(0, 10) || "-"}</td>
                  <td className="p-3 border-b border-gray-100 flex gap-2 justify-end">
                    {u.role !== "admin" && (
                      <button
                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition flex items-center justify-center"
                        onClick={() => showPromoteConfirm(u._id)}
                        disabled={actionLoading === u._id}
                        title="Promote to Admin"
                      >
                        <FaUserShield />
                      </button>
                    )}
                    {/* إظهار زر الحذف للمستخدمين العاديين والأدمنات (إذا كان هناك أكثر من أدمن) */}
                    {(u.role !== "admin" || (u.role === "admin" && adminsCount > 1)) && (
                      <button
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition flex items-center justify-center"
                        onClick={() => showDeleteConfirm(u._id)}
                        disabled={actionLoading === u._id}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    )}
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
        title={
          confirmData?.type === "promote" 
            ? "ترقية المستخدم" 
            : "حذف المستخدم"
        }
        message={
          confirmData?.type === "promote"
            ? "هل أنت متأكد من ترقية هذا المستخدم إلى مدير؟"
            : `هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذه العملية.${
                users.find(u => u._id === confirmData?.id)?.role === "admin" 
                  ? `\n\nملاحظة: سيتم حذف هذا الأدمن من النظام.`
                  : ""
              }`
        }
        confirmText={
          confirmData?.type === "promote" ? "ترقية" : "حذف"
        }
        type={confirmData?.type === "promote" ? "warning" : "danger"}
      />
    </div>
  );
};

export default UsersTable; 