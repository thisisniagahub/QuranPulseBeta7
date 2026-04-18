export interface SurahInfo {
  id: number
  name: string
  nameEn: string
  nameMs: string
  versesCount: number
  revelationType: 'Meccan' | 'Medinan'
  juz: number[]
}

export interface DailyVerse {
  id: number
  surahId: number
  verseNumber: number
  arabic: string
  translationMs: string
  translationEn: string
  reference: string
}

export interface PrayerName {
  id: number
  name: string
  nameMs: string
  nameAr: string
}

export interface HijaiyahLetter {
  id: number
  letter: string
  name: string
  nameEn: string
  audioRef: string
}

export const SURAH_LIST: SurahInfo[] = [
  { id: 1, name: 'الفاتحة', nameEn: 'Al-Fatihah', nameMs: 'Al-Fatihah', versesCount: 7, revelationType: 'Meccan', juz: [1] },
  { id: 2, name: 'البقرة', nameEn: 'Al-Baqarah', nameMs: 'Al-Baqarah', versesCount: 286, revelationType: 'Medinan', juz: [1, 2, 3] },
  { id: 3, name: 'آل عمران', nameEn: 'Ali Imran', nameMs: 'Ali Imran', versesCount: 200, revelationType: 'Medinan', juz: [3, 4] },
  { id: 4, name: 'النساء', nameEn: 'An-Nisa', nameMs: 'An-Nisa', versesCount: 176, revelationType: 'Medinan', juz: [4, 5, 6] },
  { id: 5, name: 'المائدة', nameEn: 'Al-Maidah', nameMs: 'Al-Maidah', versesCount: 120, revelationType: 'Medinan', juz: [6, 7] },
  { id: 6, name: 'الأنعام', nameEn: 'Al-Anam', nameMs: 'Al-Anam', versesCount: 165, revelationType: 'Meccan', juz: [7, 8] },
  { id: 7, name: 'الأعراف', nameEn: 'Al-Araf', nameMs: 'Al-Araf', versesCount: 206, revelationType: 'Meccan', juz: [8, 9] },
  { id: 8, name: 'الأنفال', nameEn: 'Al-Anfal', nameMs: 'Al-Anfal', versesCount: 75, revelationType: 'Medinan', juz: [9, 10] },
  { id: 9, name: 'التوبة', nameEn: 'At-Tawbah', nameMs: 'At-Tawbah', versesCount: 129, revelationType: 'Medinan', juz: [10, 11] },
  { id: 10, name: 'يونس', nameEn: 'Yunus', nameMs: 'Yunus', versesCount: 109, revelationType: 'Meccan', juz: [11] },
  { id: 11, name: 'هود', nameEn: 'Hud', nameMs: 'Hud', versesCount: 123, revelationType: 'Meccan', juz: [11, 12] },
  { id: 12, name: 'يوسف', nameEn: 'Yusuf', nameMs: 'Yusuf', versesCount: 111, revelationType: 'Meccan', juz: [12, 13] },
  { id: 13, name: 'الرعد', nameEn: 'Ar-Rad', nameMs: 'Ar-Rad', versesCount: 43, revelationType: 'Medinan', juz: [13] },
  { id: 14, name: 'ابراهيم', nameEn: 'Ibrahim', nameMs: 'Ibrahim', versesCount: 52, revelationType: 'Meccan', juz: [13] },
  { id: 15, name: 'الحجر', nameEn: 'Al-Hijr', nameMs: 'Al-Hijr', versesCount: 99, revelationType: 'Meccan', juz: [14] },
  { id: 16, name: 'النحل', nameEn: 'An-Nahl', nameMs: 'An-Nahl', versesCount: 128, revelationType: 'Meccan', juz: [14] },
  { id: 17, name: 'الإسراء', nameEn: 'Al-Isra', nameMs: 'Al-Isra', versesCount: 111, revelationType: 'Meccan', juz: [15] },
  { id: 18, name: 'الكهف', nameEn: 'Al-Kahf', nameMs: 'Al-Kahf', versesCount: 110, revelationType: 'Meccan', juz: [15, 16] },
  { id: 19, name: 'مريم', nameEn: 'Maryam', nameMs: 'Maryam', versesCount: 98, revelationType: 'Meccan', juz: [16] },
  { id: 20, name: 'طه', nameEn: 'Taha', nameMs: 'Taha', versesCount: 135, revelationType: 'Meccan', juz: [16] },
  { id: 21, name: 'الأنبياء', nameEn: 'Al-Anbiya', nameMs: 'Al-Anbiya', versesCount: 112, revelationType: 'Meccan', juz: [17] },
  { id: 22, name: 'الحج', nameEn: 'Al-Hajj', nameMs: 'Al-Hajj', versesCount: 78, revelationType: 'Medinan', juz: [17] },
  { id: 23, name: 'المؤمنون', nameEn: 'Al-Muminun', nameMs: 'Al-Muminun', versesCount: 118, revelationType: 'Meccan', juz: [18] },
  { id: 24, name: 'النور', nameEn: 'An-Nur', nameMs: 'An-Nur', versesCount: 64, revelationType: 'Medinan', juz: [18] },
  { id: 25, name: 'الفرقان', nameEn: 'Al-Furqan', nameMs: 'Al-Furqan', versesCount: 77, revelationType: 'Meccan', juz: [18, 19] },
  { id: 26, name: 'الشعراء', nameEn: 'Ash-Shuara', nameMs: 'Ash-Shuara', versesCount: 227, revelationType: 'Meccan', juz: [19] },
  { id: 27, name: 'النمل', nameEn: 'An-Naml', nameMs: 'An-Naml', versesCount: 93, revelationType: 'Meccan', juz: [19, 20] },
  { id: 28, name: 'القصص', nameEn: 'Al-Qasas', nameMs: 'Al-Qasas', versesCount: 88, revelationType: 'Meccan', juz: [20] },
  { id: 29, name: 'العنكبوت', nameEn: 'Al-Ankabut', nameMs: 'Al-Ankabut', versesCount: 69, revelationType: 'Meccan', juz: [20, 21] },
  { id: 30, name: 'الروم', nameEn: 'Ar-Rum', nameMs: 'Ar-Rum', versesCount: 60, revelationType: 'Meccan', juz: [21] },
  { id: 31, name: 'لقمان', nameEn: 'Luqman', nameMs: 'Luqman', versesCount: 34, revelationType: 'Meccan', juz: [21] },
  { id: 32, name: 'السجدة', nameEn: 'As-Sajdah', nameMs: 'As-Sajdah', versesCount: 30, revelationType: 'Meccan', juz: [21] },
  { id: 33, name: 'الأحزاب', nameEn: 'Al-Ahzab', nameMs: 'Al-Ahzab', versesCount: 73, revelationType: 'Medinan', juz: [21, 22] },
  { id: 34, name: 'سبأ', nameEn: 'Saba', nameMs: 'Saba', versesCount: 54, revelationType: 'Meccan', juz: [22] },
  { id: 35, name: 'فاطر', nameEn: 'Fatir', nameMs: 'Fatir', versesCount: 45, revelationType: 'Meccan', juz: [22] },
  { id: 36, name: 'يس', nameEn: 'Ya-Sin', nameMs: 'Ya-Sin', versesCount: 83, revelationType: 'Meccan', juz: [22, 23] },
  { id: 37, name: 'الصافات', nameEn: 'As-Saffat', nameMs: 'As-Saffat', versesCount: 182, revelationType: 'Meccan', juz: [23] },
  { id: 38, name: 'ص', nameEn: 'Sad', nameMs: 'Sad', versesCount: 88, revelationType: 'Meccan', juz: [23] },
  { id: 39, name: 'الزمر', nameEn: 'Az-Zumar', nameMs: 'Az-Zumar', versesCount: 75, revelationType: 'Meccan', juz: [23, 24] },
  { id: 40, name: 'غافر', nameEn: 'Ghafir', nameMs: 'Ghafir', versesCount: 85, revelationType: 'Meccan', juz: [24] },
  { id: 41, name: 'فصلت', nameEn: 'Fussilat', nameMs: 'Fussilat', versesCount: 54, revelationType: 'Meccan', juz: [24, 25] },
  { id: 42, name: 'الشورى', nameEn: 'Ash-Shura', nameMs: 'Ash-Shura', versesCount: 53, revelationType: 'Meccan', juz: [25] },
  { id: 43, name: 'الزخرف', nameEn: 'Az-Zukhruf', nameMs: 'Az-Zukhruf', versesCount: 89, revelationType: 'Meccan', juz: [25] },
  { id: 44, name: 'الدخان', nameEn: 'Ad-Dukhan', nameMs: 'Ad-Dukhan', versesCount: 59, revelationType: 'Meccan', juz: [25] },
  { id: 45, name: 'الجاثية', nameEn: 'Al-Jathiyah', nameMs: 'Al-Jathiyah', versesCount: 37, revelationType: 'Meccan', juz: [25] },
  { id: 46, name: 'الأحقاف', nameEn: 'Al-Ahqaf', nameMs: 'Al-Ahqaf', versesCount: 35, revelationType: 'Meccan', juz: [26] },
  { id: 47, name: 'محمد', nameEn: 'Muhammad', nameMs: 'Muhammad', versesCount: 38, revelationType: 'Medinan', juz: [26] },
  { id: 48, name: 'الفتح', nameEn: 'Al-Fath', nameMs: 'Al-Fath', versesCount: 29, revelationType: 'Medinan', juz: [26] },
  { id: 49, name: 'الحجرات', nameEn: 'Al-Hujurat', nameMs: 'Al-Hujurat', versesCount: 18, revelationType: 'Medinan', juz: [26] },
  { id: 50, name: 'ق', nameEn: 'Qaf', nameMs: 'Qaf', versesCount: 45, revelationType: 'Meccan', juz: [26] },
  { id: 51, name: 'الذاريات', nameEn: 'Adh-Dhariyat', nameMs: 'Adh-Dhariyat', versesCount: 60, revelationType: 'Meccan', juz: [26, 27] },
  { id: 52, name: 'الطور', nameEn: 'At-Tur', nameMs: 'At-Tur', versesCount: 49, revelationType: 'Meccan', juz: [27] },
  { id: 53, name: 'النجم', nameEn: 'An-Najm', nameMs: 'An-Najm', versesCount: 62, revelationType: 'Meccan', juz: [27] },
  { id: 54, name: 'القمر', nameEn: 'Al-Qamar', nameMs: 'Al-Qamar', versesCount: 55, revelationType: 'Meccan', juz: [27] },
  { id: 55, name: 'الرحمن', nameEn: 'Ar-Rahman', nameMs: 'Ar-Rahman', versesCount: 78, revelationType: 'Medinan', juz: [27] },
  { id: 56, name: 'الواقعة', nameEn: 'Al-Waqiah', nameMs: 'Al-Waqiah', versesCount: 96, revelationType: 'Meccan', juz: [27] },
  { id: 57, name: 'الحديد', nameEn: 'Al-Hadid', nameMs: 'Al-Hadid', versesCount: 29, revelationType: 'Medinan', juz: [27] },
  { id: 58, name: 'المجادلة', nameEn: 'Al-Mujadilah', nameMs: 'Al-Mujadilah', versesCount: 22, revelationType: 'Medinan', juz: [28] },
  { id: 59, name: 'الحشر', nameEn: 'Al-Hashr', nameMs: 'Al-Hashr', versesCount: 24, revelationType: 'Medinan', juz: [28] },
  { id: 60, name: 'الممتحنة', nameEn: 'Al-Mumtahanah', nameMs: 'Al-Mumtahanah', versesCount: 13, revelationType: 'Medinan', juz: [28] },
  { id: 61, name: 'الصف', nameEn: 'As-Saff', nameMs: 'As-Saff', versesCount: 14, revelationType: 'Medinan', juz: [28] },
  { id: 62, name: 'الجمعة', nameEn: 'Al-Jumuah', nameMs: 'Al-Jumuah', versesCount: 11, revelationType: 'Medinan', juz: [28] },
  { id: 63, name: 'المنافقون', nameEn: 'Al-Munafiqun', nameMs: 'Al-Munafiqun', versesCount: 11, revelationType: 'Medinan', juz: [28] },
  { id: 64, name: 'التغابن', nameEn: 'At-Taghabun', nameMs: 'At-Taghabun', versesCount: 18, revelationType: 'Medinan', juz: [28] },
  { id: 65, name: 'الطلاق', nameEn: 'At-Talaq', nameMs: 'At-Talaq', versesCount: 12, revelationType: 'Medinan', juz: [28] },
  { id: 66, name: 'التحريم', nameEn: 'At-Tahrim', nameMs: 'At-Tahrim', versesCount: 12, revelationType: 'Medinan', juz: [28] },
  { id: 67, name: 'الملك', nameEn: 'Al-Mulk', nameMs: 'Al-Mulk', versesCount: 30, revelationType: 'Meccan', juz: [29] },
  { id: 68, name: 'القلم', nameEn: 'Al-Qalam', nameMs: 'Al-Qalam', versesCount: 52, revelationType: 'Meccan', juz: [29] },
  { id: 69, name: 'الحاقة', nameEn: 'Al-Haqqah', nameMs: 'Al-Haqqah', versesCount: 52, revelationType: 'Meccan', juz: [29] },
  { id: 70, name: 'المعارج', nameEn: 'Al-Maarij', nameMs: 'Al-Maarij', versesCount: 44, revelationType: 'Meccan', juz: [29] },
  { id: 71, name: 'نوح', nameEn: 'Nuh', nameMs: 'Nuh', versesCount: 28, revelationType: 'Meccan', juz: [29] },
  { id: 72, name: 'الجن', nameEn: 'Al-Jinn', nameMs: 'Al-Jinn', versesCount: 28, revelationType: 'Meccan', juz: [29] },
  { id: 73, name: 'المزمل', nameEn: 'Al-Muzzammil', nameMs: 'Al-Muzzammil', versesCount: 20, revelationType: 'Meccan', juz: [29] },
  { id: 74, name: 'المدثر', nameEn: 'Al-Muddaththir', nameMs: 'Al-Muddaththir', versesCount: 56, revelationType: 'Meccan', juz: [29] },
  { id: 75, name: 'القيامة', nameEn: 'Al-Qiyamah', nameMs: 'Al-Qiyamah', versesCount: 40, revelationType: 'Meccan', juz: [29] },
  { id: 76, name: 'الإنسان', nameEn: 'Al-Insan', nameMs: 'Al-Insan', versesCount: 31, revelationType: 'Medinan', juz: [29] },
  { id: 77, name: 'المرسلات', nameEn: 'Al-Mursalat', nameMs: 'Al-Mursalat', versesCount: 50, revelationType: 'Meccan', juz: [29] },
  { id: 78, name: 'النبأ', nameEn: 'An-Naba', nameMs: 'An-Naba', versesCount: 40, revelationType: 'Meccan', juz: [30] },
  { id: 79, name: 'النازعات', nameEn: 'An-Naziat', nameMs: 'An-Naziat', versesCount: 46, revelationType: 'Meccan', juz: [30] },
  { id: 80, name: 'عبس', nameEn: 'Abasa', nameMs: 'Abasa', versesCount: 42, revelationType: 'Meccan', juz: [30] },
  { id: 81, name: 'التكوير', nameEn: 'At-Takwir', nameMs: 'At-Takwir', versesCount: 29, revelationType: 'Meccan', juz: [30] },
  { id: 82, name: 'الانفطار', nameEn: 'Al-Infitar', nameMs: 'Al-Infitar', versesCount: 19, revelationType: 'Meccan', juz: [30] },
  { id: 83, name: 'المطففين', nameEn: 'Al-Mutaffifin', nameMs: 'Al-Mutaffifin', versesCount: 36, revelationType: 'Meccan', juz: [30] },
  { id: 84, name: 'الانشقاق', nameEn: 'Al-Inshiqaq', nameMs: 'Al-Inshiqaq', versesCount: 25, revelationType: 'Meccan', juz: [30] },
  { id: 85, name: 'البروج', nameEn: 'Al-Buruj', nameMs: 'Al-Buruj', versesCount: 22, revelationType: 'Meccan', juz: [30] },
  { id: 86, name: 'الطارق', nameEn: 'At-Tariq', nameMs: 'At-Tariq', versesCount: 17, revelationType: 'Meccan', juz: [30] },
  { id: 87, name: 'الأعلى', nameEn: 'Al-Ala', nameMs: 'Al-Ala', versesCount: 19, revelationType: 'Meccan', juz: [30] },
  { id: 88, name: 'الغاشية', nameEn: 'Al-Ghashiyah', nameMs: 'Al-Ghashiyah', versesCount: 26, revelationType: 'Meccan', juz: [30] },
  { id: 89, name: 'الفجر', nameEn: 'Al-Fajr', nameMs: 'Al-Fajr', versesCount: 30, revelationType: 'Meccan', juz: [30] },
  { id: 90, name: 'البلد', nameEn: 'Al-Balad', nameMs: 'Al-Balad', versesCount: 20, revelationType: 'Meccan', juz: [30] },
  { id: 91, name: 'الشمس', nameEn: 'Ash-Shams', nameMs: 'Ash-Shams', versesCount: 15, revelationType: 'Meccan', juz: [30] },
  { id: 92, name: 'الليل', nameEn: 'Al-Layl', nameMs: 'Al-Layl', versesCount: 21, revelationType: 'Meccan', juz: [30] },
  { id: 93, name: 'الضحى', nameEn: 'Ad-Duha', nameMs: 'Ad-Duha', versesCount: 11, revelationType: 'Meccan', juz: [30] },
  { id: 94, name: 'الشرح', nameEn: 'Ash-Sharh', nameMs: 'Ash-Sharh', versesCount: 8, revelationType: 'Meccan', juz: [30] },
  { id: 95, name: 'التين', nameEn: 'At-Tin', nameMs: 'At-Tin', versesCount: 8, revelationType: 'Meccan', juz: [30] },
  { id: 96, name: 'العلق', nameEn: 'Al-Alaq', nameMs: 'Al-Alaq', versesCount: 19, revelationType: 'Meccan', juz: [30] },
  { id: 97, name: 'القدر', nameEn: 'Al-Qadr', nameMs: 'Al-Qadr', versesCount: 5, revelationType: 'Meccan', juz: [30] },
  { id: 98, name: 'البينة', nameEn: 'Al-Bayyinah', nameMs: 'Al-Bayyinah', versesCount: 8, revelationType: 'Medinan', juz: [30] },
  { id: 99, name: 'الزلزلة', nameEn: 'Az-Zalzalah', nameMs: 'Az-Zalzalah', versesCount: 8, revelationType: 'Medinan', juz: [30] },
  { id: 100, name: 'العاديات', nameEn: 'Al-Adiyat', nameMs: 'Al-Adiyat', versesCount: 11, revelationType: 'Meccan', juz: [30] },
  { id: 101, name: 'القارعة', nameEn: 'Al-Qariah', nameMs: 'Al-Qariah', versesCount: 11, revelationType: 'Meccan', juz: [30] },
  { id: 102, name: 'التكاثر', nameEn: 'At-Takathur', nameMs: 'At-Takathur', versesCount: 8, revelationType: 'Meccan', juz: [30] },
  { id: 103, name: 'العصر', nameEn: 'Al-Asr', nameMs: 'Al-Asr', versesCount: 3, revelationType: 'Meccan', juz: [30] },
  { id: 104, name: 'الهمزة', nameEn: 'Al-Humazah', nameMs: 'Al-Humazah', versesCount: 9, revelationType: 'Meccan', juz: [30] },
  { id: 105, name: 'الفيل', nameEn: 'Al-Fil', nameMs: 'Al-Fil', versesCount: 5, revelationType: 'Meccan', juz: [30] },
  { id: 106, name: 'قريش', nameEn: 'Quraysh', nameMs: 'Quraysh', versesCount: 4, revelationType: 'Meccan', juz: [30] },
  { id: 107, name: 'الماعون', nameEn: 'Al-Maun', nameMs: 'Al-Maun', versesCount: 7, revelationType: 'Meccan', juz: [30] },
  { id: 108, name: 'الكوثر', nameEn: 'Al-Kawthar', nameMs: 'Al-Kawthar', versesCount: 3, revelationType: 'Meccan', juz: [30] },
  { id: 109, name: 'الكافرون', nameEn: 'Al-Kafirun', nameMs: 'Al-Kafirun', versesCount: 6, revelationType: 'Meccan', juz: [30] },
  { id: 110, name: 'النصر', nameEn: 'An-Nasr', nameMs: 'An-Nasr', versesCount: 3, revelationType: 'Medinan', juz: [30] },
  { id: 111, name: 'المسد', nameEn: 'Al-Masad', nameMs: 'Al-Masad', versesCount: 5, revelationType: 'Meccan', juz: [30] },
  { id: 112, name: 'الإخلاص', nameEn: 'Al-Ikhlas', nameMs: 'Al-Ikhlas', versesCount: 4, revelationType: 'Meccan', juz: [30] },
  { id: 113, name: 'الفلق', nameEn: 'Al-Falaq', nameMs: 'Al-Falaq', versesCount: 5, revelationType: 'Meccan', juz: [30] },
  { id: 114, name: 'الناس', nameEn: 'An-Nas', nameMs: 'An-Nas', versesCount: 6, revelationType: 'Meccan', juz: [30] },
]

export const DAILY_VERSES: DailyVerse[] = [
  { id: 1, surahId: 1, verseNumber: 1, arabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', translationMs: 'Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani.', translationEn: 'In the name of Allah, the Most Gracious, the Most Merciful.', reference: 'Al-Fatihah 1:1' },
  { id: 2, surahId: 2, verseNumber: 255, arabic: 'ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ', translationMs: 'Allah, tiada Tuhan melainkan Dia, Yang Tetap Hidup, Kekal selama-lamanya.', translationEn: 'Allah! There is no god except Him, the Ever-Living, All-Sustaining.', reference: 'Al-Baqarah 2:255' },
  { id: 3, surahId: 2, verseNumber: 286, arabic: 'لَآ يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا', translationMs: 'Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.', translationEn: 'Allah does not burden a soul beyond that it can bear.', reference: 'Al-Baqarah 2:286' },
  { id: 4, surahId: 3, verseNumber: 139, arabic: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ ٱلْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ', translationMs: 'Janganlah kamu beroleh kelemahan dan janganlah kamu berdukacita, padahal kamulah orang-orang yang tertinggi jika kamu orang-orang yang beriman.', translationEn: 'Do not lose heart or grieve, for you will have the upper hand, if you are believers.', reference: 'Ali Imran 3:139' },
  { id: 5, surahId: 13, verseNumber: 28, arabic: 'أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ', translationMs: 'Ketahuilah dengan mengingati Allah, hati menjadi tenteram.', translationEn: 'Verily, in the remembrance of Allah do hearts find rest.', reference: 'Ar-Rad 13:28' },
  { id: 6, surahId: 29, verseNumber: 69, arabic: 'وَٱلَّذِينَ جَـٰهَدُوا۟ فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا', translationMs: 'Dan orang-orang yang berjihad untuk Kami, pasti Kami tunjukkan kepada mereka jalan-jalan Kami.', translationEn: 'As for those who strive in Our cause, We will surely guide them to Our ways.', reference: 'Al-Ankabut 29:69' },
  { id: 7, surahId: 94, verseNumber: 6, arabic: 'إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا', translationMs: 'Sesungguhnya bersama kesulitan ada kemudahan.', translationEn: 'Indeed, with hardship comes ease.', reference: 'Ash-Sharh 94:6' },
  { id: 8, surahId: 2, verseNumber: 152, arabic: 'فَٱذْكُرُونِىٓ أَذْكُرْكُمْ وَٱشْكُرُوا۟ لِى وَلَا تَكْفُرُونِ', translationMs: 'Maka ingatlah kepada-Ku, nescaya Aku ingat kepada kamu; dan bersyukurlah kepada-Ku, dan janganlah kamu kufur.', translationEn: 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.', reference: 'Al-Baqarah 2:152' },
  { id: 9, surahId: 65, verseNumber: 3, arabic: 'وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُ', translationMs: 'Dan barangsiapa yang bertawakal kepada Allah, nescaya Allah akan mencukupkan keperluannya.', translationEn: 'And whoever relies upon Allah - then He is sufficient for him.', reference: 'At-Talaq 65:3' },
  { id: 10, surahId: 39, verseNumber: 53, arabic: 'قُلْ يَـٰعِبَادِىَ ٱلَّذِينَ أَسْرَفُوا۟ عَلَىٰٓ أَنفُسِهِمْ لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ', translationMs: 'Katakanlah wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri, janganlah kamu berputus asa dari rahmat Allah.', translationEn: 'Say, O My servants who have transgressed against themselves, do not despair of the mercy of Allah.', reference: 'Az-Zumar 39:53' },
  { id: 11, surahId: 14, verseNumber: 7, arabic: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ', translationMs: 'Sesungguhnya jika kamu bersyukur, nescaya Aku tambahkan nikmat-Ku kepada kamu.', translationEn: 'If you are grateful, I will surely give you more.', reference: 'Ibrahim 14:7' },
  { id: 12, surahId: 40, verseNumber: 60, arabic: 'ٱدْعُونِىٓ أَسْتَجِبْ لَكُمْ', translationMs: 'Berdoalah kepada-Ku, nescaya Aku perkenankan bagimu.', translationEn: 'Call upon Me, I will respond to you.', reference: 'Ghafir 40:60' },
  { id: 13, surahId: 41, verseNumber: 30, arabic: 'إِنَّ ٱلَّذِينَ قَالُوا۟ رَبُّنَا ٱللَّهُ ثُمَّ ٱسْتَقَـٰمُوا۟', translationMs: 'Sesungguhnya orang-orang yang berkata Tuhan kami Allah kemudian mereka tetap istiqamah.', translationEn: 'Indeed, those who have said, Our Lord is Allah, and then remained on the right course.', reference: 'Fussilat 41:30' },
  { id: 14, surahId: 55, verseNumber: 13, arabic: 'فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ', translationMs: 'Maka nikmat Tuhan kamu yang manakah yang kamu dustakan?', translationEn: 'So which of the favors of your Lord would you deny?', reference: 'Ar-Rahman 55:13' },
  { id: 15, surahId: 56, verseNumber: 95, arabic: 'إِنَّ هَـٰذَا لَهُوَ حَقُّ ٱلْيَقِينِ', translationMs: 'Sesungguhnya ini adalah kebenaran yang yakin.', translationEn: 'Indeed, this is the certain truth.', reference: 'Al-Waqiah 56:95' },
  { id: 16, surahId: 67, verseNumber: 3, arabic: 'ٱلَّذِى خَلَقَ سَبْعَ سَمَـٰوَٲتٍ طِبَاقًا', translationMs: 'Yang telah menciptakan tujuh langit berlapis-lapis.', translationEn: 'Who created seven heavens in layers.', reference: 'Al-Mulk 67:3' },
  { id: 17, surahId: 17, verseNumber: 80, arabic: 'وَقُل رَّبِّ أَدْخِلْنِى مُدْخَلَ صِدْقٍ وَأَخْرِجْنِى مُخْرَجَ صِدْقٍ', translationMs: 'Dan katakanlah wahai Tuhanku, masukkanlah aku dengan kemasukan yang benar dan keluarkanlah aku dengan keluaran yang benar.', translationEn: 'And say, My Lord, cause me to enter a sound entrance and to exit a sound exit.', reference: 'Al-Isra 17:80' },
  { id: 18, surahId: 18, verseNumber: 10, arabic: 'إِذْ أَوَى ٱلْفِتْيَةُ إِلَى ٱلْكَهْفِ فَقَالُوا۟ رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةً', translationMs: 'Ketika pemuda-pemuda itu berlindung dalam gua, lalu mereka berkata Wahai Tuhan kami, berilah kami rahmat dari sisi-Mu.', translationEn: 'When the youths retreated to the cave and said, Our Lord, grant us from Yourself mercy.', reference: 'Al-Kahf 18:10' },
  { id: 19, surahId: 20, verseNumber: 14, arabic: 'إِنَّنِىٓ أَنَا ٱللَّهُ لَآ إِلَـٰهَ إِلَّآ أَنَا۟ فَٱعْبُدْنِى وَأَقِمِ ٱلصَّلَوٰةَ لِذِكْرِىٓ', translationMs: 'Sesungguhnya Aku ini Allah, tiada Tuhan melainkan Aku, maka sembahlah Aku dan dirikanlah solat untuk mengingati Aku.', translationEn: 'Indeed, I am Allah. There is no deity except Me, so worship Me and establish prayer for My remembrance.', reference: 'Taha 20:14' },
  { id: 20, surahId: 33, verseNumber: 35, arabic: 'إِنَّ ٱلْمُسْلِمِينَ وَٱلْمُسْلِمَـٰتِ وَٱلْمُؤْمِنِينَ وَٱلْمُؤْمِنَـٰتِ', translationMs: 'Sesungguhnya orang-orang Islam lelaki dan perempuan, orang-orang beriman lelaki dan perempuan.', translationEn: 'Indeed, the Muslim men and Muslim women, the believing men and believing women.', reference: 'Al-Ahzab 33:35' },
  { id: 21, surahId: 36, verseNumber: 1, arabic: 'يسٓ', translationMs: 'Ya Sin.', translationEn: 'Ya Sin.', reference: 'Ya-Sin 36:1' },
  { id: 22, surahId: 42, verseNumber: 38, arabic: 'وَأَمْرُهُمْ شُورَىٰ بَيْنَهُمْ', translationMs: 'Dan urusan mereka dijalankan secara musyawarah di antara mereka.', translationEn: 'And their affairs are conducted by consultation among themselves.', reference: 'Ash-Shura 42:38' },
  { id: 23, surahId: 49, verseNumber: 13, arabic: 'يَـٰٓأَيُّهَا ٱلنَّاسُ إِنَّا خَلَقْنَـٰكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَـٰكُمْ شُعُوبًا وَقَبَآئِلَ', translationMs: 'Wahai manusia, sesungguhnya Kami menciptakan kamu dari seorang lelaki dan seorang perempuan dan menjadikan kamu berbangsa-bangsa dan bersuku-suku.', translationEn: 'O mankind, indeed We have created you from male and female and made you peoples and tribes.', reference: 'Al-Hujurat 49:13' },
  { id: 24, surahId: 59, verseNumber: 23, arabic: 'هُوَ ٱللَّهُ ٱلَّذِى لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْمَلِكُ ٱلْقُدُّوسُ ٱلسَّلَـٰمُ', translationMs: 'Dialah Allah, tiada Tuhan melainkan Dia, Raja, Yang Maha Suci, Yang Maha Selamat.', translationEn: 'He is Allah, other than whom there is no deity, the Sovereign, the Pure, the Perfection.', reference: 'Al-Hashr 59:23' },
  { id: 25, surahId: 112, verseNumber: 1, arabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', translationMs: 'Katakanlah Dialah Allah Yang Maha Esa.', translationEn: 'Say, He is Allah, the One.', reference: 'Al-Ikhlas 112:1' },
  { id: 26, surahId: 103, verseNumber: 1, arabic: 'وَٱلْعَصْرِ', translationMs: 'Demi masa.', translationEn: 'By time.', reference: 'Al-Asr 103:1' },
  { id: 27, surahId: 93, verseNumber: 3, arabic: 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ', translationMs: 'Tuhanmu tidak meninggalkan kamu dan tidak pula benci.', translationEn: 'Your Lord has not taken leave of you, nor has He detested you.', reference: 'Ad-Duha 93:3' },
  { id: 28, surahId: 108, verseNumber: 1, arabic: 'إِنَّآ أَعْطَيْنَـٰكَ ٱلْكَوْثَرَ', translationMs: 'Sesungguhnya Kami telah memberikan kepadamu Al-Kauthar.', translationEn: 'Indeed, We have granted you Al-Kawthar.', reference: 'Al-Kawthar 108:1' },
  { id: 29, surahId: 2, verseNumber: 216, arabic: 'وَعَسَىٰٓ أَن تَكْرَهُوا۟ شَيْـًٔا وَهُوَ خَيْرٌ لَّكُمْ', translationMs: 'Dan boleh jadi kamu membenci sesuatu padahal ia amat baik bagimu.', translationEn: 'And perhaps you hate a thing and it is good for you.', reference: 'Al-Baqarah 2:216' },
  { id: 30, surahId: 8, verseNumber: 46, arabic: 'وَأَطِيعُوا۟ ٱللَّهَ وَرَسُولَهُۥ وَلَا تَنَـٰزَعُوا۟ فَتَفْشَلُوا۟', translationMs: 'Dan taatlah kepada Allah dan Rasul-Nya dan janganlah kamu berbantah-bantahan, nescaya kamu menjadi lemah.', translationEn: 'And obey Allah and His Messenger, and do not dispute and thus lose courage.', reference: 'Al-Anfal 8:46' },
]

export const PRAYER_NAMES: PrayerName[] = [
  { id: 1, name: 'Fajr', nameMs: 'Subuh', nameAr: 'فجر' },
  { id: 2, name: 'Syuruk', nameMs: 'Syuruk', nameAr: 'شروق' },
  { id: 3, name: 'Dhuhr', nameMs: 'Zohor', nameAr: 'ظهر' },
  { id: 4, name: 'Asr', nameMs: 'Asar', nameAr: 'عصر' },
  { id: 5, name: 'Maghrib', nameMs: 'Maghrib', nameAr: 'مغرب' },
  { id: 6, name: 'Isha', nameMs: 'Isyak', nameAr: 'عشاء' },
]

export const HIJAIYAH_LETTERS: HijaiyahLetter[] = [
  { id: 1, letter: 'ا', name: 'Alif', nameEn: 'Alif', audioRef: 'alif' },
  { id: 2, letter: 'ب', name: 'Ba', nameEn: 'Ba', audioRef: 'ba' },
  { id: 3, letter: 'ت', name: 'Ta', nameEn: 'Ta', audioRef: 'ta' },
  { id: 4, letter: 'ث', name: 'Tsa', nameEn: 'Tha', audioRef: 'tsa' },
  { id: 5, letter: 'ج', name: 'Jim', nameEn: 'Jim', audioRef: 'jim' },
  { id: 6, letter: 'ح', name: 'Ha', nameEn: 'Ha', audioRef: 'ha' },
  { id: 7, letter: 'خ', name: 'Kho', nameEn: 'Kha', audioRef: 'kho' },
  { id: 8, letter: 'د', name: 'Dal', nameEn: 'Dal', audioRef: 'dal' },
  { id: 9, letter: 'ذ', name: 'Dzal', nameEn: 'Dhal', audioRef: 'dzal' },
  { id: 10, letter: 'ر', name: 'Ra', nameEn: 'Ra', audioRef: 'ra' },
  { id: 11, letter: 'ز', name: 'Zai', nameEn: 'Zay', audioRef: 'zai' },
  { id: 12, letter: 'س', name: 'Sin', nameEn: 'Sin', audioRef: 'sin' },
  { id: 13, letter: 'ش', name: 'Syin', nameEn: 'Shin', audioRef: 'syin' },
  { id: 14, letter: 'ص', name: 'Shod', nameEn: 'Sad', audioRef: 'shod' },
  { id: 15, letter: 'ض', name: 'Dhod', nameEn: 'Dad', audioRef: 'dhod' },
  { id: 16, letter: 'ط', name: 'Tho', nameEn: 'Tta', audioRef: 'tho' },
  { id: 17, letter: 'ظ', name: 'Zho', nameEn: 'Dha', audioRef: 'zho' },
  { id: 18, letter: 'ع', name: 'Ain', nameEn: 'Ain', audioRef: 'ain' },
  { id: 19, letter: 'غ', name: 'Ghoin', nameEn: 'Ghayn', audioRef: 'ghoin' },
  { id: 20, letter: 'ف', name: 'Fa', nameEn: 'Fa', audioRef: 'fa' },
  { id: 21, letter: 'ق', name: 'Qof', nameEn: 'Qaf', audioRef: 'qof' },
  { id: 22, letter: 'ك', name: 'Kaf', nameEn: 'Kaf', audioRef: 'kaf' },
  { id: 23, letter: 'ل', name: 'Lam', nameEn: 'Lam', audioRef: 'lam' },
  { id: 24, letter: 'م', name: 'Mim', nameEn: 'Mim', audioRef: 'mim' },
  { id: 25, letter: 'ن', name: 'Nun', nameEn: 'Nun', audioRef: 'nun' },
  { id: 26, letter: 'و', name: 'Wau', nameEn: 'Waw', audioRef: 'wau' },
  { id: 27, letter: 'ه', name: 'Ha', nameEn: 'Ha', audioRef: 'ha2' },
  { id: 28, letter: 'ء', name: 'Hamzah', nameEn: 'Hamzah', audioRef: 'hamzah' },
  { id: 29, letter: 'ي', name: 'Ya', nameEn: 'Ya', audioRef: 'ya' },
]

export function getSurahName(id: number): SurahInfo | undefined {
  return SURAH_LIST.find((s) => s.id === id)
}

export function getDailyVerse(dayOfMonth: number): DailyVerse {
  const index = ((dayOfMonth - 1) % DAILY_VERSES.length)
  return DAILY_VERSES[index]
}

// ─── Prayer Times (KL Zone, hardcoded) ────────────────────
export interface PrayerTimeKL {
  name: string
  nameMs: string
  time: string
  hour: number
  minute: number
  icon: string
  gradient: string
}

export const PRAYER_TIMES_KL: PrayerTimeKL[] = [
  { name: 'Fajr', nameMs: 'Subuh', time: '5:45', hour: 5, minute: 45, icon: '🌅', gradient: 'from-indigo-900/60 to-blue-900/40' },
  { name: 'Syuruk', nameMs: 'Syuruk', time: '7:05', hour: 7, minute: 5, icon: '☀️', gradient: 'from-amber-900/60 to-orange-900/40' },
  { name: 'Dhuhr', nameMs: 'Zohor', time: '1:15', hour: 13, minute: 15, icon: '🌞', gradient: 'from-yellow-900/60 to-amber-900/40' },
  { name: 'Asr', nameMs: 'Asar', time: '4:30', hour: 16, minute: 30, icon: '🌤️', gradient: 'from-orange-900/60 to-red-900/40' },
  { name: 'Maghrib', nameMs: 'Maghrib', time: '7:20', hour: 19, minute: 20, icon: '🌅', gradient: 'from-rose-900/60 to-purple-900/40' },
  { name: 'Isha', nameMs: 'Isyak', time: '8:30', hour: 20, minute: 30, icon: '🌙', gradient: 'from-purple-900/60 to-indigo-900/40' },
]

// ─── Daily Hikmah (Islamic Wisdom) ────────────────────────
export const DAILY_HIKMAH: string[] = [
  '"Ilmu tanpa amal adalah gila, dan amal tanpa ilmu adalah sia-sia." — Imam Al-Ghazali',
  '"Dunia adalah penjara bagi orang mukmin dan syurga bagi orang kafir." — Hadis Riwayat Muslim',
  '"Siapa yang menginginkan dunia, maka ia harus berilmu. Siapa yang menginginkan akhirat, maka ia harus berilmu." — Imam Syafie',
  '"Umatku akan terus berada dalam kebaikan selama mereka saling menasihati." — Hadis',
  '"Orang yang paling bijak ialah orang yang paling banyak mengingati mati." — Hadis Riwayat Ibnu Majah',
  '"Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lain." — Hadis Riwayat Ahmad',
  '"Harta tidak akan berkurang kerana sedekah." — Hadis Riwayat Muslim',
  '"Sesungguhnya Allah itu indah dan mencintai keindahan." — Hadis Riwayat Muslim',
  '"Perbanyakkan mengingati penghancur kelezatan iaitu kematian." — Hadis Riwayat An-Nasai',
  '"Barangsiapa yang menempuh jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan ke syurga." — Hadis Riwayat Muslim',
  '"Tidaklah seorang hamba muslim mendoakan saudaranya tanpa sepengetahuannya, melainkan malaikat akan berkata: Dan bagimu juga seperti itu." — Hadis Riwayat Muslim',
  '"Orang mukmin yang paling sempurna imannya ialah yang paling baik akhlaknya." — Hadis Riwayat Abu Daud',
  '"Sesungguhnya di dalam tubuh ada sepotong daging, jika ia baik maka baiklah seluruh tubuh, dan jika ia rusak maka rusaklah seluruh tubuh. Itulah hati." — Hadis Riwayat Bukhari & Muslim',
  '"Janganlah salah seorang di antara kamu merasa rendah diri, jika ia tidak mampu bersedekah dengan harta, maka bersedekahlah dengan wajah yang ceria." — Hadis Riwayat At-Tirmidzi',
]

// ─── Helper: Get current/next prayer index ────────────────
export function getCurrentPrayerIndex(): number {
  const now = new Date()
  const currentTotal = now.getHours() * 60 + now.getMinutes()

  for (let i = 0; i < PRAYER_TIMES_KL.length; i++) {
    const prayer = PRAYER_TIMES_KL[i]
    const prayerTotal = prayer.hour * 60 + prayer.minute
    if (currentTotal < prayerTotal) {
      return i
    }
  }
  return 0 // After Isyak, next is Subuh (tomorrow)
}

// ─── Helper: Get Islamic greeting based on time ────────────
export function getIslamicGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Assalamualaikum'
  if (hour >= 12 && hour < 15) return 'Selamat tengah hari'
  if (hour >= 15 && hour < 18) return 'Selamat petang'
  if (hour >= 18 && hour < 21) return 'Selamat petang'
  return 'Selamat malam'
}

// ─── Helper: Get daily hikmah ─────────────────────────────
export function getDailyHikmah(): string {
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  )
  return DAILY_HIKMAH[dayOfYear % DAILY_HIKMAH.length]
}

// ─── Helper: Get surah by ID (returns Surah for QuranTab compatibility) ──
export function getSurahById(id: number): Surah | undefined {
  return getSurahAsSurah(id)
}

// ─── Computed Surah list (for QuranTab compatibility) ─────
export const SURAH_COMPAT_LIST: Surah[] = SURAH_LIST.map((s) => ({
  id: s.id,
  nameArabic: s.name,
  nameMalay: s.nameMs,
  nameEnglish: s.nameEn,
  versesCount: s.versesCount,
  revelationType: s.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyyah',
}))

// ─── Sample verses for reading view ───────────────────────
export interface Verse {
  verseNumber: number
  arabic: string
  translation: string
}

export function getSurahVerses(surahId: number): Verse[] {
  // Sample data for a few surahs
  const sampleVerses: Record<number, Verse[]> = {
    1: [
      { verseNumber: 1, arabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', translation: 'Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani.' },
      { verseNumber: 2, arabic: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ', translation: 'Segala puji tertentu bagi Allah, Tuhan yang memelihara dan mentadbirkan sekalian alam.' },
      { verseNumber: 3, arabic: 'ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', translation: 'Yang Maha Pemurah, lagi Maha Mengasihani.' },
      { verseNumber: 4, arabic: 'مَـٰلِكِ يَوْمِ ٱلدِّينِ', translation: 'Yang Menguasai hari pembalasan.' },
      { verseNumber: 5, arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', translation: 'Engkaulah sahaja yang kami sembah, dan kepada Engkaulah sahaja kami meminta pertolongan.' },
      { verseNumber: 6, arabic: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ', translation: 'Tunjukilah kami jalan yang benar.' },
      { verseNumber: 7, arabic: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ', translation: 'Jalan orang-orang yang Engkau telah kurniakan nikmat kepada mereka, bukan jalan orang-orang yang Engkau telah murkai, dan bukan pula jalan orang-orang yang sesat.' },
    ],
    112: [
      { verseNumber: 1, arabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', translation: 'Katakanlah: Dialah Allah, Yang Maha Esa.' },
      { verseNumber: 2, arabic: 'ٱللَّهُ ٱلصَّمَدُ', translation: 'Allah tempat bergantung.' },
      { verseNumber: 3, arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', translation: 'Dia tidak beranak dan tidak pula diperanakkan.' },
      { verseNumber: 4, arabic: 'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ', translation: 'Dan tidak ada sesiapa yang setara dengan-Nya.' },
    ],
    113: [
      { verseNumber: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ', translation: 'Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh.' },
      { verseNumber: 2, arabic: 'مِن شَرِّ مَا خَلَقَ', translation: 'Dari kejahatan apa yang Dia ciptakan.' },
      { verseNumber: 3, arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', translation: 'Dan dari kejahatan malam apabila ia gelap gelita.' },
      { verseNumber: 4, arabic: 'وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلْعُقَدِ', translation: 'Dan dari kejahatan perempuan-perempuan penyihir yang menghembus pada buhul-buhul.' },
      { verseNumber: 5, arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', translation: 'Dan dari kejahatan orang yang dengki apabila ia dengki.' },
    ],
    114: [
      { verseNumber: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ', translation: 'Katakanlah: Aku berlindung kepada Tuhan manusia.' },
      { verseNumber: 2, arabic: 'مَلِكِ ٱلنَّاسِ', translation: 'Raja manusia.' },
      { verseNumber: 3, arabic: 'إِلَـٰهِ ٱلنَّاسِ', translation: 'Sembahan manusia.' },
      { verseNumber: 4, arabic: 'مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ', translation: 'Dari kejahatan bisikan syaitan yang mengundur diri.' },
      { verseNumber: 5, arabic: 'ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ', translation: 'Yang membisikkan ke dalam dada manusia.' },
      { verseNumber: 6, arabic: 'مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ', translation: 'Dari golongan jin dan manusia.' },
    ],
  }
  return sampleVerses[surahId] || []
}

// ─── Surah type with nameMalay for QuranTab compatibility ─
export interface Surah {
  id: number
  nameArabic: string
  nameMalay: string
  nameEnglish: string
  versesCount: number
  revelationType: 'Makkiyah' | 'Madaniyyah'
}

export function getSurahAsSurah(id: number): Surah | undefined {
  const info = SURAH_LIST.find((s) => s.id === id)
  if (!info) return undefined
  return {
    id: info.id,
    nameArabic: info.name,
    nameMalay: info.nameMs,
    nameEnglish: info.nameEn,
    versesCount: info.versesCount,
    revelationType: info.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyyah',
  }
}
