import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnon) {
  throw new Error(
    '⚠️  Faltan las variables de entorno de Supabase.\n' +
    'Crea un archivo .env.local con:\n' +
    '  NEXT_PUBLIC_SUPABASE_URL=...\n' +
    '  NEXT_PUBLIC_SUPABASE_ANON_KEY=...',
  );
}

/** Singleton del cliente Supabase (reutilizado por toda la app). */
export const supabase = createClient(supabaseUrl, supabaseAnon);
