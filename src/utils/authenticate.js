import { supabase } from "../utils/supabaseClient";

async function signInWithEmail(email, password) {
  const { user, session, error } = await supabase.auth.signIn({
    email,
    password,
  });

  if (error) throw error;
  // Handle success - navigate user or store session/user data
}
