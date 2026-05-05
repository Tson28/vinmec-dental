import { useState, useEffect } from "react";
import { conversationApi } from "../../services/api";
import { useToast } from "../../hooks/useToast";
import type { User } from "../../types";

interface Conversation {
  id: string;
  conversationId: string;
  otherUser: User;
  lastMessage?: {
    content: string;
    timestamp: string;
  };
  messageCount: number;
  updatedAt: string;
}

interface Props {
  onSelectConversation: (conversationId: string, otherUser: User) => void;
  loading?: boolean;
}

export default function ConversationList({
  onSelectConversation,
  loading,
}: Props) {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
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
    } catch (error) {
      console.error("Failed to load conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadAvailableUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await conversationApi.getAvailableUsers();
      const users = res.data?.data || res.data || [];
      setAvailableUsers(Array.isArray(users) ? users : []);
      setShowUserList(true);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSelectUser = async (user: User) => {
    try {
      const res = await conversationApi.findOrCreate(user._id || user.id);
      const conversation = res.data?.data;
      if (conversation) {
        onSelectConversation(
          conversation.conversationId || conversation.id,
          user,
        );
        setShowUserList(false);
        setSearchTerm("");
        await loadConversations();
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
      toast.error("Failed to start conversation");
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    onSelectConversation(conversation.conversationId, conversation.otherUser);
  };

  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-surface-100 shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-surface-100 bg-gradient-to-r from-dental-50 to-mint-50">
        <h3 className="font-bold text-surface-900 mb-3">Messages</h3>
        <button
          onClick={loadAvailableUsers}
          className="w-full btn-primary text-sm py-2"
          disabled={loadingUsers}
        >
          {loadingUsers ? "Loading..." : "+ New Chat"}
        </button>
      </div>

      {/* New Chat Modal */}
      {showUserList && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full max-h-96 flex flex-col">
            <div className="px-4 py-3 border-b border-surface-100 flex items-center justify-between">
              <h4 className="font-bold text-surface-900">Select contact</h4>
              <button
                onClick={() => setShowUserList(false)}
                className="text-surface-400 hover:text-surface-600 text-xl"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input m-3 mb-0"
            />

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <button
                    key={user._id || user.id}
                    onClick={() => handleSelectUser(user)}
                    className="w-full text-left p-3 rounded-lg hover:bg-surface-100 transition flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-dental flex items-center justify-center text-white font-bold flex-shrink-0">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        user.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-surface-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-surface-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-surface-300 group-hover:text-dental-600 transition"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-surface-500 text-sm">
                  {searchTerm ? "No users found" : "No available users"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loadingConversations ? (
          <div className="flex items-center justify-center h-full text-surface-500">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-dental-400 border-t-dental-600 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm">Loading conversations...</p>
            </div>
          </div>
        ) : conversations.length > 0 ? (
          <div className="space-y-1 p-2">
            {conversations.map((conv) => (
              <button
                key={conv.conversationId}
                onClick={() => handleSelectConversation(conv)}
                className="w-full text-left p-3 rounded-lg hover:bg-surface-100 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-dental flex items-center justify-center text-white font-bold flex-shrink-0">
                    {conv.otherUser.avatar ? (
                      <img
                        src={conv.otherUser.avatar}
                        alt={conv.otherUser.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      conv.otherUser.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-surface-900">
                      {conv.otherUser.name}
                    </p>
                    <p className="text-xs text-surface-500 truncate">
                      {conv.lastMessage?.content || "No messages yet"}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-surface-400">
                      {conv.lastMessage?.timestamp
                        ? new Date(
                            conv.lastMessage.timestamp,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-surface-600 font-medium mb-1">
              No conversations yet
            </p>
            <p className="text-sm text-surface-400 mb-4">
              Start a conversation by clicking "New Chat"
            </p>
            <button
              onClick={loadAvailableUsers}
              className="btn-primary text-sm"
            >
              Start chatting
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
