import React, { useEffect, useState } from "react";
import { getAdminStats } from "../../services/adminService";
import { FaUsers, FaBuilding, FaBriefcase, FaCommentDots } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const statsConfig = [
  { label: "Users", color: "from-blue-500 to-blue-700", icon: <FaUsers size={24} />, pieColor: "#3B82F6" },
  { label: "Companies", color: "from-green-500 to-green-700", icon: <FaBuilding size={24} />, pieColor: "#22C55E" },
  { label: "Jobs", color: "from-yellow-500 to-yellow-600", icon: <FaBriefcase size={24} />, pieColor: "#EAB308" },
  { label: "Feedback", color: "from-pink-500 to-pink-600", icon: <FaCommentDots size={24} />, pieColor: "#EC4899" },
];

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getAdminStats()
      .then(({ data }) => {
        if (!data || typeof data !== "object" || !("users" in data)) {
          setError("No statistics data available or unauthorized.");
        } else {
          setStats(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch statistics");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!stats) return <div className="text-red-500">No statistics data available.</div>;

  const values = [stats.users, stats.companies, stats.jobs, stats.feedback];
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const pieData = statsConfig.map((cfg, idx) => ({
    name: cfg.label,
    value: values[idx],
    color: cfg.pieColor,
  }));

  return (
    <div className="flex flex-col gap-8 mb-8">
      {/* Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsConfig.map((cfg, idx) => (
          <div
            key={cfg.label}
            className={`relative rounded-xl shadow-lg p-4 flex flex-col items-center text-white bg-gradient-to-br ${cfg.color} transition-transform duration-200 hover:scale-105 min-w-[120px]`}
          >
            <div className="z-10 mb-2">{cfg.icon}</div>
            <div className="z-10 text-3xl font-extrabold mb-1 drop-shadow">{values[idx]}</div>
            <div className="z-10 text-base font-semibold tracking-wide">{cfg.label}</div>
          </div>
        ))}
      </div>
      {/* Pie Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statsConfig.map((cfg, idx) => (
          <div key={cfg.label} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <div className="font-semibold mb-2 text-gray-700">{cfg.label} Distribution</div>
            <div className="w-28 h-28">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: cfg.label, value: values[idx] },
                      { name: "Other", value: total - values[idx] },
                    ]}
                    dataKey="value"
                    innerRadius={28}
                    outerRadius={44}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <Cell key="main" fill={cfg.pieColor} />
                    <Cell key="other" fill="#e5e7eb" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStats; 