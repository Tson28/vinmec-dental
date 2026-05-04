import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ChatMessage, { type Message } from "../../components/chat/ChatMessage";
import { chatApi, imageApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import { useApi } from "../../hooks/useApi";
import type { DentalImage } from "../../types";

export default function DoctorChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: allImages } = useApi<DentalImage[]>(() => imageApi.getAll());
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "gallery">("chat");

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const res = await chatApi.getHistory();
      const hist = res.data?.data || res.data || [];
      if (Array.isArray(hist)) {
        const formattedMessages = hist.map((msg) => ({
          id: msg.id || Date.now().toString(),
          sender: {
            id: msg.senderId || "ai",
            name: msg.senderName || "AI Assistant",
            avatar: msg.senderAvatar,
          },
          type: msg.type || ("text" as const),
          content: msg.content,
          imageUrl: msg.imageUrl,
          audioUrl: msg.audioUrl,
          timestamp: msg.timestamp || new Date().toISOString(),
          isOwn: msg.senderId === user?.id || msg.senderId === user?._id,
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  const handleSendText = async (content: string) => {
    if (!user) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: {
        id: user._id || user.id || "unknown",
        name: user.name || "You",
        avatar: user.avatar,
      },
      type: "text",
      content,
      timestamp: new Date().toISOString(),
      isOwn: true,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.isOwn ? "user" : "assistant",
        content: m.content || m.audioUrl || m.imageUrl || "",
      }));
      const res = await chatApi.privateChat(content, history);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: {
          id: "ai-assistant",
          name: "AI Clinical Assistant",
        },
        type: "text",
        content:
          res.data?.reply ||
          res.data?.message ||
          "I understand. Based on the clinical context, here is my recommendation...",
        timestamp: new Date().toISOString(),
        isOwn: false,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleSendImage = async (file: File) => {
    if (!user) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await imageApi.upload(formData);
      const imageUrl = res.data?.data?.url || res.data?.url;

      if (!imageUrl) {
        throw new Error("No image URL returned");
      }

      const userMsg: Message = {
        id: Date.now().toString(),
        sender: {
          id: user._id || user.id || "unknown",
          name: user.name || "You",
          avatar: user.avatar,
        },
        type: "image",
        imageUrl,
        timestamp: new Date().toISOString(),
        isOwn: true,
      };
      setMessages((prev) => [...prev, userMsg]);
      toast.success("Image sent successfully");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleSendAudio = async (file: File) => {
    if (!user) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await imageApi.upload(formData);
      const audioUrl = res.data?.data?.url || res.data?.url;

      if (!audioUrl) {
        throw new Error("No audio URL returned");
      }

      const userMsg: Message = {
        id: Date.now().toString(),
        sender: {
          id: user._id || user.id || "unknown",
          name: user.name || "You",
          avatar: user.avatar,
        },
        type: "audio",
        audioUrl,
        audioName: file.name,
        timestamp: new Date().toISOString(),
        isOwn: true,
      };
      setMessages((prev) => [...prev, userMsg]);
      toast.success("Voice message sent successfully");
    } catch (error) {
      console.error("Audio upload error:", error);
      toast.error("Failed to send voice message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Chat & Gallery">
      <div className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-surface-200">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-3 font-medium text-sm transition ${
              activeTab === "chat"
                ? "border-b-2 border-dental-600 text-dental-600"
                : "text-surface-500 hover:text-surface-700"
            }`}
          >
            💬 Chat
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-4 py-3 font-medium text-sm transition ${
              activeTab === "gallery"
                ? "border-b-2 border-dental-600 text-dental-600"
                : "text-surface-500 hover:text-surface-700"
            }`}
          >
            📷 Patient Images ({allImages?.length || 0})
          </button>
        </div>

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="h-[calc(100vh-280px)]">
            <ChatMessage
              messages={messages}
              onSendText={handleSendText}
              onSendImage={handleSendImage}
              onSendAudio={handleSendAudio}
              loading={loading}
              title="Private Clinical AI Assistant"
              placeholder="Ask about diagnosis, treatment protocols, medications..."
            />
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-surface-800 mb-4">
                Patient Dental Images
              </h3>
              {allImages && allImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {allImages.map((image) => (
                    <div
                      key={image.id}
                      className="group relative rounded-xl overflow-hidden shadow-card hover:shadow-lg transition bg-white"
                    >
                      <img
                        src={image.url}
                        alt={image.description || "Dental image"}
                        className="w-full h-48 object-cover group-hover:scale-105 transition"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-end">
                        <div className="w-full p-3 bg-gradient-to-t from-black/60 to-transparent text-white opacity-0 group-hover:opacity-100 transition">
                          <p className="text-xs font-medium truncate">
                            {image.patientName || "Anonymous"}
                          </p>
                          {image.description && (
                            <p className="text-xs line-clamp-2 mt-1">
                              {image.description}
                            </p>
                          )}
                          <p className="text-xs text-white/70 mt-2">
                            {new Date(image.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card text-center py-12">
                  <div className="text-5xl mb-4">📷</div>
                  <p className="text-surface-600 font-medium mb-2">
                    No patient images
                  </p>
                  <p className="text-surface-400 text-sm">
                    Images from your patients will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
