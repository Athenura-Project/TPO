const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
import axios from "axios";
const getToken = () => localStorage.getItem("token");


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});


const buildHeaders = (headers = {}) => {
  const token = getToken();

  if (!token) return headers;

  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  };
};

// ✅ GET ALL TPOs
export const getTPOs = async () => {

  try {

    const response = await API.get("/admin/tpos", {
      headers: buildHeaders(),
    });

    return response.data;

  } catch (error) {

    console.error("getTPOs API Error:", error);

    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch TPOs"
    };
  }
};

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};


const request = async (path, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${path}`, options);
    const data = await parseJsonSafely(response);

    if (!response.ok) {
      throw new Error(data?.message || `Request failed: ${response.status}`);
    }

    return data;
  } catch (err) {
    console.error("API Error:", err.message);
    throw err;
  }
};


export const getAdminDashboardSummary = async () =>
  request("/admin/dashboard/summary", {
    headers: buildHeaders(),
  });

export const getAdminInterns = async () =>
  request("/admin/interns", {
    headers: buildHeaders(),
  });

  export const createAdminIntern = async (data) => {
    return request("/admin/interns", {
      method: "POST",
      headers: buildHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(data),
    });
  };

  // DELETE INTERN
  export const deleteAdminIntern = async (id) => {
    if (!id) {
      console.error("deleteAdminIntern called without id");
      throw new Error("Intern id is missing");
    }
  
    return request(`/admin/interns/${id}`, {
      method: "DELETE",
      headers: buildHeaders(),
    });
  };

  export const updateAdminIntern = async (id, payload) => {
    if (!id) {
      console.error("updateAdminIntern called without id:", payload);
      throw new Error("Intern id is missing");
    }
  
    return request(`/admin/interns/${id}`, {
      method: "PUT",
      headers: buildHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
    });
  };

export const getAdminAnalytics = async () =>
  request("/admin/analytics/overall", {
    headers: buildHeaders(),
  });

export const uploadAdminBulkFile = async (file, importType = "institutes") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("importType", importType);
  
  const headers = buildHeaders();
  delete headers["Content-Type"]; // IMPORTANT FIX


  return request("/admin/bulk-import", {
    method: "POST",
    headers,
    body: formData,
  });
};

export const getCurrentUser = async () =>
  request("/auth/me", {
    headers: buildHeaders(),
  });

  export const assignAdminTPO = async (payload) =>
    request("/admin/assign", {
      method: "POST",
      headers: buildHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
    });

  export const unassignAdminTPO = async (payload) =>
    request("/admin/unassign", {
      method: "POST",
      headers: buildHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(payload),
    });

    
export const getAdminTPOs = async () =>
  request("/admin/tpos", {
    headers: buildHeaders(),
  });

export const createAdminTPO = async (payload) =>
  request("/admin/tpos", {
    method: "POST",
    headers: buildHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(payload),
  });

  export const updateAdminTPO = async (id, payload) => {
    if (!id) {
      console.error("updateAdminTPO called without id:", payload);
      throw new Error("TPO id is missing");
    }
  
    try {
      return await request(`/admin/tpos/${id}`, {
        method: "PUT",
        headers: buildHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("updateAdminTPO API error:", error);
      throw error;
    }
  };

export const deleteAdminTPO = async (id) => {
  if (!id) throw new Error("TPO id is missing");

  return request(`/admin/tpos/${id}`, {
    method: "DELETE",
    headers: buildHeaders(),
  });
};
console.log("adminApi exports loaded");
