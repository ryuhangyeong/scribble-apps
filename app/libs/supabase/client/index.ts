import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

const { VITE_APP_SUPABASE_URL, VITE_APP_SUPABASE_ANON_KEY } = import.meta.env

const supabaseClient = createClient<Database>(
  VITE_APP_SUPABASE_URL,
  VITE_APP_SUPABASE_ANON_KEY
)

export default supabaseClient
