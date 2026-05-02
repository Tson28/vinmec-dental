import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import ChatInterface from '../../components/chat/ChatInterface'
import { chatApi } from '../../services/api'
import type { ChatMessage } from '../../types'

export default function PatientChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    chatApi.getHistory()
      .then(res => {
        const hist = res.data?.data || res.data || []
        if (Array.isArray(hist)) setMessages(hist)
      })
      .catch(() => {})
  }, [])

  const handleSend = async (content: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await chatApi.privateChat(content, history)
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.data?.reply || res.data?.message || 'Thank you for sharing. Based on your dental records, I recommend scheduling a follow-up appointment with your doctor.',
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'m unable to connect right now. Please try again in a moment.',
        timestamp: new Date().toISOString(),
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title="AI Chatbot">
      <div className="h-[calc(100vh-160px)]">
        <ChatInterface
          messages={messages}
          onSend={handleSend}
          loading={loading}
          title="Personal Dental AI Assistant"
          placeholder="Ask about your teeth, appointments, treatments..."
        />
      </div>
    </DashboardLayout>
  )
}