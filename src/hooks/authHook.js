import { useEffect } from "react";
import { supabase } from "../../src/utils/supabaseClient";
import useAuthStore from "../../stores/authStore"; // Corrected the import path
import { useRouter } from "next/router"; // Corrected the import source

const useInitializeAuth = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  // Assuming you have an setIsAuthenticated function in your store, otherwise remove this line

  useEffect(() => {
    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const user = session?.user || null;
        setAuth(user); // Update global auth state
        // Optionally update isAuthenticated state
        // setIsAuthenticated(!!user);
      }
    );
  }, [setAuth]); // Removed setIsAuthenticated from dependencies array if not used

  // No return statement needed as this hook doesn't return anything
};

export default useInitializeAuth;
