// ─── Supabase Database Types ────────────────────────────────
// These types mirror the database schema in supabase/schema.sql

export interface Profile {
  id: string
  user_id: string | null
  username: string
  xp: number
  level: number
  streak: number
  last_streak_date: string | null
  font_size: 'small' | 'medium' | 'large'
  created_at: string
  updated_at: string
}

export interface BookmarkedVerse {
  id: string
  user_id: string | null
  surah_id: number
  verse_number: number
  created_at: string
}

export interface BookmarkedSurah {
  id: string
  user_id: string | null
  surah_id: number
  created_at: string
}

export interface ReadingProgress {
  id: string
  user_id: string | null
  surah_id: number
  verse_number: number
  surah_name: string
  created_at: string
  updated_at: string
}

export interface TasbihSession {
  id: string
  user_id: string | null
  count: number
  target: number
  total: number
  dhikr_text: string
  created_at: string
  updated_at: string
}

export interface IqraProgress {
  id: string
  user_id: string | null
  book_number: number
  page_number: number
  completed: boolean
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  user_id: string | null
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface XpLog {
  id: string
  user_id: string | null
  amount: number
  source: string
  created_at: string
}

export interface AnonymousSession {
  id: string
  session_id: string
  data: Record<string, unknown>
  created_at: string
  updated_at: string
}

// ─── Database type map ─────────────────────────────────────
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Profile, 'id' | 'created_at'>> }
      bookmarked_verses: { Row: BookmarkedVerse; Insert: Omit<BookmarkedVerse, 'id' | 'created_at'>; Update: Partial<Omit<BookmarkedVerse, 'id' | 'created_at'>> }
      bookmarked_surahs: { Row: BookmarkedSurah; Insert: Omit<BookmarkedSurah, 'id' | 'created_at'>; Update: Partial<Omit<BookmarkedSurah, 'id' | 'created_at'>> }
      reading_progress: { Row: ReadingProgress; Insert: Omit<ReadingProgress, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<ReadingProgress, 'id' | 'created_at'>> }
      tasbih_sessions: { Row: TasbihSession; Insert: Omit<TasbihSession, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<TasbihSession, 'id' | 'created_at'>> }
      iqra_progress: { Row: IqraProgress; Insert: Omit<IqraProgress, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<IqraProgress, 'id' | 'created_at'>> }
      chat_messages: { Row: ChatMessage; Insert: Omit<ChatMessage, 'id' | 'created_at'>; Update: Partial<Omit<ChatMessage, 'id' | 'created_at'>> }
      xp_log: { Row: XpLog; Insert: Omit<XpLog, 'id' | 'created_at'>; Update: Partial<Omit<XpLog, 'id' | 'created_at'>> }
      anonymous_sessions: { Row: AnonymousSession; Insert: Omit<AnonymousSession, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<AnonymousSession, 'id' | 'created_at'>> }
    }
  }
}
