import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Sidebar from "./sidebar";
import Navbar from "./NavBar";
export default function DashboardLayout({ title, children }) {
    const [collapsed, setCollapsed] = useState(false);
    return (_jsxs("div", { className: "flex h-screen overflow-hidden bg-surface-50", children: [_jsx(Sidebar, { collapsed: collapsed, onCollapse: () => setCollapsed(!collapsed) }), _jsxs("div", { className: "flex flex-col flex-1 min-w-0 overflow-hidden", children: [_jsx(Navbar, { title: title }), _jsx("main", { className: "flex-1 overflow-y-auto p-6", children: _jsx("div", { className: "animate-fade-in", children: children }) })] })] }));
}
