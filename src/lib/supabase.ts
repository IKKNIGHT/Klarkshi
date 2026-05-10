import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://gwfznodqwmqlczykibmz.supabase.co'
const supabaseKey = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) || 'sb_publishable_MUhmjQkFAlteMNcbTsa6eg_vyFIAQaD'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Profile = {
  id: string
  username: string
  cp_balance: number
  is_main_admin: boolean
  last_check_in: string
  created_at: string
}

export type Event = {
  id: string
  title: string
  description: string
  type: 'yes_no' | 'higher_lower'
  created_by: string
  end_date: string | null
  actual_end_date: string | null
  status: 'open' | 'closed' | 'resolved'
  resolved_outcome: string | null
  created_at: string
}

export type Bet = {
  id: string
  user_id: string
  event_id: string
  amount: number
  prediction: string
  created_at: string
  status: 'pending' | 'won' | 'lost'
}
