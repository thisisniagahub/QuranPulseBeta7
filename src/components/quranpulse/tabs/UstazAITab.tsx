'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Trash2, Volume2, Mic, Sparkles, AlertCircle } from 'lucide-react'
import { useQuranPulseStore } from '@/stores/quranpulse-store'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SUGGESTION_CHIPS = [
  'Apakah hukum solat berjemaah?',
  'Bagaimana cara bertaubat?',
  'Ceritakan kisah Nabi Yusuf',
  'Apakah rukun iman?',
  'Hukum puasa pada bulan Ramadhan',
  'Cara mendidik anak dalam Islam',
]

const PERSONAS = [
  { id: 'ustaz', label: 'Ustaz Azhar', emoji: '👳🏻‍♂️', desc: 'Fiqh & Hukum' },
  { id: 'ustazah', label: 'Ustazah Aishah', emoji: '🧕🏻', desc: 'Akidah & Akhlak' },
  { id: 'ustaz-zak', label: 'Ustaz Zak', emoji: '🧢', desc: 'Sirah & Sejarah' },
]

export function UstazAITab() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activePersona, setActivePersona] = useState('ustaz')
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { addXp } = useQuranPulseStore()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ustaz-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          persona: activePersona,
          history: messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Gagal mendapat jawapan daripada Ustaz AI')
      }

      const data = await response.json()
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Maaf, saya tidak dapat menjawab soalan ini pada masa ini.',
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
      addXp(15)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ralat berlaku')
      // Fallback response
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getFallbackResponse(userMessage.content, activePersona),
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    setError(null)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-2 pb-3" style={{ borderBottom: '1px solid rgba(74,74,166,0.1)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(74,74,166,0.3), rgba(212,175,55,0.2))',
                border: '1px solid rgba(74,74,166,0.3)',
              }}
              animate={{
                boxShadow: [
                  '0 0 10px rgba(74,74,166,0.2)',
                  '0 0 20px rgba(74,74,166,0.4)',
                  '0 0 10px rgba(74,74,166,0.2)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Bot className="h-5 w-5" style={{ color: '#4a4aa6' }} />
            </motion.div>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: '#ffffff' }}>
                {PERSONAS.find(p => p.id === activePersona)?.emoji} {PERSONAS.find(p => p.id === activePersona)?.label}
              </h3>
              <p className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>
                AI Islamic Assistant · {PERSONAS.find(p => p.id === activePersona)?.desc}
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              className="p-2 rounded-lg"
              style={{ background: 'rgba(212,175,55,0.1)' }}
              onClick={clearChat}
            >
              <Trash2 className="h-4 w-4" style={{ color: '#d4af37' }} />
            </button>
          )}
        </div>

        {/* Persona Selector */}
        <div className="flex gap-2 mt-3">
          {PERSONAS.map(p => (
            <button
              key={p.id}
              className="flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all"
              style={{
                background: activePersona === p.id ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                color: activePersona === p.id ? '#4a4aa6' : 'rgba(204,204,204,0.4)',
                border: `1px solid ${activePersona === p.id ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
              }}
              onClick={() => { setActivePersona(p.id); clearChat() }}
            >
              {p.emoji} {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* JAKIM Disclaimer */}
      <div className="px-4 py-1.5" style={{ background: 'rgba(212,175,55,0.05)' }}>
        <p className="text-[9px] text-center" style={{ color: 'rgba(204,204,204,0.3)' }}>
          ⚠️ Jawapan AI adalah rujukan umum. Untuk hukum rasmi, sila rujuk mufti atau ulama bertauliah.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 qp-scroll">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8">
            <motion.div
              className="h-20 w-20 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(74,74,166,0.15), rgba(212,175,55,0.1))',
                border: '1px solid rgba(74,74,166,0.2)',
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-8 w-8" style={{ color: '#4a4aa6' }} />
            </motion.div>
            <h4 className="text-sm font-semibold mb-1" style={{ color: '#ffffff' }}>
              Tanya Ustaz AI
            </h4>
            <p className="text-xs text-center max-w-[250px]" style={{ color: 'rgba(204,204,204,0.4)' }}>
              Tanya apa-apa soalan tentang Islam, fiqh, akidah, sirah, dan banyak lagi.
            </p>

            {/* Suggestion Chips */}
            <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
              {SUGGESTION_CHIPS.slice(0, 4).map(chip => (
                <button
                  key={chip}
                  className="px-3 py-1.5 rounded-full text-[10px] transition-transform active:scale-95"
                  style={{
                    background: 'rgba(42,42,106,0.5)',
                    border: '1px solid rgba(74,74,166,0.15)',
                    color: 'rgba(204,204,204,0.6)',
                  }}
                  onClick={() => { setInput(chip); inputRef.current?.focus() }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {msg.role === 'assistant' && (
                <div className="flex-shrink-0 h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(74,74,166,0.15)' }}>
                  <Bot className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
                </div>
              )}
              <div
                className="max-w-[80%] rounded-xl p-3"
                style={{
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #4a4aa6, #6a6ab6)'
                    : 'rgba(42, 42, 106, 0.5)',
                  border: msg.role === 'assistant' ? '1px solid rgba(74,74,166,0.1)' : 'none',
                }}
              >
                <p className="text-sm leading-relaxed" style={{ color: msg.role === 'user' ? '#FFFFFF' : 'rgba(204,204,204,0.85)' }}>
                  {msg.content}
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[9px]" style={{ color: msg.role === 'user' ? 'rgba(204,204,204,0.6)' : 'rgba(204,204,204,0.25)' }}>
                    {msg.timestamp.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.role === 'assistant' && (
                    <div className="flex gap-1">
                      <button className="p-1 rounded" style={{ background: 'rgba(74,74,166,0.1)' }}>
                        <Volume2 className="h-3 w-3" style={{ color: '#4a4aa6' }} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="flex-shrink-0 h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)' }}>
                  <User className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            className="flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(74,74,166,0.15)' }}>
              <Bot className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
            </div>
            <div className="rounded-xl p-3" style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.1)' }}>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full"
                    style={{ background: '#4a4aa6' }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)' }}>
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="text-xs text-red-300">{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(74,74,166,0.1)', background: 'rgba(26,26,74,0.5)' }}>
        <div className="flex gap-2 items-center">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Tanya soalan tentang Islam..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              className="w-full rounded-xl pl-4 pr-10 py-2.5 text-sm outline-none"
              style={{
                background: 'rgba(42, 42, 106, 0.5)',
                border: '1px solid rgba(74,74,166,0.15)',
                color: '#ffffff',
              }}
              disabled={isLoading}
            />
          </div>
          <motion.button
            className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{
              background: input.trim() ? 'linear-gradient(135deg, #4a4aa6, #6a6ab6)' : 'rgba(74,74,166,0.15)',
            }}
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            whileTap={{ scale: 0.9 }}
          >
            <Send className="h-4 w-4" style={{ color: input.trim() ? '#FFFFFF' : 'rgba(74,74,166,0.3)' }} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

function getFallbackResponse(message: string, persona: string): string {
  const lower = message.toLowerCase()

  const responses: Record<string, string[]> = {
    ustaz: [
      'Berdasarkan fiqh Islam, perkara ini perlu diteliti dengan lebih mendalam. Secara umumnya, kita perlu merujuk kepada Al-Quran dan Sunnah sebagai sumber utama hukum. Saya cadangkan anda berunding dengan ustaz di kawasan anda untuk pandangan yang lebih khusus.',
      'Soalan yang baik! Dalam mazhab Syafie yang diamalkan di Malaysia, hukum ini bergantung kepada beberapa faktor. Sebagai panduan umum, kita perlu mengutamakan niat yang ikhlas dan mengikuti syariat yang ditetapkan.',
      'Jazakallahu khairan untuk soalan ini. Dalam Islam, setiap perbuatan dinilai berdasarkan niat. Adalah penting untuk kita memahami hukum hakam dengan merujuk kepada ilmuwan yang berkelayakan.',
    ],
    ustazah: [
      'Subhanallah, soalan yang sangat penting. Dari segi akidah, kita wajib meyakini bahawa Allah SWT adalah Tuhan Yang Maha Esa dan Muhammad SAW adalah Rasul terakhir. Perkara ini adalah asas keimanan kita.',
      'Dalam berakhlak, Islam mengajar kita untuk sentiasa bersabar, bersyukur, dan bertaubat. Setiap ujian yang datang adalah cara Allah mengangkat darjat kita. Teruskan berdoa dan berusaha.',
      'Penting untuk kita menjaga akidah dan akhlak dalam kehidupan harian. Sentiasa berzikir dan berdoa agar diberikan petunjuk oleh Allah SWT.',
    ],
    'ustaz-zak': [
      'Dalam sejarah Islam, kita dapat melihat bagaimana kesabangan para Nabi dan Rasul dalam menghadapi ujian. Kisah ini mengajar kita tentang pentingnya tawakkal kepada Allah.',
      'Sirah Nabi Muhammad SAW penuh dengan pengajaran yang berharga. Baginda sentiasa menunjukkan akhlak yang mulia dan sifat pemaaf dalam setiap situasi.',
      'Sejarah peradaban Islam menunjukkan bahawa kejayaan datang dengan ilmu, iman, dan amal. Kita harus meneladani semangat para salafussoleh dalam menuntut ilmu.',
    ],
  }

  const personaResponses = responses[persona] || responses.ustaz
  return personaResponses[Math.floor(Math.random() * personaResponses.length)]
}
