import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import PatientSidebar from "../../components/layout/PatientSidebar";
import { appointmentApi, recordApi, scoreApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
export default function PatientDashboard() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [stats, setStats] = useState({ appointments: 0, records: 0 });
    const [upcoming, setUpcoming] = useState([]);
    const [score, setScore] = useState(null);
    useEffect(() => {
        Promise.allSettled([
            appointmentApi.getMine(),
            recordApi.getMine(),
            scoreApi.getMine(),
        ]).then(([a, r, s]) => {
            const appts = a.status === "fulfilled"
                ? a.value.data?.data || a.value.data || []
                : [];
            setStats({
                appointments: appts.length,
                records: r.status === "fulfilled"
                    ? (r.value.data?.data || r.value.data || []).length
                    : 0,
            });
            setUpcoming(appts
                .filter((x) => x.status === "pending" || x.status === "confirmed")
                .slice(0, 3));
            // Check for today's appointments
            const today = new Date().toISOString().split("T")[0];
            const todayAppts = appts.filter((apt) => apt.date === today);
            if (todayAppts.length > 0) {
                const appointmentsList = todayAppts
                    .map((apt) => `${apt.doctorName} - ${apt.time}`)
                    .join(", ");
                toast.info(`🗓️ Hôm nay bạn có ${todayAppts.length} lịch khám: ${appointmentsList}`, 5000);
            }
            if (s.status === "fulfilled")
                setScore(s.value.data?.data || s.value.data);
        });
    }, [toast]);
    const statusColor = {
        pending: "badge-amber",
        confirmed: "badge-blue",
        completed: "badge-green",
        cancelled: "badge-red",
    };
    const scoreValue = score?.overall ?? 78;
    const scoreColor = scoreValue >= 80
        ? "text-emerald-600"
        : scoreValue >= 60
            ? "text-amber-600"
            : "text-red-600";
    const scoreLabel = scoreValue >= 80 ? "Xuất sắc" : scoreValue >= 60 ? "Tốt" : "Cần chú ý";
    return (_jsxs("div", { className: "flex", children: [_jsx(PatientSidebar, {}), _jsxs("div", { className: "flex-1 ml-64", children: [_jsxs("div", { className: "sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "T\u1ED5ng quan" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: new Date().toLocaleDateString("vi-VN", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }) })] }), _jsx("div", { className: "text-right", children: _jsxs("p", { className: "text-sm text-gray-600", children: ["Xin ch\u00E0o, ", _jsx("span", { className: "font-semibold", children: user?.name })] }) })] }), _jsxs("div", { className: "space-y-6 p-8", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6 border-l-4 border-blue-500", children: [_jsx("p", { className: "text-sm text-gray-500 font-medium", children: "L\u1ECBch h\u1EB9n c\u1EE7a t\u00F4i" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: stats.appointments })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 border-l-4 border-teal-500", children: [_jsx("p", { className: "text-sm text-gray-500 font-medium", children: "H\u1ED3 s\u01A1 y t\u1EBF" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: stats.records })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 border-l-4 border-amber-500", children: [_jsx("p", { className: "text-sm text-gray-500 font-medium", children: "\u0110i\u1EC3m s\u1EE9c kh\u1ECFe" }), _jsx("p", { className: `text-3xl font-bold mt-2 ${scoreColor}`, children: scoreValue }), _jsx("p", { className: `text-xs font-medium mt-1 ${scoreColor}`, children: scoreLabel })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 mb-4", children: "L\u1ECBch h\u1EB9n s\u1EAFp t\u1EDBi" }), upcoming.length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx("p", { className: "text-4xl mb-2", children: "\uD83D\uDCC5" }), _jsx("p", { className: "text-sm text-gray-500", children: "Kh\u00F4ng c\u00F3 l\u1ECBch h\u1EB9n s\u1EAFp t\u1EDBi" }), _jsx("a", { href: "/patient/appointments", className: "inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition text-sm", children: "\u0110\u1EB7t l\u1ECBch h\u1EB9n" })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "border-b border-gray-200", children: _jsxs("tr", { className: "text-gray-600 font-semibold", children: [_jsx("th", { className: "text-left py-3 px-4", children: "D\u1ECBch v\u1EE5" }), _jsx("th", { className: "text-left py-3 px-4", children: "B\u00E1c s\u0129" }), _jsx("th", { className: "text-left py-3 px-4", children: "Ng\u00E0y" }), _jsx("th", { className: "text-left py-3 px-4", children: "Gi\u1EDD" }), _jsx("th", { className: "text-left py-3 px-4", children: "Tr\u1EA1ng th\u00E1i" })] }) }), _jsx("tbody", { children: upcoming.map((apt) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50 transition", children: [_jsx("td", { className: "py-3 px-4 font-medium text-gray-900", children: typeof apt.service === "string"
                                                                    ? apt.service
                                                                    : apt.service?.name }), _jsxs("td", { className: "py-3 px-4 text-gray-600", children: ["Dr. ", apt.doctorName] }), _jsx("td", { className: "py-3 px-4 text-gray-600", children: apt.date }), _jsx("td", { className: "py-3 px-4 text-gray-600", children: apt.time }), _jsx("td", { className: "py-3 px-4", children: _jsx("span", { className: `inline-block px-3 py-1 rounded-full text-xs font-semibold ${apt.status === "confirmed"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : apt.status === "pending"
                                                                            ? "bg-amber-100 text-amber-700"
                                                                            : apt.status === "completed"
                                                                                ? "bg-blue-100 text-blue-700"
                                                                                : "bg-red-100 text-red-700"}`, children: apt.status === "confirmed"
                                                                        ? "Xác nhận"
                                                                        : apt.status === "pending"
                                                                            ? "Chờ"
                                                                            : apt.status === "completed"
                                                                                ? "Hoàn tất"
                                                                                : "Hủy" }) })] }, apt.id))) })] }) }))] }), _jsxs("div", { className: "bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg shadow p-6 border border-green-100", children: [_jsx("h3", { className: "font-bold text-gray-900 mb-4", children: "\uD83D\uDCA1 M\u1EB9o ch\u0103m s\u00F3c r\u0103ng h\u00E0ng ng\u00E0y" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
                                            {
                                                icon: "🪥",
                                                tip: "Đánh răng ít nhất 2 lần/ngày, mỗi lần 2 phút",
                                            },
                                            {
                                                icon: "🧵",
                                                tip: "Dùng chỉ nha khoa hàng ngày để loại bỏ plaque",
                                            },
                                            {
                                                icon: "🩺",
                                                tip: "Khám nha khoa mỗi 6 tháng một lần",
                                            },
                                        ].map((t, i) => (_jsxs("div", { className: "flex items-start gap-3 p-3 bg-white rounded-lg", children: [_jsx("span", { className: "text-2xl", children: t.icon }), _jsx("p", { className: "text-sm text-gray-700", children: t.tip })] }, i))) })] })] })] })] }));
}
