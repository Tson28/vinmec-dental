import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import { serviceApi } from "../../services/api";
import { useApi } from "../../hooks/useApi";
export default function AdminServices() {
    const { data: services, loading, refetch, } = useApi(() => serviceApi.getAll());
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const columns = [
        {
            key: "name",
            header: "SERVICE",
            render: (s) => (_jsx("span", { className: "font-semibold text-gray-900", children: s.name })),
        },
        {
            key: "category",
            header: "CATEGORY",
            render: (s) => (_jsx("span", { className: "px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold", children: s.category || "General" })),
        },
        {
            key: "duration",
            header: "DURATION",
            render: (s) => (_jsxs("span", { className: "text-gray-700", children: [s.duration || 30, " min"] })),
        },
        {
            key: "price",
            header: "PRICE",
            render: (s) => (_jsxs("span", { className: "font-mono font-semibold text-gray-900", children: [Number(s.price || 0).toLocaleString("vi-VN"), " \u20AB"] })),
        },
        {
            key: "active",
            header: "STATUS",
            render: (s) => (_jsx("span", { className: s.active !== false
                    ? "px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold"
                    : "px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold", children: s.active !== false ? "Active" : "Inactive" })),
        },
        {
            key: "actions",
            header: "ACTIONS",
            render: (s) => (_jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => {
                            setSelected(s);
                            setShowModal(true);
                        }, className: "text-blue-600 hover:text-blue-800 font-medium text-sm", children: "Edit" }), _jsx("button", { onClick: async () => {
                            if (confirm("Xóa dịch vụ này?")) {
                                await serviceApi.delete(s._id);
                                refetch();
                            }
                        }, className: "text-red-600 hover:text-red-800 font-medium text-sm", children: "Delete" })] })),
        },
    ];
    return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsx(AdminSidebar, {}), _jsxs("div", { className: "flex-1 ml-64 overflow-y-auto", children: [_jsx("div", { className: "bg-white border-b border-gray-200 p-6 sticky top-0 z-10", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Qu\u1EA3n l\u00FD D\u1ECBch v\u1EE5" }), _jsx("p", { className: "text-gray-600 text-sm", children: "Wednesday, May 13, 2026" })] }), _jsx("button", { onClick: () => {
                                        setSelected(null);
                                        setShowModal(true);
                                    }, className: "bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors", children: "+ Add Service" })] }) }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: ["Phòng ngừa", "Phục hồi", "Thẩm mỹ", "Cấp cứu"].map((cat, i) => {
                                    const icons = ["🛡️", "🔧", "✨", "🚨"];
                                    const count = (services || []).filter((s) => s.category === cat).length;
                                    return (_jsxs("div", { className: "bg-white rounded-lg p-4 shadow hover:shadow-lg transition-all text-center", children: [_jsx("div", { className: "text-3xl mb-2", children: icons[i] }), _jsx("p", { className: "font-bold text-2xl text-gray-900", children: count }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: cat })] }, cat));
                                }) }), _jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsxs("div", { className: "p-6 border-b border-gray-200", children: [_jsx("h2", { className: "text-lg font-bold text-gray-900", children: "Dental Services" }), _jsxs("p", { className: "text-sm text-gray-600", children: [(services || []).length, " services available"] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsx(Table, { columns: columns, data: services || [], loading: loading }) })] })] })] }), _jsx(Modal, { open: showModal, onClose: () => setShowModal(false), title: selected ? "Edit Service" : "Add Service", children: _jsx(ServiceForm, { service: selected, onClose: () => {
                        setShowModal(false);
                        refetch();
                    } }) })] }));
}
function ServiceForm({ service, onClose, }) {
    const [form, setForm] = useState({
        name: service?.name || "",
        description: service?.description || "",
        duration: service?.duration || 30,
        price: service?.price || 0,
        category: service?.category || "Preventive",
        active: service?.active !== false,
    });
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (service)
                await serviceApi.update(service._id, form);
            else
                await serviceApi.create(form);
            onClose();
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "label", children: "Service Name" }), _jsx("input", { className: "input", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Description" }), _jsx("input", { className: "input", value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "label", children: "Duration (min)" }), _jsx("input", { type: "number", className: "input", value: form.duration, onChange: (e) => setForm({ ...form, duration: Number(e.target.value) }) })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Price (VND)" }), _jsx("input", { type: "number", className: "input", value: form.price, onChange: (e) => setForm({ ...form, price: Number(e.target.value) }) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Category" }), _jsx("select", { className: "input", value: form.category, onChange: (e) => setForm({ ...form, category: e.target.value }), children: [
                            "Preventive",
                            "Restorative",
                            "Cosmetic",
                            "Emergency",
                            "General",
                        ].map((c) => (_jsx("option", { value: c, children: c }, c))) })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: form.active, onChange: (e) => setForm({ ...form, active: e.target.checked }), className: "rounded" }), _jsx("span", { className: "text-sm font-medium text-surface-700", children: "Active" })] }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx("button", { type: "submit", className: "btn-primary flex-1", disabled: loading, children: loading ? "Saving..." : "Save" }), _jsx("button", { type: "button", className: "btn-secondary flex-1", onClick: onClose, children: "Cancel" })] })] }));
}
