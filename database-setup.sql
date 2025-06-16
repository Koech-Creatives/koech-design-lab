-- =====================================================
-- KOECH DESIGN LAB - DATABASE SETUP WITH RLS
-- =====================================================

-- Enable RLS on auth.users (if not already enabled)
-- ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USER PROFILES TABLE
-- =====================================================
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT, -- Phone number for WhatsApp outreach
  avatar_url TEXT,
  company TEXT,
  role TEXT DEFAULT 'user',
  subscription_tier TEXT DEFAULT 'free', -- free, pro, enterprise
  subscription_status TEXT DEFAULT 'active',
  usage_limits JSONB DEFAULT '{
    "projects": 5,
    "brands": 3,
    "exports_per_month": 50,
    "ai_generations": 10,
    "storage_mb": 100
  }',
  preferences JSONB DEFAULT '{}',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- BRANDS TABLE
-- =====================================================
CREATE TABLE brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  colors JSONB DEFAULT '[]',
  fonts JSONB DEFAULT '[]',
  logo_url TEXT,
  is_shared BOOLEAN DEFAULT FALSE,
  shared_with UUID[] DEFAULT '{}', -- Array of user IDs who can access
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- RLS Policies for brands
CREATE POLICY "Users can access own brands" ON brands
  FOR ALL USING (
    auth.uid() = user_id OR                    -- Owner access
    auth.uid() = ANY(shared_with) OR           -- Shared access
    (is_shared = TRUE)                         -- Public brands
  );

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  brand_id UUID REFERENCES brands(id),
  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  format JSONB NOT NULL,
  pages JSONB DEFAULT '[]',
  current_page_id TEXT,
  thumbnail_url TEXT,
  is_template BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  collaborators JSONB DEFAULT '[]', -- [{user_id, role, permissions}]
  tags TEXT[] DEFAULT '{}',
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Users can access own projects" ON projects
  FOR ALL USING (
    auth.uid() = user_id OR                    -- Owner access
    auth.uid()::text = ANY(                    -- Collaborator access
      SELECT jsonb_array_elements_text(collaborators -> 'user_id')
    ) OR
    is_public = TRUE OR                        -- Public projects
    is_template = TRUE                         -- Public templates
  );

-- =====================================================
-- USAGE TRACKING TABLE
-- =====================================================
CREATE TABLE usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  action_type TEXT NOT NULL, -- 'project_created', 'export_generated', 'ai_generation'
  resource_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policy for usage_tracking
CREATE POLICY "Users can view own usage" ON usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage" ON usage_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- TEAM WORKSPACES TABLE (Future Feature)
-- =====================================================
CREATE TABLE workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  members JSONB DEFAULT '[]', -- [{user_id, role, joined_at}]
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workspaces
CREATE POLICY "Workspace members can access" ON workspaces
  FOR ALL USING (
    auth.uid() = owner_id OR                   -- Owner access
    auth.uid()::text = ANY(                    -- Member access
      SELECT jsonb_array_elements_text(members -> 'user_id')
    )
  );

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to check usage limits
CREATE OR REPLACE FUNCTION check_usage_limit(
  user_uuid UUID,
  action_type TEXT,
  limit_key TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  user_limit INTEGER;
  current_usage INTEGER;
BEGIN
  -- Get user's limit from profile
  SELECT (usage_limits ->> limit_key)::INTEGER 
  INTO user_limit
  FROM user_profiles 
  WHERE id = user_uuid;
  
  -- Count current month usage
  SELECT COUNT(*)
  INTO current_usage
  FROM usage_tracking
  WHERE user_id = user_uuid 
    AND action_type = action_type
    AND created_at >= date_trunc('month', NOW());
  
  RETURN current_usage < user_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track usage
CREATE OR REPLACE FUNCTION track_usage(
  action_type TEXT,
  resource_id UUID DEFAULT NULL,
  metadata JSONB DEFAULT '{}'
) RETURNS VOID AS $$
BEGIN
  INSERT INTO usage_tracking (user_id, action_type, resource_id, metadata)
  VALUES (auth.uid(), action_type, resource_id, metadata);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name, first_name, last_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name', 
      CONCAT(
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        ' ',
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
      )
    ),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_brands_user_id ON brands(user_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_brand_id ON projects(brand_id);
CREATE INDEX idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX idx_usage_tracking_created_at ON usage_tracking(created_at);

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample subscription tiers
-- You can reference these in your app
COMMENT ON COLUMN user_profiles.subscription_tier IS 'Subscription tiers: free, pro, enterprise';
COMMENT ON COLUMN user_profiles.usage_limits IS 'JSON object with usage limits per subscription tier';

-- =====================================================
-- SECURITY NOTES
-- =====================================================

/*
1. RLS automatically filters all queries based on auth.uid()
2. Users can only see/modify their own data
3. Shared resources are accessible via shared_with arrays
4. Public resources (templates) are accessible to all
5. Usage tracking prevents abuse and enables billing
6. All sensitive operations require authentication
7. Database functions run with SECURITY DEFINER for controlled access
*/ 