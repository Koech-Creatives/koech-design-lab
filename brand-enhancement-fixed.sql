-- =====================================================
-- BRAND ENHANCEMENT MIGRATION (FIXED)
-- Properly handles existing schema and adds missing fields
-- =====================================================

-- Add industry field to brands table (if not exists)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'brands' AND column_name = 'industry') THEN
        ALTER TABLE brands ADD COLUMN industry TEXT;
    END IF;
END $$;

-- Add description field for brand details
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'brands' AND column_name = 'description') THEN
        ALTER TABLE brands ADD COLUMN description TEXT;
    END IF;
END $$;

-- Add logo_url field (if not exists) - for backward compatibility
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'brands' AND column_name = 'logo_url') THEN
        ALTER TABLE brands ADD COLUMN logo_url TEXT;
    END IF;
END $$;

-- Add is_shared field for brand sharing (if not exists)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'brands' AND column_name = 'is_shared') THEN
        ALTER TABLE brands ADD COLUMN is_shared BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Add shared_with field for brand sharing (if not exists)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'brands' AND column_name = 'shared_with') THEN
        ALTER TABLE brands ADD COLUMN shared_with UUID[] DEFAULT '{}';
    END IF;
END $$;

-- Update existing data with default values
UPDATE brands 
SET 
  industry = COALESCE(industry, 'Other'),
  description = COALESCE(description, 'Brand created via Koech Design Lab'),
  logo_url = COALESCE(logo_url, logo),
  is_shared = COALESCE(is_shared, FALSE),
  shared_with = COALESCE(shared_with, '{}')
WHERE industry IS NULL 
   OR description IS NULL 
   OR logo IS NULL 
   OR is_shared IS NULL 
   OR shared_with IS NULL;

-- Create or replace function to sync logo and logo_url fields
CREATE OR REPLACE FUNCTION sync_brand_logo_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- If logo is updated, sync to logo_url
  IF NEW.logo IS DISTINCT FROM OLD.logo THEN
    NEW.logo_url = NEW.logo;
  END IF;
  
  -- If logo_url is updated, sync to logo
  IF NEW.logo_url IS DISTINCT FROM OLD.logo_url THEN
    NEW.logo = NEW.logo_url;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to sync logo fields
DROP TRIGGER IF EXISTS sync_brand_logo_trigger ON brands;
CREATE TRIGGER sync_brand_logo_trigger
  BEFORE UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION sync_brand_logo_fields();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_brands_industry ON brands(industry);
CREATE INDEX IF NOT EXISTS idx_brands_user_id ON brands(user_id);
CREATE INDEX IF NOT EXISTS idx_brands_is_shared ON brands(is_shared);

-- Update RLS policies for brands table
DROP POLICY IF EXISTS "Users can access own brands" ON brands;
CREATE POLICY "Users can access own brands" ON brands
  FOR ALL USING (
    auth.uid() = user_id OR                    -- Owner access
    auth.uid() = ANY(shared_with) OR           -- Shared access
    (is_shared = TRUE)                         -- Public brands
  );

-- =====================================================
-- BRAND ANALYTICS (Optional Enhancement)
-- =====================================================

-- Create brand_usage table for analytics
CREATE TABLE IF NOT EXISTS brand_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'color_used', 'font_used', 'logo_used'
  element_type TEXT, -- 'text', 'shape', 'button', etc.
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on brand_usage
ALTER TABLE brand_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policy for brand_usage
DROP POLICY IF EXISTS "Users can access own brand usage" ON brand_usage;
CREATE POLICY "Users can access own brand usage" ON brand_usage
  FOR ALL USING (auth.uid() = user_id);

-- Create index for brand usage analytics
CREATE INDEX IF NOT EXISTS idx_brand_usage_brand_id ON brand_usage(brand_id);
CREATE INDEX IF NOT EXISTS idx_brand_usage_user_id ON brand_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_brand_usage_created_at ON brand_usage(created_at);

-- Function to track brand usage
CREATE OR REPLACE FUNCTION track_brand_usage(
  brand_uuid UUID,
  action_type TEXT,
  element_type TEXT DEFAULT NULL,
  metadata JSONB DEFAULT '{}'
) RETURNS VOID AS $$
BEGIN
  INSERT INTO brand_usage (brand_id, user_id, action_type, element_type, metadata)
  VALUES (brand_uuid, auth.uid(), action_type, element_type, metadata);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- BRAND TEMPLATES (Future Enhancement)
-- =====================================================

-- Create brand_templates table for reusable brand configurations
CREATE TABLE IF NOT EXISTS brand_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  colors JSONB DEFAULT '[]',
  fonts JSONB DEFAULT '[]',
  description TEXT,
  preview_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on brand_templates
ALTER TABLE brand_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policy for brand_templates
DROP POLICY IF EXISTS "Public templates are viewable" ON brand_templates;
CREATE POLICY "Public templates are viewable" ON brand_templates
  FOR SELECT USING (is_public = TRUE OR auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can create templates" ON brand_templates;
CREATE POLICY "Users can create templates" ON brand_templates
  FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update own templates" ON brand_templates;
CREATE POLICY "Users can update own templates" ON brand_templates
  FOR UPDATE USING (auth.uid() = created_by);

-- Create indexes for brand templates
CREATE INDEX IF NOT EXISTS idx_brand_templates_industry ON brand_templates(industry);
CREATE INDEX IF NOT EXISTS idx_brand_templates_public ON brand_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_brand_templates_usage_count ON brand_templates(usage_count DESC);

-- Insert some default brand templates (only if they don't exist)
INSERT INTO brand_templates (name, industry, colors, fonts, description, preview_url, created_by) 
VALUES
  (
    'Modern Tech',
    'Technology',
    '[
      {"name": "Primary", "hex": "#3b82f6"},
      {"name": "Secondary", "hex": "#1e40af"},
      {"name": "Accent", "hex": "#06b6d4"},
      {"name": "Success", "hex": "#10b981"},
      {"name": "Warning", "hex": "#f59e0b"}
    ]'::jsonb,
    '[
      {"name": "Inter", "url": "", "family": "Inter, sans-serif"},
      {"name": "JetBrains Mono", "url": "", "family": "JetBrains Mono, monospace"}
    ]'::jsonb,
    'Clean, modern colors perfect for technology companies and startups',
    NULL,
    NULL
  ),
  (
    'Healthcare Professional',
    'Healthcare',
    '[
      {"name": "Primary", "hex": "#059669"},
      {"name": "Secondary", "hex": "#047857"},
      {"name": "Accent", "hex": "#3b82f6"},
      {"name": "Trust", "hex": "#1e40af"},
      {"name": "Care", "hex": "#8b5cf6"}
    ]'::jsonb,
    '[
      {"name": "Source Sans Pro", "url": "", "family": "Source Sans Pro, sans-serif"},
      {"name": "Merriweather", "url": "", "family": "Merriweather, serif"}
    ]'::jsonb,
    'Professional and trustworthy colors for healthcare and medical services',
    NULL,
    NULL
  ),
  (
    'Financial Services',
    'Finance',
    '[
      {"name": "Primary", "hex": "#1e40af"},
      {"name": "Secondary", "hex": "#1e3a8a"},
      {"name": "Accent", "hex": "#059669"},
      {"name": "Gold", "hex": "#d97706"},
      {"name": "Trust", "hex": "#374151"}
    ]'::jsonb,
    '[
      {"name": "Roboto", "url": "", "family": "Roboto, sans-serif"},
      {"name": "Playfair Display", "url": "", "family": "Playfair Display, serif"}
    ]'::jsonb,
    'Trustworthy and professional colors for financial and banking services',
    NULL,
    NULL
  )
ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify the schema has been updated correctly
DO $$
DECLARE
    schema_status TEXT := '';
    missing_columns TEXT[] := '{}';
    required_column TEXT;
BEGIN
    -- Check for required columns
    FOR required_column IN SELECT unnest(ARRAY['industry', 'description', 'logo_url', 'is_shared', 'shared_with']) LOOP
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'brands' AND column_name = required_column
        ) THEN
            missing_columns := array_append(missing_columns, required_column);
        END IF;
    END LOOP;
    
    IF array_length(missing_columns, 1) > 0 THEN
        RAISE NOTICE 'WARNING: Missing columns in brands table: %', array_to_string(missing_columns, ', ');
    ELSE
        RAISE NOTICE 'SUCCESS: All required columns exist in brands table';
    END IF;
    
    -- Check if tables were created
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'brand_usage') THEN
        RAISE NOTICE 'SUCCESS: brand_usage table created';
    ELSE
        RAISE NOTICE 'WARNING: brand_usage table not created';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'brand_templates') THEN
        RAISE NOTICE 'SUCCESS: brand_templates table created';
    ELSE
        RAISE NOTICE 'WARNING: brand_templates table not created';
    END IF;
END $$;

-- =====================================================
-- COMPLETED
-- =====================================================

-- Add comments for tracking
COMMENT ON TABLE brands IS 'Enhanced brand table with industry, description, logo sync, and sharing fields';
COMMENT ON TABLE brand_usage IS 'Tracks how brand elements are used across designs';
COMMENT ON TABLE brand_templates IS 'Pre-made brand color palettes and configurations';

-- Final success message
SELECT 'Brand enhancement migration completed successfully! 🎨' AS status; 