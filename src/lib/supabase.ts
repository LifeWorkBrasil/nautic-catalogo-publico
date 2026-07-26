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

// Catálogo público: nunca faz login, e não pode herdar a sessão de outro app hospedado no
// mesmo domínio (github.io/<user>/<repo> compartilha localStorage por domínio, não por path) —
// sem isso, uma sessão autenticada de outro app faria a RLS filtrar pelo tenant errado.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})
