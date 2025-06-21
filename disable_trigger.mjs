import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iuwpzqcacaqabbjkeltr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1d3B6cWNhY2FxYWJiamtlbHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjI2NzEsImV4cCI6MjA2NTg5ODY3MX0.qHnVtIU4F6x4cnG6yospxt9yWhmxgD4YNm6SdP2_UF8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function disableTriggerAndTest() {
  console.log('🔧 Disabling trigger and testing user creation...');
  
  try {
    // Disable the trigger (this requires admin privileges, might not work with anon key)
    console.log('🔧 Attempting to disable trigger...');
    const { data: dropResult, error: dropError } = await supabase
      .rpc('sql', {
        query: "DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;"
      });
    
    if (dropError) {
      console.log('⚠️ Could not disable trigger via RPC (expected - requires admin)');
      console.log('❗ Please run this in Supabase SQL Editor:');
      console.log('   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;');
    } else {
      console.log('✅ Trigger disabled');
    }
    
    // Now test user creation without trigger
    console.log('👤 Testing user creation without trigger...');
    const { data, error } = await supabase.auth.signUp({
      email: 'notrigger@example.com',
      password: 'testpassword123',
      options: {
        data: {
          first_name: 'No',
          last_name: 'Trigger',
          full_name: 'No Trigger'
        }
      }
    });
    
    if (error) {
      console.error('❌ Still failed:', error);
    } else {
      console.log('✅ SUCCESS! User creation works without trigger');
      console.log('User ID:', data.user?.id);
    }
    
  } catch (err) {
    console.error('💥 Error:', err);
  }
}

disableTriggerAndTest();
