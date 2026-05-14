import { useState } from "react";
import PatientSidebar from "../../components/layout/PatientSidebar";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import AppointmentCalendar from "../../components/ui/AppointmentCalendar";
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
  const [viewType, setViewType] = useState<"calendar" | "table">("calendar");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

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
    <div className="flex">
      <PatientSidebar />
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lịch hẹn</h1>
            <p className="text-sm text-gray-500 mt-1">
              {(appointments || []).length} lịch hẹn
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            + Đặt lịch
          </button>
        </div>

        <div className="space-y-4 p-8">
          <div className="flex gap-2 items-center mb-4">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewType("calendar")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  viewType === "calendar"
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Lịch
              </button>
              <button
                onClick={() => setViewType("table")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  viewType === "table"
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Danh sách
              </button>
            </div>
          </div>

          {viewType === "calendar" ? (
            <AppointmentCalendar
              appointments={appointments || []}
              onSelectAppointment={(apt) => {
                setSelectedAppointment(apt);
              }}
              loading={loading}
            />
          ) : (
            <div className="bg-white rounded-lg shadow">
              <Table
                columns={columns}
                data={appointments || []}
                loading={loading}
              />
            </div>
          )}
        </div>

        {selectedAppointment && (
          <Modal
            open={!!selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            title="Chi tiết lịch khám"
          >
            <div className="space-y-4">
              <div className="space-y-3">
                {[
                  ["Bác sĩ", selectedAppointment.doctorName],
                  [
                    "Dịch vụ",
                    typeof selectedAppointment.service === "string"
                      ? selectedAppointment.service
                      : selectedAppointment.service?.name || "Khám tổng quát",
                  ],
                  ["Ngày", selectedAppointment.date],
                  ["Giờ", selectedAppointment.time],
                  [
                    "Trạng thái",
                    <span
                      className={`badge ${statusColor[selectedAppointment.status]}`}
                    >
                      {selectedAppointment.status}
                    </span>,
                  ],
                  ["Ghi chú", selectedAppointment.notes || "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <span className="label w-24 flex-shrink-0">{k}</span>
                    <span className="text-sm text-gray-800">{v}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                {selectedAppointment.status === "pending" && (
                  <button
                    onClick={async () => {
                      await appointmentApi.cancel(selectedAppointment.id);
                      refetch();
                      setSelectedAppointment(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex-1"
                  >
                    Hủy lịch
                  </button>
                )}
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition flex-1"
                >
                  Đóng
                </button>
              </div>
            </div>
          </Modal>
        )}

        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          title="Đặt lịch khám"
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
      </div>
    </div>
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
  const [conflict, setConflict] = useState<string>("");
  const { data: appointments } = useApi<Appointment[]>(() =>
    appointmentApi.getAll(),
  );

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

  const checkDoctorConflict = (
    doctorId: string,
    date: string,
    time: string,
  ) => {
    if (!doctorId || !date || !time) {
      setConflict("");
      return;
    }

    const hasConflict = (appointments || []).some(
      (apt) =>
        apt.doctorId === doctorId &&
        apt.date === date &&
        apt.time === time &&
        (apt.status === "confirmed" || apt.status === "pending"),
    );

    if (hasConflict) {
      setConflict(
        `Bác sĩ này đã có lịch khám vào lúc ${time} ngày ${date}. Vui lòng chọn thời gian khác.`,
      );
    } else {
      setConflict("");
    }
  };

  const handleDoctorChange = (doctorId: string) => {
    setForm({ ...form, doctorId });
    checkDoctorConflict(doctorId, form.date, form.time);
  };

  const handleDateChange = (date: string) => {
    setForm({ ...form, date });
    checkDoctorConflict(form.doctorId, date, form.time);
  };

  const handleTimeChange = (time: string) => {
    setForm({ ...form, time });
    checkDoctorConflict(form.doctorId, form.date, time);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (conflict) {
      setError("Không thể đặt lịch do bác sĩ đã có lịch trùng");
      return;
    }
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
      {conflict && (
        <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 flex items-start gap-2">
          <span className="text-lg">⚠️</span>
          <span>{conflict}</span>
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
          ))}
        </select>
      </div>
      <div>
        <label className="label">Doctor</label>
        <select
          className="input"
          value={form.doctorId}
          onChange={(e) => handleDoctorChange(e.target.value)}
          required
        >
          <option value="">Select doctor...</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>
              Dr. {d.name} – {d.specialization || "General"}
            </option>
          ))}
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
            onChange={(e) => handleDateChange(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Time</label>
          <select
            className="input"
            value={form.time}
            onChange={(e) => handleTimeChange(e.target.value)}
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
        <button
          type="submit"
          className="btn-primary flex-1"
          disabled={loading || !!conflict}
        >
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
