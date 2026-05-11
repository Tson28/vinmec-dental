import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ChatMessage, { type Message } from "../../components/chat/ChatMessage";
import ConversationList from "../../components/chat/ConversationList";
import {
  conversationApi,
  imageApi,
  appointmentApi,
  chatApi,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import type { User, Appointment, ChatMessage as ChatMsg } from "../../types";

export default function PatientChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isChatbot, setIsChatbot] = useState(false);
  const [chatbotHistory, setChatbotHistory] = useState<ChatMsg[]>([]);

  // Check appointments on mount
  useEffect(() => {
    checkTodayAppointments();
  }, [toast]);

  const checkTodayAppointments = async () => {
    try {
      const res = await appointmentApi.getMine();
      const appointments: Appointment[] = res.data?.data || [];
      const today = new Date().toISOString().split("T")[0];

      const todayAppointments = appointments.filter(
        (apt) => apt.date === today,
      );

      if (todayAppointments.length > 0) {
        const appointmentsList = todayAppointments
          .map((apt) => `${apt.doctorName} - ${apt.time}`)
          .join(", ");
        toast.info(
          `🗓️ Hôm nay bạn có ${todayAppointments.length} lịch khám: ${appointmentsList}`,
          5000,
        );
      }
    } catch (error) {
      console.error("Failed to check appointments:", error);
    }
  };

  const handleSelectConversation = async (
    conversationId: string,
    otherUser: User,
  ) => {
    setSelectedConversation(conversationId);
    setSelectedUser(otherUser);
    await loadConversationMessages(conversationId, otherUser.name || "Doctor");
  };

  const loadConversationMessages = async (
    conversationId: string,
    senderName?: string,
  ) => {
    try {
      setLoading(true);
      const res = await conversationApi.getById(conversationId);
      const data = res.data?.data;
      const rawMessages = data?.messages || [];

      const formattedMessages = rawMessages.map((msg: any, idx: number) => ({
        id: msg._id || `${idx}-${Date.now()}`,
        sender: {
          id: msg.sender?._id || msg.sender?.id || msg.sender,
          name: msg.sender?.name || "Unknown",
          avatar: msg.sender?.avatar,
        },
        type: (msg.type || "text") as "text" | "image" | "audio",
        content: msg.content,
        imageUrl: msg.imageUrl,
        audioUrl: msg.audioUrl,
        timestamp: msg.timestamp || msg.createdAt || new Date().toISOString(),
        isOwn:
          msg.sender?._id?.toString() === user?._id?.toString() ||
          msg.sender?.toString() === user?._id?.toString() ||
          msg.sender === user?._id,
      }));

      setMessages(formattedMessages);

      // Check for new messages from other user
      const hasNewMessages = rawMessages.some(
        (msg: any) =>
          msg.sender?._id?.toString() !== user?._id?.toString() &&
          msg.sender?.toString() !== user?._id?.toString() &&
          msg.sender !== user?._id,
      );

      if (hasNewMessages && senderName) {
        const lastMessage = rawMessages[rawMessages.length - 1];
        if (
          lastMessage.sender?._id?.toString() !== user?._id?.toString() &&
          lastMessage.sender?.toString() !== user?._id?.toString() &&
          lastMessage.sender !== user?._id
        ) {
          const preview = lastMessage.content
            ? lastMessage.content.substring(0, 50)
            : lastMessage.type === "image"
              ? "📸 Hình ảnh"
              : lastMessage.type === "audio"
                ? "🎙️ Tin nhắn thoại"
                : "Tin nhắn";
          toast.info(`💬 ${senderName}: ${preview}`);
        }
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChatbot = () => {
    setSelectedConversation("chatbot");
    setSelectedUser(null);
    setIsChatbot(true);
    setMessages([]);
    setChatbotHistory([]);
  };

  const handleSendText = async (content: string) => {
    if (!selectedConversation || !user) return;

    if (isChatbot) {
      // Handle chatbot conversation
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

      const newHistory: ChatMsg[] = [
        ...chatbotHistory,
        {
          id: Date.now().toString(),
          role: "user",
          content,
          timestamp: new Date().toISOString(),
        },
      ];
      setChatbotHistory(newHistory);

      try {
        setLoading(true);
        const res = await chatApi.privateChat(
          content,
          newHistory.map((h) => ({ role: h.role, content: h.content })),
        );
        const aiResponse =
          res.data?.reply ||
          "Xin lỗi, tôi không thể trả lời câu hỏi này. Vui lòng thử lại.";

        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: {
            id: "ai-assistant",
            name: "AI Assistant",
            avatar: undefined,
          },
          type: "text",
          content: aiResponse,
          timestamp: new Date().toISOString(),
          isOwn: false,
        };
        setMessages((prev) => [...prev, aiMsg]);

        setChatbotHistory([
          ...newHistory,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: aiResponse,
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch (error) {
        console.error("Failed to chat with AI:", error);
        toast.error("Lỗi giao tiếp với AI. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    } else {
      // Handle doctor conversation
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

      try {
        await conversationApi.sendMessage(selectedConversation, {
          content,
          type: "text",
        });
      } catch (error) {
        console.error("Failed to send message:", error);
        toast.error("Failed to send message");
      }
    }
  };

  const handleSendImage = async (file: File) => {
    if (!selectedConversation || !user) return;

    if (isChatbot) {
      toast.info("Gửi hình ảnh không hỗ trợ cho AI chatbot");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);

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

      await conversationApi.sendMessage(selectedConversation, {
        content: "Image",
        type: "image",
        imageUrl,
      });
      toast.success("Image sent successfully");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleSendAudio = async (file: File) => {
    if (!selectedConversation || !user) return;

    if (isChatbot) {
      toast.info("Gửi tin nhắn thoại không hỗ trợ cho AI chatbot");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("audio", file);

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

      await conversationApi.sendMessage(selectedConversation, {
        content: "Voice message",
        type: "audio",
        audioUrl,
      });
      toast.success("Voice message sent successfully");
    } catch (error) {
      console.error("Audio upload error:", error);
      toast.error("Failed to send voice message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Chat">
      <div className="h-[calc(100vh-160px)] flex gap-4">
        {/* Conversation List */}
        <div className="w-80 flex-shrink-0">
          <ConversationList
            onSelectConversation={handleSelectConversation}
            onSelectChatbot={handleSelectChatbot}
            loading={loading}
            isChatbotSelected={isChatbot}
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1 min-w-0">
          {isChatbot ? (
            <ChatMessage
              messages={messages}
              onSendText={handleSendText}
              onSendImage={handleSendImage}
              onSendAudio={handleSendAudio}
              loading={loading}
              title="Trợ lý Nha khoa AI"
              placeholder="Hỏi tôi về sức khỏe răng của bạn..."
            />
          ) : selectedConversation && selectedUser ? (
            <ChatMessage
              messages={messages}
              onSendText={handleSendText}
              onSendImage={handleSendImage}
              onSendAudio={handleSendAudio}
              loading={loading}
              title={`Chat with ${selectedUser.name || "Doctor"}`}
              placeholder="Type a message..."
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-xl border border-surface-100 shadow-card">
              <div className="text-5xl mb-4">💬</div>
              <p className="text-surface-600 font-medium mb-2">
                Select a conversation
              </p>
              <p className="text-sm text-surface-400">
                Choose a doctor from the list or chat with AI assistant
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
