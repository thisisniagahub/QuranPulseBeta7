'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, ChevronLeft, ChevronRight, Volume2, Star, CheckCircle,
  BookOpen, Brain, MessageCircle, Mic, X, Send, RotateCcw, Shuffle,
  Zap, Trophy, Target, Flame, ArrowRight, Play, Pause, Eye, Lightbulb,
  Award, Pen, BarChart3, Shield, Calendar, Clock, TrendingUp, Lock, CircleDot,
} from 'lucide-react'
import { useQuranPulseStore } from '@/stores/quranpulse-store'
import { HIJAIYAH_LETTERS } from '@/lib/quran-data'

type IqraSubTab = 'belajar' | 'latihan' | 'tajwid' | 'hafazan'
type PracticeMode = 'flashcard' | 'quiz' | 'matching' | 'tulis'
type LetterFilter = 'all' | 'hijaiyah' | 'harakat' | 'tanwin' | 'mad'
interface ChatMsg { role: 'user' | 'ai'; text: string }
const IQRA_BOOKS = [
  { id: 1, title: 'Iqra 1', desc: 'Huruf Hijaiyah', icon: '🔤', color: '#4a4aa6', pages: 28, letters: 29 },
  { id: 2, title: 'Iqra 2', desc: 'Harakat (Baris)', icon: '📌', color: '#6a6ab6', pages: 28, letters: 0 },
  { id: 3, title: 'Iqra 3', desc: 'Tanwin & Mad', icon: '〰️', color: '#d4af37', pages: 28, letters: 0 },
  { id: 4, title: 'Iqra 4', desc: 'Tajwid Lanjutan', icon: '🎯', color: '#e0c060', pages: 28, letters: 0 },
  { id: 5, title: 'Iqra 5', desc: 'Waqaf & Ibtida', icon: '🛑', color: '#3a3a8a', pages: 28, letters: 0 },
  { id: 6, title: 'Iqra 6', desc: 'Bacaan Al-Quran', icon: '📖', color: '#2a2a6a', pages: 28, letters: 0 },
]

const WRITING_TIPS: Record<string, string> = {
  'Alif': 'Lukis garis lurus tegak dari atas ke bawah',
  'Ba': 'Bentuk perut ikan (cekung ke bawah), kemudian satu titik di bawah',
  'Ta': 'Seperti Ba tapi tiga titik di atas — ingat "Ta ada Tiga"',
  'Tsa': 'Seperti Ba tapi tiga titik di atas — sama bentuk dengan Ta',
  'Jim': 'Lukis huruf bengkok dengan titik di dalam — seperti tekuk siku',
  'Ha': 'Bentuk mata — bulatan kecil tanpa titik',
  'Kho': 'Seperti Ha tapi satu titik di atas',
  'Dal': 'Seperti sudut kanan — garis tegak dan bengkok ke kiri',
  'Dzal': 'Seperti Dal tapi satu titik di atas',
  'Ra': 'Lukis bengkok ke bawah — seperti cangkuk kecil',
  'Zai': 'Seperti Ra tapi satu titik di atas',
  'Sin': 'Tiga gigi seperti sisir — ulang tiga lengkung kecil',
  'Syin': 'Tiga gigi dengan tiga titik di atas — "Syin tiga Syarat"',
  'Shod': 'Seperti Sin tapi rata/squarish — bukan melengkung',
  'Dhod': 'Seperti Shod tapi satu titik di atas — huruf khas Arab',
  'Tho': 'Seperti Shod tapi satu titik di atas — bunyi tebal',
  'Zho': 'Seperti Tho tapi satu titik di tengah',
  'Ain': 'Bentuk segitiga/kapak — huruf tekuk 2 tingkat',
  'Ghoin': 'Seperti Ain tapi satu titik di atas',
  'Fa': 'Bentuk cincin dengan satu titik di atas — "Fa satu Fitrah"',
  'Qof': 'Bentuk gelung dengan dua titik di atas — "Qof dua Qiblat"',
  'Kaf': 'Seperti huruf panjang dengan lurus di atas — huruf bersandar',
  'Lam': 'Garis tegak panjang dengan kail di bawah',
  'Mim': 'Bentuk bulatan dengan ekor ke bawah — seperti huruf O dengan kaki',
  'Nun': 'Bentuk cangkuk/mangkuk dengan titik di atas — "Nun satu Nabi"',
  'Ha2': 'Bentuk gelombang kecil — seperti huruf angka 8 separuh',
  'Wau': 'Bentuk cerutu dengan kepala — garis tegak dengan bulatan atas',
  'Ya': 'Bentuk cangkuk dengan dua titik di bawah — "Ya dua Yakin"',
  'Hamzah': 'Lukis seperti huruf eja — dua titik serong seperti zap',
}

const ENHANCED_LETTERS = HIJAIYAH_LETTERS.map(l => ({
  ...l,
  forms: { isolated: l.letter, initial: l.letter, medial: l.letter, final: l.letter },
  nameMs: l.name,
  harakat: {
    fathah: `${l.letter}َ`,
    kasrah: `${l.letter}ِ`,
    dhammah: `${l.letter}ُ`,
    sukun: `${l.letter}ْ`,
    shaddah: `${l.letter}ّ`,
  },
  writingTip: WRITING_TIPS[l.name] || `Mulakan dari kanan ke kiri untuk huruf ${l.name}`,
}))
const HARAKAT_DATA = [
  { id: 'fathah', name: 'Fathah', nameAr: 'فَتْحَة', symbol: 'َ', desc: 'Baris atas — bunyi "a"', example: 'بَ (ba)' },
  { id: 'kasrah', name: 'Kasrah', nameAr: 'كَسْرَة', symbol: 'ِ', desc: 'Baris bawah — bunyi "i"', example: 'بِ (bi)' },
  { id: 'dhammah', name: 'Dhammah', nameAr: 'ضَمَّة', symbol: 'ُ', desc: 'Baris hadapan — bunyi "u"', example: 'بُ (bu)' },
]
const TANWIN_MAD_DATA = [
  { id: 'tanwin-fath', name: 'Tanwin Fathah', nameAr: 'تَنْوِين فَتْحَة', symbol: 'ً', desc: 'Dua baris atas — bunyi "an"', example: 'بًا (ban)' },
  { id: 'tanwin-kasr', name: 'Tanwin Kasrah', nameAr: 'تَنْوِين كَسْرَة', symbol: 'ٍ', desc: 'Dua baris bawah — bunyi "in"', example: 'بٍ (bin)' },
  { id: 'tanwin-dham', name: 'Tanwin Dhammah', nameAr: 'تَنْوِين ضَمَّة', symbol: 'ٌ', desc: 'Dua baris hadapan — bunyi "un"', example: 'بٌ (bun)' },
  { id: 'mad-thabii', name: 'Mad Thabi\'i', nameAr: 'مَدّ طَبِيعِيّ', symbol: 'آ', desc: 'Elongasi 2 harakat', example: 'قَالَ (qaa-la)' },
  { id: 'mad-wajib', name: 'Mad Wajib Muttashil', nameAr: 'مَدّ وَاجِب مُتَّصِل', symbol: 'ً', desc: 'Elongasi wajib 4-5 harakat', example: 'السَّمَاءِ' },
  { id: 'mad-jaiz', name: 'Mad Jaiz Munfashil', nameAr: 'مَدّ جَائِز مُنْفَصِل', symbol: 'ً', desc: 'Elongasi harfiah 2-4 harakat', example: 'يَا أَيُّهَا' },
]
const TAJWID_CATEGORIES = [
  {
    id: 'nun-mati', name: 'Nun Mati / Tanwin', nameAr: 'نُون سَاكِنَة / تَنْوِين', rules: [
      { id: 'izhar', name: 'Izhar', nameAr: 'إِظْهَار', desc: 'Sebutan jelas — huruf halqi (أ ه ع ح غ خ)', example: 'مِنْ أَجْلِ', quranRef: 'Al-Baqarah 2:242' },
      { id: 'idgham', name: 'Idgham', nameAr: 'إِدْغَام', desc: 'Dimasukkan — ي ن م و ل (Yanmul)', example: 'مِن وَلِيّ', quranRef: 'Al-Baqarah 2:107' },
      { id: 'ikhfa', name: 'Ikhfa', nameAr: 'إِخْفَاء', desc: 'Sembunyikan — 15 huruf selepas nun/tanwin', example: 'مِن تَحْتِهَا', quranRef: 'At-Tahrim 66:6' },
      { id: 'iqlab', name: 'Iqlab', nameAr: 'إِقْلَاب', desc: 'Tukar mim — selepas ب', example: 'مِن بَعْدِ', quranRef: 'Al-Baqarah 2:25' },
    ]
  },
  {
    id: 'mim-mati', name: 'Mim Mati', nameAr: 'مِيم سَاكِنَة', rules: [
      { id: 'izhar-mim', name: 'Izhar Syafawi', nameAr: 'إِظْهَار شَفَوِيّ', desc: 'Sebutan jelas — selepas 26 huruf selain mim & ba', example: 'هُمْ فِيهَا', quranRef: 'Al-Baqarah 2:25' },
      { id: 'idgham-mim', name: 'Idgham Mimi', nameAr: 'إِدْغَام مِيمِيّ', desc: 'Masuk mim — selepas mim', example: 'وَمَا لَهُم مِّن', quranRef: 'Al-Baqarah 2:2' },
      { id: 'ikhfa-mim', name: 'Ikhfa Syafawi', nameAr: 'إِخْفَاء شَفَوِيّ', desc: 'Sembunyikan — selepas ba', example: 'وَمَا بِهِم', quranRef: 'Al-Baqarah 2:4' },
    ]
  },
  {
    id: 'mad', name: 'Hukum Mad', nameAr: 'أَحْكَام المَدّ', rules: [
      { id: 'mad-thabii-t', name: 'Mad Thabi\'i', nameAr: 'مَدّ طَبِيعِيّ', desc: 'Mad asli 2 harakat', example: 'قُولُوا', quranRef: 'Al-Baqarah 2:104' },
      { id: 'mad-wajib-t', name: 'Mad Wajib Muttashil', nameAr: 'مَدّ وَاجِب مُتَّصِل', desc: 'Hamzah selepas mad dalam 1 kata — wajib 4-5 harakat', example: 'السَّمَاءِ', quranRef: 'Al-Fatihah 1:1' },
      { id: 'mad-jaiz-t', name: 'Mad Jaiz Munfashil', nameAr: 'مَدّ جَائِز مُنْفَصِل', desc: 'Hamzah selepas mad dalam 2 kata — harfiah 2-4 harakat', example: 'يَا أَيُّهَا', quranRef: 'An-Nisa 4:1' },
    ]
  },
  {
    id: 'qalqalah', name: 'Qalqalah', nameAr: 'قَلْقَلَة', rules: [
      { id: 'qalqalah-kubra', name: 'Qalqalah Kubra', nameAr: 'قَلْقَلَة كُبْرَى', desc: 'Huruf qalqalah diwaqaf — bunyi lebih kuat (ق ط ب ج د)', example: 'الْحَقُّ', quranRef: 'An-Najm 53:44' },
      { id: 'qalqalah-shugra', name: 'Qalqalah Shugra', nameAr: 'قَلْقَلَة صُغْرَى', desc: 'Huruf qalqalah diwasal — bunyi lebih halus', example: 'وَلَقَدْ خَلَقْنَا', quranRef: 'Al-Hijr 15:26' },
    ]
  },
  {
    id: 'waqaf', name: 'Waqaf & Ibtida', nameAr: 'الوَقْف وَالابْتِدَاء', rules: [
      { id: 'waqaf-lazim', name: 'Waqaf Lazim', nameAr: 'وَقْف لَازِم', desc: 'Waqaf wajib — tidak boleh diteruskan', example: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', quranRef: 'Al-Fatihah 1:2' },
      { id: 'waqaf-ikhtiyari', name: 'Waqaf Ikhtiyari', nameAr: 'وَقْف اخْتِيَارِيّ', desc: 'Waqaf pilihan — boleh berhenti atau terus', example: 'الرَّحْمَـٰنِ الرَّحِيمِ', quranRef: 'Al-Fatihah 1:3' },
    ]
  },
]
const BADGES = [
  { id: 'hijaiyah-master', name: 'Hijaiyah Master', icon: '🔤', desc: 'Lengkapkan semua 29 huruf', condition: (ctx: BadgeCtx) => ctx.completedLetters >= 29 },
  { id: 'harakat-hero', name: 'Harakat Hero', icon: '📌', desc: 'Kuasai semua 3 harakat', condition: (ctx: BadgeCtx) => ctx.harakaatMastered >= 3 },
  { id: 'tajwid-star', name: 'Tajwid Star', icon: '⭐', desc: 'Kuasai 5+ hukum tajwid', condition: (ctx: BadgeCtx) => ctx.tajwidRules >= 5 },
  { id: 'hafazan-champ', name: 'Hafazan Champion', icon: '🏆', desc: 'Hafaz 5+ surah', condition: (ctx: BadgeCtx) => ctx.surahsHafaz >= 5 },
  { id: 'iqra-graduate', name: 'Iqra Graduate', icon: '🎓', desc: 'Lengkapkan semua 6 buku Iqra', condition: (ctx: BadgeCtx) => ctx.booksCompleted >= 6 },
  { id: 'streak-warrior', name: 'Streak Warrior', icon: '🔥', desc: '7 hari berturut-turut', condition: (ctx: BadgeCtx) => ctx.streak >= 7 },
]
const LEARNING_PATH = [
  { step: 1, name: 'Huruf Hijaiyah', desc: 'Pelajari 29 huruf', icon: '🔤' },
  { step: 2, name: 'Harakat', desc: 'Kuasai Fathah, Kasrah, Dhammah', icon: '📌' },
  { step: 3, name: 'Tanwin & Mad', desc: 'Tanwin & hukum mad asas', icon: '〰️' },
  { step: 4, name: 'Tajwid Asas', desc: 'Nun/Mim mati, Qalqalah', icon: '🎯' },
  { step: 5, name: 'Bacaan Al-Quran', desc: 'Baca ayat Al-Quran dengan lancar', icon: '📖' },
]
const JAKIM_TAJWID_REFS: Record<string, string> = {
  'nun-mati': 'Rujukan: Panduan Tilawah Al-Quran, JAKIM (2019), ms. 45-58',
  'mim-mati': 'Rujukan: Panduan Tilawah Al-Quran, JAKIM (2019), ms. 59-67',
  'mad': 'Rujukan: Hukum Mad Mengikut Qiraat Nafi\', JAKIM (2020), ms. 12-28',
  'qalqalah': 'Rujukan: Kaedah Tajwid KPM/JAKIM (2018), ms. 88-95',
  'waqaf': 'Rujukan: Panduan Waqaf & Ibtida, JAKIM (2021), ms. 5-22',
}
const DAILY_CHALLENGES = [
  { type: 'sebut' as const, instruction: 'Sebut huruf ini dengan betul', items: ['ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ'] },
  { type: 'harakat' as const, instruction: 'Pilih harakat yang betul', items: ['فَتْحَة', 'كَسْرَة', 'ضَمَّة'] },
]
interface BadgeCtx { completedLetters: number; harakaatMastered: number; tajwidRules: number; surahsHafaz: number; booksCompleted: number; streak: number }
const HAFAZAN_SURAHS = [
  { id: 1, name: 'الفاتحة', nameMs: 'Al-Fatihah', verses: 7, juz: 30 },
  { id: 114, name: 'الناس', nameMs: 'An-Nas', verses: 6, juz: 30 },
  { id: 113, name: 'الفلق', nameMs: 'Al-Falaq', verses: 5, juz: 30 },
  { id: 112, name: 'الإخلاص', nameMs: 'Al-Ikhlas', verses: 4, juz: 30 },
  { id: 111, name: 'المسد', nameMs: 'Al-Masad', verses: 5, juz: 30 },
  { id: 110, name: 'النصر', nameMs: 'An-Nasr', verses: 3, juz: 30 },
  { id: 109, name: 'الكافرون', nameMs: 'Al-Kafirun', verses: 6, juz: 30 },
  { id: 108, name: 'الكوثر', nameMs: 'Al-Kawthar', verses: 3, juz: 30 },
  { id: 107, name: 'الماعون', nameMs: 'Al-Ma\'un', verses: 7, juz: 30 },
  { id: 106, name: 'قريش', nameMs: 'Quraysh', verses: 4, juz: 30 },
  { id: 105, name: 'الفيل', nameMs: 'Al-Fil', verses: 5, juz: 30 },
  { id: 104, name: 'الهمزة', nameMs: 'Al-Humazah', verses: 9, juz: 30 },
  { id: 103, name: 'العصر', nameMs: 'Al-\'Asr', verses: 3, juz: 30 },
  { id: 102, name: 'التكاثر', nameMs: 'At-Takathur', verses: 8, juz: 30 },
  { id: 101, name: 'القارعة', nameMs: 'Al-Qari\'ah', verses: 11, juz: 30 },
  { id: 100, name: 'العاديات', nameMs: 'Al-\'Adiyat', verses: 11, juz: 30 },
  { id: 99, name: 'الزلزلة', nameMs: 'Az-Zalzalah', verses: 8, juz: 30 },
  { id: 98, name: 'البينة', nameMs: 'Al-Bayyinah', verses: 8, juz: 30 },
  { id: 97, name: 'القدر', nameMs: 'Al-Qadr', verses: 5, juz: 30 },
  { id: 96, name: 'العلق', nameMs: 'Al-\'Alaq', verses: 19, juz: 30 },
]
export function IqraTab() {
  const { iqraBook, iqraPage, setIqraBook, setIqraPage, xp, streak, addXp } = useQuranPulseStore()
  const [subTab, setSubTab] = useState<IqraSubTab>('belajar')
  const [completedPages, setCompletedPages] = useState<Set<string>>(new Set())
  const [hafazanProgress, setHafazanProgress] = useState<Record<number, number>>({})
  const [tajwidMastered, setTajwidMastered] = useState<Set<string>>(new Set())
  const [letterFilter, setLetterFilter] = useState<LetterFilter>('all')
  const [showAITutor, setShowAITutor] = useState(false)
  const [showLetterDetail, setShowLetterDetail] = useState<number | null>(null)
  const [selectedTajwidRule, setSelectedTajwidRule] = useState<string | null>(null)

  const [practiceMode, setPracticeMode] = useState<PracticeMode>('flashcard')
  const [flashcardIdx, setFlashcardIdx] = useState(0)
  const [flashcardFlipped, setFlashcardFlipped] = useState(false)
  const [quizQuestion, setQuizQuestion] = useState<{ letter: string; answer: string; options: string[] } | null>(null)
  const [quizScore, setQuizScore] = useState(0)
  const [matchingPairs, setMatchingPairs] = useState<Array<{ id: number; arabic: string; name: string; matched: boolean }>>([])
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null)
  const [matchScore, setMatchScore] = useState(0)
  const [aiMessages, setAiMessages] = useState<ChatMsg[]>([])
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const [earnedBadges, setEarnedBadges] = useState<string[]>([])
  const [challengeXp, setChallengeXp] = useState(0)
  const [writingLetter, setWritingLetter] = useState(0)
  const [writingFeedback, setWritingFeedback] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [learningMode, setLearningMode] = useState<'kids' | 'adult'>('kids')
  const [assessmentActive, setAssessmentActive] = useState(false)
  const [assessmentIdx, setAssessmentIdx] = useState(0)
  const [assessmentScore, setAssessmentScore] = useState(0)
  const [assessmentLetters, setAssessmentLetters] = useState<typeof ENHANCED_LETTERS[number][]>([])
  const [assessmentDone, setAssessmentDone] = useState(false)
  const [assessmentOptions, setAssessmentOptions] = useState<string[][]>([])
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentBook = IQRA_BOOKS.find(b => b.id === iqraBook) || IQRA_BOOKS[0]
  const pageKey = `${iqraBook}-${iqraPage}`
  const totalPagesCompleted = completedPages.size
  const overallProgress = Math.round((totalPagesCompleted / 168) * 100)
  const bookProgress = (bookId: number) => {
    const done = [...completedPages].filter(p => p.startsWith(`${bookId}-`)).length
    return Math.round((done / 28) * 100)
  }
  const totalTajwidRules = TAJWID_CATEGORIES.reduce((s, c) => s + c.rules.length, 0)
  const totalHafazanVerses = HAFAZAN_SURAHS.reduce((s, v) => s + v.verses, 0)
  const hafazanVersesDone = Object.values(hafazanProgress).reduce((s, v) => s + v, 0)

  // === NEW: Badge computation ===
  const completedLettersCount = [...completedPages].filter(p => p.startsWith('1-')).length >= 5 ? 29 : [...completedPages].filter(p => p.startsWith('1-')).length * 6
  const booksCompletedCount = IQRA_BOOKS.filter(b => bookProgress(b.id) === 100).length
  const surahsHafazCount = Object.entries(hafazanProgress).filter(([id, v]) => {
    const surah = HAFAZAN_SURAHS.find(s => s.id === Number(id))
    return surah && v >= surah.verses
  }).length
  const badgeCtx: BadgeCtx = {
    completedLetters: Math.min(29, completedLettersCount),
    harakaatMastered: bookProgress(2) >= 50 ? 3 : bookProgress(2) >= 20 ? 1 : 0,
    tajwidRules: tajwidMastered.size,
    surahsHafaz: surahsHafazCount,
    booksCompleted: booksCompletedCount,
    streak,
  }
  useEffect(() => {
    const earned = BADGES.filter(b => b.condition(badgeCtx)).map(b => b.id)
    setEarnedBadges(prev => {
      const newBadges = earned.filter(b => !prev.includes(b))
      if (newBadges.length > 0) newBadges.forEach(() => addXp(50))
      return earned
    })
  }, [badgeCtx.completedLetters, badgeCtx.harakaatMastered, badgeCtx.tajwidRules, badgeCtx.surahsHafaz, badgeCtx.booksCompleted, badgeCtx.streak])

  // === NEW: Learning path progress ===
  const pathProgress = [
    Math.min(100, Math.round((completedLettersCount / 29) * 100)),
    bookProgress(2),
    bookProgress(3),
    Math.round((tajwidMastered.size / totalTajwidRules) * 100),
    Math.round(((bookProgress(4) + bookProgress(5) + bookProgress(6)) / 3)),
  ]

  // === NEW: Daily challenge ===
  const dailySeed = Math.floor(Date.now() / 86400000)
  const dailyChallengeIdx = dailySeed % DAILY_CHALLENGES.length
  const dailyChallenge = DAILY_CHALLENGES[dailyChallengeIdx]
  const dailyItem = dailyChallenge.items[dailySeed % dailyChallenge.items.length]

  // === NEW: JAKIM skill level ===
  const overallMastery = Math.round((overallProgress + (tajwidMastered.size / totalTajwidRules) * 100 + (hafazanVersesDone / totalHafazanVerses) * 100) / 3)
  const jakimLevel: { level: string; color: string } = overallMastery >= 75 ? { level: 'Lanjutan (Advanced)', color: '#d4af37' } : overallMastery >= 40 ? { level: 'Pertengahan (Intermediate)', color: '#4a4aa6' } : { level: 'Pemula (Beginner)', color: '#6a6ab6' }

  // === NEW: Weekly activity (simulated from XP) ===
  const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
    const dayOffset = (6 - i)
    const base = dayOffset === 0 ? xp % 50 : ((xp + dayOffset * 7) % 40) + 10
    return Math.min(100, base)
  })
  const dayNames = ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab']

  // === NEW: Strongest/weakest areas ===
  const areaScores = [
    { name: 'Huruf Hijaiyah', score: Math.min(100, Math.round((completedLettersCount / 29) * 100)) },
    { name: 'Harakat', score: bookProgress(2) },
    { name: 'Tanwin & Mad', score: bookProgress(3) },
    { name: 'Tajwid', score: Math.round((tajwidMastered.size / totalTajwidRules) * 100) },
    { name: 'Hafazan', score: Math.round((hafazanVersesDone / totalHafazanVerses) * 100) },
  ]
  const strongest = areaScores.reduce((a, b) => a.score >= b.score ? a : b)
  const weakest = areaScores.reduce((a, b) => a.score <= b.score ? a : b)

  // === NEW: Canvas drawing handlers ===
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setWritingFeedback(null)
  }, [])
  const checkWriting = useCallback(async () => {
    const letter = ENHANCED_LETTERS[writingLetter]
    try {
      const res = await fetch('/api/ustaz-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Nilai tulisan huruf ${letter.name} (${letter.letter}). Beri nasihat singkat dalam Bahasa Melayu.`, persona: 'ustazah', history: [] }),
      })
      const data = await res.json()
      setWritingFeedback(data.response || 'Cuba lagi! Latihan menjadikan sempurna.')
    } catch { setWritingFeedback('Cuba lagi! Teruskan berlatih menulis.') }
    addXp(10)
  }, [writingLetter, addXp])
  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    setIsDrawing(true)
    ctx.beginPath()
    const rect = canvas.getBoundingClientRect()
    let x: number, y: number
    if ('touches' in e) { x = e.touches[0].clientX - rect.left; y = e.touches[0].clientY - rect.top }
    else { x = e.clientX - rect.left; y = e.clientY - rect.top }
    ctx.moveTo(x * (canvas.width / rect.width), y * (canvas.height / rect.height))
  }, [])
  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    let x: number, y: number
    if ('touches' in e) { e.preventDefault(); x = e.touches[0].clientX - rect.left; y = e.touches[0].clientY - rect.top }
    else { x = e.clientX - rect.left; y = e.clientY - rect.top }
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#d4af37'
    ctx.lineTo(x * (canvas.width / rect.width), y * (canvas.height / rect.height))
    ctx.stroke()
  }, [isDrawing])
  const stopDraw = useCallback(() => setIsDrawing(false), [])

  // === Auto-play letters sequentially ===
  const startAutoPlay = useCallback(() => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false)
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current)
      return
    }
    setIsAutoPlaying(true)
    let idx = 0
    const playNext = () => {
      if (idx >= filteredLetters.length) { setIsAutoPlaying(false); return }
      const letter = filteredLetters[idx]
      playAudio(letter.name, `auto-${letter.id}`)
      idx++
      autoPlayRef.current = setTimeout(playNext, 2500)
    }
    playNext()
  }, [isAutoPlaying, filteredLetters, playAudio])

  // === NEW: Daily challenge handlers ===
  const handleHarakatChallenge = useCallback((choice: string) => {
    const correct = dailyItem
    if (choice.includes(correct.charAt(0))) {
      setChallengeXp(prev => prev + 20)
      addXp(20)
    }
  }, [dailyItem, addXp])

  const markComplete = useCallback(() => {
    setCompletedPages(prev => new Set([...prev, pageKey]))
    addXp(25)
  }, [pageKey, addXp])
  const navigatePage = (delta: number) => {
    const newPage = Math.max(1, Math.min(currentBook.pages, iqraPage + delta))
    setIqraPage(newPage)
  }
  const playAudio = async (text: string, id: string, speed?: number) => {
    if (playingAudio === id) return
    setPlayingAudio(id)
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'tongtong', speed: speed || audioSpeed }),
      })
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audio.onended = () => { URL.revokeObjectURL(url); setPlayingAudio(null) }
        audio.onerror = () => { URL.revokeObjectURL(url); setPlayingAudio(null) }
        await audio.play()
      } else { setPlayingAudio(null) }
    } catch { setPlayingAudio(null) }
  }
  const sendAI = async () => {
    if (!aiInput.trim() || aiLoading) return
    const msg = aiInput.trim()
    setAiInput('')
    setAiMessages(prev => [...prev, { role: 'user', text: msg }])
    setAiLoading(true)
    try {
      const res = await fetch('/api/ustaz-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `[Guru Iqra] ${msg}`, persona: 'ustazah', history: aiMessages.slice(-6) }),
      })
      const data = await res.json()
      setAiMessages(prev => [...prev, { role: 'ai', text: data.response || 'Maaf, saya tidak dapat menjawab soalan itu sekarang.' }])
    } catch {
      setAiMessages(prev => [...prev, { role: 'ai', text: 'Maaf, guru AI tidak tersedia sekarang. Sila cuba lagi.' }])
    }
    setAiLoading(false)
  }
  const generateQuiz = () => {
    const idx = Math.floor(Math.random() * ENHANCED_LETTERS.length)
    const correct = ENHANCED_LETTERS[idx]
    const options = [correct.name]
    while (options.length < 4) {
      const r = ENHANCED_LETTERS[Math.floor(Math.random() * ENHANCED_LETTERS.length)].name
      if (!options.includes(r)) options.push(r)
    }
    options.sort(() => Math.random() - 0.5)
    setQuizQuestion({ letter: correct.letter, answer: correct.name, options })
  }
  const initMatching = () => {
    const subset = ENHANCED_LETTERS.slice(0, 6)
    const pairs = subset.map((l, i) => ({ id: i, arabic: l.letter, name: l.name, matched: false }))
    const shuffled = [...pairs].sort(() => Math.random() - 0.5)
    setMatchingPairs(shuffled)
    setSelectedMatch(null)
    setMatchScore(0)
  }

  useEffect(() => { if (practiceMode === 'quiz' && !quizQuestion) generateQuiz() }, [practiceMode])
  useEffect(() => { if (practiceMode === 'matching' && matchingPairs.length === 0) initMatching() }, [practiceMode])
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [aiMessages])

  // Auto-play TTS when letter detail modal opens
  useEffect(() => {
    if (showLetterDetail !== null) {
      const l = ENHANCED_LETTERS[showLetterDetail]
      playAudio(l.name, `letter-auto-${l.id}`)
    }
  }, [showLetterDetail])

  // Assessment helper functions
  const startAssessment = useCallback(() => {
    const shuffled = [...ENHANCED_LETTERS].sort(() => Math.random() - 0.5)
    const picked = shuffled.slice(0, 5)
    setAssessmentLetters(picked)
    setAssessmentIdx(0)
    setAssessmentScore(0)
    setAssessmentDone(false)
    setAssessmentActive(true)
    const opts = picked.map(letter => {
      const correct = letter.name
      const options = [correct]
      while (options.length < 4) {
        const r = ENHANCED_LETTERS[Math.floor(Math.random() * ENHANCED_LETTERS.length)].name
        if (!options.includes(r)) options.push(r)
      }
      return options.sort(() => Math.random() - 0.5)
    })
    setAssessmentOptions(opts)
  }, [])
  const SUB_TABS: { key: IqraSubTab; label: string; icon: React.ReactNode }[] = [
    { key: 'belajar', label: 'Belajar', icon: <BookOpen className="h-4 w-4" /> },
    { key: 'latihan', label: 'Latihan', icon: <Brain className="h-4 w-4" /> },
    { key: 'tajwid', label: 'Tajwid', icon: <Target className="h-4 w-4" /> },
    { key: 'hafazan', label: 'Hafazan', icon: <GraduationCap className="h-4 w-4" /> },
  ]
  const filteredLetters = letterFilter === 'harakat' || letterFilter === 'tanwin' || letterFilter === 'mad'
    ? [] // harakat/tanwin/mad use separate data, not letter grid
    : ENHANCED_LETTERS.filter(l => {
        if (letterFilter === 'all' || letterFilter === 'hijaiyah') return true
        return false
      })
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-2 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-bold" style={{ color: '#ffffff' }}>Iqra Digital</h2>
              {playingAudio && (
                <motion.span
                  className="text-sm"
                  style={{ color: '#d4af37' }}
                  animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
                  transition={{ type: 'tween', duration: 1.2, repeat: Infinity }}
                >♪</motion.span>
              )}
              <span className="px-1.5 py-0.5 rounded text-[7px] font-bold" style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.25)' }}>JAKIM</span>
            </div>
            <p className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Belajar membaca Al-Quran</p>
            {/* Learning Mode Toggle */}
            <div className="flex gap-1 mt-1">
              <button
                className="px-2.5 py-0.5 rounded-full text-[9px] font-medium transition-all"
                style={{
                  background: learningMode === 'kids' ? 'rgba(212,175,55,0.15)' : 'transparent',
                  color: learningMode === 'kids' ? '#d4af37' : 'rgba(204,204,204,0.4)',
                  border: learningMode === 'kids' ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
                }}
                onClick={() => setLearningMode('kids')}
              >🧒 Kanak-kanak</button>
              <button
                className="px-2.5 py-0.5 rounded-full text-[9px] font-medium transition-all"
                style={{
                  background: learningMode === 'adult' ? 'rgba(212,175,55,0.15)' : 'transparent',
                  color: learningMode === 'adult' ? '#d4af37' : 'rgba(204,204,204,0.4)',
                  border: learningMode === 'adult' ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
                }}
                onClick={() => setLearningMode('adult')}
              >👨 Dewasa</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(212,175,55,0.12)' }}>
              <Flame className="h-3 w-3" style={{ color: '#d4af37' }} />
              <span className="text-[10px] font-bold" style={{ color: '#d4af37' }}>{streak}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(74,74,166,0.12)' }}>
              <Zap className="h-3 w-3" style={{ color: '#4a4aa6' }} />
              <span className="text-[10px] font-bold" style={{ color: '#4a4aa6' }}>{xp}</span>
            </div>
          </div>
          {/* Audio Speed Control */}
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-[8px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Kelajuan:</span>
            {[
              { label: '🐢', speed: 0.6, tip: 'Perlahan (kanak-kanak)' },
              { label: '🔄', speed: 1.0, tip: 'Biasa' },
              { label: '🚀', speed: 1.3, tip: 'Pantas' },
            ].map(s => (
              <button
                key={s.speed}
                className="px-1.5 py-0.5 rounded text-[10px]"
                style={{
                  background: Math.abs(audioSpeed - s.speed) < 0.01 ? 'rgba(212,175,55,0.15)' : 'transparent',
                  border: Math.abs(audioSpeed - s.speed) < 0.01 ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
                  color: Math.abs(audioSpeed - s.speed) < 0.01 ? '#d4af37' : 'rgba(204,204,204,0.4)',
                }}
                onClick={() => setAudioSpeed(s.speed)}
                title={s.tip}
              >{s.label}</button>
            ))}
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(42,42,106,0.4)' }}>
          {SUB_TABS.map(tab => (
            <button
              key={tab.key}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-medium transition-all"
              style={{
                background: subTab === tab.key ? 'rgba(74,74,166,0.25)' : 'transparent',
                color: subTab === tab.key ? '#ffffff' : 'rgba(204,204,204,0.5)',
                border: subTab === tab.key ? '1px solid rgba(74,74,166,0.3)' : '1px solid transparent',
              }}
              onClick={() => setSubTab(tab.key)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={subTab}
          className="qp-scroll flex-1 overflow-y-auto px-4 pb-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {subTab === 'belajar' && <BelajarView />}
          {subTab === 'latihan' && <LatihanView />}
          {subTab === 'tajwid' && <TajwidView />}
          {subTab === 'hafazan' && <HafazanView />}
        </motion.div>
      </AnimatePresence>

      {/* AI Tutor FAB */}
      <button
        className="fixed bottom-24 right-4 z-30 h-12 w-12 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #4a4aa6, #6a6ab6)',
          boxShadow: '0 4px 15px rgba(74,74,166,0.4)',
        }}
        onClick={() => setShowAITutor(true)}
      >
        <MessageCircle className="h-5 w-5 text-white" />
      </button>

      {/* AI Tutor Bottom Sheet */}
      <AnimatePresence>
        {showAITutor && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowAITutor(false)} />
            <motion.div
              className="relative w-full max-w-[480px] rounded-t-2xl flex flex-col"
              style={{ background: '#1a1a4a', border: '1px solid rgba(74,74,166,0.2)', maxHeight: '70vh' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
            >
              {/* Header */}
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(74,74,166,0.1)' }}>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(74,74,166,0.2)' }}>
                    <GraduationCap className="h-4 w-4" style={{ color: '#4a4aa6' }} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: '#ffffff' }}>Tanya Cikgu</div>
                    <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Guru Iqra AI</div>
                  </div>
                </div>
                <button onClick={() => setShowAITutor(false)}>
                  <X className="h-5 w-5" style={{ color: 'rgba(204,204,204,0.5)' }} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 qp-scroll" style={{ maxHeight: '40vh' }}>
                {aiMessages.length === 0 && (
                  <div className="text-center py-4">
                    <div className="text-2xl mb-2">🤲</div>
                    <div className="text-xs" style={{ color: 'rgba(204,204,204,0.6)' }}>Tanya apa-apa tentang tajwid, harakat, atau Iqra</div>
                    <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
                      {['Apa itu Idgham?', 'Bila guna Mad Wajib?', 'Cara baca Tanwin'].map(q => (
                        <button
                          key={q}
                          className="px-2.5 py-1 rounded-full text-[10px]"
                          style={{ background: 'rgba(74,74,166,0.12)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.2)' }}
                          onClick={() => { setAiInput(q) }}
                        >{q}</button>
                      ))}
                    </div>
                  </div>
                )}
                {aiMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div
                      className="max-w-[80%] rounded-xl px-3 py-2 text-xs"
                      style={{
                        background: msg.role === 'user' ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.6)',
                        border: `1px solid ${msg.role === 'user' ? 'rgba(74,74,166,0.3)' : 'rgba(74,74,166,0.1)'}`,
                        color: '#ffffff',
                      }}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {aiLoading && (
                  <div className="flex gap-1 px-3 py-2">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="h-2 w-2 rounded-full"
                        style={{ background: '#4a4aa6' }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ type: 'tween', duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="px-3 py-2 flex items-center gap-2" style={{ borderTop: '1px solid rgba(74,74,166,0.1)' }}>
                <button
                  className="p-2 rounded-lg"
                  style={{ background: 'rgba(74,74,166,0.12)' }}
                  onClick={() => playAudio('Sila baca selepas ini', 'voice-input')}
                >
                  <Mic className="h-4 w-4" style={{ color: '#4a4aa6' }} />
                </button>
                <input
                  className="flex-1 rounded-lg px-3 py-2 text-xs outline-none"
                  style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.15)', color: '#ffffff' }}
                  placeholder="Tanya soalan..."
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendAI()}
                />
                <button
                  className="p-2 rounded-lg"
                  style={{ background: 'rgba(74,74,166,0.3)' }}
                  onClick={sendAI}
                  disabled={aiLoading}
                >
                  <Send className="h-4 w-4" style={{ color: '#4a4aa6' }} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letter Detail Modal */}
      <AnimatePresence>
        {showLetterDetail !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowLetterDetail(null)} />
            <motion.div
              className="relative w-[90%] max-w-[380px] rounded-2xl p-5"
              style={{ background: '#1a1a4a', border: '1px solid rgba(74,74,166,0.25)' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button className="absolute top-3 right-3" onClick={() => setShowLetterDetail(null)}>
                <X className="h-4 w-4" style={{ color: 'rgba(204,204,204,0.5)' }} />
              </button>
              {(() => {
                const l = ENHANCED_LETTERS[showLetterDetail]
                const encouragements = ['Hebat! 🌟', 'Cuba lagi! 💪', 'Bagus! ⭐', 'Teruskan! 🚀']
                const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)]
                const playAllHarakat = () => {
                  const entries = Object.entries(l.harakat)
                  entries.forEach(([key, val], i) => {
                    setTimeout(() => playAudio(val, `${l.id}-all-${key}`), i * 1500)
                  })
                }
                const harakatBg = (key: string) => {
                  if (learningMode === 'kids') {
                    if (key === 'fathah') return 'rgba(212,175,55,0.12)'
                    if (key === 'kasrah') return 'rgba(74,74,166,0.12)'
                    if (key === 'dhammah') return 'rgba(128,90,182,0.12)'
                    if (key === 'shaddah') return 'rgba(212,175,55,0.08)'
                    if (key === 'sukun') return 'rgba(106,106,182,0.08)'
                  }
                  return key === 'shaddah' ? 'rgba(212,175,55,0.08)' : key === 'sukun' ? 'rgba(106,106,182,0.08)' : 'rgba(74,74,166,0.08)'
                }
                const harakatBorder = (key: string) => {
                  if (learningMode === 'kids') {
                    if (key === 'fathah') return 'rgba(212,175,55,0.25)'
                    if (key === 'kasrah') return 'rgba(74,74,166,0.25)'
                    if (key === 'dhammah') return 'rgba(128,90,182,0.25)'
                    if (key === 'shaddah') return 'rgba(212,175,55,0.15)'
                    if (key === 'sukun') return 'rgba(106,106,182,0.15)'
                  }
                  return key === 'shaddah' ? 'rgba(212,175,55,0.15)' : key === 'sukun' ? 'rgba(106,106,182,0.15)' : 'rgba(74,74,166,0.12)'
                }
                return (
                  <div className="text-center">
                    <div className={`${learningMode === 'kids' ? 'text-8xl' : 'text-7xl'} font-arabic mb-2`} style={{ color: '#4a4aa6' }}>{l.letter}</div>
                    <div className="text-sm font-bold" style={{ color: '#ffffff' }}>{l.name}</div>
                    <div className="text-[10px] mb-1" style={{ color: 'rgba(204,204,204,0.5)' }}>{l.nameEn}</div>
                    {learningMode === 'kids' && (
                      <div className="text-sm mb-2" style={{ color: '#d4af37' }}>{encouragement}</div>
                    )}

                    {/* Harakat Examples — 5 baris */}
                    <div className="mb-1">
                      <div className="text-[9px] font-semibold mb-1.5" style={{ color: '#4a4aa6' }}>Baris (Harakat) — Ketik untuk dengar</div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {Object.entries(l.harakat).map(([key, val]) => (
                          <motion.div
                            key={key}
                            className={`rounded-lg text-center cursor-pointer ${learningMode === 'kids' ? 'p-2.5' : 'p-1.5'}`}
                            style={{ background: harakatBg(key), border: `1px solid ${harakatBorder(key)}` }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => playAudio(val, `${l.id}-${key}`)}
                          >
                            <div className={`${learningMode === 'kids' ? 'text-2xl' : 'text-xl'} font-arabic`} style={{ color: '#ffffff' }}>{val}</div>
                            <div className={`${learningMode === 'kids' ? 'text-[8px]' : 'text-[7px]'} capitalize`} style={{ color: 'rgba(204,204,204,0.5)' }}>{key}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Kids: Dengar Semua Baris button */}
                    {learningMode === 'kids' && (
                      <button
                        className="flex items-center gap-1.5 mx-auto px-3 py-1.5 rounded-lg text-[10px] mt-2 mb-2"
                        style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)' }}
                        onClick={playAllHarakat}
                      >
                        <Volume2 className="h-3 w-3" /> Dengar Semua Baris
                      </button>
                    )}

                    {/* Adult: Bentuk Huruf (Letter Forms) */}
                    {learningMode === 'adult' && (
                      <div className="mt-2 mb-2">
                        <div className="text-[9px] font-semibold mb-1.5" style={{ color: '#4a4aa6' }}>Bentuk Huruf — Ketik untuk dengar</div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { label: 'Awal (Initial)', form: l.forms.initial },
                            { label: 'Tengah (Medial)', form: l.forms.medial },
                            { label: 'Akhir (Final)', form: l.forms.final },
                            { label: 'Bersendirian (Isolated)', form: l.forms.isolated },
                          ].map(({ label, form }) => (
                            <motion.button
                              key={label}
                              className="rounded-lg p-2 text-center"
                              style={{ background: 'rgba(74,74,166,0.08)', border: '1px solid rgba(74,74,166,0.12)' }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => playAudio(`${l.name} ${label.split(' ')[0].toLowerCase()}`, `form-${l.id}-${label}`)}
                            >
                              <div className="text-2xl font-arabic" style={{ color: '#ffffff' }}>{form}</div>
                              <div className="text-[7px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{label}</div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Writing Tip */}
                    <div
                      className="rounded-xl p-3 text-left mb-3"
                      style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)' }}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Lightbulb className="h-3 w-3" style={{ color: '#d4af37' }} />
                        <span className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>Petua Penulisan</span>
                      </div>
                      <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.6)' }}>{l.writingTip}</div>
                    </div>

                    {/* Audio Buttons */}
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs"
                        style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.25)' }}
                        onClick={() => playAudio(l.name, `letter-${l.id}`)}
                      >
                        <Volume2 className="h-3.5 w-3.5" /> Dengar Sebutan
                      </button>
                      <button
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs"
                        style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)' }}
                        onClick={() => playAudio(l.name, `letter-repeat-${l.id}`)}
                      >
                        🔁 Ulang
                      </button>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
  function BelajarView() {
    const [view, setView] = useState<'books' | 'reader' | 'letters'>('books')

    if (view === 'reader') {
      return (
        <div>
          <div className="flex items-center justify-between mb-3">
            <button className="flex items-center gap-1 text-xs" style={{ color: '#4a4aa6' }} onClick={() => setView('books')}>
              <ChevronLeft className="h-4 w-4" /> Kembali
            </button>
            <div className="text-center">
              <div className="text-xs font-semibold" style={{ color: currentBook.color }}>Iqra {iqraBook}</div>
              <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Halaman {iqraPage}/{currentBook.pages}</div>
            </div>
            <button className="p-1.5 rounded-lg" style={{ background: 'rgba(74,74,166,0.12)' }} onClick={markComplete}>
              {completedPages.has(pageKey) ? <CheckCircle className="h-4 w-4" style={{ color: '#4a4aa6' }} /> : <Star className="h-4 w-4" style={{ color: '#4a4aa6' }} />}
            </button>
          </div>
          <div className="h-1 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(74,74,166,0.1)' }}>
            <motion.div className="h-full rounded-full" style={{ background: currentBook.color }} animate={{ width: `${(iqraPage / currentBook.pages) * 100}%` }} />
          </div>
          <motion.div
            className="rounded-xl p-5 min-h-[350px] flex flex-col items-center justify-center"
            style={{ background: 'rgba(42,42,106,0.3)', border: `1px solid ${currentBook.color}20` }}
            key={pageKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {renderIqraContent()}
            <button
              className="mt-5 flex items-center gap-2 px-4 py-2 rounded-xl text-[11px]"
              style={{ background: `${currentBook.color}15`, color: currentBook.color, border: `1px solid ${currentBook.color}25` }}
              onClick={() => playAudio(getIqraAudioText(), `iqra-${pageKey}`)}
            >
              {playingAudio === `iqra-${pageKey}` ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              Dengar Bacaan
            </button>
          </motion.div>
          <div className="flex justify-between mt-3">
            <button
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-[11px]"
              style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.12)', color: iqraPage > 1 ? '#4a4aa6' : 'rgba(204,204,204,0.3)' }}
              disabled={iqraPage <= 1} onClick={() => navigatePage(-1)}
            ><ChevronLeft className="h-3.5 w-3.5" /> Sebelum</button>
            {completedPages.has(pageKey) && <span className="text-[10px] self-center" style={{ color: '#4a4aa6' }}>✓ Selesai</span>}
            <button
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-[11px]"
              style={{ background: `${currentBook.color}15`, border: `1px solid ${currentBook.color}25`, color: currentBook.color }}
              disabled={iqraPage >= currentBook.pages} onClick={() => navigatePage(1)}
            >Seterusnya <ChevronRight className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      )
    }

    if (view === 'letters') {
      return (
        <div>
          <div className="flex items-center justify-between mb-3">
            <button className="flex items-center gap-1 text-xs" style={{ color: '#4a4aa6' }} onClick={() => setView('books')}>
              <ChevronLeft className="h-4 w-4" /> Kembali
            </button>
            <span className="text-xs font-semibold" style={{ color: '#ffffff' }}>Huruf Hijaiyah</span>
            <div style={{ width: 60 }} />
          </div>
          <div className="flex gap-1.5 mb-3 overflow-x-auto">
            {(['all', 'hijaiyah', 'harakat', 'tanwin', 'mad'] as LetterFilter[]).map(f => (
              <button
                key={f}
                className="px-3 py-1 rounded-full text-[10px] capitalize whitespace-nowrap"
                style={{
                  background: letterFilter === f ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.4)',
                  color: letterFilter === f ? '#ffffff' : 'rgba(204,204,204,0.5)',
                  border: `1px solid ${letterFilter === f ? 'rgba(74,74,166,0.3)' : 'transparent'}`,
                }}
                onClick={() => setLetterFilter(f)}
              >{f === 'all' ? 'Semua' : f === 'hijaiyah' ? 'Huruf' : f === 'harakat' ? 'Baris' : f === 'tanwin' ? 'Tanwin' : 'Mad'}</button>
            ))}
            {/* Auto-play button */}
            {(letterFilter === 'all' || letterFilter === 'hijaiyah') && filteredLetters.length > 0 && (
              <button
                className="px-2.5 py-1 rounded-full text-[10px] whitespace-nowrap flex items-center gap-1"
                style={{
                  background: isAutoPlaying ? 'rgba(212,175,55,0.15)' : 'rgba(42,42,106,0.4)',
                  border: `1px solid ${isAutoPlaying ? 'rgba(212,175,55,0.3)' : 'transparent'}`,
                  color: isAutoPlaying ? '#d4af37' : 'rgba(204,204,204,0.5)',
                }}
                onClick={startAutoPlay}
              >
                {isAutoPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {isAutoPlaying ? 'Henti' : 'Auto'}
              </button>
            )}
          </div>
          {(letterFilter === 'all' || letterFilter === 'hijaiyah') && (
          <div className={`grid ${learningMode === 'kids' ? 'grid-cols-3' : 'grid-cols-5'} gap-2`}>
            {filteredLetters.map((letter, i) => (
              <motion.button
                key={letter.id}
                className="aspect-square rounded-xl flex flex-col items-center justify-center relative"
                style={{
                  background: 'rgba(42,42,106,0.5)',
                  border: playingAudio === `letter-grid-${letter.id}`
                    ? '2px solid #d4af37'
                    : '1px solid rgba(74,74,166,0.1)',
                  boxShadow: learningMode === 'kids'
                    ? '0 0 12px rgba(212,175,55,0.08)'
                    : playingAudio === `letter-grid-${letter.id}`
                      ? '0 0 8px rgba(212,175,55,0.3)'
                      : 'none',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  ...(playingAudio === `letter-grid-${letter.id}` ? { scale: [1, 1.05, 1] } : {}),
                }}
                transition={{ delay: i * 0.015, ...(playingAudio === `letter-grid-${letter.id}` ? { type: 'tween' as const, repeat: Infinity, duration: 1 } : {}) }}
                onClick={() => { setShowLetterDetail(i); playAudio(letter.name, `letter-grid-${letter.id}`) }}
              >
                <span className={`${learningMode === 'kids' ? 'text-3xl' : 'text-lg'}`} style={{ color: '#ffffff' }}>{letter.letter}</span>
                <span className={`${learningMode === 'kids' ? 'text-[10px]' : 'text-[7px]'} mt-0.5`} style={{ color: 'rgba(204,204,204,0.5)' }}>{letter.name}</span>
                {learningMode === 'kids' && (
                  <span className="absolute bottom-1 right-1 text-[10px]" style={{ color: 'rgba(212,175,55,0.5)' }}>🔊</span>
                )}
              </motion.button>
            ))}
          </div>
          )}
          {learningMode === 'kids' && (letterFilter === 'all' || letterFilter === 'hijaiyah') && (
            <div className="text-center mt-2">
              <span className="text-[10px]" style={{ color: 'rgba(212,175,55,0.6)' }}>Ketik untuk dengar! 🔊</span>
            </div>
          )}
          {letterFilter === 'harakat' && (
            <div className="grid grid-cols-2 gap-2.5">
              {[...HARAKAT_DATA,
                { id: 'sukun', name: 'Sukun', nameAr: 'سُكُون', symbol: 'ْ', desc: 'Tanpa baris — huruf mati', example: 'بْ (b)' },
                { id: 'shaddah', name: 'Syaddah', nameAr: 'شَدَّة', symbol: 'ّ', desc: 'Gandaan — bunyi berulang', example: 'بّ (bb)' },
              ].map(h => (
                <motion.button
                  key={h.id}
                  className="rounded-xl p-4 text-center"
                  style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.12)' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => playAudio(h.example.replace(/[()]/g, '').trim(), `harakat-${h.id}`, 0.7)}
                >
                  <div className="text-4xl font-arabic mb-1" style={{ color: '#d4af37' }}>{h.symbol}</div>
                  <div className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{h.name}</div>
                  <div className="text-2xl font-arabic my-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{h.nameAr}</div>
                  <div className="text-[9px] mb-1.5" style={{ color: 'rgba(204,204,204,0.5)' }}>{h.desc}</div>
                  <div className="text-lg font-arabic" style={{ color: '#4a4aa6' }}>{h.example}</div>
                  <Volume2 className="h-3 w-3 mx-auto mt-1.5" style={{ color: 'rgba(74,74,166,0.4)' }} />
                </motion.button>
              ))}
            </div>
          )}
          {letterFilter === 'tanwin' && (
            <div className="grid grid-cols-2 gap-2.5">
              {TANWIN_MAD_DATA.filter(t => t.id.startsWith('tanwin')).map(t => (
                <motion.button
                  key={t.id}
                  className="rounded-xl p-4 text-center"
                  style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.12)' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => playAudio(t.example.replace(/[()]/g, '').trim(), `tanwin-${t.id}`, 0.7)}
                >
                  <div className="text-4xl font-arabic mb-1" style={{ color: '#d4af37' }}>{t.symbol}</div>
                  <div className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{t.name}</div>
                  <div className="text-2xl font-arabic my-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{t.nameAr}</div>
                  <div className="text-[9px] mb-1.5" style={{ color: 'rgba(204,204,204,0.5)' }}>{t.desc}</div>
                  <div className="text-lg font-arabic" style={{ color: '#4a4aa6' }}>{t.example}</div>
                  <Volume2 className="h-3 w-3 mx-auto mt-1.5" style={{ color: 'rgba(74,74,166,0.4)' }} />
                </motion.button>
              ))}
            </div>
          )}
          {letterFilter === 'mad' && (
            <div className="grid grid-cols-1 gap-2.5">
              {TANWIN_MAD_DATA.filter(t => t.id.startsWith('mad')).map(t => (
                <motion.button
                  key={t.id}
                  className="rounded-xl p-4 text-center"
                  style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.12)' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => playAudio(t.example.replace(/[()]/g, '').trim(), `mad-${t.id}`, 0.7)}
                >
                  <div className="text-[11px] font-semibold mb-1" style={{ color: '#d4af37' }}>{t.name}</div>
                  <div className="text-3xl font-arabic my-1" style={{ color: '#ffffff' }}>{t.nameAr}</div>
                  <div className="text-[10px] mb-2" style={{ color: 'rgba(204,204,204,0.5)' }}>{t.desc}</div>
                  <div className="text-xl font-arabic" style={{ color: '#4a4aa6' }}>{t.example}</div>
                  <Volume2 className="h-3 w-3 mx-auto mt-2" style={{ color: 'rgba(74,74,166,0.4)' }} />
                </motion.button>
              ))}
            </div>
          )}
        </div>
      )
    }
    return (
      <div>
        {/* Adult: Quick Assessment */}
        {learningMode === 'adult' && !assessmentActive && (
          <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(74,74,166,0.08)', border: '1px solid rgba(74,74,166,0.15)' }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Target className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
              <span className="text-[10px] font-semibold" style={{ color: '#ffffff' }}>Penilaian Pantas</span>
            </div>
            <div className="text-[10px] mb-2" style={{ color: 'rgba(204,204,204,0.6)' }}>Uji tahap anda untuk melangkau kandungan yang sudah dikuasai</div>
            {assessmentDone && assessmentLetters.length > 0 && (
              <div className="rounded-lg p-2.5 mb-2" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)' }}>
                <div className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>
                  Anda mengenali {assessmentScore}/5 huruf. Tahap: {assessmentScore >= 4 ? 'Lanjutan' : assessmentScore >= 2 ? 'Pertengahan' : 'Pemula'}
                </div>
                <div className="text-[9px] mt-1" style={{ color: 'rgba(204,204,204,0.5)' }}>
                  Cadangan: Mula dari {assessmentScore >= 4 ? 'Iqra 3 (Tanwin & Mad)' : assessmentScore >= 2 ? 'Iqra 2 (Harakat)' : 'Iqra 1 (Hijaiyah)'}
                </div>
              </div>
            )}
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium"
              style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.25)' }}
              onClick={startAssessment}
            >
              <Zap className="h-3 w-3" /> Mula Penilaian
            </button>
          </div>
        )}

        {/* Adult: Assessment In-Progress */}
        {learningMode === 'adult' && assessmentActive && assessmentLetters.length > 0 && (
          <div className="rounded-xl p-4 mb-3" style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.2)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold" style={{ color: '#ffffff' }}>Penilaian Pantas</span>
              <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{assessmentIdx + 1}/5</span>
            </div>
            {assessmentIdx < 5 ? (
              <>
                <div className="text-center mb-3">
                  <div className="text-[10px] mb-1" style={{ color: 'rgba(204,204,204,0.5)' }}>Huruf apakah ini?</div>
                  <div className="text-6xl font-arabic" style={{ color: '#4a4aa6' }}>{assessmentLetters[assessmentIdx].letter}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(assessmentOptions[assessmentIdx] || []).map((opt, i) => (
                    <motion.button
                      key={i}
                      className="py-2.5 rounded-xl text-[11px] font-medium"
                      style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.15)', color: '#ffffff' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (opt === assessmentLetters[assessmentIdx].name) {
                          setAssessmentScore(s => s + 1)
                        }
                        if (assessmentIdx + 1 >= 5) {
                          setAssessmentDone(true)
                          setAssessmentActive(false)
                          addXp(25)
                        } else {
                          setAssessmentIdx(assessmentIdx + 1)
                        }
                      }}
                    >{opt}</motion.button>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* === NEW: Achievement Badges === */}
        <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Award className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>Pencapaian</span>
            <span className="text-[9px] ml-auto" style={{ color: 'rgba(204,204,204,0.4)' }}>{earnedBadges.length}/{BADGES.length}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {BADGES.map(badge => {
              const earned = earnedBadges.includes(badge.id)
              return (
                <motion.div
                  key={badge.id}
                  className="flex flex-col items-center gap-1 flex-shrink-0"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-sm"
                    style={{
                      background: earned ? 'rgba(212,175,55,0.15)' : 'rgba(42,42,106,0.5)',
                      border: `2px solid ${earned ? '#d4af37' : 'rgba(74,74,166,0.15)'}`,
                      boxShadow: earned ? '0 0 8px rgba(212,175,55,0.3)' : 'none',
                    }}
                  >
                    {earned ? badge.icon : <Lock className="h-3.5 w-3.5" style={{ color: 'rgba(204,204,204,0.25)' }} />}
                  </div>
                  <span className="text-[7px] text-center max-w-[50px]" style={{ color: earned ? '#d4af37' : 'rgba(204,204,204,0.3)' }}>{badge.name}</span>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* === NEW: Learning Path === */}
        <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
          <div className="flex items-center gap-1.5 mb-2.5">
            <TrendingUp className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#ffffff' }}>Laluan Pembelajaran</span>
          </div>
          <div className="flex items-start gap-1">
            {LEARNING_PATH.map((step, i) => {
              const prog = pathProgress[i]
              const unlocked = i === 0 || pathProgress[i - 1] >= 50
              const isComplete = prog >= 100
              return (
                <div key={step.step} className="flex-1 flex flex-col items-center relative">
                  {i < LEARNING_PATH.length - 1 && (
                    <div className="absolute top-3 left-1/2 w-full h-0.5" style={{ background: isComplete ? '#d4af37' : 'rgba(74,74,166,0.15)' }} />
                  )}
                  <div
                    className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] z-10 mb-1"
                    style={{
                      background: isComplete ? 'rgba(212,175,55,0.2)' : unlocked ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.4)',
                      border: `2px solid ${isComplete ? '#d4af37' : unlocked ? '#4a4aa6' : 'rgba(74,74,166,0.15)'}`,
                      color: isComplete ? '#d4af37' : unlocked ? '#ffffff' : 'rgba(204,204,204,0.3)',
                    }}
                  >
                    {isComplete ? '✓' : step.step}
                  </div>
                  <span className="text-[7px] text-center leading-tight" style={{ color: unlocked ? '#ffffff' : 'rgba(204,204,204,0.3)' }}>{step.name}</span>
                  <span className="text-[7px]" style={{ color: isComplete ? '#d4af37' : 'rgba(204,204,204,0.4)' }}>{prog}%</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* === NEW: Daily Challenge === */}
        <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Calendar className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>Cabaran Harian</span>
            <span className="text-[8px] ml-auto px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37' }}>+20 XP</span>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.08)' }}>
            <div className="text-[10px] mb-2" style={{ color: 'rgba(204,204,204,0.6)' }}>{dailyChallenge.instruction}</div>
            {dailyChallenge.type === 'sebut' ? (
              <>
                <div className="text-5xl font-arabic mb-2" style={{ color: '#d4af37' }}>{dailyItem}</div>
                <button
                  className="flex items-center gap-1.5 mx-auto px-3 py-1.5 rounded-lg text-[10px]"
                  style={{ background: 'rgba(74,74,166,0.12)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.2)' }}
                  onClick={() => { playAudio(dailyItem, 'daily-challenge'); addXp(20) }}
                >
                  <Volume2 className="h-3 w-3" /> Sebut & Dengar
                </button>
              </>
            ) : (
              <div className="grid grid-cols-3 gap-1.5">
                {['فَتْحَة (a)', 'كَسْرَة (i)', 'ضَمَّة (u)'].map((opt, i) => (
                  <button
                    key={i}
                    className="py-2 rounded-lg text-[9px] font-medium"
                    style={{ background: 'rgba(74,74,166,0.1)', border: '1px solid rgba(74,74,166,0.15)', color: '#ffffff' }}
                    onClick={() => handleHarakatChallenge(opt)}
                  >{opt}</button>
                ))}
              </div>
            )}
          </div>
          {challengeXp > 0 && <div className="text-[9px] mt-1.5 text-right" style={{ color: '#d4af37' }}>+{challengeXp} XP hari ini</div>}
        </div>

        {/* === NEW: Progress Analytics === */}
        <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
          <div className="flex items-center gap-1.5 mb-2.5">
            <BarChart3 className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#ffffff' }}>Analisis Progres</span>
          </div>
          {/* Weekly activity bars */}
          <div className="flex items-end gap-1.5 mb-3 h-16">
            {weeklyActivity.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <motion.div
                  className="w-full rounded-t"
                  style={{ background: i === 6 ? '#d4af37' : 'rgba(74,74,166,0.4)', minHeight: 2 }}
                  animate={{ height: `${Math.max(4, (val / 100) * 48)}px` }}
                />
                <span className="text-[7px]" style={{ color: i === 6 ? '#d4af37' : 'rgba(204,204,204,0.35)' }}>{dayNames[i]}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg p-2" style={{ background: 'rgba(74,74,166,0.06)', border: '1px solid rgba(74,74,166,0.08)' }}>
              <div className="flex items-center gap-1 mb-0.5">
                <TrendingUp className="h-2.5 w-2.5" style={{ color: '#4a4aa6' }} />
                <span className="text-[8px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Terkuat</span>
              </div>
              <div className="text-[10px] font-medium" style={{ color: '#4a4aa6' }}>{strongest.name}</div>
              <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{strongest.score}%</div>
            </div>
            <div className="rounded-lg p-2" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.08)' }}>
              <div className="flex items-center gap-1 mb-0.5">
                <Target className="h-2.5 w-2.5" style={{ color: '#d4af37' }} />
                <span className="text-[8px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Perlu Latihan</span>
              </div>
              <div className="text-[10px] font-medium" style={{ color: '#d4af37' }}>{weakest.name}</div>
              <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{weakest.score}%</div>
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <div className="flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" style={{ color: 'rgba(204,204,204,0.3)' }} />
              <span className="text-[8px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Masa belajar: ~{Math.max(1, Math.round(xp / 50))} jam</span>
            </div>
            <span className="text-[8px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Kadar: ~{Math.max(1, Math.round(hafazanVersesDone / Math.max(1, Math.round(xp / 50))))} ayat/jam</span>
          </div>
        </div>

        {/* === NEW: JAKIM Skill Level === */}
        <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(42,42,106,0.25)', border: '1px solid rgba(74,74,166,0.08)' }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Shield className="h-3.5 w-3.5" style={{ color: jakimLevel.color }} />
            <span className="text-[10px] font-semibold" style={{ color: '#ffffff' }}>Tahap Kemahiran JAKIM</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(74,74,166,0.1)' }}>
              <div className="h-full rounded-full" style={{ width: `${overallMastery}%`, background: jakimLevel.color }} />
            </div>
            <span className="text-[9px] font-semibold" style={{ color: jakimLevel.color }}>{jakimLevel.level}</span>
          </div>
        </div>

        {/* Progress Overview */}
        <div
          className="rounded-xl p-3 mb-3"
          style={{ background: 'linear-gradient(135deg, rgba(74,74,166,0.1), rgba(212,175,55,0.05))', border: '1px solid rgba(74,74,166,0.12)' }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium" style={{ color: '#ffffff' }}>Progres Keseluruhan</span>
            <span className="text-[10px]" style={{ color: '#4a4aa6' }}>{overallProgress}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(74,74,166,0.1)' }}>
            <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #4a4aa6, #d4af37)' }} animate={{ width: `${overallProgress}%` }} />
          </div>
          <div className="flex justify-between mt-2">
            <div className="text-center">
              <div className="text-xs font-bold" style={{ color: '#4a4aa6' }}>{totalPagesCompleted}</div>
              <div className="text-[8px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Halaman</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold" style={{ color: '#d4af37' }}>{tajwidMastered.size}/{totalTajwidRules}</div>
              <div className="text-[8px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Tajwid</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold" style={{ color: '#6a6ab6' }}>{hafazanVersesDone}/{totalHafazanVerses}</div>
              <div className="text-[8px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Hafazan</div>
            </div>
          </div>
        </div>

        {/* Iqra Book Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {IQRA_BOOKS.map((book, i) => {
            const prog = bookProgress(book.id)
            return (
              <motion.button
                key={book.id}
                className="rounded-xl p-3 text-left transition-transform active:scale-[0.97]"
                style={{ background: `linear-gradient(135deg, ${book.color}15, ${book.color}05)`, border: `1px solid ${book.color}25` }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => { setIqraBook(book.id); setIqraPage(1); setView('reader') }}
              >
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center text-sm" style={{ background: `${book.color}20`, color: book.color }}>
                    {book.icon}
                  </div>
                  {prog > 0 && (prog === 100 ? <CheckCircle className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} /> : <span className="text-[9px] font-bold" style={{ color: book.color }}>{prog}%</span>)}
                </div>
                <div className="mt-1.5">
                  <div className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{book.title}</div>
                  <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{book.desc}</div>
                </div>
                {prog > 0 && prog < 100 && (
                  <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: `${book.color}12` }}>
                    <div className="h-full rounded-full" style={{ width: `${prog}%`, background: book.color }} />
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <button
            className="rounded-xl p-2.5 text-center"
            style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.1)' }}
            onClick={() => setView('letters')}
          >
            <div className="text-lg">🔤</div>
            <div className="text-[9px] font-medium" style={{ color: '#ffffff' }}>Huruf</div>
          </button>
          <button
            className="rounded-xl p-2.5 text-center"
            style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.1)' }}
            onClick={() => setSubTab('latihan')}
          >
            <div className="text-lg">🧠</div>
            <div className="text-[9px] font-medium" style={{ color: '#ffffff' }}>Latihan</div>
          </button>
          <button
            className="rounded-xl p-2.5 text-center"
            style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.1)' }}
            onClick={() => setShowAITutor(true)}
          >
            <div className="text-lg">🤲</div>
            <div className="text-[9px] font-medium" style={{ color: '#ffffff' }}>Tanya Cikgu</div>
          </button>
        </div>

        {/* JAKIM Footer */}
        <div className="mt-3 text-center py-2" style={{ borderTop: '1px solid rgba(74,74,166,0.06)' }}>
          <span className="text-[8px]" style={{ color: 'rgba(204,204,204,0.3)' }}>Sumber: Kementerian Pendidikan Malaysia & JAKIM</span>
        </div>
      </div>
    )
  }

  function LatihanView() {
    return (
      <div>
        <div className="flex gap-1.5 mb-4">
          {([
            { key: 'flashcard' as PracticeMode, label: 'Kad', icon: <Eye className="h-3.5 w-3.5" /> },
            { key: 'quiz' as PracticeMode, label: 'Kuiz', icon: <Brain className="h-3.5 w-3.5" /> },
            { key: 'matching' as PracticeMode, label: 'Padan', icon: <Shuffle className="h-3.5 w-3.5" /> },
            { key: 'tulis' as PracticeMode, label: 'Tulis', icon: <Pen className="h-3.5 w-3.5" /> },
          ]).map(m => (
            <button
              key={m.key}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-medium"
              style={{
                background: practiceMode === m.key ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.4)',
                color: practiceMode === m.key ? '#ffffff' : 'rgba(204,204,204,0.5)',
                border: `1px solid ${practiceMode === m.key ? 'rgba(74,74,166,0.3)' : 'transparent'}`,
              }}
              onClick={() => setPracticeMode(m.key)}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        {practiceMode === 'flashcard' && <FlashcardPractice />}
        {practiceMode === 'quiz' && <QuizPractice />}
        {practiceMode === 'matching' && <MatchingPractice />}
        {practiceMode === 'tulis' && <WritingPractice />}
      </div>
    )
  }

  function FlashcardPractice() {
    const letter = filteredLetters[flashcardIdx % filteredLetters.length]
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{flashcardIdx + 1} / {filteredLetters.length}</span>
          <button
            className="flex items-center gap-1 text-[10px]"
            style={{ color: '#4a4aa6' }}
            onClick={() => { setFlashcardIdx(Math.floor(Math.random() * filteredLetters.length)); setFlashcardFlipped(false) }}
          >
            <Shuffle className="h-3 w-3" /> Rawak
          </button>
        </div>
        <motion.div
          className="rounded-2xl p-8 text-center cursor-pointer"
          style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.15)' }}
          onClick={() => setFlashcardFlipped(!flashcardFlipped)}
          animate={{ rotateY: flashcardFlipped ? 180 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {!flashcardFlipped ? (
              <motion.div key="front" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-6xl font-arabic" style={{ color: '#4a4aa6' }}>{letter.letter}</div>
                <div className="text-[10px] mt-2" style={{ color: 'rgba(204,204,204,0.4)' }}>Ketik untuk semak</div>
              </motion.div>
            ) : (
              <motion.div key="back" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ transform: 'scaleX(-1)' }}>
                <div className="text-2xl font-bold" style={{ color: '#ffffff' }}>{letter.name}</div>
                <div className="text-xs" style={{ color: 'rgba(204,204,204,0.5)' }}>{letter.nameEn}</div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {Object.entries(letter.harakat).map(([k, v]) => (
                    <div key={k} className="rounded-lg p-1.5" style={{ background: 'rgba(74,74,166,0.08)' }}>
                      <div className="text-lg font-arabic" style={{ color: '#ffffff' }}>{v}</div>
                      <div className="text-[8px] capitalize" style={{ color: 'rgba(204,204,204,0.4)' }}>{k}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <div className="flex justify-between mt-3">
          <button
            className="flex-1 py-2 rounded-xl text-[11px] mr-1"
            style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.1)', color: '#4a4aa6' }}
            onClick={() => { setFlashcardIdx(Math.max(0, flashcardIdx - 1)); setFlashcardFlipped(false) }}
          ><ChevronLeft className="h-3.5 w-3.5 inline" /> Sebelum</button>
          <button
            className="flex-1 py-2 rounded-xl text-[11px] ml-1"
            style={{ background: 'rgba(74,74,166,0.15)', border: '1px solid rgba(74,74,166,0.25)', color: '#4a4aa6' }}
            onClick={() => { setFlashcardIdx(Math.min(filteredLetters.length - 1, flashcardIdx + 1)); setFlashcardFlipped(false); addXp(5) }}
          >Seterusnya <ChevronRight className="h-3.5 w-3.5 inline" /></button>
        </div>
      </div>
    )
  }

  function QuizPractice() {
    if (!quizQuestion) return <div className="text-center py-8 text-xs" style={{ color: 'rgba(204,204,204,0.5)' }}>Memuatkan kuiz...</div>
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Skor: {quizScore}</span>
          <button className="flex items-center gap-1 text-[10px]" style={{ color: '#4a4aa6' }} onClick={generateQuiz}>
            <RotateCcw className="h-3 w-3" /> Soalan Baru
          </button>
        </div>
        <div className="rounded-2xl p-6 text-center mb-4" style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.15)' }}>
          <div className="text-xs mb-2" style={{ color: 'rgba(204,204,204,0.5)' }}>Huruf apakah ini?</div>
          <div className="text-6xl font-arabic" style={{ color: '#4a4aa6' }}>{quizQuestion.letter}</div>
          <button
            className="mt-3 mx-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px]"
            style={{ background: 'rgba(74,74,166,0.12)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.2)' }}
            onClick={() => playAudio(quizQuestion.answer, 'quiz-audio')}
          >
            <Volume2 className="h-3 w-3" /> Dengar
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quizQuestion.options.map((opt, i) => (
            <motion.button
              key={i}
              className="py-3 rounded-xl text-xs font-medium"
              style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.15)', color: '#ffffff' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (opt === quizQuestion.answer) {
                  setQuizScore(s => s + 10)
                  addXp(10)
                }
                setTimeout(generateQuiz, 600)
              }}
            >{opt}</motion.button>
          ))}
        </div>
      </div>
    )
  }

  function MatchingPractice() {
    const arabicCards = matchingPairs.map(p => ({ ...p, type: 'arabic' as const }))
    const nameCards = [...matchingPairs].sort(() => Math.random() - 0.5).map(p => ({ ...p, type: 'name' as const }))
    const allCards = [...arabicCards, ...nameCards]

    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Padan: {matchScore}/6</span>
          <button className="flex items-center gap-1 text-[10px]" style={{ color: '#4a4aa6' }} onClick={initMatching}>
            <RotateCcw className="h-3 w-3" /> Mula Semula
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {allCards.map((card, i) => {
            const isMatched = card.matched
            const isSelected = selectedMatch === i
            return (
              <motion.button
                key={`${card.type}-${card.id}-${i}`}
                className="aspect-square rounded-lg flex items-center justify-center p-1"
                style={{
                  background: isMatched ? 'rgba(74,74,166,0.25)' : isSelected ? 'rgba(212,175,55,0.15)' : 'rgba(42,42,106,0.5)',
                  border: `1px solid ${isMatched ? 'rgba(74,74,166,0.4)' : isSelected ? 'rgba(212,175,55,0.3)' : 'rgba(74,74,166,0.1)'}`,
                  opacity: isMatched ? 0.5 : 1,
                }}
                whileTap={{ scale: 0.95 }}
                disabled={isMatched}
                onClick={() => {
                  if (selectedMatch === null) {
                    setSelectedMatch(i)
                  } else {
                    const prev = allCards[selectedMatch]
                    if (prev.id === card.id && prev.type !== card.type) {
                      setMatchingPairs(prev => prev.map(p => p.id === card.id ? { ...p, matched: true } : p))
                      setMatchScore(s => { addXp(15); return s + 1 })
                    }
                    setSelectedMatch(null)
                  }
                }}
              >
                {card.type === 'arabic' ? (
                  <span className="text-lg font-arabic" style={{ color: '#ffffff' }}>{card.arabic}</span>
                ) : (
                  <span className="text-[9px]" style={{ color: '#ffffff' }}>{card.name}</span>
                )}
              </motion.button>
            )
          })}
        </div>
        {matchScore >= 6 && (
          <motion.div className="text-center mt-3" initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <Trophy className="h-8 w-8 mx-auto" style={{ color: '#d4af37' }} />
            <div className="text-xs font-bold mt-1" style={{ color: '#d4af37' }}>Tahniah! Semua dipadan!</div>
          </motion.div>
        )}
      </div>
    )
  }
  function WritingPractice() {
    const letter = ENHANCED_LETTERS[writingLetter % ENHANCED_LETTERS.length]
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Latihan Menulis</span>
          <button
            className="flex items-center gap-1 text-[10px]"
            style={{ color: '#4a4aa6' }}
            onClick={() => setWritingLetter(prev => (prev + 1) % ENHANCED_LETTERS.length)}
          >
            <Shuffle className="h-3 w-3" /> Huruf Setelahnya
          </button>
        </div>
        {/* Letter Guide */}
        <div className="rounded-xl p-4 text-center mb-3" style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.15)' }}>
          <div className="text-[10px] mb-1" style={{ color: 'rgba(204,204,204,0.5)' }}>Tulis huruf ini:</div>
          <div className="text-6xl font-arabic" style={{ color: '#d4af37' }}>{letter.letter}</div>
          <div className="text-xs mt-1" style={{ color: '#ffffff' }}>{letter.name}</div>
          <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{letter.writingTip}</div>
        </div>
        {/* Canvas */}
        <div className="rounded-xl overflow-hidden mb-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.12)' }}>
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            className="w-full touch-none"
            style={{ background: 'rgba(26,26,74,0.5)', cursor: 'crosshair' }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />
        </div>
        <div className="flex gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px]"
            style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.12)', color: '#4a4aa6' }}
            onClick={clearCanvas}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Padam
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-medium"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37' }}
            onClick={checkWriting}
          >
            <CheckCircle className="h-3.5 w-3.5" /> Semak
          </button>
        </div>
        {writingFeedback && (
          <motion.div
            className="rounded-xl p-3 mt-3"
            style={{ background: 'rgba(74,74,166,0.08)', border: '1px solid rgba(74,74,166,0.12)' }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Lightbulb className="h-3 w-3" style={{ color: '#d4af37' }} />
              <span className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>Nasihat Cikgu</span>
            </div>
            <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.7)' }}>{writingFeedback}</div>
          </motion.div>
        )}
      </div>
    )
  }

  function TajwidView() {
    return (
      <div>
        <div className="mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold" style={{ color: '#ffffff' }}>Hukum Tajwid</span>
            <span className="px-1 py-0.5 rounded text-[7px]" style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.15)' }}>Kurikulum JAKIM</span>
          </div>
          <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{tajwidMastered.size}/{totalTajwidRules} dikuasai</div>
        </div>
        {TAJWID_CATEGORIES.map((cat, ci) => (
          <div key={cat.id} className="mb-3">
            <div
              className="rounded-xl p-3 mb-2"
              style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.1)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold" style={{ color: '#ffffff' }}>{cat.name}</div>
                  <div className="text-[10px] font-arabic" style={{ color: 'rgba(204,204,204,0.4)' }}>{cat.nameAr}</div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,74,166,0.12)', color: '#4a4aa6' }}>
                  {cat.rules.filter(r => tajwidMastered.has(r.id)).length}/{cat.rules.length}
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              {cat.rules.map((rule, ri) => {
                const isOpen = selectedTajwidRule === rule.id
                const isMastered = tajwidMastered.has(rule.id)
                return (
                  <motion.div
                    key={rule.id}
                    className="rounded-xl overflow-hidden"
                    style={{ background: 'rgba(42,42,106,0.25)', border: `1px solid ${isOpen ? 'rgba(74,74,166,0.25)' : 'rgba(74,74,166,0.06)'}` }}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ci * 0.05 + ri * 0.03 }}
                  >
                    <button
                      className="w-full text-left p-3 flex items-center justify-between"
                      onClick={() => setSelectedTajwidRule(isOpen ? null : rule.id)}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium" style={{ color: '#ffffff' }}>{rule.name}</span>
                          {isMastered && <CheckCircle className="h-3 w-3" style={{ color: '#4a4aa6' }} />}
                        </div>
                        <div className="text-[9px] font-arabic" style={{ color: 'rgba(204,204,204,0.4)' }}>{rule.nameAr}</div>
                      </div>
                      <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.15 }}>
                        <ArrowRight className="h-3.5 w-3.5" style={{ color: 'rgba(204,204,204,0.3)' }} />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          className="px-3 pb-3"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="text-[10px] mb-2" style={{ color: 'rgba(204,204,204,0.7)' }}>{rule.desc}</div>
                          <div className="rounded-lg p-2.5 mb-2" style={{ background: 'rgba(74,74,166,0.06)', border: '1px solid rgba(74,74,166,0.1)' }}>
                            <div className="text-[10px] mb-1" style={{ color: 'rgba(204,204,204,0.4)' }}>Contoh:</div>
                            <div className="text-lg font-arabic text-center" style={{ color: '#4a4aa6', direction: 'rtl' }}>{rule.example}</div>
                          </div>
                          {/* JAKIM Reference */}
                          {JAKIM_TAJWID_REFS[cat.id] && (
                            <div className="text-[8px] mb-2 flex items-center gap-1" style={{ color: 'rgba(212,175,55,0.5)' }}>
                              <Shield className="h-2.5 w-2.5" /> {JAKIM_TAJWID_REFS[cat.id]}
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>📌 {rule.quranRef}</span>
                            <div className="flex gap-1.5">
                              <button
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px]"
                                style={{ background: 'rgba(74,74,166,0.1)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.15)' }}
                                onClick={() => playAudio(rule.example, `tajwid-${rule.id}`)}
                              >
                                <Volume2 className="h-3 w-3" /> Dengar
                              </button>
                              <button
                                className="px-2.5 py-1 rounded-lg text-[9px] font-medium"
                                style={{
                                  background: isMastered ? 'rgba(74,74,166,0.2)' : 'rgba(212,175,55,0.1)',
                                  color: isMastered ? '#4a4aa6' : '#d4af37',
                                  border: `1px solid ${isMastered ? 'rgba(74,74,166,0.3)' : 'rgba(212,175,55,0.2)'}`,
                                }}
                                onClick={() => {
                                  if (!isMastered) { setTajwidMastered(prev => new Set([...prev, rule.id])); addXp(30) }
                                }}
                              >{isMastered ? '✓ Dikuasai' : 'Tandai Dikuasai'}</button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    )
  }
  function HafazanView() {
    const [recitingSurah, setRecitingSurah] = useState<number | null>(null)
    if (recitingSurah !== null) {
      const surah = HAFAZAN_SURAHS.find(s => s.id === recitingSurah)
      if (!surah) return null
      const progress = hafazanProgress[surah.id] || 0
      return (
        <div>
          <div className="flex items-center justify-between mb-3">
            <button className="flex items-center gap-1 text-xs" style={{ color: '#4a4aa6' }} onClick={() => setRecitingSurah(null)}>
              <ChevronLeft className="h-4 w-4" /> Kembali
            </button>
            <div className="text-center">
              <div className="text-xs font-semibold" style={{ color: '#ffffff' }}>{surah.nameMs}</div>
              <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{surah.verses} ayat</div>
            </div>
            <div style={{ width: 50 }} />
          </div>
          <div className="rounded-xl p-4 text-center mb-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.12)' }}>
            <div className="text-3xl font-arabic mb-2" style={{ color: '#4a4aa6' }}>{surah.name}</div>
            <div className="text-xs mb-3" style={{ color: 'rgba(204,204,204,0.6)' }}>Progres Hafazan</div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <button
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(74,74,166,0.12)', border: '1px solid rgba(74,74,166,0.2)' }}
                onClick={() => setHafazanProgress(prev => ({ ...prev, [surah.id]: Math.max(0, progress - 1) }))}
              >-</button>
              <span className="text-lg font-bold" style={{ color: '#ffffff' }}>{progress}</span>
              <span className="text-xs" style={{ color: 'rgba(204,204,204,0.4)' }}>/ {surah.verses}</span>
              <button
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(74,74,166,0.12)', border: '1px solid rgba(74,74,166,0.2)' }}
                onClick={() => {
                  const newVal = Math.min(surah.verses, progress + 1)
                  setHafazanProgress(prev => ({ ...prev, [surah.id]: newVal }))
                  if (newVal === surah.verses) addXp(100)
                  else addXp(5)
                }}
              >+</button>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(74,74,166,0.1)' }}>
              <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #4a4aa6, #d4af37)' }} animate={{ width: `${(progress / surah.verses) * 100}%` }} />
            </div>
          </div>
          <div className="space-y-2">
            <button
              className="w-full rounded-xl p-3 flex items-center gap-3"
              style={{ background: 'rgba(74,74,166,0.08)', border: '1px solid rgba(74,74,166,0.12)' }}
              onClick={() => playAudio(`Surah ${surah.nameMs}`, `hafazan-${surah.id}`)}
            >
              <Volume2 className="h-4 w-4" style={{ color: '#4a4aa6' }} />
              <div className="text-left">
                <div className="text-[11px] font-medium" style={{ color: '#ffffff' }}>Dengar Bacaan</div>
                <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Audio bacaan penuh</div>
              </div>
            </button>
            <button
              className="w-full rounded-xl p-3 flex items-center gap-3"
              style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.1)' }}
              onClick={() => setShowAITutor(true)}
            >
              <Mic className="h-4 w-4" style={{ color: '#d4af37' }} />
              <div className="text-left">
                <div className="text-[11px] font-medium" style={{ color: '#ffffff' }}>Semak dengan AI</div>
                <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Baca & AI semak bacaan</div>
              </div>
            </button>
          </div>
          {progress === surah.verses && (
            <motion.div className="text-center mt-4" initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <Trophy className="h-10 w-10 mx-auto" style={{ color: '#d4af37' }} />
              <div className="text-sm font-bold mt-1" style={{ color: '#d4af37' }}>MasyaAllah! Hafazan Selesai!</div>
              <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>+100 XP</div>
            </motion.div>
          )}
        </div>
      )
    }
    return (
      <div>
        <div className="mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold" style={{ color: '#ffffff' }}>Hafazan Surah Pendek</span>
            <span className="px-1 py-0.5 rounded text-[7px]" style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.15)' }}>Kaedah JAKIM</span>
          </div>
          <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Juz 30 · {HAFAZAN_SURAHS.length} surah</div>
        </div>
        {/* JAKIM Hafazan Methodology */}
        <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Shield className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>Kaedah Hafazan JAKIM</span>
          </div>
          <div className="text-[9px] leading-relaxed" style={{ color: 'rgba(204,204,204,0.6)' }}>
            1. Baca ayat 3× dengan tajwid yang betul · 2. Faham makna ayat · 3. Hafaz tanpa melihat · 4. Ulang pada waktu Subuh & Maghrib · 5. Semak dengan guru/AI
          </div>
        </div>
        {/* Overall hafazan progress */}
        <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.6)' }}>Progres Hafazan</span>
            <span className="text-[10px]" style={{ color: '#4a4aa6' }}>{hafazanVersesDone}/{totalHafazanVerses} ayat</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(74,74,166,0.1)' }}>
            <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #4a4aa6, #d4af37)' }} animate={{ width: `${(hafazanVersesDone / totalHafazanVerses) * 100}%` }} />
          </div>
        </div>

        <div className="space-y-1.5">
          {HAFAZAN_SURAHS.map((surah, i) => {
            const prog = hafazanProgress[surah.id] || 0
            const done = prog === surah.verses
            return (
              <motion.button
                key={surah.id}
                className="w-full rounded-xl p-3 flex items-center gap-3 text-left"
                style={{
                  background: done ? 'rgba(74,74,166,0.12)' : 'rgba(42,42,106,0.3)',
                  border: `1px solid ${done ? 'rgba(74,74,166,0.25)' : 'rgba(74,74,166,0.06)'}`,
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => setRecitingSurah(surah.id)}
              >
                <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: done ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.5)' }}>
                  {done ? <CheckCircle className="h-4 w-4" style={{ color: '#4a4aa6' }} /> : <span className="text-xs font-bold" style={{ color: 'rgba(204,204,204,0.5)' }}>{i + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium" style={{ color: '#ffffff' }}>{surah.nameMs}</span>
                    <span className="text-[9px]" style={{ color: done ? '#4a4aa6' : 'rgba(204,204,204,0.4)' }}>{prog}/{surah.verses}</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden mt-1" style={{ background: 'rgba(74,74,166,0.08)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(prog / surah.verses) * 100}%`, background: done ? '#d4af37' : '#4a4aa6' }} />
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'rgba(204,204,204,0.3)' }} />
              </motion.button>
            )
          })}
        </div>
      </div>
    )
  }
  function renderIqraContent() {
    if (iqraBook === 1) {
      const perPage = 6
      const start = ((iqraPage - 1) * perPage) % ENHANCED_LETTERS.length
      const pageLetters = Array.from({ length: perPage }, (_, i) => ENHANCED_LETTERS[(start + i) % ENHANCED_LETTERS.length])
      return (
        <div className="w-full">
          <div className="text-center mb-3">
            <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: 'rgba(74,74,166,0.12)', color: '#4a4aa6' }}>
              Pengenalan Huruf Hijaiyah
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {pageLetters.map(l => (
              <div
                key={l.id}
                className="aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer"
                style={{ background: 'rgba(74,74,166,0.06)', border: '1px solid rgba(74,74,166,0.1)' }}
                onClick={() => playAudio(l.name, `iqra-letter-${l.id}`)}
              >
                <span className="text-3xl" style={{ color: '#ffffff' }}>{l.letter}</span>
                <span className="text-[9px] mt-1" style={{ color: 'rgba(204,204,204,0.5)' }}>{l.name}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    if (iqraBook === 2) {
      const combos = ['بَا', 'بِي', 'بُو', 'تَا', 'تِي', 'تُو', 'ثَا', 'ثِي', 'ثُو', 'جَا', 'جِي', 'جُو']
      const perPage = 6
      const start = ((iqraPage - 1) * perPage) % combos.length
      const pageItems = Array.from({ length: perPage }, (_, i) => combos[(start + i) % combos.length])
      return (
        <div className="w-full">
          <div className="text-center mb-3">
            <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: 'rgba(106,106,182,0.12)', color: '#6a6ab6' }}>
              Harakat: Fathah, Kasrah, Dhammah
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {pageItems.map((c, i) => (
              <div key={i} className="aspect-square rounded-xl flex items-center justify-center" style={{ background: 'rgba(106,106,182,0.06)', border: '1px solid rgba(106,106,182,0.1)' }}>
                <span className="text-2xl" style={{ color: '#ffffff', direction: 'rtl' }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    if (iqraBook === 3) {
      return (
        <div className="w-full">
          <div className="text-center mb-3">
            <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37' }}>Tanwin & Mad</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TANWIN_MAD_DATA.map(item => (
              <div key={item.id} className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
                <div className="text-xl font-arabic" style={{ color: '#ffffff' }}>{item.symbol}</div>
                <div className="text-[9px] font-medium mt-1" style={{ color: '#d4af37' }}>{item.name}</div>
                <div className="text-[8px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )
    }
    // Iqra 4-6: Practice verses
    const verses = [
      'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
      'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
      'أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ',
      'إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',
      'فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ',
    ]
    const labels: Record<number, string> = { 4: 'Tajwid Lanjutan', 5: 'Waqaf & Ibtida', 6: 'Bacaan Al-Quran' }
    return (
      <div className="w-full">
        <div className="text-center mb-3">
          <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: `${currentBook.color}12`, color: currentBook.color }}>
            {labels[iqraBook] || 'Latihan'}
          </span>
        </div>
        <div className="space-y-2">
          {verses.map((v, i) => (
            <div key={i} className="rounded-xl p-3 text-center" style={{ background: `${currentBook.color}06`, border: `1px solid ${currentBook.color}12` }}>
              <p className="text-xl leading-loose font-arabic" style={{ color: '#ffffff', direction: 'rtl' }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function getIqraAudioText(): string {
    if (iqraBook === 1) {
      const perPage = 6
      const start = ((iqraPage - 1) * perPage) % ENHANCED_LETTERS.length
      return Array.from({ length: perPage }, (_, i) => ENHANCED_LETTERS[(start + i) % ENHANCED_LETTERS.length].name).join(', ')
    }
    return `Iqra ${iqraBook}, halaman ${iqraPage}`
  }
}
