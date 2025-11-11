import React from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ArticleView from "./pages/ArticleView.jsx";
import EditArticle from "./pages/EditArticle.jsx";
import CreateArticle from "./pages/CreateArticle.jsx";
import { getToken } from "./utils/auth.js";
import "./index.css";

// ✅ Protected route wrapper
function Protected({ children }) {
  const location = useLocation();
  const token = getToken();

  // If no token → redirect to login & store attempted path (optional)
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/article/:id"
          element={
            <Protected>
              <ArticleView />
            </Protected>
          }
        />
        <Route
          path="/create"
          element={
            <Protected>
              <CreateArticle />
            </Protected>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <Protected>
              <EditArticle />
            </Protected>
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
