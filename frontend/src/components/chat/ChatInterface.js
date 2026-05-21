import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
export default function ChatInterface({ messages, onSend, loading, placeholder, title, isPublic, }) {
    const [input, setInput] = useState("");
    const endRef = useRef(null);
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    const handleSend = async () => {
        if (!input.trim() || loading)
            return;
        const msg = input.trim();
        setInput("");
        await onSend(msg);
    };
    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    return (_jsxs("div", { className: "flex flex-col h-full bg-white rounded-2xl border border-surface-100 shadow-card overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-3 px-5 py-4 border-b border-surface-100 bg-gradient-to-r from-dental-50 to-mint-50", children: [_jsx("div", { className: "w-16 h-16 rounded-xl bg-gradient-dental flex items-center justify-center text-white text-4xl", children: "\uD83E\uDD16" }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-surface-900 text-sm", children: title || "Dental AI Assistant" }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-slow" }), _jsxs("span", { className: "text-xs text-surface-800 font-medium", children: ["Online \u2022 ", isPublic ? "Public Mode" : "Private Mode"] })] })] })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [messages.length === 0 && (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center py-12", children: [_jsx("div", { className: "w-24 h-24 rounded-2xl bg-gradient-dental flex items-center justify-center text-white text-6xl mb-4 shadow-glow", children: "\uD83E\uDD16" }), _jsx("p", { className: "font-display font-bold text-lg text-surface-900", children: "Hi! I'm your Dental AI" }), _jsx("p", { className: "text-sm text-surface-800 mt-1 max-w-xs", children: "Ask me anything about dental health, treatments, or appointments." }), _jsx("div", { className: "flex flex-wrap gap-2 mt-4 justify-center", children: [
                                    "What causes tooth decay?",
                                    "How often should I visit?",
                                    "Teeth whitening tips",
                                ].map((q) => (_jsx("button", { onClick: () => onSend(q), className: "text-xs bg-dental-50 text-surface-900 px-3 py-1.5 rounded-full border border-dental-300 hover:bg-dental-100 transition", children: q }, q))) })] })), messages.map((msg) => (_jsxs("div", { className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`, children: [msg.role === "assistant" && (_jsx("div", { className: "w-7 h-7 rounded-lg bg-gradient-dental flex items-center justify-center text-white text-xs flex-shrink-0 mt-1", children: "\uD83E\uDD16" })), _jsxs("div", { children: [_jsx("div", { className: msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai", children: msg.content }), _jsx("p", { className: `text-[10px] text-surface-600 mt-1 ${msg.role === "user" ? "text-right" : ""}`, children: new Date(msg.timestamp).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }) })] }), msg.role === "user" && (_jsx("div", { className: "w-7 h-7 rounded-lg bg-surface-200 flex items-center justify-center text-xs flex-shrink-0 mt-1", children: "\uD83D\uDC64" }))] }, msg.id))), loading && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-7 h-7 rounded-lg bg-gradient-dental flex items-center justify-center text-white text-xs", children: "\uD83E\uDD16" }), _jsxs("div", { className: "chat-bubble-ai flex items-center gap-1.5 py-3", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-dental-400 animate-bounce", style: { animationDelay: "0ms" } }), _jsx("div", { className: "w-2 h-2 rounded-full bg-dental-400 animate-bounce", style: { animationDelay: "150ms" } }), _jsx("div", { className: "w-2 h-2 rounded-full bg-dental-400 animate-bounce", style: { animationDelay: "300ms" } })] })] })), _jsx("div", { ref: endRef })] }), _jsx("div", { className: "px-4 py-3 border-t border-surface-100 bg-surface-50", children: _jsxs("div", { className: "flex gap-2 items-end", children: [_jsx("textarea", { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: handleKey, placeholder: placeholder || "Ask about dental health...", rows: 1, className: "input resize-none flex-1 min-h-[44px] max-h-32 overflow-y-auto" }), _jsxs("button", { onClick: handleSend, disabled: !input.trim() || loading, className: "btn-primary px-4 py-2.5 flex items-center gap-2 flex-shrink-0", children: [_jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", className: "w-4 h-4", children: _jsx("path", { d: "M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" }) }), "Send"] })] }) })] }));
}
