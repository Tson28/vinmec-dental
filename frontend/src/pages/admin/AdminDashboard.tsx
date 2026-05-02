import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import { userApi, appointmentApi, doctorApi, patientApi } from '../../services/api'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, doctors: 0, patients: 0, appointments: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      userApi.getAll(), doctorApi.getAll(), patientApi.getAll(), appointmentApi.getAll()
    ]).then(([u, d, p, a]) => {
      setStats({
        users: u.status === 'fulfilled' ? (u.value.data?.data || u.value.data)?.length || 0 : 0,
        doctors: d.status === 'fulfilled' ? (d.value.data?.data || d.value.data)?.length || 0 : 0,
        patients: p.status === 'fulfilled' ? (p.value.data?.data || p.value.data)?.length || 0 : 0,
        appointments: a.status === 'fulfilled' ? (a.value.data?.data || a.value.data)?.length || 0 : 0,
      })
      setLoading(false)
    })
  }, [])

  const chartData = {
    labels: MONTHS.slice(0, 8),
    datasets: [
      {
        label: 'Appointments',
        data: [12, 19, 24, 32, 28, 41, 35, 48],
        fill: true,
        backgroundColor: 'rgba(14,165,233,0.08)',
        borderColor: '#0ea5e9',
        tension: 0.4,
        pointBackgroundColor: '#0ea5e9',
        pointRadius: 4,
      },
      {
        label: 'New Patients',
        data: [5, 8, 11, 15, 12, 18, 14, 22],
        fill: true,
        backgroundColor: 'rgba(20,184,166,0.08)',
        borderColor: '#14b8a6',
        tension: 0.4,
        pointBackgroundColor: '#14b8a6',
        pointRadius: 4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' as const }, title: { display: false } },
    scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } },
  }

  const recentActivity = [
    { type: '👤', msg: 'New patient registered: Nguyễn Thị B', time: '5m ago' },
    { type: '📅', msg: 'Appointment confirmed: #APT-0142', time: '12m ago' },
    { type: '👨‍⚕️', msg: 'Dr. Minh updated medical record', time: '30m ago' },
    { type: '🦷', msg: 'New X-ray uploaded by Patient #P-0056', time: '1h ago' },
    { type: '💊', msg: 'Service "Root Canal" updated', time: '2h ago' },
  ]

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={loading ? '—' : stats.users} icon="👥" color="blue" change="+12% this month" />
          <StatCard label="Doctors" value={loading ? '—' : stats.doctors} icon="👨‍⚕️" color="teal" />
          <StatCard label="Patients" value={loading ? '—' : stats.patients} icon="🧑‍🤝‍🧑" color="green" change="+8 this week" />
          <StatCard label="Appointments" value={loading ? '—' : stats.appointments} icon="📅" color="amber" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="card lg:col-span-2">
            <h3 className="font-bold text-surface-800 mb-4">Monthly Overview</h3>
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* Activity */}
          <div className="card">
            <h3 className="font-bold text-surface-800 mb-4">Recent Activity</h3>
            <ul className="space-y-3">
              {recentActivity.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-xl">{a.type}</span>
                  <div>
                    <p className="text-sm text-surface-700">{a.msg}</p>
                    <p className="text-xs text-surface-400">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '👥', label: 'Manage Users', href: '/admin/users' },
            { icon: '👨‍⚕️', label: 'Manage Doctors', href: '/admin/doctors' },
            { icon: '🦷', label: 'Services', href: '/admin/services' },
            { icon: '📊', label: 'Reports', href: '#' },
          ].map((item) => (
            <a key={item.label} href={item.href}
              className="card text-center hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-sm font-semibold text-surface-700">{item.label}</p>
            </a>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}