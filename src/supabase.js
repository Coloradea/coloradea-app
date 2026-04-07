import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://VOTRE_ID.supabase.co'
const supabaseKey = 'VOTRE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)
