import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import { useToast } from "../../hooks/useToast";

export interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  type: "text" | "image" | "audio";
  content?: string;
  imageUrl?: string;
  audioUrl?: string;
  audioName?: string;
  timestamp: string;
  isOwn?: boolean;
}

interface Props {
  messages: Message[];
  onSendText: (text: string) => Promise<void>;
  onSendImage: (file: File) => Promise<void>;
  onSendAudio: (file: File) => Promise<void>;
  loading?: boolean;
  placeholder?: string;
  title?: string;
}

export default function ChatMessage({
  messages,
  onSendText,
  onSendImage,
  onSendAudio,
  loading,
  placeholder,
  title,
}: Props) {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendText = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");
    await onSendText(msg);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    try {
      await onSendImage(file);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        recordedChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "audio/webm",
        });
        const file = new File([blob], `voice-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        try {
          await onSendAudio(file);
        } catch (error) {
          toast.error("Failed to send voice message");
        }
        recordedChunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Recording timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-surface-100 shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-100 bg-gradient-to-r from-dental-50 to-mint-50">
        <div className="w-12 h-12 rounded-full bg-gradient-dental flex items-center justify-center text-white text-lg shadow-md">
          👨‍⚕️
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-surface-900">{title || "Chat"}</h3>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-slow"></div>
            <span className="text-xs text-emerald-600 font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-dental-400 to-mint-400 flex items-center justify-center text-white text-3xl mb-4 shadow-lg">
              💬
            </div>
            <p className="font-display font-bold text-lg text-surface-800">
              Let's Chat!
            </p>
            <p className="text-sm text-surface-400 mt-2 max-w-xs">
              Start a conversation about your dental health or any concerns.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-dental flex items-center justify-center text-white text-sm font-bold">
              {msg.sender.avatar ? (
                <img
                  src={msg.sender.avatar}
                  alt={msg.sender.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                msg.sender.name.charAt(0).toUpperCase()
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`flex flex-col max-w-xs ${msg.isOwn ? "items-end" : "items-start"}`}
            >
              <div
                className={`flex items-center gap-1 mb-1 ${msg.isOwn ? "flex-row-reverse" : "flex-row"}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    msg.isOwn ? "bg-dental-500" : "bg-indigo-400"
                  }`}
                />
                <p
                  className={`text-xs font-bold tracking-wide ${
                    msg.isOwn ? "text-dental-600" : "text-indigo-600"
                  }`}
                >
                  {msg.sender.name}
                </p>
              </div>

              <div
                className={`rounded-2xl px-4 py-2.5 ${msg.isOwn ? "bg-dental-600 text-black rounded-br-none" : "bg-surface-100 text-black rounded-bl-none"}`}
              >
                {msg.type === "text" && (
                  <p className="text-sm break-words">{msg.content}</p>
                )}

                {msg.type === "image" && (
                  <div className="max-w-xs">
                    {msg.imageUrl ? (
                      <img
                        src={msg.imageUrl}
                        alt="Shared image"
                        className="rounded-lg max-w-full h-auto"
                        onError={(e) => {
                          (e.target as HTMLImageElement).alt =
                            "Image failed to load";
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="bg-surface-100 rounded-lg p-4 text-center text-sm text-red-500">
                        Image not available
                      </div>
                    )}
                  </div>
                )}

                {msg.type === "audio" && (
                  <div className="flex items-center gap-2 min-w-[200px]">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.isOwn ? "bg-white/20" : "bg-dental-100"}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                    {msg.audioUrl ? (
                      <audio
                        controls
                        className="flex-1 h-6"
                        src={msg.audioUrl}
                        onError={() =>
                          console.error("Audio load failed:", msg.audioUrl)
                        }
                      />
                    ) : (
                      <span className="text-xs text-red-500">
                        File not available
                      </span>
                    )}
                  </div>
                )}
              </div>

              <p
                className={`text-xs text-black mt-1 ${msg.isOwn ? "text-right" : ""}`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-dental flex items-center justify-center text-white text-sm flex-shrink-0">
              👨‍⚕️
            </div>
            <div className="bg-surface-100 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full bg-surface-400 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-surface-400 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-surface-400 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="px-4 py-2 border-t border-surface-100 bg-surface-50 flex items-center gap-3">
          <div className="relative">
            <img
              src={imagePreview}
              alt="preview"
              className="h-16 w-16 object-cover rounded-lg"
            />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-surface-600">
              Image ready to send
            </p>
            <p className="text-xs text-surface-400">
              Click send to share this image
            </p>
          </div>
        </div>
      )}

      {/* Recording Indicator */}
      {isRecording && (
        <div className="px-4 py-3 border-t border-surface-100 bg-red-50 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-sm font-medium text-red-600">
            Recording... {formatTime(recordingTime)}
          </span>
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 py-3 border-t border-surface-100 bg-white">
        <div className="flex gap-2 items-end">
          {/* Image Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-100 transition text-dental-600"
            title="Upload image"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          {/* Text Input */}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Type a message..."}
            rows={1}
            className="input resize-none flex-1 min-h-[40px] max-h-24 overflow-y-auto"
          />

          {/* Voice Record Button */}
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition ${
              isRecording
                ? "bg-red-500 text-white"
                : "hover:bg-surface-100 text-dental-600"
            }`}
            title="Hold to record voice message"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1a4 4 0 00-4 4v6a4 4 0 008 0V5a4 4 0 00-4-4z" />
              <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.93V20H9a1 1 0 000 2h6a1 1 0 000-2h-2v-2.07A7 7 0 0019 11z" />
            </svg>
          </button>

          {/* Send Button */}
          <button
            onClick={async () => {
              if (imagePreview) {
                const fileInput = fileInputRef.current;
                if (fileInput?.files?.[0]) {
                  await onSendImage(fileInput.files[0]);
                  setImagePreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }
              } else {
                await handleSendText();
              }
            }}
            disabled={(!input.trim() && !imagePreview) || loading}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-dental-600 text-white hover:bg-dental-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
