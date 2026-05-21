import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import { doctorApi } from "../../services/api";
import { useApi } from "../../hooks/useApi";
export default function AdminDoctors() {
    const { data: doctors, loading, refetch, } = useApi(() => doctorApi.getAll());
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const filtered = (doctors || []).filter((d) => d.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization?.toLowerCase().includes(search.toLowerCase()));
    const columns = [
        {
            key: "name",
            header: "DOCTOR",
            render: (d) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold", children: d.name?.charAt(0).toUpperCase() }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: d.name }), _jsx("p", { className: "text-xs text-gray-500", children: d.email })] })] })),
        },
        {
            key: "specialization",
            header: "SPECIALIZATION",
            render: (d) => (_jsx("span", { className: "text-gray-700", children: d.specialization || "General Dentistry" })),
        },
        {
            key: "phone",
            header: "PHONE",
            render: (d) => (_jsx("span", { className: "text-gray-700", children: d.phone || "—" })),
        },
        {
            key: "status",
            header: "STATUS",
            render: () => (_jsx("span", { className: "px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold", children: "Active" })),
        },
        {
            key: "actions",
            header: "ACTIONS",
            render: (d) => (_jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => {
                            setSelected(d);
                            setShowModal(true);
                        }, className: "text-blue-600 hover:text-blue-800 font-medium text-sm", children: "Edit" }), _jsx("button", { onClick: async () => {
                            if (confirm("Xóa bác sĩ này?")) {
                                await doctorApi.delete(d._id);
                                refetch();
                            }
                        }, className: "text-red-600 hover:text-red-800 font-medium text-sm", children: "Delete" })] })),
        },
    ];
    return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsx(AdminSidebar, {}), _jsxs("div", { className: "flex-1 ml-64 overflow-y-auto", children: [_jsx("div", { className: "bg-white border-b border-gray-200 p-6 sticky top-0 z-10", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Qu\u1EA3n l\u00FD B\u00E1c s\u0129" }), _jsx("p", { className: "text-gray-600 text-sm", children: "Wednesday, May 13, 2026" })] }), _jsx("button", { onClick: () => {
                                        setSelected(null);
                                        setShowModal(true);
                                    }, className: "bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors", children: "+ Add Doctor" })] }) }), _jsx("div", { className: "p-6", children: _jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsxs("div", { className: "p-6 border-b border-gray-200", children: [_jsx("div", { className: "flex justify-between items-center mb-4", children: _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-gray-900", children: "Medical Staff" }), _jsxs("p", { className: "text-sm text-gray-600", children: [filtered.length, " doctors on record"] })] }) }), _jsx("input", { className: "w-full px-4 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500", placeholder: "Search doctors...", value: search, onChange: (e) => setSearch(e.target.value) })] }), _jsx("div", { className: "overflow-x-auto", children: _jsx(Table, { columns: columns, data: filtered, loading: loading }) })] }) })] }), _jsx(Modal, { open: showModal, onClose: () => setShowModal(false), title: selected ? "Edit Doctor" : "Add Doctor", children: _jsx(DoctorForm, { doctor: selected, onClose: () => {
                        setShowModal(false);
                        refetch();
                    } }) })] }));
}
function DoctorForm({ doctor, onClose, }) {
    const [form, setForm] = useState({
        name: doctor?.name || "",
        email: doctor?.email || "",
        phone: doctor?.phone || "",
        specialization: doctor?.specialization || "",
    });
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (doctor)
                await doctorApi.update(doctor._id, form);
            else
                await doctorApi.create({ ...form, role: "doctor" });
            onClose();
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "label", children: "Full Name" }), _jsx("input", { className: "input", value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Email" }), _jsx("input", { type: "email", className: "input", value: form.email, onChange: (e) => setForm({ ...form, email: e.target.value }), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Phone" }), _jsx("input", { className: "input", value: form.phone, onChange: (e) => setForm({ ...form, phone: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Specialization" }), _jsxs("select", { className: "input", value: form.specialization, onChange: (e) => setForm({ ...form, specialization: e.target.value }), children: [_jsx("option", { value: "", children: "General Dentistry" }), _jsx("option", { value: "Orthodontics", children: "Orthodontics" }), _jsx("option", { value: "Endodontics", children: "Endodontics" }), _jsx("option", { value: "Periodontics", children: "Periodontics" }), _jsx("option", { value: "Oral Surgery", children: "Oral Surgery" }), _jsx("option", { value: "Pediatric Dentistry", children: "Pediatric Dentistry" })] })] }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx("button", { type: "submit", className: "btn-primary flex-1", disabled: loading, children: loading ? "Saving..." : "Save" }), _jsx("button", { type: "button", className: "btn-secondary flex-1", onClick: onClose, children: "Cancel" })] })] }));
}
