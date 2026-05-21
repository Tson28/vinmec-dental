import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import PatientSidebar from "../../components/layout/PatientSidebar";
import Table from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import AppointmentCalendar from "../../components/ui/AppointmentCalendar";
import { appointmentApi, serviceApi, doctorApi } from "../../services/api";
import { useApi } from "../../hooks/useApi";
const statusColor = {
    pending: "badge-amber",
    confirmed: "badge-blue",
    completed: "badge-green",
    cancelled: "badge-red",
};
export default function PatientAppointment() {
    const { data: appointments, loading, refetch, } = useApi(() => appointmentApi.getMine());
    const { data: services } = useApi(() => serviceApi.getAll());
    const { data: doctors } = useApi(() => doctorApi.getAll());
    const [showModal, setShowModal] = useState(false);
    const [viewType, setViewType] = useState("calendar");
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const columns = [
        {
            key: "service",
            header: "Service",
            render: (a) => (_jsx("span", { className: "font-medium", children: typeof a.service === "string" ? a.service : a.service.name })),
        },
        {
            key: "doctorName",
            header: "Doctor",
            render: (a) => `Dr. ${a.doctorName}`,
        },
        { key: "date", header: "Date" },
        { key: "time", header: "Time" },
        {
            key: "status",
            header: "Status",
            render: (a) => (_jsx("span", { className: `badge ${statusColor[a.status]}`, children: a.status })),
        },
        {
            key: "actions",
            header: "",
            render: (a) => a.status === "pending" ? (_jsx("button", { onClick: async () => {
                    await appointmentApi.cancel(a.id);
                    refetch();
                }, className: "text-xs text-red-500 font-medium hover:text-red-700", children: "Cancel" })) : null,
        },
    ];
    return (_jsxs("div", { className: "flex", children: [_jsx(PatientSidebar, {}), _jsxs("div", { className: "flex-1 ml-64", children: [_jsxs("div", { className: "sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "L\u1ECBch h\u1EB9n" }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: [(appointments || []).length, " l\u1ECBch h\u1EB9n"] })] }), _jsx("button", { onClick: () => setShowModal(true), className: "px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition", children: "+ \u0110\u1EB7t l\u1ECBch" })] }), _jsxs("div", { className: "space-y-4 p-8", children: [_jsx("div", { className: "flex gap-2 items-center mb-4", children: _jsxs("div", { className: "flex gap-2 bg-gray-100 p-1 rounded-lg", children: [_jsx("button", { onClick: () => setViewType("calendar"), className: `px-3 py-1.5 rounded text-sm font-medium transition ${viewType === "calendar"
                                                ? "bg-white text-green-600 shadow-sm"
                                                : "text-gray-600 hover:text-gray-900"}`, children: "L\u1ECBch" }), _jsx("button", { onClick: () => setViewType("table"), className: `px-3 py-1.5 rounded text-sm font-medium transition ${viewType === "table"
                                                ? "bg-white text-green-600 shadow-sm"
                                                : "text-gray-600 hover:text-gray-900"}`, children: "Danh s\u00E1ch" })] }) }), viewType === "calendar" ? (_jsx(AppointmentCalendar, { appointments: appointments || [], onSelectAppointment: (apt) => {
                                    setSelectedAppointment(apt);
                                }, loading: loading })) : (_jsx("div", { className: "bg-white rounded-lg shadow", children: _jsx(Table, { columns: columns, data: appointments || [], loading: loading }) }))] }), selectedAppointment && (_jsx(Modal, { open: !!selectedAppointment, onClose: () => setSelectedAppointment(null), title: "Chi ti\u1EBFt l\u1ECBch kh\u00E1m", children: _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "space-y-3", children: [
                                        ["Bác sĩ", selectedAppointment.doctorName],
                                        [
                                            "Dịch vụ",
                                            typeof selectedAppointment.service === "string"
                                                ? selectedAppointment.service
                                                : selectedAppointment.service?.name || "Khám tổng quát",
                                        ],
                                        ["Ngày", selectedAppointment.date],
                                        ["Giờ", selectedAppointment.time],
                                        [
                                            "Trạng thái",
                                            _jsx("span", { className: `badge ${statusColor[selectedAppointment.status]}`, children: selectedAppointment.status }),
                                        ],
                                        ["Ghi chú", selectedAppointment.notes || "—"],
                                    ].map(([k, v]) => (_jsxs("div", { className: "flex gap-3", children: [_jsx("span", { className: "label w-24 flex-shrink-0", children: k }), _jsx("span", { className: "text-sm text-gray-800", children: v })] }, k))) }), _jsxs("div", { className: "flex gap-2 pt-4", children: [selectedAppointment.status === "pending" && (_jsx("button", { onClick: async () => {
                                                await appointmentApi.cancel(selectedAppointment.id);
                                                refetch();
                                                setSelectedAppointment(null);
                                            }, className: "px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex-1", children: "H\u1EE7y l\u1ECBch" })), _jsx("button", { onClick: () => setSelectedAppointment(null), className: "px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition flex-1", children: "\u0110\u00F3ng" })] })] }) })), _jsx(Modal, { open: showModal, onClose: () => setShowModal(false), title: "\u0110\u1EB7t l\u1ECBch kh\u00E1m", children: _jsx(BookingForm, { services: services || [], doctors: doctors || [], onClose: () => {
                                setShowModal(false);
                                refetch();
                            } }) })] })] }));
}
function BookingForm({ services, doctors, onClose, }) {
    const [form, setForm] = useState({
        serviceId: "",
        doctorId: "",
        date: "",
        time: "09:00",
        notes: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [conflict, setConflict] = useState("");
    const { data: appointments } = useApi(() => appointmentApi.getAll());
    const times = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
    ];
    const checkDoctorConflict = (doctorId, date, time) => {
        if (!doctorId || !date || !time) {
            setConflict("");
            return;
        }
        const hasConflict = (appointments || []).some((apt) => apt.doctorId === doctorId &&
            apt.date === date &&
            apt.time === time &&
            (apt.status === "confirmed" || apt.status === "pending"));
        if (hasConflict) {
            setConflict(`Bác sĩ này đã có lịch khám vào lúc ${time} ngày ${date}. Vui lòng chọn thời gian khác.`);
        }
        else {
            setConflict("");
        }
    };
    const handleDoctorChange = (doctorId) => {
        setForm({ ...form, doctorId });
        checkDoctorConflict(doctorId, form.date, form.time);
    };
    const handleDateChange = (date) => {
        setForm({ ...form, date });
        checkDoctorConflict(form.doctorId, date, form.time);
    };
    const handleTimeChange = (time) => {
        setForm({ ...form, time });
        checkDoctorConflict(form.doctorId, form.date, time);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (conflict) {
            setError("Không thể đặt lịch do bác sĩ đã có lịch trùng");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await appointmentApi.create(form);
            onClose();
        }
        catch (err) {
            setError(err.response?.data?.message || "Booking failed");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [error && (_jsx("div", { className: "px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600", children: error })), conflict && (_jsxs("div", { className: "px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 flex items-start gap-2", children: [_jsx("span", { className: "text-lg", children: "\u26A0\uFE0F" }), _jsx("span", { children: conflict })] })), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Service" }), _jsxs("select", { className: "input", value: form.serviceId, onChange: (e) => setForm({ ...form, serviceId: e.target.value }), required: true, children: [_jsx("option", { value: "", children: "Select service..." }), services.map((s) => (_jsxs("option", { value: s._id, children: [s.name, " \u2013 ", Number(s.price).toLocaleString("vi-VN"), " \u20AB"] }, s._id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Doctor" }), _jsxs("select", { className: "input", value: form.doctorId, onChange: (e) => handleDoctorChange(e.target.value), required: true, children: [_jsx("option", { value: "", children: "Select doctor..." }), doctors.map((d) => (_jsxs("option", { value: d._id, children: ["Dr. ", d.name, " \u2013 ", d.specialization || "General"] }, d._id)))] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "label", children: "Date" }), _jsx("input", { type: "date", className: "input", value: form.date, min: new Date().toISOString().split("T")[0], onChange: (e) => handleDateChange(e.target.value), required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Time" }), _jsx("select", { className: "input", value: form.time, onChange: (e) => handleTimeChange(e.target.value), children: times.map((t) => (_jsx("option", { value: t, children: t }, t))) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "label", children: "Notes (optional)" }), _jsx("textarea", { className: "input", rows: 2, value: form.notes, onChange: (e) => setForm({ ...form, notes: e.target.value }), placeholder: "Describe your symptoms..." })] }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx("button", { type: "submit", className: "btn-primary flex-1", disabled: loading || !!conflict, children: loading ? "Booking..." : "Book Appointment" }), _jsx("button", { type: "button", className: "btn-secondary flex-1", onClick: onClose, children: "Cancel" })] })] }));
}
