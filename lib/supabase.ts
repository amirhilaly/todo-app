import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://safubebfszokupzasruw.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhZnViZWJmc3pva3VwemFzcnV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NjYzMDEsImV4cCI6MjA2ODM0MjMwMX0.M10GxxPVBjueewyrMI0wtozcgD64bt831Znjwk3dWO4"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})