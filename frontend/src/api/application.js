import axios from "axios";

// Normalize BASE_URL to remove trailing slash if present
const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BASE_URL = rawUrl.replace(/\/+$/, "");

// Debug: Log the API URL being used (remove in production if needed)
console.log("API Base URL:", BASE_URL);

export const getApplications = () => {
  const token = localStorage.getItem("token");  

  return axios.get(`${BASE_URL}/applications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createApplication = (data) => {
  const token = localStorage.getItem("token");

  return axios.post(`${BASE_URL}/applications`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateApplication = (id, data) => {
  const token = localStorage.getItem("token");

  return axios.put(`${BASE_URL}/applications/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteApplication = (id) => {
  const token = localStorage.getItem("token");

  return axios.delete(`${BASE_URL}/applications/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
