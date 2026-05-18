import { useState } from "react";
import { Link } from "react-router-dom";
import { chatApi } from "../services/api";
import type { ChatMessage } from "../types";
import ChatInterface from "../components/chat/ChatInterface";

export default function PublicChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (content: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    try {
      const res = await chatApi.publicChat(content);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          res.data?.data?.reply ||
          res.data?.reply ||
          res.data?.message ||
          "Thank you for your question. For detailed dental advice, please consult one of our doctors.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm having trouble connecting right now. Please try again or log in for full support.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dental-900 via-dental-800 to-mint-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-dental-600 flex items-center justify-center text-white text-lg">
            🤖
          </div>
          <div>
            <p className="font-display font-bold text-white text-sm">VinaMec</p>
            <p className="text-white/70 text-xs">Public Dental AI</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="btn-secondary text-sm">
            Sign In
          </Link>
          <Link to="/register" className="btn-primary text-sm">
            Register
          </Link>
        </div>
      </header>

      {/* Chat */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-4 flex flex-col">
        <div className="mb-4 px-4 py-3 bg-surface-900 backdrop-blur rounded-xl border border-surface-700 text-sm text-white flex items-center gap-2">
          <span>ℹ️</span>
          <span>
            Public chat – for personalized advice and full features, please{" "}
            <Link
              to="/login"
              className="underline font-semibold text-yellow-300"
            >
              login
            </Link>
            .
          </span>
        </div>
        <div className="flex-1" style={{ minHeight: "60vh" }}>
          <ChatInterface
            messages={messages}
            onSend={handleSend}
            loading={loading}
            isPublic
            title="Public Dental AI Assistant"
          />
        </div>
      </div>
    </div>
  );
}
