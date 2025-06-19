# 🔧 Supabase Signup Fix Guide

## Problem
The signup functionality is failing with the error:
```
"Database error saving new user" (code: unexpected_failure)
```

## Root Cause
The database trigger function `handle_new_user()` that automatically creates user profiles on signup is not properly installed or is failing.

## Solution Steps

### 1. Access Supabase Dashboard
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Login to your account
3. Select your project: `rwuxzgvpcnggqelrjsqg`

### 2. Open SQL Editor
1. In the left sidebar, click on "SQL Editor"
2. Click "New Query" to create a new SQL script

### 3. Run Database Setup Script
Copy and paste the entire content of `database-setup.sql` into the SQL editor and run it.

**Important sections to verify:**

```sql
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
```

### 4. Verify Setup

After running the script, test the setup:

```sql
-- Check if trigger function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- Check if trigger exists
SELECT tgname, tgrelid::regclass, tgfoid::regproc
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- Check existing user_profiles
SELECT count(*) FROM user_profiles;
```

### 5. Test Signup Again

After the database setup is complete:

1. Restart your development server: `npm run dev`
2. Try signing up with a new email address
3. Check the console for detailed error messages

## Alternative Quick Fix (If Above Doesn't Work)

If the trigger approach doesn't work, we can implement manual profile creation:

### Option A: Manual Profile Creation in Code
The frontend code has been updated to provide better error messages. If you see "Database setup incomplete", run the SQL script above.

### Option B: Disable Email Confirmation (Temporary)
In Supabase Dashboard:
1. Go to "Authentication" → "Settings"
2. Scroll to "Email Auth"
3. Temporarily disable "Enable email confirmations" 
4. Test signup without email confirmation

## Testing the Fix

Use this test script to verify everything works:

```bash
node test-supabase-connection.js
```

Look for:
- ✅ "Auth signup test successful" 
- ❌ Any remaining errors with detailed error info

## Database Schema Verification

Ensure these tables exist with proper structure:
- ✅ `user_profiles` - for user data
- ✅ `brands` - for brand management  
- ✅ `projects` - for design projects
- ✅ `usage_tracking` - for analytics

## Common Issues

1. **RLS Policies**: Ensure Row Level Security policies allow user profile creation
2. **Email Duplication**: Check if email already exists in auth.users
3. **Metadata Structure**: Verify user metadata is properly structured
4. **Trigger Permissions**: Ensure trigger function has proper SECURITY DEFINER

## Support

If issues persist:
1. Check Supabase logs in Dashboard → "Logs"
2. Verify environment variables in `.env.local`
3. Ensure Supabase project is not paused/inactive

## Next Steps After Fix

Once signup works:
1. Test the complete signup flow
2. Verify user profiles are created correctly
3. Test phone number storage for WhatsApp integration
4. Verify Terms/Privacy acceptance flow 