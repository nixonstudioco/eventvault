-- EventVault Database Schema
-- Run this in your Supabase SQL editor

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================
-- PLANS
-- =====================
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  stripe_price_id TEXT UNIQUE,
  max_events INTEGER NOT NULL DEFAULT 1,
  max_storage_gb INTEGER NOT NULL DEFAULT 5,
  max_file_size_mb INTEGER NOT NULL DEFAULT 100,
  allow_video BOOLEAN DEFAULT TRUE,
  allow_custom_qr BOOLEAN DEFAULT FALSE,
  allow_live_gallery BOOLEAN DEFAULT FALSE,
  allow_guestbook BOOLEAN DEFAULT TRUE,
  allow_branding BOOLEAN DEFAULT FALSE,
  allow_bulk_download BOOLEAN DEFAULT FALSE,
  allow_email_notifications BOOLEAN DEFAULT FALSE,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO plans (name, slug, description, price_monthly, max_events, max_storage_gb, max_file_size_mb, allow_video, allow_custom_qr, allow_live_gallery, allow_guestbook, allow_branding, allow_bulk_download, allow_email_notifications, sort_order, features) VALUES
(
  'Basic Event',
  'basic',
  'Perfect for a single memorable event',
  19.00, 1, 5, 50, TRUE, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, 1,
  '["1 active event","5 GB storage","Photo & video upload","QR code included","Public gallery","Manual moderation","Guestbook"]'
),
(
  'Premium Event',
  'premium',
  'For organizers who want everything',
  49.00, 10, 50, 500, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 2,
  '["Unlimited events","50 GB storage","Photo & video upload","Custom QR poster design","Live gallery","Guestbook","Personal branding","Bulk download all media","Email notifications","Priority support"]'
);

-- =====================
-- USERS / PROFILES
-- =====================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'organizer', 'admin')),
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- SUBSCRIPTIONS
-- =====================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- EVENTS
-- =====================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL DEFAULT 'other' CHECK (type IN ('wedding', 'birthday', 'baptism', 'party', 'corporate', 'other')),
  event_date DATE,
  location TEXT,
  description TEXT,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended', 'suspended')),
  is_public BOOLEAN DEFAULT TRUE,
  allow_anonymous_upload BOOLEAN DEFAULT TRUE,
  require_account_upload BOOLEAN DEFAULT FALSE,
  allow_guest_download BOOLEAN DEFAULT FALSE,
  auto_approve BOOLEAN DEFAULT FALSE,
  storage_used_bytes BIGINT DEFAULT 0,
  total_uploads INTEGER DEFAULT 0,
  approved_uploads INTEGER DEFAULT 0,
  rejected_uploads INTEGER DEFAULT 0,
  pending_uploads INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- EVENT QR CODES
-- =====================
CREATE TABLE event_qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  template TEXT DEFAULT 'default',
  title TEXT,
  subtitle TEXT,
  bg_color TEXT DEFAULT '#0f0f1a',
  accent_color TEXT DEFAULT '#6366f1',
  text_color TEXT DEFAULT '#ffffff',
  logo_url TEXT,
  custom_image_url TEXT,
  qr_position TEXT DEFAULT 'center',
  generated_png_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- MEDIA UPLOADS
-- =====================
CREATE TABLE media_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  uploader_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  uploader_name TEXT,
  uploader_email TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video')),
  file_name TEXT,
  file_size BIGINT,
  mime_type TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  storage_path TEXT,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  approved_by UUID REFERENCES profiles(id),
  rejection_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- GUESTBOOK MESSAGES
-- =====================
CREATE TABLE guestbook_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_name TEXT,
  author_email TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- EVENT PARTICIPANTS
-- =====================
CREATE TABLE event_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'guest' CHECK (role IN ('guest', 'contributor')),
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- NOTIFICATIONS
-- =====================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- ADMIN LOGS
-- =====================
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- INDEXES
-- =====================
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_media_event ON media_uploads(event_id);
CREATE INDEX idx_media_uploader ON media_uploads(uploader_id);
CREATE INDEX idx_media_status ON media_uploads(status);
CREATE INDEX idx_media_type ON media_uploads(file_type);
CREATE INDEX idx_guestbook_event ON guestbook_messages(event_id);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- =====================
-- ROW LEVEL SECURITY
-- =====================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read own profile, admins can read all
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Profiles are created on signup" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Events: organizers manage own events, public events visible to all
CREATE POLICY "Organizers can manage own events" ON events FOR ALL USING (organizer_id = auth.uid());
CREATE POLICY "Public events are viewable" ON events FOR SELECT USING (is_public = TRUE AND status != 'suspended');

-- Media: organizers manage uploads for their events
CREATE POLICY "Organizers can manage event media" ON media_uploads FOR ALL USING (
  EXISTS (SELECT 1 FROM events WHERE id = media_uploads.event_id AND organizer_id = auth.uid())
);
CREATE POLICY "Public approved media is viewable" ON media_uploads FOR SELECT USING (
  status = 'approved' AND EXISTS (
    SELECT 1 FROM events WHERE id = media_uploads.event_id AND is_public = TRUE
  )
);
CREATE POLICY "Uploaders can insert media" ON media_uploads FOR INSERT WITH CHECK (TRUE);

-- Subscriptions: users see own subscriptions
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (user_id = auth.uid());

-- Guestbook
CREATE POLICY "Organizers can manage guestbook" ON guestbook_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM events WHERE id = guestbook_messages.event_id AND organizer_id = auth.uid())
);
CREATE POLICY "Approved messages are public" ON guestbook_messages FOR SELECT USING (status = 'approved');
CREATE POLICY "Anyone can insert message" ON guestbook_messages FOR INSERT WITH CHECK (TRUE);

-- QR codes
CREATE POLICY "Organizers can manage own QR codes" ON event_qr_codes FOR ALL USING (
  EXISTS (SELECT 1 FROM events WHERE id = event_qr_codes.event_id AND organizer_id = auth.uid())
);

-- Notifications
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (user_id = auth.uid());

-- =====================
-- FUNCTIONS & TRIGGERS
-- =====================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update event stats when media is uploaded/moderated
CREATE OR REPLACE FUNCTION update_event_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE events SET
    total_uploads = (SELECT COUNT(*) FROM media_uploads WHERE event_id = COALESCE(NEW.event_id, OLD.event_id)),
    approved_uploads = (SELECT COUNT(*) FROM media_uploads WHERE event_id = COALESCE(NEW.event_id, OLD.event_id) AND status = 'approved'),
    rejected_uploads = (SELECT COUNT(*) FROM media_uploads WHERE event_id = COALESCE(NEW.event_id, OLD.event_id) AND status = 'rejected'),
    pending_uploads = (SELECT COUNT(*) FROM media_uploads WHERE event_id = COALESCE(NEW.event_id, OLD.event_id) AND status = 'pending'),
    storage_used_bytes = COALESCE((SELECT SUM(file_size) FROM media_uploads WHERE event_id = COALESCE(NEW.event_id, OLD.event_id) AND status != 'rejected'), 0),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.event_id, OLD.event_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_media_change
  AFTER INSERT OR UPDATE OR DELETE ON media_uploads
  FOR EACH ROW EXECUTE FUNCTION update_event_stats();

-- Update updated_at timestamps
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================
-- STORAGE BUCKETS (run in Supabase dashboard)
-- =====================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('event-media', 'event-media', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('event-covers', 'event-covers', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('qr-exports', 'qr-exports', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('user-avatars', 'user-avatars', true);
