import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.local.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.local.NEXT_PUBLIC_SUPABASE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)