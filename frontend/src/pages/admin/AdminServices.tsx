import { useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import { serviceApi } from "../../services/api";
import { useApi } from "../../hooks/useApi";
import type { Service } from "../../types";

export default function AdminServices() {
  const {
    data: services,
    loading,
    refetch,
  } = useApi<Service[]>(() => serviceApi.getAll());
  const [selected, setSelected] = useState<Service | null>(null);
  const [showModal, setShowModal] = useState(false);

  const columns = [
    {
      key: "name",
      header: "SERVICE",
      render: (s: Service) => (
        <span className="font-semibold text-gray-900">{s.name}</span>
      ),
    },
    {
      key: "category",
      header: "CATEGORY",
      render: (s: Service) => (
        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
          {s.category || "General"}
        </span>
      ),
    },
    {
      key: "duration",
      header: "DURATION",
      render: (s: Service) => (
        <span className="text-gray-700">{s.duration || 30} min</span>
      ),
    },
    {
      key: "price",
      header: "PRICE",
      render: (s: Service) => (
        <span className="font-mono font-semibold text-gray-900">
          {Number(s.price || 0).toLocaleString("vi-VN")} ₫
        </span>
      ),
    },
    {
      key: "active",
      header: "STATUS",
      render: (s: Service) => (
        <span
          className={
            s.active !== false
              ? "px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold"
              : "px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold"
          }
        >
          {s.active !== false ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "ACTIONS",
      render: (s: Service) => (
        <div className="flex gap-3">
          <button
            onClick={() => {
              setSelected(s);
              setShowModal(true);
            }}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            Edit
          </button>
          <button
            onClick={async () => {
              if (confirm("Xóa dịch vụ này?")) {
                await serviceApi.delete(s._id);
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
                Quản lý Dịch vụ
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
              + Add Service
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Category cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["Phòng ngừa", "Phục hồi", "Thẩm mỹ", "Cấp cứu"].map((cat, i) => {
              const icons = ["🛡️", "🔧", "✨", "🚨"];
              const count = (services || []).filter(
                (s) => s.category === cat,
              ).length;
              return (
                <div
                  key={cat}
                  className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-all text-center"
                >
                  <div className="text-3xl mb-2">{icons[i]}</div>
                  <p className="font-bold text-2xl text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500 mt-1">{cat}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                Dental Services
              </h2>
              <p className="text-sm text-gray-600">
                {(services || []).length} services available
              </p>
            </div>

            <div className="overflow-x-auto">
              <Table
                columns={columns}
                data={services || []}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={selected ? "Edit Service" : "Add Service"}
      >
        <ServiceForm
          service={selected}
          onClose={() => {
            setShowModal(false);
            refetch();
          }}
        />
      </Modal>
    </div>
  );
}

function ServiceForm({
  service,
  onClose,
}: {
  service: Service | null;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: service?.name || "",
    description: service?.description || "",
    duration: service?.duration || 30,
    price: service?.price || 0,
    category: service?.category || "Preventive",
    active: service?.active !== false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (service) await serviceApi.update(service._id, form);
      else await serviceApi.create(form);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Service Name</label>
        <input
          className="input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="label">Description</label>
        <input
          className="input"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Duration (min)</label>
          <input
            type="number"
            className="input"
            value={form.duration}
            onChange={(e) =>
              setForm({ ...form, duration: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <label className="label">Price (VND)</label>
          <input
            type="number"
            className="input"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />
        </div>
      </div>
      <div>
        <label className="label">Category</label>
        <select
          className="input"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {[
            "Preventive",
            "Restorative",
            "Cosmetic",
            "Emergency",
            "General",
          ].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm({ ...form, active: e.target.checked })}
          className="rounded"
        />
        <span className="text-sm font-medium text-surface-700">Active</span>
      </label>
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
