"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fonction pour récupérer l'utilisateur
    const fetchUser = async (session) => {
      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("id, account_type, renew_type, mfa_enabled, mfa_factor_id")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Erreur lors de la récupération du profil :", error);
        }

        // If no profile exists, create one with default values
        if (!profileData) {
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert([
              {
                id: session.user.id,
                account_type: "basic",
                mfa_enabled: false,
                mfa_factor_id: null
              }
            ])
            .select()
            .single();

          if (createError) {
            console.error("Erreur lors de la création du profil :", createError);
          }

          setUser({ ...session.user, ...newProfile });
        } else {
          setUser({ ...session.user, ...profileData });
        }
      } catch (err) {
        console.error("Erreur inattendue :", err);
      }

      setLoading(false);
    };

    // Vérifier la session au chargement
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.error("Erreur de session :", error);
      fetchUser(session);
    };

    checkSession();

    // Écouter les changements de connexion/déconnexion
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Changement d'état d'auth :", event);
      
      // If this is a MFA challenge, handle it
      if (event === 'SIGNED_IN') {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.factors?.length > 0) {
          // User has MFA enabled, check if they need to verify
          const factor = user.factors[0];
          if (factor.status === 'unverified') {
            const { data, error } = await supabase.auth.mfa.challenge({
              factorId: factor.id
            });
            if (error) {
              console.error("Erreur lors du challenge MFA:", error);
              return;
            }
            // The challenge has been created, now we need to verify it
            // This will be handled by the sign-in page
            window.location.href = '/auth/mfa';
            return;
          }
        }
      }
      
      fetchUser(session);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
