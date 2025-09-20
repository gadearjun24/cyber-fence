// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";
import { Upload } from "lucide-react"; // icon
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Header from "../../../components/Header/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

// Dummy colors for charts
const COLORS = ["#4f46e5", "#22c55e", "#ef4444", "#facc15"];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalUploads: 0,
    uploadsToday: 0,
    uploadsThisWeek: 0,
    flaggedAI: 0,
    flaggedDeepfake: 0,
    flaggedUncertain: 0,
    systemAlerts: 0,
  });

  const [uploadTrends, setUploadTrends] = useState([]);
  const [detectionRatios, setDetectionRatios] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const [urlsText, setUrlsText] = useState(""); // comma-separated or line-separated URLs
  const [csvFile, setCsvFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
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

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setStats(res.data.stats);
        console.log(res.data.detectionRatios);

        setUploadTrends(res.data.uploadTrends);
        setDetectionRatios(res.data.detectionRatios);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="loading">Loading dashboard...</p>;

  return (
    <>
      <Header title="Admin Dashboard" />
      <div className="dashboard-container" style={{ padding: "0px" }}>
        <div
          className="dashboard-page"
          style={{
            overflowY: "auto",
          }}
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
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
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

        {/* KPI Stats */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <h4>Total Users</h4>
            <p>{stats.totalUsers}</p>
            <small>
              Active: {stats.activeUsers} | Inactive: {stats.inactiveUsers}
            </small>
          </div>
          <div className="kpi-card">
            <h4>Total Uploads</h4>
            <p>{stats.totalUploads}</p>
            <small>
              Today: {stats.uploadsToday} | This Week: {stats.uploadsThisWeek}
            </small>
          </div>
          <div className="kpi-card">
            <h4>Files Flagged</h4>
            <p>{stats.total}</p>
            <small>
              Suspecious: {stats.suspicious} | Phishing: {stats.phishing} |
            </small>
          </div>
          {/* <div className="kpi-card alerts">
            <h4>System Alerts</h4>
            <p>{stats.systemAlerts || "No alerts"}</p>
            <small>Failed uploads, errors, warnings</small>
          </div> */}
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          {/* Upload Trends */}
          <div className="chart-card">
            <h3>Upload Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={uploadTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="uploads" stroke="#4f46e5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Detection Ratios */}
          <div className="chart-card">
            <h3>Detection Ratios</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={detectionRatios}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={120}
                  dataKey="value"
                >
                  {detectionRatios.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap Placeholder */}
        {/* <div className="chart-card">
          <h3>User Activity Heatmap</h3>
          <p>
            (TODO: Add Heatmap visualization using a lib like nivo or
            react-calendar-heatmap)
          </p>
        </div> */}
      </div>
    </>
  );
};

export default Dashboard;
