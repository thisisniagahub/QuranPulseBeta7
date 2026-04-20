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

export const QURAN_VERSES_PER_BOOK: Record<number, Array<{ verse: string; translation: string; surah: string; tajwidHighlight?: Array<{ from: number; to: number; rule: string }> }>> = {
  1: [
    { verse: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', translation: 'Dengan nama Allah Yang Maha Pemurah Lagi Maha Penyayang', surah: 'Al-Fatihah 1:1' },
    { verse: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', translation: 'Katakanlah: Dialah Allah Yang Maha Esa', surah: 'Al-Ikhlas 112:1' },
    { verse: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَالَمِينَ', translation: 'Segala puji bagi Allah Tuhan semesta alam', surah: 'Al-Fatihah 1:2' },
  ],
  2: [
    { verse: 'بَسْمِ ٱللهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', translation: 'Dengan nama Allah...', surah: 'Al-Fatihah 1:1' },
    { verse: 'هُوَ ٱللَّهُ ٱلَّذِى لَآ إِلَـٰهَ إِلَّا هُوَ', translation: 'Dialah Allah tiada Tuhan melainkan Dia', surah: 'Al-Hashr 59:22' },
  ],
  3: [
    { verse: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', translation: 'Hanya Engkau kami sembah dan hanya Engkau kami minta pertolongan', surah: 'Al-Fatihah 1:5' },
    { verse: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ', translation: 'Tunjukilah kami jalan yang lurus', surah: 'Al-Fatihah 1:6' },
  ],
  4: [
    { verse: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', translation: 'Bismillah...', surah: 'Al-Fatihah 1:1', tajwidHighlight: [{ from: 1, to: 6, rule: 'qalqalah' }] },
    { verse: 'أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ', translation: 'Ingat, hanya dengan mengingati Allah hati menjadi tenteram', surah: 'Ar-Ra\'d 13:28' },
    { verse: 'إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا', translation: 'Sesungguhnya bersama kesulitan ada kemudahan', surah: 'Al-Insyirah 94:6' },
  ],
  5: [
    { verse: 'اَللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ', translation: 'Allah tiada Tuhan melainkan Dia Yang Hidup Yang Berdiri Sendiri', surah: 'Al-Baqarah 2:255', tajwidHighlight: [{ from: 0, to: 6, rule: 'lamJalalah' }] },
    { verse: 'فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ', translation: 'Maka nikmat Tuhan kamu yang manakah yang kamu dustakan?', surah: 'Ar-Rahman 55:13' },
  ],
  6: [
    { verse: 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ', translation: 'Katakanlah: Aku berlindung dengan Tuhan manusia', surah: 'An-Nas 114:1' },
    { verse: 'مَلِكِ ٱلنَّاسِ', translation: 'Raja manusia', surah: 'An-Nas 114:2' },
    { verse: 'إِلَـٰهِ ٱلنَّاسِ', translation: 'Tuhan manusia', surah: 'An-Nas 114:3' },
    { verse: 'مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ', translation: 'Dari kejahatan bisikan syaitan yang bersembunyi', surah: 'An-Nas 114:4' },
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
  { id: 'mad-thabii', name: 'Mad Thabi\'i', nameAr: '\u{0645}\u{064E}\u{062F}\u{0651} \u{0637}\u{064E}\u{0628}\u{0650}\u{064A}\u{0639}\u{0650}\u{064A}\u0651}', symbol: '\u{0622}', desc: 'Elongasi 2 harakat', example: '\u{0642}\u{064E}\u{0627}\u{0644}\u{064E} (qaa-la)' },
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
