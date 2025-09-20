import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const HistoryTable = ({ files, onView, loading }) => {
  if (!files || files.length === 0) {
    return <p className="no-data">No history records found.</p>;
  }
  const { user } = useAuth();
  const showNames = user?.role === "admin";
  console.log({ files });

  return (
    <div className="history-table-wrapper">
      <table className="history-table">
        <thead>
          <tr>
            {showNames && (
              <>
                <th>Uploaded By</th>
                <th> Email</th>
              </>
            )}

            <th>URL</th>
            <th>Upload Date</th>
            <th>Prediction</th>
            <th>Chance of Phishing</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <h1>Loading... </h1>
          ) : (
            files.map((file) => (
              <tr key={file._id}>
                {showNames && (
                  <>
                    <td>{file?.user?.username || "N/A"}</td>
                    <td>{file?.user?.email || "N/A"}</td>
                  </>
                )}
                <td>
                  <Link
                    style={{
                      color: "#1890ff",
                      textDecoration: "underline",
                    }}
                    to={file.url || file.results.url}
                  >
                    Click to visit
                  </Link>
                </td>
                <td>{new Date(file.checkedAt).toLocaleString()}</td>
                <td className={`${file.verdict?.toLowerCase()}`}>
                  {file.verdict}
                </td>
                <td>
                  <div className="confidence-bar">
                    <div
                      className="filled-bar"
                      style={{
                        width: `${
                          (file.results.probability * 100).toFixed(2) || 0
                        }%`,
                        // phising if probability >= 0.9 else
                        // uncertain if 0.5 < probability < 0.9 else safe

                        backgroundColor:
                          file.results.probability >= 0.9
                            ? "#ff4d4f"
                            : file.results.probability > 0.5
                            ? "#faad14"
                            : "#00ff99",
                      }}
                    ></div>
                    <span>
                      {(file.results.probability * 100).toFixed(2) || 0}%
                    </span>
                  </div>
                </td>
                <td>
                  <button className="btn view-btn" onClick={() => onView(file)}>
                    View
                  </button>
                  {/* <button
                  className="btn reanalyze-btn"
                  onClick={() => alert("Re-analyze clicked")}
                >
                  Re-analyze
                </button> */}
                  {/* {file.url && (
                  <a href={file.url} target="_blank" rel="noreferrer">
                    Download Report
                  </a>
                )} */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
