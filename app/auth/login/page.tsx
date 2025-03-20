"use client";

import { Link } from "@heroui/link";
import { Form, Input, Button } from "@heroui/react";
import React, { useState } from "react";
import { supabase } from "../../../lib/supabase"; // Assurez-vous d'avoir configuré Supabase
import { GoogleIcon } from "../../../components/icons";

export default function SignupPage() {
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Connexion avec email et mot de passe
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setErrorMessage(error.message);
        } else {
            window.location.href = "/dashboard"; // Redirection après connexion
        }

        setLoading(false);
    };

    // Connexion avec Google
    const signInWithGoogle = async () => {
        setLoading(true);
        setErrorMessage(null);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
        });

        if (error) {
            setErrorMessage(error.message);
        }

        setLoading(false);
    };

    return (
        <Form
            className="w-full max-w-xs flex flex-col gap-4 items-center justify-center m-auto"
            onSubmit={handleLogin}
        >
            <p className="text-3xl">Page de connexion</p>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            <Input
                isRequired
                errorMessage="Merci d'entrer un email valide"
                label="Email"
                labelPlacement="outside"
                name="email"
                placeholder="Entrer votre email"
                type="email"
            />

            <Input
                isRequired
                errorMessage="Merci d'entrer un mot de passe"
                label="Mot de passe"
                labelPlacement="outside"
                name="password"
                placeholder="Entrer votre mot de passe"
                type="password"
            />

            <p>
                Vous n'avez pas de compte ?{" "}
                <Link color="secondary" href="/auth/signup">
                    Inscription
                </Link>
            </p>

            <div className="flex gap-2">
                <Button color="secondary" type="submit" isLoading={loading}>
                    Connexion
                </Button>
                <Button type="reset" variant="flat">
                    Réinitialiser
                </Button>
            </div>

            <Button onClick={signInWithGoogle} variant="flat">
                <GoogleIcon /> <span className="text-xl">Google</span>
            </Button>
        </Form>
    );
}
