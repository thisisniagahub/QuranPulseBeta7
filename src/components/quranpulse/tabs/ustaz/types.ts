import {
  Globe, Image as ImageIcon, Palette, Volume2, Clock, BookOpen, Search,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  persona?: string
  isVoice?: boolean
  imageUrl?: string
  isSearching?: boolean
  reactions?: string[]
  audioUrl?: string
}

export type ChatMode = 'classic' | 'openclaw'

// ─── Constants ───────────────────────────────────────────────────────────────

export const PERSONAS = [
  {
    id: 'ustaz',
    label: 'Ustaz Azhar',
    emoji: '👳🏻‍♂️',
    desc: 'Fiqh & Hukum',
    color: '#4a4aa6',
    specialization: 'Pakar dalam fiqh mazhab Syafie, hukum halal/haram, dan ibadah',
  },
  {
    id: 'ustazah',
    label: 'Ustazah Aishah',
    emoji: '🧕🏻',
    desc: 'Akidah & Akhlak',
    color: '#6a6ab6',
    specialization: 'Pakar dalam akidah, akhlak, pendidikan Islam, dan muamalah',
  },
  {
    id: 'ustaz-zak',
    label: 'Ustaz Zak',
    emoji: '🧢',
    desc: 'Sirah & Sejarah',
    color: '#8a8ac6',
    specialization: 'Pakar dalam sirah Nabi, sejarah peradaban Islam, dan kisah para nabi',
  },
]

export const SUGGESTION_CHIPS = [
  { text: 'Apakah hukum solat berjemaah?', icon: '🕌' },
  { text: 'Bagaimana cara bertaubat?', icon: '🤲' },
  { text: 'Ceritakan kisah Nabi Yusuf', icon: '📖' },
  { text: 'Apakah rukun iman?', icon: '⭐' },
  { text: 'Hukum puasa Ramadhan', icon: '🌙' },
  { text: 'Cara mendidik anak dalam Islam', icon: '👨‍👩‍👧' },
]

export const OPENCLAW_TOOLS = [
  { id: 'web-search', name: 'Web Search', icon: Globe, desc: 'Search the web for Islamic knowledge', ocTool: 'web_search' },
  { id: 'image-gen', name: 'Islamic Art', icon: ImageIcon, desc: 'Generate Islamic calligraphy & art', ocTool: 'image_generate' },
  { id: 'video-gen', name: 'Video Gen', icon: Palette, desc: 'Generate Islamic video content', ocTool: 'video_generate' },
  { id: 'music-gen', name: 'Nasheed Gen', icon: Volume2, desc: 'Generate nasheed/vocal music', ocTool: 'music_generate' },
  { id: 'cron', name: 'Prayer Reminders', icon: Clock, desc: 'Scheduled prayer notifications', ocTool: 'cron' },
  { id: 'quran-search', name: 'Quran Search', icon: BookOpen, desc: 'Search Quranic verses', ocTool: 'web_fetch' },
  { id: 'pdf-tool', name: 'PDF Tool', icon: Search, desc: 'Read & analyze PDF documents', ocTool: 'pdf' },
  { id: 'browser', name: 'Web Browser', icon: Globe, desc: 'Browse websites for research', ocTool: 'browser' },
  { id: 'tts', name: 'Voice Output', icon: Volume2, desc: 'Text-to-speech for responses', ocTool: 'tts' },
]

export const REACTION_EMOJIS = ['👍', '❤️', '🤲', '✨', '🕌']

// ─── Fallback responses ─────────────────────────────────────────────────────

export function getFallbackResponse(message: string, persona: string): string {
  const lower = message.toLowerCase()

  const responses: Record<string, string[]> = {
    ustaz: [
      'Berdasarkan fiqh Islam, perkara ini perlu diteliti dengan lebih mendalam. Secara umumnya, kita perlu merujuk kepada Al-Quran dan Sunnah sebagai sumber utama hukum. Saya cadangkan anda berunding dengan ustaz di kawasan anda untuk pandangan yang lebih khusus.',
      'Soalan yang baik! Dalam mazhab Syafie yang diamalkan di Malaysia, hukum ini bergantung kepada beberapa faktor. Sebagai panduan umum, kita perlu mengutamakan niat yang ikhlas dan mengikuti syariat yang ditetapkan.',
      'Jazakallahu khairan untuk soalan ini. Dalam Islam, setiap perbuatan dinilai berdasarkan niat. Adalah penting untuk kita memahami hukum hakam dengan merujuk kepada ilmuwan yang berkelayakan.',
    ],
    ustazah: [
      'Subhanallah, soalan yang sangat penting. Dari segi akidah, kita wajib meyakini bahawa Allah SWT adalah Tuhan Yang Maha Esa dan Muhammad SAW adalah Rasul terakhir. Perkara ini adalah asas keimanan kita.',
      'Dalam berakhlak, Islam mengajar kita untuk sentiasa bersabar, bersyukur, dan bertaubat. Setiap ujian yang datang adalah cara Allah mengangkat darjat kita. Teruskan berdoa dan berusaha.',
      'Penting untuk kita menjaga akidah dan akhlak dalam kehidupan harian. Sentiasa berzikir dan berdoa agar diberikan petunjuk oleh Allah SWT.',
    ],
    'ustaz-zak': [
      'Dalam sejarah Islam, kita dapat melihat bagaimana kesabangan para Nabi dan Rasul dalam menghadapi ujian. Kisah ini mengajar kita tentang pentingnya tawakkal kepada Allah.',
      'Sirah Nabi Muhammad SAW penuh dengan pengajaran yang berharga. Baginda sentiasa menunjukkan akhlak yang mulia dan sifat pemaaf dalam setiap situasi.',
      'Sejarah peradaban Islam menunjukkan bahawa kejayaan datang dengan ilmu, iman, dan amal. Kita harus meneladani semangat para salafussoleh dalam menuntut ilmu.',
    ],
  }

  const personaResponses = responses[persona] || responses.ustaz
  return personaResponses[Math.floor(Math.random() * personaResponses.length)]
}
