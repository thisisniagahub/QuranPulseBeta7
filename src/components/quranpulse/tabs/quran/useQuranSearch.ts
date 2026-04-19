'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { SURAH_LIST } from '@/lib/quran-data'
import type { FilterType, SearchResult } from './types'

export function useQuranSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')

  // Search handler with debounce
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() || searchQuery.length < 2) return
    setIsSearching(true)
    try {
      const res = await fetch(`/api/quran/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      if (data.success) {
        setSearchResults(data.results)
      }
    } catch {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [searchQuery])

  // Debounced search effect
  useEffect(() => {
    if (showSearch && searchQuery.length >= 2) {
      const timer = setTimeout(handleSearch, 500)
      return () => clearTimeout(timer)
    }
  }, [showSearch, searchQuery, handleSearch])

  // Filtered surahs for list view
  const filteredSurahs = useMemo(() => {
    let list = SURAH_LIST
    if (filter === 'meccan') list = list.filter(s => s.revelationType === 'Meccan')
    if (filter === 'medinan') list = list.filter(s => s.revelationType === 'Medinan')
    if (searchQuery && !showSearch) {
      const q = searchQuery.toLowerCase()
      list = list.filter(s =>
        s.name.includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.nameMs.toLowerCase().includes(q) ||
        s.id.toString() === q
      )
    }
    return list
  }, [filter, searchQuery, showSearch])

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    showSearch,
    setShowSearch,
    filter,
    setFilter,
    filteredSurahs,
  }
}
