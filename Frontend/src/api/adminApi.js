const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getToken = () => localStorage.getItem("token");

const buildHeaders = (headers = {}) => {
  const token = getToken();
  return token
    ? { ...headers, Authorization: `Bearer ${token}` }
    : { ...headers };
};

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const request = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, options);
  const data = await parseJsonSafely(response);

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error(data?.message || "Session expired. Please login again.");
    }
    throw new Error(data?.message || `Request failed with ${response.status}`);
  }

  return data;
};

export const getAdminDashboardSummary = async () =>
  request("/admin/dashboard/summary", {
    headers: buildHeaders(),
  });

export const getAdminInterns = async () =>
  request("/admin/interns", {
    headers: buildHeaders(),
  });

export const createAdminIntern = async (payload) =>
  request("/admin/interns", {
    method: "POST",
    headers: buildHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

export const getAdminAnalytics = async () =>
  request("/admin/analytics/overall", {
    headers: buildHeaders(),
  });

export const uploadAdminBulkFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return request("/admin/bulk-import", {
    method: "POST",
    headers: buildHeaders(),
    body: formData,
  });
};

export const getCurrentUser = async () =>
  request("/auth/me", {
    headers: buildHeaders(),
  });
