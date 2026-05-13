import { Navigate } from "react-router-dom";

const RoleRedirect = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/admin/login" replace />;

  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (role === "intern") return <Navigate to="/intern/dashboard" replace />;

  return <Navigate to="/login" replace />;
};

export default RoleRedirect;