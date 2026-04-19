import type { HafazanLevel } from '@/stores/quranpulse-store'
import { SURAH_LIST } from '@/lib/quran-data'

// ─── Types ────────────────────────────────────────────────────
export type ReadingMode = 'surah' | 'mushaf' | 'juz' | 'bookmarks' | 'hafazan' | 'recite'
export type Reciter = 'ar.alafasy' | 'ar.abdurrahmaansudais' | 'ar.saaborimuneer' | 'ar.hudhaify'
export type RepeatMode = 'none' | 'single' | 'surah' | 'continuous' | 'ab-repeat'
export type FilterType = 'all' | 'meccan' | 'medinan'
export type HafazanPhase = 'select' | 'reveal' | 'practice' | 'complete'
export type ArabicFontSize = 'small' | 'medium' | 'large' | 'xlarge'

export interface VerseData {
  verseNumber: number
  arabic: string
  translation: string
  translationEn?: string
}

export interface SearchResult {
  type: 'surah' | 'verse'
  surahId: number
  surahName: string
  surahNameMs: string
  verseNumber?: number
  text?: string
  highlight?: string
}

export interface WordAnalysis {
  word: string
  transliteration: string
  translation: string
  root?: string
  grammar?: string
}

export interface ReciteResult {
  accuracy: number
  expectedWords: string[]
  transcribedWords: string[]
  matchedWords: boolean[]
  xpEarned: number
}

// ─── Constants ────────────────────────────────────────────────
export const RECITERS: { id: Reciter; name: string; nameMs: string }[] = [
  { id: 'ar.alafasy', name: 'Mishary Alafasy', nameMs: 'Mishary' },
  { id: 'ar.abdurrahmaansudais', name: 'Abdurrahman Sudais', nameMs: 'Sudais' },
  { id: 'ar.saaborimuneer', name: 'Saabor Imuneer', nameMs: 'Saabor' },
  { id: 'ar.hudhaify', name: 'Ali Hudhaify', nameMs: 'Hudhaify' },
]

export const SAJDA_AYAHS: Record<number, { ayahs: number[]; types: Record<number, 'sunnah' | 'wajib'> }> = {
  7: { ayahs: [206], types: { 206: 'sunnah' } },
  13: { ayahs: [15], types: { 15: 'sunnah' } },
  16: { ayahs: [50], types: { 50: 'sunnah' } },
  17: { ayahs: [109], types: { 109: 'sunnah' } },
  19: { ayahs: [58], types: { 58: 'sunnah' } },
  22: { ayahs: [18, 77], types: { 18: 'sunnah', 77: 'sunnah' } },
  25: { ayahs: [60], types: { 60: 'sunnah' } },
  27: { ayahs: [26], types: { 26: 'sunnah' } },
  32: { ayahs: [15], types: { 15: 'wajib' } },
  38: { ayahs: [24], types: { 24: 'wajib' } },
  41: { ayahs: [38], types: { 38: 'wajib' } },
  53: { ayahs: [62], types: { 62: 'wajib' } },
  84: { ayahs: [21], types: { 21: 'wajib' } },
  96: { ayahs: [19], types: { 19: 'wajib' } },
}

export const TAJWID_COLORS: Record<string, string> = {
  idgham: '#4a9eff',
  ikhfa: '#4aff7a',
  iqlab: '#ff9a4a',
  izhar: '#ff4a4a',
  qalqalah: '#b44aff',
  mad: '#ffe04a',
}

export const HAFAZAN_LEVEL_COLORS: Record<HafazanLevel, string> = {
  new: '#6a6ab6',
  learning: '#d4af37',
  review: '#4a9eff',
  mastered: '#4aff7a',
}

export const HAFAZAN_LEVEL_MS: Record<HafazanLevel, string> = {
  new: 'Baru',
  learning: 'Belajar',
  review: 'Ulang',
  mastered: 'Kuasai',
}

export const TRANSLIT_MAP: Record<string, string> = {
  'بِسْمِ': 'Bismi', 'ٱللَّهِ': 'Allahi', 'ٱلرَّحْمَـٰنِ': 'Ar-Rahmani', 'ٱلرَّحِيمِ': 'Ar-Rahimi',
  'ٱلْحَمْدُ': 'Alhamdu', 'لِلَّهِ': 'Lillahi', 'رَبِّ': 'Rabbi', 'ٱلْعَـٰلَمِينَ': 'Al-\'Alamin',
  'مَـٰلِكِ': 'Maliki', 'يَوْمِ': 'Yawmi', 'ٱلدِّينِ': 'Ad-Din',
  'إِيَّاكَ': 'Iyyaka', 'نَعْبُدُ': 'Na\'budu', 'وَإِيَّاكَ': 'Wa Iyyaka', 'نَسْتَعِينُ': 'Nasta\'inu',
  'ٱهْدِنَا': 'Ihdina', 'ٱلصِّرَٰطَ': 'As-Sirata', 'ٱلْمُسْتَقِيمَ': 'Al-Mustaqima',
  'صِرَٰطَ': 'Sirata', 'ٱلَّذِينَ': 'Alladhina', 'أَنْعَمْتَ': 'An\'amta', 'عَلَيْهِمْ': 'Alayhim',
  'غَيْرِ': 'Ghayri', 'ٱلْمَغْضُوبِ': 'Al-Maghdubi', 'وَلَا': 'Wa La', 'ٱلضَّآلِّينَ': 'Ad-Dallin',
  'قُلْ': 'Qul', 'هُوَ': 'Huwa', 'أَحَدٌ': 'Ahad', 'ٱلصَّمَدُ': 'As-Samad',
  'لَمْ': 'Lam', 'يَلِدْ': 'Yalid', 'وَلَمْ': 'Wa Lam', 'يُولَدْ': 'Yulad',
  'يَكُن': 'Yakun', 'لَّهُۥ': 'Lahu', 'كُفُوًا': 'Kufuwan',
}

export const FONT_SIZE_MAP: Record<ArabicFontSize, string> = {
  small: 'text-xl',
  medium: 'text-2xl',
  large: 'text-3xl',
  xlarge: 'text-4xl',
}

// ─── Helper ──────────────────────────────────────────────────
export function getAbsoluteAyahNumber(surahId: number, ayahInSurah: number): number {
  let total = 0
  for (let i = 0; i < surahId - 1 && i < SURAH_LIST.length; i++) {
    total += SURAH_LIST[i].versesCount
  }
  return total + ayahInSurah
}
