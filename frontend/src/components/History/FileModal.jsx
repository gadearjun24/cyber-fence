import React from "react";
import { Link } from "react-router-dom";

const FileModal = ({ file, onClose }) => {
  console.log({ file });

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <h3>{file.url || file.results.url}</h3>
        <Link
          to={file.url || file.results.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Click here
        </Link>

        {/* Summary Verdict */}
        <div className="verdict-summary">
          <p>
            Prediction:{" "}
            <b className={`${file.verdict.trim().toLowerCase()}`}>
              {file.verdict}
            </b>
          </p>
          <p>
            Chance Of Phishing: <b>{file.confidence}%</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileModal;
