import { Clock, Compass, CircleDot, Calendar, BookOpen, Moon, Sunrise, Sunset, MoonStar } from 'lucide-react'
import type { PrayerTimes, JakimZone, KhutbahEntry, IslamicCalendarEntry, HijriDate } from '@/lib/jakim-service'

export type IbadahView = 'prayer' | 'qibla' | 'tasbih' | 'kalendar' | 'hadith' | 'khutbah'

export const SUB_TABS: { key: IbadahView; label: string; icon: React.ReactNode }[] = [
  { key: 'prayer', label: 'Solat', icon: <Clock className="h-3.5 w-3.5" /> },
  { key: 'qibla', label: 'Kiblat', icon: <Compass className="h-3.5 w-3.5" /> },
  { key: 'tasbih', label: 'Tasbih', icon: <CircleDot className="h-3.5 w-3.5" /> },
  { key: 'kalendar', label: 'Kalendar', icon: <Calendar className="h-3.5 w-3.5" /> },
  { key: 'hadith', label: 'Hadis', icon: <BookOpen className="h-3.5 w-3.5" /> },
  { key: 'khutbah', label: 'Khutbah', icon: <Moon className="h-3.5 w-3.5" /> },
]

// Re-export types from jakim-service for convenience
export type { PrayerTimes, JakimZone, KhutbahEntry, IslamicCalendarEntry, HijriDate }

// ─── Hadith Data (30+ authentic hadiths in Malay) ──────────
export const HADITH_COLLECTION = [
  { id: 1, text: 'Sesungguhnya amalan itu bergantung kepada niatnya, dan sesungguhnya bagi setiap orang apa yang diniatkannya.', source: 'Riwayat Bukhari & Muslim', narrator: 'Umar bin Al-Khattab' },
  { id: 2, text: 'Tidaklah seseorang di antara kamu beriman sehingga dia mencintai saudaranya sebagaimana dia mencintai dirinya sendiri.', source: 'Riwayat Bukhari & Muslim', narrator: 'Anas bin Malik' },
  { id: 3, text: 'Barangsiapa yang beriman kepada Allah dan hari akhirat, maka hendaklah ia berkata yang baik atau diam.', source: 'Riwayat Bukhari & Muslim', narrator: 'Abu Hurairah' },
  { id: 4, text: 'Senyummu kepada saudaramu adalah sedekah.', source: 'Riwayat At-Tirmidzi', narrator: 'Abu Dzar' },
  { id: 5, text: 'Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lain.', source: 'Riwayat Ahmad, Ad-Daruqutni', narrator: 'Jabir bin Abdullah' },
  { id: 6, text: 'Allah tidak menghendaki kesulitan bagi kamu, tetapi Dia menghendaki kemudahan bagimu.', source: 'Riwayat Bukhari & Muslim', narrator: 'Aisyah' },
  { id: 7, text: 'Orang mukmin yang paling sempurna imannya ialah yang paling baik akhlaknya.', source: 'Riwayat Abu Daud & At-Tirmidzi', narrator: 'Abu Hurairah' },
  { id: 8, text: 'Harta tidak akan berkurang kerana sedekah.', source: 'Riwayat Muslim', narrator: 'Abu Hurairah' },
  { id: 9, text: 'Sesungguhnya Allah itu indah dan mencintai keindahan.', source: 'Riwayat Muslim', narrator: 'Abdullah bin Masud' },
  { id: 10, text: 'Janganlah salah seorang di antara kamu merasa rendah diri, jika ia tidak mampu bersedekah dengan harta, maka bersedekahlah dengan wajah yang ceria.', source: 'Riwayat At-Tirmidzi', narrator: 'Abu Dzar' },
  { id: 11, text: 'Barangsiapa yang menempuh jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan ke syurga.', source: 'Riwayat Muslim', narrator: 'Abu Hurairah' },
  { id: 12, text: 'Perbanyakkan mengingati penghancur kelezatan iaitu kematian.', source: 'Riwayat An-Nasai & At-Tirmidzi', narrator: 'Abu Hurairah' },
  { id: 13, text: 'Umatku akan terus berada dalam kebaikan selama mereka saling menasihati.', source: 'Riwayat Ahmad', narrator: 'Abu Hurairah' },
  { id: 14, text: 'Sesungguhnya di dalam tubuh ada sepotong daging, jika ia baik maka baiklah seluruh tubuh, dan jika ia rusak maka rusaklah seluruh tubuh. Itulah hati.', source: 'Riwayat Bukhari & Muslim', narrator: 'Nu\'man bin Basyir' },
  { id: 15, text: 'Tidaklah seorang hamba muslim mendoakan saudaranya tanpa sepengetahuannya, melainkan malaikat akan berkata: Dan bagimu juga seperti itu.', source: 'Riwayat Muslim', narrator: 'Abu Darda' },
  { id: 16, text: 'Dunia adalah penjara bagi orang mukmin dan syurga bagi orang kafir.', source: 'Riwayat Muslim', narrator: 'Abu Hurairah' },
  { id: 17, text: 'Sesiapa yang menutupi aib saudaranya sesama Muslim, Allah akan menutupi aibnya pada hari kiamat.', source: 'Riwayat Muslim', narrator: 'Abu Hurairah' },
  { id: 18, text: 'Orang yang paling bijak ialah orang yang paling banyak mengingati mati.', source: 'Riwayat Ibnu Majah', narrator: 'Abu Hurairah' },
  { id: 19, text: 'Sesungguhnya Allah mewajibkan ihsan dalam segala sesuatu.', source: 'Riwayat Muslim', narrator: 'Syaddad bin Aus' },
  { id: 20, text: 'Janganlah kamu marah. Janganlah kamu marah.', source: 'Riwayat Bukhari', narrator: 'Abu Hurairah' },
  { id: 21, text: 'Siapa yang menjamin kepadaku apa yang ada di antara dua rahangnya dan apa yang ada di antara dua kakinya, aku menjamin syurga baginya.', source: 'Riwayat Bukhari & Muslim', narrator: 'Sahl bin Sa\'ad' },
  { id: 22, text: 'Dua nikmat yang kebanyakan manusia tertipu padanya: nikmat sihat dan nikmat waktu lapang.', source: 'Riwayat Bukhari', narrator: 'Ibnu Abbas' },
  { id: 23, text: 'Sesungguhnya Allah mencintai apabila seseorang di antara kamu melakukan sesuatu pekerjaan, ia melakukannya dengan ihsan (sebaik-baiknya).', source: 'Riwayat Al-Baihaqi', narrator: 'Aisyah' },
  { id: 24, text: 'Tunduklah kamu kepada Allah yang telah memberi nikmat kepadamu, nescaya Dia akan menambah nikmat-Nya kepadamu.', source: 'Riwayat Abu Nu\'aim', narrator: 'Abu Zar\'ah' },
  { id: 25, text: 'Apabila anak Adam mati, terputuslah amalannya kecuali tiga: sedekah jariah, ilmu yang bermanfaat, dan anak soleh yang mendoakannya.', source: 'Riwayat Muslim', narrator: 'Abu Hurairah' },
  { id: 26, text: 'Sesungguhnya Allah tidak melihat kepada rupa dan harta kamu, tetapi Dia melihat kepada hati dan amalan kamu.', source: 'Riwayat Muslim', narrator: 'Abu Hurairah' },
  { id: 27, text: 'Sesungguhnya syurga itu dikelilingi oleh perkara-perkara yang dibenci, dan neraka itu dikelilingi oleh syahwat.', source: 'Riwayat Bukhari & Muslim', narrator: 'Abu Hurairah' },
  { id: 28, text: 'Sebaik-baik rumah adalah rumah yang di dalamnya ada anak yatim yang diperlakukan dengan baik.', source: 'Riwayat Ibnu Majah', narrator: 'Abu Hurairah' },
  { id: 29, text: 'Barangsiapa yang meyakini bahawa Allah itu Maha Mendengar dan Maha Melihat, maka ia akan menjaga lisannya.', source: 'Riwayat At-Thabrani', narrator: 'Abu Umamah' },
  { id: 30, text: 'Orang yang kuat bukanlah orang yang pandai bergusti, tetapi orang yang kuat ialah orang yang mampu menahan diri ketika marah.', source: 'Riwayat Bukhari & Muslim', narrator: 'Abu Hurairah' },
  { id: 31, text: 'Sesungguhnya Allah menulis ihsan terhadap segala sesuatu. Maka apabila kamu membunuh, bunuhlah dengan ihsan, dan apabila kamu menyembelih, sembelihlah dengan ihsan.', source: 'Riwayat Muslim', narrator: 'Syaddad bin Aus' },
  { id: 32, text: 'Sesiapa yang membaca satu huruf dari Al-Quran, maka baginya satu kebaikan, dan satu kebaikan dilipatgandakan menjadi sepuluh kali ganda.', source: 'Riwayat At-Tirmidzi', narrator: 'Ibnu Mas\'ud' },
  { id: 33, text: 'Solat yang paling utama setelah solat fardu ialah solat tahajjud pada waktu malam.', source: 'Riwayat Muslim', narrator: 'Abu Hurairah' },
  { id: 34, text: 'Cintailah untuk manusia apa yang kamu cintai untuk dirimu sendiri, maka kamu menjadi seorang mukmin yang sejati.', source: 'Riwayat Ibnu Majah', narrator: 'Anas bin Malik' },
  { id: 35, text: 'Janganlah seseorang di antara kamu minum sambil berdiri. Barangsiapa lupa, maka hendaklah ia memuntahkannya.', source: 'Riwayat Muslim', narrator: 'Abu Hurairah' },
]

// ─── Dhikr Categories ──────────────────────────────────────
export interface DhikrItem {
  arabic: string
  malay: string
  meaning: string
  target: number
}

export interface DhikrCategory {
  id: string
  name: string
  icon: React.ReactNode
  items: DhikrItem[]
}

export const DHIKR_CATEGORIES: DhikrCategory[] = [
  {
    id: 'morning',
    name: 'Azkar Pagi',
    icon: <Sunrise className="h-4 w-4" />,
    items: [
      { arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ', malay: 'Ashbahnaa wa ashbahal mulku lillaah', meaning: 'Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah', target: 1 },
      { arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا', malay: 'Allaahumma bika ashbahnaa', meaning: 'Ya Allah, dengan rahmat-Mu kami memasuki waktu pagi', target: 1 },
      { arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ', malay: 'Subhanallahi wa bihamdihi', meaning: 'Maha Suci Allah dan segala puji bagi-Nya', target: 100 },
    ]
  },
  {
    id: 'evening',
    name: 'Azkar Petang',
    icon: <Sunset className="h-4 w-4" />,
    items: [
      { arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ', malay: 'Amsainaa wa amsal mulku lillaah', meaning: 'Kami telah memasuki waktu petang dan kerajaan hanya milik Allah', target: 1 },
      { arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا', malay: 'Allaahumme bika amsainaa', meaning: 'Ya Allah, dengan rahmat-Mu kami memasuki waktu petang', target: 1 },
      { arabic: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', malay: "A'udzu bikalimaatillaahit taammaati min syarri maa khalaq", meaning: 'Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk-Nya', target: 3 },
    ]
  },
  {
    id: 'after-prayer',
    name: 'Selepas Solat',
    icon: <MoonStar className="h-4 w-4" />,
    items: [
      { arabic: 'أَسْتَغْفِرُ اللهَ', malay: 'Astaghfirullah', meaning: 'Aku memohon ampun kepada Allah', target: 3 },
      { arabic: 'سُبْحَانَ اللهِ', malay: 'Subhanallah', meaning: 'Maha Suci Allah', target: 33 },
      { arabic: 'الْحَمْدُ لِلَّهِ', malay: 'Alhamdulillah', meaning: 'Segala puji bagi Allah', target: 33 },
      { arabic: 'اللهُ أَكْبَرُ', malay: 'Allahu Akbar', meaning: 'Allah Maha Besar', target: 33 },
      { arabic: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ', malay: 'Laa ilaaha illallahu wahdahu laa syarikalah', meaning: 'Tiada Tuhan melainkan Allah Yang Maha Esa, tiada sekutu bagi-Nya', target: 1 },
    ]
  },
  {
    id: 'general',
    name: 'Umum',
    icon: <CircleDot className="h-4 w-4" />,
    items: [
      { arabic: 'سُبْحَانَ اللهِ', malay: 'Subhanallah', meaning: 'Maha Suci Allah', target: 33 },
      { arabic: 'الْحَمْدُ لِلَّهِ', malay: 'Alhamdulillah', meaning: 'Segala puji bagi Allah', target: 33 },
      { arabic: 'اللهُ أَكْبَرُ', malay: 'Allahu Akbar', meaning: 'Allah Maha Besar', target: 33 },
      { arabic: 'لَا إِلَهَ إِلَّا اللهُ', malay: 'La ilaha illallah', meaning: 'Tiada Tuhan melainkan Allah', target: 100 },
      { arabic: 'أَسْتَغْفِرُ اللهَ', malay: 'Astaghfirullah', meaning: 'Aku memohon ampun kepada Allah', target: 100 },
    ]
  },
]
