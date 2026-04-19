'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface OpenClawStatus {
  status: string
  service?: string
  openclawPort?: number
  openclawReachable?: boolean
  timestamp?: string
  error?: string
}

interface OpenClawSkill {
  name: string
  version?: string
  description?: string
  enabled?: boolean
}

interface OpenClawCronJob {
  id: string
  schedule: string
  task: string
  enabled: boolean
  nextRun?: string
}

interface OpenClawSession {
  id: string
  channel?: string
  agentId?: string
  createdAt?: string
}

interface OpenClawModel {
  id: string
  name?: string
  provider?: string
}

interface OpenClawAgent {
  id: string
  name: string
  description: string
  model?: string
  skills?: string[]
}

interface GenerateRequest {
  type: 'image' | 'video' | 'music'
  prompt: string
  model?: string
}

interface ChatCompletionResponse {
  response?: string
  model?: string
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number }
  source?: string
  error?: string
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useOpenClaw() {
  const [status, setStatus] = useState<OpenClawStatus | null>(null)
  const [skills, setSkills] = useState<OpenClawSkill[]>([])
  const [cronJobs, setCronJobs] = useState<OpenClawCronJob[]>([])
  const [sessions, setSessions] = useState<OpenClawSession[]>([])
  const [models, setModels] = useState<OpenClawModel[]>([])
  const [agents, setAgents] = useState<OpenClawAgent[]>([])
  const [isOnline, setIsOnline] = useState(false)
  const [isGatewayReachable, setIsGatewayReachable] = useState(false)
  const [loading, setLoading] = useState(true)

  // ─── Check status ────────────────────────────────────────────────────────
  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/openclaw/status')
      const data = await res.json()
      setStatus(data)
      setIsOnline(data.status === 'ok' || data.status === 'online')
      setIsGatewayReachable(data.openclawReachable || false)
    } catch {
      setIsOnline(false)
      setIsGatewayReachable(false)
      setStatus(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // ─── Fetch skills ────────────────────────────────────────────────────────
  const fetchSkills = useCallback(async () => {
    try {
      const res = await fetch('/api/openclaw/skills')
      const data = await res.json()
      if (Array.isArray(data)) setSkills(data)
      else if (data.skills && Array.isArray(data.skills)) setSkills(data.skills)
      else setSkills([])
    } catch {
      setSkills([])
    }
  }, [])

  // ─── Fetch cron jobs ─────────────────────────────────────────────────────
  const fetchCronJobs = useCallback(async () => {
    try {
      const res = await fetch('/api/openclaw/cron')
      const data = await res.json()
      if (Array.isArray(data)) setCronJobs(data)
      else if (data.cronJobs && Array.isArray(data.cronJobs)) setCronJobs(data.cronJobs)
      else setCronJobs([])
    } catch {
      setCronJobs([])
    }
  }, [])

  // ─── Fetch sessions ──────────────────────────────────────────────────────
  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/openclaw/sessions')
      const data = await res.json()
      if (Array.isArray(data)) setSessions(data)
      else if (data.sessions && Array.isArray(data.sessions)) setSessions(data.sessions)
      else setSessions([])
    } catch {
      setSessions([])
    }
  }, [])

  // ─── Fetch models ────────────────────────────────────────────────────────
  const fetchModels = useCallback(async () => {
    try {
      const res = await fetch('/api/openclaw/models')
      const data = await res.json()
      if (data.data && Array.isArray(data.data)) {
        setModels(data.data.map((m: any) => ({ id: m.id, name: m.id, provider: m.id?.split('/')[0] })))
      } else if (Array.isArray(data)) {
        setModels(data)
      } else {
        setModels([])
      }
    } catch {
      setModels([])
    }
  }, [])

  // ─── Send message (OpenAI-compat or CLI fallback) ────────────────────────
  const sendMessage = useCallback(async (
    message: string,
    options?: { channel?: string; target?: string; sessionKey?: string; agentId?: string }
  ): Promise<ChatCompletionResponse | null> => {
    try {
      const res = await fetch('/api/openclaw/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          channel: options?.channel,
          target: options?.target,
          sessionKey: options?.sessionKey,
          agentId: options?.agentId,
        }),
      })
      return await res.json()
    } catch (error) {
      console.error('Failed to send OpenClaw message:', error)
      return null
    }
  }, [])

  // ─── Chat completion (OpenAI-compatible) ──────────────────────────────────
  const chatCompletion = useCallback(async (
    messages: Array<{ role: string; content: string }>,
    options?: { model?: string; agentId?: string; tools?: string[] }
  ): Promise<ChatCompletionResponse | null> => {
    try {
      const res = await fetch('/api/openclaw/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: options?.model || (options?.agentId ? `openclaw/${options.agentId}` : 'openclaw/default'),
          messages,
          tools: options?.tools || [],
          stream: false,
        }),
      })
      return await res.json()
    } catch (error) {
      console.error('Chat completion failed:', error)
      return null
    }
  }, [])

  // ─── Generate media ──────────────────────────────────────────────────────
  const generateMedia = useCallback(async (request: GenerateRequest): Promise<any> => {
    try {
      const res = await fetch('/api/openclaw/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      })
      return await res.json()
    } catch (error) {
      console.error('Media generation failed:', error)
      return null
    }
  }, [])

  // ─── Web search ──────────────────────────────────────────────────────────
  const webSearch = useCallback(async (query: string): Promise<any> => {
    try {
      const res = await fetch('/api/openclaw/web-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      return await res.json()
    } catch (error) {
      console.error('Web search failed:', error)
      return null
    }
  }, [])

  // ─── Schedule prayer reminder ────────────────────────────────────────────
  const schedulePrayer = useCallback(async (prayerName: string, time: string, channel?: string) => {
    try {
      const res = await fetch('/api/openclaw/schedule-prayer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prayerName, time, channel }),
      })
      return await res.json()
    } catch (error) {
      console.error('Prayer scheduling failed:', error)
      return null
    }
  }, [])

  // ─── Auto-poll status ────────────────────────────────────────────────────
  useEffect(() => {
    checkStatus()
    fetchSkills()
    fetchCronJobs()
    fetchModels()

    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [checkStatus, fetchSkills, fetchCronJobs, fetchModels])

  return {
    // State
    status,
    skills,
    cronJobs,
    sessions,
    models,
    agents,
    isOnline,
    isGatewayReachable,
    loading,

    // Actions
    sendMessage,
    chatCompletion,
    generateMedia,
    webSearch,
    schedulePrayer,

    // Refresh
    refreshSkills: fetchSkills,
    refreshCron: fetchCronJobs,
    refreshSessions: fetchSessions,
    refreshModels: fetchModels,
    refreshStatus: checkStatus,
  }
}
