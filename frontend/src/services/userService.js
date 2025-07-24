import { apiCall } from "./apiBase";

export const userService = {
  login,
  signup,
  logout,
  getCurrentUser,
  updateProfilePicture,
  updateUserProfile,
  addSkill,
  removeSkill,
  updateResume,
  saveJob,
  applyForJob,
  removeSavedJob,
  getPublicProfile,
  forgotPassword,
  resetPassword,
  changePassword,
};

async function login(userData) {
  return apiCall("post", "/users/login", userData);
}

async function signup(userData) {
  return apiCall("post", "/users/signup", userData);
}

async function updateProfilePicture(file) {
  const formPayload = new FormData();
  formPayload.append("profilePicture", file);
  return apiCall("post", "/users/profile-picture", formPayload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

async function logout() {
  return apiCall("get", "/users/logout");
}

async function getCurrentUser() {
  return await apiCall("get", "/users/profile");
}

async function updateUserProfile(data) {
  return apiCall("patch", "/users/profile/jobseeker", data);
}

async function addSkill(skill) {
  return apiCall("post", "/users/add-skill", { skill });
}

async function removeSkill(skill) {
  return apiCall("delete", "/users/remove-skill", { skill });
}

async function updateResume(resume) {
  return apiCall("post", "/users/resume", { resume });
}

async function saveJob(id) {
  return apiCall("post", `/save/${id}`);
}

async function applyForJob(id) {
  return apiCall("post", `/apply/${id}`);
}

async function removeSavedJob(jobId) {
  return apiCall("delete", `/remove-saved-job/${jobId}`);
}

async function getPublicProfile(id) {
  return await apiCall("get", `/users/public-profile/${id}`);
}

async function forgotPassword(data) {
  return apiCall("post", "/users/forgot-password", data);
}

async function resetPassword(data) {
  return apiCall("post", "/users/reset-password", data);
}

async function changePassword(data) {
  return apiCall("patch", "/users/change-password", data);
}
