import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import { appointmentApi, recordApi, scoreApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import type { Appointment, DentalScore } from "../../types";

export default function PatientDashboard() {
  const { user } = useAuth();
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
      if (s.status === "fulfilled")
        setScore(s.value.data?.data || s.value.data);
    });
  }, []);

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
      ? "Excellent"
      : scoreValue >= 60
        ? "Good"
        : "Needs Attention";

  return (
    <DashboardLayout title="My Dashboard">
      <div className="space-y-6">
        {/* Welcome */}
        <div className="card bg-gradient-dental text-white border-0 flex items-center justify-between">
          <div>
            <p className="text-dental-100 text-sm">Welcome back,</p>
            <h2 className="font-display font-bold text-2xl mt-1">
              {user?.name}
            </h2>
            <p className="text-dental-200 text-sm mt-1">
              Track your dental health journey
            </p>
          </div>
          <div className="text-6xl">🦷</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="My Appointments"
            value={stats.appointments}
            icon="📅"
            color="blue"
          />
          <StatCard
            label="Medical Records"
            value={stats.records}
            icon="📋"
            color="teal"
          />
          <div className="stat-card">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 text-2xl flex-shrink-0">
              ⭐
            </div>
            <div>
              <p className={`text-2xl font-display font-bold ${scoreColor}`}>
                {scoreValue}
              </p>
              <p className="text-xs font-semibold text-surface-500 mt-0.5">
                Dental Score
              </p>
              <p className={`text-xs font-medium mt-0.5 ${scoreColor}`}>
                {scoreLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming */}
          <div className="card">
            <h3 className="font-bold text-surface-800 mb-4">
              Upcoming Appointments
            </h3>
            {upcoming.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-2">📅</p>
                <p className="text-sm text-surface-400">
                  No upcoming appointments
                </p>
                <a
                  href="/patient/appointments"
                  className="btn-primary mt-3 inline-block text-sm"
                >
                  Book Now
                </a>
              </div>
            ) : (
              <ul className="space-y-3">
                {upcoming.map((apt) => (
                  <li
                    key={apt.id}
                    className="flex items-center justify-between p-3 bg-surface-50 rounded-xl"
                  >
                    <div>
                      <p className="font-semibold text-surface-800 text-sm">
                        {typeof apt.service === "string"
                          ? apt.service
                          : apt.service.name}
                      </p>
                      <p className="text-xs text-surface-500">
                        Dr. {apt.doctorName} • {apt.date} {apt.time}
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

          {/* Quick Actions */}
          <div className="card">
            <h3 className="font-bold text-surface-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: "📅",
                  label: "Book Appointment",
                  href: "/patient/appointments",
                },
                { icon: "📋", label: "View Records", href: "/patient/records" },
                { icon: "🖼️", label: "My Images", href: "/patient/images" },
                { icon: "⭐", label: "Dental Score", href: "/patient/score" },
                { icon: "🤖", label: "AI Chatbot", href: "/patient/chat" },
                { icon: "👤", label: "My Profile", href: "/patient/profile" },
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

        {/* Dental Tips */}
        <div className="card bg-gradient-to-br from-mint-50 to-dental-50 border-mint-200">
          <h3 className="font-bold text-surface-800 mb-3">
            💡 Daily Dental Tips
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: "🪥",
                tip: "Brush teeth at least twice daily for 2 minutes each time",
              },
              { icon: "🧵", tip: "Floss daily to remove plaque between teeth" },
              {
                icon: "🩺",
                tip: "Visit your dentist every 6 months for check-ups",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 bg-white/70 rounded-xl"
              >
                <span className="text-2xl">{t.icon}</span>
                <p className="text-sm text-surface-700">{t.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
