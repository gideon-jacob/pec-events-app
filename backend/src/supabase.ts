import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and/or Anon Key are not set in environment variables.');
  throw Error("Supabase URL and/or Anon Key are not set in environment variables.");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
