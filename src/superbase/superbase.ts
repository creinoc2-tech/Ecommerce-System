import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://kiwedadvaqcnzlmlnulf.supabase.co"
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_gjKmZqlhk5QY7LYogZxofw_V9z6clu5"
 
 const supabases = createClient(supabaseUrl, supabaseKey);
export default supabases

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]