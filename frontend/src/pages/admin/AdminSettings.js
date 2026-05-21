import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
export default function AdminSettings() {
    const [settings, setSettings] = useState({
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
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setSettings({
            ...settings,
            [name]: type === "checkbox"
                ? e.target.checked
                : name === "appointmentDuration"
                    ? parseInt(value)
                    : value,
        });
        setSaved(false);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
        finally {
            setSaving(false);
        }
    };
    return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsx(AdminSidebar, {}), _jsxs("div", { className: "flex-1 ml-64 overflow-y-auto", children: [_jsx("div", { className: "bg-white border-b border-gray-200 p-6 sticky top-0 z-10", children: _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "C\u1EA5u h\u00ECnh" }), _jsx("p", { className: "text-gray-600 text-sm", children: "Qu\u1EA3n l\u00FD c\u00E0i \u0111\u1EB7t h\u1EC7 th\u1ED1ng ph\u00F2ng kh\u00E1m" })] }) }), _jsxs("div", { className: "p-6 max-w-4xl", children: [saved && (_jsx("div", { className: "mb-6 bg-green-50 border border-green-200 rounded-lg p-4", children: _jsx("p", { className: "text-green-700 font-medium", children: "\u2713 C\u00E0i \u0111\u1EB7t \u0111\u00E3 \u0111\u01B0\u1EE3c l\u01B0u th\u00E0nh c\u00F4ng" }) })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 mb-4", children: "\uD83D\uDCCB Th\u00F4ng tin ph\u00F2ng kh\u00E1m" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "label", children: "T\u00EAn ph\u00F2ng kh\u00E1m" }), _jsx("input", { type: "text", name: "clinicName", value: settings.clinicName, onChange: handleChange, className: "input w-full" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "label", children: "Email" }), _jsx("input", { type: "email", name: "clinicEmail", value: settings.clinicEmail, onChange: handleChange, className: "input w-full" })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i" }), _jsx("input", { type: "tel", name: "clinicPhone", value: settings.clinicPhone, onChange: handleChange, className: "input w-full" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "\u0110\u1ECBa ch\u1EC9" }), _jsx("input", { type: "text", name: "clinicAddress", value: settings.clinicAddress, onChange: handleChange, className: "input w-full" })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 mb-4", children: "\u23F0 Gi\u1EDD ho\u1EA1t \u0111\u1ED9ng" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "label", children: "Gi\u1EDD m\u1EDF c\u1EEDa" }), _jsx("input", { type: "time", name: "workingHoursStart", value: settings.workingHoursStart, onChange: handleChange, className: "input w-full" })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Gi\u1EDD \u0111\u00F3ng c\u1EEDa" }), _jsx("input", { type: "time", name: "workingHoursEnd", value: settings.workingHoursEnd, onChange: handleChange, className: "input w-full" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Th\u1EDDi l\u01B0\u1EE3ng l\u1ECBch h\u1EB9n (ph\u00FAt)" }), _jsxs("select", { name: "appointmentDuration", value: settings.appointmentDuration, onChange: handleChange, className: "input w-full", children: [_jsx("option", { value: 15, children: "15 ph\u00FAt" }), _jsx("option", { value: 30, children: "30 ph\u00FAt" }), _jsx("option", { value: 45, children: "45 ph\u00FAt" }), _jsx("option", { value: 60, children: "60 ph\u00FAt" })] })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 mb-4", children: "\uD83D\uDD14 Th\u00F4ng b\u00E1o" }), _jsx("div", { className: "space-y-4", children: _jsxs("div", { children: [_jsx("label", { className: "label", children: "Email th\u00F4ng b\u00E1o" }), _jsx("input", { type: "email", name: "notificationEmail", value: settings.notificationEmail, onChange: handleChange, className: "input w-full" })] }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsx("h3", { className: "text-lg font-bold text-gray-900 mb-4", children: "\u2699\uFE0F H\u1EC7 th\u1ED1ng" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { className: "text-gray-700 font-medium", children: "Ch\u1EBF \u0111\u1ED9 b\u1EA3o tr\u00EC" }), _jsxs("label", { className: "flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", name: "maintenanceMode", checked: settings.maintenanceMode, onChange: handleChange, className: "w-5 h-5 text-blue-600 cursor-pointer" }), _jsx("span", { className: "ml-2 text-sm text-gray-600", children: settings.maintenanceMode
                                                                    ? "Bật (hệ thống đang bảo trì)"
                                                                    : "Tắt" })] })] })] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("button", { type: "submit", disabled: saving, className: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50", children: saving ? "Đang lưu..." : "💾 Lưu cài đặt" }), _jsx("button", { type: "button", onClick: () => window.location.reload(), className: "bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors", children: "\uD83D\uDD04 L\u00E0m m\u1EDBi" })] })] }), _jsxs("div", { className: "mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4", children: [_jsx("h4", { className: "font-semibold text-blue-900 mb-2", children: "\uD83D\uDCA1 G\u1EE3i \u00FD" }), _jsxs("ul", { className: "text-sm text-blue-800 space-y-1", children: [_jsx("li", { children: "\u2022 Thay \u0111\u1ED5i c\u00E0i \u0111\u1EB7t s\u1EBD c\u00F3 hi\u1EC7u l\u1EF1c ngay t\u1EE9c th\u00EC tr\u00EAn h\u1EC7 th\u1ED1ng" }), _jsx("li", { children: "\u2022 Ch\u1EBF \u0111\u1ED9 b\u1EA3o tr\u00EC s\u1EBD \u1EA9n trang web kh\u1ECFi ng\u01B0\u1EDDi d\u00F9ng th\u00F4ng th\u01B0\u1EDDng" }), _jsx("li", { children: "\u2022 Email th\u00F4ng b\u00E1o s\u1EBD nh\u1EADn c\u00E1c th\u00F4ng b\u00E1o quan tr\u1ECDng t\u1EEB h\u1EC7 th\u1ED1ng" })] })] })] })] })] }));
}
