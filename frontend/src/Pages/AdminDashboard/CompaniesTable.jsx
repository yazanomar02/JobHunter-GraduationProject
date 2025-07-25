import React, { useEffect, useState } from "react";
import { getAllCompanies, deleteCompany } from "../../services/adminService";
import { FaTrash, FaSearch } from "react-icons/fa";

const CompaniesTable = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [search, setSearch] = useState("");

  const fetchCompanies = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getAllCompanies();
      setCompanies(data);
    } catch (err) {
      setError("Failed to fetch companies");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    setActionLoading(id);
    try {
      await deleteCompany(id);
      fetchCompanies();
    } catch (err) {
      alert("Failed to delete company!");
    }
    setActionLoading("");
  };

  // بحث
  const filteredCompanies = companies.filter((c) => {
    return (
      c.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!Array.isArray(companies)) return <div className="text-red-500">Unexpected error: companies is not an array.</div>;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 font-sans">
      <h2 className="text-2xl font-bold mb-4">Company Management</h2>
      {/* شريط البحث */}
      <div className="flex items-center bg-gray-100 rounded px-2 py-1 w-full md:w-1/3 mb-4">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search by company name or email..."
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
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">Company Name</th>
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">Logo</th>
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">Email</th>
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">Created At</th>
              <th className="p-3 text-base font-bold text-gray-700 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-6">
                  No companies found.
                </td>
              </tr>
            ) : (
              filteredCompanies.map((c, idx) => (
                <tr
                  key={c._id}
                  className={
                    `transition hover:bg-green-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`
                  }
                >
                  <td className="p-3 border-b border-gray-100">{idx + 1}</td>
                  <td className="p-3 border-b border-gray-100">{c.userProfile?.companyName}</td>
                  <td className="p-3 border-b border-gray-100">{c.userProfile?.companyLogo && (
                    <img src={c.userProfile.companyLogo} alt="logo" className="w-8 h-8 rounded-full inline-block" />
                  )}</td>
                  <td className="p-3 border-b border-gray-100">{c.email}</td>
                  <td className="p-3 border-b border-gray-100">{c.createdAt?.slice(0, 10) || "-"}</td>
                  <td className="p-3 border-b border-gray-100 flex gap-2 justify-end">
                    <button
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition flex items-center justify-center"
                      onClick={() => handleDelete(c._id)}
                      disabled={actionLoading === c._id}
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

export default CompaniesTable; 