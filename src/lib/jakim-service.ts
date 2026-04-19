// ─── QuranPulse JAKIM Malaysia Data Service ──────────────
// Prayer times, halal status, khutbah, Islamic calendar
// Uses waktusolat.app API with local fallback data

// ═══════════════════════════════════════════════════════════
// Core Data Types
// ═══════════════════════════════════════════════════════════

export interface PrayerTimes {
  zone: string
  date: string
  hijriDate: string
  fajr: string       // Subuh
  syuruk: string     // Syuruk
  dhuhr: string      // Zohor
  asr: string        // Asar
  maghrib: string    // Maghrib
  isha: string       // Isyak
}

export interface JakimZone {
  code: string
  name: string
  nameMs: string
  state: string
  stateMs: string
}

export interface HalalStatus {
  code: string
  name: string
  status: 'halal' | 'not-halal' | 'pending' | 'unknown'
  certExpiry: string
  source: string
}

export interface KhutbahEntry {
  id: string
  title: string
  titleMs: string
  date: string
  type: 'friday' | 'eid' | 'ramadan'
  contentUrl: string
  source: string
}

export interface IslamicCalendarEntry {
  hijriYear: number
  hijriMonth: number
  hijriMonthName: string
  hijriMonthNameMs: string
  gregorianStart: string
  gregorianEnd: string
  notableDays: { day: number; name: string; nameMs: string }[]
}

export interface HijriDate {
  year: number
  month: number
  day: number
  monthName: string
  monthNameMs: string
}

// ═══════════════════════════════════════════════════════════
// JAKIM Zones - Complete Malaysia Prayer Time Zones
// ═══════════════════════════════════════════════════════════

const JAKIM_ZONES: JakimZone[] = [
  // Wilayah Persekutuan
  { code: 'WPKL01', name: 'Kuala Lumpur', nameMs: 'Kuala Lumpur', state: 'Wilayah Persekutuan', stateMs: 'Wilayah Persekutuan' },
  { code: 'WPS01', name: 'Putrajaya', nameMs: 'Putrajaya', state: 'Wilayah Persekutuan', stateMs: 'Wilayah Persekutuan' },
  { code: 'WPL01', name: 'Labuan', nameMs: 'Labuan', state: 'Wilayah Persekutuan', stateMs: 'Wilayah Persekutuan' },

  // Johor
  { code: 'JHR01', name: 'Johor Bahru', nameMs: 'Johor Bahru', state: 'Johor', stateMs: 'Johor' },
  { code: 'JHR02', name: 'Kluang', nameMs: 'Kluang', state: 'Johor', stateMs: 'Johor' },
  { code: 'JHR03', name: 'Batu Pahat', nameMs: 'Batu Pahat', state: 'Johor', stateMs: 'Johor' },
  { code: 'JHR04', name: 'Mersing', nameMs: 'Mersing', state: 'Johor', stateMs: 'Johor' },

  // Kedah
  { code: 'KDH01', name: 'Kota Setar', nameMs: 'Kota Setar', state: 'Kedah', stateMs: 'Kedah' },
  { code: 'KDH02', name: 'Kuala Muda', nameMs: 'Kuala Muda', state: 'Kedah', stateMs: 'Kedah' },
  { code: 'KDH03', name: 'Padang Terap', nameMs: 'Padang Terap', state: 'Kedah', stateMs: 'Kedah' },
  { code: 'KDH04', name: 'Baling', nameMs: 'Baling', state: 'Kedah', stateMs: 'Kedah' },
  { code: 'KDH05', name: 'Kubang Pasu', nameMs: 'Kubang Pasu', state: 'Kedah', stateMs: 'Kedah' },
  { code: 'KDH06', name: 'Pendang', nameMs: 'Pendang', state: 'Kedah', stateMs: 'Kedah' },
  { code: 'KDH07', name: 'Sik', nameMs: 'Sik', state: 'Kedah', stateMs: 'Kedah' },

  // Kelantan
  { code: 'KTN01', name: 'Kota Bharu', nameMs: 'Kota Bharu', state: 'Kelantan', stateMs: 'Kelantan' },
  { code: 'KTN02', name: 'Machang', nameMs: 'Machang', state: 'Kelantan', stateMs: 'Kelantan' },

  // Melaka
  { code: 'MLK01', name: 'Melaka', nameMs: 'Melaka', state: 'Melaka', stateMs: 'Melaka' },

  // Negeri Sembilan
  { code: 'NSN01', name: 'Seremban', nameMs: 'Seremban', state: 'Negeri Sembilan', stateMs: 'Negeri Sembilan' },
  { code: 'NSN02', name: 'Jempol', nameMs: 'Jempol', state: 'Negeri Sembilan', stateMs: 'Negeri Sembilan' },

  // Pahang
  { code: 'PHS01', name: 'Kuantan', nameMs: 'Kuantan', state: 'Pahang', stateMs: 'Pahang' },
  { code: 'PHS02', name: 'Jerantut', nameMs: 'Jerantut', state: 'Pahang', stateMs: 'Pahang' },

  // Pulau Pinang
  { code: 'PNG01', name: 'Pulau Pinang', nameMs: 'Pulau Pinang', state: 'Pulau Pinang', stateMs: 'Pulau Pinang' },

  // Perak
  { code: 'PRK01', name: 'Ipoh', nameMs: 'Ipoh', state: 'Perak', stateMs: 'Perak' },
  { code: 'PRK02', name: 'Taiping', nameMs: 'Taiping', state: 'Perak', stateMs: 'Perak' },
  { code: 'PRK03', name: 'Parit', nameMs: 'Parit', state: 'Perak', stateMs: 'Perak' },
  { code: 'PRK04', name: 'Teluk Intan', nameMs: 'Teluk Intan', state: 'Perak', stateMs: 'Perak' },
  { code: 'PRK05', name: 'Slim River', nameMs: 'Slim River', state: 'Perak', stateMs: 'Perak' },
  { code: 'PRK06', name: 'Kuala Kangsar', nameMs: 'Kuala Kangsar', state: 'Perak', stateMs: 'Perak' },
  { code: 'PRK07', name: 'Lumut', nameMs: 'Lumut', state: 'Perak', stateMs: 'Perak' },

  // Sabah
  { code: 'SBH01', name: 'Kota Kinabalu', nameMs: 'Kota Kinabalu', state: 'Sabah', stateMs: 'Sabah' },
  { code: 'SBH02', name: 'Sandakan', nameMs: 'Sandakan', state: 'Sabah', stateMs: 'Sabah' },
  { code: 'SBH03', name: 'Lahad Datu', nameMs: 'Lahad Datu', state: 'Sabah', stateMs: 'Sabah' },
  { code: 'SBH04', name: 'Kudat', nameMs: 'Kudat', state: 'Sabah', stateMs: 'Sabah' },
  { code: 'SBH05', name: 'Tawau', nameMs: 'Tawau', state: 'Sabah', stateMs: 'Sabah' },
  { code: 'SBH06', name: 'Keningau', nameMs: 'Keningau', state: 'Sabah', stateMs: 'Sabah' },
  { code: 'SBH07', name: 'Semporna', nameMs: 'Semporna', state: 'Sabah', stateMs: 'Sabah' },

  // Sarawak
  { code: 'SWK01', name: 'Kuching', nameMs: 'Kuching', state: 'Sarawak', stateMs: 'Sarawak' },
  { code: 'SWK02', name: 'Sri Aman', nameMs: 'Sri Aman', state: 'Sarawak', stateMs: 'Sarawak' },
  { code: 'SWK03', name: 'Sibu', nameMs: 'Sibu', state: 'Sarawak', stateMs: 'Sarawak' },
  { code: 'SWK04', name: 'Miri', nameMs: 'Miri', state: 'Sarawak', stateMs: 'Sarawak' },
  { code: 'SWK05', name: 'Bintulu', nameMs: 'Bintulu', state: 'Sarawak', stateMs: 'Sarawak' },
  { code: 'SWK06', name: 'Limbang', nameMs: 'Limbang', state: 'Sarawak', stateMs: 'Sarawak' },
  { code: 'SWK07', name: 'Kapit', nameMs: 'Kapit', state: 'Sarawak', stateMs: 'Sarawak' },
  { code: 'SWK08', name: 'Sarikei', nameMs: 'Sarikei', state: 'Sarawak', stateMs: 'Sarawak' },
  { code: 'SWK09', name: 'Betong', nameMs: 'Betong', state: 'Sarawak', stateMs: 'Sarawak' },

  // Selangor
  { code: 'SGR01', name: 'Gombak', nameMs: 'Gombak', state: 'Selangor', stateMs: 'Selangor' },
  { code: 'SGR02', name: 'Hulu Selangor', nameMs: 'Hulu Selangor', state: 'Selangor', stateMs: 'Selangor' },
  { code: 'SGR03', name: 'Petaling', nameMs: 'Petaling', state: 'Selangor', stateMs: 'Selangor' },
  { code: 'SGR04', name: 'Sepang', nameMs: 'Sepang', state: 'Selangor', stateMs: 'Selangor' },

  // Terengganu
  { code: 'TRG01', name: 'Kuala Terengganu', nameMs: 'Kuala Terengganu', state: 'Terengganu', stateMs: 'Terengganu' },
  { code: 'TRG02', name: 'Kemaman', nameMs: 'Kemaman', state: 'Terengganu', stateMs: 'Terengganu' },

  // Perlis
  { code: 'PLS01', name: 'Kangar', nameMs: 'Kangar', state: 'Perlis', stateMs: 'Perlis' },
]

// ═══════════════════════════════════════════════════════════
// Hijri Month Names
// ═══════════════════════════════════════════════════════════

const HIJRI_MONTHS = [
  { name: 'Muharram', nameMs: 'Muharram' },
  { name: 'Safar', nameMs: 'Safar' },
  { name: 'Rabi al-Awwal', nameMs: 'Rabiulawal' },
  { name: 'Rabi al-Thani', nameMs: 'Rabiulakhir' },
  { name: 'Jumada al-Ula', nameMs: 'Jumadilawal' },
  { name: 'Jumada al-Thani', nameMs: 'Jumadilakhir' },
  { name: 'Rajab', nameMs: 'Rejab' },
  { name: "Shaban", nameMs: "Sya'ban" },
  { name: 'Ramadan', nameMs: 'Ramadan' },
  { name: 'Shawwal', nameMs: 'Syawal' },
  { name: "Dhu al-Qadah", nameMs: "Zulkaedah" },
  { name: "Dhu al-Hijjah", nameMs: "Zulhijjah" },
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
// JakimService Class
// ═══════════════════════════════════════════════════════════

class JakimService {
  private readonly API_BASE = 'https://api.waktusolat.app'
  private readonly CACHE_TTL = 3600000 // 1 hour

  // ─── Fetch with timeout ───────────────────────────────
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

  // ─── Prayer times from e-solat.gov.my via waktusolat.app ──
  async getPrayerTimes(zone: string, date?: string): Promise<PrayerTimes> {
    const d = date ? new Date(date) : new Date()
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    const cacheKey = `solat-${zone}-${dateStr}`
    const cached = getCached<PrayerTimes>(cacheKey)
    if (cached) return cached

    try {
      const response = await this.fetchWithTimeout(
        `${this.API_BASE}/solat/${zone}/${year}/${month}/${day}`
      )

      if (!response.ok) throw new Error(`Prayer time API error: ${response.status}`)
      const data = await response.json()

      if (data && (data.data || data.fajr || data.subuh)) {
        const prayerData = data.data || data
        const result: PrayerTimes = {
          zone,
          date: dateStr,
          hijriDate: prayerData.hijri || prayerData.hijriDate || '',
          fajr: prayerData.fajr || prayerData.subuh || prayerData.Fajr || '05:45',
          syuruk: prayerData.syuruk || prayerData.Syuruk || prayerData.sunrise || '07:05',
          dhuhr: prayerData.dhuhr || prayerData.zohor || prayerData.Dhuhr || '13:15',
          asr: prayerData.asr || prayerData.Asr || '16:30',
          maghrib: prayerData.maghrib || prayerData.Maghrib || '19:20',
          isha: prayerData.isha || prayerData.isyak || prayerData.Isha || '20:30',
        }
        setCache(cacheKey, result, this.CACHE_TTL)
        return result
      }
    } catch {
      // Fallback to hardcoded KL times
    }

    // Fallback: Default KL prayer times
    const result: PrayerTimes = {
      zone,
      date: dateStr,
      hijriDate: '',
      fajr: '05:45',
      syuruk: '07:05',
      dhuhr: '13:15',
      asr: '16:30',
      maghrib: '19:20',
      isha: '20:30',
    }
    setCache(cacheKey, result, this.CACHE_TTL / 6) // Cache fallback for 10 min only
    return result
  }

  // ─── Get all Malaysia zones (JAKIM zones) ─────────────
  getZones(): JakimZone[] {
    return JAKIM_ZONES
  }

  // ─── Check JAKIM halal status ─────────────────────────
  async checkHalal(code: string): Promise<HalalStatus> {
    const cacheKey = `halal-${code}`
    const cached = getCached<HalalStatus>(cacheKey)
    if (cached) return cached

    try {
      // JAKIM Halal API (public endpoint)
      const response = await this.fetchWithTimeout(
        `https://halal.gov.my/v2/api/v1/products/${encodeURIComponent(code)}`,
        8000
      )

      if (response.ok) {
        const data = await response.json()
        if (data) {
          const result: HalalStatus = {
            code,
            name: data.productName || data.name || '',
            status: data.status === 'Halal' ? 'halal' : data.status === 'Not Halal' ? 'not-halal' : 'pending',
            certExpiry: data.expiryDate || data.certExpiry || '',
            source: 'JAKIM Halal Portal',
          }
          setCache(cacheKey, result, this.CACHE_TTL)
          return result
        }
      }
    } catch {
      // API not available
    }

    const result: HalalStatus = {
      code,
      name: '',
      status: 'unknown',
      certExpiry: '',
      source: 'QuranPulse Offline',
    }
    setCache(cacheKey, result, this.CACHE_TTL / 12) // Cache unknown for 5 min
    return result
  }

  // ─── Get Khutbah from JAKIM ──────────────────────────
  async getKhutbah(date?: string): Promise<KhutbahEntry[]> {
    const d = date || new Date().toISOString().split('T')[0]
    const cacheKey = `khutbah-${d}`
    const cached = getCached<KhutbahEntry[]>(cacheKey)
    if (cached) return cached

    try {
      const response = await this.fetchWithTimeout(
        `https://www.islam.gov.my/api/khutbah?date=${d}`,
        8000
      )

      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          const entries: KhutbahEntry[] = data.map((k: { id?: string; title?: string; tajuk?: string; date?: string; type?: string; url?: string }) => ({
            id: k.id || String(Math.random()),
            title: k.title || k.tajuk || '',
            titleMs: k.tajuk || k.title || '',
            date: k.date || d,
            type: (k.type === 'eid' ? 'eid' : k.type === 'ramadan' ? 'ramadan' : 'friday') as KhutbahEntry['type'],
            contentUrl: k.url || '',
            source: 'JAKIM e-Khutbah',
          }))
          setCache(cacheKey, entries, this.CACHE_TTL * 24)
          return entries
        }
      }
    } catch {
      // API not available
    }

    // Fallback sample khutbah
    const entries: KhutbahEntry[] = [
      {
        id: 'sample-1',
        title: 'Keistimewaan Bulan Ramadan',
        titleMs: 'Keistimewaan Bulan Ramadan',
        date: d,
        type: 'friday',
        contentUrl: 'https://www.islam.gov.my/khutbah',
        source: 'JAKIM e-Khutbah (Sample)',
      },
    ]
    setCache(cacheKey, entries, this.CACHE_TTL / 6)
    return entries
  }

  // ─── Get Islamic calendar (Takwim) ────────────────────
  async getIslamicCalendar(year?: number): Promise<IslamicCalendarEntry[]> {
    const hYear = year || this.gregorianToHijri(new Date()).year
    const cacheKey = `takwim-${hYear}`
    const cached = getCached<IslamicCalendarEntry[]>(cacheKey)
    if (cached) return cached

    try {
      const response = await this.fetchWithTimeout(
        `https://api.aladhan.com/v1/hpiCalendarByHijriYear/${hYear}`,
        10000
      )

      if (response.ok) {
        const data = await response.json()
        if (data.code === 200 && data.data) {
          const entries: IslamicCalendarEntry[] = Object.entries(data.data).map(([, monthData]: [string, unknown]) => {
            const md = monthData as { hijri: { month: { number: number; en: string }; year: number }; gregorian: { date: string } }[]
            if (!Array.isArray(md) || md.length === 0) return null
            const first = md[0]
            const last = md[md.length - 1]
            const monthNum = first.hijri.month.number
            const monthInfo = HIJRI_MONTHS[monthNum - 1]

            // Notable Islamic days per month
            const notableDays = this.getNotableDays(monthNum)

            return {
              hijriYear: first.hijri.year,
              hijriMonth: monthNum,
              hijriMonthName: monthInfo.name,
              hijriMonthNameMs: monthInfo.nameMs,
              gregorianStart: first.gregorian.date,
              gregorianEnd: last.gregorian.date,
              notableDays,
            }
          }).filter((e): e is IslamicCalendarEntry => e !== null)

          setCache(cacheKey, entries, this.CACHE_TTL * 24 * 30) // Cache for 30 days
          return entries
        }
      }
    } catch {
      // API not available
    }

    // Fallback: generate basic calendar
    const entries: IslamicCalendarEntry[] = HIJRI_MONTHS.map((m, i) => ({
      hijriYear: hYear,
      hijriMonth: i + 1,
      hijriMonthName: m.name,
      hijriMonthNameMs: m.nameMs,
      gregorianStart: '',
      gregorianEnd: '',
      notableDays: this.getNotableDays(i + 1),
    }))

    setCache(cacheKey, entries, this.CACHE_TTL * 24)
    return entries
  }

  // ─── Notable Islamic Days ─────────────────────────────
  private getNotableDays(month: number): { day: number; name: string; nameMs: string }[] {
    const days: Record<number, { day: number; name: string; nameMs: string }[]> = {
      1: [
        { day: 1, name: 'Islamic New Year', nameMs: 'Awal Tahun Hijrah' },
        { day: 10, name: 'Day of Ashura', nameMs: 'Hari Asyura' },
      ],
      3: [
        { day: 12, name: "Mawlid al-Nabi", nameMs: 'Maulidur Rasul' },
      ],
      7: [
        { day: 1, name: 'Isra and Miraj', nameMs: 'Israk dan Mikraj' },
        { day: 27, name: 'Laylat al-Raghaib', nameMs: 'Malam Raghaib' },
      ],
      8: [
        { day: 15, name: "Laylat al-Bara'ah", nameMs: 'Malam Nisfu Syaban' },
      ],
      9: [
        { day: 1, name: 'Start of Ramadan', nameMs: 'Awal Ramadan' },
        { day: 17, name: 'Battle of Badr', nameMs: 'Perang Badar' },
        { day: 27, name: 'Laylat al-Qadr', nameMs: 'Malam Lailatulqadar' },
      ],
      10: [
        { day: 1, name: 'Eid al-Fitr', nameMs: 'Hari Raya Aidilfitri' },
      ],
      12: [
        { day: 8, name: 'Day of Tarwiyah', nameMs: 'Hari Tarwiyah' },
        { day: 9, name: 'Day of Arafah', nameMs: 'Hari Arafah' },
        { day: 10, name: 'Eid al-Adha', nameMs: 'Hari Raya Aidiladha' },
      ],
    }
    return days[month] || []
  }

  // ─── Hijri date converter (approximate) ───────────────
  gregorianToHijri(date: Date): HijriDate {
    // Approximate conversion using the known formula
    // More accurate conversion would use the aladhan API
    const gd = date.getTime()
    const epochMs = new Date(622, 6, 16).getTime() // Hijri epoch approximately July 16, 622 CE
    const diffDays = Math.floor((gd - epochMs) / (1000 * 60 * 60 * 24))

    // Approximate: 1 Hijri year ≈ 354.36667 days
    const hijriYearApprox = Math.floor(diffDays / 354.36667) + 1
    const remainingDays = diffDays - Math.floor((hijriYearApprox - 1) * 354.36667)
    const hijriMonthApprox = Math.floor(remainingDays / 29.53056) + 1
    const hijriDayApprox = Math.floor(remainingDays - (hijriMonthApprox - 1) * 29.53056) + 1

    const month = Math.min(Math.max(hijriMonthApprox, 1), 12)
    const monthInfo = HIJRI_MONTHS[month - 1]

    return {
      year: hijriYearApprox,
      month,
      day: Math.min(Math.max(hijriDayApprox, 1), 30),
      monthName: monthInfo.name,
      monthNameMs: monthInfo.nameMs,
    }
  }

  // ─── Hijri to Gregorian (approximate) ─────────────────
  hijriToGregorian(hijri: HijriDate): Date {
    // Approximate reverse conversion
    const epochMs = new Date(622, 6, 16).getTime()
    const totalDays = Math.floor((hijri.year - 1) * 354.36667) +
      Math.floor((hijri.month - 1) * 29.53056) +
      (hijri.day - 1)

    return new Date(epochMs + totalDays * 24 * 60 * 60 * 1000)
  }
}

// ═══════════════════════════════════════════════════════════
// Export as singleton
// ═══════════════════════════════════════════════════════════

export const jakimService = new JakimService()
