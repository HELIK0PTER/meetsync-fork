"use client"; // Si tu es en mode App Router (Next.js 13+)

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Next.js 13+ -> `next/navigation` / Next.js 12 -> `next/router`
import { supabase } from "../../../lib/supabase";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            await supabase.auth.signOut(); // Déconnexion de Supabase
            router.push("/auth/login"); // Redirection vers la page de connexion
        };

        logout();
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-xl">Déconnexion en cours...</p>
        </div>
    );
}
