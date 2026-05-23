import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { paymentApi, patientApi } from "../../services/api";
import { useApi } from "../../hooks/useApi";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
const methodLabels = {
    cash: "Tiền mặt",
    bank_transfer: "Chuyển khoản",
    momo: "MoMo",
    vnpay: "VNPay",
    zalo_pay: "ZaloPay",
    insurance: "Bảo hiểm",
    other: "Khác",
};
const methodColors = {
    cash: "#10b981",
    bank_transfer: "#0ea5e9",
    momo: "#ec4899",
    vnpay: "#6366f1",
    zalo_pay: "#06b6d4",
    insurance: "#f59e0b",
    other: "#8b5cf6",
};
const statusConfig = {
    pending: { label: "Chờ thanh toán", bg: "bg-amber-50", text: "text-amber-700" },
    paid: { label: "Đã thanh toán", bg: "bg-emerald-50", text: "text-emerald-700" },
    failed: { label: "Thất bại", bg: "bg-red-50", text: "text-red-700" },
    refunded: { label: "Đã hoàn tiền", bg: "bg-blue-50", text: "text-blue-700" },
    cancelled: { label: "Đã hủy", bg: "bg-slate-100", text: "text-slate-600" },
};
const formatMoney = (n) => n >= 1000000
    ? (n / 1000000).toFixed(1) + "M"
    : n >= 1000
        ? (n / 1000).toFixed(0) + "K"
        : String(n);
export default function AdminPayments() {
    const { data: payments, loading, refetch } = useApi(() => paymentApi.getAll());
    const [stats, setStats] = useState(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    useEffect(() => {
        paymentApi.getStats().then((res) => setStats(res.data?.data)).catch(() => { });
    }, []);
    const refreshAll = () => {
        refetch();
        paymentApi.getStats().then((res) => setStats(res.data?.data)).catch(() => { });
    };
    const filtered = (payments || []).filter((p) => {
        const matchSearch = !search ||
            p.patientName?.toLowerCase().includes(search.toLowerCase()) ||
            p.invoiceNumber?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "all" || p.status === filterStatus;
        return matchSearch && matchStatus;
    });
    const totalAmount = filtered.reduce((s, p) => s + (p.status === "paid" ? p.amount : 0), 0);
    // Build chart from locally loaded payments (always works, no backend dependency)
    const chartData = (() => {
        const months = {};
        const now = new Date();
        // Init last 12 months
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months[`${d.getFullYear()}-${d.getMonth() + 1}`] = 0;
        }
        (payments || []).forEach((p) => {
            if (p.status !== "paid")
                return;
            const d = new Date(p.paidAt || p.createdAt);
            if (isNaN(d.getTime()))
                return;
            const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
            if (key in months)
                months[key] += p.amount;
        });
        const labels = Object.keys(months).map((k) => {
            const [y, m] = k.split("-");
            return `T${m}`;
        });
        const data = Object.values(months);
        const hasData = data.some((v) => v > 0);
        if (!hasData)
            return null;
        return {
            labels,
            datasets: [{
                    label: "Doanh thu (VNĐ)",
                    data,
                    fill: true,
                    backgroundColor: "rgba(14,165,233,0.08)",
                    borderColor: "#0ea5e9",
                    tension: 0.4,
                    borderWidth: 2,
                    pointBackgroundColor: "#0ea5e9",
                    pointRadius: 4,
                }],
        };
    })();
    return (_jsxs("div", { className: "flex min-h-screen", style: { background: "linear-gradient(145deg, #f0fdf4 0%, #ecfdf5 40%, #f0f9ff 100%)" }, children: [_jsx(AdminSidebar, {}), _jsxs("div", { className: "flex-1 lg:ml-0 min-w-0", children: [_jsx("div", { className: "glass-header sticky top-0 z-10 px-6 lg:px-8 py-4 flex items-center justify-between flex-wrap gap-3", children: _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-slate-800", children: "Qu\u1EA3n l\u00FD thanh to\u00E1n" }), _jsxs("p", { className: "text-xs text-slate-400 mt-0.5", children: [(payments || []).length, " phi\u1EBFu thanh to\u00E1n"] })] }) }), _jsxs("div", { className: "p-6 lg:p-8 space-y-5", children: [stats && (_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [
                                    { label: "Tổng doanh thu", value: formatMoney(stats.totalRevenue) + " đ", color: "#0ea5e9" },
                                    { label: "Doanh thu tháng", value: formatMoney(stats.monthRevenue) + " đ", color: "#10b981" },
                                    { label: "Chờ thanh toán", value: stats.pendingPayments, color: "#f59e0b" },
                                    { label: "Tổng phiếu", value: stats.totalPayments, color: "#8b5cf6" },
                                ].map((s) => (_jsxs("div", { className: "card p-4 text-center border border-slate-100 animate-scale-in", children: [_jsx("p", { className: "text-2xl font-black", style: { color: s.color }, children: s.value }), _jsx("p", { className: "text-xs font-semibold text-slate-400 mt-1", children: s.label })] }, s.label))) })), chartData && (_jsxs("div", { className: "card p-5 border border-slate-100 animate-fade-in", children: [_jsx("h3", { className: "text-base font-bold text-slate-800 mb-1", children: "Xu h\u01B0\u1EDBng doanh thu" }), _jsx("p", { className: "text-xs text-slate-400 mb-4", children: "12 th\u00E1ng g\u1EA7n nh\u1EA5t" }), _jsx("div", { style: { height: "200px" }, children: _jsx(Line, { data: chartData, options: {
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: { legend: { display: false } },
                                                scales: { y: { beginAtZero: true, grid: { color: "#f1f5f9" } }, x: { grid: { display: false } } },
                                            } }) })] })), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 items-start sm:items-center", children: [_jsxs("div", { className: "card card-hover p-3 flex-1 border border-slate-100 flex items-center gap-3", children: [_jsx("svg", { className: "w-5 h-5 text-slate-400", fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }), _jsx("input", { className: "flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none", placeholder: "T\u00ECm theo t\u00EAn, email, ho\u1EB7c m\u00E3 h\u00F3a \u0111\u01A1n...", value: search, onChange: (e) => setSearch(e.target.value) }), search && (_jsx("button", { onClick: () => setSearch(""), className: "w-6 h-6 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 flex items-center justify-center", children: _jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", d: "M6 18L18 6M6 6l12 12" }) }) }))] }), _jsx("div", { className: "flex items-center gap-2 flex-wrap", children: ["all", "paid", "pending", "failed", "refunded", "cancelled"].map((s) => (_jsx("button", { onClick: () => setFilterStatus(s), className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterStatus === s
                                                ? "text-white shadow-sm"
                                                : "text-slate-500 hover:bg-slate-100"}`, style: filterStatus === s ? { background: "linear-gradient(135deg, #0ea5e9, #0369a1)" } : {}, children: s === "all" ? "Tất cả" : statusConfig[s]?.label || s }, s))) })] }), !loading && filtered.length === 0 && (_jsxs("div", { className: "card text-center py-16 animate-fade-in", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4", style: { background: "linear-gradient(135deg, #0ea5e915, #0369a115)" }, children: _jsx("svg", { className: "w-8 h-8 text-sky-500", fill: "none", stroke: "currentColor", strokeWidth: 1.5, viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" }) }) }), _jsx("p", { className: "font-black text-slate-700 text-lg mb-2", children: "Ch\u01B0a c\u00F3 phi\u1EBFu thanh to\u00E1n" }), _jsx("p", { className: "text-sm text-slate-400", children: "T\u1EA1o phi\u1EBFu thu \u0111\u1EA7u ti\u00EAn cho ph\u00F2ng kh\u00E1m" })] })), !loading && filtered.length > 0 && (_jsx("div", { className: "card overflow-hidden border border-slate-100 animate-fade-in", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsx("tr", { className: "bg-slate-50 border-b border-slate-100", children: ["Mã hóa đơn", "Bệnh nhân", "Số tiền", "Phương thức", "Trạng thái", "Lí do", "Ngày tạo", "Thao tác"].map((h) => (_jsx("th", { className: "px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider", children: h }, h))) }) }), _jsx("tbody", { children: filtered.map((p, i) => {
                                                    const cfg = statusConfig[p.status] || statusConfig.pending;
                                                    return (_jsxs("tr", { className: "border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer", onClick: () => { setSelectedPayment(p); setShowDetailModal(true); }, children: [_jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: "font-mono text-xs font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded-lg", children: p.invoiceNumber }) }), _jsxs("td", { className: "px-4 py-3", children: [_jsx("p", { className: "font-semibold text-slate-800", children: p.patientName }), _jsx("p", { className: "text-xs text-slate-400", children: p.patient?.email })] }), _jsxs("td", { className: "px-4 py-3 font-bold text-slate-800", children: [p.amount.toLocaleString("vi-VN"), " \u0111"] }), _jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", style: { background: `${methodColors[p.method]}15`, color: methodColors[p.method] }, children: methodLabels[p.method] || p.method }) }), _jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`, children: cfg.label }) }), _jsx("td", { className: "px-4 py-3 text-xs text-slate-500 max-w-[140px] truncate", title: p.reason || "—", children: p.reason || "—" }), _jsx("td", { className: "px-4 py-3 text-slate-500 text-xs", children: new Date(p.createdAt).toLocaleDateString("vi-VN") }), _jsx("td", { className: "px-4 py-3", children: _jsx("button", { onClick: (e) => { e.stopPropagation(); setSelectedPayment(p); setShowDetailModal(true); }, className: "px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-medium text-xs transition border border-sky-200", children: "Chi ti\u1EBFt" }) })] }, p._id || i));
                                                }) }), filtered.length > 0 && (_jsx("tfoot", { children: _jsxs("tr", { className: "bg-slate-50 border-t-2 border-slate-200", children: [_jsx("td", { colSpan: 2, className: "px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider", children: "T\u1ED5ng c\u1ED9ng" }), _jsxs("td", { className: "px-4 py-3 font-black text-sky-700", children: [totalAmount.toLocaleString("vi-VN"), " \u0111"] }), _jsx("td", { colSpan: 5 })] }) }))] }) }) })), loading && (_jsx("div", { className: "space-y-3", children: [...Array(4)].map((_, i) => (_jsx("div", { className: "h-14 rounded-xl skeleton" }, i))) }))] })] }), _jsx(CreatePaymentModal, { open: showCreateModal, onClose: () => setShowCreateModal(false), onCreated: () => { setShowCreateModal(false); refreshAll(); } }), selectedPayment && (_jsx(PaymentDetailModal, { payment: selectedPayment, open: showDetailModal, onClose: () => { setShowDetailModal(false); setSelectedPayment(null); }, onUpdated: () => { refreshAll(); } })), _jsx(QRPaymentModal, { open: showQRModal, onClose: () => setShowQRModal(false), onSuccess: () => { setShowQRModal(false); refreshAll(); } })] }));
}
function CreatePaymentModal({ open, onClose, onCreated }) {
    const [form, setForm] = useState({
        userId: "", patientId: "", appointmentId: "", amount: "",
        method: "cash", description: "", reason: "", discount: "0", tax: "0",
        notes: "", serviceName: "", servicePrice: "",
    });
    const [services, setServices] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState("patient");
    useEffect(() => {
        if (open) {
            patientApi.getAll().then((res) => setPatients(Array.isArray(res.data) ? res.data : []));
        }
    }, [open]);
    const loadAppointments = async (patientId) => {
        setAppointments([]);
        const { appointmentApi: aptApi } = await import("../../services/api");
        try {
            const patient = patients.find((p) => p._id === patientId);
            if (!patient)
                return;
            const patientName = patient.name.trim().toLowerCase();
            const res = await aptApi.getAll();
            const paginated = res.data?.data ?? res.data;
            const all = Array.isArray(paginated?.data)
                ? paginated.data
                : Array.isArray(paginated)
                    ? paginated
                    : [];
            setAppointments(all.filter((a) => a.patientName?.trim().toLowerCase() === patientName));
        }
        catch { }
    };
    const addService = () => {
        if (!form.serviceName.trim())
            return;
        setServices([...services, { name: form.serviceName.trim(), price: Number(form.servicePrice) || 0 }]);
        setForm({ ...form, serviceName: "", servicePrice: "" });
    };
    const removeService = (i) => setServices(services.filter((_, idx) => idx !== i));
    const total = services.reduce((s, sv) => s + sv.price, 0) - Number(form.discount || 0) + Number(form.tax || 0);
    const handleSubmit = async () => {
        if (!form.userId || !form.amount)
            return;
        setLoading(true);
        try {
            await paymentApi.create({
                patientId: form.userId,
                appointmentId: form.appointmentId || null,
                amount: Number(form.amount),
                method: form.method,
                description: form.description,
                reason: form.reason,
                services,
                discount: Number(form.discount || 0),
                tax: Number(form.tax || 0),
                notes: form.notes,
            });
            onCreated();
        }
        catch (err) {
            alert(err.response?.data?.message || "Tạo phiếu thu thất bại");
        }
        finally {
            setLoading(false);
        }
    };
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "sticky top-0 bg-gradient-to-r from-sky-50 to-blue-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-slate-900", children: "T\u1EA1o phi\u1EBFu thu m\u1EDBi" }), _jsxs("p", { className: "text-sm text-slate-500 mt-1", children: ["B\u01B0\u1EDBc ", step === "patient" ? "1" : step === "services" ? "2" : "3", " / 3"] })] }), _jsx("button", { onClick: onClose, className: "text-slate-400 hover:text-slate-600 text-2xl", children: "\u2715" })] }), _jsxs("div", { className: "p-6 space-y-5", children: [step === "patient" && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Ch\u1ECDn b\u1EC7nh nh\u00E2n *" }), _jsxs("select", { className: "w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 transition", value: form.userId, onChange: (e) => { setForm({ ...form, userId: e.target.value }); loadAppointments(e.target.value); }, required: true, style: { background: "#fafafa" }, children: [_jsx("option", { value: "", children: "\u2014 Ch\u1ECDn b\u1EC7nh nh\u00E2n \u2014" }), patients.map((p) => (_jsxs("option", { value: p._id, children: [p.name, " (", p.email, ")"] }, p._id)))] })] }), appointments.length > 0 && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Li\u00EAn k\u1EBFt l\u1ECBch h\u1EB9n (t\u00F9y ch\u1ECDn)" }), _jsxs("select", { className: "w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 transition", value: form.appointmentId, onChange: (e) => setForm({ ...form, appointmentId: e.target.value }), style: { background: "#fafafa" }, children: [_jsx("option", { value: "", children: "\u2014 Kh\u00F4ng li\u00EAn k\u1EBFt \u2014" }), appointments.map((a) => (_jsxs("option", { value: a._id, children: [a.serviceName, " \u2014 ", a.date, " ", a.time, " \u2014 ", a.fee?.toLocaleString("vi-VN"), " \u0111"] }, a._id)))] })] })), _jsx("button", { onClick: () => setStep("services"), disabled: !form.userId, className: "w-full btn-primary disabled:opacity-50", children: "Ti\u1EBFp t\u1EE5c \u2192" })] })), step === "services" && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-slate-50 rounded-xl p-4", children: [_jsxs("p", { className: "text-sm font-bold text-slate-700 mb-3", children: ["D\u1ECBch v\u1EE5 \u0111\u00E3 th\u00EAm (", services.length, ")"] }), services.length === 0 ? (_jsx("p", { className: "text-xs text-slate-400 text-center py-4", children: "Ch\u01B0a c\u00F3 d\u1ECBch v\u1EE5 n\u00E0o" })) : (_jsx("div", { className: "space-y-2 mb-3", children: services.map((s, i) => (_jsxs("div", { className: "flex items-center justify-between bg-white rounded-lg p-2 border border-slate-100", children: [_jsx("span", { className: "text-sm text-slate-700", children: s.name }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-sm font-semibold text-sky-600", children: [s.price.toLocaleString("vi-VN"), " \u0111"] }), _jsx("button", { onClick: () => removeService(i), className: "w-5 h-5 rounded bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center text-xs", children: "\u00D7" })] })] }, i))) }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "T\u00EAn d\u1ECBch v\u1EE5" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { className: "flex-1 px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500", placeholder: "V\u00ED d\u1EE5: Nh\u1ED5 r\u0103ng kh\u00F4n", value: form.serviceName, onChange: (e) => setForm({ ...form, serviceName: e.target.value }), style: { background: "#fafafa" } }), _jsx("input", { type: "number", className: "w-28 px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500", placeholder: "Gi\u00E1 (\u0111)", value: form.servicePrice, onChange: (e) => setForm({ ...form, servicePrice: e.target.value }), style: { background: "#fafafa" } }), _jsx("button", { onClick: addService, className: "px-3 py-2 bg-sky-100 text-sky-700 rounded-xl font-semibold text-sm hover:bg-sky-200 transition", children: "+" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Gi\u1EA3m gi\u00E1 (\u0111)" }), _jsx("input", { type: "number", className: "w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500", placeholder: "0", value: form.discount, onChange: (e) => setForm({ ...form, discount: e.target.value }), style: { background: "#fafafa" } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Thu\u1EBF (\u0111)" }), _jsx("input", { type: "number", className: "w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500", placeholder: "0", value: form.tax, onChange: (e) => setForm({ ...form, tax: e.target.value }), style: { background: "#fafafa" } })] })] }), _jsxs("div", { className: "bg-sky-50 rounded-xl p-4 text-center", children: [_jsx("p", { className: "text-xs text-sky-600 font-semibold uppercase tracking-wider", children: "T\u1ED5ng c\u1ED9ng" }), _jsxs("p", { className: "text-2xl font-black text-sky-700 mt-1", children: [total.toLocaleString("vi-VN"), " \u0111"] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setStep("patient"), className: "flex-1 btn-secondary", children: "\u2190 Quay l\u1EA1i" }), _jsx("button", { onClick: () => setStep("payment"), className: "flex-1 btn-primary", children: "Ti\u1EBFp t\u1EE5c \u2192" })] })] })), step === "payment" && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200", children: [_jsx("p", { className: "text-xs text-emerald-600 font-semibold uppercase tracking-wider", children: "S\u1ED1 ti\u1EC1n thanh to\u00E1n" }), _jsxs("p", { className: "text-3xl font-black text-emerald-700 mt-1", children: [total.toLocaleString("vi-VN"), " \u0111"] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Ph\u01B0\u01A1ng th\u1EE9c thanh to\u00E1n" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: Object.entries(methodLabels).map(([key, label]) => (_jsx("button", { onClick: () => setForm({ ...form, method: key }), className: `px-3 py-2.5 rounded-xl text-sm font-semibold border-2 transition ${form.method === key
                                                    ? "border-sky-400 bg-sky-50 text-sky-700"
                                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`, children: label }, key))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "M\u00F4 t\u1EA3" }), _jsx("textarea", { className: "w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 resize-none h-20", placeholder: "M\u00F4 t\u1EA3 phi\u1EBFu thu...", value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }), style: { background: "#fafafa" } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "L\u00ED do thanh to\u00E1n" }), _jsx("input", { className: "w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500", placeholder: "VD: Thanh to\u00E1n kh\u00E1m r\u0103ng, Tr\u1ED3ng implant...", value: form.reason, onChange: (e) => setForm({ ...form, reason: e.target.value }), style: { background: "#fafafa" } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Ghi ch\u00FA" }), _jsx("textarea", { className: "w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500 resize-none h-16", placeholder: "Ghi ch\u00FA th\u00EAm (t\u00F9y ch\u1ECDn)...", value: form.notes, onChange: (e) => setForm({ ...form, notes: e.target.value }), style: { background: "#fafafa" } })] }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx("button", { onClick: () => setStep("services"), className: "flex-1 btn-secondary", children: "\u2190 Quay l\u1EA1i" }), _jsx("button", { onClick: handleSubmit, disabled: loading, className: "flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50", children: loading ? "Đang xử lý..." : `Xác nhận thanh toán ${total.toLocaleString("vi-VN")} đ` })] })] }))] })] }) }));
}
function PaymentDetailModal({ payment, open, onClose, onUpdated }) {
    const [status, setStatus] = useState(payment.status);
    const [cashReceived, setCashReceived] = useState("");
    const [qrData, setQrData] = useState(null);
    const [qrLoading, setQrLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const change = cashReceived && !isNaN(Number(cashReceived))
        ? Math.max(0, Number(cashReceived) - payment.amount)
        : null;
    useEffect(() => {
        setStatus(payment.status);
        setCashReceived("");
        setQrData(null);
        setQrLoading(false);
    }, [payment]);
    // Generate QR for bank_transfer pending payments
    useEffect(() => {
        if (open && payment.method === "bank_transfer" && payment.status === "pending" && !qrData && !qrLoading) {
            setQrLoading(true);
            paymentApi.generateQR({ amount: payment.amount, invoiceNumber: payment.invoiceNumber })
                .then((res) => { if (res.data?.success)
                setQrData(res.data.data); })
                .catch(() => { })
                .finally(() => setQrLoading(false));
        }
    }, [open]);
    const handleConfirmPayment = async () => {
        setLoading(true);
        try {
            await paymentApi.update(payment._id, { status: "paid" });
            alert("Xac nhan thanh toan thanh cong!");
            onUpdated();
            onClose();
        }
        catch (err) {
            alert(err.response?.data?.message || "Cap nhat that bai.");
        }
        finally {
            setLoading(false);
        }
    };
    const handleCashPayment = async () => {
        const received = Number(cashReceived);
        if (!cashReceived || isNaN(received) || received < payment.amount) {
            alert("So tien nhan phai lon hon hoac bang so tien can thanh toan!");
            return;
        }
        setLoading(true);
        try {
            await paymentApi.update(payment._id, {
                status: "paid",
                notes: (payment.notes || "") + `\n[Tien mat] Nhan: ${received.toLocaleString("vi-VN")} VND | Tra lai: ${change?.toLocaleString("vi-VN")} VND`,
            });
            alert(`Thanh toan thanh cong!\nTien nhan: ${received.toLocaleString("vi-VN")} VND\nTien thua tra lai: ${change?.toLocaleString("vi-VN")} VND`);
            onUpdated();
            onClose();
        }
        catch (err) {
            alert(err.response?.data?.message || "Thanh toan that bai.");
        }
        finally {
            setLoading(false);
        }
    };
    const handleUpdateStatus = async () => {
        setLoading(true);
        try {
            await paymentApi.update(payment._id, { status });
            onUpdated();
            onClose();
        }
        catch (err) {
            alert(err.response?.data?.message || "Cap nhat that bai.");
        }
        finally {
            setLoading(false);
        }
    };
    const handlePrintQR = () => {
        if (!qrData?.qrDataUrl)
            return;
        const win = window.open("", "_blank");
        if (!win)
            return;
        win.document.write(`<html><head><title>In QR Thanh Toan</title><style>body{font-family:Arial;text-align:center;padding:40px;}h2{color:#003A70;}p{font-size:14px;color:#555;}img{border:4px solid #003A70;border-radius:12px;}.info{margin-top:16px;font-weight:bold;color:#059669;}</style></head><body><h2>Phong Kham Nha Khoa VinaMec</h2><p>Ma hoa don: ${payment.invoiceNumber}</p><p>Benh nhan: ${payment.patientName}</p><img src="${qrData.qrDataUrl}" width="300"/><p class="info">So tien: ${Number(qrData.amount).toLocaleString("vi-VN")} VND</p><p>STK: 280605666888 - Nguyen Thai Son</p><p>Noi dung: ${qrData.addInfo}</p><script>window.print();<\/script></body></html>`);
        win.document.close();
    };
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-2xl max-w-lg w-full", children: [_jsxs("div", { className: "bg-gradient-to-r from-sky-50 to-blue-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-slate-900", children: "Chi ti\u1EBFt phi\u1EBFu thu" }), _jsx("p", { className: "text-sm text-slate-500 mt-1 font-mono", children: payment.invoiceNumber })] }), _jsx("button", { onClick: onClose, className: "text-slate-400 hover:text-slate-600 text-2xl", children: "\u2715" })] }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-slate-50 rounded-xl p-3", children: [_jsx("p", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-1", children: "B\u1EC7nh nh\u00E2n" }), _jsx("p", { className: "text-sm font-semibold text-slate-800", children: payment.patientName }), _jsx("p", { className: "text-xs text-slate-400", children: payment.patient?.email })] }), _jsxs("div", { className: "bg-slate-50 rounded-xl p-3", children: [_jsx("p", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-1", children: "Ng\u00E0y t\u1EA1o" }), _jsx("p", { className: "text-sm font-semibold text-slate-800", children: new Date(payment.createdAt).toLocaleDateString("vi-VN") }), _jsxs("p", { className: "text-xs text-slate-400", children: ["b\u1EDFi ", payment.recordedByName] })] })] }), payment.appointment && (_jsxs("div", { className: "bg-sky-50 rounded-xl p-3 border border-sky-100", children: [_jsx("p", { className: "text-xs font-bold text-sky-600 uppercase tracking-wider mb-1", children: "L\u1ECBch h\u1EB9n li\u00EAn k\u1EBFt" }), _jsx("p", { className: "text-sm font-semibold text-slate-800", children: payment.appointment.serviceName }), _jsxs("p", { className: "text-xs text-slate-500", children: [payment.appointment.date, " ", payment.appointment.time] })] })), payment.services?.length > 0 && (_jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-2", children: "D\u1ECBch v\u1EE5" }), _jsx("div", { className: "space-y-1", children: payment.services.map((s, i) => (_jsxs("div", { className: "flex justify-between bg-slate-50 rounded-lg px-3 py-2", children: [_jsx("span", { className: "text-sm text-slate-700", children: s.name }), _jsxs("span", { className: "text-sm font-semibold text-slate-800", children: [s.price.toLocaleString("vi-VN"), " \u0111"] })] }, i))) }), payment.discount > 0 && (_jsxs("div", { className: "flex justify-between bg-green-50 rounded-lg px-3 py-2 mt-1", children: [_jsx("span", { className: "text-sm text-green-700", children: "Gi\u1EA3m gi\u00E1" }), _jsxs("span", { className: "text-sm font-semibold text-green-700", children: ["-", payment.discount.toLocaleString("vi-VN"), " \u0111"] })] })), payment.tax > 0 && (_jsxs("div", { className: "flex justify-between bg-slate-50 rounded-lg px-3 py-2 mt-1", children: [_jsx("span", { className: "text-sm text-slate-700", children: "Thu\u1EBF" }), _jsxs("span", { className: "text-sm font-semibold text-slate-800", children: ["+", payment.tax.toLocaleString("vi-VN"), " \u0111"] })] }))] })), _jsxs("div", { className: "flex justify-between items-center rounded-xl p-4", style: { background: "linear-gradient(135deg, #003A70 0%, #0055A4 100%)" }, children: [_jsx("span", { className: "font-bold text-white text-sm", children: "Tong cong" }), _jsxs("span", { className: "text-2xl font-black text-white", children: [payment.amount.toLocaleString("vi-VN"), " VND"] })] }), _jsxs("div", { className: "flex items-center justify-between bg-slate-50 rounded-xl p-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-400 font-semibold uppercase", children: "Phuong thuc" }), _jsx("p", { className: "text-sm font-bold text-slate-800", style: { color: methodColors[payment.method] }, children: methodLabels[payment.method] || payment.method })] }), _jsx("span", { className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${statusConfig[payment.status]?.bg} ${statusConfig[payment.status]?.text}`, children: statusConfig[payment.status]?.label })] }), payment.status === "paid" ? (_jsxs("div", { className: "bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2", children: _jsx("svg", { className: "w-6 h-6 text-emerald-600", fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 13l4 4L19 7" }) }) }), _jsx("p", { className: "font-bold text-emerald-800", children: "Da thanh toan!" }), _jsxs("p", { className: "text-xs text-emerald-600 mt-1", children: ["Ngay: ", payment.paidAt ? new Date(payment.paidAt).toLocaleDateString("vi-VN") : "—"] })] })) : payment.status === "cancelled" ? (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-xl p-4 text-center", children: _jsx("p", { className: "font-bold text-red-700", children: "Da huy phieu thu" }) })) : (_jsxs("div", { className: "space-y-4", children: [payment.method === "cash" && (_jsx("div", { className: "space-y-3", children: _jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-xl p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center", children: _jsx("span", { className: "text-white font-black text-sm", children: "C" }) }), _jsx("p", { className: "font-bold text-amber-800 text-sm", children: "Thanh toan tien mat" })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-xs font-semibold text-slate-600 mb-1", children: "So tien nhan (VND)" }), _jsx("input", { type: "number", min: 0, className: "w-full px-4 py-3 border-2 border-amber-300 rounded-xl text-lg font-bold text-slate-800 focus:outline-none focus:border-amber-500 bg-white", placeholder: "0", value: cashReceived, onChange: (e) => setCashReceived(e.target.value) })] }), change !== null && (_jsxs("div", { className: "flex justify-between items-center bg-white border border-amber-300 rounded-xl px-4 py-3", children: [_jsx("span", { className: "text-sm text-slate-600", children: "Tien thua tra lai" }), _jsxs("span", { className: "text-lg font-black text-emerald-600", children: [change.toLocaleString("vi-VN"), " VND"] })] })), _jsx("button", { onClick: handleCashPayment, disabled: loading || !cashReceived || Number(cashReceived) < payment.amount, className: "w-full mt-3 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50", style: { background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 4px 14px rgba(16,185,129,0.4)" }, children: loading ? "Dang xu ly..." : `Xac nhan thanh toan ${payment.amount.toLocaleString("vi-VN")} VND` })] }) })), payment.method === "bank_transfer" && (_jsx("div", { className: "space-y-3", children: _jsxs("div", { className: "bg-white border border-slate-200 rounded-xl p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx("div", { className: "w-8 h-8 rounded-lg flex items-center justify-center", style: { background: "linear-gradient(135deg, #003A70, #0055A4)" }, children: _jsx("span", { className: "text-white font-black text-sm", children: "MB" }) }), _jsx("p", { className: "font-bold text-slate-800 text-sm", children: "Thanh toan QR MBBank" })] }), qrLoading ? (_jsx("div", { className: "text-center py-6 text-slate-500 text-sm", children: "Dang tao ma QR..." })) : qrData ? (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "bg-white rounded-xl p-3 text-center border border-slate-200", children: [_jsx("img", { src: qrData.qrDataUrl, alt: "QR", className: "w-48 h-48 mx-auto rounded-xl" }), _jsx("p", { className: "text-xs text-slate-400 mt-2", children: "Quet ma QR bang ung dung ngan hang" })] }), _jsxs("div", { className: "bg-slate-50 rounded-xl overflow-hidden", children: [_jsx("div", { className: "px-4 py-2.5", style: { background: "linear-gradient(135deg, #003A70 0%, #0055A4 100%)" }, children: _jsx("p", { className: "text-white text-xs font-bold uppercase", children: "Thong tin tai khoan" }) }), [
                                                                { label: "So tai khoan", value: "280605666888" },
                                                                { label: "Ten tai khoan", value: "Nguyen Thai Son" },
                                                                { label: "Noi dung CK", value: qrData.addInfo },
                                                            ].map((item) => (_jsxs("div", { className: "flex justify-between px-4 py-2.5 border-b border-slate-100 last:border-0", children: [_jsx("span", { className: "text-xs text-slate-400", children: item.label }), _jsx("span", { className: "text-xs font-bold text-slate-700", children: item.value })] }, item.label)))] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("button", { onClick: handlePrintQR, className: "py-2.5 rounded-xl font-semibold text-sm border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition", children: "In QR" }), _jsx("button", { onClick: handleConfirmPayment, disabled: loading, className: "py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 disabled:opacity-50", style: { background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 4px 14px rgba(16,185,129,0.4)" }, children: loading ? "Dang xu ly..." : "Da nhan duoc tien" })] })] })) : (_jsx("div", { className: "text-center py-6 text-slate-500 text-sm", children: "Khong the tao ma QR." }))] }) })), (payment.method !== "cash" && payment.method !== "bank_transfer") && (_jsx("div", { className: "space-y-3", children: _jsxs("div", { className: "bg-slate-50 rounded-xl p-4", children: [_jsxs("p", { className: "text-sm text-slate-600 mb-3", children: ["Phuong thuc thanh toan: ", _jsx("strong", { children: methodLabels[payment.method] })] }), _jsx("div", { className: "grid grid-cols-3 gap-2 mb-3", children: ["paid", "pending", "cancelled"].map((s) => (_jsx("button", { onClick: () => setStatus(s), className: `px-3 py-2 rounded-xl text-xs font-bold border-2 transition ${status === s
                                                        ? `border-sky-400 ${statusConfig[s]?.bg} ${statusConfig[s]?.text}`
                                                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`, children: statusConfig[s]?.label }, s))) }), _jsx("button", { onClick: handleUpdateStatus, disabled: loading || status === payment.status, className: "w-full py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-50", style: { background: "linear-gradient(135deg, #0ea5e9, #0369a1)" }, children: loading ? "Dang xu ly..." : "Cap nhat trang thai" })] }) }))] })), payment.description && (_jsxs("div", { className: "bg-slate-50 rounded-xl p-3", children: [_jsx("p", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-1", children: "Mo ta" }), _jsx("p", { className: "text-sm text-slate-600", children: payment.description })] })), payment.reason && (_jsxs("div", { className: "bg-amber-50 rounded-xl p-3 border border-amber-200", children: [_jsx("p", { className: "text-xs font-bold text-amber-600 uppercase tracking-wider mb-1", children: "L\u00ED do thanh to\u00E1n" }), _jsx("p", { className: "text-sm text-amber-800 font-medium", children: payment.reason })] })), _jsx("button", { onClick: onClose, className: "w-full py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition", children: "Dong" })] })] }) }));
}
// ─── QR Payment Modal ──────────────────────────────────────────────────────────
function QRPaymentModal({ open, onClose, onSuccess }) {
    const [step, setStep] = useState("patient");
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [services, setServices] = useState([]);
    const [serviceName, setServiceName] = useState("");
    const [servicePrice, setServicePrice] = useState("");
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [createdPaymentId, setCreatedPaymentId] = useState(null);
    const [createdPayment, setCreatedPayment] = useState(null);
    const [qrData, setQrData] = useState(null);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [loadingAppointments, setLoadingAppointments] = useState(false);
    const [loadingQR, setLoadingQR] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    useEffect(() => {
        if (open) {
            setLoadingPatients(true);
            patientApi.getAll().then((res) => {
                const list = Array.isArray(res.data) ? res.data : [];
                setPatients(list);
            }).catch(() => { }).finally(() => setLoadingPatients(false));
        }
    }, [open]);
    useEffect(() => {
        if (open) {
            setStep("patient");
            setSelectedPatient(null);
            setSelectedAppointment(null);
            setAppointments([]);
            setServices([]);
            setReason("");
            setDescription("");
            setServiceName("");
            setServicePrice("");
            setCreatedPaymentId(null);
            setCreatedPayment(null);
            setQrData(null);
        }
    }, [open]);
    const loadAppointments = async (patientId) => {
        setLoadingAppointments(true);
        setAppointments([]);
        setSelectedAppointment(null);
        const { appointmentApi: aptApi } = await import("../../services/api");
        try {
            // Resolve patient name from the local patients list (avoids extra API call + ID mismatch)
            const patient = patients.find((p) => p._id === patientId);
            if (!patient) {
                setLoadingAppointments(false);
                return;
            }
            const patientName = patient.name.trim().toLowerCase();
            const res = await aptApi.getAll();
            const paginated = res.data?.data ?? res.data;
            const all = Array.isArray(paginated?.data)
                ? paginated.data
                : Array.isArray(paginated)
                    ? paginated
                    : [];
            setAppointments(all.filter((a) => a.patientName?.trim().toLowerCase() === patientName));
        }
        catch { }
        finally {
            setLoadingAppointments(false);
        }
    };
    const addService = () => {
        if (!serviceName.trim())
            return;
        setServices([...services, { name: serviceName.trim(), price: Number(servicePrice) || 0 }]);
        setServiceName("");
        setServicePrice("");
    };
    const removeService = (i) => setServices(services.filter((_, idx) => idx !== i));
    const totalFromAppointment = selectedAppointment ? selectedAppointment.fee : 0;
    const total = totalFromAppointment + services.reduce((s, sv) => s + sv.price, 0);
    const handleCreateReceiptAndQR = async () => {
        if (!selectedPatient || total <= 0) {
            alert("Vui lòng chọn bệnh nhân và nhập số tiền hợp lệ.");
            return;
        }
        if (!reason.trim()) {
            alert("Vui lòng nhập lí do thanh toán.");
            return;
        }
        setLoadingQR(true);
        try {
            // 1. Create payment receipt (pending)
            const paymentRes = await paymentApi.create({
                patientId: selectedPatient._id,
                appointmentId: selectedAppointment?._id || null,
                amount: total,
                method: "bank_transfer",
                status: "pending",
                description: description || `Thanh toán QR MBBank`,
                services: selectedAppointment
                    ? [{ name: selectedAppointment.serviceName, price: selectedAppointment.fee }, ...services]
                    : services,
                discount: 0,
                tax: 0,
                notes: "Phiếu thu QR MBBank",
                reason: reason.trim(),
            });
            const newPayment = paymentRes.data?.data;
            if (!newPayment?._id)
                throw new Error("Không tạo được phiếu thu");
            setCreatedPaymentId(newPayment._id);
            setCreatedPayment(newPayment);
            // 2. Generate QR
            const qrRes = await paymentApi.generateQR({
                amount: total,
                invoiceNumber: newPayment.invoiceNumber,
                patientName: selectedPatient.name,
                description: description || `Thanh toan ${newPayment.invoiceNumber}`,
            });
            const qr = qrRes.data?.data;
            if (!qr)
                throw new Error("Không tạo được mã QR");
            setQrData(qr);
            // Refresh parent table immediately after payment is created
            onSuccess();
            setStep("receipt");
        }
        catch (err) {
            alert(err.response?.data?.message || err.message || "Lỗi khi tạo phiếu thu.");
        }
        finally {
            setLoadingQR(false);
        }
    };
    const handleConfirmPayment = async () => {
        if (!createdPaymentId)
            return;
        setConfirmLoading(true);
        try {
            await paymentApi.confirmPayment(createdPaymentId, reason);
            alert("Xác nhận thanh toán thành công! Phiếu thu đã được cập nhật.");
            onSuccess();
            onClose();
        }
        catch (err) {
            alert(err.response?.data?.message || "Xác nhận thất bại.");
        }
        finally {
            setConfirmLoading(false);
        }
    };
    const handlePrintQR = () => {
        if (!qrData?.qrDataUrl || !createdPayment)
            return;
        const win = window.open("", "_blank");
        if (!win)
            return;
        win.document.write(`<html><head><title>In QR Thanh Toan</title><style>body{font-family:Arial,sans-serif;text-align:center;padding:40px;}h2{color:#003A70;}p{font-size:14px;color:#555;}img{border:4px solid #003A70;border-radius:12px;}.info{margin-top:16px;font-weight:bold;color:#059669;}.receipt{border:1px solid #ddd;padding:20px;max-width:400px;margin:0 auto;}</style></head><body><h2>Phong Kham Nha Khoa VinaMec</h2><p>Ma hoa don: ${createdPayment.invoiceNumber}</p><p>Benh nhan: ${selectedPatient?.name}</p><p>Lí do: ${reason}</p><hr/><img src="${qrData.qrDataUrl}" width="300"/><p class="info">So tien: ${total.toLocaleString("vi-VN")} VND</p><p>STK: 280605666888 - Nguyen Thai Son</p><p>Noi dung: ${qrData.addInfo}</p><script>window.print();<\/script></body></html>`);
        win.document.close();
    };
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "sticky top-0 px-6 py-4 border-b border-slate-200 flex items-center justify-between", style: { background: "linear-gradient(135deg, #003A70 0%, #0055A4 100%)" }, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center", children: _jsx("span", { className: "text-white font-black text-base", children: "MB" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-white", children: "T\u1EA1o phi\u1EBFu thu & QR MBBank" }), _jsx("p", { className: "text-blue-200 text-xs", children: step === "patient" ? "Bước 1: Chọn bệnh nhân & dịch vụ" : step === "receipt" ? "Bước 2: Xác nhận thanh toán" : "Quét mã QR" })] })] }), _jsx("button", { onClick: onClose, className: "text-blue-200 hover:text-white text-2xl font-light", children: "X" })] }), _jsxs("div", { className: "p-6 space-y-5", children: [step === "patient" && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "rounded-xl p-4 text-white text-center", style: { background: "linear-gradient(135deg, #003A70 0%, #0055A4 100%)" }, children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center mx-auto mb-2", children: _jsx("span", { className: "text-white font-black text-base", children: "MB" }) }), _jsx("p", { className: "font-bold text-sm", children: "MBBank VietQR" }), _jsx("p", { className: "text-blue-200 text-xs mt-1", children: "STK: 280605666888 - Nguyen Thai Son" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: ["Ch\u1ECDn b\u1EC7nh nh\u00E2n ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsxs("select", { className: "w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition", style: { background: "#fafafa" }, value: selectedPatient?._id || "", onChange: (e) => {
                                                const p = patients.find((x) => x._id === e.target.value) || null;
                                                setSelectedPatient(p);
                                                if (p)
                                                    loadAppointments(p._id);
                                                else {
                                                    setAppointments([]);
                                                    setSelectedAppointment(null);
                                                }
                                            }, children: [_jsx("option", { value: "", children: "\u2014 Ch\u1ECDn b\u1EC7nh nh\u00E2n \u2014" }), patients.map((p) => (_jsxs("option", { value: p._id, children: [p.name, " (", p.email, ")"] }, p._id)))] })] }), selectedPatient && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "Li\u00EAn k\u1EBFt l\u1ECBch h\u1EB9n (t\u00F9y ch\u1ECDn)" }), loadingAppointments ? (_jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-400 py-3", children: [_jsxs("svg", { className: "animate-spin w-4 h-4", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })] }), "\u0110ang t\u1EA3i l\u1ECBch h\u1EB9n..."] })) : appointments.length > 0 ? (_jsx("div", { className: "space-y-2", children: appointments.map((a) => (_jsxs("div", { onClick: () => setSelectedAppointment(selectedAppointment?._id === a._id ? null : a), className: `flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${selectedAppointment?._id === a._id
                                                    ? "border-emerald-400 bg-emerald-50"
                                                    : "border-slate-200 bg-white hover:border-slate-300"}`, children: [_jsx("div", { className: `w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedAppointment?._id === a._id ? "border-emerald-500 bg-emerald-500" : "border-slate-300"}`, children: selectedAppointment?._id === a._id && (_jsx("svg", { className: "w-3 h-3 text-white", fill: "none", stroke: "currentColor", strokeWidth: 3, viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 13l4 4L19 7" }) })) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-semibold text-slate-800", children: a.serviceName }), _jsxs("p", { className: "text-xs text-slate-400", children: [a.date, " l\u00FAc ", a.time] }), _jsx("p", { className: `text-xs font-bold mt-1 ${a.isPaid ? "text-emerald-600" : "text-amber-600"}`, children: a.isPaid ? "Đã thanh toán" : `${a.fee?.toLocaleString("vi-VN")} đ — Chưa thanh toán` })] })] }, a._id))) })) : (_jsx("p", { className: "text-sm text-slate-400 py-2", children: "Kh\u00F4ng c\u00F3 l\u1ECBch h\u1EB9n n\u00E0o cho b\u1EC7nh nh\u00E2n n\u00E0y." }))] })), selectedPatient && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "D\u1ECBch v\u1EE5 b\u1ED5 sung (th\u00EAm d\u1ECBch v\u1EE5 n\u1EBFu c\u1EA7n)" }), _jsx("div", { className: "space-y-2", children: services.map((s, i) => (_jsxs("div", { className: "flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 border border-slate-100", children: [_jsx("span", { className: "text-sm text-slate-700", children: s.name }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-sm font-semibold text-sky-600", children: [s.price.toLocaleString("vi-VN"), " \u0111"] }), _jsx("button", { onClick: () => removeService(i), className: "w-5 h-5 rounded bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center text-xs", children: "\u00D7" })] })] }, i))) }), _jsxs("div", { className: "flex gap-2 mt-2", children: [_jsx("input", { className: "flex-1 px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500", placeholder: "T\u00EAn d\u1ECBch v\u1EE5", value: serviceName, onChange: (e) => setServiceName(e.target.value), style: { background: "#fafafa" } }), _jsx("input", { type: "number", className: "w-28 px-3 py-2 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500", placeholder: "Gi\u00E1 (\u0111)", value: servicePrice, onChange: (e) => setServicePrice(e.target.value), style: { background: "#fafafa" } }), _jsx("button", { onClick: addService, className: "px-3 py-2 bg-emerald-100 text-emerald-700 rounded-xl font-semibold text-sm hover:bg-emerald-200 transition", children: "+" })] })] })), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: ["L\u00ED do thanh to\u00E1n ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { className: "w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition", placeholder: "VD: Thanh to\u00E1n kh\u00E1m r\u0103ng, Tr\u1ED3ng implant,...", value: reason, onChange: (e) => setReason(e.target.value), style: { background: "#fafafa" } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700 mb-2", children: "N\u1ED9i dung ghi ch\u00FA" }), _jsx("textarea", { className: "w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition resize-none h-20", placeholder: "Ghi ch\u00FA th\u00EAm (t\u00F9y ch\u1ECDn)...", value: description, onChange: (e) => setDescription(e.target.value), style: { background: "#fafafa" } })] }), (total > 0 || selectedAppointment) && (_jsxs("div", { className: "bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-center", children: [_jsx("p", { className: "text-xs text-emerald-600 font-semibold uppercase tracking-wider", children: "T\u1ED5ng c\u1ED9ng" }), _jsxs("p", { className: "text-2xl font-black text-emerald-700 mt-1", children: [total.toLocaleString("vi-VN"), " \u0111"] }), selectedAppointment && (_jsxs("p", { className: "text-xs text-emerald-500 mt-1", children: ["Bao g\u1ED3m ph\u00ED l\u1ECBch h\u1EB9n: ", selectedAppointment.fee?.toLocaleString("vi-VN"), " \u0111 + d\u1ECBch v\u1EE5 b\u1ED5 sung"] }))] })), _jsx("button", { onClick: handleCreateReceiptAndQR, disabled: loadingQR || !selectedPatient || total <= 0, className: "w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed", style: { background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 4px 14px rgba(16,185,129,0.4)" }, children: loadingQR ? (_jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsxs("svg", { className: "animate-spin w-4 h-4", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })] }), "\u0110ang t\u1EA1o phi\u1EBFu thu & m\u00E3 QR..."] })) : ("Tạo phiếu thu & mã QR MBBank") })] })), step === "receipt" && createdPayment && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 overflow-hidden", children: [_jsx("div", { className: "px-5 py-4 text-white", style: { background: "linear-gradient(135deg, #003A70 0%, #0055A4 100%)" }, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center", children: _jsx("span", { className: "text-white font-black text-base", children: "MB" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-sm", children: "PHI\u1EBEU THU" }), _jsx("p", { className: "text-blue-200 text-xs font-mono", children: createdPayment.invoiceNumber })] })] }) }), _jsxs("div", { className: "p-5 space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "bg-slate-50 rounded-lg p-3", children: [_jsx("p", { className: "text-xs text-slate-400 font-semibold uppercase", children: "B\u1EC7nh nh\u00E2n" }), _jsx("p", { className: "text-sm font-bold text-slate-800 mt-0.5", children: selectedPatient?.name }), _jsx("p", { className: "text-xs text-slate-400", children: selectedPatient?.email })] }), _jsxs("div", { className: "bg-slate-50 rounded-lg p-3", children: [_jsx("p", { className: "text-xs text-slate-400 font-semibold uppercase", children: "Ng\u00E0y t\u1EA1o" }), _jsx("p", { className: "text-sm font-bold text-slate-800 mt-0.5", children: new Date(createdPayment.createdAt).toLocaleDateString("vi-VN") }), _jsxs("p", { className: "text-xs text-slate-400", children: ["b\u1EDFi ", createdPayment.recordedByName] })] })] }), selectedAppointment && (_jsxs("div", { className: "bg-sky-50 rounded-lg p-3 border border-sky-100", children: [_jsx("p", { className: "text-xs text-sky-600 font-semibold uppercase", children: "L\u1ECBch h\u1EB9n li\u00EAn k\u1EBFt" }), _jsx("p", { className: "text-sm font-bold text-slate-800 mt-0.5", children: selectedAppointment.serviceName }), _jsxs("p", { className: "text-xs text-slate-500", children: [selectedAppointment.date, " l\u00FAc ", selectedAppointment.time] })] })), createdPayment.services?.length > 0 && (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-slate-400 font-semibold uppercase mb-2", children: "D\u1ECBch v\u1EE5" }), createdPayment.services.map((s, i) => (_jsxs("div", { className: "flex justify-between bg-slate-50 rounded-lg px-3 py-2 mb-1", children: [_jsx("span", { className: "text-sm text-slate-700", children: s.name }), _jsxs("span", { className: "text-sm font-semibold text-slate-800", children: [s.price.toLocaleString("vi-VN"), " \u0111"] })] }, i)))] })), reason && (_jsxs("div", { className: "bg-amber-50 rounded-lg p-3 border border-amber-200", children: [_jsx("p", { className: "text-xs text-amber-600 font-semibold uppercase", children: "L\u00ED do thanh to\u00E1n" }), _jsx("p", { className: "text-sm font-bold text-amber-800 mt-0.5", children: reason })] })), _jsxs("div", { className: "flex justify-between items-center rounded-xl p-4 text-white", style: { background: "linear-gradient(135deg, #10b981, #059669)" }, children: [_jsx("span", { className: "font-bold text-sm", children: "T\u1ED4NG C\u1ED8NG" }), _jsxs("span", { className: "text-2xl font-black", children: [total.toLocaleString("vi-VN"), " \u0111"] })] }), _jsxs("div", { className: "flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-6 h-6 rounded bg-amber-400 flex items-center justify-center", children: _jsx("span", { className: "text-white font-black text-[10px]", children: "MB" }) }), _jsx("span", { className: "text-sm font-semibold text-slate-700", children: "QR MBBank" })] }), _jsx("span", { className: "text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full", children: "Ch\u1EDD thanh to\u00E1n" })] })] })] }), qrData && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-slate-50 rounded-xl p-6 text-center border border-slate-100", children: [_jsx("img", { src: qrData.qrDataUrl, alt: "QR Code", className: "w-56 h-56 mx-auto rounded-2xl" }), _jsx("p", { className: "text-xs text-slate-400 mt-3", children: "Qu\u00E9t m\u00E3 b\u1EB1ng \u1EE9ng d\u1EE5ng ng\u00E2n h\u00E0ng MBBank" })] }), _jsxs("div", { className: "bg-white rounded-xl border border-slate-200 overflow-hidden", children: [_jsx("div", { className: "px-4 py-2.5", style: { background: "linear-gradient(135deg, #003A70 0%, #0055A4 100%)" }, children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-5 h-5 rounded bg-amber-400 flex items-center justify-center", children: _jsx("span", { className: "text-white font-black text-[9px]", children: "MB" }) }), _jsx("p", { className: "text-white text-xs font-bold uppercase tracking-wider", children: "MBBank - Th\u00F4ng tin t\u00E0i kho\u1EA3n" })] }) }), [
                                                    { label: "Số tài khoản", value: "280605666888" },
                                                    { label: "Tên tài khoản", value: "Nguyen Thai Son" },
                                                    { label: "Nội dung CK", value: qrData.addInfo },
                                                ].map((item) => (_jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-slate-100 last:border-0", children: [_jsx("span", { className: "text-xs font-medium text-slate-400", children: item.label }), _jsx("span", { className: "text-sm font-bold text-slate-700", children: item.value })] }, item.label)))] }), _jsxs("div", { className: "bg-blue-50 rounded-xl p-4 border border-blue-100", children: [_jsx("p", { className: "text-sm font-bold text-blue-700 mb-2", children: "H\u01B0\u1EDBng d\u1EABn thanh to\u00E1n:" }), _jsxs("ol", { className: "text-xs text-slate-600 space-y-1 list-decimal list-inside", children: [_jsxs("li", { children: ["M\u1EDF \u1EE9ng d\u1EE5ng ", _jsx("strong", { children: "MBBank" }), " ho\u1EB7c app ", _jsx("strong", { children: "VietQR" })] }), _jsxs("li", { children: ["Ch\u1ECDn t\u00EDnh n\u0103ng ", _jsx("strong", { children: "Qu\u00E9t m\u00E3 QR" })] }), _jsx("li", { children: "Qu\u00E9t m\u00E3 QR b\u00EAn tr\u00EAn" }), _jsxs("li", { children: ["Nh\u1EADp \u0111\u00FAng s\u1ED1 ti\u1EC1n: ", _jsxs("strong", { children: [total.toLocaleString("vi-VN"), " VND"] })] }), _jsx("li", { children: "X\u00E1c nh\u1EADn thanh to\u00E1n" })] })] })] })), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx("button", { onClick: () => setStep("patient"), className: "py-3 rounded-xl font-semibold text-sm border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition", children: "\u2190 T\u1EA1o l\u1EA1i" }), _jsx("button", { onClick: handlePrintQR, className: "py-3 rounded-xl font-semibold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition", children: "In QR" })] }), createdPaymentId && (_jsxs("div", { className: "space-y-3", children: [_jsx("button", { onClick: handleConfirmPayment, disabled: confirmLoading, className: "w-full py-4 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 disabled:opacity-50", style: { background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 4px 14px rgba(16,185,129,0.4)" }, children: confirmLoading ? (_jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsxs("svg", { className: "animate-spin w-4 h-4", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })] }), "\u0110ang x\u00E1c nh\u1EADn..."] })) : (_jsx(_Fragment, { children: "\u2713 \u0110\u00E3 nh\u1EADn \u0111\u01B0\u1EE3c ti\u1EC1n \u2014 X\u00E1c nh\u1EADn thanh to\u00E1n th\u00E0nh c\u00F4ng" })) }), _jsx("p", { className: "text-center text-xs text-slate-400", children: "Sau khi b\u1EC7nh nh\u00E2n chuy\u1EC3n kho\u1EA3n xong, b\u1EA5m n\u00FAt tr\u00EAn \u0111\u1EC3 x\u00E1c nh\u1EADn thanh to\u00E1n th\u00E0nh c\u00F4ng v\u00E0 c\u1EADp nh\u1EADt v\u00E0o qu\u1EA3n l\u00FD thanh to\u00E1n." })] }))] }))] })] }) }));
}
