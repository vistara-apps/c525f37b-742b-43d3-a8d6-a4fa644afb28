-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  farcaster_fid TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_projects_tracked INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'killed', 'scaled')),
  category TEXT NOT NULL CHECK (category IN ('building', 'marketing', 'admin', 'learning')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_time_invested INTEGER DEFAULT 0, -- in seconds
  total_revenue DECIMAL(10,2) DEFAULT 0,
  total_expenses DECIMAL(10,2) DEFAULT 0,
  weekly_signal TEXT CHECK (weekly_signal IN ('green', 'yellow', 'red'))
);

-- Time sessions table
CREATE TABLE time_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in seconds, calculated on session end
  category TEXT NOT NULL CHECK (category IN ('building', 'marketing', 'admin', 'learning')),
  on_chain_proof TEXT, -- optional transaction hash
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Income entries table
CREATE TABLE income_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  source TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expense entries table
CREATE TABLE expense_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly insights table
CREATE TABLE weekly_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  total_hours_logged DECIMAL(5,2) DEFAULT 0,
  top_activity TEXT,
  suggestion_text TEXT,
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start_date)
);

-- Indexes for performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_time_sessions_project_id ON time_sessions(project_id);
CREATE INDEX idx_time_sessions_user_id ON time_sessions(user_id);
CREATE INDEX idx_income_entries_project_id ON income_entries(project_id);
CREATE INDEX idx_expense_entries_project_id ON expense_entries(project_id);
CREATE INDEX idx_weekly_insights_user_id ON weekly_insights(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_insights ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.jwt() ->> 'sub' = wallet_address);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.jwt() ->> 'sub' = wallet_address);

-- Projects policies
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (user_id IN (
    SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'sub'
  ));

CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (user_id IN (
    SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'sub'
  ));

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (user_id IN (
    SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'sub'
  ));

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (user_id IN (
    SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'sub'
  ));

-- Time sessions policies
CREATE POLICY "Users can view own time sessions" ON time_sessions
  FOR SELECT USING (user_id IN (
    SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'sub'
  ));

CREATE POLICY "Users can insert own time sessions" ON time_sessions
  FOR INSERT WITH CHECK (user_id IN (
    SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'sub'
  ));

CREATE POLICY "Users can update own time sessions" ON time_sessions
  FOR UPDATE USING (user_id IN (
    SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'sub'
  ));

-- Income entries policies
CREATE POLICY "Users can view own income entries" ON income_entries
  FOR SELECT USING (user_id IN (
    SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'sub'
  ));

CREATE POLICY "Users can insert own income entries" ON income_entries
  FOR INSERT WITH CHECK (user_id IN (
    SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'sub'
  ));

CREATE POLICY "Users can update own income entries" ON income_entries
  FOR UPDATE USING (user_id IN (
    SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'sub'
  ));

CREATE POLICY "Users can delete own income entries" ON income_entries
  FOR DELETE USING (user_id IN (
    SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'sub'
  ));

-- Expense entries policies
CREATE POLICY "Users can view own expense entries" ON expense_entries
  FOR SELECT USING (user_id IN (
    SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'sub'
  ));

CREATE POLICY "Users can insert own expense entries" ON expense_entries
  FOR INSERT WITH CHECK (user_id IN (
    SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'sub'
  ));

CREATE POLICY "Users can update own expense entries" ON expense_entries
  FOR UPDATE USING (user_id IN (
    SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'sub'
  ));

CREATE POLICY "Users can delete own expense entries" ON expense_entries
  FOR DELETE USING (user_id IN (
    SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'sub'
  ));

-- Weekly insights policies
CREATE POLICY "Users can view own insights" ON weekly_insights
  FOR SELECT USING (user_id IN (
    SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'sub'
  ));

CREATE POLICY "Users can insert own insights" ON weekly_insights
  FOR INSERT WITH CHECK (user_id IN (
    SELECT id FROM users WHERE wallet_address = auth.jwt() ->> 'sub'
  ));

-- Functions for calculations
CREATE OR REPLACE FUNCTION calculate_project_hourly_rate(project_uuid UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  total_revenue DECIMAL(10,2);
  total_expenses DECIMAL(10,2);
  total_seconds INTEGER;
  hourly_rate DECIMAL(10,2);
BEGIN
  SELECT
    COALESCE(SUM(ie.amount), 0),
    COALESCE(SUM(ee.amount), 0),
    COALESCE(SUM(ts.duration), 0)
  INTO total_revenue, total_expenses, total_seconds
  FROM projects p
  LEFT JOIN income_entries ie ON p.id = ie.project_id
  LEFT JOIN expense_entries ee ON p.id = ee.project_id
  LEFT JOIN time_sessions ts ON p.id = ts.project_id AND ts.end_time IS NOT NULL
  WHERE p.id = project_uuid;

  IF total_seconds > 0 THEN
    hourly_rate := (total_revenue - total_expenses) / (total_seconds / 3600.0);
  ELSE
    hourly_rate := 0;
  END IF;

  RETURN hourly_rate;
END;
$$ LANGUAGE plpgsql;

-- Function to update project totals
CREATE OR REPLACE FUNCTION update_project_totals()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects
  SET
    total_time_invested = (
      SELECT COALESCE(SUM(duration), 0)
      FROM time_sessions
      WHERE project_id = NEW.project_id AND end_time IS NOT NULL
    ),
    total_revenue = (
      SELECT COALESCE(SUM(amount), 0)
      FROM income_entries
      WHERE project_id = NEW.project_id
    ),
    total_expenses = (
      SELECT COALESCE(SUM(amount), 0)
      FROM expense_entries
      WHERE project_id = NEW.project_id
    )
  WHERE id = NEW.project_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to keep project totals updated
CREATE TRIGGER update_project_totals_on_time_session
  AFTER INSERT OR UPDATE OR DELETE ON time_sessions
  FOR EACH ROW EXECUTE FUNCTION update_project_totals();

CREATE TRIGGER update_project_totals_on_income
  AFTER INSERT OR UPDATE OR DELETE ON income_entries
  FOR EACH ROW EXECUTE FUNCTION update_project_totals();

CREATE TRIGGER update_project_totals_on_expense
  AFTER INSERT OR UPDATE OR DELETE ON expense_entries
  FOR EACH ROW EXECUTE FUNCTION update_project_totals();

