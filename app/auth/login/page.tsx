"use client";

import { NewLink } from "@/components/ui/link";
import { Form, Input, Button } from "@heroui/react";
import React, { use, useState } from "react";

import { GoogleIcon } from "@/components/icons";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type Props = {
  searchParams: Promise<any>;
};

export default function LoginPage({ searchParams }: Props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const redirect = use(searchParams)?.redirect || "/dashboard";

  const supabase = createClient();

  // Connexion avec email et mot de passe
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setErrorMessage("Merci d'entrer un email et un mot de passe");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email as string,
      password: password as string,
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      router.push(redirect);
    }

    setLoading(false);
  };

  // Connexion avec Google
  const signInWithGoogle = async () => {
    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
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
        <NewLink color="secondary" href="/auth/signup">
          Inscription
        </NewLink>
      </p>

      <div className="flex gap-2">
        <Button color="secondary" type="submit" isLoading={loading}>
          Connexion
        </Button>
        <Button type="reset" variant="flat">
          Réinitialiser
        </Button>
      </div>

      <Button onClick={signInWithGoogle} variant="flat" className="py-6">
        <GoogleIcon /> <span className="text-xl">Google</span>
      </Button>
    </Form>
  );
}
