-- ============================================
-- QuranPulse Supabase Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── User Profiles ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT DEFAULT 'Pengguna',
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  last_streak_date DATE,
  font_size TEXT DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ─── Bookmarked Verses ────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookmarked_verses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  surah_id INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, surah_id, verse_number)
);

-- ─── Bookmarked Surahs ────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookmarked_surahs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  surah_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, surah_id)
);

-- ─── Reading Progress ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS reading_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  surah_id INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  surah_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ─── Tasbih Sessions ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasbih_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  count INTEGER DEFAULT 0,
  target INTEGER DEFAULT 33,
  total INTEGER DEFAULT 0,
  dhikr_text TEXT DEFAULT 'سُبْحَانَ اللّهِ',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Iqra Progress ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS iqra_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  book_number INTEGER DEFAULT 1,
  page_number INTEGER DEFAULT 1,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_number, page_number)
);

-- ─── Chat History (Ustaz AI) ─────────────────────────────
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── XP Log ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS xp_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Anonymous User Sessions (for non-authenticated users) ─
CREATE TABLE IF NOT EXISTS anonymous_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL UNIQUE,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarked_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarked_surahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasbih_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE iqra_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE anonymous_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only access their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Bookmarked Verses
CREATE POLICY "Users can view own bookmarks" ON bookmarked_verses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON bookmarked_verses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON bookmarked_verses FOR DELETE USING (auth.uid() = user_id);

-- Bookmarked Surahs
CREATE POLICY "Users can view own surah bookmarks" ON bookmarked_surahs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own surah bookmarks" ON bookmarked_surahs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own surah bookmarks" ON bookmarked_surahs FOR DELETE USING (auth.uid() = user_id);

-- Reading Progress
CREATE POLICY "Users can view own reading progress" ON reading_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reading progress" ON reading_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reading progress" ON reading_progress FOR UPDATE USING (auth.uid() = user_id);

-- Tasbih Sessions
CREATE POLICY "Users can view own tasbih" ON tasbih_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasbih" ON tasbih_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasbih" ON tasbih_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Iqra Progress
CREATE POLICY "Users can view own iqra" ON iqra_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own iqra" ON iqra_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own iqra" ON iqra_progress FOR UPDATE USING (auth.uid() = user_id);

-- Chat Messages
CREATE POLICY "Users can view own chats" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chats" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own chats" ON chat_messages FOR DELETE USING (auth.uid() = user_id);

-- XP Log
CREATE POLICY "Users can view own xp" ON xp_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own xp" ON xp_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Anonymous Sessions: accessible by session_id
CREATE POLICY "Anonymous sessions accessible by session_id" ON anonymous_sessions FOR SELECT USING (true);
CREATE POLICY "Anonymous sessions insertable" ON anonymous_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anonymous sessions updatable" ON anonymous_sessions FOR UPDATE USING (true);

-- ============================================
-- Functions & Triggers
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_reading_progress_updated_at BEFORE UPDATE ON reading_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_tasbih_sessions_updated_at BEFORE UPDATE ON tasbih_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_iqra_progress_updated_at BEFORE UPDATE ON iqra_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_anonymous_sessions_updated_at BEFORE UPDATE ON anonymous_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'Pengguna'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
