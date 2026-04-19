import { HIJAIYAH_LETTERS } from '@/lib/quran-data'

// === Type definitions ===
export type IqraSubTab = 'belajar' | 'latihan' | 'tajwid' | 'hafazan'
export type PracticeMode = 'flashcard' | 'quiz' | 'matching' | 'tulis'
export type LetterFilter = 'all' | 'hijaiyah' | 'harakat' | 'tanwin' | 'mad'

export interface ChatMsg {
  role: 'user' | 'ai'
  text: string
}

export interface BadgeCtx {
  completedLetters: number
  harakaatMastered: number
  tajwidRules: number
  surahsHafaz: number
  booksCompleted: number
  streak: number
}

export interface EnhancedLetter {
  id: number
  letter: string
  name: string
  nameEn: string
  audioRef: string
  forms: { isolated: string; initial: string; medial: string; final: string }
  nameMs: string
  harakat: {
    fathah: string
    kasrah: string
    dhammah: string
    sukun: string
    shaddah: string
  }
  writingTip: string
}

// === Constant data ===
export const IQRA_BOOKS = [
  { id: 1, title: 'Iqra 1', desc: 'Huruf Hijaiyah', icon: '\u{1F524}', color: '#4a4aa6', pages: 28, letters: 29 },
  { id: 2, title: 'Iqra 2', desc: 'Harakat (Baris)', icon: '\u{1F4CC}', color: '#6a6ab6', pages: 28, letters: 0 },
  { id: 3, title: 'Iqra 3', desc: 'Tanwin & Mad', icon: '\u{3030}\u{FE0F}', color: '#d4af37', pages: 28, letters: 0 },
  { id: 4, title: 'Iqra 4', desc: 'Tajwid Lanjutan', icon: '\u{1F3AF}', color: '#e0c060', pages: 28, letters: 0 },
  { id: 5, title: 'Iqra 5', desc: 'Waqaf & Ibtida', icon: '\u{1F6D1}', color: '#3a3a8a', pages: 28, letters: 0 },
  { id: 6, title: 'Iqra 6', desc: 'Bacaan Al-Quran', icon: '\u{1F4D6}', color: '#2a2a6a', pages: 28, letters: 0 },
]

export const WRITING_TIPS: Record<string, string> = {
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

export const ENHANCED_LETTERS: EnhancedLetter[] = HIJAIYAH_LETTERS.map(l => ({
  ...l,
  forms: { isolated: l.letter, initial: l.letter, medial: l.letter, final: l.letter },
  nameMs: l.name,
  harakat: {
    fathah: `${l.letter}\u{064E}`,
    kasrah: `${l.letter}\u{0650}`,
    dhammah: `${l.letter}\u{064F}`,
    sukun: `${l.letter}\u{0652}`,
    shaddah: `${l.letter}\u{0651}`,
  },
  writingTip: WRITING_TIPS[l.name] || `Mulakan dari kanan ke kiri untuk huruf ${l.name}`,
}))

export const HARAKAT_DATA = [
  { id: 'fathah', name: 'Fathah', nameAr: '\u{0641}\u{064E}\u{062A}\u{0652}\u{062D}\u{064E}\u{0629}', symbol: '\u{064E}', desc: 'Baris atas — bunyi "a"', example: '\u{0628}\u{064E} (ba)' },
  { id: 'kasrah', name: 'Kasrah', nameAr: '\u{0643}\u{064E}\u{0633}\u{0652}\u{0631}\u{064E}\u{0629}', symbol: '\u{0650}', desc: 'Baris bawah — bunyi "i"', example: '\u{0628}\u{0650} (bi)' },
  { id: 'dhammah', name: 'Dhammah', nameAr: '\u{0636}\u{064E}\u{0645}\u{0651}\u{064E}\u{0629}', symbol: '\u{064F}', desc: 'Baris hadapan — bunyi "u"', example: '\u{0628}\u{064F} (bu)' },
]

export const TANWIN_MAD_DATA = [
  { id: 'tanwin-fath', name: 'Tanwin Fathah', nameAr: '\u{062A}\u{064E}\u{0646}\u{0652}\u{0648}\u{0650}\u{064A}\u{0646} \u{0641}\u{064E}\u{062A}\u{0652}\u{062D}\u{064E}\u{0629}', symbol: '\u{064B}', desc: 'Dua baris atas — bunyi "an"', example: '\u{0628}\u{064B}\u{0627} (ban)' },
  { id: 'tanwin-kasr', name: 'Tanwin Kasrah', nameAr: '\u{062A}\u{064E}\u{0646}\u{0652}\u{0648}\u{0650}\u{064A}\u{0646} \u{0643}\u{064E}\u{0633}\u{0652}\u{0631}\u{064E}\u{0629}', symbol: '\u{064D}', desc: 'Dua baris bawah — bunyi "in"', example: '\u{0628}\u{064D} (bin)' },
  { id: 'tanwin-dham', name: 'Tanwin Dhammah', nameAr: '\u{062A}\u{064E}\u{0646}\u{0652}\u{0648}\u{0650}\u{064A}\u{0646} \u{0636}\u{064E}\u{0645}\u{0651}\u{064E}\u{0629}', symbol: '\u{064C}', desc: 'Dua baris hadapan — bunyi "un"', example: '\u{0628}\u{064C} (bun)' },
  { id: 'mad-thabii', name: 'Mad Thabi\'i', nameAr: '\u{0645}\u{064E}\u{062F}\u{0651} \u{0637}\u{064E}\u{0628}\u{0650}\u{064A}\u{0639}\u{0650}\u{064A}\u{0651}', symbol: '\u{0622}', desc: 'Elongasi 2 harakat', example: '\u{0642}\u{064E}\u{0627}\u{0644}\u{064E} (qaa-la)' },
  { id: 'mad-wajib', name: 'Mad Wajib Muttashil', nameAr: '\u{0645}\u{064E}\u{062F}\u{0651} \u{0648}\u{064E}\u{0627}\u{062C}\u{0650}\u{0628} \u{0645}\u{064F}\u{062A}\u{0651}\u{064E}\u{0635}\u{0650}\u{0644}', symbol: '\u{064B}', desc: 'Elongasi wajib 4-5 harakat', example: '\u{0627}\u{0644}\u{0633}\u0651\u{064E}\u{0645}\u{064E}\u{0627}\u{0621}\u{0650}' },
  { id: 'mad-jaiz', name: 'Mad Jaiz Munfashil', nameAr: '\u{0645}\u{064E}\u{062F}\u{0651} \u{062C}\u{064E}\u{0627}\u{0626}\u{0650}\u{0632} \u{0645}\u{064F}\u{0646}\u{0652}\u{0641}\u{064E}\u{0635}\u{0650}\u{0644}', symbol: '\u{064B}', desc: 'Elongasi harfiah 2-4 harakat', example: '\u{064A}\u{064E}\u{0627} \u{0623}\u{064E}\u{064A}\u0651\u{064F}\u{0647}\u{064E}\u{0627}' },
]

export const TAJWID_CATEGORIES = [
  {
    id: 'nun-mati', name: 'Nun Mati / Tanwin', nameAr: '\u{0646}\u{064F}\u{0648}\u{0646} \u{0633}\u{064E}\u{0627}\u{0643}\u{0650}\u{0646}\u{064E}\u{0629} / \u{062A}\u{064E}\u{0646}\u{0652}\u{0648}\u{0650}\u{064A}\u{0646}', rules: [
      { id: 'izhar', name: 'Izhar', nameAr: '\u{0625}\u{0650}\u{0638}\u{0652}\u{0647}\u{064E}\u{0627}\u{0631}', desc: 'Sebutan jelas — huruf halqi (\u{0623} \u{0647} \u{0639} \u{062D} \u{063A} \u{062E})', example: '\u{0645}\u{0650}\u{0646}\u{0652} \u{0623}\u{064E}\u{062C}\u{0652}\u{0644}\u{0650}', quranRef: 'Al-Baqarah 2:242' },
      { id: 'idgham', name: 'Idgham', nameAr: '\u{0625}\u{0650}\u{062F}\u{0652}\u{063A}\u{064E}\u{0627}\u{0645}', desc: 'Dimasukkan — \u{064A} \u{0646} \u{0645} \u{0648} \u{0644} (Yanmul)', example: '\u{0645}\u{0650}\u{0646} \u{0648}\u{064E}\u{0644}\u{0650}\u{064A}\u0651', quranRef: 'Al-Baqarah 2:107' },
      { id: 'ikhfa', name: 'Ikhfa', nameAr: '\u{0625}\u{0650}\u{062E}\u{0652}\u{0641}\u{064E}\u{0627}\u{0621}', desc: 'Sembunyikan — 15 huruf selepas nun/tanwin', example: '\u{0645}\u{0650}\u{0646} \u{062A}\u{064E}\u{062D}\u{0652}\u{062A}\u{0650}\u{0647}\u{064E}\u{0627}', quranRef: 'At-Tahrim 66:6' },
      { id: 'iqlab', name: 'Iqlab', nameAr: '\u{0625}\u{0650}\u{0642}\u{0652}\u{0644}\u{064E}\u{0627}\u{0628}', desc: 'Tukar mim — selepas \u{0628}', example: '\u{0645}\u{0650}\u{0646} \u{0628}\u{064E}\u{0639}\u{0652}\u{062F}\u{0650}', quranRef: 'Al-Baqarah 2:25' },
    ]
  },
  {
    id: 'mim-mati', name: 'Mim Mati', nameAr: '\u{0645}\u{0650}\u{064A}\u{0645} \u{0633}\u{064E}\u{0627}\u{0643}\u{0650}\u{0646}\u{064E}\u{0629}', rules: [
      { id: 'izhar-mim', name: 'Izhar Syafawi', nameAr: '\u{0625}\u{0650}\u{0638}\u{0652}\u{0647}\u{064E}\u{0627}\u{0631} \u{0634}\u{064E}\u{0641}\u{064E}\u{0648}\u{0650}\u{064A}\u0651}', desc: 'Sebutan jelas — selepas 26 huruf selain mim & ba', example: '\u{0647}\u{064F}\u{0645}\u{0652} \u{0641}\u{0650}\u{064A}\u{0647}\u{064E}\u{0627}', quranRef: 'Al-Baqarah 2:25' },
      { id: 'idgham-mim', name: 'Idgham Mimi', nameAr: '\u{0625}\u{0650}\u{062F}\u{0652}\u{063A}\u{064E}\u{0627}\u{0645} \u{0645}\u{0650}\u{064A}\u{0645}\u{0650}\u{064A}\u0651}', desc: 'Masuk mim — selepas mim', example: '\u{0648}\u{064E}\u{0645}\u{064E}\u{0627} \u{0644}\u{064E}\u{0647}\u{064F}\u{0645} \u{0645}\u0651\u{0650}\u{0646}', quranRef: 'Al-Baqarah 2:2' },
      { id: 'ikhfa-mim', name: 'Ikhfa Syafawi', nameAr: '\u{0625}\u{0650}\u{062E}\u{0652}\u{0641}\u{064E}\u{0627}\u{0621} \u{0634}\u{064E}\u{0641}\u{064E}\u{0648}\u{0650}\u{064A}\u0651}', desc: 'Sembunyikan — selepas ba', example: '\u{0648}\u{064E}\u{0645}\u{064E}\u{0627} \u{0628}\u{0650}\u{0647}\u{0650}\u{0645}', quranRef: 'Al-Baqarah 2:4' },
    ]
  },
  {
    id: 'mad', name: 'Hukum Mad', nameAr: '\u{0623}\u{064E}\u{062D}\u{064F}\u{0643}\u{064E}\u{0627}\u{0645} \u{0627}\u{0644}\u{0645}\u{064E}\u{062F}\u0651}', rules: [
      { id: 'mad-thabii-t', name: 'Mad Thabi\'i', nameAr: '\u{0645}\u{064E}\u{062F}\u0651 \u{0637}\u{064E}\u{0628}\u{0650}\u{064A}\u{0639}\u{0650}\u{064A}\u0651}', desc: 'Mad asli 2 harakat', example: '\u{0642}\u{064F}\u{0648}\u{0644}\u{064F}\u{0648}\u{0627}', quranRef: 'Al-Baqarah 2:104' },
      { id: 'mad-wajib-t', name: 'Mad Wajib Muttashil', nameAr: '\u{0645}\u{064E}\u{062F}\u0651 \u{0648}\u{064E}\u{0627}\u{062C}\u{0650}\u{0628} \u{0645}\u{064F}\u{062A}\u0651\u{064E}\u{0635}\u{0650}\u{0644}', desc: 'Hamzah selepas mad dalam 1 kata — wajib 4-5 harakat', example: '\u{0627}\u{0644}\u{0633}\u0651\u{064E}\u{0645}\u{064E}\u{0627}\u{0621}\u{0650}', quranRef: 'Al-Fatihah 1:1' },
      { id: 'mad-jaiz-t', name: 'Mad Jaiz Munfashil', nameAr: '\u{0645}\u{064E}\u{062F}\u0651 \u{062C}\u{064E}\u{0627}\u{0626}\u{0650}\u{0632} \u{0645}\u{064F}\u{0646}\u{0652}\u{0641}\u{064E}\u{0635}\u{0650}\u{0644}', desc: 'Hamzah selepas mad dalam 2 kata — harfiah 2-4 harakat', example: '\u{064A}\u{064E}\u{0627} \u{0623}\u{064E}\u{064A}\u0651\u{064F}\u{0647}\u{064E}\u{0627}', quranRef: 'An-Nisa 4:1' },
    ]
  },
  {
    id: 'qalqalah', name: 'Qalqalah', nameAr: '\u{0642}\u{064E}\u{0644}\u{0642}\u{064E}\u{0644}\u{064E}\u{0629}', rules: [
      { id: 'qalqalah-kubra', name: 'Qalqalah Kubra', nameAr: '\u{0642}\u{064E}\u{0644}\u{0642}\u{064E}\u{0644}\u{064E}\u{0629} \u{0643}\u{064F}\u{0628}\u{0652}\u{0631}\u{064E}\u{0649}', desc: 'Huruf qalqalah diwaqaf — bunyi lebih kuat (\u{0642} \u{0637} \u{0628} \u{062C} \u{062F})', example: '\u{0627}\u{0644}\u0652\u{062D}\u{064E}\u{0642}\u0651\u{064F}', quranRef: 'An-Najm 53:44' },
      { id: 'qalqalah-shugra', name: 'Qalqalah Shugra', nameAr: '\u{0642}\u{064E}\u{0644}\u{0642}\u{064E}\u{0644}\u{064E}\u{0629} \u{0635}\u{064F}\u{063A}\u{0652}\u{0631}\u{064E}\u{0649}', desc: 'Huruf qalqalah diwasal — bunyi lebih halus', example: '\u{0648}\u{064E}\u{0644}\u{064E}\u{0642}\u{064E}\u{062F}\u0652 \u{062E}\u{0644}\u{0642}\u{0652}\u{0646}\u{064E}\u{0627}', quranRef: 'Al-Hijr 15:26' },
    ]
  },
  {
    id: 'waqaf', name: 'Waqaf & Ibtida', nameAr: '\u{0627}\u{0644}\u{0648}\u{064E}\u{0642}\u{0641} \u{0648}\u{064E}\u{0627}\u{0644}\u{0627}\u{0628}\u{0652}\u{062A}\u{0650}\u{062F}\u{0627}\u{0621}', rules: [
      { id: 'waqaf-lazim', name: 'Waqaf Lazim', nameAr: '\u{0648}\u{064E}\u{0642}\u{0641} \u{0644}\u{064E}\u{0627}\u{0632}\u{0650}\u{0645}', desc: 'Waqaf wajib — tidak boleh diteruskan', example: '\u{0627}\u{0644}\u0652\u{062D}\u{064E}\u{0645}\u{0652}\u{062F}\u{064F} \u{0644}\u{0650}\u{0644}\u0651\u{064E}\u{0647}\u{0650} \u{0631}\u{064E}\u{0628}\u0651\u{0650} \u{0627}\u{0644}\u0652\u{0639}\u{064E}\u{0627}\u{0644}\u{064E}\u{0645}\u{0650}\u{064A}\u{0646}\u{064E}', quranRef: 'Al-Fatihah 1:2' },
      { id: 'waqaf-ikhtiyari', name: 'Waqaf Ikhtiyari', nameAr: '\u{0648}\u{064E}\u{0642}\u{0641} \u{0627}\u{062E}\u{0652}\u{062A}\u{0650}\u{064A}\u{064E}\u{0627}\u{0631}\u{0650}\u{064A}\u0651}', desc: 'Waqaf pilihan — boleh berhenti atau terus', example: '\u{0627}\u{0644}\u0631}\u0651\u{064E}\u{062D}\u{0645}\u{064E}\u{0640}\u{0670}\u{0646}\u{0650} \u{0627}\u{0644}\u0631}\u0651\u{064E}\u{062D}\u{0650}\u{064A}\u{0645}\u{0650}', quranRef: 'Al-Fatihah 1:3' },
    ]
  },
]

export const BADGES = [
  { id: 'hijaiyah-master', name: 'Hijaiyah Master', icon: '\u{1F524}', desc: 'Lengkapkan semua 29 huruf', condition: (ctx: BadgeCtx) => ctx.completedLetters >= 29 },
  { id: 'harakat-hero', name: 'Harakat Hero', icon: '\u{1F4CC}', desc: 'Kuasai semua 3 harakat', condition: (ctx: BadgeCtx) => ctx.harakaatMastered >= 3 },
  { id: 'tajwid-star', name: 'Tajwid Star', icon: '\u{2B50}', desc: 'Kuasai 5+ hukum tajwid', condition: (ctx: BadgeCtx) => ctx.tajwidRules >= 5 },
  { id: 'hafazan-champ', name: 'Hafazan Champion', icon: '\u{1F3C6}', desc: 'Hafaz 5+ surah', condition: (ctx: BadgeCtx) => ctx.surahsHafaz >= 5 },
  { id: 'iqra-graduate', name: 'Iqra Graduate', icon: '\u{1F393}', desc: 'Lengkapkan semua 6 buku Iqra', condition: (ctx: BadgeCtx) => ctx.booksCompleted >= 6 },
  { id: 'streak-warrior', name: 'Streak Warrior', icon: '\u{1F525}', desc: '7 hari berturut-turut', condition: (ctx: BadgeCtx) => ctx.streak >= 7 },
]

export const LEARNING_PATH = [
  { step: 1, name: 'Huruf Hijaiyah', desc: 'Pelajari 29 huruf', icon: '\u{1F524}' },
  { step: 2, name: 'Harakat', desc: 'Kuasai Fathah, Kasrah, Dhammah', icon: '\u{1F4CC}' },
  { step: 3, name: 'Tanwin & Mad', desc: 'Tanwin & hukum mad asas', icon: '\u{3030}\u{FE0F}' },
  { step: 4, name: 'Tajwid Asas', desc: 'Nun/Mim mati, Qalqalah', icon: '\u{1F3AF}' },
  { step: 5, name: 'Bacaan Al-Quran', desc: 'Baca ayat Al-Quran dengan lancar', icon: '\u{1F4D6}' },
]

export const JAKIM_TAJWID_REFS: Record<string, string> = {
  'nun-mati': 'Rujukan: Panduan Tilawah Al-Quran, JAKIM (2019), ms. 45-58',
  'mim-mati': 'Rujukan: Panduan Tilawah Al-Quran, JAKIM (2019), ms. 59-67',
  'mad': 'Rujukan: Hukum Mad Mengikut Qiraat Nafi\', JAKIM (2020), ms. 12-28',
  'qalqalah': 'Rujukan: Kaedah Tajwid KPM/JAKIM (2018), ms. 88-95',
  'waqaf': 'Rujukan: Panduan Waqaf & Ibtida, JAKIM (2021), ms. 5-22',
}

export const DAILY_CHALLENGES = [
  { type: 'sebut' as const, instruction: 'Sebut huruf ini dengan betul', items: ['\u{0628}', '\u{062A}', '\u{062B}', '\u{062C}', '\u{062D}', '\u{062E}', '\u{062F}', '\u{0630}'] },
  { type: 'harakat' as const, instruction: 'Pilih harakat yang betul', items: ['\u{0641}\u{064E}\u{062A}\u{0652}\u{062D}\u{064E}\u{0629}', '\u{0643}\u{064E}\u{0633}\u{0652}\u{0631}\u{064E}\u{0629}', '\u{0636}\u{064E}\u{0645}\u0651\u{064E}\u{0629}'] },
]

export const HAFAZAN_SURAHS = [
  { id: 1, name: '\u{0627}\u{0644}\u{0641}\u{0627}\u{062A}\u{062D}\u{0629}', nameMs: 'Al-Fatihah', verses: 7, juz: 30 },
  { id: 114, name: '\u{0627}\u{0644}\u{0646}\u{0627}\u{0633}', nameMs: 'An-Nas', verses: 6, juz: 30 },
  { id: 113, name: '\u{0627}\u{0644}\u{0641}\u{0644}\u{0642}', nameMs: 'Al-Falaq', verses: 5, juz: 30 },
  { id: 112, name: '\u{0627}\u{0644}\u{0625}\u{062E}\u{0644}\u{0627}\u{0635}', nameMs: 'Al-Ikhlas', verses: 4, juz: 30 },
  { id: 111, name: '\u{0627}\u{0644}\u{0645}\u{0633}\u{062F}', nameMs: 'Al-Masad', verses: 5, juz: 30 },
  { id: 110, name: '\u{0627}\u{0644}\u{0646}\u{0635}\u{0631}', nameMs: 'An-Nasr', verses: 3, juz: 30 },
  { id: 109, name: '\u{0627}\u{0644}\u{0643}\u{0627}\u{0641}\u{0631}\u{0648}\u{0646}', nameMs: 'Al-Kafirun', verses: 6, juz: 30 },
  { id: 108, name: '\u{0627}\u{0644}\u{0643}\u{0648}\u{062B}\u{0631}', nameMs: 'Al-Kawthar', verses: 3, juz: 30 },
  { id: 107, name: '\u{0627}\u{0644}\u{0645}\u{0627}\u{0639}\u{0648}\u{0646}', nameMs: 'Al-Ma\'un', verses: 7, juz: 30 },
  { id: 106, name: '\u{0642}\u{0631}\u{064A}\u{0634}', nameMs: 'Quraysh', verses: 4, juz: 30 },
  { id: 105, name: '\u{0627}\u{0644}\u{0641}\u{064A}\u{0644}', nameMs: 'Al-Fil', verses: 5, juz: 30 },
  { id: 104, name: '\u{0627}\u{0644}\u{0647}\u{0645}\u{0632}\u{0629}', nameMs: 'Al-Humazah', verses: 9, juz: 30 },
  { id: 103, name: '\u{0627}\u{0644}\u{0639}\u{0635}\u{0631}', nameMs: 'Al-\'Asr', verses: 3, juz: 30 },
  { id: 102, name: '\u{0627}\u{0644}\u{062A}\u{0643}\u{0627}\u{062B}\u{0631}', nameMs: 'At-Takathur', verses: 8, juz: 30 },
  { id: 101, name: '\u{0627}\u{0644}\u{0642}\u{0627}\u{0631}\u{0639}\u{0629}', nameMs: 'Al-Qari\'ah', verses: 11, juz: 30 },
  { id: 100, name: '\u{0627}\u{0644}\u{0639}\u{0627}\u{062F}\u{064A}\u{0627}\u{062A}', nameMs: 'Al-\'Adiyat', verses: 11, juz: 30 },
  { id: 99, name: '\u{0627}\u{0644}\u{0632}\u{0644}\u{0632}\u{0644}\u{0629}', nameMs: 'Az-Zalzalah', verses: 8, juz: 30 },
  { id: 98, name: '\u{0627}\u{0644}\u{0628}\u{064A}\u{0646}\u{0629}', nameMs: 'Al-Bayyinah', verses: 8, juz: 30 },
  { id: 97, name: '\u{0627}\u{0644}\u{0642}\u{062F}\u{0631}', nameMs: 'Al-Qadr', verses: 5, juz: 30 },
  { id: 96, name: '\u{0627}\u{0644}\u{0639}\u{0644}\u{0642}', nameMs: 'Al-\'Alaq', verses: 19, juz: 30 },
]
