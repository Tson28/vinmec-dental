import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import { userApi } from "../../services/api";
import { useApi } from "../../hooks/useApi";
export default function AdminUsers() {
    const { data: users, loading, refetch, } = useApi(() => userApi.getAll());
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const filtered = (users || []).filter((u) => u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()));
    const handleDelete = async (id) => {
        if (!confirm("Xóa người dùng này?"))
            return;
        setDeleting(id);
        try {
            await userApi.delete(id);
            refetch();
        }
        finally {
            setDeleting(null);
        }
    };
    const columns = [
        {
            key: "name",
            header: "NAME",
            render: (u) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold", children: u.name?.charAt(0).toUpperCase() }), _jsx("span", { className: "font-medium text-gray-900", children: u.name })] })),
        },
        {
            key: "email",
            header: "EMAIL",
            render: (u) => _jsx("span", { className: "text-gray-700", children: u.email }),
        },
        {
            key: "role",
            header: "ROLE",
            render: (u) => (_jsx("span", { className: `px-3 py-1 rounded-full text-xs font-semibold ${u.role === "admin"
                    ? "bg-red-100 text-red-700"
                    : u.role === "doctor"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"}`, children: u.role })),
        },
        {
            key: "phone",
            header: "PHONE",
            render: (u) => (_jsx("span", { className: "text-gray-700", children: u.phone || "—" })),
        },
        {
            key: "actions",
            header: "ACTIONS",
            render: (u) => (_jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => {
                            setSelected(u);
                            setShowModal(true);
                        }, className: "text-blue-600 hover:text-blue-800 font-medium text-sm", children: "Edit" }), _jsx("button", { onClick: () => handleDelete(u._id), disabled: deleting === u._id, className: "text-red-600 hover:text-red-800 font-medium text-sm disabled:opacity-50", children: deleting === u._id ? "..." : "Delete" })] })),
        },
    ];
    return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsx(AdminSidebar, {}), _jsxs("div", { className: "flex-1 ml-64 overflow-y-auto", children: [_jsx("div", { className: "bg-white border-b border-gray-200 p-6 sticky top-0 z-10", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Qu\u1EA3n l\u00FD Ng\u01B0\u1EDDi d\u00F9ng" }), _jsx("p", { className: "text-gray-600 text-sm", children: "Wednesday, May 13, 2026" })] }), _jsx("button", { onClick: () => {
                                        setSelected(null);
                                        setShowModal(true);
                                    }, className: "bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors", children: "+ Add User" })] }) }), _jsx("div", { className: "p-6", children: _jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsxs("div", { className: "p-6 border-b border-gray-200", children: [_jsx("div", { className: "flex justify-between items-center mb-4", children: _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-gray-900", children: "All Users" }), _jsxs("p", { className: "text-sm text-gray-600", children: [filtered.length, " users found"] })] }) }), _jsx("input", { className: "w-full px-4 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500", placeholder: "Search users...", value: search, onChange: (e) => setSearch(e.target.value) })] }), _jsx("div", { className: "overflow-x-auto", children: _jsx(Table, { columns: columns, data: filtered, loading: loading }) })] }) })] }), _jsx(Modal, { open: showModal, onClose: () => setShowModal(false), title: selected ? "Edit User" : "Add User", children: _jsx(UserForm, { user: selected, onClose: () => {
                        setShowModal(false);
                        refetch();
                    } }) })] }));
}
function UserForm({ user, onClose, }) {
    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        role: user?.role || "patient",
        phone: user?.phone || "",
    });
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (user)
                await userApi.update(user._id, form);
            else
                await userApi.create(form);
            onClose();
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "label", children: "Name" }), _jsx("input", { className: "input", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Email" }), _jsx("input", { type: "email", className: "input", value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Phone" }), _jsx("input", { className: "input", value: form.phone, onChange: (e) => setForm({ ...form, phone: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Role" }), _jsxs("select", { className: "input", value: form.role, onChange: (e) => setForm({ ...form, role: e.target.value }), children: [_jsx("option", { value: "patient", children: "Patient" }), _jsx("option", { value: "doctor", children: "Doctor" }), _jsx("option", { value: "admin", children: "Admin" })] })] }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx("button", { type: "submit", className: "btn-primary flex-1", disabled: loading, children: loading ? "Saving..." : "Save" }), _jsx("button", { type: "button", className: "btn-secondary flex-1", onClick: onClose, children: "Cancel" })] })] }));
}
