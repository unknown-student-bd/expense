import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Transaction = {
  id: string
  user_id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description?: string
  date: string
  created_at: string
}

export type Donation = {
  id: string
  donor_name: string
  amount: number
  payment_method: 'bkash' | 'nagad'
  phone_number: string
  created_at: string
}

export type Admin = {
  id: string
  user_id: string
  created_at: string
}