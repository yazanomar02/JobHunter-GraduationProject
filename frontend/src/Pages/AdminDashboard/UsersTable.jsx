import React, { useEffect, useState } from "react";
import { getAllUsers, promoteUser, deleteUser } from "../../services/adminService";
import { FaTrash, FaUserShield, FaSearch } from "react-icons/fa";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePromote = async (id) => {
    if (!window.confirm("Are you sure you want to promote this user to Admin?")) return;
    setActionLoading(id);
    try {
      await promoteUser(id);
      fetchUsers();
    } catch (err) {
      alert("Failed to promote user!");
    }
    setActionLoading("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setActionLoading(id);
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user!");
    }
    setActionLoading("");
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
                        onClick={() => handlePromote(u._id)}
                        disabled={actionLoading === u._id}
                        title="Promote to Admin"
                      >
                        <FaUserShield />
                      </button>
                    )}
                    {u.role !== "admin" && (
                      <button
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition flex items-center justify-center"
                        onClick={() => handleDelete(u._id)}
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
    </div>
  );
};

export default UsersTable; 