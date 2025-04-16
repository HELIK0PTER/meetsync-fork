"use client";

import { Button } from "@heroui/button";
import React, { useState } from "react";

import { GoogleIcon } from "@/components/icons";
import { createClient } from "@/utils/supabase/client";

const GoogleButton = () => {

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = createClient();

  // Connexion avec Google
  const signInWithGoogle = async () => {
    setLoading(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <Button isLoading variant="flat" className="py-6">
        <GoogleIcon /> <span className="text-xl">Google</span>
      </Button>
    );
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <Button onPress={() => {signInWithGoogle}} variant="flat" className="py-6">
      <GoogleIcon /> <span className="text-xl">Google</span>
    </Button>
  );
};

export default GoogleButton;
