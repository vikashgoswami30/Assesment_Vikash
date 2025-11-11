import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiHeaders, getToken } from "../utils/auth.js";
import Navbar from "./Navbar.jsx";

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    if (!token) {
      alert("Please log in first!");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "https://assesment-vikash-1.onrender.com//articles",
        {
          title,
          content,
          tags: tags.split(",").map((tag) => tag.trim()),
        },
        {
          headers: apiHeaders(),
        }
      );

      alert("✅ Article created successfully!");
      setTitle("");
      setContent("");
      setTags("");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to create article", err);
      alert("Failed to create article");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
        <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            ✍️ Create a New Article
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter article title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Content
              </label>
              <textarea
                placeholder="Write your article content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. tech, farming, AI"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              Create Article
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
