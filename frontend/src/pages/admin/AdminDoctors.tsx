import { useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import { doctorApi } from "../../services/api";
import { useApi } from "../../hooks/useApi";
import type { User } from "../../types";

export default function AdminDoctors() {
  const {
    data: doctors,
    loading,
    refetch,
  } = useApi<User[]>(() => doctorApi.getAll());
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = (doctors || []).filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase()),
  );

  const columns = [
    {
      key: "name",
      header: "DOCTOR",
      render: (d: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {d.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{d.name}</p>
            <p className="text-xs text-gray-500">{d.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "specialization",
      header: "SPECIALIZATION",
      render: (d: User) => (
        <span className="text-gray-700">
          {d.specialization || "General Dentistry"}
        </span>
      ),
    },
    {
      key: "phone",
      header: "PHONE",
      render: (d: User) => (
        <span className="text-gray-700">{d.phone || "—"}</span>
      ),
    },
    {
      key: "status",
      header: "STATUS",
      render: () => (
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
          Active
        </span>
      ),
    },
    {
      key: "actions",
      header: "ACTIONS",
      render: (d: User) => (
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSelected(d);
              setShowModal(true);
            }}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Edit
          </button>
          <button
            onClick={async () => {
              if (confirm("Xóa bác sĩ này?")) {
                await doctorApi.delete(d._id);
                refetch();
              }
            }}
            className="text-red-600 hover:text-red-800 font-medium text-sm"
          >
            Delete
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
                Quản lý Bác sĩ
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
              + Add Doctor
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Medical Staff
                  </h2>
                  <p className="text-sm text-gray-600">
                    {filtered.length} doctors on record
                  </p>
                </div>
              </div>

              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="Search doctors..."
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
        title={selected ? "Edit Doctor" : "Add Doctor"}
      >
        <DoctorForm
          doctor={selected}
          onClose={() => {
            setShowModal(false);
            refetch();
          }}
        />
      </Modal>
    </div>
  );
}

function DoctorForm({
  doctor,
  onClose,
}: {
  doctor: User | null;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: doctor?.name || "",
    email: doctor?.email || "",
    phone: doctor?.phone || "",
    specialization: doctor?.specialization || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (doctor) await doctorApi.update(doctor._id, form);
      else await doctorApi.create({ ...form, role: "doctor" });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Full Name</label>
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
        <label className="label">Specialization</label>
        <select
          className="input"
          value={form.specialization}
          onChange={(e) => setForm({ ...form, specialization: e.target.value })}
        >
          <option value="">General Dentistry</option>
          <option value="Orthodontics">Orthodontics</option>
          <option value="Endodontics">Endodontics</option>
          <option value="Periodontics">Periodontics</option>
          <option value="Oral Surgery">Oral Surgery</option>
          <option value="Pediatric Dentistry">Pediatric Dentistry</option>
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
