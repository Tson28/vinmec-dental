import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { adminApi } from "../../services/api";

interface ReportData {
  period: string;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  revenue: number;
  newPatients: number;
  newDoctors: number;
}

export default function AdminReports() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
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
    } catch (err) {
      console.error("Failed to load report:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!reportData) return;

    setExporting(true);
    try {
      // Create CSV content
      const csvContent = `Kỳ báo cáo,${reportData.period}
Ngày in,${new Date().toLocaleDateString("vi-VN")}

Thống kê lịch hẹn
Tổng lịch hẹn,${reportData.totalAppointments}
Lịch hẹn hoàn tất,${reportData.completedAppointments}
Lịch hẹn hủy,${reportData.cancelledAppointments}
Tỷ lệ hoàn tất,${
        reportData.totalAppointments > 0
          ? (
              (reportData.completedAppointments /
                reportData.totalAppointments) *
              100
            ).toFixed(1)
          : 0
      }%

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
    } catch (err) {
      console.error("Failed to export:", err);
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = () => {
    if (!reportData) return;

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
- Tỷ lệ hoàn tất: ${
        reportData.totalAppointments > 0
          ? (
              (reportData.completedAppointments /
                reportData.totalAppointments) *
              100
            ).toFixed(1)
          : 0
      }%

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
    } catch (err) {
      console.error("Failed to export PDF:", err);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải báo cáo...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Báo cáo</h1>
              <p className="text-gray-600 text-sm">
                {new Date().toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div className="flex gap-3">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="month">Tháng này</option>
                <option value="year">Năm nay</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 font-medium">Tổng lịch hẹn</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {reportData?.totalAppointments}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <p className="text-sm text-gray-600 font-medium">
                Lịch hẹn hoàn tất
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {reportData?.completedAppointments}
              </p>
              <p className="text-xs text-green-600 mt-2">
                Tỷ lệ:{" "}
                {reportData?.totalAppointments
                  ? (
                      (reportData.completedAppointments /
                        reportData.totalAppointments) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
              <p className="text-sm text-gray-600 font-medium">Lịch hẹn hủy</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {reportData?.cancelledAppointments}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-emerald-500">
              <p className="text-sm text-gray-600 font-medium">Doanh thu</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {(reportData?.revenue || 0).toLocaleString("vi-VN")}
              </p>
              <p className="text-xs text-gray-600 mt-2">VND</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
              <p className="text-sm text-gray-600 font-medium">Bệnh nhân mới</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {reportData?.newPatients}
              </p>
            </div>
          </div>

          {/* Export Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Xuất báo cáo
            </h3>
            <div className="flex gap-4">
              <button
                onClick={handleExportExcel}
                disabled={exporting}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {exporting ? "Đang xuất..." : "📊 Xuất CSV"}
              </button>
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {exporting ? "Đang xuất..." : "📄 Xuất TXT"}
              </button>
              <button
                onClick={() => window.print()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                🖨️ In
              </button>
            </div>
          </div>

          {/* Detailed Report */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Chi tiết báo cáo
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-700">Tổng lịch hẹn</span>
                <span className="font-bold text-gray-900">
                  {reportData?.totalAppointments}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-700">Lịch hẹn hoàn tất</span>
                <span className="font-bold text-gray-900">
                  {reportData?.completedAppointments}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-700">Lịch hẹn hủy</span>
                <span className="font-bold text-gray-900">
                  {reportData?.cancelledAppointments}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-700">Doanh thu</span>
                <span className="font-bold text-gray-900">
                  {(reportData?.revenue || 0).toLocaleString("vi-VN")} VND
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-700">Bệnh nhân mới</span>
                <span className="font-bold text-gray-900">
                  {reportData?.newPatients}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
