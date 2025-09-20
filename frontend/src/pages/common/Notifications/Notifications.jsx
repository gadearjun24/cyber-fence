// src/pages/common/Notifications/Notifications.jsx
import React, { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import Header from "../../../components/Header/Header";
import { useSocket } from "../../../context/SocketContext";
import "./Notifications.css";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Notifications = () => {
  const { socket, notifications, setNotifications } = useSocket();

  const navigate = useNavigate();

  useEffect(() => {
    console.log("new notifation");
  }, [notifications]);

  return (
    <>
      <Header title="Live Notifications" />
      <div className="notifications-page">
        <h2 className="page-title">
          <Bell size={24} style={{ marginRight: "10px" }} /> Live Notifications
        </h2>

        {notifications.length === 0 ? (
          <p className="no-notifications">No live notifications yet.</p>
        ) : (
          <ul className="notifications-list">
            {notifications.map((n) => (
              <li
                key={n.id}
                className="notification-item live"
                onClick={(e) => {
                  e.stopPropagation();
                  // mark as read and navigate to history page
                  setNotifications((prev) => {
                    const unseen = notifications.filter((n1) => n1.id !== n.id);
                    if (!unseen) {
                      return [];
                    } else {
                      return unseen;
                    }
                  });
                  navigate("/history");
                }}
              >
                <div className="notification-content">
                  <h4 className="notification-title">{n.url}</h4>
                  <Link
                    style={{
                      color: "#1890ff",
                      textDecoration: "underline",
                    }}
                    to={n.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p className="notification-desc"> Click to visit</p>
                  </Link>
                  <p>
                    <strong>Verdict:</strong>{" "}
                    <span
                      className={`badge ${
                        n.verdict?.toLowerCase() === "safe"
                          ? "safe"
                          : n.verdict?.toLowerCase() === "suspicious"
                          ? "suspicious"
                          : "phishing"
                      }`}
                    >
                      {n.verdict}
                    </span>
                  </p>
                  <p>
                    <strong>Confidence:</strong> {n.confidence}%
                  </p>
                  {/* {n.url && (
                    <p>
                      <a
                        href={n.url}
                        target="_blank"
                        rel="noreferrer"
                        className="view-file"
                      >
                        View File
                      </a>
                    </p>
                  )} */}
                </div>
                <span className="notification-time">{n.time}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Notifications;
