import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import DoctorSidebar from "../../components/layout/DoctorSidebar";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import { recordApi, patientApi } from "../../services/api";
import { useApi } from "../../hooks/useApi";
export default function DoctorRecords() {
    const { data: records, loading, refetch, } = useApi(() => recordApi.getAll());
    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const filtered = (records || []).filter((r) => r.patientName?.toLowerCase().includes(search.toLowerCase()) ||
        r.diagnosis?.toLowerCase().includes(search.toLowerCase()));
    const columns = [
        {
            key: "patientName",
            header: "Patient",
            render: (r) => (_jsx("span", { className: "font-medium", children: r.patientName })),
        },
        {
            key: "diagnosis",
            header: "Diagnosis",
            render: (r) => (_jsx("span", { className: "text-surface-600", children: r.diagnosis })),
        },
        {
            key: "treatment",
            header: "Treatment",
            render: (r) => (_jsx("span", { className: "text-surface-600 truncate max-w-xs block", children: r.treatment })),
        },
        { key: "date", header: "Date" },
        {
            key: "actions",
            header: "",
            render: (r) => (_jsx("button", { onClick: () => {
                    setSelected(r);
                    setShowModal(true);
                }, className: "text-xs text-dental-600 font-medium", children: "View" })),
        },
    ];
    return (_jsxs("div", { className: "flex", children: [_jsx(DoctorSidebar, {}), _jsxs("div", { className: "flex-1 ml-64", children: [_jsxs("div", { className: "sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "H\u1ED3 s\u01A1 y t\u1EBF" }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: [filtered.length, " h\u1ED3 s\u01A1"] })] }), _jsx("button", { onClick: () => setShowForm(true), className: "px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition", children: "+ T\u1EA1o m\u1EDBi" })] }), _jsx("div", { className: "space-y-4 p-8", children: _jsxs("div", { className: "bg-white rounded-lg shadow p-4", children: [_jsx("div", { className: "mb-4", children: _jsx("input", { className: "w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500", placeholder: "T\u00ECm ki\u1EBFm h\u1ED3 s\u01A1...", value: search, onChange: (e) => setSearch(e.target.value) }) }), _jsx(Table, { columns: columns, data: filtered, loading: loading })] }) }), _jsx(Modal, { open: showModal, onClose: () => setShowModal(false), title: "Medical Record", size: "lg", children: selected && (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "grid grid-cols-2 gap-4", children: [
                                        ["Patient", selected.patientName],
                                        ["Doctor", selected.doctorName],
                                        ["Date", selected.date],
                                        ["Diagnosis", selected.diagnosis],
                                    ].map(([k, v]) => (_jsxs("div", { children: [_jsx("label", { className: "label", children: k }), _jsx("p", { className: "text-sm text-surface-800", children: v })] }, k))) }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Treatment" }), _jsx("p", { className: "text-sm text-surface-800", children: selected.treatment })] }), selected.prescription && (_jsxs("div", { children: [_jsx("label", { className: "label", children: "Prescription" }), _jsx("p", { className: "text-sm text-surface-800", children: selected.prescription })] })), selected.notes && (_jsxs("div", { children: [_jsx("label", { className: "label", children: "Notes" }), _jsx("p", { className: "text-sm text-surface-800", children: selected.notes })] })), _jsx("button", { onClick: () => setShowModal(false), className: "btn-secondary w-full", children: "Close" })] })) }), _jsx(Modal, { open: showForm, onClose: () => setShowForm(false), title: "New Medical Record", size: "lg", children: _jsx(RecordForm, { onClose: () => {
                                setShowForm(false);
                                refetch();
                            } }) })] })] }));
}
function RecordForm({ onClose }) {
    const [form, setForm] = useState({
        patientId: "",
        diagnosis: "",
        treatment: "",
        prescription: "",
        notes: "",
        date: new Date().toISOString().split("T")[0],
    });
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState([]);
    const [loadingPatients, setLoadingPatients] = useState(true);
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await patientApi.getAll();
                setPatients(res.data.data || []);
            }
            catch (err) {
                console.error("Failed to load patients:", err);
            }
            finally {
                setLoadingPatients(false);
            }
        };
        fetchPatients();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await recordApi.create(form);
            onClose();
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "label", children: "Select Patient" }), _jsxs("select", { className: "input", value: form.patientId, onChange: (e) => setForm({ ...form, patientId: e.target.value }), required: true, disabled: loadingPatients, children: [_jsx("option", { value: "", children: "Choose a patient..." }), patients.map((p) => (_jsxs("option", { value: p.id || p._id, children: [p.name, " - ", p.email] }, p.id || p._id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Date" }), _jsx("input", { type: "date", className: "input", value: form.date, onChange: (e) => setForm({ ...form, date: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Diagnosis" }), _jsx("input", { className: "input", value: form.diagnosis, onChange: (e) => setForm({ ...form, diagnosis: e.target.value }), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Treatment" }), _jsx("textarea", { className: "input", rows: 3, value: form.treatment, onChange: (e) => setForm({ ...form, treatment: e.target.value }), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Prescription" }), _jsx("textarea", { className: "input", rows: 2, value: form.prescription, onChange: (e) => setForm({ ...form, prescription: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Notes" }), _jsx("textarea", { className: "input", rows: 2, value: form.notes, onChange: (e) => setForm({ ...form, notes: e.target.value }) })] }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx("button", { type: "submit", className: "btn-primary flex-1", disabled: loading || !form.patientId, children: loading ? "Saving..." : "Save Record" }), _jsx("button", { type: "button", className: "btn-secondary flex-1", onClick: onClose, children: "Cancel" })] })] }));
}
