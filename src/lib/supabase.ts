import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string
export const EMPRESA_ID = import.meta.env.VITE_EMPRESA_ID as string

if (!supabaseUrl || !supabaseAnonKey || !EMPRESA_ID) {
  // eslint-disable-next-line no-console
  console.warn(
    'Variáveis VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY / VITE_EMPRESA_ID não configuradas. Copie .env.example para .env e preencha.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
