import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
export default function Modal({ open, onClose, title, children, size = 'md' }) {
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape')
            onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);
    if (!open)
        return null;
    const sizeClasses = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' };
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-surface-900/40 backdrop-blur-sm", onClick: onClose }), _jsxs("div", { className: `relative bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} animate-slide-up`, children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-surface-100", children: [_jsx("h3", { className: "font-display font-bold text-lg text-surface-900", children: title }), _jsx("button", { onClick: onClose, className: "btn-ghost p-1.5 rounded-lg", children: _jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-5 h-5", children: _jsx("path", { d: "M18 6L6 18M6 6l12 12" }) }) })] }), _jsx("div", { className: "px-6 py-4", children: children })] })] }));
}
