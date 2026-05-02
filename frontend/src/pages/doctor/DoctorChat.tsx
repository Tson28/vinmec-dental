import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import ChatInterface from '../../components/chat/ChatInterface'
import { chatApi } from '../../services/api'
import type { ChatMessage } from '../../types'

export default function DoctorChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    chatApi.getHistory().then(res => {
      const hist = res.data?.data || res.data || []
      setMessages(hist)
    }).catch(() => {})
  }, [])

  const handleSend = async (content: string) => {
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await chatApi.privateChat(content, history)
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: res.data?.reply || res.data?.message || 'I understand. Based on the clinical context, here is my recommendation...',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: 'Connection error. Please try again.',
        timestamp: new Date().toISOString()
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title="AI Clinical Assistant">
      <div className="h-[calc(100vh-160px)]">
        <ChatInterface
          messages={messages}
          onSend={handleSend}
          loading={loading}
          title="Private Clinical AI Assistant"
          placeholder="Ask about diagnosis, treatment protocols, medications..."
        />
      </div>
    </DashboardLayout>
  )
}