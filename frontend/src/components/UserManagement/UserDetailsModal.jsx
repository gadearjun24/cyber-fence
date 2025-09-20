import React from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const UserDetailsModal = ({ user, onClose, fetchUsers }) => {
  const { token } = useAuth();

  const handleAction = async (action) => {
    try {
      if (action === "delete") {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/user/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/user/${user._id}`,
          action,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchUsers();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>User Details</h3>
        <p>
          <b>Username:</b> {user.username}
        </p>
        <p>
          <b>Email:</b> {user.email}
        </p>
        <p>
          <b>Role:</b> {user.role}
        </p>
        <p>
          <b>Status:</b> {user.isSuspended ? "Suspended" : "Active"}
        </p>

        <div className="modal-actions">
          <button
            onClick={() =>
              handleAction({ role: user.role === "admin" ? "user" : "admin" })
            }
          >
            {user.role === "admin" ? "Demote to User" : "Promote to Admin"}
          </button>
          <button onClick={() => handleAction({ suspend: !user.isSuspended })}>
            {user.isSuspended ? "Unsuspend" : "Suspend"}
          </button>
          <button onClick={() => handleAction("delete")} className="danger">
            Delete User
          </button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
