const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  ADMIN: `${API_BASE_URL}/api/auth/admin`,
  EMPLOYEE: (id) => `${API_BASE_URL}/api/auth/employee/${id}`,
  ADMIN_BY_ID: (id) => `${API_BASE_URL}/api/auth/admin/${id}`,
  ASK_LEAVE: (id) => `${API_BASE_URL}/api/auth/employee/${id}/ask-leave`,
  GRANT_LEAVE: (id) => `${API_BASE_URL}/api/auth/admin/${id}/grant-leave`,
  DELETE_EMPLOYEE: (id) => `${API_BASE_URL}/api/auth/admin/${id}`,
  LEAVE_HISTORY_RANGE: `${API_BASE_URL}/api/auth/leave-history-range`,
};

export default API_BASE_URL;
