import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const icons = {
    success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️',
};
const colors = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    error: 'border-red-200 bg-red-50 text-red-800',
    info: 'border-dental-200 bg-dental-50 text-dental-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
};
export default function Toaster({ toasts, onRemove }) {
    if (!toasts.length)
        return null;
    return (_jsx("div", { className: "fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm w-full", children: toasts.map(t => (_jsxs("div", { className: `flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-slide-up ${colors[t.type]}`, children: [_jsx("span", { children: icons[t.type] }), _jsx("p", { className: "text-sm font-medium flex-1", children: t.message }), _jsx("button", { onClick: () => onRemove(t.id), className: "opacity-50 hover:opacity-100 transition text-xs", children: "\u2715" })] }, t.id))) }));
}
