import { useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import { userApi } from "../../services/api";
import { useApi } from "../../hooks/useApi";
import type { User } from "../../types";

export default function AdminUsers() {
  const {
    data: users,
    loading,
    refetch,
  } = useApi<User[]>(() => userApi.getAll());
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = (users || []).filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa người dùng này?")) return;
    setDeleting(id);
    try {
      await userApi.delete(id);
      refetch();
    } finally {
      setDeleting(null);
    }
  };

  const columns = [
    {
      key: "name",
      header: "NAME",
      render: (u: User) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {u.name?.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-900">{u.name}</span>
        </div>
      ),
    },
    {
      key: "email",
      header: "EMAIL",
      render: (u: User) => <span className="text-gray-700">{u.email}</span>,
    },
    {
      key: "role",
      header: "ROLE",
      render: (u: User) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            u.role === "admin"
              ? "bg-red-100 text-red-700"
              : u.role === "doctor"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
          }`}
        >
          {u.role}
        </span>
      ),
    },
    {
      key: "phone",
      header: "PHONE",
      render: (u: User) => (
        <span className="text-gray-700">{u.phone || "—"}</span>
      ),
    },
    {
      key: "actions",
      header: "ACTIONS",
      render: (u: User) => (
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSelected(u);
              setShowModal(true);
            }}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(u._id)}
            disabled={deleting === u._id}
            className="text-red-600 hover:text-red-800 font-medium text-sm disabled:opacity-50"
          >
            {deleting === u._id ? "..." : "Delete"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-64 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quản lý Người dùng
              </h1>
              <p className="text-gray-600 text-sm">Wednesday, May 13, 2026</p>
            </div>
            <button
              onClick={() => {
                setSelected(null);
                setShowModal(true);
              }}
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              + Add User
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">All Users</h2>
                  <p className="text-sm text-gray-600">
                    {filtered.length} users found
                  </p>
                </div>
              </div>

              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <Table columns={columns} data={filtered} loading={loading} />
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={selected ? "Edit User" : "Add User"}
      >
        <UserForm
          user={selected}
          onClose={() => {
            setShowModal(false);
            refetch();
          }}
        />
      </Modal>
    </div>
  );
}

function UserForm({
  user,
  onClose,
}: {
  user: User | null;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "patient",
    phone: user?.phone || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user) await userApi.update(user._id, form);
      else await userApi.create(form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Name</label>
        <input
          className="input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="label">Email</label>
        <input
          type="email"
          className="input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="label">Phone</label>
        <input
          className="input"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>
      <div>
        <label className="label">Role</label>
        <select
          className="input"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value as any })}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary flex-1" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className="btn-secondary flex-1"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
