import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const variantClass = {
    blue: 'bg-dental-100 text-dental-700',
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    purple: 'bg-violet-100 text-violet-700',
    gray: 'bg-surface-100 text-surface-600',
};
const dotClass = {
    blue: 'bg-dental-500',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    purple: 'bg-violet-500',
    gray: 'bg-surface-400',
};
export default function Badge({ variant = 'blue', children, dot }) {
    return (_jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantClass[variant]}`, children: [dot && _jsx("span", { className: `w-1.5 h-1.5 rounded-full ${dotClass[variant]}` }), children] }));
}
