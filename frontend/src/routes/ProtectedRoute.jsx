import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Prefer current key, but keep backwards compatibility with older builds
  const token = localStorage.getItem("token") || localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

