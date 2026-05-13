import { useState } from "react";
import PatientSidebar from "../../components/layout/PatientSidebar";
import { useAuth } from "../../context/AuthContext";
import { patientApi } from "../../services/api";

export default function PatientProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dob: user?.dob || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user?._id) await patientApi.update(user._id, form);
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <PatientSidebar />
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hồ sơ của tôi</h1>
          </div>
        </div>

        <div className="max-w-2xl space-y-6 p-8">
          {success && (
            <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
              ✅ Cập nhật hồ sơ thành công!
            </div>
          )}

          {/* Avatar Card */}
          <div className="bg-white rounded-lg shadow p-6 flex items-center gap-6">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {user?.name?.charAt(0) || "?"}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.name}
              </h2>
              <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Bệnh nhân</span>
              <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              {editing ? "Hủy" : "Chỉnh sửa"}
            </button>
          </div>

          {/* Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-900 mb-4">
              Thông tin cá nhân
            </h3>
            {editing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Họ tên</label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input
                    className="input"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="label">Date of Birth</label>
                  <input
                    type="date"
                    className="input"
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Full Name", value: user?.name },
                { label: "Email", value: user?.email },
                { label: "Phone", value: user?.phone || "Not provided" },
                { label: "Date of Birth", value: user?.dob || "Not provided" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="label">{label}</p>
                  <p className="text-sm font-medium text-surface-800">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Health Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-gray-900 mb-4">Tóm tắt sức khỏe</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Nhóm máu", value: "O+", icon: "🩸" },
              { label: "Dị ứng", value: "Không", icon: "⚠️" },
              { label: "Lần khám cuối", value: "2024-02-15", icon: "📅" },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="bg-gray-50 rounded-lg p-4 text-center"
              >
                <p className="text-2xl mb-2">{icon}</p>
                <p className="font-bold text-gray-900 text-sm">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
        </div>
    </div>
  );
}
