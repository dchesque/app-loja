import { createClient, SupabaseClient } from '@supabase/supabase-js';
import env from './env';

// Função para criar e configurar o cliente Supabase
const createSupabaseClient = (): SupabaseClient => {
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Service Key must be provided');
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

// Exportando o cliente Supabase para uso em toda aplicação
export const supabase = createSupabaseClient();

// Exportando função para testes mockados
export default { createSupabaseClient };