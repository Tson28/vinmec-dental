import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import { appointmentApi, patientApi, recordApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import type { Appointment } from "../../types";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    patients: 0,
    todayAppts: 0,
    records: 0,
  });
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      appointmentApi.getAll(),
      patientApi.getAll(),
      recordApi.getAll(),
    ]).then(([a, p, r]) => {
      const appts: Appointment[] =
        a.status === "fulfilled"
          ? a.value.data?.data || a.value.data || []
          : [];
      const today = new Date().toISOString().split("T")[0];
      const todayAppts = appts.filter((x: Appointment) => x.date === today);

      setStats({
        patients:
          p.status === "fulfilled"
            ? (p.value.data?.data || p.value.data || []).length
            : 0,
        todayAppts: todayAppts.length,
        records:
          r.status === "fulfilled"
            ? (r.value.data?.data || r.value.data || []).length
            : 0,
      });
      setUpcoming(
        appts
          .filter(
            (x: Appointment) =>
              x.status === "pending" || x.status === "confirmed",
          )
          .slice(0, 5),
      );

      // Check for today's appointments
      if (todayAppts.length > 0) {
        const appointmentsList = todayAppts
          .map((apt) => `${apt.patientName} - ${apt.time}`)
          .join(", ");
        toast.info(
          `🗓️ Hôm nay bạn có ${todayAppts.length} lịch khám: ${appointmentsList}`,
          5000,
        );
      }

      setLoading(false);
    });
  }, [toast]);

  const statusColor: Record<string, string> = {
    pending: "badge-amber",
    confirmed: "badge-blue",
    completed: "badge-green",
    cancelled: "badge-red",
  };

  return (
    <DashboardLayout title="Doctor Dashboard">
      <div className="space-y-6">
        <div className="card bg-gradient-dental text-blue-400 border-0">
          <p className="text-dental-100 text-sm">Good morning,</p>
          <h2 className="font-display font-bold text-2xl mt-1">
            Dr. {user?.name?.split(" ").pop()}
          </h2>
          <p className="text-dental-200 text-sm mt-1">
            You have {stats.todayAppts} appointments today
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Patients"
            value={loading ? "—" : stats.patients}
            icon="🧑‍🤝‍🧑"
            color="teal"
          />
          <StatCard
            label="Today's Appointments"
            value={loading ? "—" : stats.todayAppts}
            icon="📅"
            color="blue"
          />
          <StatCard
            label="Medical Records"
            value={loading ? "—" : stats.records}
            icon="📋"
            color="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-bold text-surface-800 mb-4">
              Upcoming Appointments
            </h3>
            {upcoming.length === 0 ? (
              <p className="text-sm text-surface-400 text-center py-8">
                No upcoming appointments
              </p>
            ) : (
              <ul className="space-y-3">
                {upcoming.map((apt) => (
                  <li
                    key={apt.id}
                    className="flex items-center justify-between p-3 bg-surface-50 rounded-xl"
                  >
                    <div>
                      <p className="font-semibold text-surface-800 text-sm">
                        {apt.patientName}
                      </p>
                      <p className="text-xs text-surface-500">
                        {apt.date} • {apt.time} •{" "}
                        {typeof apt.service === "string"
                          ? apt.service
                          : apt.service.name}
                      </p>
                    </div>
                    <span className={`badge ${statusColor[apt.status]}`}>
                      {apt.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card">
            <h3 className="font-bold text-surface-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: "🧑‍🤝‍🧑",
                  label: "View Patients",
                  href: "/doctor/patients",
                },
                {
                  icon: "📅",
                  label: "Appointments",
                  href: "/doctor/appointments",
                },
                { icon: "📋", label: "Records", href: "/doctor/records" },
                { icon: "💬", label: "Messages", href: "/doctor/chat" },
                {
                  icon: "🖼️",
                  label: "X-Rays & Images",
                  href: "/doctor/images",
                },
                { icon: "📹", label: "Video Call", href: "/video-call" },
              ].map((a) => (
                <a
                  key={a.label}
                  href={a.href}
                  className="flex items-center gap-2 p-3 bg-surface-50 hover:bg-dental-50 rounded-xl transition cursor-pointer"
                >
                  <span className="text-xl">{a.icon}</span>
                  <span className="text-sm font-medium text-surface-700">
                    {a.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
