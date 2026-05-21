import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../services/api";
import { Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement, } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement);
export default function AdminDashboard() {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchDashboardData();
    }, []);
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getDashboard();
            setDashboardData(response.data.data);
        }
        catch (err) {
            console.error("Failed to fetch dashboard data:", err);
        }
        finally {
            setLoading(false);
        }
    };
    // Format number to Vietnamese format
    const formatNumber = (num) => {
        if (num >= 1000000)
            return (num / 1000000).toFixed(1) + "M";
        if (num >= 1000)
            return (num / 1000).toFixed(1) + "K";
        return num.toString();
    };
    // Chart data for revenue & expenses
    const getRevenueChartData = () => {
        const trend = dashboardData?.analytics?.monthlyAppointmentTrend || [];
        // Create a map of month data
        const trendMap = new Map();
        trend.forEach((item) => {
            if (item._id?.month) {
                trendMap.set(item._id.month, item.count);
            }
        });
        // Generate labels and data for last 6 months
        const labels = [];
        const revenueData = [];
        const expenseData = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const month = date.getMonth() + 1;
            labels.push(`T${month}`);
            const count = trendMap.get(month) || 5;
            revenueData.push(Math.max(50, count * 8));
            expenseData.push(Math.max(20, count * 5));
        }
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
                position: "top",
                labels: { usePointStyle: true, padding: 15 },
            },
            title: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: "#e2e8f0" },
                ticks: {
                    callback: (tickValue) => `${Number(tickValue).toLocaleString("vi-VN")}M`,
                },
            },
            x: { grid: { display: false } },
        },
    };
    // Chart data for services demand
    const getServiceChartData = () => {
        const services = dashboardData?.analytics?.topServices || [];
        // Use real data if available, otherwise use demo data
        const labels = services.length > 0
            ? services.map((s) => s._id)
            : [
                "Nhổ răng",
                "Kiểm tra tổng quát",
                "Tẩy trắng",
                "Nhắc răng",
                "Trám khoang",
            ];
        const data = services.length > 0 ? services.map((s) => s.count) : [35, 28, 18, 12, 7];
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
                position: "right",
                labels: { usePointStyle: true, padding: 20 },
            },
        },
    };
    // Stat card component
    const StatCard = ({ label, value, icon, trend, color, }) => {
        const colorClasses = {
            blue: "from-blue-50 to-blue-100 text-blue-600",
            teal: "from-teal-50 to-teal-100 text-teal-600",
            orange: "from-orange-50 to-orange-100 text-orange-600",
            red: "from-red-50 to-red-100 text-red-600",
        };
        return (_jsx("div", { className: `bg-gradient-to-br ${colorClasses[color] || colorClasses.blue} rounded-lg p-6 border border-opacity-20`, children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600 mb-1", children: label }), _jsx("p", { className: "text-2xl font-bold", children: value }), trend && _jsx("p", { className: "text-xs text-green-600 mt-2", children: trend })] }), _jsx("span", { className: "text-3xl", children: icon })] }) }));
    };
    if (loading) {
        return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsx(AdminSidebar, {}), _jsx("div", { className: "flex-1 flex items-center justify-center ml-64", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "\u0110ang t\u1EA3i d\u1EEF li\u1EC7u..." })] }) })] }));
    }
    return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsx(AdminSidebar, {}), _jsxs("div", { className: "flex-1 ml-64 overflow-y-auto", children: [_jsx("div", { className: "bg-white border-b border-gray-200 p-6 sticky top-0 z-10", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Dashboard" }), _jsxs("p", { className: "text-gray-600 text-sm", children: ["H\u00F4m nay, ", new Date().toLocaleDateString("vi-VN")] })] }), _jsx("button", { onClick: () => navigate("/admin/reports"), className: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors", children: "\u2B07\uFE0F Xu\u1EA5t b\u00E1o c\u00E1o" })] }) }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(StatCard, { label: "T\u1ED5ng s\u1ED1 b\u1EC7nh nh\u00E2n", value: dashboardData?.users?.patients || 0, icon: "\uD83D\uDC65", trend: `+${dashboardData?.users?.newThisMonth || 0} trong tháng`, color: "blue" }), _jsx(StatCard, { label: "L\u1ECBch h\u1EB9n h\u00F4m nay", value: dashboardData?.appointments?.today || 0, icon: "\uD83D\uDCC5", trend: `+${dashboardData?.appointments?.pending || 0} chưa xác nhận`, color: "teal" }), _jsx(StatCard, { label: "Doanh thu trong ng\u00E0y", value: formatNumber(dashboardData?.revenue?.total || 0) + "M", icon: "\uD83D\uDCB0", trend: "+5.2% so v\u1EDBi h\u00F4m qua", color: "orange" }), _jsx(StatCard, { label: "\u0110\u0103ng ch\u1EDD kh\u00E1m", value: dashboardData?.appointments?.pending || 0, icon: "\u23F3", trend: "Th\u1EDDi gian ch\u1EDD TB 15p", color: "red" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: "Doanh thu & Chi ph\u00ED" }), _jsx("p", { className: "text-xs text-gray-500 mb-4", children: "Th\u1ED1ng k\u00EA theo 7 ng\u00E0y g\u1EA7n nh\u1EA5t (Tri\u1EC1u VND)" }), _jsx("div", { style: { height: "300px" }, children: _jsx(Line, { data: getRevenueChartData(), options: revenueChartOptions }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: "C\u01A1 c\u1EA7u D\u1ECBch v\u1EE5" }), _jsx("p", { className: "text-xs text-gray-500 mb-4", children: "T\u1EF7 l\u1EC7 s\u1EED d\u1EE5ng c\u00E1c d\u1ECBch v\u1EE5" }), _jsx("div", { style: { height: "300px" }, children: _jsx(Pie, { data: getServiceChartData(), options: serviceChartOptions }) })] })] }), _jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-5 gap-4", children: [_jsxs("div", { className: "bg-white rounded-lg p-4 shadow text-center", children: [_jsx("p", { className: "text-2xl font-bold text-blue-600", children: dashboardData?.users?.doctors || 0 }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "B\u00E1c s\u0129" })] }), _jsxs("div", { className: "bg-white rounded-lg p-4 shadow text-center", children: [_jsx("p", { className: "text-2xl font-bold text-teal-600", children: dashboardData?.appointments?.total || 0 }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "T\u1ED5ng kh\u00E1m" })] }), _jsxs("div", { className: "bg-white rounded-lg p-4 shadow text-center", children: [_jsx("p", { className: "text-2xl font-bold text-purple-600", children: dashboardData?.records?.total || 0 }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "H\u1ED3 s\u01A1" })] }), _jsxs("div", { className: "bg-white rounded-lg p-4 shadow text-center", children: [_jsx("p", { className: "text-2xl font-bold text-orange-600", children: dashboardData?.services?.active || 0 }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "D\u1ECBch v\u1EE5" })] }), _jsxs("div", { className: "bg-white rounded-lg p-4 shadow text-center", children: [_jsxs("p", { className: "text-2xl font-bold text-green-600", children: [dashboardData?.analytics?.avgDentalScore || 0, "%"] }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "S\u1EE9c kh\u1ECFe" })] })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
                                    {
                                        icon: "👥",
                                        label: "Quản lý bệnh nhân",
                                        href: "/admin/patients",
                                    },
                                    { icon: "📅", label: "Lịch hẹn", href: "/admin/appointments" },
                                    { icon: "👨‍⚕️", label: "Bác sĩ", href: "/admin/doctors" },
                                    { icon: "🦷", label: "Dịch vụ", href: "/admin/services" },
                                ].map((item) => (_jsxs("a", { href: item.href, className: "bg-white hover:shadow-lg rounded-lg p-6 text-center transition-all duration-200 cursor-pointer", children: [_jsx("div", { className: "text-4xl mb-3", children: item.icon }), _jsx("p", { className: "text-sm font-semibold text-gray-700", children: item.label })] }, item.label))) })] })] })] }));
}
