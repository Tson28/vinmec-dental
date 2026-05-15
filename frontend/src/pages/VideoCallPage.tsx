import { useState, useRef } from "react";
import DoctorSidebar from "../components/layout/DoctorSidebar";
import PatientSidebar from "../components/layout/PatientSidebar";
import { useAuth } from "../context/AuthContext";
import { useVideoCall } from "../hooks/useVideoCall";

function formatDuration(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// ─── Incoming call modal ──────────────────────────────────────────────────────
function IncomingCallModal({ callerName, onAccept, onReject }: { callerName: string; onAccept: () => void; onReject: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-6 w-80 animate-bounce-in">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-dental-400 to-dental-600 flex items-center justify-center text-4xl shadow-lg">📞</div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">{callerName}</p>
          <p className="text-sm text-gray-500 mt-1">Đang gọi cho bạn...</p>
        </div>
        <div className="flex gap-4">
          <button onClick={onReject} className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white text-2xl flex items-center justify-center shadow-lg transition-all hover:scale-110">📵</button>
          <button onClick={onAccept} className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-2xl flex items-center justify-center shadow-lg transition-all hover:scale-110 animate-pulse">📞</button>
        </div>
      </div>
    </div>
  );
}

// ─── User picker ──────────────────────────────────────────────────────────────
function UserPicker({ users, onCall, disabled }: { users: any[]; onCall: (id: string, name: string) => void; disabled: boolean }) {
  if (users.length === 0) {
    return (
      <div className="card text-center py-8 text-gray-400">
        <div className="text-3xl mb-2">👥</div>
        <p className="text-sm">Không có người dùng trực tuyến</p>
      </div>
    );
  }
  return (
    <div className="card">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
        Người dùng trực tuyến ({users.length})
      </h3>
      <div className="space-y-2">
        {users.map(u => (
          <div key={u.userId} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${u.inCall ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-200 hover:bg-dental-50 hover:border-dental-200"}`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-dental-400 to-dental-600 flex items-center justify-center text-white font-bold text-sm">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">{u.name}</p>
                <p className={`text-xs ${u.inCall ? "text-amber-600" : "text-emerald-600"}`}>
                  {u.inCall ? "🔴 Đang trong cuộc gọi" : "🟢 Sẵn sàng"}
                </p>
              </div>
            </div>
            {u.inCall ? (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Đang bận</span>
            ) : (
              <button
                onClick={() => onCall(u.userId, u.name)}
                disabled={disabled}
                className="px-3 py-1.5 bg-dental-500 hover:bg-dental-600 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
              >
                📹 Gọi
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Voice to text ────────────────────────────────────────────────────────────
function VoiceToText() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggle = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Trình duyệt không hỗ trợ nhận dạng giọng nói"); return; }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = "vi-VN";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      setTranscript(text);
    };
    rec.onend = () => setListening(false);
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">🎙️ Voice to Text</h3>
        <button onClick={toggle} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${listening ? "bg-red-500 text-white animate-pulse" : "bg-dental-500 text-white hover:bg-dental-600"}`}>
          {listening ? "⏹ Dừng" : "▶ Bắt đầu"}
        </button>
      </div>
      <div className="min-h-16 p-3 bg-gray-50 rounded-xl border text-sm text-gray-700 relative">
        {transcript || <span className="text-gray-400">Nhấn "Bắt đầu" rồi nói...</span>}
        {transcript && (
          <button onClick={() => setTranscript("")} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xs">✕</button>
        )}
      </div>
      {transcript && (
        <button onClick={() => navigator.clipboard.writeText(transcript)} className="mt-2 text-xs text-dental-600 hover:underline">📋 Sao chép</button>
      )}
    </div>
  );
}

// ─── Photo gallery ────────────────────────────────────────────────────────────
function PhotoGallery({ photos, onClose }: { photos: string[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl p-4 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">📸 Ảnh đã chụp ({photos.length})</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {photos.map((src, i) => (
            <div key={i} className="relative group">
              <img src={src} className="w-full rounded-xl object-cover" alt={`snapshot-${i}`} />
              <a href={src} download={`snapshot-${i + 1}.png`} className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-dental-500 text-white text-xs px-2 py-1 rounded-lg transition-all">⬇ Tải</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function VideoCallPage() {
  const { user } = useAuth();
  const isDoctor = user?.role === "doctor" || user?.role === "admin";

  const {
    localVideoRef, remoteVideoRef,
    callState, onlineUsers,
    micOn, camOn, duration, error, busyNotice,
    callUser, acceptCall, rejectCall, endCall,
    toggleMic, toggleCam, capturePhoto,
    setError, setBusyNotice,
  } = useVideoCall();

  const [photos, setPhotos] = useState<string[]>([]);
  const [showGallery, setShowGallery] = useState(false);

  const handleCapture = () => {
    const dataUrl = capturePhoto();
    if (dataUrl) setPhotos(prev => [...prev, dataUrl]);
  };

  const isInCall = callState.status === "connected" || callState.status === "connecting";
  const isBusy = isInCall || callState.status === "calling" || callState.status === "incoming";

  return (
    <div className="flex">
      {isDoctor ? <DoctorSidebar /> : <PatientSidebar />}
      <div className="flex-1 ml-64">

        {/* Incoming call modal */}
        {callState.status === "incoming" && (
          <IncomingCallModal
            callerName={callState.callerName || "Người dùng"}
            onAccept={acceptCall}
            onReject={rejectCall}
          />
        )}

        {/* Photo gallery */}
        {showGallery && <PhotoGallery photos={photos} onClose={() => setShowGallery(false)} />}

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📹 Video Call</h1>
            <p className="text-sm text-gray-500 mt-0.5">Tư vấn nha khoa qua video bảo mật WebRTC</p>
          </div>
          <div className="flex items-center gap-3">
            {photos.length > 0 && (
              <button onClick={() => setShowGallery(true)} className="px-3 py-1.5 bg-dental-50 border border-dental-200 text-dental-700 rounded-xl text-sm font-semibold hover:bg-dental-100 transition-all flex items-center gap-1.5">
                📸 {photos.length} ảnh
              </button>
            )}
            {callState.status === "connected" && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold text-emerald-700">{formatDuration(duration)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Error / busy notices */}
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center justify-between">
              <span>⚠️ {error}</span>
              <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">✕</button>
            </div>
          )}
          {busyNotice && (
            <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 flex items-center justify-between">
              <span>🔴 {busyNotice}</span>
              <button onClick={() => setBusyNotice("")} className="text-amber-400 hover:text-amber-600">✕</button>
            </div>
          )}
          {callState.status === "calling" && (
            <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700 flex items-center gap-3">
              <div className="flex gap-1">
                {[0, 150, 300].map(d => (
                  <div key={d} className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
              Đang gọi cho <strong>{callState.remoteUserName}</strong>...
              <button onClick={endCall} className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-1 rounded-lg hover:bg-red-200">Hủy</button>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left: Videos + Controls */}
            <div className="xl:col-span-2 space-y-4">
              {/* Video grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Remote video */}
                <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
                  <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  {!isInCall && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-4xl mb-3">
                        {isDoctor ? "👤" : "👨‍⚕️"}
                      </div>
                      <p className="font-semibold">{callState.remoteUserName || (isDoctor ? "Bệnh nhân" : "Bác sĩ")}</p>
                      <p className="text-white/60 text-sm mt-1">
                        {callState.status === "idle" && "Chờ kết nối..."}
                        {callState.status === "ended" && "Cuộc gọi đã kết thúc"}
                      </p>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/50 rounded-lg text-white text-xs font-semibold backdrop-blur-sm">
                    {callState.remoteUserName || (isDoctor ? "👤 Bệnh nhân" : "👨‍⚕️ Bác sĩ")}
                  </div>
                </div>

                {/* Local video */}
                <div className="relative aspect-video bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
                  <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                  {!isInCall && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-4xl mb-3">
                        {isDoctor ? "👨‍⚕️" : "👤"}
                      </div>
                      <p className="font-semibold">{user?.name || "Bạn"}</p>
                      <p className="text-white/60 text-sm mt-1">Camera chưa bật</p>
                    </div>
                  )}
                  {!camOn && isInCall && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <span className="text-4xl">📵</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/50 rounded-lg text-white text-xs font-semibold backdrop-blur-sm">
                    {isDoctor ? "👨‍⚕️ Bác sĩ (Bạn)" : "👤 Bạn"}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="card flex items-center justify-center gap-4">
                {isInCall ? (
                  <>
                    <button onClick={toggleMic} title={micOn ? "Tắt mic" : "Bật mic"}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all shadow ${micOn ? "bg-gray-100 hover:bg-gray-200" : "bg-red-100 text-red-600 hover:bg-red-200"}`}>
                      {micOn ? "🎙️" : "🔇"}
                    </button>
                    <button onClick={toggleCam} title={camOn ? "Tắt camera" : "Bật camera"}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all shadow ${camOn ? "bg-gray-100 hover:bg-gray-200" : "bg-red-100 text-red-600 hover:bg-red-200"}`}>
                      {camOn ? "📷" : "📵"}
                    </button>
                    <button onClick={handleCapture} title="Chụp ảnh"
                      className="w-14 h-14 rounded-2xl bg-dental-100 hover:bg-dental-200 text-dental-700 flex items-center justify-center text-2xl transition-all shadow">
                      📸
                    </button>
                    <button onClick={endCall}
                      className="w-16 h-16 rounded-2xl bg-red-500 hover:bg-red-600 flex items-center justify-center text-2xl text-white transition-all shadow-lg hover:shadow-red-300">
                      📵
                    </button>
                  </>
                ) : (
                  <div className="text-center text-gray-400 py-4">
                    <p className="text-sm">Chọn người dùng bên phải để bắt đầu cuộc gọi</p>
                  </div>
                )}
              </div>

              {/* Voice to text */}
              <VoiceToText />
            </div>

            {/* Right: User picker + info */}
            <div className="space-y-4">
              <UserPicker users={onlineUsers} onCall={callUser} disabled={isBusy} />

              <div className="card bg-dental-50 border-dental-200">
                <h3 className="font-bold text-gray-800 mb-3">ℹ️ Về tư vấn video</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-start gap-2"><span className="text-dental-500">🔒</span> Cuộc gọi mã hóa end-to-end qua WebRTC</p>
                  <p className="flex items-start gap-2"><span className="text-dental-500">⚡</span> Kết nối P2P trực tiếp, độ trễ thấp</p>
                  <p className="flex items-start gap-2"><span className="text-dental-500">📸</span> Chụp ảnh màn hình trong cuộc gọi</p>
                  <p className="flex items-start gap-2"><span className="text-dental-500">🎙️</span> Chuyển giọng nói sang văn bản</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
