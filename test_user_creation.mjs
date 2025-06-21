import { createClient } from '@supabase/supabase-js';

// Use your actual environment variables
const supabaseUrl = 'https://iuwpzqcacaqabbjkeltr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1d3B6cWNhY2FxYWJiamtlbHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjI2NzEsImV4cCI6MjA2NTg5ODY3MX0.qHnVtIU4F6x4cnG6yospxt9yWhmxgD4YNm6SdP2_UF8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserCreation() {
  console.log('🔍 Testing user creation...');
  
  try {
    // First, let's check if the user_profiles table exists
    console.log('📋 Checking if user_profiles table exists...');
    const { data: tables, error: tableError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Table check failed:', tableError.message);
      return;
    }
    
    console.log('✅ user_profiles table exists');
    
    // Try to create a user
    console.log('👤 Attempting user registration...');
    const { data, error } = await supabase.auth.signUp({
      email: 'testcli@example.com',
      password: 'testpassword123',
      options: {
        data: {
          first_name: 'Test',
          last_name: 'CLI',
          full_name: 'Test CLI'
        }
      }
    });
    
    if (error) {
      console.error('❌ Registration failed:', error);
      console.error('Full error:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Registration successful!');
      console.log('User ID:', data.user?.id);
      console.log('Email confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No');
    }
    
  } catch (err) {
    console.error('💥 Unexpected error:', err);
  }
}

testUserCreation();
