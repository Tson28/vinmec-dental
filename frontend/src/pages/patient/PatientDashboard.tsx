import { useEffect, useState } from "react";
import PatientSidebar from "../../components/layout/PatientSidebar";
import { appointmentApi, recordApi, scoreApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import type { Appointment, DentalScore } from "../../types";

export default function PatientDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({ appointments: 0, records: 0 });
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [score, setScore] = useState<DentalScore | null>(null);

  useEffect(() => {
    Promise.allSettled([
      appointmentApi.getMine(),
      recordApi.getMine(),
      scoreApi.getMine(),
    ]).then(([a, r, s]) => {
      const appts: Appointment[] =
        a.status === "fulfilled"
          ? a.value.data?.data || a.value.data || []
          : [];
      setStats({
        appointments: appts.length,
        records:
          r.status === "fulfilled"
            ? (r.value.data?.data || r.value.data || []).length
            : 0,
      });
      setUpcoming(
        appts
          .filter((x) => x.status === "pending" || x.status === "confirmed")
          .slice(0, 3),
      );

      // Check for today's appointments
      const today = new Date().toISOString().split("T")[0];
      const todayAppts = appts.filter((apt) => apt.date === today);
      if (todayAppts.length > 0) {
        const appointmentsList = todayAppts
          .map((apt) => `${apt.doctorName} - ${apt.time}`)
          .join(", ");
        toast.info(
          `🗓️ Hôm nay bạn có ${todayAppts.length} lịch khám: ${appointmentsList}`,
          5000,
        );
      }

      if (s.status === "fulfilled")
        setScore(s.value.data?.data || s.value.data);
    });
  }, [toast]);

  const statusColor: Record<string, string> = {
    pending: "badge-amber",
    confirmed: "badge-blue",
    completed: "badge-green",
    cancelled: "badge-red",
  };

  const scoreValue = score?.overall ?? 78;
  const scoreColor =
    scoreValue >= 80
      ? "text-emerald-600"
      : scoreValue >= 60
        ? "text-amber-600"
        : "text-red-600";
  const scoreLabel =
    scoreValue >= 80
      ? "Xuất sắc"
      : scoreValue >= 60
        ? "Tốt"
        : "Cần chú ý";

  return (
    <div className="flex">
      <PatientSidebar />
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Tổng quan
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Xin chào, <span className="font-semibold">{user?.name}</span>
            </p>
          </div>
        </div>

        <div className="space-y-6 p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-500 font-medium">Lịch hẹn của tôi</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.appointments}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-teal-500">
            <p className="text-sm text-gray-500 font-medium">Hồ sơ y tế</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.records}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
            <p className="text-sm text-gray-500 font-medium">Điểm sức khỏe</p>
            <p className={`text-3xl font-bold mt-2 ${scoreColor}`}>
              {scoreValue}
            </p>
            <p className={`text-xs font-medium mt-1 ${scoreColor}`}>
              {scoreLabel}
            </p>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Lịch hẹn sắp tới
          </h3>
          {upcoming.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">📅</p>
              <p className="text-sm text-gray-500">Không có lịch hẹn sắp tới</p>
              <a
                href="/patient/appointments"
                className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition text-sm"
              >
                Đặt lịch hẹn
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200">
                  <tr className="text-gray-600 font-semibold">
                    <th className="text-left py-3 px-4">Dịch vụ</th>
                    <th className="text-left py-3 px-4">Bác sĩ</th>
                    <th className="text-left py-3 px-4">Ngày</th>
                    <th className="text-left py-3 px-4">Giờ</th>
                    <th className="text-left py-3 px-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {upcoming.map((apt) => (
                    <tr
                      key={apt.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {typeof apt.service === "string"
                          ? apt.service
                          : apt.service?.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        Dr. {apt.doctorName}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{apt.date}</td>
                      <td className="py-3 px-4 text-gray-600">{apt.time}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            apt.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : apt.status === "pending"
                                ? "bg-amber-100 text-amber-700"
                                : apt.status === "completed"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-red-100 text-red-700"
                          }`}
                        >
                          {apt.status === "confirmed"
                            ? "Xác nhận"
                            : apt.status === "pending"
                              ? "Chờ"
                              : apt.status === "completed"
                                ? "Hoàn tất"
                                : "Hủy"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Dental Tips */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg shadow p-6 border border-green-100">
          <h3 className="font-bold text-gray-900 mb-4">
            💡 Mẹo chăm sóc răng hàng ngày
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: "🪥",
                tip: "Đánh răng ít nhất 2 lần/ngày, mỗi lần 2 phút",
              },
              { icon: "🧵", tip: "Dùng chỉ nha khoa hàng ngày để loại bỏ plaque" },
              {
                icon: "🩺",
                tip: "Khám nha khoa mỗi 6 tháng một lần",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 bg-white rounded-lg"
              >
                <span className="text-2xl">{t.icon}</span>
                <p className="text-sm text-gray-700">{t.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
