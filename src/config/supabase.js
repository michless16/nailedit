/**
 * @module supabase
 * @description Initialisation du client Supabase pour l'application NailedIt.
 * Utilise les variables d'environnement Vite pour la configuration.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Variables Supabase manquantes. Vérifiez votre fichier .env.local :',
    '\n  VITE_SUPABASE_URL',
    '\n  VITE_SUPABASE_ANON_KEY'
  );
}

/**
 * Client Supabase singleton pour toute l'application.
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
