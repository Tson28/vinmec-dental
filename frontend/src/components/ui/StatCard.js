import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const colors = {
    blue: 'bg-dental-100 text-dental-600',
    teal: 'bg-mint-100 text-mint-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-emerald-100 text-emerald-600',
};
export default function StatCard({ label, value, icon, color = 'blue', change }) {
    return (_jsxs("div", { className: "stat-card animate-slide-up", children: [_jsx("div", { className: `w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${colors[color]}`, children: icon }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-display font-bold text-surface-900", children: value }), _jsx("p", { className: "text-xs font-semibold text-surface-500 mt-0.5", children: label }), change && _jsx("p", { className: "text-xs text-emerald-600 font-medium mt-0.5", children: change })] })] }));
}
