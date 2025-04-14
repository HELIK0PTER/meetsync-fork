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
          .select("id, account_type, renew_type ")
          .eq("id", session.user.id)
          .single();

        console.log(profileData);
        if (error) {
          console.error("Erreur lors de la récupération du profil :", error);
        }

        setUser(
          profileData ? { ...session.user, ...profileData } : session.user,
        );
      } catch (err) {
        console.error("Erreur inattendue :", err);
      }

      setLoading(false);
    };

    // Vérifier la session au chargement
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) console.error("Erreur de session :", error);
      fetchUser(session);
    };

    checkSession();

    // Écouter les changements de connexion/déconnexion
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Changement d'état d'auth :", event);
        fetchUser(session);
      },
    );

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
