import React from "react";

const UserTable = ({
  users,
  setSelectedUser,
  page,
  setPage,
  totalPages,
  loading,
}) => {
  return (
    <div className="user-table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Uploads</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            users.map((u) => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isSuspended ? "Suspended" : "Active"}</td>
                <td>{u.uploadsCount}</td>
                <td>
                  {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "—"}
                </td>
                <td>
                  <button onClick={() => setSelectedUser(u)}>Details</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default UserTable;
