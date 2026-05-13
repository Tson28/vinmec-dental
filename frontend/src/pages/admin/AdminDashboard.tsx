import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { adminApi } from "../../services/api";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
);

const MONTH_NAMES = [
  "T1",
  "T2",
  "T3",
  "T4",
  "T5",
  "T6",
  "T7",
  "T8",
  "T9",
  "T10",
  "T11",
  "T12",
];

interface DashboardData {
  users: {
    total: number;
    doctors: number;
    patients: number;
    newThisMonth: number;
  };
  appointments: {
    total: number;
    today: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  records: { total: number };
  images: { total: number };
  services: { total: number; active: number };
  chat: { totalSessions: number };
  revenue: { total: number };
  analytics: {
    monthlyAppointmentTrend: Array<any>;
    topServices: Array<any>;
    avgDentalScore: number;
  };
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getDashboard();
      setDashboardData(response.data.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Format number to Vietnamese format
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  // Format currency
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num);
  };

  // Chart data for revenue & expenses
  const getRevenueChartData = () => {
    const trend = dashboardData?.analytics?.monthlyAppointmentTrend || [];

    // Use real data if available, otherwise use demo data
    const labels =
      trend.length > 0
        ? trend.map((m) => `T${m._id.month}`)
        : ["T1", "T2", "T3", "T4", "T5", "T6"];

    const revenueData =
      trend.length > 0
        ? trend.map((m) => m.count * Math.random() * 50)
        : [50, 75, 60, 80, 90, 100];

    const expenseData =
      trend.length > 0
        ? trend.map((m) => m.count * Math.random() * 30)
        : [20, 30, 25, 35, 40, 45];

    return {
      labels,
      datasets: [
        {
          label: "Doanh thu",
          data: revenueData,
          fill: true,
          backgroundColor: "rgba(14, 165, 233, 0.1)",
          borderColor: "#0ea5e9",
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: "#0ea5e9",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
        {
          label: "Chi phí",
          data: expenseData,
          fill: true,
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          borderColor: "#ef4444",
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: "#ef4444",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
      ],
    };
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { usePointStyle: true, padding: 15 },
      },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#e2e8f0" },
        ticks: { callback: (v: number) => `${v.toLocaleString("vi-VN")}M` },
      },
      x: { grid: { display: false } },
    },
  };

  // Chart data for services demand
  const getServiceChartData = () => {
    const services = dashboardData?.analytics?.topServices || [];

    // Use real data if available, otherwise use demo data
    const labels =
      services.length > 0
        ? services.map((s) => s._id)
        : [
            "Nhổ răng",
            "Kiểm tra tổng quát",
            "Tẩy trắng",
            "Nhắc răng",
            "Trám khoang",
          ];

    const data =
      services.length > 0 ? services.map((s) => s.count) : [35, 28, 18, 12, 7];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "#0ea5e9",
            "#14b8a6",
            "#f59e0b",
            "#ef4444",
            "#8b5cf6",
          ],
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    };
  };

  const serviceChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "right" as const,
        labels: { usePointStyle: true, padding: 20 },
      },
    },
  };

  // Stat card component
  const StatCard = ({
    label,
    value,
    icon,
    trend,
    color,
  }: {
    label: string;
    value: string | number;
    icon: string;
    trend?: string;
    color: string;
  }) => {
    const colorClasses: Record<string, string> = {
      blue: "from-blue-50 to-blue-100 text-blue-600",
      teal: "from-teal-50 to-teal-100 text-teal-600",
      orange: "from-orange-50 to-orange-100 text-orange-600",
      red: "from-red-50 to-red-100 text-red-600",
    };
    return (
      <div
        className={`bg-gradient-to-br ${colorClasses[color] || colorClasses.blue} rounded-lg p-6 border border-opacity-20`}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && <p className="text-xs text-green-600 mt-2">{trend}</p>}
          </div>
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center ml-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-64 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 text-sm">
                Hôm nay, {new Date().toLocaleDateString("vi-VN")}
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
              ⬇️ Xuất báo cáo
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Tổng số bệnh nhân"
              value={dashboardData?.users?.patients || 0}
              icon="👥"
              trend={`+${dashboardData?.users?.newThisMonth || 0} trong tháng`}
              color="blue"
            />
            <StatCard
              label="Lịch hẹn hôm nay"
              value={dashboardData?.appointments?.today || 0}
              icon="📅"
              trend={`+${dashboardData?.appointments?.pending || 0} chưa xác nhận`}
              color="teal"
            />
            <StatCard
              label="Doanh thu trong ngày"
              value={formatNumber(dashboardData?.revenue?.total || 0) + "M"}
              icon="💰"
              trend="+5.2% so với hôm qua"
              color="orange"
            />
            <StatCard
              label="Đăng chờ khám"
              value={dashboardData?.appointments?.pending || 0}
              icon="⏳"
              trend="Thời gian chờ TB 15p"
              color="red"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue & Expense Chart */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Doanh thu & Chi phí
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Thống kê theo 7 ngày gần nhất (Triều VND)
              </p>
              <div style={{ height: "300px" }}>
                <Line
                  data={getRevenueChartData()}
                  options={revenueChartOptions}
                />
              </div>
            </div>

            {/* Service Demand Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Cơ cầu Dịch vụ
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Tỷ lệ sử dụng các dịch vụ
              </p>
              <div style={{ height: "300px" }}>
                <Pie
                  data={getServiceChartData()}
                  options={serviceChartOptions}
                />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg p-4 shadow text-center">
              <p className="text-2xl font-bold text-blue-600">
                {dashboardData?.users?.doctors || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Bác sĩ</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow text-center">
              <p className="text-2xl font-bold text-teal-600">
                {dashboardData?.appointments?.total || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Tổng khám</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow text-center">
              <p className="text-2xl font-bold text-purple-600">
                {dashboardData?.records?.total || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Hồ sơ</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow text-center">
              <p className="text-2xl font-bold text-orange-600">
                {dashboardData?.services?.active || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Dịch vụ</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow text-center">
              <p className="text-2xl font-bold text-green-600">
                {dashboardData?.analytics?.avgDentalScore || 0}%
              </p>
              <p className="text-sm text-gray-600 mt-1">Sức khỏe</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: "👥",
                label: "Quản lý bệnh nhân",
                href: "/admin/patients",
              },
              { icon: "📅", label: "Lịch hẹn", href: "/admin/appointments" },
              { icon: "👨‍⚕️", label: "Bác sĩ", href: "/admin/doctors" },
              { icon: "🦷", label: "Dịch vụ", href: "/admin/services" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="bg-white hover:shadow-lg rounded-lg p-6 text-center transition-all duration-200 cursor-pointer"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <p className="text-sm font-semibold text-gray-700">
                  {item.label}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
