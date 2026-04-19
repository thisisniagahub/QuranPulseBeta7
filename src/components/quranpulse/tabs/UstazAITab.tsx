'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, Bot, User, Trash2, Volume2, VolumeX, Mic, MicOff,
  Sparkles, AlertCircle, Globe, Image as ImageIcon,
  ChevronDown, ChevronUp, Clock, Zap, Shield,
  MessageSquare, Cpu, Palette, Search, BookOpen, Moon,
  Copy, ThumbsUp, Heart, Check
} from 'lucide-react'
import { useQuranPulseStore } from '@/stores/quranpulse-store'
import { useOpenClaw } from '@/hooks/useOpenClaw'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  persona?: string
  isVoice?: boolean
  imageUrl?: string
  isSearching?: boolean
  reactions?: string[]
  audioUrl?: string
}

type ChatMode = 'classic' | 'openclaw'

// ─── Constants ───────────────────────────────────────────────────────────────

const PERSONAS = [
  {
    id: 'ustaz',
    label: 'Ustaz Azhar',
    emoji: '👳🏻‍♂️',
    desc: 'Fiqh & Hukum',
    color: '#4a4aa6',
    specialization: 'Pakar dalam fiqh mazhab Syafie, hukum halal/haram, dan ibadah',
  },
  {
    id: 'ustazah',
    label: 'Ustazah Aishah',
    emoji: '🧕🏻',
    desc: 'Akidah & Akhlak',
    color: '#6a6ab6',
    specialization: 'Pakar dalam akidah, akhlak, pendidikan Islam, dan muamalah',
  },
  {
    id: 'ustaz-zak',
    label: 'Ustaz Zak',
    emoji: '🧢',
    desc: 'Sirah & Sejarah',
    color: '#8a8ac6',
    specialization: 'Pakar dalam sirah Nabi, sejarah peradaban Islam, dan kisah para nabi',
  },
]

const SUGGESTION_CHIPS = [
  { text: 'Apakah hukum solat berjemaah?', icon: '🕌' },
  { text: 'Bagaimana cara bertaubat?', icon: '🤲' },
  { text: 'Ceritakan kisah Nabi Yusuf', icon: '📖' },
  { text: 'Apakah rukun iman?', icon: '⭐' },
  { text: 'Hukum puasa Ramadhan', icon: '🌙' },
  { text: 'Cara mendidik anak dalam Islam', icon: '👨‍👩‍👧' },
]

const OPENCLAW_TOOLS = [
  { id: 'web-search', name: 'Web Search', icon: Globe, desc: 'Search the web for Islamic knowledge', ocTool: 'web_search' },
  { id: 'image-gen', name: 'Islamic Art', icon: ImageIcon, desc: 'Generate Islamic calligraphy & art', ocTool: 'image_generate' },
  { id: 'video-gen', name: 'Video Gen', icon: Palette, desc: 'Generate Islamic video content', ocTool: 'video_generate' },
  { id: 'music-gen', name: 'Nasheed Gen', icon: Volume2, desc: 'Generate nasheed/vocal music', ocTool: 'music_generate' },
  { id: 'cron', name: 'Prayer Reminders', icon: Clock, desc: 'Scheduled prayer notifications', ocTool: 'cron' },
  { id: 'quran-search', name: 'Quran Search', icon: BookOpen, desc: 'Search Quranic verses', ocTool: 'web_fetch' },
  { id: 'pdf-tool', name: 'PDF Tool', icon: Search, desc: 'Read & analyze PDF documents', ocTool: 'pdf' },
  { id: 'browser', name: 'Web Browser', icon: Globe, desc: 'Browse websites for research', ocTool: 'browser' },
  { id: 'tts', name: 'Voice Output', icon: Volume2, desc: 'Text-to-speech for responses', ocTool: 'tts' },
]

const REACTION_EMOJIS = ['👍', '❤️', '🤲', '✨', '🕌']

// ─── Component ───────────────────────────────────────────────────────────────

export function UstazAITab() {
  // Core state
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activePersona, setActivePersona] = useState('ustaz')
  const [chatMode, setChatMode] = useState<ChatMode>('classic')
  const [error, setError] = useState<string | null>(null)

  // Feature toggles
  const [webSearchEnabled, setWebSearchEnabled] = useState(false)
  const [toolsPanelOpen, setToolsPanelOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null)

  // OpenClaw hook (enhanced with all features)
  const {
    isOnline, isGatewayReachable, skills, cronJobs, models, sessions,
    status, loading: ocLoading,
    sendMessage: ocSendMessage, chatCompletion, generateMedia, webSearch,
    schedulePrayer, refreshSkills, refreshCron, refreshSessions, refreshModels,
  } = useOpenClaw()

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  const { addXp } = useQuranPulseStore()

  // ─── Scroll to bottom ─────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ─── Cleanup audio on unmount ─────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
        currentAudioRef.current = null
      }
    }
  }, [])

  // ─── Send message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      persona: activePersona,
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      // Try OpenClaw first if in OpenClaw mode and online
      if (chatMode === 'openclaw' && isOnline) {
        // Map persona to OpenClaw agent
        const agentMap: Record<string, string> = {
          'ustaz': 'ustaz-azhar',
          'ustazah': 'ustazah-aishah',
          'ustaz-zak': 'ustaz-zak',
        }
        const agentId = agentMap[activePersona] || 'ustaz-azhar'

        // Determine if this is a media generation request
        const isImageReq = userMessage.content.toLowerCase().includes('jana seni') ||
          userMessage.content.toLowerCase().includes('generate art') ||
          userMessage.content.toLowerCase().includes('khat islam') ||
          userMessage.content.toLowerCase().includes('islamic art')
        const isVideoReq = userMessage.content.toLowerCase().includes('jana video') ||
          userMessage.content.toLowerCase().includes('generate video')
        const isMusicReq = userMessage.content.toLowerCase().includes('jana nasyid') ||
          userMessage.content.toLowerCase().includes('generate nasheed') ||
          userMessage.content.toLowerCase().includes('jana muzik')

        let ocResult: any = null

        // Handle media generation via OpenClaw
        if (isImageReq) {
          ocResult = await generateMedia({ type: 'image', prompt: userMessage.content })
        } else if (isVideoReq) {
          ocResult = await generateMedia({ type: 'video', prompt: userMessage.content })
        } else if (isMusicReq) {
          ocResult = await generateMedia({ type: 'music', prompt: userMessage.content })
        } else if (webSearchEnabled) {
          // Use OpenClaw web search
          ocResult = await webSearch(userMessage.content)
        } else {
          // Use OpenClaw agent messaging
          ocResult = await ocSendMessage(input.trim(), { agentId })
        }

        if (ocResult && (ocResult.response || ocResult.choices?.[0])) {
          const responseText = ocResult.response ||
            ocResult.choices?.[0]?.message?.content ||
            ocResult.choices?.[0]?.text || ''
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: responseText,
            timestamp: new Date(),
            persona: activePersona,
            imageUrl: ocResult.imageUrl || ocResult.data?.imageUrl || undefined,
            isSearching: webSearchEnabled || ocResult.searching || undefined,
          }
          setMessages(prev => [...prev, assistantMessage])
          addXp(isImageReq || isVideoReq || isMusicReq ? 25 : 20)
          return
        }
      }

      // Classic LLM with enhanced OpenClaw-like features
      const isImageRequest = userMessage.content.toLowerCase().includes('jana seni') || 
        userMessage.content.toLowerCase().includes('generate art') ||
        userMessage.content.toLowerCase().includes('khat islam')

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
          enableWebSearch: webSearchEnabled,
          enableImageGen: isImageRequest,
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
        persona: activePersona,
        imageUrl: data.imageUrl || undefined,
        isSearching: data.searched || undefined,
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
        persona: activePersona,
      }
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, chatMode, isOnline, activePersona, webSearchEnabled, messages, ocSendMessage, addXp])

  // ─── Clear chat ───────────────────────────────────────────────────────────
  const clearChat = () => {
    setMessages([])
    setError(null)
  }

  // ─── Voice input (ASR) ────────────────────────────────────────────────────
  const toggleVoiceInput = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop())
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1]
          try {
            const res = await fetch('/api/asr', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioBase64: base64Audio }),
            })
            const data = await res.json()
            if (data.success && data.text) {
              setInput(data.text)
            }
          } catch {
            setError('Gagal memproses suara. Sila cuba lagi.')
          }
        }
        reader.readAsDataURL(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop()
          setIsRecording(false)
        }
      }, 10000)
    } catch {
      setError('Tidak dapat mengakses mikrofon. Sila semak kebenaran.')
    }
  }

  // ─── Voice output (TTS) ───────────────────────────────────────────────────
  const playTTS = async (messageId: string, text: string) => {
    if (playingAudioId === messageId) {
      // Stop playing
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
        currentAudioRef.current = null
      }
      setPlayingAudioId(null)
      return
    }

    // Stop any existing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
    }

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.substring(0, 1024) }),
      })

      if (!res.ok) throw new Error('TTS failed')

      const audioBlob = await res.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      currentAudioRef.current = audio
      setPlayingAudioId(messageId)

      audio.onended = () => {
        setPlayingAudioId(null)
        URL.revokeObjectURL(audioUrl)
      }

      await audio.play()
    } catch {
      setError('Gagal menjana audio. Sila cuba lagi.')
    }
  }

  // ─── Quick actions ────────────────────────────────────────────────────────
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'generate-art':
        setInput('Jana seni khat Islam: Bismillah')
        break
      case 'search-quran':
        setInput('Cari ayat Al-Quran tentang ')
        break
      case 'prayer-times':
        setInput('Apakah waktu solat hari ini?')
        break
      default:
        break
    }
    inputRef.current?.focus()
  }

  // ─── Add reaction ─────────────────────────────────────────────────────────
  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, reactions: [...(msg.reactions || []), emoji] }
          : msg
      )
    )
  }

  // ─── Copy message ─────────────────────────────────────────────────────────
  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
  }

  // ─── Active persona data ──────────────────────────────────────────────────
  const activePersonaData = PERSONAS.find(p => p.id === activePersona) || PERSONAS[0]

  // ─── Upcoming prayer from cron ────────────────────────────────────────────
  const prayerReminders = cronJobs
    .filter(j => j.enabled && j.task.toLowerCase().includes('solat'))
    .slice(0, 3)

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════════════════
          HEADER
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="px-4 pt-2 pb-2" style={{ borderBottom: '1px solid rgba(74,74,166,0.1)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <motion.div
              className="h-11 w-11 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(74,74,166,0.3), rgba(212,175,55,0.15))',
                border: '1px solid rgba(74,74,166,0.3)',
              }}
              animate={{
                boxShadow: [
                  '0 0 10px rgba(74,74,166,0.2)',
                  '0 0 25px rgba(74,74,166,0.4)',
                  '0 0 10px rgba(74,74,166,0.2)',
                ],
              }}
              transition={{ type: 'tween', duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Bot className="h-5 w-5" style={{ color: '#4a4aa6' }} />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold" style={{ color: '#ffffff' }}>
                  Ustaz AI
                </h3>
                {/* OpenClaw Status Indicator */}
                <div className="flex items-center gap-1">
                  <motion.div
                    className="h-2 w-2 rounded-full"
                    style={{
                      background: isOnline ? '#22c55e' : '#ef4444',
                    }}
                    animate={isOnline ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ type: 'tween', duration: 2, repeat: Infinity }}
                  />
                  <span className="text-[8px] font-medium" style={{ color: isOnline ? '#22c55e' : '#ef4444' }}>
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
              </div>
              <p className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>
                {activePersonaData.emoji} {activePersonaData.label} · {activePersonaData.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {messages.length > 0 && (
              <motion.button
                className="p-2 rounded-lg"
                style={{ background: 'rgba(212,175,55,0.1)' }}
                onClick={clearChat}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 className="h-4 w-4" style={{ color: '#d4af37' }} />
              </motion.button>
            )}
            <motion.button
              className="p-2 rounded-lg"
              style={{ background: toolsPanelOpen ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)' }}
              onClick={() => setToolsPanelOpen(!toolsPanelOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {toolsPanelOpen ? (
                <ChevronUp className="h-4 w-4" style={{ color: '#4a4aa6' }} />
              ) : (
                <ChevronDown className="h-4 w-4" style={{ color: 'rgba(204,204,204,0.4)' }} />
              )}
            </motion.button>
          </div>
        </div>

        {/* ─── Mode Toggle ──────────────────────────────────────────────────── */}
        <div className="flex mt-2.5 rounded-lg overflow-hidden" style={{ background: 'rgba(26,26,74,0.6)', border: '1px solid rgba(74,74,166,0.1)' }}>
          <button
            className="flex-1 py-1.5 text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5"
            style={{
              background: chatMode === 'classic' ? 'rgba(74,74,166,0.25)' : 'transparent',
              color: chatMode === 'classic' ? '#4a4aa6' : 'rgba(204,204,204,0.4)',
              borderBottom: chatMode === 'classic' ? '2px solid #4a4aa6' : '2px solid transparent',
            }}
            onClick={() => setChatMode('classic')}
          >
            <MessageSquare className="h-3 w-3" />
            Classic Chat
          </button>
          <button
            className="flex-1 py-1.5 text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5"
            style={{
              background: chatMode === 'openclaw' ? 'rgba(212,175,55,0.15)' : 'transparent',
              color: chatMode === 'openclaw' ? '#d4af37' : 'rgba(204,204,204,0.4)',
              borderBottom: chatMode === 'openclaw' ? '2px solid #d4af37' : '2px solid transparent',
            }}
            onClick={() => setChatMode('openclaw')}
          >
            <Cpu className="h-3 w-3" />
            OpenClaw Agent
          </button>
        </div>

        {/* ─── Persona Selector (Avatar Cards) ──────────────────────────────── */}
        <div className="flex gap-2 mt-2.5">
          {PERSONAS.map(p => (
            <motion.button
              key={p.id}
              className="flex-1 py-2 px-2 rounded-xl text-center transition-all"
              style={{
                background: activePersona === p.id
                  ? 'linear-gradient(135deg, rgba(74,74,166,0.2), rgba(212,175,55,0.08))'
                  : 'rgba(42,42,106,0.3)',
                border: `1px solid ${activePersona === p.id ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.08)'}`,
              }}
              onClick={() => { setActivePersona(p.id); clearChat() }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-lg mb-0.5">{p.emoji}</div>
              <div className="text-[9px] font-bold" style={{
                color: activePersona === p.id ? '#ffffff' : 'rgba(204,204,204,0.5)'
              }}>
                {p.label}
              </div>
              <div className="text-[8px]" style={{
                color: activePersona === p.id ? '#4a4aa6' : 'rgba(204,204,204,0.3)'
              }}>
                {p.desc}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          TOOLS PANEL (Collapsible)
      ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {toolsPanelOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
            style={{ borderBottom: '1px solid rgba(74,74,166,0.1)' }}
          >
            <div className="px-4 py-3 space-y-3" style={{ background: 'rgba(26,26,74,0.4)' }}>
              {/* Active Skills Badges */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Zap className="h-3 w-3" style={{ color: '#d4af37' }} />
                  <span className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>
                    OpenClaw Skills ({skills.length > 0 ? skills.length : 5})
                  </span>
                  <span className="text-[8px]" style={{ color: isGatewayReachable ? '#22c55e' : '#ef4444' }}>
                    {isGatewayReachable ? '● Gateway Connected' : '● Gateway Offline'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {skills.length > 0 ? (
                    skills.map((skill, i) => (
                      <motion.span
                        key={skill.name || i}
                        className="px-2 py-0.5 rounded-full text-[9px] font-medium"
                        style={{
                          background: 'rgba(74,74,166,0.15)',
                          border: '1px solid rgba(74,74,166,0.25)',
                          color: '#4a4aa6',
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        ⚡ {skill.name}
                      </motion.span>
                    ))
                  ) : (
                    <>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-medium"
                        style={{ background: 'rgba(74,74,166,0.15)', border: '1px solid rgba(74,74,166,0.25)', color: '#4a4aa6' }}>
                        ⚡ ustaz-ai
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-medium"
                        style={{ background: 'rgba(74,74,166,0.15)', border: '1px solid rgba(74,74,166,0.25)', color: '#4a4aa6' }}>
                        ⚡ quran-search
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-medium"
                        style={{ background: 'rgba(74,74,166,0.15)', border: '1px solid rgba(74,74,166,0.25)', color: '#4a4aa6' }}>
                        ⚡ prayer-ibadah
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-medium"
                        style={{ background: 'rgba(74,74,166,0.15)', border: '1px solid rgba(74,74,166,0.25)', color: '#4a4aa6' }}>
                        ⚡ islamic-art
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-medium"
                        style={{ background: 'rgba(74,74,166,0.15)', border: '1px solid rgba(74,74,166,0.25)', color: '#4a4aa6' }}>
                        ⚡ iqra-hafazan
                      </span>
                    </>
                  )}
                  {!isOnline && (
                    <span className="px-2 py-0.5 rounded-full text-[9px]"
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                      Offline
                    </span>
                  )}
                </div>
              </div>

              {/* OpenClaw Tools Grid */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Cpu className="h-3 w-3" style={{ color: '#4a4aa6' }} />
                  <span className="text-[10px] font-semibold" style={{ color: '#4a4aa6' }}>
                    Agent Tools
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {OPENCLAW_TOOLS.map(tool => (
                    <div
                      key={tool.id}
                      className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg"
                      style={{
                        background: 'rgba(42,42,106,0.4)',
                        border: '1px solid rgba(74,74,166,0.1)',
                      }}
                    >
                      <tool.icon className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
                      <span className="text-[8px] text-center font-medium" style={{ color: 'rgba(204,204,204,0.6)' }}>
                        {tool.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prayer Reminders from Cron */}
              {prayerReminders.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Clock className="h-3 w-3" style={{ color: '#d4af37' }} />
                    <span className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>
                      Prayer Reminders
                    </span>
                  </div>
                  <div className="space-y-1">
                    {prayerReminders.map(job => (
                      <div key={job.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
                        style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)' }}>
                        <Clock className="h-3 w-3" style={{ color: '#d4af37' }} />
                        <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.6)' }}>
                          {job.schedule}
                        </span>
                        <span className="text-[9px] flex-1" style={{ color: '#d4af37' }}>
                          {job.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Web Search Toggle */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5" style={{ color: webSearchEnabled ? '#22c55e' : 'rgba(204,204,204,0.3)' }} />
                  <span className="text-[10px] font-medium" style={{ color: webSearchEnabled ? '#22c55e' : 'rgba(204,204,204,0.4)' }}>
                    Web Search
                  </span>
                </div>
                <button
                  className="relative h-5 w-9 rounded-full transition-colors"
                  style={{ background: webSearchEnabled ? 'rgba(34,197,94,0.3)' : 'rgba(42,42,106,0.5)' }}
                  onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                >
                  <motion.div
                    className="absolute top-0.5 h-4 w-4 rounded-full"
                    style={{ background: webSearchEnabled ? '#22c55e' : 'rgba(204,204,204,0.3)' }}
                    animate={{ left: webSearchEnabled ? '18px' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════
          JAKIM DISCLAIMER
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="px-4 py-1" style={{ background: 'rgba(212,175,55,0.05)' }}>
        <div className="flex items-center gap-1.5">
          <Shield className="h-2.5 w-2.5 flex-shrink-0" style={{ color: 'rgba(212,175,55,0.4)' }} />
          <p className="text-[8px]" style={{ color: 'rgba(204,204,204,0.3)' }}>
            Jawapan AI adalah rujukan umum. Untuk hukum rasmi, sila rujuk mufti atau ulama bertauliah.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          MESSAGES
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 qp-scroll">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6">
            <motion.div
              className="h-20 w-20 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(74,74,166,0.15), rgba(212,175,55,0.1))',
                border: '1px solid rgba(74,74,166,0.2)',
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ type: 'tween', duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-8 w-8" style={{ color: '#4a4aa6' }} />
            </motion.div>
            <h4 className="text-sm font-bold mb-1" style={{ color: '#ffffff' }}>
              Tanya Ustaz AI
            </h4>
            <p className="text-[11px] text-center max-w-[260px] mb-1" style={{ color: 'rgba(204,204,204,0.4)' }}>
              Tanya apa-apa soalan tentang Islam, fiqh, akidah, sirah, dan banyak lagi.
            </p>
            {chatMode === 'openclaw' && (
              <div className="flex items-center gap-1.5 mt-1">
                <Cpu className="h-3 w-3" style={{ color: isOnline ? '#22c55e' : '#ef4444' }} />
                <span className="text-[9px]" style={{ color: isOnline ? '#22c55e' : '#ef4444' }}>
                  {isOnline ? 'OpenClaw Agent aktif' : 'OpenClaw offline — menggunakan Classic Chat'}
                </span>
              </div>
            )}

            {/* Suggestion Chips */}
            <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
              {SUGGESTION_CHIPS.slice(0, 4).map(chip => (
                <motion.button
                  key={chip.text}
                  className="px-3 py-1.5 rounded-full text-[10px] transition-transform flex items-center gap-1"
                  style={{
                    background: 'rgba(42,42,106,0.5)',
                    border: '1px solid rgba(74,74,166,0.15)',
                    color: 'rgba(204,204,204,0.6)',
                  }}
                  onClick={() => { setInput(chip.text); inputRef.current?.focus() }}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ background: 'rgba(42,42,106,0.7)' }}
                >
                  <span>{chip.icon}</span> {chip.text}
                </motion.button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-4 flex gap-2">
              <motion.button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-medium"
                style={{
                  background: 'rgba(212,175,55,0.1)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  color: '#d4af37',
                }}
                onClick={() => handleQuickAction('generate-art')}
                whileTap={{ scale: 0.95 }}
              >
                <Palette className="h-3 w-3" /> Generate Islamic Art
              </motion.button>
              <motion.button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-medium"
                style={{
                  background: 'rgba(74,74,166,0.15)',
                  border: '1px solid rgba(74,74,166,0.2)',
                  color: '#4a4aa6',
                }}
                onClick={() => handleQuickAction('search-quran')}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="h-3 w-3" /> Search Quran
              </motion.button>
              <motion.button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-medium"
                style={{
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.2)',
                  color: '#22c55e',
                }}
                onClick={() => handleQuickAction('prayer-times')}
                whileTap={{ scale: 0.95 }}
              >
                <Moon className="h-3 w-3" /> Prayer Times
              </motion.button>
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
                <div className="flex-shrink-0 h-7 w-7 rounded-lg flex items-center justify-center mt-1"
                  style={{ background: 'rgba(74,74,166,0.15)' }}>
                  <Bot className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
                </div>
              )}
              <div className="max-w-[80%]">
                {/* Web search indicator */}
                {msg.isSearching && (
                  <motion.div
                    className="flex items-center gap-1.5 mb-1 px-2 py-1 rounded-lg"
                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.15)' }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ type: 'tween', duration: 1.5, repeat: Infinity }}
                  >
                    <Globe className="h-3 w-3" style={{ color: '#22c55e' }} />
                    <span className="text-[9px]" style={{ color: '#22c55e' }}>Searching the web...</span>
                  </motion.div>
                )}

                <div
                  className="rounded-xl p-3"
                  style={{
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #4a4aa6, #6a6ab6)'
                      : 'rgba(42, 42, 106, 0.5)',
                    border: msg.role === 'assistant' ? '1px solid rgba(74,74,166,0.1)' : 'none',
                  }}
                >
                  {msg.isVoice && (
                    <div className="flex items-center gap-1 mb-1">
                      <Mic className="h-2.5 w-2.5" style={{ color: '#d4af37' }} />
                      <span className="text-[8px]" style={{ color: '#d4af37' }}>Voice Input</span>
                    </div>
                  )}

                  <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{
                    color: msg.role === 'user' ? '#FFFFFF' : 'rgba(204,204,204,0.85)'
                  }}>
                    {msg.content}
                  </p>

                  {/* Generated image display */}
                  {msg.imageUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden" style={{ border: '1px solid rgba(74,74,166,0.2)' }}>
                      <img
                        src={msg.imageUrl}
                        alt="Generated Islamic Art"
                        className="w-full h-auto"
                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  {/* Message footer */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[9px]" style={{
                      color: msg.role === 'user' ? 'rgba(204,204,204,0.6)' : 'rgba(204,204,204,0.25)'
                    }}>
                      {msg.timestamp.toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                      {chatMode === 'openclaw' && msg.role === 'assistant' && (
                        <span style={{ color: '#d4af37' }}> · OpenClaw</span>
                      )}
                    </span>

                    {/* Action buttons for assistant messages */}
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-1">
                        {/* Reactions */}
                        {REACTION_EMOJIS.slice(0, 3).map(emoji => (
                          <button
                            key={emoji}
                            className="p-0.5 rounded text-[10px] transition-transform hover:scale-125"
                            style={{ opacity: 0.5 }}
                            onClick={() => addReaction(msg.id, emoji)}
                          >
                            {emoji}
                          </button>
                        ))}

                        {/* Voice playback */}
                        <button
                          className="p-1 rounded"
                          style={{
                            background: playingAudioId === msg.id
                              ? 'rgba(212,175,55,0.2)'
                              : 'rgba(74,74,166,0.1)',
                          }}
                          onClick={() => playTTS(msg.id, msg.content)}
                        >
                          {playingAudioId === msg.id ? (
                            <VolumeX className="h-3 w-3" style={{ color: '#d4af37' }} />
                          ) : (
                            <Volume2 className="h-3 w-3" style={{ color: '#4a4aa6' }} />
                          )}
                        </button>

                        {/* Copy */}
                        <button
                          className="p-1 rounded"
                          style={{ background: 'rgba(74,74,166,0.1)' }}
                          onClick={() => copyMessage(msg.content)}
                        >
                          <Copy className="h-3 w-3" style={{ color: '#4a4aa6' }} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Reactions display */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5 pt-1.5" style={{ borderTop: '1px solid rgba(74,74,166,0.1)' }}>
                      {msg.reactions.map((reaction, i) => (
                        <span key={i} className="text-[12px]">{reaction}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="flex-shrink-0 h-7 w-7 rounded-lg flex items-center justify-center mt-1"
                  style={{ background: 'rgba(212,175,55,0.15)' }}>
                  <User className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
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
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full"
                    style={{ background: '#4a4aa6' }}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                    transition={{ type: 'tween', duration: 1, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
                {chatMode === 'openclaw' && isOnline && (
                  <span className="text-[9px] ml-2" style={{ color: '#d4af37' }}>
                    <Cpu className="h-3 w-3 inline mr-1" />
                    Agent thinking...
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Error display */}
        {error && (
          <motion.div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="h-4 w-4" style={{ color: '#ef4444' }} />
            <span className="text-[11px]" style={{ color: '#fca5a5' }}>{error}</span>
            <button
              className="ml-auto text-[9px] font-medium px-2 py-0.5 rounded"
              style={{ background: 'rgba(220,38,38,0.2)', color: '#fca5a5' }}
              onClick={() => setError(null)}
            >
              OK
            </button>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          INPUT AREA
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="px-3 py-2.5" style={{ borderTop: '1px solid rgba(74,74,166,0.1)', background: 'rgba(26,26,74,0.8)' }}>
        {/* Suggestion chips when messages exist */}
        {messages.length > 0 && messages.length < 3 && (
          <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {SUGGESTION_CHIPS.slice(2, 6).map(chip => (
              <button
                key={chip.text}
                className="px-2.5 py-1 rounded-full text-[9px] whitespace-nowrap flex-shrink-0"
                style={{
                  background: 'rgba(42,42,106,0.4)',
                  border: '1px solid rgba(74,74,166,0.1)',
                  color: 'rgba(204,204,204,0.5)',
                }}
                onClick={() => { setInput(chip.text); inputRef.current?.focus() }}
              >
                {chip.icon} {chip.text}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2 items-center">
          {/* Voice Input Button */}
          <motion.button
            className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: isRecording
                ? 'rgba(239,68,68,0.2)'
                : 'rgba(74,74,166,0.1)',
              border: isRecording
                ? '1px solid rgba(239,68,68,0.3)'
                : '1px solid rgba(74,74,166,0.1)',
            }}
            onClick={toggleVoiceInput}
            whileTap={{ scale: 0.9 }}
            disabled={isLoading}
          >
            {isRecording ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ type: 'tween', duration: 0.5, repeat: Infinity }}
              >
                <MicOff className="h-4 w-4" style={{ color: '#ef4444' }} />
              </motion.div>
            ) : (
              <Mic className="h-4 w-4" style={{ color: '#4a4aa6' }} />
            )}
          </motion.button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder={isRecording ? 'Mendengar...' : 'Tanya soalan tentang Islam...'}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              className="w-full rounded-xl pl-4 pr-4 py-2.5 text-sm outline-none"
              style={{
                background: 'rgba(42, 42, 106, 0.5)',
                border: '1px solid rgba(74,74,166,0.15)',
                color: '#ffffff',
              }}
              disabled={isLoading || isRecording}
            />
            {/* Mode indicator */}
            {chatMode === 'openclaw' && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Cpu className="h-3 w-3" style={{ color: isOnline ? '#d4af37' : 'rgba(204,204,204,0.2)' }} />
              </div>
            )}
          </div>

          {/* Send Button */}
          <motion.button
            className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: input.trim()
                ? 'linear-gradient(135deg, #4a4aa6, #6a6ab6)'
                : 'rgba(74,74,166,0.15)',
            }}
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            whileTap={{ scale: 0.9 }}
          >
            <Send className="h-4 w-4" style={{ color: input.trim() ? '#FFFFFF' : 'rgba(74,74,166,0.3)' }} />
          </motion.button>
        </div>

        {/* OpenClaw mode indicator */}
        {chatMode === 'openclaw' && (
          <div className="flex items-center justify-center gap-1.5 mt-1.5">
            <div className="h-1.5 w-1.5 rounded-full" style={{
              background: isOnline ? '#22c55e' : '#ef4444'
            }} />
            <span className="text-[8px]" style={{ color: isOnline ? 'rgba(34,197,94,0.6)' : 'rgba(239,68,68,0.5)' }}>
              {isOnline ? 'OpenClaw Agent Connected' : 'OpenClaw Offline — Classic Chat Fallback'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Fallback responses ─────────────────────────────────────────────────────

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
