import { useNavigate } from "react-router-dom";
import { logout, getUser } from "../utils/auth.js";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      logout(); // clear token
      navigate("/login"); // redirect to login
    }
  };

  return (
    <nav className="flex justify-between items-center bg-gray-100 border-b border-gray-300 px-6 py-3 shadow-sm">
      {/* Left Side - App Logo or Name + Dashboard Button */}
      <div className="flex items-center gap-4">
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-semibold text-blue-600 cursor-pointer"
        >
          📰 Article Hub
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-3 py-1.5 rounded-md transition-all"
        >
          Dashboard
        </button>
      </div>

      {/* Right Side - User Info + Logout */}
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-gray-700 font-medium">
            👋 {user.name} ({user.role})
          </span>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md transition-all"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
