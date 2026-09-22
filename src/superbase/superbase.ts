import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_PROJECT_URL
const supabaseKey = import.meta.env.VITE_PROJECT_API_KEY
const supabases = createClient(supabaseUrl, supabaseKey)
export default supabases

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]