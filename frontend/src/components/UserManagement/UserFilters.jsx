import React from "react";

const UserFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="user-filters">
      <input
        type="text"
        placeholder="Search by username/email"
        name="search"
        value={filters.search}
        onChange={handleChange}
      />
      <select name="role" value={filters.role} onChange={handleChange}>
        <option value="">All Roles</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <select name="status" value={filters.status} onChange={handleChange}>
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
      </select>
    </div>
  );
};

export default UserFilters;
