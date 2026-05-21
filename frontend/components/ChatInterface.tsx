'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import api from '@/services/api'

type Message = { role: 'user' | 'assistant'; content: string }

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Ask Cyber Agent about CVEs, API risks, mitigations, or previous reports.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    const question = input.trim()
    if (!question) return
    setMessages((prev) => [...prev, { role: 'user', content: question }])
    setInput('')
    setLoading(true)
    try {
      const res = await api.post(`/ask?query=${encodeURIComponent(question)}`)
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.answer }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error contacting AI. Confirm the FastAPI server is running.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="soc-card flex h-[620px] flex-col">
      <div className="border-b border-slate-800 p-4">
        <h3 className="text-lg font-semibold">AI Security Chat</h3>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((msg, idx) => (
          <div key={`${msg.role}-${idx}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[82%] rounded-lg px-4 py-2 text-sm leading-relaxed ${
                msg.role === 'user' ? 'bg-accent text-slate-950' : 'bg-slate-900 text-slate-200'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-sm text-slate-400">Thinking...</div>}
      </div>
      <div className="flex gap-2 border-t border-slate-800 p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about cybersecurity..."
          className="min-h-11 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 outline-none focus:border-accent"
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-slate-950">
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
