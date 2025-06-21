import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iuwpzqcacaqabbjkeltr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1d3B6cWNhY2FxYWJiamtlbHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjI2NzEsImV4cCI6MjA2NTg5ODY3MX0.qHnVtIU4F6x4cnG6yospxt9yWhmxgD4YNm6SdP2_UF8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllProfiles() {
  console.log('📋 Checking all user profiles...');
  
  try {
    // Get all profiles
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, first_name, last_name, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('❌ Error fetching profiles:', error);
      return;
    }
    
    console.log(`✅ Found ${profiles.length} user profiles:`);
    profiles.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.full_name} (${profile.email}) - Created: ${profile.created_at}`);
    });
    
    // Get all auth users
    console.log('\n📋 Checking auth users without profiles...');
    // Note: We can't directly query auth.users with anon key, so this is just for demonstration
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

checkAllProfiles();
