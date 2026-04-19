'use client'

import { useEffect, useRef } from 'react'
import { useQuranPulseStore } from '@/stores/quranpulse-store'
import { createClient } from '@/lib/supabase/client'

/**
 * Hook to sync Zustand store state to Supabase.
 * Works in the background — when user data changes in the store,
 * it persists to Supabase for authenticated users.
 */
export function useSupabaseSync() {
  const store = useQuranPulseStore()
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSyncRef = useRef<number>(0)

  // Check if Supabase is configured
  const isSupabaseConfigured =
    typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Debounced sync function
  const syncToSupabase = async () => {
    if (!isSupabaseConfigured) return

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return // Only sync for authenticated users

      // Sync profile data
      await fetch('/api/supabase/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          username: store.userName,
          xp: store.xp,
          level: store.level,
          streak: store.streak,
          font_size: store.fontSize,
        }),
      })

      lastSyncRef.current = Date.now()
    } catch {
      // Silent fail — local state is still valid
    }
  }

  // Debounce sync to avoid too many requests
  const debouncedSync = () => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current)
    }
    syncTimeoutRef.current = setTimeout(syncToSupabase, 2000)
  }

  // Watch for changes in key store values
  useEffect(() => {
    if (!isSupabaseConfigured) return
    debouncedSync()
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }
    }
  }, [store.xp, store.level, store.streak, store.userName, store.fontSize])

  // Load from Supabase on mount
  useEffect(() => {
    if (!isSupabaseConfigured) return

    async function loadFromSupabase() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const res = await fetch(`/api/supabase/profile?user_id=${user.id}`)
        if (res.ok) {
          const { profile } = await res.json()
          if (profile) {
            if (profile.username) store.setUserName(profile.username)
            if (profile.xp) {
              // Use store actions to update
              const diff = profile.xp - store.xp
              if (diff > 0) store.addXp(diff)
            }
          }
        }
      } catch {
        // Silent fail
      }
    }

    loadFromSupabase()
  }, [])
}
