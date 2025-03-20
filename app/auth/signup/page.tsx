"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js 13+ / `next/router` pour Next.js 12
import { supabase } from "../../../lib/supabase";
import { Link } from "@heroui/link";
import { Form, Input, Button } from "@heroui/react";
import { GoogleIcon } from "../../../components/icons";

export default function SignupPage() {
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);

        const data = Object.fromEntries(new FormData(e.currentTarget));
        const { email, password, username } = data;

        const { error, user } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username }, // Stocke le pseudo dans `user_metadata`
            },
        });

        if (error) {
            setError(error.message);
        } else {
            router.push("/auth/login"); // Redirige vers la connexion
        }
    };

    const handleGoogleSignup = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
        });

        if (error) {
            setError(error.message);
        }
    };

    return (
        <Form
            className="w-full max-w-xs flex flex-col gap-4 items-center justify-center m-auto"
            onSubmit={handleSignup}
        >
            <p className="text-3xl">Inscription</p>

            {error && <p className="text-red-500">{error}</p>}

            <Input
                isRequired
                label="Nom d'utilisateur"
                name="username"
                placeholder="Entrer votre pseudo"
                labelPlacement="outside"
                type="text"
            />

            <Input
                isRequired
                label="Email"
                name="email"
                placeholder="Entrer votre email"
                labelPlacement="outside"
                type="email"
            />

            <Input
                isRequired

                label="Mot de passe"
                name="password"
                placeholder="Créer un mot de passe"
                labelPlacement="outside"
                type="password"
            />

            <p>Déjà un compte ? <Link color="secondary" href="/auth/login">Connexion</Link></p>

            <div className="flex flex-row gap-4">
                <Button color="secondary" type="submit">S'inscrire</Button>

                <Button type="button" variant="flat" onClick={handleGoogleSignup}>
                    <GoogleIcon /> <span className="text-xl">Google</span>
                </Button>
            </div>

        </Form>
    );
}
