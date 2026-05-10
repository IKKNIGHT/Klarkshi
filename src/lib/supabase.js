import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gwfznodqwmqlczykibmz.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_MUhmjQkFAlteMNcbTsa6eg_vyFIAQaD';
export const supabase = createClient(supabaseUrl, supabaseKey);
