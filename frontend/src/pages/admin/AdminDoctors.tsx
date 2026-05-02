import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
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
      header: "Doctor",
      render: (d: User) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-dental-400 to-mint-500 flex items-center justify-center text-white text-xs font-bold">
            {d.name?.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-surface-800">{d.name}</p>
            <p className="text-xs text-surface-400">{d.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "specialization",
      header: "Specialization",
      render: (d: User) => d.specialization || "General Dentistry",
    },
    { key: "phone", header: "Phone", render: (d: User) => d.phone || "—" },
    {
      key: "status",
      header: "Status",
      render: () => <span className="badge-green badge">Active</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (d: User) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelected(d);
              setShowModal(true);
            }}
            className="text-xs text-dental-600 font-medium hover:text-dental-700"
          >
            Edit
          </button>
          <button
            onClick={async () => {
              if (confirm("Delete?")) {
                await doctorApi.delete(d._id);
                refetch();
              }
            }}
            className="text-xs text-red-500 font-medium hover:text-red-700"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title="Doctor Management">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-surface-900">
              Medical Staff
            </h2>
            <p className="text-sm text-surface-500">
              {filtered.length} doctors on record
            </p>
          </div>
          <button
            onClick={() => {
              setSelected(null);
              setShowModal(true);
            }}
            className="btn-primary"
          >
            + Add Doctor
          </button>
        </div>

        <div className="card">
          <div className="mb-4">
            <input
              className="input max-w-xs"
              placeholder="Search doctors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Table columns={columns} data={filtered} loading={loading} />
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
    </DashboardLayout>
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
