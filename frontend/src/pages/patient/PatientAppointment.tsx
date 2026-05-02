import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import { appointmentApi, serviceApi, doctorApi } from "../../services/api";
import { useApi } from "../../hooks/useApi";
import type { Appointment, Service, User } from "../../types";

const statusColor: Record<string, string> = {
  pending: "badge-amber",
  confirmed: "badge-blue",
  completed: "badge-green",
  cancelled: "badge-red",
};

export default function PatientAppointment() {
  const {
    data: appointments,
    loading,
    refetch,
  } = useApi<Appointment[]>(() => appointmentApi.getMine());
  const { data: services } = useApi<Service[]>(() => serviceApi.getAll());
  const { data: doctors } = useApi<User[]>(() => doctorApi.getAll());
  const [showModal, setShowModal] = useState(false);

  const columns = [
    {
      key: "service",
      header: "Service",
      render: (a: Appointment) => (
        <span className="font-medium">
          {typeof a.service === "string" ? a.service : a.service.name}
        </span>
      ),
    },
    {
      key: "doctorName",
      header: "Doctor",
      render: (a: Appointment) => `Dr. ${a.doctorName}`,
    },
    { key: "date", header: "Date" },
    { key: "time", header: "Time" },
    {
      key: "status",
      header: "Status",
      render: (a: Appointment) => (
        <span className={`badge ${statusColor[a.status]}`}>{a.status}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (a: Appointment) =>
        a.status === "pending" ? (
          <button
            onClick={async () => {
              await appointmentApi.cancel(a.id);
              refetch();
            }}
            className="text-xs text-red-500 font-medium hover:text-red-700"
          >
            Cancel
          </button>
        ) : null,
    },
  ];

  return (
    <DashboardLayout title="My Appointments">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-surface-900">
              Appointments
            </h2>
            <p className="text-sm text-surface-500">
              {(appointments || []).length} total
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            + Book Appointment
          </button>
        </div>

        <div className="card">
          <Table
            columns={columns}
            data={appointments || []}
            loading={loading}
          />
        </div>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Book Appointment"
      >
        <BookingForm
          services={services || []}
          doctors={doctors || []}
          onClose={() => {
            setShowModal(false);
            refetch();
          }}
        />
      </Modal>
    </DashboardLayout>
  );
}

function BookingForm({
  services,
  doctors,
  onClose,
}: {
  services: Service[];
  doctors: User[];
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    serviceId: "",
    doctorId: "",
    date: "",
    time: "09:00",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const times = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await appointmentApi.create(form);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}
      <div>
        <label className="label">Service</label>
        <select
          className="input"
          value={form.serviceId}
          onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
          required
        >
          <option value="">Select service...</option>
          {services.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name} – {Number(s.price).toLocaleString("vi-VN")} ₫
            </option>
          ))
        }
        </select>
      </div>
      <div>
        <label className="label">Doctor</label>
        <select
          className="input"
          value={form.doctorId}
          onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
          required
        >
          <option value="">Select doctor...</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>
              Dr. {d.name} – {d.specialization || "General"}
            </option>
          ))
        }
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Date</label>
          <input
            type="date"
            className="input"
            value={form.date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="label">Time</label>
          <select
            className="input"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          >
            {times.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Notes (optional)</label>
        <textarea
          className="input"
          rows={2}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Describe your symptoms..."
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary flex-1" disabled={loading}>
          {loading ? "Booking..." : "Book Appointment"}
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
