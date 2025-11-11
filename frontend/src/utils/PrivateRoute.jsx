import { Navigate } from "react-router-dom";
import { getToken } from "./auth.js";

export default function PrivateRoute({ children }) {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
