const { createClient } = require('@supabase/supabase-js')

// Direct connection - no env variables
const supabase = createClient(
  'https://ydowlrugvkgdyjoslojn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlkb3dscnVndmtnZHlqb3Nsb2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTI1NzUsImV4cCI6MjA2Mzc2ODU3NX0.Nm1CnvAA77ATmiOWYgK2NfwVlvSG5flKrBG9t1fQoes'
)

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