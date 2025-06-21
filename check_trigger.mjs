import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iuwpzqcacaqabbjkeltr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1d3B6cWNhY2FxYWJiamtlbHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjI2NzEsImV4cCI6MjA2NTg5ODY3MX0.qHnVtIU4F6x4cnG6yospxt9yWhmxgD4YNm6SdP2_UF8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTrigger() {
  console.log('🔍 Checking trigger setup...');
  
  try {
    // Check if trigger function exists
    const { data: functions, error: funcError } = await supabase
      .rpc('sql', {
        query: "SELECT proname, prosrc FROM pg_proc WHERE proname = 'handle_new_user'"
      });
    
    if (funcError) {
      console.error('❌ Function check failed:', funcError);
    } else {
      console.log('✅ Trigger function status:', functions?.length > 0 ? 'EXISTS' : 'MISSING');
    }
    
    // Check if trigger exists
    const { data: triggers, error: trigError } = await supabase
      .rpc('sql', {
        query: "SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created'"
      });
    
    if (trigError) {
      console.error('❌ Trigger check failed:', trigError);
    } else {
      console.log('✅ Trigger status:', triggers?.length > 0 ? 'EXISTS' : 'MISSING');
    }
    
  } catch (err) {
    console.error('💥 Error checking trigger:', err);
  }
}

checkTrigger();
