const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  ADMIN: `${API_BASE_URL}/api/auth/admin`,
  EMPLOYEE: `${API_BASE_URL}/api/auth/employee`,
  LEAVE_HISTORY_RANGE: `${API_BASE_URL}/api/auth/leave-history-range`,
};

export default API_BASE_URL;
