import { useState, useCallback } from "react";
export function useToast() {
    const [toasts, setToasts] = useState([]);
    const addToast = useCallback((message, type = "info", duration = 3500) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, type, message, duration }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
        return id;
    }, []);
    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);
    const toast = {
        success: (msg, duration) => addToast(msg, "success", duration),
        error: (msg, duration) => addToast(msg, "error", duration),
        info: (msg, duration) => addToast(msg, "info", duration),
        warning: (msg, duration) => addToast(msg, "warning", duration),
    };
    return { toasts, toast, removeToast };
}
