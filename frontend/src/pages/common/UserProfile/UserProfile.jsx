import React, { useState } from "react";
import "./UserProfile.css";
import { User, Edit2, LogOut } from "lucide-react";
import Header from "../../../components/Header/Header";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user, setUser, setToken } = useAuth();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.username,
    email: user?.email,
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <>
      <Header title="Profile" />
      <div className="profile-page">
        <h2 className="page-title">
          <User size={24} style={{ marginRight: "10px" }} /> User Profile
        </h2>

        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-header">
              <img
                src={
                  user?.profilePic ||
                  `https://dummyimage.com/400x300/161b22/00ff88&text=${user?.username
                    ?.trim()[0]
                    .toUpperCase()}`
                }
                alt="Profile"
                className="profile-pic"
              />
              <h3>{user?.username}</h3>
              <p className="role">{user?.role}</p>
            </div>

            <div className="profile-details">
              <h4>Account Details</h4>
              <div className="detail-row">
                <span>Name:</span>
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{user?.username}</span>
                )}
              </div>
              <div className="detail-row">
                <span>Email:</span>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{user?.email}</span>
                )}
              </div>
              <div className="detail-row">
                <span>Password:</span>
                {editMode ? (
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="New password"
                  />
                ) : (
                  <span>********</span>
                )}
              </div>
            </div>

            <div className="profile-actions">
              {editMode ? (
                <button
                  className="save-btn"
                  onClick={() => setEditMode(false)} // you can hook API save here
                >
                  Save
                </button>
              ) : (
                <button className="edit-btn" onClick={() => setEditMode(true)}>
                  <Edit2 size={16} /> Edit Profile
                </button>
              )}

              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
