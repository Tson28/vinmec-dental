import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const config = {
    info: { bg: 'bg-dental-50', border: 'border-dental-200', text: 'text-dental-800', icon: 'ℹ️' },
    success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: '✅' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: '⚠️' },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: '❌' },
};
export default function Alert({ variant = 'info', title, children, onClose, className = '' }) {
    const { bg, border, text, icon } = config[variant];
    return (_jsxs("div", { className: `flex items-start gap-3 px-4 py-3 rounded-xl border ${bg} ${border} ${text} ${className}`, children: [_jsx("span", { className: "text-base flex-shrink-0 mt-0.5", children: icon }), _jsxs("div", { className: "flex-1 min-w-0", children: [title && _jsx("p", { className: "font-semibold text-sm mb-0.5", children: title }), _jsx("p", { className: "text-sm", children: children })] }), onClose && (_jsx("button", { onClick: onClose, className: "flex-shrink-0 opacity-60 hover:opacity-100 transition text-sm", children: "\u2715" }))] }));
}
