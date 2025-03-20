"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

// Création du contexte utilisateur
const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Vérifie si un utilisateur est connecté
    useEffect(() => {
        const checkUser = async () => {
            const { data: session } = await supabase.auth.getSession();
            setUser(session?.user || null);
            setLoading(false);
        };

        checkUser();

        // Écoute les changements de connexion/déconnexion
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
}

// Hook pour accéder aux infos utilisateur partout dans l'app
export function useUser() {
    return useContext(UserContext);
}
