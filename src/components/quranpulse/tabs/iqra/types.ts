import { HIJAIYAH_LETTERS } from '@/lib/quran-data'

// === Type definitions ===
export type IqraSubTab = 'belajar' | 'latihan' | 'tajwid' | 'hafazan'
export type PracticeMode = 'flashcard' | 'quiz' | 'matching' | 'tulis' | 'sebut' | 'qalqalah' | 'speed' | 'ikhfa-iqlab' | 'lam-jalalah'
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

export interface IqraBook {
  id: number
  title: string
  desc: string
  icon: string
  color: string
  pages: number
  letters: number
  focus: string
  level: string
}

// === NEW: Tafsir Huruf Fungsi (Functional Letter Analysis) ===
export interface TafsirHuruf {
  letter: string
  name: string
  categories: string[]
  isQalqalah: boolean
  isMadd: boolean
  isLin: boolean
  isSyafawi: boolean
  isHalqi: boolean
  isLisan: boolean
  isThick: boolean
  isQamariyyah: boolean
  isSyamsiyyah: boolean
}

// === NEW: IQRA Page Content ===
export interface QuranVerse {
  verse: string
  translation: string
  surah: string
  tajwidHighlight?: Array<{ from: number; to: number; rule: string; color?: string }>
}

export interface IqraPageContent {
  book: number
  page: number
  title: string
  type: 'letters' | 'harakat' | 'words' | 'verses' | 'practice'
  items: string[]
  instruction: string
}

// === Constant data ===
export const IQRA_BOOKS: IqraBook[] = [
  { id: 1, title: 'Iqra 1', desc: 'Huruf Hijaiyah & Fathah', icon: '🔤', color: '#4a4aa6', pages: 29, letters: 29, focus: 'Pengenalan 28 huruf hijaiyah tunggal dengan harakat fathah', level: 'Pemula' },
  { id: 2, title: 'Iqra 2', desc: 'Huruf Bersambung & Mad Asli', icon: '🔗', color: '#6a6ab6', pages: 28, letters: 0, focus: 'Huruf bersambung + fathah + mad asli (alif)', level: 'Asas' },
  { id: 3, title: 'Iqra 3', desc: 'Kasrah, Dhammah & Mad', icon: '〰️', color: '#d4af37', pages: 28, letters: 0, focus: 'Harakat kasrah, dhammah, mad ya & mad waw', level: 'Pertengahan' },
  { id: 4, title: 'Iqra 4', desc: 'Tanwin, Qalqalah & Izhar', icon: '🎯', color: '#e0c060', pages: 28, letters: 0, focus: 'Tanwin 3 jenis, qalqalah, izhar halqi, sukun, tasydid', level: 'Lanjutan' },
  { id: 5, title: 'Iqra 5', desc: 'Qamariyyah, Syamsiyyah & Idgham', icon: '🌙', color: '#3a3a8a', pages: 28, letters: 0, focus: 'Al-Qamariyyah, As-Syamsiyyah, wakaf, mad far\'i, lam jalalah, idgham', level: 'Mahir' },
  { id: 6, title: 'Iqra 6', desc: 'Tajwid Lengkap & Bacaan Quran', icon: '📖', color: '#2a2a6a', pages: 28, letters: 0, focus: 'Ikhfa\', iqlab, tajwid lengkap, bacaan Al-Quran, Juz Amma', level: 'Mumtaz' },
]

export const MAKHRAJ_DATA = [
  { letter: 'ا', name: 'Alif', makhraj: 'Tekak (larynx)', makhrajAr: 'الحلق', group: 'Halqi' },
  { letter: 'ب', name: 'Ba', makhraj: 'Bibir (kedua-dua bibir)', makhrajAr: 'الشفتان', group: 'Syafawi' },
  { letter: 'ت', name: 'Ta', makhraj: 'Hujung lidah + gusi atas', makhrajAr: 'طرف اللسان', group: 'Lisan' },
  { letter: 'ث', name: 'Tsa', makhraj: 'Hujung lidah + gigi atas', makhrajAr: 'طرف اللسان', group: 'Lisan' },
  { letter: 'ج', name: 'Jim', makhraj: 'Tengah lidah + lelangit keras', makhrajAr: 'وسط اللسان', group: 'Lisan' },
  { letter: 'ح', name: 'Ha', makhraj: 'Tengah tekak', makhrajAr: 'وسط الحلق', group: 'Halqi' },
  { letter: 'خ', name: 'Kho', makhraj: 'Atas tekak', makhrajAr: 'أدنى الحلق', group: 'Halqi' },
  { letter: 'د', name: 'Dal', makhraj: 'Hujung lidah + gusi atas', makhrajAr: 'طرف اللسان', group: 'Lisan' },
  { letter: 'ذ', name: 'Dzal', makhraj: 'Hujung lidah + gigi atas', makhrajAr: 'طرف اللسان', group: 'Lisan' },
  { letter: 'ر', name: 'Ra', makhraj: 'Hujung lidah + gusi atas (gulung)', makhrajAr: 'طرف اللسان', group: 'Lisan' },
  { letter: 'ز', name: 'Zai', makhraj: 'Hujung lidah + gigi atas', makhrajAr: 'طرف اللسان', group: 'Lisan' },
  { letter: 'س', name: 'Sin', makhraj: 'Hujung lidah + gusi atas', makhrajAr: 'طرف اللسان', group: 'Lisan' },
  { letter: 'ش', name: 'Syin', makhraj: 'Tengah lidah + lelangit keras', makhrajAr: 'وسط اللسان', group: 'Lisan' },
  { letter: 'ص', name: 'Shod', makhraj: 'Hujung lidah + gusi atas (tebal)', makhrajAr: 'طرف اللسان', group: 'Lisan' },
  { letter: 'ض', name: 'Dhod', makhraj: 'Sisi lidah + gusi atas', makhrajAr: 'حافة اللسان', group: 'Lisan' },
  { letter: 'ط', name: 'Tho', makhraj: 'Hujung lidah + gusi atas (tebal)', makhrajAr: 'طرف اللسان', group: 'Lisan' },
  { letter: 'ظ', name: 'Zho', makhraj: 'Hujung lidah + gigi atas (tebal)', makhrajAr: 'طرف اللسان', group: 'Lisan' },
  { letter: 'ع', name: 'Ain', makhraj: 'Tengah tekak (farinks)', makhrajAr: 'وسط الحلق', group: 'Halqi' },
  { letter: 'غ', name: 'Ghoin', makhraj: 'Atas tekak (uvula)', makhrajAr: 'أدنى الحلق', group: 'Halqi' },
  { letter: 'ف', name: 'Fa', makhraj: 'Bibir bawah + gigi atas', makhrajAr: 'الشفة السفلى', group: 'Syafawi' },
  { letter: 'ق', name: 'Qof', makhraj: 'Belakang lidah + lelangit lembut', makhrajAr: 'أقصى اللسان', group: 'Lisan' },
  { letter: 'ك', name: 'Kaf', makhraj: 'Belakang lidah + lelangit keras', makhrajAr: 'أقصى اللسان', group: 'Lisan' },
  { letter: 'ل', name: 'Lam', makhraj: 'Hujung lidah + gusi atas', makhrajAr: 'طرف اللسان', group: 'Lisan' },
  { letter: 'م', name: 'Mim', makhraj: 'Bibir (tertutup)', makhrajAr: 'الشفتان', group: 'Syafawi' },
  { letter: 'ن', name: 'Nun', makhraj: 'Hujung lidah + gusi atas (hidung)', makhrajAr: 'طرف اللسان', group: 'Lisan' },
  { letter: 'ه', name: 'Ha', makhraj: 'Bawah tekak', makhrajAr: 'أدنى الحلق', group: 'Halqi' },
  { letter: 'و', name: 'Wau', makhraj: 'Bibir (bulat)', makhrajAr: 'الشفتان', group: 'Syafawi' },
  { letter: 'ي', name: 'Ya', makhraj: 'Tengah lidah + lelangit keras', makhrajAr: 'وسط اللسان', group: 'Lisan' },
]

export const SIFAT_HURUF = [
  { letter: 'ا', name: 'Alif', sifat: ['Lembut', 'Terbuka'], thick: false },
  { letter: 'ب', name: 'Ba', sifat: ['Teguh', 'Serak'], thick: false },
  { letter: 'ت', name: 'Ta', sifat: ['Lembut', 'Berbisik'], thick: false },
  { letter: 'ث', name: 'Tsa', sifat: ['Lembut', 'Berbisik'], thick: false },
  { letter: 'ج', name: 'Jim', sifat: ['Teguh', 'Serak'], thick: false },
  { letter: 'ح', name: 'Ha', sifat: ['Lembut', 'Terbuka'], thick: false },
  { letter: 'خ', name: 'Kho', sifat: ['Lembut', 'Terbuka'], thick: false },
  { letter: 'د', name: 'Dal', sifat: ['Teguh', 'Serak'], thick: false },
  { letter: 'ذ', name: 'Dzal', sifat: ['Lembut', 'Berbisik'], thick: false },
  { letter: 'ر', name: 'Ra', sifat: ['Teguh', 'Bergetar'], thick: false },
  { letter: 'ز', name: 'Zai', sifat: ['Lembut', 'Berbisik'], thick: false },
  { letter: 'س', name: 'Sin', sifat: ['Lembut', 'Berbisik'], thick: false },
  { letter: 'ش', name: 'Syin', sifat: ['Lembut', 'Berbisik'], thick: false },
  { letter: 'ص', name: 'Shod', sifat: ['Teguh', 'Berbisik', 'Dengung'], thick: true },
  { letter: 'ض', name: 'Dhod', sifat: ['Teguh', 'Serak', 'Sisi lidah'], thick: true },
  { letter: 'ط', name: 'Tho', sifat: ['Teguh', 'Serak'], thick: true },
  { letter: 'ظ', name: 'Zho', sifat: ['Teguh', 'Berbisik'], thick: true },
  { letter: 'ع', name: 'Ain', sifat: ['Teguh', 'Terbuka'], thick: false },
  { letter: 'غ', name: 'Ghoin', sifat: ['Teguh', 'Terbuka'], thick: false },
  { letter: 'ف', name: 'Fa', sifat: ['Lembut', 'Berbisik'], thick: false },
  { letter: 'ق', name: 'Qof', sifat: ['Teguh', 'Serak', 'Qalqalah'], thick: true },
  { letter: 'ك', name: 'Kaf', sifat: ['Lembut', 'Berbisik'], thick: false },
  { letter: 'ل', name: 'Lam', sifat: ['Lembut', 'Terbuka'], thick: false },
  { letter: 'م', name: 'Mim', sifat: ['Teguh', 'Dengung'], thick: false },
  { letter: 'ن', name: 'Nun', sifat: ['Teguh', 'Dengung'], thick: false },
  { letter: 'ه', name: 'Ha', sifat: ['Lembut', 'Terbuka'], thick: false },
  { letter: 'و', name: 'Wau', sifat: ['Lembut', 'Terbuka'], thick: false },
  { letter: 'ي', name: 'Ya', sifat: ['Lembut', 'Terbuka'], thick: false },
]

export const WAQAF_SIGNS = [
  { symbol: 'م', name: 'Waqaf Lazim', nameAr: 'وقف لازم', desc: 'Wajib berhenti — tidak boleh diteruskan', color: '#ef4444' },
  { symbol: 'لا', name: 'Laa Waqaf', nameAr: 'لا وقف', desc: 'Jangan berhenti — teruskan bacaan', color: '#ef4444' },
  { symbol: 'ج', name: 'Waqaf Jaiz', nameAr: 'وقف جائز', desc: 'Boleh berhenti atau terus — lebih baik berhenti', color: '#d4af37' },
  { symbol: 'ز', name: 'Waqaf Jaiz (Terus)', nameAr: 'وقف جائز', desc: 'Boleh berhenti atau terus — lebih baik terus', color: '#4a4aa6' },
  { symbol: 'صلى', name: 'Al-Washl Awlaa', nameAr: 'الصلب أولى', desc: 'Lebih baik teruskan bacaan', color: '#4a4aa6' },
  { symbol: 'قلى', name: 'Qila Waqaf', nameAr: 'قيلا وقف', desc: 'Dikatakan boleh berhenti', color: '#d4af37' },
  { symbol: '⊃', name: 'Mu\'anaqah', nameAr: 'معانقة', desc: 'Berhenti di salah satu, bukan kedua-duanya', color: '#6a6ab6' },
  { symbol: 'طين', name: 'Waqaf Tawil', nameAr: 'وقف طويل', desc: 'Berhenti panjang tanpa nafas baru', color: '#6a6ab6' },
]

export const AL_QAMARIYYAH = {
  name: 'Al-Qamariyyah',
  nameAr: 'القمرية',
  desc: 'Alif Lam dibaca jelas — 14 huruf bulan',
  color: '#6a6ab6',
  letters: ['ا', 'ب', 'ج', 'ح', 'خ', 'ع', 'غ', 'ف', 'ق', 'ك', 'م', 'ه', 'و', 'ي'],
  example: 'اَلْكِتَابُ (al-kitaabu)',
}

export const AL_SYAMSIYYAH = {
  name: 'As-Syamsiyyah',
  nameAr: 'الشمسية',
  desc: 'Alif Lam dimasukkan — 14 huruf matahari',
  color: '#d4af37',
  letters: ['ت', 'ث', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ل', 'ن'],
  example: 'الشَّمْسُ (asy-syamsu)',
}

export const IDGHAM_DETAIL = {
  bighunnah: {
    name: 'Idgham Bighunnah',
    nameAr: 'إدغام بغنة',
    desc: 'Masuk dengan dengung 2 harakat',
    letters: ['ي', 'ن', 'م', 'و'],
    mnemonic: 'ينمو (Yanmu)',
    color: '#22c55e',
    examples: [
      { from: 'مِنْ يَدٍ', result: 'miy-yadin', desc: 'Nun + Ya → masuk dengan dengung' },
      { from: 'مِنْ نِّعْمَةٍ', result: 'min-ni\'matin', desc: 'Nun + Nun → masuk dengan dengung' },
      { from: 'مِن مَّالٍ', result: 'mim-malin', desc: 'Nun + Mim → masuk dengan dengung' },
      { from: 'مِن وَلِيٍّ', result: 'miw-waliyyin', desc: 'Nun + Waw → masuk dengan dengung' },
    ],
  },
  bilaghunnah: {
    name: 'Idgham Bilaghunnah',
    nameAr: 'إدغام بلا غنة',
    desc: 'Masuk tanpa dengung',
    letters: ['ل', 'ر'],
    mnemonic: 'ل، ر',
    color: '#4a4aa6',
    examples: [
      { from: 'مِن لَّدُنْهُ', result: 'mil-ladunhu', desc: 'Nun + Lam → masuk tanpa dengung' },
      { from: 'مِن رَّبٍّ', result: 'mir-rabbin', desc: 'Nun + Ra → masuk tanpa dengung' },
    ],
  },
}

export const IKHFA_LETTERS = {
  name: 'Ikhfa\' Haqiqi',
  nameAr: 'إخفاء حقيقي',
  desc: 'Sembunyikan bunyi nun — 15 huruf',
  letters: ['ص', 'ذ', 'ث', 'ك', 'ج', 'ش', 'ق', 'س', 'د', 'ط', 'ز', 'ف', 'ت', 'ض', 'ظ'],
  color: '#22c55e',
  examples: [
    { from: 'مِن تَحْتِهَا', result: 'min-tahtihaa', desc: 'Nun + Ta → ikhfa\'' },
    { from: 'مِن جِهَنَّمَ', result: 'min-jahannama', desc: 'Nun + Jim → ikhfa\'' },
  ],
}

export const IQLAB_DATA = {
  name: 'Iqlab',
  nameAr: 'إقلاب',
  desc: 'Tukar bunyi nun menjadi mim — 1 huruf',
  letter: 'ب',
  color: '#8b5cf6',
  examples: [
    { from: 'مِن بَعْدِ', result: 'mim-ba\'di', desc: 'Nun + Ba → jadi mim' },
  ],
}

export const QALQALAH_DETAIL = {
  name: 'Qalqalah',
  nameAr: 'قلقلة',
  desc: 'Bunyi pantulan/berdentingan',
  letters: [
    { letter: 'ق', name: 'Qof', strength: 'kuat' },
    { letter: 'ط', name: 'Tho', strength: 'kuat' },
    { letter: 'ب', name: 'Ba', strength: 'kuat' },
    { letter: 'ج', name: 'Jim', strength: 'kuat' },
    { letter: 'د', name: 'Dal', strength: 'kuat' },
  ],
  mnemonic: 'قطب جد (Qutha Jada)',
  types: [
    { name: 'Qalqalah Kubra', desc: 'Di akhir kalimah (waqaf) — bunyi lebih kuat', example: 'اَلْحَقُّ', color: '#ef4444' },
    { name: 'Qalqalah Shugra', desc: 'Di tengah kalimah (wasal) — bunyi lebih halus', example: 'وَلَقَدْ خَلَقْنَا', color: '#f97316' },
  ],
}

export const MAD_DETAIL = [
  { id: 'mad-thabii', name: 'Mad Thabi\'i', nameAr: 'مد طبيعي', length: '2 harakat', condition: 'Fathah + Alif, Kasrah + Ya, Dhammah + Waw', example: 'قَالَ، قِيلَ، يَقُولُ', color: '#3b82f6', book: 2 },
  { id: 'mad-wajib', name: 'Mad Wajib Muttashil', nameAr: 'مد واجب متصل', length: '4-5 harakat', condition: 'Mad + Hamzah dalam 1 perkataan', example: 'السَّمَاءِ', color: '#ef4444', book: 5 },
  { id: 'mad-jaiz', name: 'Mad Jaiz Munfashil', nameAr: 'مد جائز منفصل', length: '2-4 harakat', condition: 'Mad + Hamzah dalam 2 perkataan', example: 'يَا أَيُّهَا', color: '#f97316', book: 5 },
  { id: 'mad-aridh', name: 'Mad \'Aridh Lil Sukun', nameAr: 'مد عارض للسكون', length: '2-4 harakat', condition: 'Mad sebelum sukun di akhir (waqaf)', example: 'الْعَالَمِينَ', color: '#d4af37', book: 5 },
  { id: 'mad-lin', name: 'Mad Lin', nameAr: 'مد لين', length: '2-4 harakat', condition: 'Waw/Ya sukun selepas fathah di akhir (waqaf)', example: 'الصَّيْفِ', color: '#6a6ab6', book: 5 },
  { id: 'mad-lazim', name: 'Mad Lazim', nameAr: 'مد لازم', length: '6 harakat', condition: 'Mad + sukun berat dalam 1 perkataan', example: 'الضَّالِّينَ', color: '#8b5cf6', book: 6 },
]

export const TAJWID_COLORS = {
  dengung: { color: '#22c55e', label: 'Dengung (Ghunnah)', rules: ['Idgham Bighunnah', 'Ikhfa\'', 'Iqlab'] },
  qalqalah: { color: '#ef4444', label: 'Qalqalah', rules: ['Qalqalah Kubra', 'Qalqalah Shugra'] },
  mad: { color: '#3b82f6', label: 'Mad (Elongasi)', rules: ['Mad Thabi\'i', 'Mad Wajib', 'Mad Jaiz', 'Mad \'Aridh', 'Mad Lin', 'Mad Lazim'] },
  tasydid: { color: '#d4af37', label: 'Tasydid (Gandaan)', rules: ['Shaddah'] },
  lamJalalah: { color: '#8b5cf6', label: 'Lam Jalalah', rules: ['Lam Jalalah'] },
  izhar: { color: '#9ca3af', label: 'Izhar (Jelas)', rules: ['Izhar Halqi', 'Izhar Syafawi'] },
  wakaf: { color: '#6b7280', label: 'Wakaf (Berhenti)', rules: ['Waqaf Lazim', 'Waqaf Jaiz'] },
}

// === NEW: Color-Coded Harakat System ===
export const HARAKAT_COLORS = {
  fathah: '#ef4444',
  kasrah: '#3b82f6',
  dhammah: '#22c55e',
  tanwinFath: '#f97316',
  tanwinKasr: '#6366f1',
  tanwinDham: '#14b8a6',
  sukun: '#6b7280',
  shaddah: '#d4af37',
}

// === Enhanced Quran Verses with Tajwid Highlights ===
export const QURAN_VERSES_PER_BOOK: Record<number, QuranVerse[]> = {
  1: [
    { verse: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', translation: 'Dengan nama Allah Yang Maha Pemurah Lagi Maha Penyayang', surah: 'Al-Fatihah 1:1', tajwidHighlight: [
      { from: 0, to: 5, rule: 'fathah', color: HARAKAT_COLORS.fathah },
      { from: 6, to: 12, rule: 'lamJalalah', color: '#8b5cf6' },
      { from: 18, to: 24, rule: 'mad', color: '#3b82f6' },
    ] },
    { verse: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', translation: 'Katakanlah: Dialah Allah Yang Maha Esa', surah: 'Al-Ikhlas 112:1', tajwidHighlight: [
      { from: 0, to: 2, rule: 'qalqalah', color: '#ef4444' },
      { from: 7, to: 12, rule: 'lamJalalah', color: '#8b5cf6' },
      { from: 14, to: 17, rule: 'fathah', color: HARAKAT_COLORS.fathah },
    ] },
    { verse: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَالَمِينَ', translation: 'Segala puji bagi Allah Tuhan semesta alam', surah: 'Al-Fatihah 1:2', tajwidHighlight: [
      { from: 0, to: 5, rule: 'qalqalah', color: '#ef4444' },
      { from: 7, to: 13, rule: 'lamJalalah', color: '#8b5cf6' },
      { from: 20, to: 27, rule: 'mad', color: '#3b82f6' },
    ] },
    { verse: 'ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', translation: 'Yang Maha Pemurah Lagi Maha Penyayang', surah: 'Al-Fatihah 1:3', tajwidHighlight: [
      { from: 0, to: 3, rule: 'syamsiyyah', color: '#d4af37' },
      { from: 5, to: 10, rule: 'mad', color: '#3b82f6' },
      { from: 11, to: 14, rule: 'syamsiyyah', color: '#d4af37' },
    ] },
    { verse: 'مَـٰلِكِ يَوْمِ ٱلدِّينِ', translation: 'Yang menguasai hari pembalasan', surah: 'Al-Fatihah 1:4', tajwidHighlight: [
      { from: 0, to: 4, rule: 'mad', color: '#3b82f6' },
      { from: 10, to: 14, rule: 'syamsiyyah', color: '#d4af37' },
    ] },
    { verse: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', translation: 'Hanya Engkau kami sembah dan hanya Engkau kami minta pertolongan', surah: 'Al-Fatihah 1:5', tajwidHighlight: [
      { from: 0, to: 4, rule: 'mad', color: '#3b82f6' },
      { from: 6, to: 10, rule: 'fathah', color: HARAKAT_COLORS.fathah },
    ] },
  ],
  2: [
    { verse: 'بَسْمِ ٱللهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', translation: 'Dengan nama Allah...', surah: 'Al-Fatihah 1:1', tajwidHighlight: [
      { from: 0, to: 4, rule: 'fathah', color: HARAKAT_COLORS.fathah },
      { from: 5, to: 10, rule: 'lamJalalah', color: '#8b5cf6' },
      { from: 11, to: 14, rule: 'syamsiyyah', color: '#d4af37' },
      { from: 16, to: 21, rule: 'mad', color: '#3b82f6' },
    ] },
    { verse: 'هُوَ ٱللَّهُ ٱلَّذِى لَآ إِلَـٰهَ إِلَّا هُوَ', translation: 'Dialah Allah tiada Tuhan melainkan Dia', surah: 'Al-Hashr 59:22', tajwidHighlight: [
      { from: 3, to: 8, rule: 'lamJalalah', color: '#8b5cf6' },
      { from: 16, to: 19, rule: 'mad', color: '#3b82f6' },
    ] },
    { verse: 'قَالَ رَبِّ ٱلْعَرْشِ ٱلْعَظِيمِ', translation: 'Katakanlah Tuhan Arasy Yang Maha Agung', surah: 'Al-Isra 17:42', tajwidHighlight: [
      { from: 0, to: 3, rule: 'qalqalah', color: '#ef4444' },
      { from: 3, to: 6, rule: 'mad', color: '#3b82f6' },
      { from: 14, to: 20, rule: 'mad', color: '#3b82f6' },
    ] },
    { verse: 'رَبِّ ٱلْعَالَمِينَ', translation: 'Tuhan semesta alam', surah: 'Al-Fatihah 1:2', tajwidHighlight: [
      { from: 4, to: 12, rule: 'mad', color: '#3b82f6' },
    ] },
    { verse: 'يَا أَيُّهَا ٱلَّذِينَ ءَامَنُوا', translation: 'Wahai orang-orang yang beriman', surah: 'Al-Baqarah 2:104', tajwidHighlight: [
      { from: 0, to: 2, rule: 'mad', color: '#3b82f6' },
      { from: 3, to: 8, rule: 'mad', color: '#3b82f6' },
      { from: 10, to: 17, rule: 'qamariyyah', color: '#6a6ab6' },
    ] },
    { verse: 'ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ', translation: 'Itulah kitab tidak ada keraguan di dalamnya, petunjuk bagi orang yang bertaqwa', surah: 'Al-Baqarah 2:2', tajwidHighlight: [
      { from: 5, to: 13, rule: 'qamariyyah', color: '#6a6ab6' },
      { from: 15, to: 20, rule: 'mad', color: '#3b82f6' },
    ] },
  ],
  3: [
    { verse: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', translation: 'Hanya Engkau kami sembah dan hanya Engkau kami minta pertolongan', surah: 'Al-Fatihah 1:5', tajwidHighlight: [
      { from: 0, to: 4, rule: 'mad', color: '#3b82f6' },
      { from: 13, to: 17, rule: 'mad', color: '#3b82f6' },
    ] },
    { verse: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ', translation: 'Tunjukilah kami jalan yang lurus', surah: 'Al-Fatihah 1:6', tajwidHighlight: [
      { from: 0, to: 4, rule: 'mad', color: '#3b82f6' },
      { from: 6, to: 9, rule: 'syamsiyyah', color: '#d4af37' },
      { from: 10, to: 14, rule: 'mad', color: '#3b82f6' },
      { from: 16, to: 22, rule: 'qamariyyah', color: '#6a6ab6' },
    ] },
    { verse: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ ٱللَّهُ ٱلصَّمَدُ', translation: 'Katakanlah: Dialah Allah Yang Maha Esa, Allah tempat bergantung', surah: 'Al-Ikhlas 112:1-2', tajwidHighlight: [
      { from: 0, to: 2, rule: 'qalqalah', color: '#ef4444' },
      { from: 3, to: 8, rule: 'lamJalalah', color: '#8b5cf6' },
      { from: 13, to: 18, rule: 'lamJalalah', color: '#8b5cf6' },
      { from: 20, to: 23, rule: 'syamsiyyah', color: '#d4af37' },
    ] },
    { verse: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', translation: 'Dia tidak beranak dan tidak diperanakkan', surah: 'Al-Ikhlas 112:3', tajwidHighlight: [
      { from: 0, to: 3, rule: 'qalqalah', color: '#ef4444' },
      { from: 5, to: 8, rule: 'kasrah', color: HARAKAT_COLORS.kasrah },
      { from: 10, to: 15, rule: 'dhammah', color: HARAKAT_COLORS.dhammah },
    ] },
    { verse: 'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ', translation: 'Dan tidak ada sesuatu yang setara dengan-Nya', surah: 'Al-Ikhlas 112:4', tajwidHighlight: [
      { from: 2, to: 5, rule: 'qalqalah', color: '#ef4444' },
      { from: 8, to: 10, rule: 'dhammah', color: HARAKAT_COLORS.dhammah },
    ] },
    { verse: 'سُبْحَـٰنَ رَبِّكَ رَبِّ ٱلْعِزَّةِ عَمَّا يَصِفُونَ', translation: 'Maha Suci Tuhanmu Tuhan Kemuliaan dari apa yang mereka sifatkan', surah: 'As-Saffat 37:180', tajwidHighlight: [
      { from: 0, to: 6, rule: 'mad', color: '#3b82f6' },
      { from: 14, to: 20, rule: 'qamariyyah', color: '#6a6ab6' },
    ] },
  ],
  4: [
    { verse: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', translation: 'Bismillah...', surah: 'Al-Fatihah 1:1', tajwidHighlight: [
      { from: 0, to: 5, rule: 'kasrah', color: HARAKAT_COLORS.kasrah },
      { from: 6, to: 12, rule: 'lamJalalah', color: '#8b5cf6' },
      { from: 18, to: 24, rule: 'mad', color: '#3b82f6' },
    ] },
    { verse: 'أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ', translation: 'Ingat, hanya dengan mengingati Allah hati menjadi tenteram', surah: 'Ar-Ra\'d 13:28', tajwidHighlight: [
      { from: 7, to: 14, rule: 'lamJalalah', color: '#8b5cf6' },
      { from: 22, to: 27, rule: 'qalqalah', color: '#ef4444' },
    ] },
    { verse: 'إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا', translation: 'Sesungguhnya bersama kesulitan ada kemudahan', surah: 'Al-Insyirah 94:6', tajwidHighlight: [
      { from: 0, to: 3, rule: 'tasydid', color: '#d4af37' },
      { from: 11, to: 15, rule: 'qamariyyah', color: '#6a6ab6' },
    ] },
    { verse: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا', translation: 'Maka sesungguhnya bersama kesulitan ada kemudahan', surah: 'Al-Insyirah 94:5', tajwidHighlight: [
      { from: 2, to: 5, rule: 'tasydid', color: '#d4af37' },
      { from: 10, to: 14, rule: 'qamariyyah', color: '#6a6ab6' },
    ] },
    { verse: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ', translation: 'Bukankah Kami telah melapangkan dadamu?', surah: 'Al-Insyirah 94:1', tajwidHighlight: [
      { from: 0, to: 3, rule: 'qalqalah', color: '#ef4444' },
      { from: 11, to: 14, rule: 'qalqalah', color: '#ef4444' },
    ] },
    { verse: 'وَوَضَعْنَا عَنكَ وِزْرَكَ ٱلَّذِىٓ أَنقَضَ ظَهْرَكَ', translation: 'Dan Kami telah mengangkat bebanmu yang memberatkan punggungmu', surah: 'Al-Insyirah 94:2-3', tajwidHighlight: [
      { from: 4, to: 8, rule: 'qalqalah', color: '#ef4444' },
      { from: 17, to: 22, rule: 'qalqalah', color: '#ef4444' },
    ] },
  ],
  5: [
    { verse: 'اَللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ', translation: 'Allah tiada Tuhan melainkan Dia Yang Hidup Yang Berdiri Sendiri', surah: 'Al-Baqarah 2:255', tajwidHighlight: [
      { from: 0, to: 6, rule: 'lamJalalah', color: '#8b5cf6' },
      { from: 8, to: 12, rule: 'mad', color: '#3b82f6' },
      { from: 21, to: 25, rule: 'mad', color: '#3b82f6' },
      { from: 26, to: 32, rule: 'qalqalah', color: '#ef4444' },
    ] },
    { verse: 'فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ', translation: 'Maka nikmat Tuhan kamu yang manakah yang kamu dustakan?', surah: 'Ar-Rahman 55:13', tajwidHighlight: [
      { from: 0, to: 5, rule: 'mad', color: '#3b82f6' },
      { from: 22, to: 27, rule: 'tasydid', color: '#d4af37' },
    ] },
    { verse: 'ٱلرَّحْمَـٰنُ عَلَّمَ ٱلْقُرْءَانَ', translation: 'Yang Maha Pemurah, Yang mengajarkan Al-Quran', surah: 'Ar-Rahman 55:1-2', tajwidHighlight: [
      { from: 0, to: 3, rule: 'syamsiyyah', color: '#d4af37' },
      { from: 5, to: 11, rule: 'mad', color: '#3b82f6' },
      { from: 15, to: 21, rule: 'qamariyyah', color: '#6a6ab6' },
    ] },
    { verse: 'خَلَقَ ٱلْإِنسَـٰنَ عَلَّمَهُ ٱلْبَيَانَ', translation: 'Dia menciptakan manusia, mengajarnya pandai berbicara', surah: 'Ar-Rahman 55:3-4', tajwidHighlight: [
      { from: 6, to: 13, rule: 'qamariyyah', color: '#6a6ab6' },
      { from: 17, to: 22, rule: 'qamariyyah', color: '#6a6ab6' },
    ] },
    { verse: 'لَهُۥ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ', translation: 'Milik-Nya apa yang di langit dan apa yang di bumi', surah: 'Ar-Rahman 55:5', tajwidHighlight: [
      { from: 7, to: 10, rule: 'qamariyyah', color: '#6a6ab6' },
      { from: 10, to: 18, rule: 'mad', color: '#3b82f6' },
    ] },
    { verse: 'يَسْـَٔلُهُۥ مَن فِى ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضِ كُلَّ يَوْمٍ هُوَ فِى شَأْنٍ', translation: 'Semua yang di langit dan di bumi memohon kepada-Nya, setiap hari Dia dalam urusan', surah: 'Ar-Rahman 55:29', tajwidHighlight: [
      { from: 9, to: 12, rule: 'syamsiyyah', color: '#d4af37' },
      { from: 13, to: 20, rule: 'mad', color: '#3b82f6' },
      { from: 22, to: 27, rule: 'qamariyyah', color: '#6a6ab6' },
    ] },
  ],
  6: [
    { verse: 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ', translation: 'Katakanlah: Aku berlindung dengan Tuhan manusia', surah: 'An-Nas 114:1', tajwidHighlight: [
      { from: 0, to: 2, rule: 'qalqalah', color: '#ef4444' },
      { from: 11, to: 14, rule: 'syamsiyyah', color: '#d4af37' },
    ] },
    { verse: 'مَلِكِ ٱلنَّاسِ', translation: 'Raja manusia', surah: 'An-Nas 114:2', tajwidHighlight: [
      { from: 4, to: 8, rule: 'syamsiyyah', color: '#d4af37' },
    ] },
    { verse: 'إِلَـٰهِ ٱلنَّاسِ', translation: 'Tuhan manusia', surah: 'An-Nas 114:3', tajwidHighlight: [
      { from: 0, to: 4, rule: 'mad', color: '#3b82f6' },
      { from: 6, to: 10, rule: 'syamsiyyah', color: '#d4af37' },
    ] },
    { verse: 'مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ', translation: 'Dari kejahatan bisikan syaitan yang bersembunyi', surah: 'An-Nas 114:4', tajwidHighlight: [
      { from: 2, to: 5, rule: 'tasydid', color: '#d4af37' },
      { from: 7, to: 11, rule: 'qamariyyah', color: '#6a6ab6' },
      { from: 14, to: 18, rule: 'tasydid', color: '#d4af37' },
    ] },
    { verse: 'ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ', translation: 'Yang membisikkan ke dalam dada manusia', surah: 'An-Nas 114:5', tajwidHighlight: [
      { from: 0, to: 4, rule: 'qamariyyah', color: '#6a6ab6' },
      { from: 14, to: 18, rule: 'syamsiyyah', color: '#d4af37' },
    ] },
    { verse: 'مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ', translation: 'Dari jin dan manusia', surah: 'An-Nas 114:6', tajwidHighlight: [
      { from: 3, to: 8, rule: 'qamariyyah', color: '#6a6ab6' },
      { from: 8, to: 11, rule: 'tasydid', color: '#d4af37' },
      { from: 14, to: 18, rule: 'syamsiyyah', color: '#d4af37' },
    ] },
  ],
}

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

// === ENHANCED: Real Connected Letter Forms ===
// Map of letter → { isolated, initial, medial, final }
const REAL_LETTER_FORMS: Record<string, { isolated: string; initial: string; medial: string; final: string }> = {
  'ا': { isolated: 'ا', initial: 'ا', medial: 'ا', final: 'ا' },
  'ب': { isolated: 'ب', initial: 'بـ', medial: 'ـبـ', final: 'ـب' },
  'ت': { isolated: 'ت', initial: 'تـ', medial: 'ـتـ', final: 'ـت' },
  'ث': { isolated: 'ث', initial: 'ثـ', medial: 'ـثـ', final: 'ـث' },
  'ج': { isolated: 'ج', initial: 'جـ', medial: 'ـجـ', final: 'ـج' },
  'ح': { isolated: 'ح', initial: 'حـ', medial: 'ـحـ', final: 'ـح' },
  'خ': { isolated: 'خ', initial: 'خـ', medial: 'ـخـ', final: 'ـخ' },
  'د': { isolated: 'د', initial: 'د', medial: 'ـد', final: 'ـد' },
  'ذ': { isolated: 'ذ', initial: 'ذ', medial: 'ـذ', final: 'ـذ' },
  'ر': { isolated: 'ر', initial: 'ر', medial: 'ـر', final: 'ـر' },
  'ز': { isolated: 'ز', initial: 'ز', medial: 'ـز', final: 'ـز' },
  'س': { isolated: 'س', initial: 'سـ', medial: 'ـسـ', final: 'ـس' },
  'ش': { isolated: 'ش', initial: 'شـ', medial: 'ـشـ', final: 'ـش' },
  'ص': { isolated: 'ص', initial: 'صـ', medial: 'ـصـ', final: 'ـص' },
  'ض': { isolated: 'ض', initial: 'ضـ', medial: 'ـضـ', final: 'ـض' },
  'ط': { isolated: 'ط', initial: 'طـ', medial: 'ـطـ', final: 'ـط' },
  'ظ': { isolated: 'ظ', initial: 'ظـ', medial: 'ـظـ', final: 'ـظ' },
  'ع': { isolated: 'ع', initial: 'عـ', medial: 'ـعـ', final: 'ـع' },
  'غ': { isolated: 'غ', initial: 'غـ', medial: 'ـغـ', final: 'ـغ' },
  'ف': { isolated: 'ف', initial: 'فـ', medial: 'ـفـ', final: 'ـف' },
  'ق': { isolated: 'ق', initial: 'قـ', medial: 'ـقـ', final: 'ـق' },
  'ك': { isolated: 'ك', initial: 'كـ', medial: 'ـكـ', final: 'ـك' },
  'ل': { isolated: 'ل', initial: 'لـ', medial: 'ـلـ', final: 'ـل' },
  'م': { isolated: 'م', initial: 'مـ', medial: 'ـمـ', final: 'ـم' },
  'ن': { isolated: 'ن', initial: 'نـ', medial: 'ـنـ', final: 'ـن' },
  'ه': { isolated: 'ه', initial: 'هـ', medial: 'ـهـ', final: 'ـه' },
  'و': { isolated: 'و', initial: 'و', medial: 'ـو', final: 'ـو' },
  'ي': { isolated: 'ي', initial: 'يـ', medial: 'ـيـ', final: 'ـي' },
  'ء': { isolated: 'ء', initial: 'ء', medial: 'ء', final: 'ء' },
}

export const ENHANCED_LETTERS: EnhancedLetter[] = HIJAIYAH_LETTERS.map(l => ({
  ...l,
  forms: REAL_LETTER_FORMS[l.letter] || { isolated: l.letter, initial: l.letter, medial: l.letter, final: l.letter },
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
  { id: 'mad-thabii', name: 'Mad Thabi\'i', nameAr: '\u{0645}\u{064E}\u{062F}\u{0651} \u{0637}\u{064E}\u{0628}\u{0650}\u{064A}\u{0639}\u{0650}\u{064A}\u0655}', symbol: '\u{0622}', desc: 'Elongasi 2 harakat', example: '\u{0642}\u{064E}\u{0627}\u{0644}\u{064E} (qaa-la)' },
  { id: 'mad-wajib', name: 'Mad Wajib Muttashil', nameAr: '\u{0645}\u{064E}\u{062F}\u{0651} \u{0648}\u{064E}\u{0627}\u{062C}\u{0650}\u{0628} \u{0645}\u{064F}\u{062A}\u0651\u{064E}\u{0635}\u{0650}\u{0644}', symbol: '\u{064B}', desc: 'Elongasi wajib 4-5 harakat', example: '\u{0627}\u{0644}\u{0633}\u0651\u{064E}\u{0645}\u{064E}\u{0627}\u{0621}\u{0650}' },
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
      { id: 'izhar-mim', name: 'Izhar Syafawi', nameAr: '\u{0625}\u{0650}\u{0638}\u{0652}\u{0647}\u{064E}\u{0627}\u{0631} \u{0634}\u{064E}\u{0641}\u{064E}\u{0648}\u{0650}\u{064A}\u0655}', desc: 'Sebutan jelas — selepas 26 huruf selain mim & ba', example: '\u{0647}\u{064F}\u{0645}\u{0652} \u{0641}\u{0650}\u{064A}\u{0647}\u{064E}\u{0627}', quranRef: 'Al-Baqarah 2:25' },
      { id: 'idgham-mim', name: 'Idgham Mimi', nameAr: '\u{0625}\u{0650}\u{062F}\u{0652}\u{063A}\u{064E}\u{0627}\u{0645} \u{0645}\u{0650}\u{064A}\u{0645}\u{0650}\u{064A}\u0655}', desc: 'Masuk mim — selepas mim', example: '\u{0648}\u{064E}\u{0645}\u{064E}\u{0627} \u{0644}\u{064E}\u{0647}\u{064F}\u{0645} \u{0645}\u0651\u{0650}\u{0646}', quranRef: 'Al-Baqarah 2:2' },
      { id: 'ikhfa-mim', name: 'Ikhfa Syafawi', nameAr: '\u{0625}\u{0650}\u{062E}\u{0652}\u{0641}\u{064E}\u{0627}\u{0621} \u{0634}\u{064E}\u{0641}\u{064E}\u{0648}\u{0650}\u{064A}\u0655}', desc: 'Sembunyikan — selepas ba', example: '\u{0648}\u{064E}\u{0645}\u{064E}\u{0627} \u{0628}\u{0650}\u{0647}\u{0650}\u{0645}', quranRef: 'Al-Baqarah 2:4' },
    ]
  },
  {
    id: 'mad', name: 'Hukum Mad', nameAr: '\u{0623}\u{064E}\u{062D}\u{064F}\u{0643}\u{064E}\u{0627}\u{0645} \u{0627}\u{0644}\u{0645}\u{064E}\u{062F}\u0651}', rules: [
      { id: 'mad-thabii-t', name: 'Mad Thabi\'i', nameAr: '\u{0645}\u{064E}\u{062F}\u0651 \u{0637}\u{064E}\u{0628}\u{0650}\u{064A}\u{0639}\u{0650}\u{064A}\u0655}', desc: 'Mad asli 2 harakat', example: '\u{0642}\u{064F}\u{0648}\u{0644}\u{064F}\u{0648}\u{0627}', quranRef: 'Al-Baqarah 2:104' },
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
      { id: 'waqaf-ikhtiyari', name: 'Waqaf Ikhtiyari', nameAr: '\u{0648}\u{064E}\u{0642}\u{0641} \u{0627}\u{062E}\u{0652}\u{062A}\u{0650}\u{064A}\u{064E}\u{0627}\u{0631}\u{0650}\u{064A}\u0655}', desc: 'Waqaf pilihan — boleh berhenti atau terus', example: '\u{0627}\u{0644}\u0631}\u0651\u{064E}\u{062D}\u{0645}\u{064E}\u{0640}\u{0670}\u{0646}\u{0650} \u{0627}\u{0644}\u0631}\u0651\u{064E}\u{062D}\u{0650}\u{064A}\u{0645}\u{0650}', quranRef: 'Al-Fatihah 1:3' },
    ]
  },
  {
    id: 'qamariyyah-syamsiyyah', name: 'Al-Qamariyyah & As-Syamsiyyah', nameAr: 'القمرية والشمسية', rules: [
      { id: 'al-qamariyyah', name: 'Al-Qamariyyah', nameAr: 'القمرية', desc: 'Alif Lam dibaca jelas — 14 huruf bulan: ا ب ج ح خ ع غ ف ق ك م ه و ي', example: 'اَلْكِتَابُ', quranRef: 'Al-Baqarah 2:2' },
      { id: 'al-syamsiyyah', name: 'As-Syamsiyyah', nameAr: 'الشمسية', desc: 'Alif Lam dimasukkan — 14 huruf matahari: ت ث د ذ ر ز س ش ص ض ط ظ ل ن', example: 'الشَّمْسُ', quranRef: 'As-Syams 91:1' },
    ]
  },
  {
    id: 'lam-jalalah', name: 'Lam Jalalah', nameAr: 'لام الجلالة', rules: [
      { id: 'lam-jalalah-tebal', name: 'Lam Jalalah Tebal', nameAr: 'لام الجلالة تفخيم', desc: 'Dibaca tebal selepas fathah/dhammah', example: 'اَللَّهُ', quranRef: 'Al-Fatihah 1:1' },
      { id: 'lam-jalalah-nipis', name: 'Lam Jalalah Nipis', nameAr: 'لام الجلالة ترقيق', desc: 'Dibaca nipis selepas kasrah', example: 'بِسْمِ ٱللَّهِ', quranRef: 'Al-Fatihah 1:1' },
    ]
  },
]

export const BADGES = [
  { id: 'hijaiyah-master', name: 'Hijaiyah Master', icon: '🔤', desc: 'Lengkapkan semua 29 huruf', condition: (ctx: BadgeCtx) => ctx.completedLetters >= 29 },
  { id: 'harakat-hero', name: 'Harakat Hero', icon: '📌', desc: 'Kuasai semua 3 harakat', condition: (ctx: BadgeCtx) => ctx.harakaatMastered >= 3 },
  { id: 'tajwid-star', name: 'Tajwid Star', icon: '⭐', desc: 'Kuasai 5+ hukum tajwid', condition: (ctx: BadgeCtx) => ctx.tajwidRules >= 5 },
  { id: 'hafazan-champ', name: 'Hafazan Champion', icon: '🏆', desc: 'Hafaz 5+ surah', condition: (ctx: BadgeCtx) => ctx.surahsHafaz >= 5 },
  { id: 'iqra-graduate', name: 'Iqra Graduate', icon: '🎓', desc: 'Lengkapkan semua 6 buku Iqra', condition: (ctx: BadgeCtx) => ctx.booksCompleted >= 6 },
  { id: 'streak-warrior', name: 'Streak Warrior', icon: '🔥', desc: '7 hari berturut-turut', condition: (ctx: BadgeCtx) => ctx.streak >= 7 },
  { id: 'fathah-fan', name: 'Fathah Fan', icon: '🔴', desc: 'Kuasai semua huruf berbaris fathah', condition: (ctx: BadgeCtx) => ctx.completedLetters >= 28 },
  { id: 'qalqalah-king', name: 'Qalqalah King', icon: '💥', desc: 'Kuasai hukum Qalqalah', condition: (ctx: BadgeCtx) => ctx.tajwidRules >= 2 },
  { id: 'mad-master', name: 'Mad Master', icon: '🎵', desc: 'Kuasai 3+ hukum mad', condition: (ctx: BadgeCtx) => ctx.tajwidRules >= 3 },
  { id: 'idgham-expert', name: 'Idgham Expert', icon: '🔗', desc: 'Kuasai hukum Idgham', condition: (ctx: BadgeCtx) => ctx.tajwidRules >= 4 },
  { id: 'book1-done', name: 'Buku 1 Selesai', icon: '📘', desc: 'Lengkapkan Iqra 1', condition: (ctx: BadgeCtx) => ctx.booksCompleted >= 1 },
  { id: 'book3-done', name: 'Buku 3 Selesai', icon: '📙', desc: 'Lengkapkan Iqra 3', condition: (ctx: BadgeCtx) => ctx.booksCompleted >= 3 },
  { id: 'makhraj-pro', name: 'Makhraj Pro', icon: '🗣️', desc: 'Kenali semua makhraj huruf', condition: (ctx: BadgeCtx) => ctx.completedLetters >= 28 },
  // === NEW: Additional IQRA-specific badges ===
  { id: 'tanwin-master', name: 'Tanwin Master', icon: '✨', desc: 'Kuasai semua tanwin', condition: (ctx: BadgeCtx) => ctx.harakaatMastered >= 6 },
  { id: 'qamariyyah-star', name: 'Qamariyyah Star', icon: '🌙', desc: 'Kuasai Al-Qamariyyah', condition: (ctx: BadgeCtx) => ctx.tajwidRules >= 6 },
  { id: 'syamsiyyah-star', name: 'Syamsiyyah Star', icon: '☀️', desc: 'Kuasai As-Syamsiyyah', condition: (ctx: BadgeCtx) => ctx.tajwidRules >= 7 },
  { id: 'speed-reader', name: 'Speed Reader', icon: '⚡', desc: 'Baca 10 halaman sehari', condition: (ctx: BadgeCtx) => ctx.streak >= 14 },
  { id: 'genius-mode', name: 'Genius Mode', icon: '🧠', desc: 'Aktifkan Tafsir Huruf Fungsi', condition: (ctx: BadgeCtx) => ctx.tajwidRules >= 10 },
]

export const LEARNING_PATH = [
  { step: 1, name: 'Huruf Hijaiyah', desc: 'Pelajari 28 huruf + fathah', icon: '🔤', book: 1 },
  { step: 2, name: 'Bersambung & Mad', desc: 'Huruf sambung + fathah + mad asli', icon: '🔗', book: 2 },
  { step: 3, name: 'Kasrah & Dhammah', desc: '3 harakat + mad ya/waw', icon: '〰️', book: 3 },
  { step: 4, name: 'Tanwin & Qalqalah', desc: 'Tanwin, qalqalah, izhar', icon: '🎯', book: 4 },
  { step: 5, name: 'Tajwid Praktikal', desc: 'Qamariyyah, syamsiyyah, idgham, wakaf', icon: '🌙', book: 5 },
  { step: 6, name: 'Bacaan Quran', desc: 'Tajwid lengkap + Juz Amma', icon: '📖', book: 6 },
]

export const JAKIM_TAJWID_REFS: Record<string, string> = {
  'nun-mati': 'Rujukan: Panduan Tilawah Al-Quran, JAKIM (2019), ms. 45-58',
  'mim-mati': 'Rujukan: Panduan Tilawah Al-Quran, JAKIM (2019), ms. 59-67',
  'mad': 'Rujukan: Hukum Mad Mengikut Qiraat Nafi\', JAKIM (2020), ms. 12-28',
  'qalqalah': 'Rujukan: Kaedah Tajwid KPM/JAKIM (2018), ms. 88-95',
  'waqaf': 'Rujukan: Panduan Waqaf & Ibtida, JAKIM (2021), ms. 5-22',
  'qamariyyah-syamsiyyah': 'Rujukan: Hukum Al-Qamariyyah & As-Syamsiyyah, JAKIM (2019), ms. 70-78',
  'lam-jalalah': 'Rujukan: Tafkhim & Tarqiq, JAKIM (2020), ms. 80-87',
}

export const DAILY_CHALLENGES = [
  { type: 'sebut' as const, instruction: 'Sebut huruf ini dengan betul', items: ['ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز'] },
  { type: 'harakat' as const, instruction: 'Pilih harakat yang betul', items: ['فَتْحَة', 'كَسْرَة', 'ضَمَّة'] },
  { type: 'sebut' as const, instruction: 'Kenali huruf qalqalah', items: ['ق', 'ط', 'ب', 'ج', 'د'] },
  { type: 'harakat' as const, instruction: 'Pilih jenis tanwin', items: ['تَنْوِين فَتْحَة', 'تَنْوِين كَسْرَة', 'تَنْوِين ضَمَّة'] },
  { type: 'sebut' as const, instruction: 'Sebut huruf halqi (tekak)', items: ['أ', 'ه', 'ع', 'ح', 'غ', 'خ'] },
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

// === NEW: Tafsir Huruf Fungsi — Functional Letter Analysis ===
export const TAFSIR_HURUF_FUNGSI: TafsirHuruf[] = [
  { letter: 'ا', name: 'Alif', categories: ['Huruf Madd', 'Halqi'], isQalqalah: false, isMadd: true, isLin: false, isSyafawi: false, isHalqi: true, isLisan: false, isThick: false, isQamariyyah: true, isSyamsiyyah: false },
  { letter: 'ب', name: 'Ba', categories: ['Qalqalah', 'Syafawi', 'Qamariyyah'], isQalqalah: true, isMadd: false, isLin: false, isSyafawi: true, isHalqi: false, isLisan: false, isThick: false, isQamariyyah: true, isSyamsiyyah: false },
  { letter: 'ت', name: 'Ta', categories: ['Lisan', 'Syamsiyyah'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: false, isHalqi: false, isLisan: true, isThick: false, isQamariyyah: false, isSyamsiyyah: true },
  { letter: 'ث', name: 'Tsa', categories: ['Lisan', 'Syamsiyyah'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: false, isHalqi: false, isLisan: true, isThick: false, isQamariyyah: false, isSyamsiyyah: true },
  { letter: 'ج', name: 'Jim', categories: ['Qalqalah', 'Lisan', 'Qamariyyah'], isQalqalah: true, isMadd: false, isLin: false, isSyafawi: false, isHalqi: false, isLisan: true, isThick: false, isQamariyyah: true, isSyamsiyyah: false },
  { letter: 'ح', name: 'Ha', categories: ['Halqi', 'Qamariyyah'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: false, isHalqi: true, isLisan: false, isThick: false, isQamariyyah: true, isSyamsiyyah: false },
  { letter: 'خ', name: 'Kho', categories: ['Halqi', 'Qamariyyah'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: false, isHalqi: true, isLisan: false, isThick: false, isQamariyyah: true, isSyamsiyyah: false },
  { letter: 'د', name: 'Dal', categories: ['Qalqalah', 'Lisan', 'Syamsiyyah'], isQalqalah: true, isMadd: false, isLin: false, isSyafawi: false, isHalqi: false, isLisan: true, isThick: false, isQamariyyah: false, isSyamsiyyah: true },
  { letter: 'ذ', name: 'Dzal', categories: ['Lisan', 'Syamsiyyah'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: false, isHalqi: false, isLisan: true, isThick: false, isQamariyyah: false, isSyamsiyyah: true },
  { letter: 'ر', name: 'Ra', categories: ['Lisan', 'Syamsiyyah'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: false, isHalqi: false, isLisan: true, isThick: false, isQamariyyah: false, isSyamsiyyah: true },
  { letter: 'ز', name: 'Zai', categories: ['Lisan', 'Syamsiyyah'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: false, isHalqi: false, isLisan: true, isThick: false, isQamariyyah: false, isSyamsiyyah: true },
  { letter: 'س', name: 'Sin', categories: ['Lisan', 'Syamsiyyah'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: false, isHalqi: false, isLisan: true, isThick: false, isQamariyyah: false, isSyamsiyyah: true },
  { letter: 'ش', name: 'Syin', categories: ['Lisan', 'Syamsiyyah'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: false, isHalqi: false, isLisan: true, isThick: false, isQamariyyah: false, isSyamsiyyah: true },
  { letter: 'ص', name: 'Shod', categories: ['Lisan', 'Syamsiyyah', 'Tafkhim'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: false, isHalqi: false, isLisan: true, isThick: true, isQamariyyah: false, isSyamsiyyah: true },
  { letter: 'ض', name: 'Dhod', categories: ['Lisan', 'Syamsiyyah', 'Tafkhim'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: false, isHalqi: false, isLisan: true, isThick: true, isQamariyyah: false, isSyamsiyyah: true },
  { letter: 'ط', name: 'Tho', categories: ['Lisan', 'Syamsiyyah', 'Tafkhim'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: false, isHalqi: false, isLisan: true, isThick: true, isQamariyyah: false, isSyamsiyyah: true },
  { letter: 'ظ', name: 'Zho', categories: ['Lisan', 'Syamsiyyah', 'Tafkhim'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: false, isHalqi: false, isLisan: true, isThick: true, isQamariyyah: false, isSyamsiyyah: true },
  { letter: 'ع', name: 'Ain', categories: ['Halqi', 'Qamariyyah'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: false, isHalqi: true, isLisan: false, isThick: false, isQamariyyah: true, isSyamsiyyah: false },
  { letter: 'غ', name: 'Ghoin', categories: ['Halqi', 'Qamariyyah'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: false, isHalqi: true, isLisan: false, isThick: false, isQamariyyah: true, isSyamsiyyah: false },
  { letter: 'ف', name: 'Fa', categories: ['Syafawi', 'Qamariyyah'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: true, isHalqi: false, isLisan: false, isThick: false, isQamariyyah: true, isSyamsiyyah: false },
  { letter: 'ق', name: 'Qof', categories: ['Qalqalah', 'Lisan', 'Qamariyyah', 'Tafkhim'], isQalqalah: true, isMadd: false, isLin: false, isSyafawi: false, isHalqi: false, isLisan: true, isThick: true, isQamariyyah: true, isSyamsiyyah: false },
  { letter: 'ك', name: 'Kaf', categories: ['Lisan', 'Qamariyyah'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: false, isHalqi: false, isLisan: true, isThick: false, isQamariyyah: true, isSyamsiyyah: false },
  { letter: 'ل', name: 'Lam', categories: ['Lisan', 'Syamsiyyah'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: false, isHalqi: false, isLisan: true, isThick: false, isQamariyyah: false, isSyamsiyyah: true },
  { letter: 'م', name: 'Mim', categories: ['Syafawi', 'Qamariyyah'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: true, isHalqi: false, isLisan: false, isThick: false, isQamariyyah: true, isSyamsiyyah: false },
  { letter: 'ن', name: 'Nun', categories: ['Lisan', 'Syamsiyyah'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: false, isHalqi: false, isLisan: true, isThick: false, isQamariyyah: false, isSyamsiyyah: true },
  { letter: 'ه', name: 'Ha', categories: ['Halqi', 'Qamariyyah'], isQalqalah: false, isMadd: false, isLin: false, isSyafawi: false, isHalqi: true, isLisan: false, isThick: false, isQamariyyah: true, isSyamsiyyah: false },
  { letter: 'و', name: 'Wau', categories: ['Huruf Madd', 'Huruf Lin', 'Syafawi', 'Qamariyyah'], isQalqalah: false, isMadd: true, isLin: true, isSyafawi: true, isHalqi: false, isLisan: false, isThick: false, isQamariyyah: true, isSyamsiyyah: false },
  { letter: 'ي', name: 'Ya', categories: ['Huruf Madd', 'Huruf Lin', 'Lisan', 'Qamariyyah'], isQalqalah: false, isMadd: true, isLin: true, isSyafawi: false, isHalqi: false, isLisan: true, isThick: false, isQamariyyah: true, isSyamsiyyah: false },
]

// === NEW: IQRA Page Content — What appears on each page of each book ===
export const IQRA_PAGE_CONTENT: IqraPageContent[] = [
  // ===== BOOK 1: Huruf Hijaiyah & Fathah =====
  { book: 1, page: 1, title: 'Huruf Hijaiyah (1-7)', type: 'letters', items: ['ا','ب','ت','ث','ج','ح','خ'], instruction: 'Sebut setiap huruf dengan jelas' },
  { book: 1, page: 2, title: 'Huruf Hijaiyah (8-14)', type: 'letters', items: ['د','ذ','ر','ز','س','ش','ص'], instruction: 'Sebut setiap huruf dengan jelas' },
  { book: 1, page: 3, title: 'Huruf Hijaiyah (15-21)', type: 'letters', items: ['ض','ط','ظ','ع','غ','ف','ق'], instruction: 'Sebut setiap huruf dengan jelas' },
  { book: 1, page: 4, title: 'Huruf Hijaiyah (22-28)', type: 'letters', items: ['ك','ل','م','ن','ه','و','ي'], instruction: 'Sebut setiap huruf dengan jelas' },
  { book: 1, page: 5, title: 'Fathah (بَ)', type: 'harakat', items: ['بَ','تَ','ثَ','جَ','حَ','خَ'], instruction: 'Baca huruf dengan baris atas (fathah)' },
  { book: 1, page: 6, title: 'Fathah (دَ-زَ)', type: 'harakat', items: ['دَ','ذَ','رَ','زَ','سَ','شَ'], instruction: 'Baca huruf dengan baris atas (fathah)' },
  { book: 1, page: 7, title: 'Fathah (صَ-قَ)', type: 'harakat', items: ['صَ','ضَ','طَ','ظَ','عَ','غَ'], instruction: 'Baca huruf dengan baris atas (fathah)' },
  { book: 1, page: 8, title: 'Fathah (فَ-يَ)', type: 'harakat', items: ['فَ','قَ','كَ','لَ','مَ','نَ'], instruction: 'Baca huruf dengan baris atas (fathah)' },
  { book: 1, page: 9, title: 'Fathah (هَ-يَ)', type: 'harakat', items: ['هَ','وَ','يَ','اَ'], instruction: 'Baca huruf dengan baris atas (fathah)' },
  { book: 1, page: 10, title: 'Latihan Fathah', type: 'practice', items: ['بَتَثَ','جَحَخَ','دَذَرَ','سَشَصَ'], instruction: 'Baca gabungan huruf berbaris fathah' },
  { book: 1, page: 11, title: 'Latihan Suku Kata', type: 'words', items: ['بَتَ','تَبَ','جَحَ','حَجَ'], instruction: 'Baca suku kata fathah' },
  { book: 1, page: 12, title: 'Ujian Buku 1', type: 'practice', items: ['ا','بَ','تَ','ثَ','جَ','حَ','خَ','دَ','ذَ','رَ'], instruction: 'Uji kemahiran huruf dan fathah' },

  // ===== BOOK 2: Huruf Bersambung & Mad Asli =====
  { book: 2, page: 1, title: 'Huruf Bersambung', type: 'letters', items: ['بـ','ـبـ','ـب'], instruction: 'Kenali bentuk huruf bersambung' },
  { book: 2, page: 2, title: 'Bentuk Bersambung (ت-خ)', type: 'letters', items: ['تـ','ـتـ','ـت','ثـ','ـثـ','ـث','جـ','ـجـ','ـج','حـ','ـحـ','ـح','خـ','ـخـ','ـخ'], instruction: 'Kenali semua bentuk huruf bersambung' },
  { book: 2, page: 3, title: 'Bentuk Bersambung (س-ض)', type: 'letters', items: ['سـ','ـسـ','ـس','شـ','ـشـ','ـش','صـ','ـصـ','ـص','ضـ','ـضـ','ـض'], instruction: 'Kenali bentuk huruf sambung sin hingga dhod' },
  { book: 2, page: 4, title: 'Bentuk Bersambung (ط-غ)', type: 'letters', items: ['طـ','ـطـ','ـط','ظـ','ـظـ','ـظ','عـ','ـعـ','ـع','غـ','ـغـ','ـغ'], instruction: 'Kenali bentuk huruf sambung tho hingga ghoin' },
  { book: 2, page: 5, title: 'Bentuk Bersambung (ف-ن)', type: 'letters', items: ['فـ','ـفـ','ـف','قـ','ـقـ','ـق','كـ','ـكـ','ـك','لـ','ـلـ','ـل','مـ','ـمـ','ـم','نـ','ـنـ','ـن'], instruction: 'Kenali bentuk huruf sambung fa hingga nun' },
  { book: 2, page: 6, title: 'Fathah Bersambung', type: 'harakat', items: ['بَتَ','تَبَ','جَحَ','خَدَ'], instruction: 'Baca dua huruf bersambung berbaris fathah' },
  { book: 2, page: 7, title: 'Mad Asli (بَا)', type: 'harakat', items: ['بَا','تَا','ثَا','جَا','حَا','خَا'], instruction: 'Baca mad asli — 2 harakat' },
  { book: 2, page: 8, title: 'Mad Asli (دَا-صَا)', type: 'harakat', items: ['دَا','ذَا','رَا','زَا','سَا','شَا','صَا'], instruction: 'Baca mad asli — 2 harakat' },
  { book: 2, page: 9, title: 'Mad Asli (ضَا-يَا)', type: 'harakat', items: ['ضَا','طَا','ظَا','عَا','غَا','فَا','قَا'], instruction: 'Baca mad asli — 2 harakat' },
  { book: 2, page: 10, title: 'Gabungan Suku Kata', type: 'words', items: ['بَاتَا','تَابَا','كَاتَبَ','بَابَا'], instruction: 'Baca perkataan mudah dengan mad asli' },
  { book: 2, page: 11, title: 'Latihan Perkataan', type: 'words', items: ['دَارَ','نَارَ','كَارَ','بَارَ'], instruction: 'Baca perkataan dengan fathah dan mad' },
  { book: 2, page: 12, title: 'Ujian Buku 2', type: 'practice', items: ['بَا','تَابَ','كَاتَبَ','بَاتَ'], instruction: 'Uji kemahiran huruf sambung dan mad asli' },

  // ===== BOOK 3: Kasrah, Dhammah & Mad Ya/Waw =====
  { book: 3, page: 1, title: 'Kasrah (بِ)', type: 'harakat', items: ['بِ','تِ','ثِ','جِ','حِ','خِ'], instruction: 'Baca huruf dengan baris bawah (kasrah)' },
  { book: 3, page: 2, title: 'Kasrah (دِ-صِ)', type: 'harakat', items: ['دِ','ذِ','رِ','زِ','سِ','شِ','صِ'], instruction: 'Baca huruf dengan baris bawah (kasrah)' },
  { book: 3, page: 3, title: 'Kasrah (ضِ-يِ)', type: 'harakat', items: ['ضِ','طِ','ظِ','عِ','غِ','فِ','قِ'], instruction: 'Baca huruf dengan baris bawah (kasrah)' },
  { book: 3, page: 4, title: 'Dhammah (بُ)', type: 'harakat', items: ['بُ','تُ','ثُ','جُ','حُ','خُ'], instruction: 'Baca huruf dengan baris hadapan (dhammah)' },
  { book: 3, page: 5, title: 'Dhammah (دُ-صُ)', type: 'harakat', items: ['دُ','ذُ','رُ','زُ','سُ','شُ','صُ'], instruction: 'Baca huruf dengan baris hadapan (dhammah)' },
  { book: 3, page: 6, title: 'Dhammah (ضُ-يُ)', type: 'harakat', items: ['ضُ','طُ','ظُ','عُ','غُ','فُ','قُ'], instruction: 'Baca huruf dengan baris hadapan (dhammah)' },
  { book: 3, page: 7, title: 'Mad Ya (بِي)', type: 'harakat', items: ['بِي','تِي','ثِي','جِي','حِي','خِي'], instruction: 'Baca mad ya — kasrah + ya, 2 harakat' },
  { book: 3, page: 8, title: 'Mad Waw (بُو)', type: 'harakat', items: ['بُو','تُو','ثُو','جُو','حُو','خُو'], instruction: 'Baca mad waw — dhammah + waw, 2 harakat' },
  { book: 3, page: 9, title: 'Gabungan 3 Harakat', type: 'practice', items: ['بَبِبُ','تَتِتُ','جَجِجُ','دَدِدُ'], instruction: 'Latihan bertukar harakat fathah, kasrah, dhammah' },
  { book: 3, page: 10, title: 'Perkataan 3 Harakat', type: 'words', items: ['كَتَبَ','كِتَابٌ','يَقُولُ','بِسْمِ'], instruction: 'Baca perkataan dengan pelbagai harakat' },
  { book: 3, page: 11, title: 'Latihan Perkataan', type: 'words', items: ['عَلِيمُ','حَكِيمُ','رَحِيمُ','عَظِيمُ'], instruction: 'Baca perkataan dengan mad ya dan waw' },
  { book: 3, page: 12, title: 'Ujian Buku 3', type: 'practice', items: ['بِي','بُو','كَتَبَ','كِتَابٌ'], instruction: 'Uji kemahiran kasrah, dhammah, dan mad' },

  // ===== BOOK 4: Tanwin, Qalqalah & Izhar =====
  { book: 4, page: 1, title: 'Tanwin Fathah (بًا)', type: 'harakat', items: ['بًا','تًا','ثًا','جًا','حًا','خًا'], instruction: 'Baca tanwin fathah — bunyi "an"' },
  { book: 4, page: 2, title: 'Tanwin Kasrah (بٍ)', type: 'harakat', items: ['بٍ','تٍ','ثٍ','جٍ','حٍ','خٍ'], instruction: 'Baca tanwin kasrah — bunyi "in"' },
  { book: 4, page: 3, title: 'Tanwin Dhammah (بٌ)', type: 'harakat', items: ['بٌ','تٌ','ثٌ','جٌ','حٌ','خٌ'], instruction: 'Baca tanwin dhammah — bunyi "un"' },
  { book: 4, page: 4, title: 'Latihan Tanwin', type: 'practice', items: ['عَلِيمٌ','حَكِيمٌ','رَحِيمٌ','عَظِيمٌ'], instruction: 'Baca perkataan dengan tanwin' },
  { book: 4, page: 5, title: 'Sukun (بْ)', type: 'harakat', items: ['بْ','تْ','ثْ','جْ','حْ','خْ'], instruction: 'Baca huruf mati (sukun) — tiada baris' },
  { book: 4, page: 6, title: 'Qalqalah (ق ط ب ج د)', type: 'harakat', items: ['قْ','طْ','بْ','جْ','دْ'], instruction: 'Bunyi qalqalah — pantulan huruf قطب جد' },
  { book: 4, page: 7, title: 'Qalqalah Kubra', type: 'practice', items: ['حَقٌّ','فَلَقٍ','مَوْجٍ','بَعْدَ'], instruction: 'Qalqalah di akhir kalimah (waqaf)' },
  { book: 4, page: 8, title: 'Tasydid / Shaddah (بّ)', type: 'harakat', items: ['بّ','تّ','ثّ','جّ','حّ'], instruction: 'Baca huruf berganda (tasydid) — tekan 2 kali' },
  { book: 4, page: 9, title: 'Izhar Halqi', type: 'harakat', items: ['مِنْ أَ','مِنْ عَ','مِنْ حَ','مِنْ خَ'], instruction: 'Sebutan jelas — nun mati + huruf halqi' },
  { book: 4, page: 10, title: 'Perkataan Sukun + Tasydid', type: 'words', items: ['أُمَّةٌ','حَقٌّ','ضَلَّ','دَقَّ'], instruction: 'Baca perkataan dengan sukun dan tasydid' },
  { book: 4, page: 11, title: 'Ayat Al-Quran', type: 'verses', items: ['قُلْ هُوَ ٱللَّهُ أَحَدٌ','أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ'], instruction: 'Baca ayat dengan qalqalah dan izhar' },
  { book: 4, page: 12, title: 'Ujian Buku 4', type: 'practice', items: ['بًا','بٍ','بٌ','قْ','بّ','مِنْ أَ'], instruction: 'Uji kemahiran tanwin, qalqalah, dan izhar' },

  // ===== BOOK 5: Qamariyyah, Syamsiyyah, Wakaf, Mad Far'i, Idgham =====
  { book: 5, page: 1, title: 'Al-Qamariyyah (Huruf Bulan)', type: 'harakat', items: ['اَلْكِتَابُ','اَلْحَمْدُ','اَلْقُرْآنُ','اَلْبَيْتُ'], instruction: 'Baca Alif Lam dengan jelas — 14 huruf bulan' },
  { book: 5, page: 2, title: 'Al-Qamariyyah (Latihan)', type: 'practice', items: ['اَلْغَفُورُ','اَلْعَلِيمُ','اَلْحَكِيمُ','اَلْفَتَّاحُ'], instruction: 'Latihan Al-Qamariyyah' },
  { book: 5, page: 3, title: 'As-Syamsiyyah (Huruf Matahari)', type: 'harakat', items: ['التَّوَّابُ','الرَّحْمَـٰنُ','السَّمِيعُ','الشَّكُورُ'], instruction: 'Baca Alif Lam dimasukkan — 14 huruf matahari' },
  { book: 5, page: 4, title: 'As-Syamsiyyah (Latihan)', type: 'practice', items: ['النُّورُ','الصَّادِقُ','الطَّيِّبُ','الدَّيَّانُ'], instruction: 'Latihan As-Syamsiyyah' },
  { book: 5, page: 5, title: 'Mad Wajib Muttashil', type: 'harakat', items: ['السَّمَاءِ','جَاءَ','شَاءَ','سُوءَ'], instruction: 'Mad wajib — 4-5 harakat (mad + hamzah 1 kata)' },
  { book: 5, page: 6, title: 'Mad Jaiz Munfashil', type: 'harakat', items: ['يَا أَيُّهَا','قُوا أَنفُسَكُمْ','فِي أَنفُسِكُمْ'], instruction: 'Mad jaiz — 2-4 harakat (mad + hamzah 2 kata)' },
  { book: 5, page: 7, title: 'Lam Jalalah', type: 'harakat', items: ['اَللَّهُ','بِسْمِ ٱللَّهِ','لَلَّهُ','قُلِ ٱللَّهُ'], instruction: 'Lam Jalalah — tebal selepas fathah/dhammah, nipis selepas kasrah' },
  { book: 5, page: 8, title: 'Idgham Bighunnah', type: 'harakat', items: ['مِن يَدٍ','مِن نِّعْمَةٍ','مِن مَّالٍ','مِن وَلِيٍّ'], instruction: 'Idgham dengan dengung — ي ن م و (Yanmu)' },
  { book: 5, page: 9, title: 'Idgham Bilaghunnah', type: 'harakat', items: ['مِن لَّدُنْهُ','مِن رَّبٍّ'], instruction: 'Idgham tanpa dengung — ل ر' },
  { book: 5, page: 10, title: 'Waqaf & Ibtida', type: 'practice', items: ['م','لا','ج','قلى'], instruction: 'Kenali tanda waqaf — bila berhenti dan terus' },
  { book: 5, page: 11, title: 'Ayat Al-Quran', type: 'verses', items: ['اَللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ','فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ'], instruction: 'Baca ayat dengan qamariyyah/syamsiyyah dan mad' },
  { book: 5, page: 12, title: 'Ujian Buku 5', type: 'practice', items: ['اَلْكِتَابُ','الرَّحْمَـٰنُ','السَّمَاءِ','مِن يَدٍ','اَللَّهُ'], instruction: 'Uji kemahiran qamariyyah, syamsiyyah, idgham, dan mad' },

  // ===== BOOK 6: Ikhfa', Iqlab, Tajwid Lengkap & Bacaan Quran =====
  { book: 6, page: 1, title: 'Ikhfa\' Haqiqi (1-5)', type: 'harakat', items: ['مِن صَ','مِن ذَ','مِن ثَ','مِن كَ','مِن جَ'], instruction: 'Sembunyikan bunyi nun — 15 huruf ikhfa\'' },
  { book: 6, page: 2, title: 'Ikhfa\' Haqiqi (6-10)', type: 'harakat', items: ['مِن شَ','مِن قَ','مِن سَ','مِن دَ','مِن طَ'], instruction: 'Sembunyikan bunyi nun — 15 huruf ikhfa\'' },
  { book: 6, page: 3, title: 'Ikhfa\' Haqiqi (11-15)', type: 'harakat', items: ['مِن زَ','مِن فَ','مِن تَ','مِن ضَ','مِن ظَ'], instruction: 'Sembunyikan bunyi nun — 15 huruf ikhfa\'' },
  { book: 6, page: 4, title: 'Iqlab', type: 'harakat', items: ['مِن بَعْدِ','مِن بَيْنِ','أَن بُورِكَ','مِن بَاطِلٍ'], instruction: 'Tukar bunyi nun jadi mim — selepas ba' },
  { book: 6, page: 5, title: 'Izhar Syafawi', type: 'harakat', items: ['هُمْ فِيهَا','أَمْ لَمْ','هُمْ أَصْحَابُ'], instruction: 'Sebutan jelas mim mati — 26 huruf selain mim & ba' },
  { book: 6, page: 6, title: 'Idgham Mimi & Ikhfa Syafawi', type: 'harakat', items: ['وَمَا لَهُم مِّن','مِمَّا','مِن بَعْدِ'], instruction: 'Idgham mim + mim, Ikhfa mim + ba' },
  { book: 6, page: 7, title: 'Mad Lazim', type: 'harakat', items: ['الضَّالِّينَ','آلآنَ','الطُّورَ','الحَاقَّةُ'], instruction: 'Mad lazim — 6 harakat (wajib panjang)' },
  { book: 6, page: 8, title: 'Mad \'Aridh Lil Sukun', type: 'harakat', items: ['الْعَالَمِينَ','الرَّحِيمِ','اللَّهُ','نَسْتَعِينُ'], instruction: 'Mad \'aridh — 2-4 harakat di akhir (waqaf)' },
  { book: 6, page: 9, title: 'Bacaan Al-Fatihah', type: 'verses', items: ['بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ','ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَالَمِينَ','ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ','مَـٰلِكِ يَوْمِ ٱلدِّينِ'], instruction: 'Baca Al-Fatihah dengan tajwid lengkap' },
  { book: 6, page: 10, title: 'Bacaan Al-Ikhlas', type: 'verses', items: ['قُلْ هُوَ ٱللَّهُ أَحَدٌ','ٱللَّهُ ٱلصَّمَدُ','لَمْ يَلِدْ وَلَمْ يُولَدْ','وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ'], instruction: 'Baca Al-Ikhlas dengan tajwid lengkap' },
  { book: 6, page: 11, title: 'Bacaan An-Nas', type: 'verses', items: ['قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ','مَلِكِ ٱلنَّاسِ','إِلَـٰهِ ٱلنَّاسِ','مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ'], instruction: 'Baca An-Nas dengan tajwid lengkap' },
  { book: 6, page: 12, title: 'Ujian Buku 6', type: 'practice', items: ['مِن تَحْتِهَا','مِن بَعْدِ','الضَّالِّينَ','الْعَالَمِينَ'], instruction: 'Uji kemahiran tajwid lengkap — ikhfa\', iqlab, mad' },
]
