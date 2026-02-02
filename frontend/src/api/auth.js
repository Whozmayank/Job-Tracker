// Normalize BASE_URL to remove trailing slash if present
const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BASE_URL = rawUrl.replace(/\/+$/, "");

// Debug: Log the API URL being used (remove in production if needed)
console.log("API Base URL:", BASE_URL);

export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const loginUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};