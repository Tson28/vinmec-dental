import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
export default function DoctorSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const isActive = (path) => {
        if (path === "/doctor") {
            return location.pathname === "/doctor";
        }
        return location.pathname === path || location.pathname.startsWith(path + "/");
    };
    const menuItems = [
        { icon: "📊", label: "Dashboard", path: "/doctor" },
        { icon: "👥", label: "Bệnh nhân", path: "/doctor/patients" },
        { icon: "📅", label: "Lịch hẹn", path: "/doctor/appointments" },
        { icon: "📋", label: "Hồ sơ", path: "/doctor/records" },
        { icon: "🖼️", label: "Hình ảnh", path: "/doctor/images" },
        { icon: "💬", label: "Tin nhắn", path: "/doctor/chat" },
        { icon: "📹", label: "Video Call", path: "/video-call" },
    ];
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        navigate("/login");
    };
    return (_jsxs("div", { className: `sidebar transition-all duration-300 ${isOpen ? "w-64" : "w-20"} bg-white text-gray-900 h-screen fixed left-0 top-0 flex flex-col border-r border-gray-200`, children: [_jsxs("div", { className: "p-6 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: `flex items-center gap-3 ${!isOpen && "hidden"}`, children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg", children: "D" }), _jsxs("div", { children: [_jsx("span", { className: "font-bold text-lg block text-gray-900", children: "Doctor" }), _jsx("span", { className: "text-xs text-gray-500", children: "Portal" })] })] }), isOpen && (_jsx("button", { onClick: () => setIsOpen(!isOpen), className: "hover:bg-gray-200 p-2 rounded transition-colors text-gray-600", title: "Collapse", children: "\u2039" })), !isOpen && (_jsx("button", { onClick: () => setIsOpen(!isOpen), className: "hover:bg-gray-200 p-2 rounded transition-colors w-full text-gray-600", title: "Expand", children: "\u203A" }))] }), _jsx("nav", { className: "flex-1 overflow-y-auto py-6", children: _jsxs("div", { className: `space-y-1 ${isOpen ? "px-4" : "px-2"}`, children: [isOpen && (_jsx("div", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3", children: "Danh m\u1EE5c" })), menuItems.map((item) => (_jsxs("button", { onClick: () => navigate(item.path), className: `w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${isActive(item.path)
                                ? "bg-purple-600 text-white shadow-lg"
                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`, title: !isOpen ? item.label : undefined, children: [_jsx("span", { className: "text-lg", children: item.icon }), isOpen && (_jsx("span", { className: "text-sm font-medium", children: item.label }))] }, item.path)))] }) }), _jsx("div", { className: `border-t border-gray-200 p-4 space-y-2 bg-gray-50`, children: _jsxs("button", { onClick: handleLogout, className: `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium text-sm ${!isOpen && "justify-center"}`, title: !isOpen ? "Đăng xuất" : undefined, children: [_jsx("span", { className: "text-lg", children: "\uD83D\uDEAA" }), isOpen && _jsx("span", { children: "\u0110\u0103ng xu\u1EA5t" })] }) })] }));
}
