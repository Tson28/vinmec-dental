import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function EmptyState({ icon = '📭', title, description, action }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center text-3xl mb-4", children: icon }), _jsx("h3", { className: "font-display font-bold text-lg text-surface-800", children: title }), description && _jsx("p", { className: "text-sm text-surface-400 mt-1 max-w-xs", children: description }), action && (_jsx("button", { onClick: action.onClick, className: "btn-primary mt-4 text-sm", children: action.label }))] }));
}
