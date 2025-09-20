import React from "react";
import "./Header.css";
import * as LucideIcons from "lucide-react";
import { Link } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";

const Header = ({ title = "Dashboard", userImage }) => {
  const { user } = useAuth();
  const dummyImage = `https://dummyimage.com/400x300/161b22/00ff88&text=${user?.username
    .trim()[0]
    .toUpperCase()}`; // fallback image
  const { notifications, audioRef } = useSocket();
  return (
    <header className="dashboard-header">
      {/* Left: Title */}
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      <div className="header-left">
        <h1>{title}</h1>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="header-right">
        {/* Notification Bell */}
        <Link to={"/notifications"}>
          <button className="notification-btn" aria-label="Notifications">
            <LucideIcons.Bell />
            {notifications?.length ? (
              <span className="notification-dot"></span>
            ) : null}
          </button>
        </Link>

        {/* User Profile */}
        <Link to="/profile">
          <div className="user-profile">
            <img
              src={userImage || dummyImage}
              alt="User Profile"
              className="profile-img"
            />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
