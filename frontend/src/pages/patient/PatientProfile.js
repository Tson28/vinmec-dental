import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (user?._id)
                await patientApi.update(user._id, form);
            setSuccess(true);
            setEditing(false);
            setTimeout(() => setSuccess(false), 3000);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "flex", children: [_jsx(PatientSidebar, {}), _jsxs("div", { className: "flex-1 ml-64", children: [_jsx("div", { className: "sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm", children: _jsx("div", { children: _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "H\u1ED3 s\u01A1 c\u1EE7a t\u00F4i" }) }) }), _jsxs("div", { className: "max-w-2xl space-y-6 p-8", children: [success && (_jsx("div", { className: "px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600", children: "\u2705 C\u1EADp nh\u1EADt h\u1ED3 s\u01A1 th\u00E0nh c\u00F4ng!" })), _jsxs("div", { className: "bg-white rounded-lg shadow p-6 flex items-center gap-6", children: [_jsx("div", { className: "w-20 h-20 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0", children: user?.name?.charAt(0) || "?" }), _jsxs("div", { className: "flex-1", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: user?.name }), _jsx("span", { className: "inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold", children: "B\u1EC7nh nh\u00E2n" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: user?.email })] }), _jsx("button", { onClick: () => setEditing(!editing), className: "px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition", children: editing ? "Hủy" : "Chỉnh sửa" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "font-bold text-gray-900 mb-4", children: "Th\u00F4ng tin c\u00E1 nh\u00E2n" }), editing ? (_jsxs("form", { onSubmit: handleSave, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-1", children: "H\u1ECD t\u00EAn" }), _jsx("input", { className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500", value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Phone" }), _jsx("input", { className: "input", value: form.phone, onChange: (e) => setForm({ ...form, phone: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Date of Birth" }), _jsx("input", { type: "date", className: "input", value: form.dob, onChange: (e) => setForm({ ...form, dob: e.target.value }) })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "submit", className: "btn-primary", disabled: loading, children: loading ? "Saving..." : "Save Changes" }), _jsx("button", { type: "button", className: "btn-secondary", onClick: () => setEditing(false), children: "Cancel" })] })] })) : (_jsx("div", { className: "grid grid-cols-2 gap-6", children: [
                                            { label: "Full Name", value: user?.name },
                                            { label: "Email", value: user?.email },
                                            { label: "Phone", value: user?.phone || "Not provided" },
                                            {
                                                label: "Date of Birth",
                                                value: user?.dob || "Not provided",
                                            },
                                        ].map(({ label, value }) => (_jsxs("div", { children: [_jsx("p", { className: "label", children: label }), _jsx("p", { className: "text-sm font-medium text-surface-800", children: value })] }, label))) }))] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "font-bold text-gray-900 mb-4", children: "T\u00F3m t\u1EAFt s\u1EE9c kh\u1ECFe" }), _jsx("div", { className: "grid grid-cols-3 gap-4", children: [
                                            { label: "Nhóm máu", value: "O+", icon: "🩸" },
                                            { label: "Dị ứng", value: "Không", icon: "⚠️" },
                                            { label: "Lần khám cuối", value: "2024-02-15", icon: "📅" },
                                        ].map(({ label, value, icon }) => (_jsxs("div", { className: "bg-gray-50 rounded-lg p-4 text-center", children: [_jsx("p", { className: "text-2xl mb-2", children: icon }), _jsx("p", { className: "font-bold text-gray-900 text-sm", children: value }), _jsx("p", { className: "text-xs text-gray-500", children: label })] }, label))) })] })] })] })] }));
}
