
const { createClient } = require('@supabase/supabase-js');

async function testSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('Testing Supabase with URL:', url);
  const supabase = createClient(url, key);

  const tables = ['profiles', 'applications', 'user_settings'];
  
  for (const table of tables) {
    console.log(`Checking table: ${table}...`);
    const { error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.error(`Error for ${table}:`, error.message);
    } else {
      console.log(`Table ${table} exists!`);
    }
  }
}

testSupabase();
