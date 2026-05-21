import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { adminApi } from "../../services/api";
export default function AdminReports() {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState("month");
    const [exporting, setExporting] = useState(false);
    useEffect(() => {
        loadReportData();
    }, [period]);
    const loadReportData = async () => {
        setLoading(true);
        try {
            const response = await adminApi.getDashboard();
            const data = response.data.data;
            setReportData({
                period: period === "month" ? "Tháng này" : "Năm nay",
                totalAppointments: data.appointments?.total || 0,
                completedAppointments: data.appointments?.completed || 0,
                cancelledAppointments: data.appointments?.cancelled || 0,
                revenue: data.revenue?.total || 0,
                newPatients: data.users?.newThisMonth || 0,
                newDoctors: 0,
            });
        }
        catch (err) {
            console.error("Failed to load report:", err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleExportExcel = () => {
        if (!reportData)
            return;
        setExporting(true);
        try {
            // Create CSV content
            const csvContent = `Kỳ báo cáo,${reportData.period}
Ngày in,${new Date().toLocaleDateString("vi-VN")}

Thống kê lịch hẹn
Tổng lịch hẹn,${reportData.totalAppointments}
Lịch hẹn hoàn tất,${reportData.completedAppointments}
Lịch hẹn hủy,${reportData.cancelledAppointments}
Tỷ lệ hoàn tất,${reportData.totalAppointments > 0
                ? ((reportData.completedAppointments /
                    reportData.totalAppointments) *
                    100).toFixed(1)
                : 0}%

Tài chính
Doanh thu (VND),${reportData.revenue}

Người dùng mới
Bệnh nhân mới,${reportData.newPatients}
`;
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `bao-cao-${reportData.period.replace(/\s/g, "-")}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
        catch (err) {
            console.error("Failed to export:", err);
        }
        finally {
            setExporting(false);
        }
    };
    const handleExportPDF = () => {
        if (!reportData)
            return;
        setExporting(true);
        try {
            const content = `
BÁOCÁO QUẢN LÝ PHÒNG KHÁM NHA KHOA
=====================================

Kỳ báo cáo: ${reportData.period}
Ngày in: ${new Date().toLocaleDateString("vi-VN")}

1. THỐNG KÊ LỊCH HẸN
- Tổng lịch hẹn: ${reportData.totalAppointments}
- Hoàn tất: ${reportData.completedAppointments}
- Hủy: ${reportData.cancelledAppointments}
- Tỷ lệ hoàn tất: ${reportData.totalAppointments > 0
                ? ((reportData.completedAppointments /
                    reportData.totalAppointments) *
                    100).toFixed(1)
                : 0}%

2. TÀI CHÍNH
- Doanh thu: ${reportData.revenue.toLocaleString("vi-VN")} VND

3. NGƯỜI DÙNG MỚI
- Bệnh nhân mới: ${reportData.newPatients}

=====================================
Báo cáo được tạo tự động bởi hệ thống
      `;
            const blob = new Blob([content], { type: "text/plain" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `bao-cao-${reportData.period.replace(/\s/g, "-")}.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
        catch (err) {
            console.error("Failed to export PDF:", err);
        }
        finally {
            setExporting(false);
        }
    };
    if (loading) {
        return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsx(AdminSidebar, {}), _jsx("div", { className: "flex-1 ml-64 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "\u0110ang t\u1EA3i b\u00E1o c\u00E1o..." })] }) })] }));
    }
    return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsx(AdminSidebar, {}), _jsxs("div", { className: "flex-1 ml-64 overflow-y-auto", children: [_jsx("div", { className: "bg-white border-b border-gray-200 p-6 sticky top-0 z-10", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "B\u00E1o c\u00E1o" }), _jsx("p", { className: "text-gray-600 text-sm", children: new Date().toLocaleDateString("vi-VN") })] }), _jsx("div", { className: "flex gap-3", children: _jsxs("select", { value: period, onChange: (e) => setPeriod(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-lg text-sm", children: [_jsx("option", { value: "month", children: "Th\u00E1ng n\u00E0y" }), _jsx("option", { value: "year", children: "N\u0103m nay" })] }) })] }) }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6 border-l-4 border-blue-500", children: [_jsx("p", { className: "text-sm text-gray-600 font-medium", children: "T\u1ED5ng l\u1ECBch h\u1EB9n" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: reportData?.totalAppointments })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 border-l-4 border-green-500", children: [_jsx("p", { className: "text-sm text-gray-600 font-medium", children: "L\u1ECBch h\u1EB9n ho\u00E0n t\u1EA5t" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: reportData?.completedAppointments }), _jsxs("p", { className: "text-xs text-green-600 mt-2", children: ["T\u1EF7 l\u1EC7:", " ", reportData?.totalAppointments
                                                        ? ((reportData.completedAppointments /
                                                            reportData.totalAppointments) *
                                                            100).toFixed(1)
                                                        : 0, "%"] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 border-l-4 border-red-500", children: [_jsx("p", { className: "text-sm text-gray-600 font-medium", children: "L\u1ECBch h\u1EB9n h\u1EE7y" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: reportData?.cancelledAppointments })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 border-l-4 border-emerald-500", children: [_jsx("p", { className: "text-sm text-gray-600 font-medium", children: "Doanh thu" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: (reportData?.revenue || 0).toLocaleString("vi-VN") }), _jsx("p", { className: "text-xs text-gray-600 mt-2", children: "VND" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 border-l-4 border-purple-500", children: [_jsx("p", { className: "text-sm text-gray-600 font-medium", children: "B\u1EC7nh nh\u00E2n m\u1EDBi" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: reportData?.newPatients })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 mb-4", children: "Xu\u1EA5t b\u00E1o c\u00E1o" }), _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { onClick: handleExportExcel, disabled: exporting, className: "bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50", children: exporting ? "Đang xuất..." : "📊 Xuất CSV" }), _jsx("button", { onClick: handleExportPDF, disabled: exporting, className: "bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50", children: exporting ? "Đang xuất..." : "📄 Xuất TXT" }), _jsx("button", { onClick: () => window.print(), className: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors", children: "\uD83D\uDDA8\uFE0F In" })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 mb-4", children: "Chi ti\u1EBFt b\u00E1o c\u00E1o" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center py-3 border-b border-gray-200", children: [_jsx("span", { className: "text-gray-700", children: "T\u1ED5ng l\u1ECBch h\u1EB9n" }), _jsx("span", { className: "font-bold text-gray-900", children: reportData?.totalAppointments })] }), _jsxs("div", { className: "flex justify-between items-center py-3 border-b border-gray-200", children: [_jsx("span", { className: "text-gray-700", children: "L\u1ECBch h\u1EB9n ho\u00E0n t\u1EA5t" }), _jsx("span", { className: "font-bold text-gray-900", children: reportData?.completedAppointments })] }), _jsxs("div", { className: "flex justify-between items-center py-3 border-b border-gray-200", children: [_jsx("span", { className: "text-gray-700", children: "L\u1ECBch h\u1EB9n h\u1EE7y" }), _jsx("span", { className: "font-bold text-gray-900", children: reportData?.cancelledAppointments })] }), _jsxs("div", { className: "flex justify-between items-center py-3 border-b border-gray-200", children: [_jsx("span", { className: "text-gray-700", children: "Doanh thu" }), _jsxs("span", { className: "font-bold text-gray-900", children: [(reportData?.revenue || 0).toLocaleString("vi-VN"), " VND"] })] }), _jsxs("div", { className: "flex justify-between items-center py-3", children: [_jsx("span", { className: "text-gray-700", children: "B\u1EC7nh nh\u00E2n m\u1EDBi" }), _jsx("span", { className: "font-bold text-gray-900", children: reportData?.newPatients })] })] })] })] })] })] }));
}
