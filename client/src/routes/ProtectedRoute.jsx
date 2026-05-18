import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  if (loading) {
    return <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "white" }}>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;