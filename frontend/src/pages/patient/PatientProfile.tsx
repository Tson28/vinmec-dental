import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
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
    <DashboardLayout title="My Profile">
      <div className="max-w-2xl space-y-6">
        {success && (
          <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-600">
            ✅ Profile updated successfully!
          </div>
        )}

        {/* Avatar Card */}
        <div className="card flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-dental flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
            {user?.name?.charAt(0) || "?"}
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-surface-900">
              {user?.name}
            </h2>
            <span className="badge badge-green mt-1">Patient</span>
            <p className="text-sm text-surface-500 mt-1">{user?.email}</p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="ml-auto btn-secondary"
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Info */}
        <div className="card">
          <h3 className="font-bold text-surface-800 mb-4">
            Personal Information
          </h3>
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    className="input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
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
        <div className="card">
          <h3 className="font-bold text-surface-800 mb-4">Health Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Blood Type", value: "O+", icon: "🩸" },
              { label: "Allergies", value: "None", icon: "⚠️" },
              { label: "Last Visit", value: "2024-02-15", icon: "📅" },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="bg-surface-50 rounded-xl p-4 text-center"
              >
                <p className="text-2xl mb-2">{icon}</p>
                <p className="font-bold text-surface-800 text-sm">{value}</p>
                <p className="text-xs text-surface-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
