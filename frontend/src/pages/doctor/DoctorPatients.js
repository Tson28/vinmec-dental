import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import DoctorSidebar from "../../components/layout/DoctorSidebar";
import DentalScoreModal from "../../components/DentalScoreModal";
import Table from "../../components/ui/Table";
import { patientApi } from "../../services/api";
import { useApi } from "../../hooks/useApi";
export default function DoctorPatients() {
    const { data: patients, loading } = useApi(() => patientApi.getAll());
    const [search, setSearch] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showScoreModal, setShowScoreModal] = useState(false);
    const filtered = (patients || []).filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.email?.toLowerCase().includes(search.toLowerCase()));
    const columns = [
        {
            key: "name",
            header: "Patient",
            render: (p) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-br from-mint-400 to-dental-500 flex items-center justify-center text-white text-xs font-bold", children: p.name?.charAt(0) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: p.name }), _jsx("p", { className: "text-xs text-surface-400", children: p.email })] })] })),
        },
        { key: "phone", header: "Phone", render: (p) => p.phone || "—" },
        { key: "dob", header: "Date of Birth", render: (p) => p.dob || "—" },
        {
            key: "status",
            header: "Status",
            render: () => _jsx("span", { className: "badge badge-green", children: "Active" }),
        },
        {
            key: "actions",
            header: "Hành động",
            render: (p) => (_jsx("button", { onClick: () => {
                    setSelectedPatient(p);
                    setShowScoreModal(true);
                }, className: "px-4 py-2 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center gap-1.5 justify-center cursor-pointer", children: "\uD83E\uDDB7 Xem ch\u1EC9 s\u1ED1 r\u0103ng" })),
        },
    ];
    return (_jsxs("div", { className: "flex", children: [_jsx(DoctorSidebar, {}), _jsxs("div", { className: "flex-1 ml-64", children: [_jsx("div", { className: "sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm", children: _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "B\u1EC7nh nh\u00E2n" }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: [filtered.length, " b\u1EC7nh nh\u00E2n"] })] }) }), _jsx("div", { className: "space-y-4 p-8", children: _jsxs("div", { className: "bg-white rounded-lg shadow p-4", children: [_jsx("div", { className: "mb-4", children: _jsx("input", { className: "w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500", placeholder: "T\u00ECm ki\u1EBFm b\u1EC7nh nh\u00E2n...", value: search, onChange: (e) => setSearch(e.target.value) }) }), _jsx(Table, { columns: columns, data: filtered, loading: loading, keyField: "_id" })] }) })] }), selectedPatient && (_jsx(DentalScoreModal, { patient: selectedPatient, isOpen: showScoreModal, onClose: () => {
                    setShowScoreModal(false);
                    setSelectedPatient(null);
                } }))] }));
}
