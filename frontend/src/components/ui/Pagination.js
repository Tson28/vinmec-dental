import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1)
        return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const visible = pages.filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1);
    return (_jsxs("div", { className: "flex items-center justify-center gap-1 mt-4", children: [_jsx("button", { onClick: () => onPageChange(page - 1), disabled: page === 1, className: "w-8 h-8 rounded-lg flex items-center justify-center text-sm text-surface-500 hover:bg-surface-100 disabled:opacity-30 transition", children: "\u2039" }), visible.reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1)
                    acc.push('ellipsis');
                acc.push(p);
                return acc;
            }, []).map((p, i) => p === 'ellipsis' ? (_jsx("span", { className: "w-8 h-8 flex items-center justify-center text-surface-400 text-sm", children: "\u2026" }, `e${i}`)) : (_jsx("button", { onClick: () => onPageChange(p), className: `w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition ${page === p ? 'bg-dental-600 text-white shadow-sm' : 'text-surface-600 hover:bg-surface-100'}`, children: p }, p))), _jsx("button", { onClick: () => onPageChange(page + 1), disabled: page === totalPages, className: "w-8 h-8 rounded-lg flex items-center justify-center text-sm text-surface-500 hover:bg-surface-100 disabled:opacity-30 transition", children: "\u203A" })] }));
}
