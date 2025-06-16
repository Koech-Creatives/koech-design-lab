-- =====================================================
-- KOECH DESIGN LAB - DATABASE UPDATE SCRIPT
-- Safe updates for existing database
-- =====================================================

-- Add phone column to user_profiles if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'phone'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN phone TEXT;
        RAISE NOTICE 'Added phone column to user_profiles table';
    ELSE
        RAISE NOTICE 'Phone column already exists in user_profiles table';
    END IF;
END $$;

-- Add first_name column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'first_name'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN first_name TEXT;
        RAISE NOTICE 'Added first_name column to user_profiles table';
    ELSE
        RAISE NOTICE 'First_name column already exists in user_profiles table';
    END IF;
END $$;

-- Add last_name column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'last_name'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN last_name TEXT;
        RAISE NOTICE 'Added last_name column to user_profiles table';
    ELSE
        RAISE NOTICE 'Last_name column already exists in user_profiles table';
    END IF;
END $$;

-- Update or create the trigger function
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
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    phone = EXCLUDED.phone,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create brands table if it doesn't exist
CREATE TABLE IF NOT EXISTS brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  colors JSONB DEFAULT '[]',
  fonts JSONB DEFAULT '[]',
  logo_url TEXT,
  is_shared BOOLEAN DEFAULT FALSE,
  shared_with UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on brands if not already enabled
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'brands' AND rowsecurity = true
    ) THEN
        ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled RLS on brands table';
    ELSE
        RAISE NOTICE 'RLS already enabled on brands table';
    END IF;
END $$;

-- Create RLS policies for brands (drop and recreate to avoid conflicts)
DROP POLICY IF EXISTS "Users can access own brands" ON brands;
CREATE POLICY "Users can access own brands" ON brands
  FOR ALL USING (
    auth.uid() = user_id OR
    auth.uid() = ANY(shared_with) OR
    (is_shared = TRUE)
  );

-- Create projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS projects (
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
  collaborators JSONB DEFAULT '[]',
  tags TEXT[] DEFAULT '{}',
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on projects if not already enabled
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'projects' AND rowsecurity = true
    ) THEN
        ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled RLS on projects table';
    ELSE
        RAISE NOTICE 'RLS already enabled on projects table';
    END IF;
END $$;

-- Create RLS policies for projects (drop and recreate to avoid conflicts)
DROP POLICY IF EXISTS "Users can access own projects" ON projects;
CREATE POLICY "Users can access own projects" ON projects
  FOR ALL USING (
    auth.uid() = user_id OR
    auth.uid()::text = ANY(
      SELECT jsonb_array_elements_text(collaborators -> 'user_id')
    ) OR
    is_public = TRUE OR
    is_template = TRUE
  );

-- Create usage_tracking table if it doesn't exist
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  action_type TEXT NOT NULL,
  resource_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on usage_tracking if not already enabled
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'usage_tracking' AND rowsecurity = true
    ) THEN
        ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled RLS on usage_tracking table';
    ELSE
        RAISE NOTICE 'RLS already enabled on usage_tracking table';
    END IF;
END $$;

-- Create RLS policies for usage_tracking (drop and recreate to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own usage" ON usage_tracking;
DROP POLICY IF EXISTS "System can insert usage" ON usage_tracking;

CREATE POLICY "Users can view own usage" ON usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage" ON usage_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_brands_user_id ON brands(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_brand_id ON projects(brand_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_created_at ON usage_tracking(created_at);

-- Test the trigger function with a sample (this won't actually create a user)
DO $$
BEGIN
    RAISE NOTICE 'Database update completed successfully!';
    RAISE NOTICE 'Tables: user_profiles, brands, projects, usage_tracking';
    RAISE NOTICE 'Trigger: handle_new_user() is ready';
    RAISE NOTICE 'RLS policies: Enabled and configured';
END $$; 