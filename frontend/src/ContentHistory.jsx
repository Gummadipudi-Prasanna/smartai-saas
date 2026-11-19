
import { useEffect, useState } from "react";
import api from "./api";
import "./ContentHistory.css";

function ContentHistory({
  searchQuery = "",
  onSearchChange = () => {},
}) {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Content History
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await api.get(
        "/api/ai/generate/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContents(response.data);
      setError("");
    } catch (err) {
      console.error(
        "History Error:",
        err.response?.data || err.message
      );

      setError("Unable to load content history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Edit Content
  const handleEdit = async (id, currentTopic) => {
    const newTopic = window.prompt(
      "Enter updated topic:",
      currentTopic
    );

    if (!newTopic || !newTopic.trim()) return;

    try {
      const token = localStorage.getItem("access");

      await api.patch(
        `/api/ai/generate/${id}/`,
        { topic: newTopic.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchHistory();
      alert("Content updated successfully!");
    } catch (err) {
      console.error(
        "Edit Error:",
        err.response?.data || err.message
      );

      alert("Unable to update content.");
    }
  };

  // Delete Content
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this content?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("access");

      await api.delete(
        `/api/ai/generate/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContents((previousContents) =>
        previousContents.filter((item) => item.id !== id)
      );

      alert("Content deleted successfully!");
    } catch (err) {
      console.error(
        "Delete Error:",
        err.response?.data || err.message
      );

      alert("Unable to delete content.");
    }
  };

  // Search by topic or generated content
  const filteredContents = contents.filter((item) => {
    const query = searchQuery.toLowerCase().trim();

    return (
      (item.topic || "").toLowerCase().includes(query) ||
      (item.generated_text || "").toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="history-loading">
        Loading Content History...
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-error">
        {error}
        <button
          onClick={() => {
            setLoading(true);
            fetchHistory();
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Content History</h1>
        <p>View, manage, edit and delete your generated content.</p>
      </div>

      <div className="history-container">
        <div className="history-toolbar">
          <h2>Your Generated Content ({contents.length})</h2>

          <input
            type="text"
            className="history-search"
            placeholder="Search by topic or content..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          <button
            className="history-refresh-button"
            onClick={() => {
              setLoading(true);
              fetchHistory();
            }}
          >
            Refresh History
          </button>
        </div>

        {filteredContents.length === 0 ? (
          <div className="history-empty">
            <h3>No content found</h3>
            <p>
              {searchQuery
                ? "Try searching with a different keyword."
                : "Generate your first content to see it here."}
            </p>
          </div>
        ) : (
          <div className="history-list">
            {filteredContents.map((item) => (
              <div className="history-card" key={item.id}>
                <div className="history-card-content">
                  <h3>{item.topic}</h3>

                  <div className="history-meta">
                    <span>{item.content_type}</span>
                    <span>{item.tone}</span>
                    <span>{item.length}</span>
                  </div>

                  <p className="history-date">
                    Created At:{" "}
                    {new Date(item.created_at).toLocaleString()}
                  </p>

                  <details className="history-details">
                    <summary>View Generated Content</summary>

                    <pre className="history-generated-content">
                      {item.generated_text}
                    </pre>
                  </details>
                </div>

                <div className="history-actions">
                  <button
                    className="history-edit-button"
                    onClick={() =>
                      handleEdit(item.id, item.topic)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="history-delete-button"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentHistory;
