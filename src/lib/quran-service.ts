// ─── QuranPulse Quran Data Service ───────────────────────
// Comprehensive Quran data service with API fetching and local fallback
// Uses alquran.cloud API with in-memory caching and graceful degradation

// ═══════════════════════════════════════════════════════════
// Core Data Types
// ═══════════════════════════════════════════════════════════

export interface Surah {
  number: number
  name: string
  englishName: string
  malayName: string
  numberOfAyahs: number
  revelationType: 'Meccan' | 'Medinan'
  juz: number[]
}

export interface Ayah {
  number: number
  numberInSurah: number
  text: string
  translationMs: string
  translationEn: string
  audioUrl: string
  sajda: boolean
}

export interface JuzInfo {
  number: number
  startSurah: number
  startAyah: number
  endSurah: number
  endAyah: number
}

export interface HizbInfo {
  number: number
  startSurah: number
  startAyah: number
}

export interface ManzilInfo {
  number: number
  startSurah: number
  startAyah: number
}

export interface RukuInfo {
  number: number
  startSurah: number
  startAyah: number
}

export interface PageInfo {
  number: number
  startSurah: number
  startAyah: number
}

export interface SajdaAyah {
  surah: number
  ayah: number
  type: 'recommended' | 'obligatory'
}

export interface TajwidRule {
  name: string
  nameMs: string
  description: string
  descriptionMs: string
  examples: {
    ayah: string
    surah: number
    ayahNumber: number
  }[]
}

export interface TafsirEntry {
  surah: number
  ayah: number
  textMs: string
  source: string
}

export interface Reciter {
  id: string
  name: string
  nameAr: string
}

// ═══════════════════════════════════════════════════════════
// Local Fallback Data - Complete 114 Surahs
// ═══════════════════════════════════════════════════════════

const SURAH_DATA: Surah[] = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Fatihah', malayName: 'Al-Fatihah', numberOfAyahs: 7, revelationType: 'Meccan', juz: [1] },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', malayName: 'Al-Baqarah', numberOfAyahs: 286, revelationType: 'Medinan', juz: [1, 2, 3] },
  { number: 3, name: 'آل عمران', englishName: 'Ali Imran', malayName: 'Ali Imran', numberOfAyahs: 200, revelationType: 'Medinan', juz: [3, 4] },
  { number: 4, name: 'النساء', englishName: 'An-Nisa', malayName: 'An-Nisa', numberOfAyahs: 176, revelationType: 'Medinan', juz: [4, 5, 6] },
  { number: 5, name: 'المائدة', englishName: 'Al-Maidah', malayName: 'Al-Maidah', numberOfAyahs: 120, revelationType: 'Medinan', juz: [6, 7] },
  { number: 6, name: 'الأنعام', englishName: 'Al-Anam', malayName: 'Al-Anam', numberOfAyahs: 165, revelationType: 'Meccan', juz: [7, 8] },
  { number: 7, name: 'الأعراف', englishName: 'Al-Araf', malayName: 'Al-Araf', numberOfAyahs: 206, revelationType: 'Meccan', juz: [8, 9] },
  { number: 8, name: 'الأنفال', englishName: 'Al-Anfal', malayName: 'Al-Anfal', numberOfAyahs: 75, revelationType: 'Medinan', juz: [9, 10] },
  { number: 9, name: 'التوبة', englishName: 'At-Tawbah', malayName: 'At-Tawbah', numberOfAyahs: 129, revelationType: 'Medinan', juz: [10, 11] },
  { number: 10, name: 'يونس', englishName: 'Yunus', malayName: 'Yunus', numberOfAyahs: 109, revelationType: 'Meccan', juz: [11] },
  { number: 11, name: 'هود', englishName: 'Hud', malayName: 'Hud', numberOfAyahs: 123, revelationType: 'Meccan', juz: [11, 12] },
  { number: 12, name: 'يوسف', englishName: 'Yusuf', malayName: 'Yusuf', numberOfAyahs: 111, revelationType: 'Meccan', juz: [12, 13] },
  { number: 13, name: 'الرعد', englishName: 'Ar-Rad', malayName: 'Ar-Rad', numberOfAyahs: 43, revelationType: 'Medinan', juz: [13] },
  { number: 14, name: 'ابراهيم', englishName: 'Ibrahim', malayName: 'Ibrahim', numberOfAyahs: 52, revelationType: 'Meccan', juz: [13] },
  { number: 15, name: 'الحجر', englishName: 'Al-Hijr', malayName: 'Al-Hijr', numberOfAyahs: 99, revelationType: 'Meccan', juz: [14] },
  { number: 16, name: 'النحل', englishName: 'An-Nahl', malayName: 'An-Nahl', numberOfAyahs: 128, revelationType: 'Meccan', juz: [14] },
  { number: 17, name: 'الإسراء', englishName: 'Al-Isra', malayName: 'Al-Isra', numberOfAyahs: 111, revelationType: 'Meccan', juz: [15] },
  { number: 18, name: 'الكهف', englishName: 'Al-Kahf', malayName: 'Al-Kahf', numberOfAyahs: 110, revelationType: 'Meccan', juz: [15, 16] },
  { number: 19, name: 'مريم', englishName: 'Maryam', malayName: 'Maryam', numberOfAyahs: 98, revelationType: 'Meccan', juz: [16] },
  { number: 20, name: 'طه', englishName: 'Taha', malayName: 'Taha', numberOfAyahs: 135, revelationType: 'Meccan', juz: [16] },
  { number: 21, name: 'الأنبياء', englishName: 'Al-Anbiya', malayName: 'Al-Anbiya', numberOfAyahs: 112, revelationType: 'Meccan', juz: [17] },
  { number: 22, name: 'الحج', englishName: 'Al-Hajj', malayName: 'Al-Hajj', numberOfAyahs: 78, revelationType: 'Medinan', juz: [17] },
  { number: 23, name: 'المؤمنون', englishName: 'Al-Muminun', malayName: 'Al-Muminun', numberOfAyahs: 118, revelationType: 'Meccan', juz: [18] },
  { number: 24, name: 'النور', englishName: 'An-Nur', malayName: 'An-Nur', numberOfAyahs: 64, revelationType: 'Medinan', juz: [18] },
  { number: 25, name: 'الفرقان', englishName: 'Al-Furqan', malayName: 'Al-Furqan', numberOfAyahs: 77, revelationType: 'Meccan', juz: [18, 19] },
  { number: 26, name: 'الشعراء', englishName: 'Ash-Shuara', malayName: 'Ash-Shuara', numberOfAyahs: 227, revelationType: 'Meccan', juz: [19] },
  { number: 27, name: 'النمل', englishName: 'An-Naml', malayName: 'An-Naml', numberOfAyahs: 93, revelationType: 'Meccan', juz: [19, 20] },
  { number: 28, name: 'القصص', englishName: 'Al-Qasas', malayName: 'Al-Qasas', numberOfAyahs: 88, revelationType: 'Meccan', juz: [20] },
  { number: 29, name: 'العنكبوت', englishName: 'Al-Ankabut', malayName: 'Al-Ankabut', numberOfAyahs: 69, revelationType: 'Meccan', juz: [20, 21] },
  { number: 30, name: 'الروم', englishName: 'Ar-Rum', malayName: 'Ar-Rum', numberOfAyahs: 60, revelationType: 'Meccan', juz: [21] },
  { number: 31, name: 'لقمان', englishName: 'Luqman', malayName: 'Luqman', numberOfAyahs: 34, revelationType: 'Meccan', juz: [21] },
  { number: 32, name: 'السجدة', englishName: 'As-Sajdah', malayName: 'As-Sajdah', numberOfAyahs: 30, revelationType: 'Meccan', juz: [21] },
  { number: 33, name: 'الأحزاب', englishName: 'Al-Ahzab', malayName: 'Al-Ahzab', numberOfAyahs: 73, revelationType: 'Medinan', juz: [21, 22] },
  { number: 34, name: 'سبأ', englishName: 'Saba', malayName: 'Saba', numberOfAyahs: 54, revelationType: 'Meccan', juz: [22] },
  { number: 35, name: 'فاطر', englishName: 'Fatir', malayName: 'Fatir', numberOfAyahs: 45, revelationType: 'Meccan', juz: [22] },
  { number: 36, name: 'يس', englishName: 'Ya-Sin', malayName: 'Ya-Sin', numberOfAyahs: 83, revelationType: 'Meccan', juz: [22, 23] },
  { number: 37, name: 'الصافات', englishName: 'As-Saffat', malayName: 'As-Saffat', numberOfAyahs: 182, revelationType: 'Meccan', juz: [23] },
  { number: 38, name: 'ص', englishName: 'Sad', malayName: 'Sad', numberOfAyahs: 88, revelationType: 'Meccan', juz: [23] },
  { number: 39, name: 'الزمر', englishName: 'Az-Zumar', malayName: 'Az-Zumar', numberOfAyahs: 75, revelationType: 'Meccan', juz: [23, 24] },
  { number: 40, name: 'غافر', englishName: 'Ghafir', malayName: 'Ghafir', numberOfAyahs: 85, revelationType: 'Meccan', juz: [24] },
  { number: 41, name: 'فصلت', englishName: 'Fussilat', malayName: 'Fussilat', numberOfAyahs: 54, revelationType: 'Meccan', juz: [24, 25] },
  { number: 42, name: 'الشورى', englishName: 'Ash-Shura', malayName: 'Ash-Shura', numberOfAyahs: 53, revelationType: 'Meccan', juz: [25] },
  { number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', malayName: 'Az-Zukhruf', numberOfAyahs: 89, revelationType: 'Meccan', juz: [25] },
  { number: 44, name: 'الدخان', englishName: 'Ad-Dukhan', malayName: 'Ad-Dukhan', numberOfAyahs: 59, revelationType: 'Meccan', juz: [25] },
  { number: 45, name: 'الجاثية', englishName: 'Al-Jathiyah', malayName: 'Al-Jathiyah', numberOfAyahs: 37, revelationType: 'Meccan', juz: [25] },
  { number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', malayName: 'Al-Ahqaf', numberOfAyahs: 35, revelationType: 'Meccan', juz: [26] },
  { number: 47, name: 'محمد', englishName: 'Muhammad', malayName: 'Muhammad', numberOfAyahs: 38, revelationType: 'Medinan', juz: [26] },
  { number: 48, name: 'الفتح', englishName: 'Al-Fath', malayName: 'Al-Fath', numberOfAyahs: 29, revelationType: 'Medinan', juz: [26] },
  { number: 49, name: 'الحجرات', englishName: 'Al-Hujurat', malayName: 'Al-Hujurat', numberOfAyahs: 18, revelationType: 'Medinan', juz: [26] },
  { number: 50, name: 'ق', englishName: 'Qaf', malayName: 'Qaf', numberOfAyahs: 45, revelationType: 'Meccan', juz: [26] },
  { number: 51, name: 'الذاريات', englishName: 'Adh-Dhariyat', malayName: 'Adh-Dhariyat', numberOfAyahs: 60, revelationType: 'Meccan', juz: [26, 27] },
  { number: 52, name: 'الطور', englishName: 'At-Tur', malayName: 'At-Tur', numberOfAyahs: 49, revelationType: 'Meccan', juz: [27] },
  { number: 53, name: 'النجم', englishName: 'An-Najm', malayName: 'An-Najm', numberOfAyahs: 62, revelationType: 'Meccan', juz: [27] },
  { number: 54, name: 'القمر', englishName: 'Al-Qamar', malayName: 'Al-Qamar', numberOfAyahs: 55, revelationType: 'Meccan', juz: [27] },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', malayName: 'Ar-Rahman', numberOfAyahs: 78, revelationType: 'Medinan', juz: [27] },
  { number: 56, name: 'الواقعة', englishName: 'Al-Waqiah', malayName: 'Al-Waqiah', numberOfAyahs: 96, revelationType: 'Meccan', juz: [27] },
  { number: 57, name: 'الحديد', englishName: 'Al-Hadid', malayName: 'Al-Hadid', numberOfAyahs: 29, revelationType: 'Medinan', juz: [27] },
  { number: 58, name: 'المجادلة', englishName: 'Al-Mujadilah', malayName: 'Al-Mujadilah', numberOfAyahs: 22, revelationType: 'Medinan', juz: [28] },
  { number: 59, name: 'الحشر', englishName: 'Al-Hashr', malayName: 'Al-Hashr', numberOfAyahs: 24, revelationType: 'Medinan', juz: [28] },
  { number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahanah', malayName: 'Al-Mumtahanah', numberOfAyahs: 13, revelationType: 'Medinan', juz: [28] },
  { number: 61, name: 'الصف', englishName: 'As-Saff', malayName: 'As-Saff', numberOfAyahs: 14, revelationType: 'Medinan', juz: [28] },
  { number: 62, name: 'الجمعة', englishName: 'Al-Jumuah', malayName: 'Al-Jumuah', numberOfAyahs: 11, revelationType: 'Medinan', juz: [28] },
  { number: 63, name: 'المنافقون', englishName: 'Al-Munafiqun', malayName: 'Al-Munafiqun', numberOfAyahs: 11, revelationType: 'Medinan', juz: [28] },
  { number: 64, name: 'التغابن', englishName: 'At-Taghabun', malayName: 'At-Taghabun', numberOfAyahs: 18, revelationType: 'Medinan', juz: [28] },
  { number: 65, name: 'الطلاق', englishName: 'At-Talaq', malayName: 'At-Talaq', numberOfAyahs: 12, revelationType: 'Medinan', juz: [28] },
  { number: 66, name: 'التحريم', englishName: 'At-Tahrim', malayName: 'At-Tahrim', numberOfAyahs: 12, revelationType: 'Medinan', juz: [28] },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', malayName: 'Al-Mulk', numberOfAyahs: 30, revelationType: 'Meccan', juz: [29] },
  { number: 68, name: 'القلم', englishName: 'Al-Qalam', malayName: 'Al-Qalam', numberOfAyahs: 52, revelationType: 'Meccan', juz: [29] },
  { number: 69, name: 'الحاقة', englishName: 'Al-Haqqah', malayName: 'Al-Haqqah', numberOfAyahs: 52, revelationType: 'Meccan', juz: [29] },
  { number: 70, name: 'المعارج', englishName: 'Al-Maarij', malayName: 'Al-Maarij', numberOfAyahs: 44, revelationType: 'Meccan', juz: [29] },
  { number: 71, name: 'نوح', englishName: 'Nuh', malayName: 'Nuh', numberOfAyahs: 28, revelationType: 'Meccan', juz: [29] },
  { number: 72, name: 'الجن', englishName: 'Al-Jinn', malayName: 'Al-Jinn', numberOfAyahs: 28, revelationType: 'Meccan', juz: [29] },
  { number: 73, name: 'المزمل', englishName: 'Al-Muzzammil', malayName: 'Al-Muzzammil', numberOfAyahs: 20, revelationType: 'Meccan', juz: [29] },
  { number: 74, name: 'المدثر', englishName: 'Al-Muddaththir', malayName: 'Al-Muddaththir', numberOfAyahs: 56, revelationType: 'Meccan', juz: [29] },
  { number: 75, name: 'القيامة', englishName: 'Al-Qiyamah', malayName: 'Al-Qiyamah', numberOfAyahs: 40, revelationType: 'Meccan', juz: [29] },
  { number: 76, name: 'الإنسان', englishName: 'Al-Insan', malayName: 'Al-Insan', numberOfAyahs: 31, revelationType: 'Medinan', juz: [29] },
  { number: 77, name: 'المرسلات', englishName: 'Al-Mursalat', malayName: 'Al-Mursalat', numberOfAyahs: 50, revelationType: 'Meccan', juz: [29] },
  { number: 78, name: 'النبأ', englishName: 'An-Naba', malayName: 'An-Naba', numberOfAyahs: 40, revelationType: 'Meccan', juz: [30] },
  { number: 79, name: 'النازعات', englishName: 'An-Naziat', malayName: 'An-Naziat', numberOfAyahs: 46, revelationType: 'Meccan', juz: [30] },
  { number: 80, name: 'عبس', englishName: 'Abasa', malayName: 'Abasa', numberOfAyahs: 42, revelationType: 'Meccan', juz: [30] },
  { number: 81, name: 'التكوير', englishName: 'At-Takwir', malayName: 'At-Takwir', numberOfAyahs: 29, revelationType: 'Meccan', juz: [30] },
  { number: 82, name: 'الانفطار', englishName: 'Al-Infitar', malayName: 'Al-Infitar', numberOfAyahs: 19, revelationType: 'Meccan', juz: [30] },
  { number: 83, name: 'المطففين', englishName: 'Al-Mutaffifin', malayName: 'Al-Mutaffifin', numberOfAyahs: 36, revelationType: 'Meccan', juz: [30] },
  { number: 84, name: 'الانشقاق', englishName: 'Al-Inshiqaq', malayName: 'Al-Inshiqaq', numberOfAyahs: 25, revelationType: 'Meccan', juz: [30] },
  { number: 85, name: 'البروج', englishName: 'Al-Buruj', malayName: 'Al-Buruj', numberOfAyahs: 22, revelationType: 'Meccan', juz: [30] },
  { number: 86, name: 'الطارق', englishName: 'At-Tariq', malayName: 'At-Tariq', numberOfAyahs: 17, revelationType: 'Meccan', juz: [30] },
  { number: 87, name: 'الأعلى', englishName: 'Al-Ala', malayName: 'Al-Ala', numberOfAyahs: 19, revelationType: 'Meccan', juz: [30] },
  { number: 88, name: 'الغاشية', englishName: 'Al-Ghashiyah', malayName: 'Al-Ghashiyah', numberOfAyahs: 26, revelationType: 'Meccan', juz: [30] },
  { number: 89, name: 'الفجر', englishName: 'Al-Fajr', malayName: 'Al-Fajr', numberOfAyahs: 30, revelationType: 'Meccan', juz: [30] },
  { number: 90, name: 'البلد', englishName: 'Al-Balad', malayName: 'Al-Balad', numberOfAyahs: 20, revelationType: 'Meccan', juz: [30] },
  { number: 91, name: 'الشمس', englishName: 'Ash-Shams', malayName: 'Ash-Shams', numberOfAyahs: 15, revelationType: 'Meccan', juz: [30] },
  { number: 92, name: 'الليل', englishName: 'Al-Layl', malayName: 'Al-Layl', numberOfAyahs: 21, revelationType: 'Meccan', juz: [30] },
  { number: 93, name: 'الضحى', englishName: 'Ad-Duha', malayName: 'Ad-Duha', numberOfAyahs: 11, revelationType: 'Meccan', juz: [30] },
  { number: 94, name: 'الشرح', englishName: 'Ash-Sharh', malayName: 'Ash-Sharh', numberOfAyahs: 8, revelationType: 'Meccan', juz: [30] },
  { number: 95, name: 'التين', englishName: 'At-Tin', malayName: 'At-Tin', numberOfAyahs: 8, revelationType: 'Meccan', juz: [30] },
  { number: 96, name: 'العلق', englishName: 'Al-Alaq', malayName: 'Al-Alaq', numberOfAyahs: 19, revelationType: 'Meccan', juz: [30] },
  { number: 97, name: 'القدر', englishName: 'Al-Qadr', malayName: 'Al-Qadr', numberOfAyahs: 5, revelationType: 'Meccan', juz: [30] },
  { number: 98, name: 'البينة', englishName: 'Al-Bayyinah', malayName: 'Al-Bayyinah', numberOfAyahs: 8, revelationType: 'Medinan', juz: [30] },
  { number: 99, name: 'الزلزلة', englishName: 'Az-Zalzalah', malayName: 'Az-Zalzalah', numberOfAyahs: 8, revelationType: 'Medinan', juz: [30] },
  { number: 100, name: 'العاديات', englishName: 'Al-Adiyat', malayName: 'Al-Adiyat', numberOfAyahs: 11, revelationType: 'Meccan', juz: [30] },
  { number: 101, name: 'القارعة', englishName: 'Al-Qariah', malayName: 'Al-Qariah', numberOfAyahs: 11, revelationType: 'Meccan', juz: [30] },
  { number: 102, name: 'التكاثر', englishName: 'At-Takathur', malayName: 'At-Takathur', numberOfAyahs: 8, revelationType: 'Meccan', juz: [30] },
  { number: 103, name: 'العصر', englishName: 'Al-Asr', malayName: 'Al-Asr', numberOfAyahs: 3, revelationType: 'Meccan', juz: [30] },
  { number: 104, name: 'الهمزة', englishName: 'Al-Humazah', malayName: 'Al-Humazah', numberOfAyahs: 9, revelationType: 'Meccan', juz: [30] },
  { number: 105, name: 'الفيل', englishName: 'Al-Fil', malayName: 'Al-Fil', numberOfAyahs: 5, revelationType: 'Meccan', juz: [30] },
  { number: 106, name: 'قريش', englishName: 'Quraysh', malayName: 'Quraysh', numberOfAyahs: 4, revelationType: 'Meccan', juz: [30] },
  { number: 107, name: 'الماعون', englishName: 'Al-Maun', malayName: 'Al-Maun', numberOfAyahs: 7, revelationType: 'Meccan', juz: [30] },
  { number: 108, name: 'الكوثر', englishName: 'Al-Kawthar', malayName: 'Al-Kawthar', numberOfAyahs: 3, revelationType: 'Meccan', juz: [30] },
  { number: 109, name: 'الكافرون', englishName: 'Al-Kafirun', malayName: 'Al-Kafirun', numberOfAyahs: 6, revelationType: 'Meccan', juz: [30] },
  { number: 110, name: 'النصر', englishName: 'An-Nasr', malayName: 'An-Nasr', numberOfAyahs: 3, revelationType: 'Medinan', juz: [30] },
  { number: 111, name: 'المسد', englishName: 'Al-Masad', malayName: 'Al-Masad', numberOfAyahs: 5, revelationType: 'Meccan', juz: [30] },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', malayName: 'Al-Ikhlas', numberOfAyahs: 4, revelationType: 'Meccan', juz: [30] },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', malayName: 'Al-Falaq', numberOfAyahs: 5, revelationType: 'Meccan', juz: [30] },
  { number: 114, name: 'الناس', englishName: 'An-Nas', malayName: 'An-Nas', numberOfAyahs: 6, revelationType: 'Meccan', juz: [30] },
]

// ═══════════════════════════════════════════════════════════
// 30 Juz Mapping
// ═══════════════════════════════════════════════════════════

const JUZ_DATA: JuzInfo[] = [
  { number: 1, startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 141 },
  { number: 2, startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252 },
  { number: 3, startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 92 },
  { number: 4, startSurah: 3, startAyah: 93, endSurah: 4, endAyah: 23 },
  { number: 5, startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147 },
  { number: 6, startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81 },
  { number: 7, startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110 },
  { number: 8, startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87 },
  { number: 9, startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40 },
  { number: 10, startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92 },
  { number: 11, startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5 },
  { number: 12, startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52 },
  { number: 13, startSurah: 12, startAyah: 53, endSurah: 14, endAyah: 52 },
  { number: 14, startSurah: 15, startAyah: 1, endSurah: 16, endAyah: 128 },
  { number: 15, startSurah: 17, startAyah: 1, endSurah: 18, endAyah: 74 },
  { number: 16, startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135 },
  { number: 17, startSurah: 21, startAyah: 1, endSurah: 22, endAyah: 78 },
  { number: 18, startSurah: 23, startAyah: 1, endSurah: 25, endAyah: 20 },
  { number: 19, startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 55 },
  { number: 20, startSurah: 27, startAyah: 56, endSurah: 29, endAyah: 45 },
  { number: 21, startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30 },
  { number: 22, startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27 },
  { number: 23, startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31 },
  { number: 24, startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46 },
  { number: 25, startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37 },
  { number: 26, startSurah: 46, startAyah: 1, endSurah: 51, endAyah: 30 },
  { number: 27, startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29 },
  { number: 28, startSurah: 58, startAyah: 1, endSurah: 66, endAyah: 12 },
  { number: 29, startSurah: 67, startAyah: 1, endSurah: 77, endAyah: 50 },
  { number: 30, startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6 },
]

// ═══════════════════════════════════════════════════════════
// 60 Hizb Mapping
// ═══════════════════════════════════════════════════════════

const HIZB_DATA: HizbInfo[] = [
  { number: 1, startSurah: 1, startAyah: 1 },
  { number: 2, startSurah: 2, startAyah: 26 },
  { number: 3, startSurah: 2, startAyah: 44 },
  { number: 4, startSurah: 2, startAyah: 60 },
  { number: 5, startSurah: 2, startAyah: 75 },
  { number: 6, startSurah: 2, startAyah: 92 },
  { number: 7, startSurah: 2, startAyah: 106 },
  { number: 8, startSurah: 2, startAyah: 124 },
  { number: 9, startSurah: 2, startAyah: 142 },
  { number: 10, startSurah: 2, startAyah: 158 },
  { number: 11, startSurah: 2, startAyah: 177 },
  { number: 12, startSurah: 2, startAyah: 189 },
  { number: 13, startSurah: 2, startAyah: 203 },
  { number: 14, startSurah: 2, startAyah: 219 },
  { number: 15, startSurah: 2, startAyah: 233 },
  { number: 16, startSurah: 2, startAyah: 243 },
  { number: 17, startSurah: 2, startAyah: 253 },
  { number: 18, startSurah: 2, startAyah: 265 },
  { number: 19, startSurah: 2, startAyah: 283 },
  { number: 20, startSurah: 3, startAyah: 15 },
  { number: 21, startSurah: 3, startAyah: 33 },
  { number: 22, startSurah: 3, startAyah: 52 },
  { number: 23, startSurah: 3, startAyah: 75 },
  { number: 24, startSurah: 3, startAyah: 93 },
  { number: 25, startSurah: 3, startAyah: 113 },
  { number: 26, startSurah: 3, startAyah: 133 },
  { number: 27, startSurah: 3, startAyah: 153 },
  { number: 28, startSurah: 3, startAyah: 171 },
  { number: 29, startSurah: 4, startAyah: 1 },
  { number: 30, startSurah: 4, startAyah: 24 },
  { number: 31, startSurah: 4, startAyah: 36 },
  { number: 32, startSurah: 4, startAyah: 58 },
  { number: 33, startSurah: 4, startAyah: 74 },
  { number: 34, startSurah: 4, startAyah: 88 },
  { number: 35, startSurah: 4, startAyah: 100 },
  { number: 36, startSurah: 4, startAyah: 114 },
  { number: 37, startSurah: 4, startAyah: 135 },
  { number: 38, startSurah: 4, startAyah: 148 },
  { number: 39, startSurah: 4, startAyah: 163 },
  { number: 40, startSurah: 5, startAyah: 1 },
  { number: 41, startSurah: 5, startAyah: 12 },
  { number: 42, startSurah: 5, startAyah: 27 },
  { number: 43, startSurah: 5, startAyah: 41 },
  { number: 44, startSurah: 5, startAyah: 51 },
  { number: 45, startSurah: 5, startAyah: 67 },
  { number: 46, startSurah: 5, startAyah: 82 },
  { number: 47, startSurah: 5, startAyah: 97 },
  { number: 48, startSurah: 5, startAyah: 109 },
  { number: 49, startSurah: 6, startAyah: 13 },
  { number: 50, startSurah: 6, startAyah: 36 },
  { number: 51, startSurah: 6, startAyah: 59 },
  { number: 52, startSurah: 6, startAyah: 74 },
  { number: 53, startSurah: 6, startAyah: 95 },
  { number: 54, startSurah: 6, startAyah: 111 },
  { number: 55, startSurah: 6, startAyah: 127 },
  { number: 56, startSurah: 6, startAyah: 141 },
  { number: 57, startSurah: 7, startAyah: 1 },
  { number: 58, startSurah: 7, startAyah: 31 },
  { number: 59, startSurah: 7, startAyah: 47 },
  { number: 60, startSurah: 7, startAyah: 65 },
]

// ═══════════════════════════════════════════════════════════
// 7 Manzil Mapping
// ═══════════════════════════════════════════════════════════

const MANZIL_DATA: ManzilInfo[] = [
  { number: 1, startSurah: 1, startAyah: 1 },
  { number: 2, startSurah: 2, startAyah: 142 },
  { number: 3, startSurah: 5, startAyah: 1 },
  { number: 4, startSurah: 8, startAyah: 1 },
  { number: 5, startSurah: 17, startAyah: 1 },
  { number: 6, startSurah: 26, startAyah: 1 },
  { number: 7, startSurah: 37, startAyah: 1 },
]

// ═══════════════════════════════════════════════════════════
// 14 Sajda Ayah Positions
// ═══════════════════════════════════════════════════════════

const SAJDA_DATA: SajdaAyah[] = [
  { surah: 7, ayah: 206, type: 'recommended' },
  { surah: 13, ayah: 15, type: 'recommended' },
  { surah: 16, ayah: 50, type: 'recommended' },
  { surah: 17, ayah: 109, type: 'recommended' },
  { surah: 19, ayah: 58, type: 'recommended' },
  { surah: 22, ayah: 18, type: 'recommended' },
  { surah: 22, ayah: 77, type: 'recommended' },
  { surah: 25, ayah: 60, type: 'recommended' },
  { surah: 27, ayah: 26, type: 'recommended' },
  { surah: 32, ayah: 15, type: 'obligatory' },
  { surah: 38, ayah: 24, type: 'recommended' },
  { surah: 41, ayah: 38, type: 'obligatory' },
  { surah: 53, ayah: 62, type: 'obligatory' },
  { surah: 96, ayah: 19, type: 'obligatory' },
]

// ═══════════════════════════════════════════════════════════
// 10+ Reciters List
// ═══════════════════════════════════════════════════════════

const RECITER_DATA: Reciter[] = [
  { id: 'ar.alafasy', name: 'Mishary Alafasy', nameAr: 'مشاري العفاسي' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit (Murattal)', nameAr: 'عبد الباسط عبد الصمد' },
  { id: 'ar.abdurrahmaansudais', name: 'Abdul Rahman Al-Sudais', nameAr: 'عبد الرحمن السديس' },
  { id: 'ar.saaborimuneer', name: 'Saad Al-Ghamdi', nameAr: 'سعد الغامدي' },
  { id: 'ar.hudhaify', name: 'Ali Al-Hudhaify', nameAr: 'علي الحذيفي' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq Al-Minshawi', nameAr: 'محمد صديق المنشاوي' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary', nameAr: 'محمود خليل الحصري' },
  { id: 'ar.maaboralward', name: 'Maher Al Muaiqly', nameAr: 'ماهر المعيقلي' },
  { id: 'ar.ahmedajamy', name: 'Ahmed Al-Ajamy', nameAr: 'أحمد العجمي' },
  { id: 'ar.abdullahbasfar', name: 'Abdullah Basfar', nameAr: 'عبد الله بصفر' },
  { id: 'ar.aymanswoaid', name: 'Ayman Suwayd', nameAr: 'أيمن سويد' },
  { id: 'ar.faresabbad', name: 'Fares Abbad', nameAr: 'فارس عباد' },
]

// ═══════════════════════════════════════════════════════════
// 8+ Tajwid Rules with Malay Descriptions
// ═══════════════════════════════════════════════════════════

const TAJWID_DATA: TajwidRule[] = [
  {
    name: 'Nun Sakinah & Tanwin',
    nameMs: 'Nun Mati & Tanwin',
    description: 'Rules for pronouncing nun sakinah (نْ) and tanwin (ًٌٍ) when followed by different letters, including Izhar, Idgham, Iqlab, and Ikhfa.',
    descriptionMs: 'Hukum sebutan nun mati (نْ) dan tanwin (ًٌٍ) apabila bertemu dengan huruf-huruf tertentu, termasuk Izhar, Idgham, Iqlab, dan Ikhfa.',
    examples: [
      { ayah: 'يُؤْمِنُونَ بِمَا', surah: 2, ayahNumber: 4 },
      { ayah: 'مِنْ وَلِيٍّ وَلَا نَصِيرٍ', surah: 2, ayahNumber: 107 },
      { ayah: 'مِنْ بَعْدِ', surah: 2, ayahNumber: 37 },
    ],
  },
  {
    name: 'Mim Sakinah',
    nameMs: 'Mim Mati',
    description: 'Rules for pronouncing mim sakinah (مْ) when followed by different letters, including Idgham Mimi, Ikhfa Syafawi, and Izhar Syafawi.',
    descriptionMs: 'Hukum sebutan mim mati (مْ) apabila bertemu dengan huruf-huruf tertentu, termasuk Idgham Mimi, Ikhfa Syafawi, dan Izhar Syafawi.',
    examples: [
      { ayah: 'هُمْ فِيهَا', surah: 2, ayahNumber: 25 },
      { ayah: 'مَا لَكُمْ لَا', surah: 2, ayahNumber: 134 },
      { ayah: 'عَلَيْهِمْ وَلَا', surah: 1, ayahNumber: 7 },
    ],
  },
  {
    name: 'Qalqalah',
    nameMs: 'Qalqalah',
    description: 'The bouncing/echoing sound produced when any of the five qalqalah letters (ق ط ب ج د) have a sukoon. There are Qalqalah Kubra (at the end of ayah) and Qalqalah Sughra (in the middle).',
    descriptionMs: 'Bunyi pantulan yang dihasilkan apabila salah satu daripada lima huruf qalqalah (ق ط ب ج د) berbaris sukun. Terdapat Qalqalah Kubra (di akhir ayat) dan Qalqalah Sughra (di tengah ayat).',
    examples: [
      { ayah: 'وَقَبَ', surah: 113, ayahNumber: 3 },
      { ayah: 'الْحَقُّ', surah: 1, ayahNumber: 4 },
      { ayah: 'أَحَدٌ', surah: 112, ayahNumber: 1 },
    ],
  },
  {
    name: 'Madd',
    nameMs: 'Madd (Panjang Bacaan)',
    description: 'Rules for elongating vowel sounds. Includes Madd Tabii (2 harakat), Madd Wajib Muttasil, Madd Jaiz Munfasil, Madd Lazim, Madd Arid Lil-Sukun, and Madd Lin.',
    descriptionMs: 'Hukum memanjangkan sebutan huruf mad. Termasuk Madd Tabii (2 harakat), Madd Wajib Muttasil, Madd Jaiz Munfasil, Madd Lazim, Madd Arid Lil-Sukun, dan Madd Lin.',
    examples: [
      { ayah: 'الرَّحْمَـٰنِ', surah: 1, ayahNumber: 3 },
      { ayah: 'ٱلضَّآلِّينَ', surah: 1, ayahNumber: 7 },
      { ayah: 'سَمِيعٌ عَلِيمٌ', surah: 2, ayahNumber: 244 },
    ],
  },
  {
    name: 'Idgham',
    nameMs: 'Idgham (Masukkan/Gabung)',
    description: 'The merging of one letter into another when certain letters meet. Includes Idgham Bighunnah, Idgham Bilaghunnah, Idgham Mutajanisayn, and Idgham Mutaqaribayn.',
    descriptionMs: 'Penggabungan satu huruf ke dalam huruf lain apabila huruf-huruf tertentu bertemu. Termasuk Idgham Bighunnah, Idgham Bilaghunnah, Idgham Mutajanisayn, dan Idgham Mutaqaribayn.',
    examples: [
      { ayah: 'مَن يَعْمَلْ', surah: 2, ayahNumber: 62 },
      { ayah: 'وَقَالُوا۟ رَبَّنَآ', surah: 2, ayahNumber: 285 },
      { ayah: 'قُل رَّبِّى', surah: 17, ayahNumber: 80 },
    ],
  },
  {
    name: 'Ikhfa',
    nameMs: 'Ikhfa (Sembunyi)',
    description: 'Pronouncing a letter between Izhar and Idgham with a ghunnah (nasalization). Applied when nun sakinah or tanwin meets any of the 15 letters of Ikhfa.',
    descriptionMs: 'Menyebut huruf di antara Izhar dan Idgham dengan dengung (ghunnah). Digunakan apabila nun mati atau tanwin bertemu mana-mana 15 huruf Ikhfa.',
    examples: [
      { ayah: 'أَنتُمُ', surah: 2, ayahNumber: 24 },
      { ayah: 'مِن ثَمَرَاتٍ', surah: 2, ayahNumber: 25 },
      { ayah: 'يُنزِلُ', surah: 2, ayahNumber: 22 },
    ],
  },
  {
    name: 'Waqaf & Ibtida',
    nameMs: 'Waqaf & Ibtida (Berhenti & Mula)',
    description: 'Rules for proper stopping (Waqaf) and starting (Ibtida) during Quran recitation. Includes Waqaf Tam, Waqaf Hasan, Waqaf Qabil, and signs like Qif, La, and Sad/Lam-Ain.',
    descriptionMs: 'Hukum berhenti (Waqaf) dan memulakan (Ibtida) semasa membaca Al-Quran. Termasuk Waqaf Tam, Waqaf Hasan, Waqaf Qabil, dan tanda-tanda seperti Qif, La, dan Sad/Lam-Ain.',
    examples: [
      { ayah: 'ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝', surah: 1, ayahNumber: 3 },
      { ayah: 'مَـٰلِكِ يَوْمِ ٱلدِّينِ ۝', surah: 1, ayahNumber: 4 },
      { ayah: 'إِيَّاكَ نَعْبُدُ ۝ وَإِيَّاكَ نَسْتَعِينُ', surah: 1, ayahNumber: 5 },
    ],
  },
  {
    name: 'Tafkhim & Tarqiq',
    nameMs: 'Tafkhim & Tarqiq (Tebal & Nipis)',
    description: 'Rules for pronouncing letters with emphasis/heaviness (Tafkhim) or lightness (Tarqiq). The 7 letters of Istila (خص ضغط قظ) are always Mufakhkam. Ra and Lam can be either.',
    descriptionMs: 'Hukum menyebut huruf dengan penekanan/berat (Tafkhim) atau ringan (Tarqiq). 7 huruf Istila (خص ضغط قظ) sentiasa Mufakhkam. Ra dan Lam boleh menjadi kedua-duanya.',
    examples: [
      { ayah: 'طه', surah: 20, ayahNumber: 1 },
      { ayah: 'قُلْ هُوَ ٱللَّهُ', surah: 112, ayahNumber: 1 },
      { ayah: 'غَفُورٌ رَّحِيمٌ', surah: 2, ayahNumber: 173 },
    ],
  },
  {
    name: 'Izhar',
    nameMs: 'Izhar (Nyata/Jelas)',
    description: 'Pronouncing each letter clearly from its point of articulation without ghunnah. Applied when nun sakinah or tanwin meets any of the 6 throat letters (ء ه ع ح غ خ).',
    descriptionMs: 'Menyebut setiap huruf dengan jelas dari titik sebutannya tanpa dengung. Digunakan apabila nun mati atau tanwin bertemu mana-mana 6 huruf halqa (ء ه ع ح غ خ).',
    examples: [
      { ayah: 'مِنْ آيَاتِنَا', surah: 2, ayahNumber: 73 },
      { ayah: 'يَعْلَمُونَ', surah: 2, ayahNumber: 11 },
      { ayah: 'مِنْ خَلْفِهِمْ', surah: 2, ayahNumber: 33 },
    ],
  },
  {
    name: 'Iqlab',
    nameMs: 'Iqlab (Tukar)',
    description: 'Changing nun sakinah or tanwin into a hidden mim when followed by the letter Ba (ب). The lips should be shaped for mim but the sound blends with ba.',
    descriptionMs: 'Menukarkan nun mati atau tanwin menjadi mim yang tersembunyi apabila bertemu dengan huruf Ba (ب). Bibir hendaklah berbentuk untuk mim tetapi bunyi bercampur dengan ba.',
    examples: [
      { ayah: 'يُنۢبِتُ', surah: 2, ayahNumber: 265 },
      { ayah: 'مِنۢ بَعْدِ', surah: 2, ayahNumber: 37 },
      { ayah: 'أَنۢبِئْهُم', surah: 2, ayahNumber: 33 },
    ],
  },
]

// ═══════════════════════════════════════════════════════════
// In-Memory Cache
// ═══════════════════════════════════════════════════════════

interface CacheEntry<T> {
  data: T
  expiry: number
}

const cache = new Map<string, CacheEntry<unknown>>()

function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiry) {
    cache.delete(key)
    return null
  }
  return entry.data as T
}

function setCache<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, { data, expiry: Date.now() + ttlMs })
}

// ═══════════════════════════════════════════════════════════
// Helper: Compute absolute ayah number (1-6236)
// ═══════════════════════════════════════════════════════════

function getAbsoluteAyahNumber(surahNumber: number, ayahInSurah: number): number {
  let total = 0
  for (let i = 0; i < surahNumber - 1 && i < SURAH_DATA.length; i++) {
    total += SURAH_DATA[i].numberOfAyahs
  }
  return total + ayahInSurah
}

// ═══════════════════════════════════════════════════════════
// QuranService Class
// ═══════════════════════════════════════════════════════════

class QuranService {
  private readonly API_BASE = 'https://api.alquran.cloud/v1'
  private readonly CACHE_TTL = 3600000 // 1 hour

  // ─── Fetch with timeout and error handling ─────────────
  private async fetchWithTimeout(url: string, timeoutMs = 10000): Promise<Response> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timer)
      return response
    } catch (error) {
      clearTimeout(timer)
      throw error
    }
  }

  // ─── Fetch surah list (114 surahs) ────────────────────
  async getSurahList(): Promise<Surah[]> {
    const cacheKey = 'surah-list'
    const cached = getCached<Surah[]>(cacheKey)
    if (cached) return cached

    try {
      const response = await this.fetchWithTimeout(`${this.API_BASE}/surah`)
      if (!response.ok) throw new Error(`API error: ${response.status}`)
      const data = await response.json()

      if (data.code === 200 && data.data) {
        const surahs: Surah[] = data.data.map((s: { number: number; name: string; englishName: string; numberOfAyahs: number; revelationType: string }) => {
          const localSurah = SURAH_DATA.find(ls => ls.number === s.number)
          return {
            number: s.number,
            name: s.name,
            englishName: s.englishName,
            malayName: localSurah?.malayName || s.englishName,
            numberOfAyahs: s.numberOfAyahs,
            revelationType: s.revelationType === 'Meccan' ? 'Meccan' : 'Medinan',
            juz: localSurah?.juz || [],
          }
        })
        setCache(cacheKey, surahs, this.CACHE_TTL)
        return surahs
      }
    } catch {
      // Fallback to local data
    }

    setCache(cacheKey, SURAH_DATA, this.CACHE_TTL)
    return SURAH_DATA
  }

  // ─── Fetch complete surah with all ayahs ──────────────
  async getSurah(surahNumber: number, edition?: string): Promise<{ surah: Surah; ayahs: Ayah[] }> {
    if (surahNumber < 1 || surahNumber > 114) {
      throw new Error('Surah number must be between 1 and 114')
    }

    const ed = edition || 'quran-uthmani'
    const cacheKey = `surah-${surahNumber}-${ed}`
    const cached = getCached<{ surah: Surah; ayahs: Ayah[] }>(cacheKey)
    if (cached) return cached

    const localSurah = SURAH_DATA.find(s => s.number === surahNumber)
    if (!localSurah) throw new Error(`Surah ${surahNumber} not found`)

    try {
      // Fetch Arabic text
      const arResponse = await this.fetchWithTimeout(`${this.API_BASE}/surah/${surahNumber}/${ed}`)
      if (!arResponse.ok) throw new Error(`Arabic API error: ${arResponse.status}`)
      const arData = await arResponse.json()

      // Fetch Malay translation
      let msAyahs: { number: number; numberInSurah: number; text: string }[] = []
      try {
        const msResponse = await this.fetchWithTimeout(`${this.API_BASE}/surah/${surahNumber}/ms.basmeih`)
        if (msResponse.ok) {
          const msData = await msResponse.json()
          if (msData.code === 200 && msData.data?.ayahs) {
            msAyahs = msData.data.ayahs
          }
        }
      } catch {
        // Malay translation not available, continue without it
      }

      // Fetch English translation
      let enAyahs: { number: number; numberInSurah: number; text: string }[] = []
      try {
        const enResponse = await this.fetchWithTimeout(`${this.API_BASE}/surah/${surahNumber}/en.sahih`)
        if (enResponse.ok) {
          const enData = await enResponse.json()
          if (enData.code === 200 && enData.data?.ayahs) {
            enAyahs = enData.data.ayahs
          }
        }
      } catch {
        // English translation not available, continue without it
      }

      if (arData.code === 200 && arData.data?.ayahs) {
        const surah: Surah = {
          number: arData.data.number,
          name: arData.data.name,
          englishName: arData.data.englishName,
          malayName: localSurah.malayName,
          numberOfAyahs: arData.data.numberOfAyahs,
          revelationType: arData.data.revelationType === 'Meccan' ? 'Meccan' : 'Medinan',
          juz: localSurah.juz,
        }

        const ayahs: Ayah[] = arData.data.ayahs.map((a: { number: number; numberInSurah: number; text: string; sajda: boolean | { id: number; recommended: boolean; obligatory: boolean } }) => {
          const msTranslation = msAyahs.find((m: { numberInSurah: number }) => m.numberInSurah === a.numberInSurah)
          const enTranslation = enAyahs.find((e: { numberInSurah: number }) => e.numberInSurah === a.numberInSurah)
          const isSajda = typeof a.sajda === 'object' ? (a.sajda.recommended || a.sajda.obligatory) : a.sajda

          return {
            number: a.number,
            numberInSurah: a.numberInSurah,
            text: a.text,
            translationMs: msTranslation?.text || '',
            translationEn: enTranslation?.text || '',
            audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${a.number}.mp3`,
            sajda: isSajda,
          }
        })

        const result = { surah, ayahs }
        setCache(cacheKey, result, this.CACHE_TTL)
        return result
      }
    } catch {
      // Fallback: return surah info with empty ayahs
    }

    const result = { surah: localSurah, ayahs: [] as Ayah[] }
    setCache(cacheKey, result, this.CACHE_TTL)
    return result
  }

  // ─── Fetch single ayah ────────────────────────────────
  async getAyah(surahNumber: number, ayahNumber: number): Promise<Ayah> {
    const absoluteNumber = getAbsoluteAyahNumber(surahNumber, ayahNumber)
    return this.getAyahByNumber(absoluteNumber)
  }

  // ─── Fetch ayah by absolute number (1-6236) ──────────
  async getAyahByNumber(number: number): Promise<Ayah> {
    if (number < 1 || number > 6236) {
      throw new Error('Ayah number must be between 1 and 6236')
    }

    const cacheKey = `ayah-${number}`
    const cached = getCached<Ayah>(cacheKey)
    if (cached) return cached

    try {
      const [arResponse, msResponse, enResponse] = await Promise.allSettled([
        this.fetchWithTimeout(`${this.API_BASE}/ayah/${number}/quran-uthmani`),
        this.fetchWithTimeout(`${this.API_BASE}/ayah/${number}/ms.basmeih`),
        this.fetchWithTimeout(`${this.API_BASE}/ayah/${number}/en.sahih`),
      ])

      let arabicText = ''
      let numberInSurah = 0
      let sajda = false

      if (arResponse.status === 'fulfilled' && arResponse.value.ok) {
        const data = await arResponse.value.json()
        if (data.code === 200 && data.data) {
          arabicText = data.data.text
          numberInSurah = data.data.numberInSurah
          sajda = typeof data.data.sajda === 'object'
            ? (data.data.sajda.recommended || data.data.sajda.obligatory)
            : data.data.sajda
        }
      }

      let translationMs = ''
      if (msResponse.status === 'fulfilled' && msResponse.value.ok) {
        const data = await msResponse.value.json()
        if (data.code === 200 && data.data) {
          translationMs = data.data.text
        }
      }

      let translationEn = ''
      if (enResponse.status === 'fulfilled' && enResponse.value.ok) {
        const data = await enResponse.value.json()
        if (data.code === 200 && data.data) {
          translationEn = data.data.text
        }
      }

      const ayah: Ayah = {
        number,
        numberInSurah,
        text: arabicText,
        translationMs,
        translationEn,
        audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${number}.mp3`,
        sajda,
      }

      setCache(cacheKey, ayah, this.CACHE_TTL)
      return ayah
    } catch {
      throw new Error(`Failed to fetch ayah ${number}`)
    }
  }

  // ─── Search Quran ─────────────────────────────────────
  async searchQuran(query: string, language: 'ar' | 'ms' | 'en' = 'ar'): Promise<Ayah[]> {
    if (!query || query.trim().length === 0) {
      return []
    }

    const cacheKey = `search-${language}-${query}`
    const cached = getCached<Ayah[]>(cacheKey)
    if (cached) return cached

    const editionMap: Record<string, string> = {
      ar: 'quran-uthmani',
      ms: 'ms.basmeih',
      en: 'en.sahih',
    }

    try {
      const edition = editionMap[language] || 'quran-uthmani'
      const response = await this.fetchWithTimeout(
        `${this.API_BASE}/search/${encodeURIComponent(query)}/all/${edition}`,
        15000
      )

      if (!response.ok) throw new Error(`Search API error: ${response.status}`)
      const data = await response.json()

      if (data.code === 200 && data.data?.matches) {
        const ayahs: Ayah[] = data.data.matches.map((m: { number: number; numberInSurah: number; text: string; surah: { number: number }; sajda: boolean | { id: number; recommended: boolean; obligatory: boolean } }) => ({
          number: m.number,
          numberInSurah: m.numberInSurah,
          text: language === 'ar' ? m.text : '',
          translationMs: language === 'ms' ? m.text : '',
          translationEn: language === 'en' ? m.text : '',
          audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${m.number}.mp3`,
          sajda: typeof m.sajda === 'object' ? (m.sajda.recommended || m.sajda.obligatory) : m.sajda,
        }))

        setCache(cacheKey, ayahs, this.CACHE_TTL / 2) // Cache search results for 30 min
        return ayahs
      }
    } catch {
      // Search failed
    }

    return []
  }

  // ─── Get Juz list (30 juz) ────────────────────────────
  async getJuzList(): Promise<JuzInfo[]> {
    return JUZ_DATA
  }

  // ─── Get Juz ──────────────────────────────────────────
  async getJuz(juzNumber: number): Promise<{ surahs: Surah[]; ayahs: Ayah[] }> {
    if (juzNumber < 1 || juzNumber > 30) {
      throw new Error('Juz number must be between 1 and 30')
    }

    const cacheKey = `juz-${juzNumber}`
    const cached = getCached<{ surahs: Surah[]; ayahs: Ayah[] }>(cacheKey)
    if (cached) return cached

    const juzInfo = JUZ_DATA.find(j => j.number === juzNumber)!

    try {
      const response = await this.fetchWithTimeout(
        `${this.API_BASE}/juz/${juzNumber}/quran-uthmani`,
        15000
      )

      if (!response.ok) throw new Error(`Juz API error: ${response.status}`)
      const data = await response.json()

      if (data.code === 200 && data.data) {
        // Get unique surahs in this juz
        const surahNumbers = [...new Set(data.data.ayahs.map((a: { surah: { number: number } }) => a.surah.number))] as number[]
        const surahs = surahNumbers
          .map(n => SURAH_DATA.find(s => s.number === n))
          .filter((s): s is Surah => s !== undefined)

        const ayahs: Ayah[] = data.data.ayahs.map((a: { number: number; numberInSurah: number; text: string; surah: { number: number }; sajda: boolean | { id: number; recommended: boolean; obligatory: boolean } }) => ({
          number: a.number,
          numberInSurah: a.numberInSurah,
          text: a.text,
          translationMs: '',
          translationEn: '',
          audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${a.number}.mp3`,
          sajda: typeof a.sajda === 'object' ? (a.sajda.recommended || a.sajda.obligatory) : a.sajda,
        }))

        const result = { surahs, ayahs }
        setCache(cacheKey, result, this.CACHE_TTL)
        return result
      }
    } catch {
      // Fallback: return surah list from juz mapping
    }

    // Fallback from local data
    const surahsInRange: Surah[] = []
    for (let s = juzInfo.startSurah; s <= juzInfo.endSurah; s++) {
      const surah = SURAH_DATA.find(sr => sr.number === s)
      if (surah) surahsInRange.push(surah)
    }

    const result = { surahs: surahsInRange, ayahs: [] as Ayah[] }
    setCache(cacheKey, result, this.CACHE_TTL)
    return result
  }

  // ─── Get Hizb list (60 hizb) ─────────────────────────
  async getHizbList(): Promise<HizbInfo[]> {
    return HIZB_DATA
  }

  // ─── Get Manzil list (7 manzil) ──────────────────────
  async getManzilList(): Promise<ManzilInfo[]> {
    return MANZIL_DATA
  }

  // ─── Get Page list (604 pages) ────────────────────────
  async getPageList(): Promise<PageInfo[]> {
    const cacheKey = 'page-list'
    const cached = getCached<PageInfo[]>(cacheKey)
    if (cached) return cached

    try {
      const response = await this.fetchWithTimeout(`${this.API_BASE}/meta`)
      if (!response.ok) throw new Error(`Meta API error: ${response.status}`)
      const data = await response.json()

      if (data.code === 200 && data.data?.pages) {
        const pages: PageInfo[] = data.data.pages.map((p: { number: number; surah: number; ayah: number }) => ({
          number: p.number,
          startSurah: p.surah,
          startAyah: p.ayah,
        }))
        setCache(cacheKey, pages, this.CACHE_TTL * 24) // Cache for 24 hours
        return pages
      }
    } catch {
      // Fallback
    }

    // Generate approximate page mapping (604 pages)
    const pages: PageInfo[] = []
    // Simplified mapping - first few pages
    const pageStarts: [number, number][] = [
      [1, 1], [2, 1], [2, 26], [2, 44], [2, 60], [2, 75], [2, 92], [2, 106],
      [2, 124], [2, 142], [2, 158], [2, 177], [2, 189], [2, 203], [2, 219],
      [2, 233], [2, 243], [2, 253], [2, 265], [2, 283],
    ]
    for (let i = 0; i < 604; i++) {
      if (i < pageStarts.length) {
        pages.push({ number: i + 1, startSurah: pageStarts[i][0], startAyah: pageStarts[i][1] })
      } else {
        // Approximate for remaining pages
        pages.push({ number: i + 1, startSurah: Math.min(114, Math.floor(i / 5) + 1), startAyah: 1 })
      }
    }

    setCache(cacheKey, pages, this.CACHE_TTL)
    return pages
  }

  // ─── Get Page ─────────────────────────────────────────
  async getPage(pageNumber: number): Promise<{ ayahs: Ayah[] }> {
    if (pageNumber < 1 || pageNumber > 604) {
      throw new Error('Page number must be between 1 and 604')
    }

    const cacheKey = `page-${pageNumber}`
    const cached = getCached<{ ayahs: Ayah[] }>(cacheKey)
    if (cached) return cached

    try {
      const response = await this.fetchWithTimeout(
        `${this.API_BASE}/page/${pageNumber}/quran-uthmani`
      )

      if (!response.ok) throw new Error(`Page API error: ${response.status}`)
      const data = await response.json()

      if (data.code === 200 && data.data?.ayahs) {
        const ayahs: Ayah[] = data.data.ayahs.map((a: { number: number; numberInSurah: number; text: string; sajda: boolean | { id: number; recommended: boolean; obligatory: boolean } }) => ({
          number: a.number,
          numberInSurah: a.numberInSurah,
          text: a.text,
          translationMs: '',
          translationEn: '',
          audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${a.number}.mp3`,
          sajda: typeof a.sajda === 'object' ? (a.sajda.recommended || a.sajda.obligatory) : a.sajda,
        }))

        const result = { ayahs }
        setCache(cacheKey, result, this.CACHE_TTL)
        return result
      }
    } catch {
      // Fallback
    }

    return { ayahs: [] }
  }

  // ─── Sajda ayahs (14 sajda ayahs in Quran) ───────────
  async getSajdaAyahs(): Promise<SajdaAyah[]> {
    return SAJDA_DATA
  }

  // ─── Tajwid rules reference ───────────────────────────
  getTajwidRules(): TajwidRule[] {
    return TAJWID_DATA
  }

  // ─── Audio recitation URLs ────────────────────────────
  getReciterList(): Reciter[] {
    return RECITER_DATA
  }

  getAudioUrl(surah: number, ayah: number, reciter: string = 'ar.alafasy'): string {
    const absoluteNumber = getAbsoluteAyahNumber(surah, ayah)
    return `https://cdn.islamic.network/quran/audio/128/${reciter}/${absoluteNumber}.mp3`
  }

  // ─── Tafsir ───────────────────────────────────────────
  async getTafsir(surahNumber: number, ayahNumber: number): Promise<TafsirEntry> {
    if (surahNumber < 1 || surahNumber > 114) {
      throw new Error('Surah number must be between 1 and 114')
    }

    const cacheKey = `tafsir-${surahNumber}-${ayahNumber}`
    const cached = getCached<TafsirEntry>(cacheKey)
    if (cached) return cached

    try {
      // Try fetching from alquran.cloud tafsir editions
      const response = await this.fetchWithTimeout(
        `${this.API_BASE}/ayah/${surahNumber}:${ayahNumber}/ar.muyassar`
      )

      if (!response.ok) throw new Error(`Tafsir API error: ${response.status}`)
      const data = await response.json()

      if (data.code === 200 && data.data) {
        const entry: TafsirEntry = {
          surah: surahNumber,
          ayah: ayahNumber,
          textMs: data.data.text || '',
          source: 'Tafsir Al-Muyassar (Arabic)',
        }
        setCache(cacheKey, entry, this.CACHE_TTL * 24)
        return entry
      }
    } catch {
      // Fallback
    }

    // Return basic info as fallback
    const surah = SURAH_DATA.find(s => s.number === surahNumber)
    const entry: TafsirEntry = {
      surah: surahNumber,
      ayah: ayahNumber,
      textMs: `Tafsir untuk ${surah?.englishName || 'Surah'} :${ayahNumber} tidak tersedia pada masa ini. Sila rujuk kitab tafsir yang muktabar seperti Tafsir Al-Qurtubi, Ibnu Kathir, atau Tafsir Pimpinan Ar-Rahwan.`,
      source: 'QuranPulse Offline',
    }
    setCache(cacheKey, entry, this.CACHE_TTL)
    return entry
  }
}

// ═══════════════════════════════════════════════════════════
// Export as singleton
// ═══════════════════════════════════════════════════════════

export const quranService = new QuranService()
