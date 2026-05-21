import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { conversationApi } from "../../services/api";
import { useToast } from "../../hooks/useToast";
export default function ConversationList({ onSelectConversation, onSelectChatbot, loading, isChatbotSelected, }) {
    const { toast } = useToast();
    const [conversations, setConversations] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [showUserList, setShowUserList] = useState(false);
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        loadConversations();
    }, []);
    const loadConversations = async () => {
        setLoadingConversations(true);
        try {
            const res = await conversationApi.getAll();
            const convs = res.data?.data || res.data || [];
            setConversations(Array.isArray(convs) ? convs : []);
        }
        catch (error) {
            console.error("Failed to load conversations:", error);
            toast.error("Failed to load conversations");
        }
        finally {
            setLoadingConversations(false);
        }
    };
    const loadAvailableUsers = async () => {
        setLoadingUsers(true);
        try {
            const res = await conversationApi.getAvailableUsers();
            const users = res.data?.data || res.data || [];
            // Ensure we have an array
            if (!Array.isArray(users)) {
                console.warn("Unexpected response format for available users:", res);
                toast.error("Invalid response from server");
                setAvailableUsers([]);
                return;
            }
            if (users.length === 0) {
                toast.info("No available users to chat with");
            }
            setAvailableUsers(users);
            setShowUserList(true);
        }
        catch (error) {
            console.error("Failed to load users:", error);
            const errorMsg = error.response?.data?.message ||
                error.message ||
                "Failed to load users";
            toast.error(errorMsg);
        }
        finally {
            setLoadingUsers(false);
        }
    };
    const handleSelectUser = async (user) => {
        try {
            const res = await conversationApi.findOrCreate(user._id || user.id);
            const conversation = res.data?.data;
            if (conversation) {
                onSelectConversation(conversation.conversationId || conversation.id, user);
                setShowUserList(false);
                setSearchTerm("");
                await loadConversations();
            }
        }
        catch (error) {
            console.error("Failed to create conversation:", error);
            toast.error("Failed to start conversation");
        }
    };
    const handleSelectConversation = (conversation) => {
        onSelectConversation(conversation.conversationId, conversation.otherUser);
    };
    const filteredUsers = availableUsers.filter((user) => user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    return (_jsxs("div", { className: "flex flex-col h-full bg-white rounded-xl border border-surface-100 shadow-card overflow-hidden", children: [_jsxs("div", { className: "px-4 py-3 border-b border-surface-100 bg-gradient-to-r from-dental-50 to-mint-50", children: [_jsx("h3", { className: "font-bold text-surface-900 mb-3", children: "Messages" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: onSelectChatbot, className: `flex-1 text-sm py-2 px-3 rounded-lg transition font-medium ${isChatbotSelected
                                    ? "bg-gradient-dental text-white shadow-md"
                                    : "btn-secondary"}`, children: "\uD83E\uDD16 AI Chat" }), _jsx("button", { onClick: loadAvailableUsers, className: "flex-1 btn-primary text-sm py-2", disabled: loadingUsers, children: loadingUsers ? "Loading..." : "+ New Chat" })] })] }), showUserList && (_jsx("div", { className: "fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-lg max-w-sm w-full max-h-96 flex flex-col", children: [_jsxs("div", { className: "px-4 py-3 border-b border-surface-100 flex items-center justify-between", children: [_jsx("h4", { className: "font-bold text-surface-900", children: "Select contact" }), _jsx("button", { onClick: () => setShowUserList(false), className: "text-surface-400 hover:text-surface-600 text-xl", children: "\u2715" })] }), _jsx("input", { type: "text", placeholder: "Search by name or email...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "input m-3 mb-0" }), _jsx("div", { className: "flex-1 overflow-y-auto p-3 space-y-2", children: filteredUsers.length > 0 ? (filteredUsers.map((user) => (_jsxs("button", { onClick: () => handleSelectUser(user), className: "w-full text-left p-3 rounded-lg hover:bg-surface-100 transition flex items-center gap-3 group", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-dental flex items-center justify-center text-white font-bold flex-shrink-0", children: user.avatar ? (_jsx("img", { src: user.avatar, alt: user.name, className: "w-full h-full rounded-full object-cover" })) : (user.name?.charAt(0).toUpperCase()) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-medium text-sm text-surface-900", children: user.name }), _jsx("p", { className: "text-xs text-surface-500 truncate", children: user.email })] }), _jsx("svg", { className: "w-5 h-5 text-surface-300 group-hover:text-dental-600 transition", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })] }, user._id || user.id)))) : (_jsx("div", { className: "text-center py-8 text-surface-500 text-sm px-4", children: loadingUsers ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-6 h-6 border-2 border-dental-400 border-t-dental-600 rounded-full animate-spin mx-auto mb-2" }), _jsx("p", { children: "Loading users..." })] })) : searchTerm ? (_jsxs("p", { children: ["No users found matching \"", searchTerm, "\""] })) : (_jsxs(_Fragment, { children: [_jsx("p", { className: "font-medium mb-1", children: "No available users" }), _jsx("p", { className: "text-xs", children: "Check back later when other users are available" })] })) })) })] }) })), _jsx("div", { className: "flex-1 overflow-y-auto", children: loadingConversations ? (_jsx("div", { className: "flex items-center justify-center h-full text-surface-500", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-8 h-8 border-2 border-dental-400 border-t-dental-600 rounded-full animate-spin mx-auto mb-2" }), _jsx("p", { className: "text-sm", children: "Loading conversations..." })] }) })) : conversations.length > 0 ? (_jsx("div", { className: "space-y-1 p-2", children: conversations.map((conv) => (_jsx("button", { onClick: () => handleSelectConversation(conv), className: "w-full text-left p-3 rounded-lg hover:bg-surface-100 transition group", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-dental flex items-center justify-center text-white font-bold flex-shrink-0", children: conv.otherUser.avatar ? (_jsx("img", { src: conv.otherUser.avatar, alt: conv.otherUser.name, className: "w-full h-full rounded-full object-cover" })) : (conv.otherUser.name?.charAt(0).toUpperCase()) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-medium text-sm text-surface-900", children: conv.otherUser.name }), _jsx("p", { className: "text-xs text-surface-500 truncate", children: conv.lastMessage?.content || "No messages yet" })] }), _jsx("div", { className: "text-right flex-shrink-0", children: _jsx("p", { className: "text-xs text-surface-400", children: conv.lastMessage?.timestamp
                                            ? new Date(conv.lastMessage.timestamp).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })
                                            : "" }) })] }) }, conv.conversationId))) })) : (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center py-12 px-4", children: [_jsx("div", { className: "text-4xl mb-3", children: "\uD83D\uDCAC" }), _jsx("p", { className: "text-surface-600 font-medium mb-1", children: "No conversations yet" }), _jsx("p", { className: "text-sm text-surface-400 mb-4", children: "Start a conversation by clicking \"New Chat\"" }), _jsx("button", { onClick: loadAvailableUsers, disabled: loadingUsers, className: "btn-primary text-sm", children: loadingUsers ? "Loading..." : "Start chatting" })] })) })] }));
}
