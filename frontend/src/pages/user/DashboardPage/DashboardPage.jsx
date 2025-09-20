import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";
import Header from "../../../components/Header/Header";
import { useAuth } from "../../../context/AuthContext";

const DashboardPage = () => {
  const [urlsText, setUrlsText] = useState(""); // comma-separated or line-separated URLs
  const [csvFile, setCsvFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  // Handle text area change
  const handleUrlsChange = (e) => {
    setUrlsText(e.target.value);
    setError("");
    setResult(null);
  };

  // Handle CSV file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "text/csv") {
      setError("Only CSV files are supported.");
      return;
    }
    setCsvFile(file);
    setError("");
    setResult(null);
  };

  // Parse CSV file to array of URLs
  const parseCsvFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split(/\r?\n/).filter(Boolean);
        const urls = lines.map((line) => line.trim());
        resolve(urls);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  };

  const handleCheckUrls = async () => {
    setError("");
    setResult(null);
    setLoading(true);

    let urls = [];
    try {
      // Prioritize CSV file if uploaded
      if (csvFile) {
        urls = await parseCsvFile(csvFile);
      } else {
        // Parse text input (comma or newline separated)
        urls = urlsText
          .split(/[\n,]+/)
          .map((u) => u.trim())
          .filter(Boolean);
      }

      if (urls.length === 0) {
        setError("Please provide at least one URL.");
        setLoading(false);
        return;
      }

      if (!token) {
        navigate("/login");
        return;
      }

      // Send to backend
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/detect/url`,
        { urls },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 120000, // 2 min
        }
      );

      setResult(response.data.results); // Expecting array of {url, probability, verdict}
    } catch (err) {
      console.error(err);
      setError("Failed to check URLs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Dashboard" />
      <div
        className="dashboard-page"
        style={{ height: "100px !important", color: "red" }}
      >
        <h2 className="page-title">Check URLs for Phishing</h2>

        {/* URL Input */}
        <div className="input-section">
          <label>Enter URLs (comma or newline separated):</label>
          <textarea
            rows={6}
            value={urlsText}
            onChange={handleUrlsChange}
            placeholder="https://example.com, https://google.com"
          />
        </div>

        <div className="input-section">
          <label>Or upload CSV file:</label>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          {csvFile && <p>Selected file: {csvFile.name}</p>}
        </div>

        <button
          className="upload-btn"
          onClick={handleCheckUrls}
          disabled={loading}
        >
          {loading ? "Checking..." : "Check URLs"}
        </button>

        {error && <p className="error-text">{error}</p>}

        {/* Result Section */}
        {result && result.length > 0 && (
          <div className="result-card">
            <h3>Results:</h3>
            <table className="result-table">
              <thead>
                <tr>
                  <th>Sr. No</th>
                  <th>URL</th>
                  <th>Chance of Phishing</th>
                  <th>Verdict</th>
                </tr>
              </thead>
              <tbody>
                {result.map((r, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <a href={r.url} target="_blank" rel="noopener noreferrer">
                        {r.url}
                      </a>
                    </td>
                    <td>
                      <span
                        className={`likelihood-badge ${
                          r.verdict.trim().toLowerCase() === "safe"
                            ? "safe"
                            : r.verdict.trim().toLowerCase() === "suspicious"
                            ? "suspicious"
                            : "phishing"
                        }`}
                      >
                        {(r.results.probability * 100).toFixed(2)}%
                      </span>
                    </td>
                    <td>
                      {" "}
                      <span
                        className={`likelihood-badge ${
                          r.verdict.trim().toLowerCase() === "safe"
                            ? "safe"
                            : r.verdict.trim().toLowerCase() === "suspicious"
                            ? "suspicious"
                            : "phishing"
                        }`}
                      >
                        {r.verdict}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
