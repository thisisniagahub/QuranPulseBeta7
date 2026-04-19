'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Bookmark, ChevronLeft, ChevronRight, Share2,
  Eye, EyeOff, Loader2, AlertCircle,
  MessageCircle, Sparkles, Shield, Calendar, Target, Star,
  Play, Pause, SkipForward, Volume2, Repeat,
  Radio, Headphones,
} from 'lucide-react'
import { SURAH_LIST, type SurahInfo } from '@/lib/quran-data'
import { useQuranPulseStore } from '@/stores/quranpulse-store'
import {
  SAJDA_AYAHS, TAJWID_COLORS, TRANSLIT_MAP, RECITERS,
  type VerseData, type WordAnalysis, type Reciter, type RepeatMode,
} from './types'

interface QuranVerseViewProps {
  selectedSurah: number
  surahInfo: SurahInfo | undefined
  verses: VerseData[]
  isLoadingVerses: boolean
  verseError: boolean
  fetchSurahFromApi: (surahId: number) => void
  showTranslation: boolean
  setShowTranslation: (v: boolean) => void
  showEnTranslation: boolean
  showTajwid: boolean
  setShowTajwid: (v: boolean) => void
  showWordByWord: boolean
  setShowWordByWord: (v: boolean) => void
  selectedWord: { word: string; verseNum: number; wordIndex: number } | null
  setSelectedWord: (w: { word: string; verseNum: number; wordIndex: number } | null) => void
  // Audio
  isPlaying: boolean
  currentPlayingAyah: number | null
  isAudioLoading: boolean
  audioError: string | null
  togglePlay: (ayah?: number) => void
  nextAyah: () => void
  reciter: Reciter
  setReciter: (r: Reciter) => void
  playbackSpeed: number
  setPlaybackSpeed: (s: number) => void
  repeatMode: RepeatMode
  setRepeatMode: (m: RepeatMode) => void
  showAudioSettings: boolean
  setShowAudioSettings: (v: boolean) => void
  // Voice follow
  isVoiceFollowing: boolean
  voiceFollowAyah: number | null
  startVoiceFollowing: () => void
  stopVoiceFollowing: () => void
  currentWordIndex: number | null
  // Navigation
  goBack: () => void
  navigateSurah: (direction: -1 | 1) => void
  // Refs
  ayahRefs: React.RefObject<Record<number, HTMLDivElement | null>>
  readerScrollRef: React.RefObject<HTMLDivElement | null>
  // Other
  hijriDate: string
  readingHistory: number[]
  openSurah: (id: number) => void
  getJuzProgress: (juz: number) => number
}

export function QuranVerseView({
  selectedSurah,
  surahInfo,
  verses,
  isLoadingVerses,
  verseError,
  fetchSurahFromApi,
  showTranslation,
  setShowTranslation,
  showEnTranslation,
  showTajwid,
  setShowTajwid,
  showWordByWord,
  setShowWordByWord,
  selectedWord,
  setSelectedWord,
  isPlaying,
  currentPlayingAyah,
  isAudioLoading,
  audioError,
  togglePlay,
  nextAyah,
  reciter,
  setReciter,
  playbackSpeed,
  setPlaybackSpeed,
  repeatMode,
  setRepeatMode,
  showAudioSettings,
  setShowAudioSettings,
  isVoiceFollowing,
  voiceFollowAyah,
  startVoiceFollowing,
  stopVoiceFollowing,
  currentWordIndex,
  goBack,
  navigateSurah,
  ayahRefs,
  readerScrollRef,
  hijriDate,
  readingHistory,
  openSurah,
  getJuzProgress,
}: QuranVerseViewProps) {
  const store = useQuranPulseStore()
  const sajdaData = SAJDA_AYAHS[selectedSurah]

  // Word-by-Word Analysis
  const getWordAnalysis = (word: string, _verseNum: number, wordIndex: number): WordAnalysis => {
    const transliteration = TRANSLIT_MAP[word] || `kalimah_${wordIndex + 1}`
    return {
      word,
      transliteration,
      translation: `Perkataan ${wordIndex + 1}`,
      root: word.replace(/[\u064B-\u065F\u0670]/g, ''),
      grammar: wordIndex === 0 ? 'Permulaan' : 'Lain-lain',
    }
  }

  return (
    <>
      {/* Reader Header */}
      <div className="flex items-center justify-between mb-2">
        <button className="flex items-center gap-1 text-sm" style={{ color: '#4a4aa6' }} onClick={goBack}>
          <ChevronLeft className="h-5 w-5" /> Kembali
        </button>
        <div className="text-center">
          <div className="text-xs" style={{ color: 'rgba(204,204,204,0.5)' }}>Surah {selectedSurah}</div>
          <div className="text-sm font-semibold" style={{ color: '#ffffff' }}>{surahInfo?.nameMs}</div>
        </div>
        <div className="flex gap-1">
          <button className="p-2 rounded-lg" style={{ background: 'rgba(74,74,166,0.15)' }} onClick={() => setShowWordByWord(!showWordByWord)}>
            <Sparkles className="h-4 w-4" style={{ color: showWordByWord ? '#d4af37' : '#4a4aa6' }} />
          </button>
          <button className="p-2 rounded-lg" style={{ background: 'rgba(74,74,166,0.15)' }} onClick={() => setShowTajwid(!showTajwid)}>
            <BookOpen className="h-4 w-4" style={{ color: showTajwid ? '#d4af37' : '#4a4aa6' }} />
          </button>
          <button className="p-2 rounded-lg" style={{ background: 'rgba(74,74,166,0.15)' }} onClick={() => setShowTranslation(!showTranslation)}>
            {showTranslation ? <EyeOff className="h-4 w-4" style={{ color: '#4a4aa6' }} /> : <Eye className="h-4 w-4" style={{ color: '#4a4aa6' }} />}
          </button>
          <button className="p-2 rounded-lg" style={{ background: 'rgba(74,74,166,0.15)' }} onClick={() => store.toggleSurahBookmark(selectedSurah)}>
            <Bookmark className="h-4 w-4" style={{ color: store.isSurahBookmarked(selectedSurah) ? '#d4af37' : '#4a4aa6' }} fill={store.isSurahBookmarked(selectedSurah) ? '#d4af37' : 'none'} />
          </button>
        </div>
      </div>

      {/* Voice Follow + JAKIM Badge Row */}
      <div className="flex items-center justify-between mb-3">
        <motion.button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{
            background: isVoiceFollowing ? 'rgba(212,175,55,0.2)' : 'rgba(74,74,166,0.15)',
            border: `1px solid ${isVoiceFollowing ? 'rgba(212,175,55,0.4)' : 'rgba(74,74,166,0.2)'}`,
            color: isVoiceFollowing ? '#d4af37' : '#6a6ab6',
          }}
          onClick={isVoiceFollowing ? stopVoiceFollowing : startVoiceFollowing}
          whileTap={{ scale: 0.95 }}
        >
          {isVoiceFollowing ? <Radio className="h-3.5 w-3.5 animate-pulse" /> : <Headphones className="h-3.5 w-3.5" />}
          {isVoiceFollowing ? 'Mendengar...' : 'Ikut Suara'}
        </motion.button>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: 'rgba(74,166,74,0.1)', border: '1px solid rgba(74,166,74,0.2)' }}>
            <Shield className="h-3 w-3" style={{ color: '#4aff7a' }} />
            <span className="text-[9px] font-semibold" style={{ color: '#4aff7a' }}>✓ JAKIM</span>
          </div>
          {hijriDate && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-md" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <Calendar className="h-3 w-3" style={{ color: '#d4af37' }} />
              <span className="text-[9px]" style={{ color: '#d4af37' }}>{hijriDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Word-by-word indicator */}
      {showWordByWord && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <Sparkles className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
          <span className="text-[11px]" style={{ color: '#d4af37' }}>Mod Perkataan — Ketik perkataan untuk analisis</span>
        </div>
      )}

      {/* Surah Info Banner */}
      <div className="rounded-xl p-4 mb-3 text-center" style={{ background: 'linear-gradient(135deg, rgba(74,74,166,0.15), rgba(212,175,55,0.1))', border: '1px solid rgba(74,74,166,0.2)' }}>
        <div className="text-3xl font-arabic mb-1" style={{ color: '#ffffff' }}>{surahInfo?.name}</div>
        <div className="text-sm" style={{ color: 'rgba(204,204,204,0.7)' }}>
          {surahInfo?.nameEn} · {surahInfo?.versesCount} Ayat · {surahInfo?.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyyah'} · Juz {surahInfo?.juz.join(', ')}
        </div>
      </div>

      {/* Bismillah */}
      {selectedSurah !== 9 && selectedSurah !== 1 && (
        <div className="text-center mb-3 py-3">
          <p className="text-2xl font-arabic" style={{ color: '#d4af37', direction: 'rtl' }}>
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </p>
        </div>
      )}

      {/* Tajwid Legend */}
      {showTajwid && (
        <div className="flex flex-wrap gap-2 mb-3 p-2 rounded-lg" style={{ background: 'rgba(42,42,106,0.4)' }}>
          {Object.entries(TAJWID_COLORS).map(([rule, color]) => (
            <div key={rule} className="flex items-center gap-1">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
              <span className="text-[10px] capitalize" style={{ color: 'rgba(204,204,204,0.6)' }}>{rule}</span>
            </div>
          ))}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoadingVerses && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.08)' }}>
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-full animate-pulse" style={{ background: 'rgba(74,74,166,0.2)' }} />
                <div className="flex-1 space-y-2">
                  <div className="h-6 w-3/4 animate-pulse rounded" style={{ background: 'rgba(74,74,166,0.15)' }} />
                  <div className="h-4 w-full animate-pulse rounded" style={{ background: 'rgba(74,74,166,0.1)' }} />
                  <div className="h-4 w-2/3 animate-pulse rounded" style={{ background: 'rgba(74,74,166,0.1)' }} />
                </div>
              </div>
            </div>
          ))}
          <div className="text-center py-2">
            <Loader2 className="h-5 w-5 animate-spin mx-auto" style={{ color: '#4a4aa6' }} />
            <p className="text-xs mt-2" style={{ color: 'rgba(204,204,204,0.4)' }}>Memuatkan ayat...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {verseError && !isLoadingVerses && verses.length === 0 && (
        <div className="text-center py-8">
          <AlertCircle className="h-10 w-10 mx-auto mb-3" style={{ color: 'rgba(74,74,166,0.3)' }} />
          <p className="text-sm" style={{ color: 'rgba(204,204,204,0.5)' }}>Gagal memuatkan ayat</p>
          <button
            className="mt-2 px-4 py-2 rounded-xl text-xs"
            style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.3)' }}
            onClick={() => fetchSurahFromApi(selectedSurah)}
          >
            Cuba Lagi
          </button>
        </div>
      )}

      {/* Verses */}
      {!isLoadingVerses && verses.length > 0 && (
        <div className="space-y-3">
          {verses.map((verse) => {
            const isPlayingAyah = currentPlayingAyah === verse.verseNumber || voiceFollowAyah === verse.verseNumber
            const isSajda = sajdaData?.ayahs.includes(verse.verseNumber)
            const sajdaType = sajdaData?.types[verse.verseNumber]
            const isBookmarked = store.isVerseBookmarked(selectedSurah, verse.verseNumber)

            return (
              <motion.div
                key={verse.verseNumber}
                ref={el => { ayahRefs.current[verse.verseNumber] = el }}
                className="rounded-xl p-4 transition-all"
                style={{
                  background: isPlayingAyah ? 'rgba(74,74,166,0.2)' : 'rgba(42, 42, 106, 0.3)',
                  border: `1px solid ${isPlayingAyah ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.08)'}`,
                  boxShadow: isPlayingAyah ? '0 0 15px rgba(74,74,166,0.15)' : 'none',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(verse.verseNumber * 0.02, 0.5) }}
              >
                <div className="flex items-start gap-3">
                  {/* Verse number badge */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37' }}>
                      {verse.verseNumber}
                    </div>
                    {isSajda && (
                      <div className="flex flex-col items-center" title={`Sajda ${sajdaType}`}>
                        <span className="text-sm">🕌</span>
                        <span className="text-[10px]" style={{ color: sajdaType === 'wajib' ? '#ff4a4a' : '#4aff7a' }}>
                          {sajdaType === 'wajib' ? 'Wajib' : 'Sunnah'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    {/* Arabic text - Word-by-Word or normal */}
                    {showWordByWord ? (
                      <p className="text-right text-xl leading-[2.5] font-arabic" style={{ color: '#ffffff', direction: 'rtl' }}>
                        {verse.arabic.split(/\s+/).filter(Boolean).map((word, wi) => (
                          <button
                            key={wi}
                            className="inline-block hover:bg-opacity-20 rounded px-0.5 transition-colors"
                            style={{
                              background: selectedWord?.verseNum === verse.verseNumber && selectedWord?.wordIndex === wi
                              ? 'rgba(212,175,55,0.2)'
                              : 'transparent',
                              borderBottom: selectedWord?.verseNum === verse.verseNumber && selectedWord?.wordIndex === wi
                              ? '2px solid #d4af37'
                              : '2px solid transparent',
                            }}
                            onClick={() => setSelectedWord({ word, verseNum: verse.verseNumber, wordIndex: wi })}
                          >
                            {word}
                          </button>
                        ))}
                      </p>
                    ) : (
                      <p className="text-right text-xl leading-[2.2] font-arabic" style={{ color: '#ffffff', direction: 'rtl' }}>
                        {isPlayingAyah && currentWordIndex !== null
                          ? verse.arabic.split(/\s+/).filter(Boolean).map((word, wi) => (
                            <motion.span
                              key={wi}
                              className="inline-block"
                              style={{
                                color: wi === currentWordIndex ? '#d4af37' : '#ffffff',
                                fontWeight: wi === currentWordIndex ? 700 : 400,
                              }}
                              animate={wi === currentWordIndex ? { scale: [1, 1.08, 1] } : {}}
                              transition={{ type: 'tween', duration: 0.3 }}
                            >
                              {word}{' '}
                            </motion.span>
                          ))
                          : verse.arabic
                        }
                      </p>
                    )}

                    {/* Malay translation */}
                    {showTranslation && (
                      <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(204,204,204,0.6)' }}>
                        {verse.translation}
                      </p>
                    )}

                    {/* English translation */}
                    {showEnTranslation && verse.translationEn && (
                      <p className="mt-1 text-xs leading-relaxed italic" style={{ color: 'rgba(204,204,204,0.4)' }}>
                        {verse.translationEn}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-between items-center mt-2">
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg text-xs flex items-center gap-1" style={{ background: 'rgba(74,74,166,0.1)' }} onClick={() => togglePlay(verse.verseNumber)}>
                      {isPlayingAyah && isAudioLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: '#4a4aa6' }} /> : isPlayingAyah ? <Pause className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} /> : <Play className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />}
                      <span className="text-[10px]" style={{ color: '#4a4aa6' }}>{isPlayingAyah && isAudioLoading ? 'Memuat...' : 'Dengar'}</span>
                    </button>
                    <button className="p-1.5 rounded-lg text-xs" style={{ background: 'rgba(212,175,55,0.1)' }}>
                      <MessageCircle className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
                    </button>
                    <button className="p-1.5 rounded-lg" style={{ background: isBookmarked ? 'rgba(212,175,55,0.15)' : 'rgba(74,74,166,0.1)' }} onClick={() => store.toggleVerseBookmark(selectedSurah, verse.verseNumber)}>
                      <Bookmark className="h-3.5 w-3.5" style={{ color: isBookmarked ? '#d4af37' : '#4a4aa6' }} fill={isBookmarked ? '#d4af37' : 'none'} />
                    </button>
                    <button className="p-1.5 rounded-lg" style={{ background: 'rgba(74,74,166,0.1)' }}>
                      <Share2 className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
                    </button>
                  </div>
                  <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.3)' }}>
                    Juz {surahInfo?.juz[0] || '?'}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {!isLoadingVerses && verses.length === 0 && !verseError && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto mb-3" style={{ color: 'rgba(74,74,166,0.3)' }} />
          <p className="text-sm" style={{ color: 'rgba(204,204,204,0.5)' }}>
            Ayat-ayat {surahInfo?.nameMs} akan dimuat turun...
          </p>
          <p className="text-xs mt-1" style={{ color: 'rgba(204,204,204,0.3)' }}>
            {surahInfo?.versesCount} ayat · Juz {surahInfo?.juz.join(', ')}
          </p>
        </div>
      )}

      {/* Word Analysis Popup */}
      <AnimatePresence>
        {selectedWord && showWordByWord && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedWord(null)} />
            <motion.div
              className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl rounded-t-2xl p-4"
              style={{ background: '#2a2a6a', border: '1px solid rgba(74,74,166,0.3)' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold" style={{ color: '#d4af37' }}>Analisis Perkataan</h4>
                <button onClick={() => setSelectedWord(null)}>
                  <svg className="h-4 w-4" style={{ color: 'rgba(204,204,204,0.5)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
              {(() => {
                const analysis = getWordAnalysis(selectedWord.word, selectedWord.verseNum, selectedWord.wordIndex)
                return (
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-3xl font-arabic" style={{ color: '#ffffff', direction: 'rtl' }}>{analysis.word}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg p-2.5" style={{ background: 'rgba(74,74,166,0.15)' }}>
                        <div className="text-[10px] mb-0.5" style={{ color: 'rgba(204,204,204,0.4)' }}>Transliterasi</div>
                        <div className="text-xs font-medium" style={{ color: '#4a4aa6' }}>{analysis.transliteration}</div>
                      </div>
                      <div className="rounded-lg p-2.5" style={{ background: 'rgba(212,175,55,0.1)' }}>
                        <div className="text-[10px] mb-0.5" style={{ color: 'rgba(204,204,204,0.4)' }}>Terjemahan</div>
                        <div className="text-xs font-medium" style={{ color: '#d4af37' }}>{analysis.translation}</div>
                      </div>
                      <div className="rounded-lg p-2.5" style={{ background: 'rgba(74,74,166,0.15)' }}>
                        <div className="text-[10px] mb-0.5" style={{ color: 'rgba(204,204,204,0.4)' }}>Akar Kata</div>
                        <div className="text-sm font-arabic" style={{ color: '#ffffff', direction: 'rtl' }}>{analysis.root}</div>
                      </div>
                      <div className="rounded-lg p-2.5" style={{ background: 'rgba(74,74,166,0.15)' }}>
                        <div className="text-[10px] mb-0.5" style={{ color: 'rgba(204,204,204,0.4)' }}>Tatabahasa</div>
                        <div className="text-xs font-medium" style={{ color: '#6a6ab6' }}>{analysis.grammar}</div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Surah Navigation */}
      <div className="flex justify-between mt-4">
        <button className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs" style={{
          background: 'rgba(42,42,106,0.5)',
          border: '1px solid rgba(74,74,166,0.15)',
          color: selectedSurah > 1 ? '#4a4aa6' : 'rgba(204,204,204,0.2)',
        }} disabled={selectedSurah <= 1} onClick={() => navigateSurah(-1)}>
          <ChevronLeft className="h-4 w-4" /> Sebelum
        </button>
        <button className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs" style={{
          background: 'rgba(74,74,166,0.15)',
          border: '1px solid rgba(74,74,166,0.3)',
          color: '#4a4aa6',
        }} disabled={selectedSurah >= 114} onClick={() => navigateSurah(1)}>
          Seterusnya <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Smart Reading Suggestions */}
      <div className="mt-4 space-y-3">
        {/* Next Surah Suggestion */}
        {selectedSurah < 114 && (() => {
          const nextSurah = SURAH_LIST.find(s => s.id === selectedSurah + 1)
          if (!nextSurah) return null
          return (
            <motion.div
              className="rounded-xl p-3 cursor-pointer active:scale-[0.98] transition-transform"
              style={{ background: 'linear-gradient(135deg, rgba(74,74,166,0.15), rgba(212,175,55,0.08))', border: '1px solid rgba(74,74,166,0.2)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => { navigateSurah(1); readerScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }) }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" style={{ color: '#d4af37' }} />
                  <div>
                    <div className="text-xs font-semibold" style={{ color: '#d4af37' }}>Ayat Seterusnya</div>
                    <div className="text-sm font-medium" style={{ color: '#ffffff' }}>{nextSurah.nameMs} · {nextSurah.versesCount} Ayat</div>
                  </div>
                </div>
                <span className="text-lg font-arabic" style={{ color: 'rgba(204,204,204,0.5)' }}>{nextSurah.name}</span>
              </div>
            </motion.div>
          )
        })()}

        {/* Juz Progress Card */}
        {surahInfo && (
          <div className="rounded-xl p-3" style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.1)' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Target className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
              <span className="text-xs font-semibold" style={{ color: '#4a4aa6' }}>Kemajuan Juz {surahInfo.juz[0]}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(74,74,166,0.15)' }}>
              <div className="h-full rounded-full" style={{ width: `${getJuzProgress(surahInfo.juz[0])}%`, background: 'linear-gradient(90deg, #4a4aa6, #d4af37)' }} />
            </div>
            <div className="text-[10px] mt-1" style={{ color: 'rgba(204,204,204,0.4)' }}>{getJuzProgress(surahInfo.juz[0])}% lengkap · Sumber: islam.gov.my</div>
          </div>
        )}

        {/* Recommended based on reading history */}
        {readingHistory.length > 1 && (
          <div>
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: '#d4af37' }}>
              <Star className="h-3.5 w-3.5" /> Disyorkan Untuk Anda
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {SURAH_LIST.filter(s => !readingHistory.includes(s.id) && s.versesCount <= 50).slice(0, 5).map(surah => (
                <button
                  key={surah.id}
                  className="flex-shrink-0 rounded-xl p-2.5 text-center"
                  style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.1)', minWidth: '90px' }}
                  onClick={() => { openSurah(surah.id); readerScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }) }}
                >
                  <div className="text-lg font-arabic" style={{ color: '#ffffff' }}>{surah.name}</div>
                  <div className="text-[10px] font-medium mt-1" style={{ color: 'rgba(204,204,204,0.6)' }}>{surah.nameMs}</div>
                  <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{surah.versesCount} ayat</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* JAKIM Compliance Badge */}
        <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(42,42,106,0.2)', border: '1px solid rgba(74,166,74,0.1)' }}>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Shield className="h-3.5 w-3.5" style={{ color: '#4aff7a' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#4aff7a' }}>Mematuhi Garis Panduan JAKIM Malaysia</span>
          </div>
          <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Tafsir: Abdullah Basmeih (JAKIM) · Sumber: islam.gov.my</div>
        </div>
      </div>

      {/* Audio controls bar */}
      {isPlaying && (
        <div className="flex items-center justify-between px-3 py-2 rounded-t-xl mt-3" style={{ background: 'rgba(42,42,106,0.8)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(74,74,166,0.2)' }}>
          <button className="p-1.5" onClick={() => {/* prev */}}>
            <ChevronLeft className="h-4 w-4" style={{ color: '#4a4aa6' }} />
          </button>
          <button className="p-2 rounded-full relative" style={{ background: 'rgba(74,74,166,0.2)' }} onClick={() => togglePlay()}>
            {isAudioLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" style={{ color: '#4a4aa6' }} />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" style={{ color: '#4a4aa6' }} />
            ) : (
              <Play className="h-5 w-5" style={{ color: '#4a4aa6' }} />
            )}
          </button>
          <button className="p-1.5" onClick={nextAyah}>
            <SkipForward className="h-4 w-4" style={{ color: '#4a4aa6' }} />
          </button>
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1">
              <Volume2 className="h-3 w-3" style={{ color: isAudioLoading ? '#d4af37' : audioError ? '#ff4a4a' : 'rgba(204,204,204,0.4)' }} />
              <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{currentPlayingAyah}/{surahInfo?.versesCount || '?'}</span>
              {repeatMode !== 'none' && (
                <Repeat className="h-3 w-3" style={{ color: '#d4af37' }} />
              )}
            </div>
            {isAudioLoading && (
              <span className="text-[10px]" style={{ color: '#d4af37' }}>Memuatkan...</span>
            )}
            {audioError && (
              <span className="text-[10px]" style={{ color: '#ff4a4a' }}>Ralat audio</span>
            )}
          </div>
          <button className="p-1.5" onClick={() => setShowAudioSettings(true)}>
            <svg className="h-3.5 w-3.5" style={{ color: 'rgba(204,204,204,0.4)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
          </button>
        </div>
      )}

      {/* Audio Settings Modal */}
      <AnimatePresence>
        {showAudioSettings && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowAudioSettings(false)} />
            <motion.div
              className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl rounded-t-2xl p-4"
              style={{ background: '#2a2a6a' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
            >
              <h4 className="text-sm font-semibold mb-3" style={{ color: '#ffffff' }}>Tetapan Audio</h4>
              <div className="space-y-3">
                <div>
                  <div className="text-xs mb-1" style={{ color: 'rgba(204,204,204,0.5)' }}>Qari</div>
                  <div className="grid grid-cols-2 gap-2">
                    {RECITERS.map(r => (
                      <button
                        key={r.id}
                        className="py-2 px-3 rounded-lg text-xs text-left flex items-center gap-2"
                        style={{
                          background: reciter === r.id ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                          color: reciter === r.id ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
                          border: `1px solid ${reciter === r.id ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
                        }}
                        onClick={() => setReciter(r.id)}
                      >
                        <Volume2 className="h-3.5 w-3.5 flex-shrink-0" style={{ color: reciter === r.id ? '#4a4aa6' : 'rgba(204,204,204,0.3)' }} />
                        <div className="flex flex-col">
                          <span className="font-medium">{r.nameMs}</span>
                          <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{r.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-1" style={{ color: 'rgba(204,204,204,0.5)' }}>Kelajuan: {playbackSpeed}x</div>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    value={[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].indexOf(playbackSpeed)}
                    onChange={e => setPlaybackSpeed([0.5, 0.75, 1.0, 1.25, 1.5, 2.0][parseInt(e.target.value)] || 1.0)}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="text-xs mb-1" style={{ color: 'rgba(204,204,204,0.5)' }}>Ulangan</div>
                  <div className="flex gap-2">
                    {(['none', 'single', 'surah', 'continuous'] as RepeatMode[]).map(mode => (
                      <button
                        key={mode}
                        className="flex-1 py-2 rounded-lg text-xs"
                        style={{
                          background: repeatMode === mode ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                          color: repeatMode === mode ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
                          border: `1px solid ${repeatMode === mode ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
                        }}
                        onClick={() => setRepeatMode(mode)}
                      >
                        {mode === 'none' ? 'Tiada' : mode === 'single' ? 'Satu' : mode === 'surah' ? 'Surah' : 'Berterusan'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
