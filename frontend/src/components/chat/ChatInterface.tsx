import { useState, useRef, useEffect } from 'react'
import type { KeyboardEvent } from 'react'
import type { ChatMessage } from '../../types'

interface Props {
  messages: ChatMessage[]
  onSend: (msg: string) => Promise<void>
  loading?: boolean
  placeholder?: string
  title?: string
  isPublic?: boolean
}

export default function ChatInterface({ messages, onSend, loading, placeholder, title, isPublic }: Props) {
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const msg = input.trim()
    setInput('')
    await onSend(msg)
  }

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-surface-100 shadow-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-100 bg-gradient-to-r from-dental-50 to-mint-50">
        <div className="w-10 h-10 rounded-xl bg-gradient-dental flex items-center justify-center text-white text-lg">
          🤖
        </div>
        <div>
          <h3 className="font-bold text-surface-900 text-sm">{title || 'Dental AI Assistant'}</h3>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-slow"></div>
            <span className="text-xs text-emerald-600 font-medium">Online • {isPublic ? 'Public Mode' : 'Private Mode'}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-dental flex items-center justify-center text-white text-3xl mb-4 shadow-glow">
              🦷
            </div>
            <p className="font-display font-bold text-lg text-surface-800">Hi! I'm your Dental AI</p>
            <p className="text-sm text-surface-400 mt-1 max-w-xs">
              Ask me anything about dental health, treatments, or appointments.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {['What causes tooth decay?', 'How often should I visit?', 'Teeth whitening tips'].map(q => (
                <button key={q} onClick={() => onSend(q)}
                  className="text-xs bg-dental-50 text-dental-700 px-3 py-1.5 rounded-full border border-dental-200 hover:bg-dental-100 transition">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-gradient-dental flex items-center justify-center text-white text-xs flex-shrink-0 mt-1">🤖</div>
            )}
            <div>
              <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                {msg.content}
              </div>
              <p className={`text-[10px] text-surface-400 mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-surface-200 flex items-center justify-center text-xs flex-shrink-0 mt-1">👤</div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-dental flex items-center justify-center text-white text-xs">🤖</div>
            <div className="chat-bubble-ai flex items-center gap-1.5 py-3">
              <div className="w-2 h-2 rounded-full bg-dental-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-dental-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-dental-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-surface-100 bg-surface-50">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={placeholder || 'Ask about dental health...'}
            rows={1}
            className="input resize-none flex-1 min-h-[44px] max-h-32 overflow-y-auto"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="btn-primary px-4 py-2.5 flex items-center gap-2 flex-shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
            </svg>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}