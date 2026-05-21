import { jsx as _jsx } from "react/jsx-runtime";
export default function LoadingSpinner({ size = 'md' }) {
    const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size];
    return (_jsx("div", { className: "flex items-center justify-center", children: _jsx("div", { className: `${s} border-2 border-dental-200 border-t-dental-500 rounded-full animate-spin` }) }));
}
