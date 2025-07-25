import React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
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
      <AdminSidebar section={section} setSection={setSection} />
      <div className="flex-1 flex flex-col">
        {/* الهيدر */}
        <AdminHeader />
        {/* المحتوى الرئيسي */}
        <main className="flex-1 p-6">
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