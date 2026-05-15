import { useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";

interface Settings {
  clinicName: string;
  clinicEmail: string;
  clinicPhone: string;
  clinicAddress: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  appointmentDuration: number;
  notificationEmail: string;
  maintenanceMode: boolean;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    clinicName: "VinaMec Dental Care",
    clinicEmail: "contact@vinamec.com",
    clinicPhone: "0243 123 456 789",
    clinicAddress: "123 Phố Hàng Ngang, Hà Nội",
    workingHoursStart: "08:00",
    workingHoursEnd: "18:00",
    appointmentDuration: 30,
    notificationEmail: "admin@vinamec.com",
    maintenanceMode: false,
  });

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setSettings({
      ...settings,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "appointmentDuration"
            ? parseInt(value)
            : value,
    });
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-64 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cấu hình</h1>
            <p className="text-gray-600 text-sm">
              Quản lý cài đặt hệ thống phòng khám
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-w-4xl">
          {saved && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 font-medium">
                ✓ Cài đặt đã được lưu thành công
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Clinic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                📋 Thông tin phòng khám
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Tên phòng khám</label>
                  <input
                    type="text"
                    name="clinicName"
                    value={settings.clinicName}
                    onChange={handleChange}
                    className="input w-full"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Email</label>
                    <input
                      type="email"
                      name="clinicEmail"
                      value={settings.clinicEmail}
                      onChange={handleChange}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="label">Số điện thoại</label>
                    <input
                      type="tel"
                      name="clinicPhone"
                      value={settings.clinicPhone}
                      onChange={handleChange}
                      className="input w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Địa chỉ</label>
                  <input
                    type="text"
                    name="clinicAddress"
                    value={settings.clinicAddress}
                    onChange={handleChange}
                    className="input w-full"
                  />
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                ⏰ Giờ hoạt động
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Giờ mở cửa</label>
                    <input
                      type="time"
                      name="workingHoursStart"
                      value={settings.workingHoursStart}
                      onChange={handleChange}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="label">Giờ đóng cửa</label>
                    <input
                      type="time"
                      name="workingHoursEnd"
                      value={settings.workingHoursEnd}
                      onChange={handleChange}
                      className="input w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Thời lượng lịch hẹn (phút)</label>
                  <select
                    name="appointmentDuration"
                    value={settings.appointmentDuration}
                    onChange={handleChange}
                    className="input w-full"
                  >
                    <option value={15}>15 phút</option>
                    <option value={30}>30 phút</option>
                    <option value={45}>45 phút</option>
                    <option value={60}>60 phút</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                🔔 Thông báo
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Email thông báo</label>
                  <input
                    type="email"
                    name="notificationEmail"
                    value={settings.notificationEmail}
                    onChange={handleChange}
                    className="input w-full"
                  />
                </div>
              </div>
            </div>

            {/* System */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                ⚙️ Hệ thống
              </h3>
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium">
                  Chế độ bảo trì
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {settings.maintenanceMode
                      ? "Bật (hệ thống đang bảo trì)"
                      : "Tắt"}
                  </span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? "Đang lưu..." : "💾 Lưu cài đặt"}
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                🔄 Làm mới
              </button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Gợi ý</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • Thay đổi cài đặt sẽ có hiệu lực ngay tức thì trên hệ thống
              </li>
              <li>
                • Chế độ bảo trì sẽ ẩn trang web khỏi người dùng thông thường
              </li>
              <li>
                • Email thông báo sẽ nhận các thông báo quan trọng từ hệ thống
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
