import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminStats from "./AdminStats";
import UsersTable from "./UsersTable";
import CompaniesTable from "./CompaniesTable";
import JobsTable from "./JobsTable";
import FeedbackTable from "./FeedbackTable";
import SettingsPanel from "./SettingsPanel";

const AdminDashboard = () => {
  const [section, setSection] = React.useState("stats");
  return (
    <div className="flex min-h-screen bg-gray-50 font-Poppins">
      {/* الشريط الجانبي */}
      <div className="pt-20">
        <AdminSidebar section={section} setSection={setSection} />
      </div>
      <div className="flex-1 flex flex-col">
        {/* الهيدر */}
        {/* المحتوى الرئيسي */}
        <main className="flex-1 p-6 pt-20">
          {section === "stats" && <AdminStats />}
          {section === "users" && <UsersTable />}
          {section === "companies" && <CompaniesTable />}
          {section === "jobs" && <JobsTable />}
          {section === "feedback" && <FeedbackTable />}
          {section === "settings" && <SettingsPanel />}
          {/* TODO: إضافة بقية الأقسام */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 