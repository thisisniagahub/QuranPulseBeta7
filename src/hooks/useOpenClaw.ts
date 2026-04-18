'use client'

import { useState, useEffect, useCallback } from 'react'

interface OpenClawStatus {
  status: string
  service?: string
  openclawPort?: number
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
  createdAt?: string
}

export function useOpenClaw() {
  const [status, setStatus] = useState<OpenClawStatus | null>(null)
  const [skills, setSkills] = useState<OpenClawSkill[]>([])
  const [cronJobs, setCronJobs] = useState<OpenClawCronJob[]>([])
  const [sessions, setSessions] = useState<OpenClawSession[]>([])
  const [isOnline, setIsOnline] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/openclaw/status')
      const data = await res.json()
      setStatus(data)
      setIsOnline(data.status === 'ok' || data.status === 'online')
    } catch {
      setIsOnline(false)
      setStatus(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchSkills = useCallback(async () => {
    try {
      const res = await fetch('/api/openclaw/skills')
      const data = await res.json()
      if (Array.isArray(data)) {
        setSkills(data)
      } else if (data.skills && Array.isArray(data.skills)) {
        setSkills(data.skills)
      } else if (data.error) {
        setSkills([])
      } else {
        setSkills([])
      }
    } catch {
      setSkills([])
    }
  }, [])

  const fetchCronJobs = useCallback(async () => {
    try {
      const res = await fetch('/api/openclaw/cron')
      const data = await res.json()
      if (Array.isArray(data)) {
        setCronJobs(data)
      } else if (data.cronJobs && Array.isArray(data.cronJobs)) {
        setCronJobs(data.cronJobs)
      } else if (data.error) {
        setCronJobs([])
      } else {
        setCronJobs([])
      }
    } catch {
      setCronJobs([])
    }
  }, [])

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/openclaw/sessions')
      const data = await res.json()
      if (Array.isArray(data)) {
        setSessions(data)
      } else if (data.sessions && Array.isArray(data.sessions)) {
        setSessions(data.sessions)
      } else {
        setSessions([])
      }
    } catch {
      setSessions([])
    }
  }, [])

  const sendMessage = useCallback(async (message: string, channel?: string, target?: string) => {
    try {
      const res = await fetch('/api/openclaw/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, channel, target }),
      })
      return await res.json()
    } catch (error) {
      console.error('Failed to send OpenClaw message:', error)
      return null
    }
  }, [])

  useEffect(() => {
    checkStatus()
    fetchSkills()
    fetchCronJobs()

    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [checkStatus, fetchSkills, fetchCronJobs])

  return {
    status,
    skills,
    cronJobs,
    sessions,
    isOnline,
    loading,
    sendMessage,
    refreshSkills: fetchSkills,
    refreshCron: fetchCronJobs,
    refreshSessions: fetchSessions,
    refreshStatus: checkStatus,
  }
}
