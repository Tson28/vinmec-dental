import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "react-router-dom";
import { chatApi } from "../services/api";
import ChatInterface from "../components/chat/ChatInterface";
export default function PublicChatPage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleSend = async (content) => {
        const userMsg = {
            id: Date.now().toString(),
            role: "user",
            content,
            timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setLoading(true);
        try {
            const res = await chatApi.publicChat(content);
            const aiMsg = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: res.data?.data?.reply ||
                    res.data?.reply ||
                    res.data?.message ||
                    "Thank you for your question. For detailed dental advice, please consult one of our doctors.",
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, aiMsg]);
        }
        catch {
            const errMsg = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: "I'm having trouble connecting right now. Please try again or log in for full support.",
                timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errMsg]);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-dental-900 via-dental-800 to-mint-900 flex flex-col", children: [_jsxs("header", { className: "flex items-center justify-between px-6 py-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-dental-600 flex items-center justify-center text-white text-lg", children: "\uD83E\uDD16" }), _jsxs("div", { children: [_jsx("p", { className: "font-display font-bold text-white text-sm", children: "VinaMec" }), _jsx("p", { className: "text-white/70 text-xs", children: "Public Dental AI" })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx(Link, { to: "/login", className: "btn-secondary text-sm", children: "Sign In" }), _jsx(Link, { to: "/register", className: "btn-primary text-sm", children: "Register" })] })] }), _jsxs("div", { className: "flex-1 max-w-3xl w-full mx-auto px-4 py-4 flex flex-col", children: [_jsxs("div", { className: "mb-4 px-4 py-3 bg-surface-900 backdrop-blur rounded-xl border border-surface-700 text-sm text-white flex items-center gap-2", children: [_jsx("span", { children: "\u2139\uFE0F" }), _jsxs("span", { children: ["Public chat \u2013 for personalized advice and full features, please", " ", _jsx(Link, { to: "/login", className: "underline font-semibold text-yellow-300", children: "login" }), "."] })] }), _jsx("div", { className: "flex-1", style: { minHeight: "60vh" }, children: _jsx(ChatInterface, { messages: messages, onSend: handleSend, loading: loading, isPublic: true, title: "Public Dental AI Assistant" }) })] })] }));
}
