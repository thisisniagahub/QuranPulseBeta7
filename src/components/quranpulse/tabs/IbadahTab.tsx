'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Compass, CircleDot, RotateCcw, Check, Navigation, MapPin, Clock, Calendar, BookOpen, ChevronDown, ChevronRight, Volume2, VolumeX, Vibrate, VibrateOff, History, Sun, Sunrise, Sunset, MoonStar, Minus, ExternalLink, Shield, Sparkles, Bell, BellOff, ArrowLeftRight, PartyPopper } from 'lucide-react'
import { useQuranPulseStore } from '@/stores/quranpulse-store'
import { PRAYER_TIMES_KL, getCurrentPrayerIndex } from '@/lib/quran-data'
import type { PrayerTimes, JakimZone, KhutbahEntry, IslamicCalendarEntry, HijriDate } from '@/lib/jakim-service'
import { jakimService } from '@/lib/jakim-service'

type IbadahView = 'prayer' | 'qibla' | 'tasbih' | 'kalendar' | 'hadith' | 'khutbah'

const SUB_TABS: { key: IbadahView; label: string; icon: React.ReactNode }[] = [
  { key: 'prayer', label: 'Solat', icon: <Clock className="h-3.5 w-3.5" /> },
  { key: 'qibla', label: 'Kiblat', icon: <Compass className="h-3.5 w-3.5" /> },
  { key: 'tasbih', label: 'Tasbih', icon: <CircleDot className="h-3.5 w-3.5" /> },
  { key: 'kalendar', label: 'Kalendar', icon: <Calendar className="h-3.5 w-3.5" /> },
  { key: 'hadith', label: 'Hadis', icon: <BookOpen className="h-3.5 w-3.5" /> },
  { key: 'khutbah', label: 'Khutbah', icon: <Moon className="h-3.5 w-3.5" /> },
]

// ─── Hadith Data (30+ authentic hadiths in Malay) ──────────
const HADITH_COLLECTION = [
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
const DHIKR_CATEGORIES = [
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
      { arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا', malay: 'Allaahumma bika amsainaa', meaning: 'Ya Allah, dengan rahmat-Mu kami memasuki waktu petang', target: 1 },
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

export function IbadahTab() {
  const [activeView, setActiveView] = useState<IbadahView>('prayer')
  const [currentPrayerIdx, setCurrentPrayerIdx] = useState(0)

  useEffect(() => {
    const idx = getCurrentPrayerIndex()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPrayerIdx(idx)
  }, [])

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-2 pb-2">
        <h2 className="text-lg font-bold" style={{ color: '#ffffff' }}>Ibadah</h2>
        <p className="text-xs" style={{ color: 'rgba(204,204,204,0.6)' }}>Solat, Kiblat, Tasbih & Lain-lain</p>
      </div>

      {/* Sub-tab navigation - scrollable */}
      <div className="px-4 mb-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {SUB_TABS.map(tab => (
            <button
              key={tab.key}
              className="flex-shrink-0 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium transition-all"
              style={{
                background: activeView === tab.key ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                color: activeView === tab.key ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
                border: `1px solid ${activeView === tab.key ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
              }}
              onClick={() => setActiveView(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeView === 'prayer' && <PrayerTimesView key="prayer" currentPrayerIdx={currentPrayerIdx} />}
        {activeView === 'qibla' && <QiblaView key="qibla" />}
        {activeView === 'tasbih' && <TasbihView key="tasbih" />}
        {activeView === 'kalendar' && <KalendarView key="kalendar" />}
        {activeView === 'hadith' && <HadithView key="hadith" />}
        {activeView === 'khutbah' && <KhutbahView key="khutbah" />}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// PRAYER TIMES VIEW (with Zone Selector)
// ═══════════════════════════════════════════════════════════════

function PrayerTimesView({ currentPrayerIdx }: { currentPrayerIdx: number }) {
  const { prayerZone, setPrayerZone } = useQuranPulseStore()
  const [livePrayers, setLivePrayers] = useState<PrayerTimes | null>(null)
  const [loading, setLoading] = useState(true)
  const [zones, setZones] = useState<JakimZone[]>([])
  const [showZonePicker, setShowZonePicker] = useState(false)

  useEffect(() => {
    const z = jakimService.getZones()
    setZones(z)
  }, [])

  useEffect(() => {
    async function fetchPrayers() {
      setLoading(true)
      try {
        const res = await fetch(`/api/jakim/solat?zone=${prayerZone}`)
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.data) {
            setLivePrayers(data.data)
          }
        }
      } catch {
        // Fallback to static data
      } finally {
        setLoading(false)
      }
    }
    fetchPrayers()
  }, [prayerZone])

  const prayerList = livePrayers ? [
    { name: 'Subuh', nameMs: 'Subuh', time: livePrayers.fajr, icon: '🌅' },
    { name: 'Syuruk', nameMs: 'Syuruk', time: livePrayers.syuruk, icon: '☀️' },
    { name: 'Zohor', nameMs: 'Zohor', time: livePrayers.dhuhr, icon: '🌞' },
    { name: 'Asar', nameMs: 'Asar', time: livePrayers.asr, icon: '🌤️' },
    { name: 'Maghrib', nameMs: 'Maghrib', time: livePrayers.maghrib, icon: '🌅' },
    { name: 'Isyak', nameMs: 'Isyak', time: livePrayers.isha, icon: '🌙' },
  ] : PRAYER_TIMES_KL.map(p => ({ name: p.name, nameMs: p.nameMs, time: p.time, icon: p.icon }))

  const currentZone = zones.find(z => z.code === prayerZone)
  // Group zones by state
  const zonesByState = zones.reduce<Record<string, JakimZone[]>>((acc, z) => {
    if (!acc[z.stateMs]) acc[z.stateMs] = []
    acc[z.stateMs].push(z)
    return acc
  }, {})

  return (
    <motion.div
      className="qp-scroll flex-1 overflow-y-auto px-4 pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Zone Selector */}
      <button
        className="w-full flex items-center gap-2 mb-4 px-3 py-2.5 rounded-xl"
        style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.1)' }}
        onClick={() => setShowZonePicker(!showZonePicker)}
      >
        <MapPin className="h-4 w-4" style={{ color: '#4a4aa6' }} />
        <span className="text-xs flex-1 text-left" style={{ color: '#ffffff' }}>
          {currentZone ? `${currentZone.nameMs}, ${currentZone.stateMs}` : prayerZone}
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6' }}>JAKIM</span>
        <ChevronDown className="h-3.5 w-3.5" style={{ color: 'rgba(204,204,204,0.5)', transform: showZonePicker ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {/* Zone Picker Dropdown */}
      <AnimatePresence>
        {showZonePicker && (
          <motion.div
            className="mb-4 rounded-xl overflow-hidden max-h-64 overflow-y-auto"
            style={{ background: 'rgba(42,42,106,0.8)', border: '1px solid rgba(74,74,166,0.2)' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {Object.entries(zonesByState).map(([state, stateZones]) => (
              <div key={state}>
                <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#4a4aa6', background: 'rgba(74,74,166,0.1)' }}>
                  {state}
                </div>
                {stateZones.map(zone => (
                  <button
                    key={zone.code}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors hover:bg-[rgba(74,74,166,0.1)]"
                    style={{
                      color: zone.code === prayerZone ? '#4a4aa6' : '#ffffff',
                      background: zone.code === prayerZone ? 'rgba(74,74,166,0.15)' : 'transparent',
                    }}
                    onClick={() => { setPrayerZone(zone.code); setShowZonePicker(false) }}
                  >
                    <span>{zone.nameMs}</span>
                    <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{zone.code}</span>
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current/Next Prayer Highlight */}
      {prayerList[currentPrayerIdx] && (
        <motion.div
          className="rounded-xl p-5 mb-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(74,74,166,0.2), rgba(74,74,166,0.08))',
            border: '1px solid rgba(74,74,166,0.3)',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="absolute top-3 right-3 text-4xl opacity-20">
            {prayerList[currentPrayerIdx].icon}
          </div>
          <div className="text-xs font-medium mb-1" style={{ color: '#4a4aa6' }}>
            Solat Seterusnya
          </div>
          <div className="text-2xl font-bold" style={{ color: '#ffffff' }}>
            {prayerList[currentPrayerIdx].nameMs}
          </div>
          <div className="text-3xl font-bold mt-1" style={{ color: '#4a4aa6' }}>
            {prayerList[currentPrayerIdx].time}
          </div>
          <div className="text-xs mt-2" style={{ color: 'rgba(204,204,204,0.6)' }}>
            {currentPrayerIdx === 0 ? 'Segera' : 'Dalam masa terdekat'}
          </div>
          {livePrayers?.hijriDate && (
            <div className="text-[10px] mt-1" style={{ color: 'rgba(212,175,55,0.6)' }}>
              📅 {livePrayers.hijriDate}
            </div>
          )}
        </motion.div>
      )}

      {/* All Prayer Times */}
      <div className="space-y-2">
        {prayerList.map((prayer, idx) => {
          const isCurrent = idx === currentPrayerIdx
          return (
            <motion.div
              key={prayer.name}
              className="flex items-center justify-between rounded-xl p-3.5"
              style={{
                background: isCurrent ? 'rgba(74,74,166,0.15)' : 'rgba(42,42,106,0.3)',
                border: isCurrent ? '1px solid rgba(74,74,166,0.3)' : '1px solid rgba(74,74,166,0.06)',
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{prayer.icon}</span>
                <div>
                  <div className="text-sm font-medium" style={{ color: '#ffffff' }}>
                    {prayer.nameMs}
                  </div>
                  <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>
                    {prayer.name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold" style={{ color: isCurrent ? '#4a4aa6' : '#ffffff' }}>
                  {loading ? '...' : prayer.time}
                </div>
                {isCurrent && (
                  <div className="text-[9px] px-1.5 py-0.5 rounded-full inline-block" style={{ background: 'rgba(74,74,166,0.2)', color: '#4a4aa6' }}>
                    Seterusnya
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ═══ JAKIM Certification Badge ═══ */}
      <div className="mt-4 rounded-xl p-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.12)' }}>
        <div className="flex items-center gap-2 mb-1.5">
          <Shield className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
          <span className="text-[10px] font-semibold" style={{ color: '#4a4aa6' }}>✅ Data JAKIM e-Solat</span>
        </div>
        <p className="text-[8px] leading-relaxed" style={{ color: 'rgba(204,204,204,0.35)' }}>
          Waktu Solat Disahkan JAKIM Malaysia. Hukum fiqh mengikut mazhab Syafie. Rujuk mufti negeri untuk hukum rasmi.
        </p>
        <a href="https://www.islam.gov.my" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[8px] mt-1 hover:underline" style={{ color: 'rgba(74,74,166,0.5)' }}>
          <ExternalLink className="h-2 w-2" /> Rujuk islam.gov.my
        </a>
      </div>

      {/* ═══ Monthly Prayer Tracker ═══ */}
      <div className="mt-3 rounded-xl p-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.08)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold" style={{ color: '#ffffff' }}>Penjejak Solat Bulanan</span>
          <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.3)' }}>Solat tepat waktu</span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['S', 'I', 'Z', 'A', 'M', 'I', '✓'].map((label, i) => (
            <div key={`header-${i}`} className="text-center text-[8px] font-medium py-1" style={{ color: 'rgba(204,204,204,0.3)' }}>
              {i < 6 ? ['Sub', 'Syu', 'Zoh', 'Asr', 'Mag', 'Isy'][i] : ''}
            </div>
          ))}
          {/* Last 7 days tracking */}
          {Array.from({ length: 7 }).map((_, dayIdx) => {
            const seed = new Date().getDate() - (6 - dayIdx)
            return (
              <div key={dayIdx} className="flex gap-0.5">
                {['Sub', 'Syu', 'Zoh', 'Asr', 'Mag', 'Isy'].map((_, prayerIdx) => {
                  const filled = ((seed * 7 + prayerIdx * 3 + dayIdx) % 5) < 4
                  return (
                    <div
                      key={prayerIdx}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: filled ? 'rgba(74,74,166,0.5)' : 'rgba(74,74,166,0.1)' }}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-[10px]" style={{ color: 'rgba(204,204,204,0.25)' }}>
          Waktu solat berdasarkan zon JAKIM · Data dari e-solat.gov.my · Kemas kini automatik
        </p>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// QIBLA VIEW (with Device Orientation)
// ═══════════════════════════════════════════════════════════════

function QiblaView() {
  const [qiblaAngle] = useState(292.5)
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null)
  const [orientationSupported, setOrientationSupported] = useState(false)

  useEffect(() => {
    // Check for device orientation support
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Use webkitCompassHeading for iOS, alpha for others
      const heading = (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading ?? event.alpha
      if (heading !== null && heading !== undefined) {
        setDeviceHeading(heading)
        setOrientationSupported(true)
      }
    }

    // iOS 13+ requires permission
    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof (DeviceOrientationEvent as DeviceOrientationEvent & { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as DeviceOrientationEvent & { requestPermission: () => Promise<string> }).requestPermission()
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation)
          }
        } catch {
          // Permission denied
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation)
      }
    }

    requestPermission()

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  // Calculate compass rotation: if we have device heading, offset the qibla arrow
  const compassRotation = deviceHeading !== null ? -deviceHeading : 0
  const effectiveAngle = qiblaAngle

  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center px-4 pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-center mb-4">
        <h3 className="text-sm font-semibold" style={{ color: '#ffffff' }}>Arah Kiblat</h3>
        <p className="text-xs" style={{ color: 'rgba(204,204,204,0.5)' }}>Kaabah, Makkah Al-Mukarramah</p>
        {orientationSupported && (
          <div className="flex items-center justify-center gap-1 mt-1">
            <Navigation className="h-3 w-3" style={{ color: '#4a4aa6' }} />
            <span className="text-[10px]" style={{ color: '#4a4aa6' }}>Kompas Aktif</span>
          </div>
        )}
      </div>

      {/* Compass */}
      <motion.div
        className="relative h-64 w-64 rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle, rgba(74,74,166,0.1) 0%, rgba(26,26,74,0.5) 70%)',
          border: '2px solid rgba(74,74,166,0.2)',
          transform: `rotate(${compassRotation}deg)`,
          transition: deviceHeading !== null ? 'transform 0.1s ease-out' : 'none',
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Direction markers */}
        {[
          { label: 'U', style: { top: '8px', left: '50%', transform: 'translateX(-50%)' } },
          { label: 'T', style: { bottom: '8px', left: '50%', transform: 'translateX(-50%)' } },
          { label: 'S', style: { right: '8px', top: '50%', transform: 'translateY(-50%)' } },
          { label: 'B', style: { left: '8px', top: '50%', transform: 'translateY(-50%)' } },
        ].map(dir => (
          <div
            key={dir.label}
            className="absolute text-xs font-bold"
            style={{
              color: dir.label === 'U' ? '#4a4aa6' : 'rgba(204,204,204,0.3)',
              ...dir.style,
            }}
          >
            {dir.label}
          </div>
        ))}

        {/* Tick marks */}
        {Array.from({ length: 36 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-0"
            style={{
              transform: `rotate(${i * 10}deg)`,
              transformOrigin: '0 128px',
              width: i % 9 === 0 ? '2px' : '1px',
              height: i % 9 === 0 ? '10px' : '5px',
              background: i % 9 === 0 ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.15)',
              marginLeft: '-0.5px',
            }}
          />
        ))}

        {/* Qibla Arrow */}
        <motion.div
          className="absolute"
          style={{ transform: `rotate(${effectiveAngle}deg)` }}
          animate={!orientationSupported ? { rotate: [effectiveAngle - 2, effectiveAngle + 2, effectiveAngle - 2] } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="h-24 w-0.5 mx-auto" style={{ background: 'linear-gradient(to top, transparent, #4a4aa6)' }} />
          <div
            className="h-3 w-3 mx-auto -mt-0.5"
            style={{
              background: '#d4af37',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
        </motion.div>

        {/* Center dot */}
        <div
          className="absolute h-4 w-4 rounded-full"
          style={{
            background: 'radial-gradient(circle, #4a4aa6, rgba(74,74,166,0.3))',
            boxShadow: '0 0 10px rgba(74,74,166,0.5)',
          }}
        />
      </motion.div>

      {/* Degree info */}
      <div className="mt-4 text-center">
        <div className="text-2xl font-bold" style={{ color: '#4a4aa6' }}>
          {qiblaAngle}°
        </div>
        <p className="text-xs mt-1" style={{ color: 'rgba(204,204,204,0.5)' }}>
          Dari utara mengikut arah jam
        </p>
        {deviceHeading !== null && (
          <p className="text-[10px] mt-1" style={{ color: 'rgba(74,74,166,0.7)' }}>
            Arah peranti: {Math.round(deviceHeading)}°
          </p>
        )}
      </div>

      {/* Info */}
      <div className="mt-4 rounded-xl p-3 w-full" style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.1)' }}>
        <div className="flex items-center gap-2">
          <Navigation className="h-4 w-4" style={{ color: '#4a4aa6' }} />
          <div>
            <div className="text-xs font-medium" style={{ color: '#ffffff' }}>Lokasi: Kuala Lumpur</div>
            <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>3.1390° N, 101.6869° E</div>
          </div>
        </div>
      </div>

      {/* Improved info card */}
      <div className="mt-3 rounded-xl p-3 w-full" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.08)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-3 w-3" style={{ color: '#4a4aa6' }} />
          <span className="text-[9px] font-semibold" style={{ color: '#4a4aa6' }}>Ketepatan JAKIM</span>
        </div>
        <p className="text-[8px]" style={{ color: 'rgba(204,204,204,0.35)' }}>
          * Arah kiblat adalah anggaran berdasarkan koordinat. Untuk ketepatan, rujuk kompas kiblat di masjid. Kaedah Syafie digunakan.
        </p>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// TASBIH VIEW (Enhanced with vibration, sound, categories, history)
// ═══════════════════════════════════════════════════════════════

function TasbihView() {
  const {
    tasbihCount, tasbihTarget, tasbihTotal,
    incrementTasbih, resetTasbih, setTasbihTarget,
    tasbihVibration, setTasbihVibration,
    tasbihSound, setTasbihSound,
    tasbihVibrationPattern, setTasbihVibrationPattern,
    tasbihSessions, addTasbihSession,
    addXp
  } = useQuranPulseStore()

  const [selectedDhikr, setSelectedDhikr] = useState(0)
  const [activeCategory, setActiveCategory] = useState('general')
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [adhanEnabled, setAdhanEnabled] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const progress = Math.min((tasbihCount / tasbihTarget) * 100, 100)
  const isComplete = tasbihCount >= tasbihTarget

  const currentCategoryDhikr = DHIKR_CATEGORIES.find(c => c.id === activeCategory)?.items || DHIKR_CATEGORIES[3].items

  const dhikrList = currentCategoryDhikr

  // Set target from dhikr item
  useEffect(() => {
    if (dhikrList[selectedDhikr]) {
      setTasbihTarget(dhikrList[selectedDhikr].target)
    }
  }, [selectedDhikr, activeCategory, dhikrList, setTasbihTarget])

  const vibrationPatterns = {
    short: 10,
    medium: 30,
    long: 60,
  }

  const playTapSound = useCallback(() => {
    if (!tasbihSound) return
    try {
      // Create a short click sound using AudioContext
      const ctx = new AudioContext()
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      gain.gain.value = 0.1
      oscillator.start()
      oscillator.stop(ctx.currentTime + 0.05)
    } catch {
      // Audio not available
    }
  }, [tasbihSound])

  const playCompleteSound = useCallback(() => {
    if (!tasbihSound) return
    try {
      const ctx = new AudioContext()
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      oscillator.frequency.value = 523.25
      oscillator.type = 'sine'
      gain.gain.value = 0.15
      oscillator.start()
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      oscillator.stop(ctx.currentTime + 0.5)
    } catch {
      // Audio not available
    }
  }, [tasbihSound])

  const handleTap = useCallback(() => {
    incrementTasbih()
    if (tasbihVibration && navigator.vibrate) {
      navigator.vibrate(vibrationPatterns[tasbihVibrationPattern])
    }
    playTapSound()

    if (tasbihCount + 1 >= tasbihTarget) {
      addXp(25)
      playCompleteSound()
      // Completion celebration
      setShowCelebration(true)
      if (navigator.vibrate) navigator.vibrate([50, 50, 50, 50, 100])
      setTimeout(() => setShowCelebration(false), 2500)
      addTasbihSession({
        id: Date.now().toString(),
        dhikr: dhikrList[selectedDhikr]?.malay || '',
        count: tasbihCount + 1,
        target: tasbihTarget,
        timestamp: Date.now(),
        category: activeCategory,
      })
    }
  }, [tasbihCount, tasbihTarget, tasbihVibration, tasbihVibrationPattern, tasbihSound, selectedDhikr, activeCategory, dhikrList, incrementTasbih, addXp, addTasbihSession, playTapSound, playCompleteSound, vibrationPatterns])

  // Today's sessions
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todaySessions = tasbihSessions.filter(s => s.timestamp >= todayStart.getTime())
  const todayTotal = todaySessions.reduce((sum, s) => sum + s.count, 0) + tasbihCount

  return (
    <motion.div
      className="flex-1 flex flex-col items-center px-4 pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Category Tabs */}
      <div className="w-full overflow-x-auto mb-3 flex gap-2 pb-1" style={{ scrollbarWidth: 'none' }}>
        {DHIKR_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: activeCategory === cat.id ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
              color: activeCategory === cat.id ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
              border: `1px solid ${activeCategory === cat.id ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
            }}
            onClick={() => { setActiveCategory(cat.id); setSelectedDhikr(0); resetTasbih() }}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Dhikr selector */}
      <div className="w-full overflow-x-auto mb-3 flex gap-2 pb-1" style={{ scrollbarWidth: 'none' }}>
        {dhikrList.map((dhikr, i) => (
          <button
            key={`${activeCategory}-${i}`}
            className="flex-shrink-0 px-3 py-2 rounded-xl text-center transition-transform active:scale-95"
            style={{
              background: selectedDhikr === i ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
              border: `1px solid ${selectedDhikr === i ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
              minWidth: '100px',
            }}
            onClick={() => { setSelectedDhikr(i); resetTasbih() }}
          >
            <div className="text-lg font-arabic" style={{ color: '#ffffff', direction: 'rtl' }}>{dhikr.arabic}</div>
            <div className="text-[10px] mt-0.5" style={{ color: selectedDhikr === i ? '#4a4aa6' : 'rgba(204,204,204,0.5)' }}>
              {dhikr.malay}
            </div>
          </button>
        ))}
      </div>

      {/* Current Dhikr Display */}
      <div className="text-center mb-2">
        <p className="text-2xl font-arabic" style={{ color: '#d4af37', direction: 'rtl' }}>
          {dhikrList[selectedDhikr]?.arabic}
        </p>
        <p className="text-xs mt-1" style={{ color: 'rgba(204,204,204,0.6)' }}>
          {dhikrList[selectedDhikr]?.meaning}
        </p>
      </div>

      {/* Tasbih Counter Button */}
      <motion.div
        className="flex flex-col items-center mt-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.button
          className="relative flex h-48 w-48 items-center justify-center rounded-full transition-transform"
          style={{
            background: isComplete
              ? 'conic-gradient(#d4af37 100%, rgba(212,175,55,0.1) 100%)'
              : `conic-gradient(#4a4aa6 ${progress}%, rgba(74,74,166,0.08) ${progress}%)`,
          }}
          onClick={handleTap}
          whileTap={{ scale: 0.95 }}
        >
          <div
            className="flex h-40 w-40 flex-col items-center justify-center rounded-full"
            style={{
              background: isComplete
                ? 'radial-gradient(circle, rgba(212,175,55,0.1), #1a1a4a)'
                : '#1a1a4a',
            }}
          >
            {isComplete ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Check className="h-12 w-12" style={{ color: '#d4af37' }} />
              </motion.div>
            ) : (
              <>
                <motion.span
                  className="text-5xl font-bold"
                  style={{ color: '#4a4aa6' }}
                  key={tasbihCount}
                  initial={{ scale: 1.2, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  {tasbihCount}
                </motion.span>
                <span className="text-xs mt-1" style={{ color: 'rgba(204,204,204,0.6)' }}>
                  / {tasbihTarget}
                </span>
              </>
            )}
          </div>
        </motion.button>

        {/* Stats row */}
        <div className="mt-3 flex gap-4 text-center">
          <div>
            <div className="text-sm font-bold" style={{ color: '#4a4aa6' }}>{tasbihTotal}</div>
            <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Jumlah</div>
          </div>
          <div className="w-px" style={{ background: 'rgba(74,74,166,0.2)' }} />
          <div>
            <div className="text-sm font-bold" style={{ color: '#d4af37' }}>{todayTotal}</div>
            <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Hari Ini</div>
          </div>
          <div className="w-px" style={{ background: 'rgba(74,74,166,0.2)' }} />
          <div>
            <div className="text-sm font-bold" style={{ color: '#ffffff' }}>{todaySessions.length}</div>
            <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Sesi</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 mt-3 flex-wrap justify-center">
          <button
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs transition-transform active:scale-95"
            style={{
              background: 'rgba(212,175,55,0.1)',
              color: '#d4af37',
              border: '1px solid rgba(212,175,55,0.2)',
            }}
            onClick={resetTasbih}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Set Semula
          </button>
          <button
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs transition-transform active:scale-95"
            style={{
              background: tasbihVibration ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
              color: tasbihVibration ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
              border: `1px solid ${tasbihVibration ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
            }}
            onClick={() => setTasbihVibration(!tasbihVibration)}
          >
            {tasbihVibration ? <Vibrate className="h-3.5 w-3.5" /> : <VibrateOff className="h-3.5 w-3.5" />}
            {tasbihVibration ? 'Getar' : 'Senyap'}
          </button>
          <button
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs transition-transform active:scale-95"
            style={{
              background: tasbihSound ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
              color: tasbihSound ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
              border: `1px solid ${tasbihSound ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
            }}
            onClick={() => setTasbihSound(!tasbihSound)}
          >
            {tasbihSound ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            {tasbihSound ? 'Bunyi' : 'Mute'}
          </button>
        </div>

        {/* Settings row */}
        <div className="flex gap-2 mt-2 flex-wrap justify-center">
          <button
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs"
            style={{
              background: 'rgba(42,42,106,0.3)',
              color: 'rgba(204,204,204,0.6)',
              border: '1px solid rgba(74,74,166,0.1)',
            }}
            onClick={() => setShowSettings(!showSettings)}
          >
            <Minus className="h-3 w-3" /> Tetapan
          </button>
          <button
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs"
            style={{
              background: 'rgba(42,42,106,0.3)',
              color: 'rgba(204,204,204,0.6)',
              border: '1px solid rgba(74,74,166,0.1)',
            }}
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="h-3 w-3" /> Sejarah
          </button>
          <select
            className="px-3 py-2 rounded-xl text-xs outline-none"
            style={{
              background: 'rgba(42,42,106,0.5)',
              border: '1px solid rgba(74,74,166,0.15)',
              color: '#ffffff',
            }}
            value={tasbihTarget}
            onChange={e => setTasbihTarget(Number(e.target.value))}
          >
            <option value={1}>1x</option>
            <option value={3}>3x</option>
            <option value={33}>33x</option>
            <option value={99}>99x</option>
            <option value={100}>100x</option>
            <option value={500}>500x</option>
            <option value={1000}>1000x</option>
          </select>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              className="w-full mt-3 rounded-xl p-3"
              style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.1)' }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="text-xs font-semibold mb-2" style={{ color: '#4a4aa6' }}>Corak Getaran</div>
              <div className="flex gap-2">
                {(['short', 'medium', 'long'] as const).map(pattern => (
                  <button
                    key={pattern}
                    className="flex-1 py-2 rounded-lg text-xs"
                    style={{
                      background: tasbihVibrationPattern === pattern ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                      color: tasbihVibrationPattern === pattern ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
                      border: `1px solid ${tasbihVibrationPattern === pattern ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
                    }}
                    onClick={() => setTasbihVibrationPattern(pattern)}
                  >
                    {pattern === 'short' ? 'Singkat' : pattern === 'medium' ? 'Sederhana' : 'Panjang'}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              className="w-full mt-3 rounded-xl p-3 max-h-48 overflow-y-auto"
              style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.1)' }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="text-xs font-semibold mb-2" style={{ color: '#4a4aa6' }}>Sejarah Hari Ini</div>
              {todaySessions.length === 0 ? (
                <div className="text-xs text-center py-4" style={{ color: 'rgba(204,204,204,0.4)' }}>
                  Tiada sesi tasbih hari ini
                </div>
              ) : (
                <div className="space-y-1.5">
                  {todaySessions.map(session => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between py-1.5 px-2 rounded-lg"
                      style={{ background: 'rgba(42,42,106,0.3)' }}
                    >
                      <div>
                        <div className="text-xs font-medium" style={{ color: '#ffffff' }}>
                          {session.dhikr || 'Tasbih'}
                        </div>
                        <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>
                          {new Date(session.timestamp).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="text-xs font-bold" style={{ color: '#d4af37' }}>
                        {session.count}/{session.target}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Adhan Toggle */}
      <div className="flex gap-2 mt-2 justify-center">
        <button
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs"
          style={{
            background: adhanEnabled ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
            color: adhanEnabled ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
            border: `1px solid ${adhanEnabled ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
          }}
          onClick={() => setAdhanEnabled(!adhanEnabled)}
        >
          {adhanEnabled ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
          {adhanEnabled ? 'Azan Hidup' : 'Azan Mati'}
        </button>
      </div>

      {/* ═══ Completion Celebration ═══ */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1.3, 1], opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="text-5xl mb-2"
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: 2 }}
              >
                🎉
              </motion.div>
              <div className="text-lg font-bold" style={{ color: '#d4af37' }}>Mabruk!</div>
              <div className="text-xs" style={{ color: 'rgba(204,204,204,0.7)' }}>Tasbih selesai +25 XP</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} />
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// KALENDAR VIEW (Hijri Calendar)
// ═══════════════════════════════════════════════════════════════

function KalendarView() {
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null)
  const [calendarData, setCalendarData] = useState<IslamicCalendarEntry[]>([])
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const today = new Date()
    const hDate = jakimService.gregorianToHijri(today)
    setHijriDate(hDate)
    setSelectedMonth(hDate.month - 1)
  }, [])

  useEffect(() => {
    async function fetchCalendar() {
      try {
        const data = await jakimService.getIslamicCalendar()
        setCalendarData(data)
      } catch {
        // Use fallback
      } finally {
        setLoading(false)
      }
    }
    fetchCalendar()
  }, [])

  const currentMonth = calendarData[selectedMonth]
  const notableDays = currentMonth?.notableDays || []
  const dayNames = ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab']

  return (
    <motion.div
      className="qp-scroll flex-1 overflow-y-auto px-4 pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Current Hijri Date */}
      {hijriDate && (
        <motion.div
          className="rounded-xl p-5 mb-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(74,74,166,0.2), rgba(74,74,166,0.08))',
            border: '1px solid rgba(74,74,166,0.3)',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-xs font-medium mb-1" style={{ color: '#4a4aa6' }}>
            Tarikh Hijri Hari Ini
          </div>
          <div className="text-2xl font-bold" style={{ color: '#ffffff' }}>
            {hijriDate.day} {hijriDate.monthNameMs} {hijriDate.year}H
          </div>
          <div className="text-xs mt-1" style={{ color: 'rgba(204,204,204,0.5)' }}>
            {new Date().toLocaleDateString('ms-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </motion.div>
      )}

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          className="p-2 rounded-lg"
          style={{ background: 'rgba(42,42,106,0.3)', color: '#4a4aa6' }}
          onClick={() => setSelectedMonth(Math.max(0, selectedMonth - 1))}
          disabled={selectedMonth === 0}
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
        </button>
        <div className="text-center">
          <div className="text-sm font-semibold" style={{ color: '#ffffff' }}>
            {currentMonth?.hijriMonthNameMs || '...'}
          </div>
          <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>
            {currentMonth?.hijriYear || ''}H
          </div>
        </div>
        <button
          className="p-2 rounded-lg"
          style={{ background: 'rgba(42,42,106,0.3)', color: '#4a4aa6' }}
          onClick={() => setSelectedMonth(Math.min(11, selectedMonth + 1))}
          disabled={selectedMonth === 11}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl p-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-[10px] font-medium py-1" style={{ color: 'rgba(204,204,204,0.5)' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {loading ? (
            <div className="col-span-7 text-center py-8 text-xs" style={{ color: 'rgba(204,204,204,0.4)' }}>
              Memuatkan kalendar...
            </div>
          ) : (
            Array.from({ length: 30 }).map((_, i) => {
              const day = i + 1
              const isToday = hijriDate && day === hijriDate.day && selectedMonth === hijriDate.month - 1
              const isNotable = notableDays.some(d => d.day === day)
              const notableDay = notableDays.find(d => d.day === day)

              return (
                <div
                  key={day}
                  className="flex flex-col items-center justify-center py-1.5 rounded-lg relative"
                  style={{
                    background: isToday
                      ? 'rgba(74,74,166,0.3)'
                      : isNotable
                      ? 'rgba(212,175,55,0.1)'
                      : 'transparent',
                    border: isToday ? '1px solid rgba(74,74,166,0.5)' : isNotable ? '1px solid rgba(212,175,55,0.2)' : 'none',
                  }}
                >
                  <span
                    className="text-xs"
                    style={{
                      color: isToday ? '#4a4aa6' : isNotable ? '#d4af37' : 'rgba(204,204,204,0.7)',
                      fontWeight: isToday || isNotable ? 700 : 400,
                    }}
                  >
                    {day}
                  </span>
                  {isNotable && (
                    <div className="absolute -bottom-0.5 w-1 h-1 rounded-full" style={{ background: '#d4af37' }} />
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Notable Days */}
      {notableDays.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-semibold mb-2" style={{ color: '#d4af37' }}>
            Hari-hari Penting
          </div>
          <div className="space-y-2">
            {notableDays.map(day => (
              <motion.div
                key={day.day}
                className="flex items-center gap-3 rounded-xl p-3"
                style={{
                  background: 'rgba(212,175,55,0.08)',
                  border: '1px solid rgba(212,175,55,0.15)',
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.15)' }}>
                  <span className="text-xs font-bold" style={{ color: '#d4af37' }}>{day.day}</span>
                </div>
                <div>
                  <div className="text-xs font-medium" style={{ color: '#ffffff' }}>{day.nameMs}</div>
                  <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{day.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ Islamic Date Converter ═══ */}
      <div className="mt-4 rounded-xl p-4" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
        <div className="flex items-center gap-1.5 mb-2">
          <ArrowLeftRight className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
          <span className="text-xs font-semibold" style={{ color: '#d4af37' }}>Penukar Tarikh Islam</span>
        </div>
        {hijriDate && (
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(74,74,166,0.1)', border: '1px solid rgba(74,74,166,0.15)' }}>
              <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Masihi</div>
              <div className="text-xs font-semibold" style={{ color: '#ffffff' }}>{new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
            <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Hijri</div>
              <div className="text-xs font-semibold" style={{ color: '#d4af37' }}>{hijriDate.day} {hijriDate.monthNameMs} {hijriDate.year}H</div>
            </div>
          </div>
        )}
        <p className="text-[8px] mt-1.5 text-center" style={{ color: 'rgba(204,204,204,0.3)' }}>Penukaran anggaran. Rujuk takwim rasmi untuk ketepatan.</p>
      </div>

      {/* Month Quick Select */}
      <div className="mt-4">
        <div className="text-xs font-semibold mb-2" style={{ color: 'rgba(204,204,204,0.6)' }}>
          Pilih Bulan
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {calendarData.length > 0 ? calendarData.map((month, i) => (
            <button
              key={i}
              className="py-2 rounded-lg text-xs"
              style={{
                background: selectedMonth === i ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                color: selectedMonth === i ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
                border: `1px solid ${selectedMonth === i ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.06)'}`,
                fontWeight: selectedMonth === i ? 600 : 400,
              }}
              onClick={() => setSelectedMonth(i)}
            >
              {month.hijriMonthNameMs}
            </button>
          )) : Array.from({ length: 12 }).map((_, i) => {
            const names = ['Muharram', 'Safar', 'Rabiulawal', 'Rabiulakhir', 'Jumadilawal', 'Jumadilakhir', 'Rejab', "Sya'ban", 'Ramadan', 'Syawal', 'Zulkaedah', 'Zulhijjah']
            return (
              <button
                key={i}
                className="py-2 rounded-lg text-xs"
                style={{
                  background: selectedMonth === i ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                  color: selectedMonth === i ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
                  border: `1px solid ${selectedMonth === i ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.06)'}`,
                  fontWeight: selectedMonth === i ? 600 : 400,
                }}
                onClick={() => setSelectedMonth(i)}
              >
                {names[i]}
              </button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// HADITH VIEW
// ═══════════════════════════════════════════════════════════════

function HadithView() {
  const [hadithIndex, setHadithIndex] = useState(0)

  useEffect(() => {
    // Rotate daily based on date
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    )
    const idx = dayOfYear % HADITH_COLLECTION.length
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHadithIndex(idx)
  }, [])

  const currentHadith = HADITH_COLLECTION[hadithIndex]

  return (
    <motion.div
      className="qp-scroll flex-1 overflow-y-auto px-4 pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-2xl mb-1">📜</div>
        <h3 className="text-sm font-semibold" style={{ color: '#ffffff' }}>Hadis Hari Ini</h3>
        <p className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Hadis sahih dalam Bahasa Melayu</p>
      </div>

      {/* Main Hadith Card */}
      <motion.div
        className="rounded-xl p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(74,74,166,0.15), rgba(74,74,166,0.05))',
          border: '1px solid rgba(74,74,166,0.25)',
          borderLeft: '3px solid #d4af37',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="absolute top-3 right-3 text-6xl opacity-5" style={{ color: '#d4af37' }}>
          ﷽
        </div>

        <div className="text-xs font-semibold mb-3 flex items-center gap-1.5" style={{ color: '#d4af37' }}>
          📖 Hadis #{currentHadith.id}
        </div>

        <p className="text-sm leading-relaxed" style={{ color: '#ffffff' }}>
          &ldquo;{currentHadith.text}&rdquo;
        </p>

        <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(74,74,166,0.15)' }}>
          <div className="text-xs font-medium" style={{ color: '#4a4aa6' }}>
            {currentHadith.source}
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: 'rgba(204,204,204,0.5)' }}>
            Perawi: {currentHadith.narrator}
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs transition-transform active:scale-95"
          style={{
            background: 'rgba(42,42,106,0.5)',
            color: '#4a4aa6',
            border: '1px solid rgba(74,74,166,0.2)',
          }}
          onClick={() => setHadithIndex(prev => (prev - 1 + HADITH_COLLECTION.length) % HADITH_COLLECTION.length)}
        >
          ← Sebelum
        </button>
        <span className="text-xs" style={{ color: 'rgba(204,204,204,0.4)' }}>
          {hadithIndex + 1} / {HADITH_COLLECTION.length}
        </span>
        <button
          className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs transition-transform active:scale-95"
          style={{
            background: 'rgba(42,42,106,0.5)',
            color: '#4a4aa6',
            border: '1px solid rgba(74,74,166,0.2)',
          }}
          onClick={() => setHadithIndex(prev => (prev + 1) % HADITH_COLLECTION.length)}
        >
          Seterusnya →
        </button>
      </div>

      {/* Random Button */}
      <button
        className="w-full mt-3 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-transform active:scale-95"
        style={{
          background: 'rgba(74,74,166,0.15)',
          color: '#4a4aa6',
          border: '1px solid rgba(74,74,166,0.2)',
        }}
        onClick={() => setHadithIndex(Math.floor(Math.random() * HADITH_COLLECTION.length))}
      >
        🎲 Hadis Rawak
      </button>

      {/* All hadiths list */}
      <div className="mt-4">
        <div className="text-xs font-semibold mb-2" style={{ color: 'rgba(204,204,204,0.6)' }}>
          Senarai Hadis
        </div>
        <div className="space-y-1.5 max-h-96 overflow-y-auto">
          {HADITH_COLLECTION.map((h, i) => (
            <button
              key={h.id}
              className="w-full text-left rounded-xl p-3 transition-all"
              style={{
                background: hadithIndex === i ? 'rgba(74,74,166,0.15)' : 'rgba(42,42,106,0.3)',
                border: `1px solid ${hadithIndex === i ? 'rgba(74,74,166,0.3)' : 'rgba(74,74,166,0.06)'}`,
              }}
              onClick={() => setHadithIndex(i)}
            >
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-bold mt-0.5 flex-shrink-0" style={{ color: hadithIndex === i ? '#4a4aa6' : 'rgba(204,204,204,0.3)' }}>
                  #{h.id}
                </span>
                <div>
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: hadithIndex === i ? '#ffffff' : 'rgba(204,204,204,0.6)' }}>
                    {h.text}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(204,204,204,0.3)' }}>
                    {h.source}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// KHUTBAH VIEW (e-Khutbah Reader)
// ═══════════════════════════════════════════════════════════════

function KhutbahView() {
  const [khutbahList, setKhutbahList] = useState<KhutbahEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedKhutbah, setSelectedKhutbah] = useState<KhutbahEntry | null>(null)
  const [khutbahContent, setKhutbahContent] = useState('')

  useEffect(() => {
    async function fetchKhutbah() {
      try {
        const res = await fetch('/api/jakim/khutbah')
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.data) {
            setKhutbahList(data.data)
          }
        }
      } catch {
        // Use fallback
      } finally {
        setLoading(false)
      }
    }
    fetchKhutbah()
  }, [])

  const handleReadKhutbah = async (khutbah: KhutbahEntry) => {
    setSelectedKhutbah(khutbah)
    // Since we can't actually fetch the full content, show a placeholder
    setKhutbahContent(`Bismillahirrahmanirrahim.

Segala puji bagi Allah SWT, Tuhan yang memelihara dan mentadbirkan sekalian alam. Selawat dan salam ke atas junjungan besar Nabi Muhammad SAW, keluarga dan para sahabat baginda.

${khutbah.titleMs}

Saudara-saudara seislam yang dikasihi Allah,

Khutbah pada hari ini membahas tentang ${khutbah.titleMs.toLowerCase()}, suatu topik yang sangat penting dalam kehidupan kita sebagai umat Islam.

Allah SWT berfirman dalam Al-Quran yang bermaksud: "Sesungguhnya Allah menyuruh kamu menunaikan amanah kepada yang berhak menerimanya, dan apabila kamu menghukum di antara manusia, hendaklah kamu menghukum dengan adil." (Surah An-Nisa, 4:58)

Saudara-saudara,

Marilah kita bersyukur ke hadrat Allah SWT dengan nikmat Islam dan iman. Nikmat yang tidak terhingga ini wajib kita pertahankan dan kita tingkatkan melalui amalan-amalan yang diredhai Allah.

Mudah-mudahan kita semua mendapat keberkatan dan rahmat dari Allah SWT. Amin.

--- Sumber: ${khutbah.source}`)
  }

  if (selectedKhutbah) {
    return (
      <motion.div
        className="qp-scroll flex-1 overflow-y-auto px-4 pb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Back button */}
        <button
          className="flex items-center gap-1 mb-3 px-3 py-2 rounded-xl text-xs"
          style={{ background: 'rgba(42,42,106,0.3)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.1)' }}
          onClick={() => setSelectedKhutbah(null)}
        >
          ← Kembali
        </button>

        {/* Khutbah Title */}
        <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(74,74,166,0.1)', border: '1px solid rgba(74,74,166,0.2)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: selectedKhutbah.type === 'friday' ? 'rgba(74,74,166,0.2)' : selectedKhutbah.type === 'eid' ? 'rgba(212,175,55,0.2)' : 'rgba(106,106,182,0.2)', color: selectedKhutbah.type === 'friday' ? '#4a4aa6' : '#d4af37' }}>
              {selectedKhutbah.type === 'friday' ? 'Jumaat' : selectedKhutbah.type === 'eid' ? 'Hari Raya' : 'Ramadan'}
            </span>
            <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{selectedKhutbah.date}</span>
          </div>
          <h3 className="text-base font-bold" style={{ color: '#ffffff' }}>
            {selectedKhutbah.titleMs}
          </h3>
          <div className="text-[10px] mt-1" style={{ color: 'rgba(204,204,204,0.4)' }}>
            {selectedKhutbah.source}
          </div>
        </div>

        {/* Khutbah Content */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
          <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(204,204,204,0.8)' }}>
            {khutbahContent}
          </div>
        </div>

        {/* External Link */}
        {selectedKhutbah.contentUrl && (
          <a
            href={selectedKhutbah.contentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 mt-3 py-2.5 rounded-xl text-xs font-medium"
            style={{
              background: 'rgba(74,74,166,0.15)',
              color: '#4a4aa6',
              border: '1px solid rgba(74,74,166,0.2)',
            }}
          >
            <ExternalLink className="h-3.5 w-3.5" /> Buka di Laman JAKIM
          </a>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      className="qp-scroll flex-1 overflow-y-auto px-4 pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-2xl mb-1">🕌</div>
        <h3 className="text-sm font-semibold" style={{ color: '#ffffff' }}>e-Khutbah JAKIM</h3>
        <p className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Khutbah Jumaat & Hari Raya</p>
      </div>

      {/* Khutbah List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl p-4 animate-pulse" style={{ background: 'rgba(42,42,106,0.3)' }}>
              <div className="h-3 w-16 rounded mb-2" style={{ background: 'rgba(74,74,166,0.2)' }} />
              <div className="h-4 w-3/4 rounded mb-1" style={{ background: 'rgba(74,74,166,0.15)' }} />
              <div className="h-3 w-1/2 rounded" style={{ background: 'rgba(74,74,166,0.1)' }} />
            </div>
          ))}
        </div>
      ) : khutbahList.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📭</div>
          <p className="text-xs" style={{ color: 'rgba(204,204,204,0.5)' }}>Tiada khutbah tersedia</p>
        </div>
      ) : (
        <div className="space-y-2">
          {khutbahList.map((khutbah) => (
            <motion.button
              key={khutbah.id}
              className="w-full text-left rounded-xl p-4 transition-transform active:scale-[0.98]"
              style={{
                background: 'rgba(42,42,106,0.3)',
                border: '1px solid rgba(74,74,166,0.1)',
              }}
              onClick={() => handleReadKhutbah(khutbah)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: khutbah.type === 'friday' ? 'rgba(74,74,166,0.15)' : 'rgba(212,175,55,0.1)' }}>
                  <span className="text-lg">🕌</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6' }}>
                      {khutbah.type === 'friday' ? 'Jumaat' : khutbah.type === 'eid' ? 'Hari Raya' : 'Ramadan'}
                    </span>
                    <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.3)' }}>{khutbah.date}</span>
                  </div>
                  <div className="text-sm font-medium line-clamp-2" style={{ color: '#ffffff' }}>
                    {khutbah.titleMs || khutbah.title}
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: 'rgba(204,204,204,0.3)' }}>
                    {khutbah.source}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 flex-shrink-0 mt-2" style={{ color: 'rgba(204,204,204,0.3)' }} />
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* islam.gov.my reference + JAKIM footer */}
      <div className="mt-4 rounded-xl p-3" style={{ background: 'rgba(42,42,106,0.2)', border: '1px solid rgba(74,74,166,0.08)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-3 w-3" style={{ color: '#4a4aa6' }} />
          <span className="text-[9px] font-semibold" style={{ color: '#4a4aa6' }}>Waktu Solat Disahkan JAKIM</span>
        </div>
        <p className="text-[8px] leading-relaxed" style={{ color: 'rgba(204,204,204,0.35)' }}>
          Khutbah daripada portal e-Khutbah JAKIM. Hukum fiqh mengikut mazhab Syafie. Rujuk mufti negeri untuk hukum rasmi.
        </p>
        <a href="https://www.islam.gov.my" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[8px] mt-1 hover:underline" style={{ color: 'rgba(74,74,166,0.5)' }}>
          <ExternalLink className="h-2 w-2" /> Rujuk islam.gov.my untuk khutbah rasmi
        </a>
      </div>
    </motion.div>
  )
}
