import React, { useEffect, useState } from "react";
import { getCompanyNotifications, getApplicantMessages } from "../../services/companyService";
import { FaBell, FaUserCircle, FaEnvelope } from "react-icons/fa";

function mergeMessagesAndNotifications(messages, notifications) {
  // دمج الرسائل والإشعارات حسب المتقدم والوظيفة
  const merged = [];
  messages.forEach((msg) => {
    const notif = notifications.find(
      (n) => n.job === msg.jobId || n.job === msg.jobTitle // دعم الحالتين
    );
    merged.push({
      ...msg,
      notification: notif ? notif.message : "",
      notificationDate: notif ? notif.date : "",
      notificationType: notif ? notif.type : "",
      notificationRead: notif ? notif.read : false,
    });
  });
  return merged;
}

function getJobTitleById(jobId, messages) {
  const found = messages.find((msg) => msg.jobId === jobId || msg.jobTitle === jobId);
  return found ? found.jobTitle : jobId;
}

function formatNotifType(type) {
  if (type === "applicant") return "New Applicant";
  if (type === "job-status") return "Job Status";
  return type;
}

function formatRead(read) {
  return read ? <span className="text-green-600 font-semibold">Read</span> : <span className="text-red-500 font-semibold">Unread</span>;
}

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString();
}

function mergeMessagesWithNotifications(messages, notifications) {
  // لكل رسالة متقدم، ابحث عن إشعار لنفس الوظيفة
  return messages.map((msg) => {
    const notif = notifications.find((n) => n.job === msg.jobTitle || n.job === msg.jobId);
    return {
      ...msg,
      notificationMessage: notif ? notif.message : "",
      notificationType: notif ? notif.type : "",
      notificationDate: notif ? notif.date : "",
    };
  });
}

function mergeAllNotificationsWithMessages(messages, notifications) {
  // لكل إشعار، ابحث عن رسالة متقدم مرتبطة بنفس الوظيفة
  return notifications.map((notif) => {
    const msg = messages.find(
      (m) => m.jobTitle === notif.job || m.jobId === notif.job
    );
    return {
      applicantAvatar: msg ? msg.applicantAvatar : "",
      applicantName: msg ? msg.applicantName : "-",
      jobTitle: msg ? msg.jobTitle : notif.job,
      message: msg ? msg.message : "",
      date: msg ? msg.date : "",
      notificationMessage: notif.message,
      notificationType: notif.type,
      notificationDate: notif.date,
    };
  });
}

function mergeNotificationsAndApplicants(messages, notifications) {
  // بناء map لكل سطر حسب الوظيفة والمتقدم
  const rowMap = {};

  // أضف رسائل المتقدمين أولاً
  messages.forEach((msg) => {
    const key = `${msg.jobTitle || msg.jobId}_${msg.applicantName || ""}`;
    rowMap[key] = {
      applicantAvatar: msg.applicantAvatar || "",
      applicantName: msg.applicantName || "-",
      jobTitle: msg.jobTitle || msg.jobId || "-",
      message: msg.message || "",
      messageDate: msg.date || "",
      notificationMessage: "",
      notificationType: "",
      notificationDate: "",
    };
  });

  // أضف الإشعارات (إذا كان هناك سطر لنفس الوظيفة والمتقدم، أدمجها، وإلا أنشئ سطر جديد)
  notifications.forEach((notif) => {
    // حاول إيجاد رسالة متقدم لنفس الوظيفة (حسب jobTitle أو jobId)
    let foundKey = Object.keys(rowMap).find(
      (key) => key.startsWith(`${notif.job}_`) // jobId فقط
    );
    if (foundKey) {
      rowMap[foundKey].notificationMessage = notif.message || "";
      rowMap[foundKey].notificationType = notif.type || "";
      rowMap[foundKey].notificationDate = notif.date || "";
    } else {
      // لا يوجد رسالة متقدم، أضف سطر جديد فقط للإشعار
      const key = `${notif.job}_-`;
      rowMap[key] = {
        applicantAvatar: "",
        applicantName: "-",
        jobTitle: notif.job || "-",
        message: "",
        messageDate: "",
        notificationMessage: notif.message || "",
        notificationType: notif.type || "",
        notificationDate: notif.date || "",
      };
    }
  });

  // أعد القيم كمصفوفة
  return Object.values(rowMap);
}

function Messages() {
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [notifRes, msgRes] = await Promise.all([
          getCompanyNotifications(),
          getApplicantMessages(),
        ]);
        const extractArray = (res) => {
          if (Array.isArray(res)) return res;
          if (Array.isArray(res?.data)) return res.data;
          if (Array.isArray(res?.data?.data)) return res.data.data;
          return [];
        };
        setNotifications(extractArray(notifRes));
        setMessages(extractArray(msgRes));
      } catch (err) {
        // ignore error for now
      }
    }
    fetchData();
  }, []);

  // دمج الرسائل مع الإشعارات حسب الوظيفة
  const mergedRows = mergeNotificationsAndApplicants(messages, notifications);

  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 w-full">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Company Applications & Notifications</h2>
      <div className="w-full max-w-5xl">
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                <th className="py-2 px-4 text-left">Applicant</th>
                <th className="py-2 px-4 text-left">Job Title</th>
                <th className="py-2 px-4 text-left">Message</th>
                <th className="py-2 px-4 text-left">Message Date</th>
                <th className="py-2 px-4 text-left">Notification Message</th>
                <th className="py-2 px-4 text-left">Notification Type</th>
                <th className="py-2 px-4 text-left">Notification Date</th>
              </tr>
            </thead>
            <tbody>
              {mergedRows.length === 0 && (
                <tr><td colSpan={7} className="text-center text-gray-400 py-4">No data yet.</td></tr>
              )}
              {mergedRows.map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-blue-50">
                  <td className="py-2 px-4 flex items-center gap-2">
                    {row.applicantAvatar && (
                      <img src={row.applicantAvatar} alt={row.applicantName} className="w-10 h-10 rounded-full border object-cover" />
                    )}
                    <span className="font-semibold text-green-700">{row.applicantName}</span>
                  </td>
                  <td className="py-2 px-4">{row.jobTitle}</td>
                  <td className="py-2 px-4 whitespace-pre-line text-gray-700">{row.message}</td>
                  <td className="py-2 px-4">{row.messageDate ? new Date(row.messageDate).toLocaleString() : ""}</td>
                  <td className="py-2 px-4 whitespace-pre-line text-blue-700">{row.notificationMessage}</td>
                  <td className="py-2 px-4">{row.notificationType}</td>
                  <td className="py-2 px-4">{row.notificationDate ? new Date(row.notificationDate).toLocaleString() : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Messages; 