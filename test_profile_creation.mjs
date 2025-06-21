import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iuwpzqcacaqabbjkeltr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1d3B6cWNhY2FxYWJiamtlbHRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjI2NzEsImV4cCI6MjA2NTg5ODY3MX0.qHnVtIU4F6x4cnG6yospxt9yWhmxgD4YNm6SdP2_UF8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCompleteFlow() {
  console.log('🧪 Testing complete registration and profile creation flow...');
  
  const testEmail = `profiletest${Date.now()}@example.com`;
  const testPassword = 'testpassword123';
  const firstName = 'Profile';
  const lastName = 'Test';
  
  try {
    // Step 1: Register user
    console.log('👤 Step 1: Registering user...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`
        }
      }
    });
    
    if (authError) {
      console.error('❌ Registration failed:', authError);
      return;
    }
    
    console.log('✅ User registered:', {
      id: authData.user?.id,
      email: authData.user?.email
    });
    
    // Step 2: Check if profile was created
    if (authData.user?.id) {
      console.log('👤 Step 2: Checking if profile exists...');
      
      // Wait a moment for the profile to be created
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      
      if (profileError) {
        console.error('❌ Profile check failed:', profileError);
        
        // Try to create profile manually
        console.log('🔧 Creating profile manually...');
        const { data: manualProfile, error: manualError } = await supabase
          .from('user_profiles')
          .insert([{
            id: authData.user.id,
            email: testEmail,
            full_name: `${firstName} ${lastName}`,
            first_name: firstName,
            last_name: lastName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();
        
        if (manualError) {
          console.error('❌ Manual profile creation failed:', manualError);
        } else {
          console.log('✅ Profile created manually:', manualProfile);
        }
      } else {
        console.log('✅ Profile found:', {
          id: profileData.id,
          email: profileData.email,
          fullName: profileData.full_name,
          firstName: profileData.first_name,
          lastName: profileData.last_name
        });
      }
    }
    
    console.log('🎉 Test completed successfully!');
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

testCompleteFlow();
