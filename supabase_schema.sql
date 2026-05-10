-- Klarkshi Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  cp_balance INTEGER DEFAULT 100 CHECK (cp_balance >= 0),
  is_main_admin BOOLEAN DEFAULT FALSE,
  last_check_in TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read all profiles
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('yes_no', 'higher_lower')),
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  end_date TIMESTAMP WITH TIME ZONE,
  actual_end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'resolved')),
  resolved_outcome TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view open events
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (true);

-- Allow admins to create events
CREATE POLICY "Admins can create events" ON events
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_main_admin = true
    )
  );

-- Allow event creators to update their events
CREATE POLICY "Event creators can update their events" ON events
  FOR UPDATE USING (
    created_by = auth.uid() OR
    auth.uid() IN (SELECT id FROM profiles WHERE is_main_admin = true)
  );

-- Bets Table
CREATE TABLE bets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount > 0),
  prediction TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost')),
  UNIQUE(user_id, event_id)
);

-- Enable RLS on bets
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own bets
CREATE POLICY "Users can view their own bets" ON bets
  FOR SELECT USING (user_id = auth.uid() OR auth.uid() IN (SELECT id FROM profiles WHERE is_main_admin = true));

-- Allow users to insert their own bets
CREATE POLICY "Users can insert their own bets" ON bets
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_bets_user_id ON bets(user_id);
CREATE INDEX idx_bets_event_id ON bets(event_id);
CREATE INDEX idx_profiles_cp_balance ON profiles(cp_balance DESC);

-- Function to handle daily bankruptcy protection reset
CREATE OR REPLACE FUNCTION reset_bankrupt_users()
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET cp_balance = 50
  WHERE cp_balance = 0
    AND DATE(CONVERT_TZ(last_check_in, '+00:00', 'America/Chicago')) < DATE(CONVERT_TZ(NOW(), '+00:00', 'America/Chicago'));
END;
$$ LANGUAGE plpgsql;

-- Function to automatically nullify bets after actual_end_date
CREATE OR REPLACE FUNCTION refund_late_bets()
RETURNS void AS $$
BEGIN
  UPDATE bets b
  SET status = 'lost'
  FROM events e
  WHERE b.event_id = e.id
    AND e.actual_end_date IS NOT NULL
    AND b.created_at > e.actual_end_date
    AND e.status = 'resolved';

  UPDATE profiles p
  SET cp_balance = cp_balance + b.amount
  FROM bets b
  INNER JOIN events e ON b.event_id = e.id
  WHERE b.status = 'lost'
    AND e.actual_end_date IS NOT NULL
    AND b.created_at > e.actual_end_date
    AND p.id = b.user_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
