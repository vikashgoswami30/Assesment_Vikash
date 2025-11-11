import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center border border-gray-200">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Welcome to Article Hub
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          Your space to create, share, and explore amazing articles ✍️
        </p>

        <div className="flex justify-center space-x-4">
          <Link to="/login">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-all duration-200">
              Register
            </button>
          </Link>
        </div>
      </div>
      <footer className="mt-12 text-sm text-gray-500">
        © {new Date().getFullYear()} Article Hub — Crafted with ❤️ by Vikash
      </footer>
    </div>
  );
}
