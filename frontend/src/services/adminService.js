import axios from "axios";

const API = "/api/v1/admin";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // ضمان أن جميع الطلبات تذهب للباك اند الصحيح
  withCredentials: true,
});

// Add Authorization header if accessToken exists
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export const getAllUsers = () => axiosInstance.get(`${API}/users`);
export const promoteUser = (id) => axiosInstance.patch(`${API}/users/${id}/promote`);
export const deleteUser = (id) => axiosInstance.delete(`${API}/users/${id}`);

export const getAllCompanies = () => axiosInstance.get(`${API}/companies`);
export const deleteCompany = (id) => axiosInstance.delete(`${API}/companies/${id}`);

export const getAllJobs = () => axiosInstance.get(`${API}/jobs`);
export const deleteJob = (id) => axiosInstance.delete(`${API}/jobs/${id}`);

export const getAllFeedback = () => axiosInstance.get(`${API}/feedback`);
export const deleteFeedback = (id) => axiosInstance.delete(`${API}/feedback/${id}`);
export const getAdminStats = () => axiosInstance.get(`${API}/stats`);
export const getAdminsCount = () => axiosInstance.get(`${API}/admins-count`); 