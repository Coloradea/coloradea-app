import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ttsheptdateqblcenxjb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0c2hlcHRkYXRlcWJsY2VueGpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MzU2MzAsImV4cCI6MjA5MTExMTYzMH0.chksYwsgFHx1l4_Pqvs3KLhCKCgrkSKajlTB0hIFrHk'

export const supabase = createClient(supabaseUrl, supabaseKey)
