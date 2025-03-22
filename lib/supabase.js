import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  headers: {
    'Accept': 'application/json'
  }
});
// Écoute les changements de session et les stocke en cache
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    localStorage.setItem("supabaseSession", JSON.stringify(session));
  } else {
    localStorage.removeItem("supabaseSession");
  }
});
