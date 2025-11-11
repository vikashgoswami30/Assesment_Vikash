import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar.jsx";

export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5000/articles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const article = response.data;
        setTitle(article.title);
        setContent(article.content);
        setTags(article.tags?.join(", ") || "");
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "❌ Failed to fetch article.");
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/articles/${id}`,
        {
          title,
          content,
          tags: tags.split(",").map((t) => t.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("✅ Article updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.message || "❌ Failed to update article.");
    }
  };

  if (loading) return <div className="text-center text-gray-600 mt-20 text-lg">Loading article...</div>;
  if (error) return <div className="text-center text-red-600 mt-20 text-lg">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">✏️ Edit Article</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Content</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-4 py-2 h-40 focus:ring-2 focus:ring-blue-500 outline-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Tags (comma separated)</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-all"
            >
              ⬅ Back
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all"
            >
              💾 Update Article
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
