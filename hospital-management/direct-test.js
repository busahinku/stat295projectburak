const { createClient } = require('@supabase/supabase-js')

// Load environment variables from .env.local
require('dotenv').config({ path: './.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing. Make sure .env.local is set up with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDirectConnection() {
  try {
    console.log('🔥 DIRECT CONNECTION TEST 🔥\n')
    
    // Test users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('email, first_name, last_name, role')
    
    if (usersError) {
      console.error('❌ Users Error:', usersError)
      return
    }
    
    console.log('✅ USERS FOUND:', users.length)
    users.forEach(user => {
      console.log(`   ${user.email} - ${user.first_name} ${user.last_name} (${user.role})`)
    })
    
    // Test specific user lookup
    console.log('\n--- Testing founder login ---')
    const { data: founder, error: founderError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'founder@sirlewis.com')
      .single()
    
    if (founderError) {
      console.error('❌ Founder Error:', founderError)
    } else {
      console.log('✅ FOUNDER FOUND:', founder.first_name, founder.last_name)
      
      // Test founder data
      const { data: founderData, error: founderDataError } = await supabase
        .from('founders')
        .select('*')
        .eq('id', founder.id)
        .single()
      
      if (founderDataError) {
        console.error('❌ Founder Data Error:', founderDataError)
      } else {
        console.log('✅ FOUNDER DATA:', founderData)
      }
    }
    
  } catch (err) {
    console.error('💥 DIRECT TEST FAILED:', err)
  }
}

testDirectConnection() 