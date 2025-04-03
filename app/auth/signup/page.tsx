"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js 13+ / `next/router` pour Next.js 12
import { Link } from "@heroui/link";
import { Form, Input, Button } from "@heroui/react";

import { supabase } from "@/lib/supabase";
import { GoogleIcon } from "@/components/icons";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string>("");
  const router = useRouter();

  const validatePassword = (password: string, confirmPassword: string): string => {
    if (password !== confirmPassword) {
      return "Les mots de passe ne correspondent pas";
    }
    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }
    if (!/[A-Z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une majuscule";
    }
    if (!/[a-z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une minuscule";
    }
    if (!/[0-9]/.test(password)) {
      return "Le mot de passe doit contenir au moins un chiffre";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Le mot de passe doit contenir au moins un symbole";
    }
    return "";
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setPasswordError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const username = formData.get('username') as string;

    const passwordValidationError = validatePassword(password, confirmPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: username
        },
      },
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message || "Erreur lors de la création du compte");
      return;
    }

    router.push("/auth/login");
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
      {passwordError && <p className="text-red-500">{passwordError}</p>}

      <Input
        isRequired
        label="Nom d'utilisateur"
        labelPlacement="outside"
        name="username"
        placeholder="Entrer votre pseudo"
        type="text"
      />

      <Input
        isRequired
        label="Email"
        labelPlacement="outside"
        name="email"
        placeholder="Entrer votre email"
        type="email"
      />

      <Input
        isRequired
        label="Mot de passe"
        labelPlacement="outside"
        name="password"
        placeholder="Créer un mot de passe"
        type="password"
        description="8 caractères minimum avec majuscule, minuscule, chiffre et symbole"
      />

      <Input
        isRequired
        label="Confirmer le mot de passe"
        labelPlacement="outside"
        name="confirmPassword"
        placeholder="Confirmer votre mot de passe"
        type="password"
      />

      <p>
        Déjà un compte ?{" "}
        <Link color="secondary" href="/auth/login">
          Connexion
        </Link>
      </p>

      <div className="flex flex-row gap-4">
        <Button color="secondary" type="submit" className="py-6">
          S&#39;inscrire
        </Button>

        <Button
          className="py-6"
          type="button"
          variant="flat"
          onPress={handleGoogleSignup}
        >
          <GoogleIcon /> <span className="text-xl">Google</span>
        </Button>
      </div>
    </Form>
  );
}
