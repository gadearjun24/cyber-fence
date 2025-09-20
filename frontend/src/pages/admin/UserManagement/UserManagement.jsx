import React, { useEffect, useState } from "react";
import axios from "axios";

import "./UserManagement.css";
import UserTable from "../../../components/UserManagement/UserTable";
import UserFilters from "../../../components/UserManagement/UserFilters";
import UserDetailsModal from "../../../components/UserManagement/UserDetailsModal";
import { useAuth } from "../../../context/AuthContext";
import Header from "../../../components/Header/Header";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: "", role: "", status: "" });
  const [selectedUser, setSelectedUser] = useState(null);
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { page, limit: 10, ...filters },
        }
      );
      setUsers(res.data.users);
      console.log(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, filters]);

  return (
    <>
      <Header title="User Management" />

      <div className="user-management">
        <h2>Manage users</h2>
        <UserFilters filters={filters} setFilters={setFilters} />
        <UserTable
          users={users}
          setSelectedUser={setSelectedUser}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          fetchUsers={fetchUsers}
          loading={loading}
        />
        {selectedUser && (
          <UserDetailsModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            fetchUsers={fetchUsers}
          />
        )}
      </div>
    </>
  );
};

export default UserManagement;
