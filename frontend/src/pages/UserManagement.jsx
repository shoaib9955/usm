import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Table from "../components/Table";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const UserManagement = () => {
  const { hasRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await userService.getAllUsers(params);
      setUsers(response.data || response.users || []);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = () => {
    setModalMode("create");
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
      status: "active",
    });
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setModalMode("edit");
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
    });
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await userService.deleteUser(userId);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
      console.error(error);
    }
  };

  const handleRestore = async (userId) => {
    try {
      await userService.restoreUser(userId);
      toast.success("User restored successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to restore user");
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === "create") {
        await userService.createUser(formData);
        toast.success("User created successfully");
      } else {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await userService.updateUser(selectedUser._id, updateData);
        toast.success("User updated successfully");
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      const respData = error.response?.data;
      if (respData?.message === 'Validation failed' && respData?.meta?.errors?.length > 0) {
        toast.error(respData.meta.errors[0].message);
      } else {
        const message = respData?.message || (modalMode === "create" ? "Failed to create user" : "Failed to update user");
        toast.error(message);
      }
      console.error(error);
    }

  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (role) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            role === "admin"
              ? "bg-red-100 text-red-800"
              : role === "manager"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
          }`}
        >
          {role?.toUpperCase()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {status?.toUpperCase()}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex space-x-2">
          {(hasRole("admin") || hasRole("manager")) && (
            <Button
              size="small"
              variant="secondary"
              onClick={() => handleEditUser(row)}
            >
              Edit
            </Button>
          )}
          {hasRole("admin") && row.status === "active" && (
            <Button
              size="small"
              variant="danger"
              onClick={() => handleDeleteUser(row._id)}
            >
              Delete
            </Button>
          )}
          {hasRole("admin") && row.status === "inactive" && (
            <Button
              size="small"
              variant="success"
              onClick={() => handleRestore(row._id)}
            >
              Restore
            </Button>
          )}
          {!hasRole("admin") && !hasRole("manager") && (
            <span className="text-xs text-slate-400 italic">View Only</span>
          )}
        </div>
      ),
    },
  ];

  if (loading && users.length === 0) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="mt-1 text-slate-500">Manage team members, roles, and access.</p>
        </div>
        {(hasRole("admin") || hasRole("manager")) && (
          <div className="mt-4 sm:mt-0">
            <Button variant="primary" onClick={handleCreateUser} className="shadow-indigo-500/30">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create User
              </span>
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white shadow-sm border border-slate-100 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <Input
            label="Search Users"
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white"
          />
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Filter by Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-shadow duration-200 text-slate-700"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-shadow duration-200 text-slate-700"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <Table columns={columns} data={users} />
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === "create" ? "Create New User" : "Edit User"}
        size="medium"
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required={modalMode === "create"}
            placeholder={
              modalMode === "edit" ? "Leave empty to keep current password" : ""
            }
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              {hasRole("admin") && <option value="admin">Admin</option>}
            </select>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {modalMode === "create" ? "Create" : "Update"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;
