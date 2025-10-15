import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing SUPABASE_URL environment variable. Please check your .env file.',
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing SUPABASE_ANON_KEY environment variable. Please check your .env file.',
  );
}

export const supaClient = createClient(supabaseUrl, supabaseAnonKey);
