import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiHeaders, getUser } from "../utils/auth";
import Navbar from "./Navbar.jsx";

export default function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [summaries, setSummaries] = useState({});
  const limit = 5;
  const navigate = useNavigate();
  const user = getUser();

  const fetchArticles = async () => {
    try {
      const resp = await fetch("https://assesment-vikash-1.onrender.com/articles", {
        headers: apiHeaders(),
      });
      const data = await resp.json();
      setArticles(data);
    } catch (err) {
      console.error("Error fetching articles", err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    const filtered = articles.filter((a) =>
      a.title.toLowerCase().includes(q.toLowerCase())
    );
    setFilteredArticles(filtered);
    setPage(1);
  }, [q, articles]);

  const handleDelete = async (id) => {
    if (!window.confirm("🗑️ Are you sure you want to delete this article?")) return;

    try {
      const resp = await fetch(`https://assesment-vikash-1.onrender.com/articles/${id}`, {
        method: "DELETE",
        headers: apiHeaders(),
      });

      if (resp.ok) {
        alert("✅ Article deleted successfully!");
        setArticles(articles.filter((a) => a._id !== id));
      } else {
        alert("❌ Failed to delete article!");
      }
    } catch (err) {
      console.error("Error deleting article", err);
      alert("❌ Something went wrong!");
    }
  };

  const handleSummary = async (id) => {
    setSummaries((prev) => ({ ...prev, [id]: { loading: true, text: "" } }));

    try {
      const resp = await fetch(`https://assesment-vikash-1.onrender.com/articles/${id}/summarize`, {
        headers: apiHeaders(),
      });
      const data = await resp.json();

      setSummaries((prev) => ({
        ...prev,
        [id]: { loading: false, text: data.summary },
      }));
    } catch (err) {
      console.error("Error generating summary", err);
      setSummaries((prev) => ({
        ...prev,
        [id]: { loading: false, text: "Failed to load summary" },
      }));
    }
  };

  const totalPages = Math.ceil(filteredArticles.length / limit);
  const startIndex = (page - 1) * limit;
  const paginated = filteredArticles.slice(startIndex, startIndex + limit);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto py-10 px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="🔍 Search articles..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {user.role === "admin" && (
            <Link to="/create">
              <button className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200">
                ➕ Create Article
              </button>
            </Link>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📰 All Articles</h2>

          {paginated.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No articles found.</p>
          ) : (
            <ul className="space-y-4">
              {paginated.map((a) => (
                <li
                  key={a._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <Link
                        to={`/article/${a._id}`}
                        className="text-lg font-semibold text-blue-600 hover:underline"
                      >
                        {a.title}
                      </Link>
                      <div className="text-sm text-gray-500 mt-1">
                        By:{" "}
                        <span className="font-medium text-gray-700">
                          {a.createdBy?.name || "Unknown"}
                        </span>{" "}
                        | Tags: {a.tags?.join(", ") || "None"}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-3 sm:mt-0">
                      <button
                        onClick={() => navigate(`/edit/${a._id}`)}
                        className="bg-yellow-400 text-white px-4 py-1 rounded-lg hover:bg-yellow-500 transition-all"
                      >
                        ✏️ Edit
                      </button>

                      {user.role === "admin" && (
                        <button
                          onClick={() => handleDelete(a._id)}
                          className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition-all"
                        >
                          🗑️ Delete
                        </button>
                      )}

                      <button
                        onClick={() => handleSummary(a._id)}
                        disabled={summaries[a._id]?.loading}
                        className="bg-purple-600 text-white px-4 py-1 rounded-lg hover:bg-purple-700 transition-all"
                      >
                        {summaries[a._id]?.loading ? "⏳ Generating..." : "📝 Summarize"}
                      </button>
                    </div>

                    {summaries[a._id]?.text && (
                      <p className="mt-2 text-gray-700 border-l-4 border-purple-400 pl-2">
                        {summaries[a._id].text}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={`px-4 py-2 rounded-lg border ${
                page === 1
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-blue-600 border-blue-400 hover:bg-blue-100"
              }`}
            >
              ◀ Prev
            </button>
            <span className="text-gray-700 font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className={`px-4 py-2 rounded-lg border ${
                page === totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-blue-600 border-blue-400 hover:bg-blue-100"
              }`}
            >
              Next ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
