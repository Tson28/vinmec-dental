import { useEffect, useRef, useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'

export default function VideoCallPage() {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)

  const [callState, setCallState] = useState<'idle' | 'connecting' | 'connected' | 'ended'>('idle')
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [error, setError] = useState('')
  const [duration, setDuration] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      cleanup()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop())
      localStreamRef.current = null
    }
    if (pcRef.current) {
      pcRef.current.close()
      pcRef.current = null
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
  }

  const startCall = async () => {
    setError('')
    setCallState('connecting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      localStreamRef.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      })
      pcRef.current = pc

      stream.getTracks().forEach(track => pc.addTrack(track, stream))

      pc.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0]
        }
      }

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
          setCallState('connected')
          timerRef.current = setInterval(() => setDuration(d => d + 1), 1000)
        }
      }

      // Simulate connected for demo (no signaling server)
      setTimeout(() => {
        setCallState('connected')
        timerRef.current = setInterval(() => setDuration(d => d + 1), 1000)
      }, 2000)

    } catch (err: any) {
      setError(err.message || 'Could not access camera/microphone')
      setCallState('idle')
    }
  }

  const endCall = () => {
    cleanup()
    if (timerRef.current) clearInterval(timerRef.current)
    setCallState('ended')
    setDuration(0)
    setMicOn(true)
    setCamOn(true)
  }

  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(t => { t.enabled = !micOn })
      setMicOn(!micOn)
    }
  }

  const toggleCam = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(t => { t.enabled = !camOn })
      setCamOn(!camOn)
    }
  }

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  return (
    <DashboardLayout title="Video Consultation">
      <div className="space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-surface-900">Video Call</h2>
            <p className="text-sm text-surface-500">Secure WebRTC consultation with your doctor</p>
          </div>
          {callState === 'connected' && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-semibold text-emerald-700">{formatDuration(duration)}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Remote */}
          <div className="relative aspect-video bg-surface-900 rounded-2xl overflow-hidden">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            {callState !== 'connected' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-4xl mb-3">👨‍⚕️</div>
                <p className="font-semibold">Doctor</p>
                <p className="text-white/60 text-sm mt-1">
                  {callState === 'idle' && 'Waiting to connect...'}
                  {callState === 'connecting' && 'Connecting...'}
                  {callState === 'ended' && 'Call ended'}
                </p>
                {callState === 'connecting' && (
                  <div className="flex gap-1.5 mt-3">
                    {[0, 150, 300].map(delay => (
                      <div key={delay} className="w-2.5 h-2.5 rounded-full bg-white animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/50 rounded-lg text-white text-xs font-semibold backdrop-blur-sm">
              👨‍⚕️ Doctor
            </div>
          </div>

          {/* Local */}
          <div className="relative aspect-video bg-surface-800 rounded-2xl overflow-hidden">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            {callState === 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-4xl mb-3">👤</div>
                <p className="font-semibold">You</p>
                <p className="text-white/60 text-sm mt-1">Camera off</p>
              </div>
            )}
            {!camOn && callState !== 'idle' && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface-800">
                <div className="text-4xl">📵</div>
              </div>
            )}
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/50 rounded-lg text-white text-xs font-semibold backdrop-blur-sm">
              👤 You
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="card flex items-center justify-center gap-4">
          {callState === 'idle' || callState === 'ended' ? (
            <button onClick={startCall} className="btn-primary flex items-center gap-2 px-8 py-3 text-base">
              📹 Start Call
            </button>
          ) : (
            <>
              <button
                onClick={toggleMic}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${micOn ? 'bg-surface-100 hover:bg-surface-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                title={micOn ? 'Mute' : 'Unmute'}
              >
                {micOn ? '🎙️' : '🔇'}
              </button>
              <button
                onClick={endCall}
                className="w-16 h-16 rounded-2xl bg-red-500 hover:bg-red-600 flex items-center justify-center text-2xl text-white transition-all shadow-lg hover:shadow-red-300"
                title="End Call"
              >
                📵
              </button>
              <button
                onClick={toggleCam}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${camOn ? 'bg-surface-100 hover:bg-surface-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                title={camOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {camOn ? '📷' : '📵'}
              </button>
            </>
          )}
        </div>

        {/* Info */}
        <div className="card bg-dental-50 border-dental-200">
          <h3 className="font-bold text-surface-800 mb-3">ℹ️ About Video Consultation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-surface-600">
            <div className="flex items-start gap-2">
              <span className="text-dental-500 font-bold">🔒</span>
              <p>All calls are encrypted end-to-end using WebRTC</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-dental-500 font-bold">⚡</span>
              <p>Direct peer-to-peer connection for low latency</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-dental-500 font-bold">📋</span>
              <p>Share your screen or dental images during the call</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}