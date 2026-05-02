import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import { appointmentApi } from "../../services/api";
import { useApi } from "../../hooks/useApi";
import type { Appointment } from "../../types";

const statusColor: Record<string, string> = {
  pending: "badge-amber",
  confirmed: "badge-blue",
  completed: "badge-green",
  cancelled: "badge-red",
};

export default function DoctorAppointments() {
  const {
    data: appointments,
    loading,
    refetch,
  } = useApi<Appointment[]>(() => appointmentApi.getAll());
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");

  const filtered = (appointments || []).filter(
    (a) => filter === "all" || a.status === filter,
  );

  const updateStatus = async (id: string, status: string) => {
    await appointmentApi.update(id, { status });
    refetch();
  };

  const columns = [
    { key: "patientName", header: "Patient" },
    {
      key: "service",
      header: "Service",
      render: (a: Appointment) => (
        <span>
          {typeof a.service === "string"
            ? a.service
            : a.service?.name || "General Consultation"}
        </span>
      ),
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
      header: "Actions",
      render: (a: Appointment) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelected(a);
              setShowModal(true);
            }}
            className="text-xs text-dental-600 font-medium"
          >
            View
          </button>
          {a.status === "pending" && (
            <button
              onClick={() => updateStatus(a.id, "confirmed")}
              className="text-xs text-emerald-600 font-medium"
            >
              Confirm
            </button>
          )}
          {a.status === "confirmed" && (
            <button
              onClick={() => updateStatus(a.id, "completed")}
              className="text-xs text-mint-600 font-medium"
            >
              Complete
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout title="Appointments">
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-display font-bold text-xl text-surface-900">
              All Appointments
            </h2>
            <p className="text-sm text-surface-500">
              {filtered.length} appointments
            </p>
          </div>
          <div className="flex gap-2">
            {["all", "pending", "confirmed", "completed", "cancelled"].map(
              (s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold transition ${filter === s ? "bg-dental-600 text-white" : "bg-surface-100 text-surface-600 hover:bg-surface-200"}`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="card">
          <Table columns={columns} data={filtered} loading={loading} />
        </div>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Appointment Details"
      >
        {selected && (
          <div className="space-y-3">
            {[
              ["Patient", selected.patientName],
              ["Doctor", selected.doctorName],
              [
                "Service",
                typeof selected.service === "string"
                  ? selected.service
                  : selected.service?.name || "General Consultation",
              ],
              ["Date", selected.date],
              ["Time", selected.time],
              ["Status", selected.status],
              ["Notes", selected.notes || "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <span className="label w-24 flex-shrink-0">{k}</span>
                <span className="text-sm text-surface-800">{v}</span>
              </div>
            ))}
            <div className="flex gap-3 pt-4">
              {selected.status === "pending" && (
                <button
                  onClick={() => {
                    updateStatus(selected.id, "confirmed");
                    setShowModal(false);
                  }}
                  className="btn-primary flex-1"
                >
                  Confirm
                </button>
              )}
              {selected.status === "confirmed" && (
                <button
                  onClick={() => {
                    updateStatus(selected.id, "completed");
                    setShowModal(false);
                  }}
                  className="btn-primary flex-1"
                >
                  Mark Complete
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary flex-1"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
