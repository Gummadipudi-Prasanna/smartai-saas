
import { useState } from "react";
import axios from "axios";
import {
  Sparkles,
  FileText,
  WandSparkles,
  CheckCircle2,
  AlertCircle,
  Download,
} from "lucide-react";

import "./ContentGenerator.css";

function ContentGenerator() {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("blog");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!topic.trim()) {
      setMessage("Please enter a topic.");
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage("");
    setGeneratedText("");
    setIsError(false);

    try {
      const token = localStorage.getItem("access");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/ai/generate/",
        {
          topic: topic.trim(),
          content_type: contentType,
          tone,
          length,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGeneratedText(response.data.generated_text);
      setMessage("Content generated successfully!");
      setIsError(false);
    } catch (error) {
      console.error(
        "Generation Error:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        setMessage("Session expired. Please login again.");
      } else {
        setMessage(
          error.response?.data?.error ||
          error.response?.data?.detail ||
          "Content generation failed. Please try again."
        );
      }

      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedText) return;

    const fileContent = `
SmartAI SaaS
AI-Powered Content Generation Platform

Topic: ${topic}
Content Type: ${contentType}
Tone: ${tone}
Length: ${length}

----------------------------------------

${generatedText}

----------------------------------------
Generated using SmartAI SaaS
`;

    const blob = new Blob([fileContent], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const safeTopic = topic
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, "_");

    link.href = url;
    link.download = `${safeTopic || "smartai-content"}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="generator-page">
      <div className="generator-header">
        <div className="generator-title-icon">
          <Sparkles size={27} />
        </div>

        <div>
          <h1>AI Content Generator</h1>
          <p>Create engaging content with SmartAI SaaS.</p>
        </div>
      </div>

      <div className="generator-layout">
        <div className="generator-form-card">
          <div className="generator-card-heading">
            <h2>Create New Content</h2>
            <p>Enter your preferences to generate content.</p>
          </div>

          <form onSubmit={handleGenerate}>
            <div className="generator-field">
              <label htmlFor="topic">Topic</label>

              <input
                id="topic"
                type="text"
                placeholder="Example: React.js Advanced Concepts"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>

            <div className="generator-fields-grid">
              <div className="generator-field">
                <label htmlFor="contentType">Content Type</label>

                <select
                  id="contentType"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                >
                  <option value="blog">Blog</option>
                  <option value="product_description">
                    Product Description
                  </option>
                  <option value="social_media">Social Media</option>
                  <option value="seo_description">SEO Description</option>
                </select>
              </div>

              <div className="generator-field">
                <label htmlFor="tone">Tone</label>

                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="creative">Creative</option>
                </select>
              </div>

              <div className="generator-field">
                <label htmlFor="length">Content Length</label>

                <select
                  id="length"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>
            </div>

            <button
              className="generate-button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="generator-spinner" />
                  Generating...
                </>
              ) : (
                <>
                  <WandSparkles size={19} />
                  Generate Content
                </>
              )}
            </button>
          </form>

          {message && (
            <div
              className={`generator-message ${
                isError ? "error-message" : "success-message"
              }`}
            >
              {isError ? (
                <AlertCircle size={18} />
              ) : (
                <CheckCircle2 size={18} />
              )}

              <span>{message}</span>
            </div>
          )}
        </div>

        <div className="generator-info-card">
          <div className="generator-info-icon">
            <FileText size={25} />
          </div>

          <h3>Generate smarter content</h3>

          <p>
            Create content for blogs, products, social media and SEO
            descriptions using your selected preferences.
          </p>

          <div className="generator-info-item">
            <CheckCircle2 size={17} />
            Multiple content types
          </div>

          <div className="generator-info-item">
            <CheckCircle2 size={17} />
            Flexible writing tones
          </div>

          <div className="generator-info-item">
            <CheckCircle2 size={17} />
            Short, medium and long content
          </div>
        </div>
      </div>

      {generatedText && (
        <div className="generated-result-card">
          <div className="generated-result-heading">
            <div>
              <h2>Generated Content</h2>
              <p>Your generated content is ready.</p>
            </div>

            <span className="generated-badge">
              <CheckCircle2 size={15} />
              Completed
            </span>
          </div>

          <div className="generated-content-actions">
            <button
              type="button"
              className="download-content-button"
              onClick={handleDownload}
            >
              <Download size={18} />
              Download Content
            </button>
          </div>

          <pre className="generated-content">
            {generatedText}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ContentGenerator;
