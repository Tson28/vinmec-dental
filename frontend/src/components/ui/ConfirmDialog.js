import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Modal from './Modal';
export default function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirm Action', message, confirmLabel = 'Confirm', danger, loading, }) {
    return (_jsx(Modal, { open: open, onClose: onClose, title: title, size: "sm", children: _jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-sm text-surface-600", children: message }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: onConfirm, disabled: loading, className: `flex-1 font-semibold px-4 py-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 ${danger
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'btn-primary'}`, children: loading ? 'Processing...' : confirmLabel }), _jsx("button", { onClick: onClose, className: "btn-secondary flex-1", children: "Cancel" })] })] }) }));
}
