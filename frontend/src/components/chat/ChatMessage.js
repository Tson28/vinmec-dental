import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useToast } from "../../hooks/useToast";
export default function ChatMessage({ messages, onSendText, onSendImage, onSendAudio, loading, placeholder, title, }) {
    const { toast } = useToast();
    const [input, setInput] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const endRef = useRef(null);
    const fileInputRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const recordedChunksRef = useRef([]);
    const mediaRecorderRef = useRef(null);
    const timerRef = useRef(null);
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    const handleSendText = async () => {
        if (!input.trim() || loading)
            return;
        const msg = input.trim();
        setInput("");
        await onSendText(msg);
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendText();
        }
    };
    const handleImageSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
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
            setImagePreview(e.target?.result);
        };
        reader.readAsDataURL(file);
        // Upload
        try {
            await onSendImage(file);
            setImagePreview(null);
            if (fileInputRef.current)
                fileInputRef.current.value = "";
        }
        catch (error) {
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
                }
                catch (error) {
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
        }
        catch (error) {
            toast.error("Microphone access denied");
        }
    };
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
            setIsRecording(false);
            if (timerRef.current)
                clearInterval(timerRef.current);
            setRecordingTime(0);
        }
    };
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };
    return (_jsxs("div", { className: "flex flex-col h-full bg-white rounded-2xl border border-surface-100 shadow-card overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-3 px-5 py-4 border-b border-surface-100 bg-gradient-to-r from-dental-50 to-mint-50", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-gradient-dental flex items-center justify-center text-white text-lg shadow-md", children: "\uD83D\uDC68\u200D\u2695\uFE0F" }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-bold text-surface-900", children: title || "Chat" }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse-slow" }), _jsx("span", { className: "text-xs text-emerald-600 font-medium", children: "Online" })] })] })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4 bg-white", children: [messages.length === 0 && (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center py-12", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-gradient-to-br from-dental-400 to-mint-400 flex items-center justify-center text-white text-3xl mb-4 shadow-lg", children: "\uD83D\uDCAC" }), _jsx("p", { className: "font-display font-bold text-lg text-surface-800", children: "Let's Chat!" }), _jsx("p", { className: "text-sm text-surface-400 mt-2 max-w-xs", children: "Start a conversation about your dental health or any concerns." })] })), messages.map((msg) => (_jsxs("div", { className: `flex gap-3 ${msg.isOwn ? "flex-row-reverse" : "flex-row"}`, children: [_jsx("div", { className: "flex-shrink-0 w-8 h-8 rounded-full bg-gradient-dental flex items-center justify-center text-white text-sm font-bold", children: msg.sender.avatar ? (_jsx("img", { src: msg.sender.avatar, alt: msg.sender.name, className: "w-full h-full rounded-full object-cover" })) : (msg.sender.name.charAt(0).toUpperCase()) }), _jsxs("div", { className: `flex flex-col max-w-xs ${msg.isOwn ? "items-end" : "items-start"}`, children: [_jsxs("div", { className: `flex items-center gap-1 mb-1 ${msg.isOwn ? "flex-row-reverse" : "flex-row"}`, children: [_jsx("span", { className: `w-1.5 h-1.5 rounded-full flex-shrink-0 ${msg.isOwn ? "bg-dental-500" : "bg-indigo-400"}` }), _jsx("p", { className: `text-xs font-bold tracking-wide ${msg.isOwn ? "text-dental-600" : "text-indigo-600"}`, children: msg.sender.name })] }), _jsxs("div", { className: `rounded-2xl px-4 py-2.5 ${msg.isOwn ? "bg-dental-600 text-black rounded-br-none" : "bg-surface-100 text-surface-900-black rounded-bl-none"}`, children: [msg.type === "text" && (_jsx("p", { className: "text-sm break-words", children: msg.content })), msg.type === "image" && (_jsx("div", { className: "max-w-xs", children: msg.imageUrl ? (_jsx("img", { src: msg.imageUrl, alt: "Shared image", className: "rounded-lg max-w-full h-auto", onError: (e) => {
                                                        e.target.alt =
                                                            "Image failed to load";
                                                        e.target.style.display = "none";
                                                    } })) : (_jsx("div", { className: "bg-surface-100 rounded-lg p-4 text-center text-sm text-red-500", children: "Image not available" })) })), msg.type === "audio" && (_jsxs("div", { className: "flex items-center gap-2 min-w-[200px]", children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center ${msg.isOwn ? "bg-white/20" : "bg-dental-100"}`, children: _jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { d: "M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" }) }) }), msg.audioUrl ? (_jsx("audio", { controls: true, className: "flex-1 h-6", src: msg.audioUrl, onError: () => console.error("Audio load failed:", msg.audioUrl) })) : (_jsx("span", { className: "text-xs text-red-500", children: "File not available" }))] }))] }), _jsx("p", { className: `text-xs text-black mt-1 ${msg.isOwn ? "text-right" : ""}`, children: new Date(msg.timestamp).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }) })] })] }, msg.id))), loading && (_jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-dental flex items-center justify-center text-white text-sm flex-shrink-0", children: "\uD83D\uDC68\u200D\u2695\uFE0F" }), _jsxs("div", { className: "bg-surface-100 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-surface-400 animate-bounce", style: { animationDelay: "0ms" } }), _jsx("div", { className: "w-2 h-2 rounded-full bg-surface-400 animate-bounce", style: { animationDelay: "150ms" } }), _jsx("div", { className: "w-2 h-2 rounded-full bg-surface-400 animate-bounce", style: { animationDelay: "300ms" } })] })] })), _jsx("div", { ref: endRef })] }), imagePreview && (_jsxs("div", { className: "px-4 py-3 border-t border-surface-100 bg-surface-50 flex items-center gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx("img", { src: imagePreview, alt: "preview", className: "h-14 w-14 object-cover rounded-lg" }), _jsx("button", { onClick: () => setImagePreview(null), className: "absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600", children: "\u2715" })] }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-xs font-medium text-surface-600", children: "S\u1EB5n s\u00E0ng g\u1EEDi h\u00ECnh \u1EA3nh" }), _jsx("p", { className: "text-xs text-surface-400", children: "Nh\u1EA5n g\u1EEDi \u0111\u1EC3 chia s\u1EBB h\u00ECnh \u1EA3nh n\u00E0y" })] })] })), isRecording && (_jsxs("div", { className: "px-4 py-3 border-t border-surface-100 bg-red-50 flex items-center gap-3 animate-pulse", children: [_jsx("div", { className: "w-3 h-3 rounded-full bg-red-500 animate-pulse" }), _jsxs("span", { className: "text-sm font-medium text-red-600", children: ["\u0110ang ghi \u00E2m... ", formatTime(recordingTime)] })] })), _jsx("div", { className: "px-4 py-3 border-t border-surface-100 bg-white", children: _jsxs("div", { className: "flex gap-2 items-end rounded-full bg-surface-50 px-3 py-2 hover:bg-surface-100 transition", children: [_jsx("button", { onClick: () => fileInputRef.current?.click(), className: "flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-200 transition text-dental-600 flex-shrink-0", title: "Upload image", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }) }), _jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleImageSelect, className: "hidden" }), _jsx("textarea", { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: handleKeyDown, placeholder: placeholder || "Nhắn...", rows: 1, className: "input resize-none flex-1 min-h-[36px] max-h-24 overflow-y-auto bg-surface-50 border-0 px-2 py-1 text-sm focus:outline-none" }), _jsx("button", { onMouseDown: startRecording, onMouseUp: stopRecording, onTouchStart: startRecording, onTouchEnd: stopRecording, className: `flex items-center justify-center w-9 h-9 rounded-full transition flex-shrink-0 ${isRecording
                                ? "bg-red-500 text-white"
                                : "hover:bg-surface-200 text-dental-600"}`, title: "Hold to record voice message", children: _jsxs("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { d: "M12 1a4 4 0 00-4 4v6a4 4 0 008 0V5a4 4 0 00-4-4z" }), _jsx("path", { d: "M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.93V20H9a1 1 0 000 2h6a1 1 0 000-2h-2v-2.07A7 7 0 0019 11z" })] }) }), _jsx("button", { onClick: async () => {
                                if (imagePreview) {
                                    const fileInput = fileInputRef.current;
                                    if (fileInput?.files?.[0]) {
                                        await onSendImage(fileInput.files[0]);
                                        setImagePreview(null);
                                        if (fileInputRef.current)
                                            fileInputRef.current.value = "";
                                    }
                                }
                                else {
                                    await handleSendText();
                                }
                            }, disabled: (!input.trim() && !imagePreview) || loading, className: `flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 flex-shrink-0 shadow-sm border cursor-pointer ${(!input.trim() && !imagePreview) || loading
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-dental-600 hover:bg-dental-700 text-white border-dental-600 hover:shadow active:scale-95"}`, title: "G\u1EEDi tin nh\u1EAFn", children: _jsx("svg", { className: "w-5 h-5 transform rotate-45 -translate-x-0.5 -translate-y-0.5", fill: "none", stroke: "currentColor", strokeWidth: "2.5", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" }) }) })] }) })] }));
}
