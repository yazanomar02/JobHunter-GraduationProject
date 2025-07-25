import React, { useEffect, useState } from "react";
import { getAllJobs, deleteJob } from "../../services/adminService";
import { FaTrash, FaSearch } from "react-icons/fa";

const JobsTable = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [search, setSearch] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getAllJobs();
      setJobs(data);
    } catch (err) {
      setError("Failed to fetch jobs");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    setActionLoading(id);
    try {
      await deleteJob(id);
      fetchJobs();
    } catch (err) {
      alert("Failed to delete job!");
    }
    setActionLoading("");
  };

  // بحث
  const filteredJobs = jobs.filter((j) => {
    return (
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.companyId?.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!Array.isArray(jobs)) return <div className="text-red-500">Unexpected error: jobs is not an array.</div>;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 font-sans">
      <h2 className="text-2xl font-bold mb-4">Job Management</h2>
      {/* شريط البحث */}
      <div className="flex items-center bg-gray-100 rounded px-2 py-1 w-full md:w-1/3 mb-4">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search by job title or company..."
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
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">Title</th>
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">Company</th>
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">Created At</th>
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">Status</th>
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-6">
                  No jobs found.
                </td>
              </tr>
            ) : (
              filteredJobs.map((j, idx) => (
                <tr
                  key={j._id}
                  className={
                    `transition hover:bg-green-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`
                  }
                >
                  <td className="p-3 border-b border-gray-100">{idx + 1}</td>
                  <td className="p-3 border-b border-gray-100">{j.title}</td>
                  <td className="p-3 border-b border-gray-100">{j.companyId}</td>
                  <td className="p-3 border-b border-gray-100">{j.createdAt?.slice(0, 10) || "-"}</td>
                  <td className="p-3 border-b border-gray-100">
                    <span className={j.active ? "text-green-600 font-bold" : "text-gray-400"}>{j.active ? "Active" : "Inactive"}</span>
                  </td>
                  <td className="p-3 border-b border-gray-100 flex gap-2 justify-end">
                    <button
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition flex items-center justify-center"
                      onClick={() => handleDelete(j._id)}
                      disabled={actionLoading === j._id}
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
    </div>
  );
};

export default JobsTable; 