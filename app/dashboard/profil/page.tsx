"use client";

import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { useDisclosure } from "@heroui/use-disclosure";
import { Spacer } from "@heroui/spacer";
import Link from "next/link";

import { Form, Input } from "@heroui/react";
import { Divider } from "@heroui/divider";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { SUBSCRIPTION_PLANS } from '@/utils/subscription-plans';

export default function Dashboard() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();

  const [portalOrPlanLoading, setPortalOrPlanLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    };

    const fetchProfile = async () => {
      const user = await fetchUser()
      const { data : profile, } = await supabase.from("profiles").select("*").eq("id", user?.id).single();
      return { user, profile };
    };
    fetchProfile().then(({ user, profile }) => {
      setUser(user);
      setProfile(profile);
    });
  }, []);

  if (!user || !profile) {
    return null;
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        alert("Veuillez sélectionner une image");
        return;
      }

      // Vérifier la taille du fichier (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("L'image ne doit pas dépasser 2MB");
        return;
      }

      // Upload dans Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obtenir l'URL publique
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      // Mettre à jour les métadonnées de l'utilisateur
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });

      if (updateError) {
        throw updateError;
      }

      // Recharger la page pour voir les changements
      window.location.reload();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du changement d'avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setExporting(true);

      // Récupérer les données du profil
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Erreur profil:", profileError);
        throw new Error("Erreur lors de la récupération du profil");
      }

      let exportData = {
        profile: {
          ...profileData,
          email: user.email,
          created_at: user.created_at,
          last_sign_in: user.last_sign_in_at,
          user_metadata: user.user_metadata,
        },
        created_meetings: [] as any[],
        meeting_participations: [] as any[],
      };

      try {
        // Essayer de récupérer les réunions créées par l'utilisateur
        const { data: createdMeetings, error: meetingsError } = await supabase
          .from("meetings")
          .select("*")
          .eq("creator_id", user.id);

        if (!meetingsError && createdMeetings) {
          exportData.created_meetings = createdMeetings;
        }
      } catch (error) {
        console.error("Erreur meetings:", error);
        // Continue même si cette partie échoue
      }

      try {
        // Essayer de récupérer les participations aux réunions
        const { data: participations, error: participationsError } =
          await supabase
            .from("meeting_participants")
            .select(
              `
            *,
            meeting:meetings(*)
          `
            )
            .eq("user_id", user.id);

        if (!participationsError && participations) {
          exportData.meeting_participations = participations;
        }
      } catch (error) {
        console.error("Erreur participations:", error);
        // Continue même si cette partie échoue
      }

      // Convertir en fichier et télécharger
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      const date = new Date().toLocaleDateString("fr-FR").replace(/\//g, "-");
      link.download = `meetsync-data-export-${date}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'export des données"
      );
    } finally {
      setExporting(false);
    }
  };

  const handlePortalOrPlan = async () => {
    setPortalOrPlanLoading(true);
    try {
      // Si l'utilisateur a un abonnement actif (plus/pro), on ouvre le portail Stripe
      if (profile.subscription_plan && profile.subscription_plan !== 'basic') {
        const res = await fetch('/api/create-customer-portal-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert('Erreur lors de la redirection vers le portail Stripe');
        }
      } else {
        // Sinon, on redirige vers la page de choix de plan
        window.location.href = '/dashboard/plan';
      }
    } catch (e) {
      alert('Erreur lors de la redirection');
    } finally {
      setPortalOrPlanLoading(false);
    }
  };

  const renderAccountTypeChip = (accountType: string) => {
    switch (accountType) {
      case "basic":
        return <Chip color="default">Basic</Chip>;
      case "plus":
        return <Chip color="warning">Plus</Chip>;
      case "pro":
        return <Chip color="danger">Pro</Chip>;
      case "admin":
        return <Chip color="success">Admin</Chip>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const renderRenewType = (renewType: number) => {
    switch (renewType) {
      case 0:
        return <Chip color="default">Aucun</Chip>;
      case 1:
        return <Chip color="default">Mensuel</Chip>;
      case 2:
        return <Chip color="default">Annuel</Chip>;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-row p-10 flex-wrap gap-16 items-center justify-center">
      <div className="flex flex-col w-1/3 gap-4">
        <Card className="max-w-[400px]">
          <CardHeader className="flex gap-3">
            <Avatar
              alt="Photo de profil"
              size="md"
              src={user.user_metadata?.avatar_url}
              isBordered
              className="cursor-pointer hover:opacity-80"
              onClick={handleAvatarClick}
            />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            <div className="flex flex-col">
              <p className="text-md">
                {user.user_metadata?.username || user.user_metadata?.full_name}
              </p>
              <p className="text-small text-default-500">
                {user.user_metadata?.email}
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p>Type de compte :</p>
            {renderAccountTypeChip(profile.subscription_plan)}
            <Spacer y={2} />
            <p>Fin d'abonnement :</p>
            {renderRenewType(profile.renew_type)}
            <Spacer y={2} />
            <p>Date de Création :</p>
            <Chip color="default"> {formatDate(user.created_at)} </Chip>
          </CardBody>
        </Card>
        <Card className="max-w-[400px]">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-xl">Gestion du compte</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <Button
              color="secondary"
              onClick={handleExportData}
              isLoading={exporting}
            >
              {exporting ? "Export en cours..." : "Exporter les données"}
            </Button>
            <Spacer y={2} />
            <Button color="secondary" isDisabled>
              Activer la mfa ( soon )
            </Button>
            <Spacer y={2} />
            <Button color="secondary" onClick={handlePortalOrPlan} isLoading={portalOrPlanLoading}>
              {profile.subscription_plan && profile.subscription_plan !== 'basic'
                ? 'Gérer mon abonnement Stripe'
                : 'Souscrire à un abonnement'}
            </Button>
            <Spacer y={2} />
            <Button color="danger" onClick={onOpen} isLoading={deleting}>
              {deleting ? "Suppression en cours..." : "Supprimer le compte"}
            </Button>
          </CardBody>
        </Card>
      </div>
      <Card className="max-w-[400px]  w-1/3">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-xl">Changer de mot de passe</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          {user.app_metadata?.provider === "google" ? (
            <p>
              Le changement de mot est passe est désactivé pour les compte
              connecté depuis un compte Google.
            </p>
          ) : (
            <Form onSubmit={(e) => e.preventDefault()}>
              <Input
                isRequired
                errorMessage="Merci d'entrer un mot de passe valide"
                label="Ancien mot de passe"
                labelPlacement="outside"
                name="password"
                placeholder="Entrer votre ancien mot de passe"
                type="password"
              />
              <Input
                isRequired
                errorMessage="Merci d'entrer un mot de passe valide"
                label="Mot de passe"
                labelPlacement="outside"
                name="password"
                placeholder="Entrer votre mot de passe"
                type="password"
              />
              <Input
                isRequired
                errorMessage="Merci d'entrer un mot de passe valide"
                label="Confirmer le mot de passe"
                labelPlacement="outside"
                name="password"
                placeholder="Confirmer votre mot de passe"
                type="password"
              />
              <Button type="submit" color="secondary">
                Changer
              </Button>
            </Form>
          )}
        </CardBody>
      </Card>

      {/* Modal de confirmation */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Confirmer la suppression</ModalHeader>
          <ModalBody>
            <p>
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est
              irréversible.
            </p>
            <p>Toutes vos données seront supprimées définitivement :</p>
            <ul className="list-disc pl-6">
              <li>Votre profil</li>
              <li>Vos réunions créées</li>
              <li>Vos participations aux réunions</li>
              <li>Votre avatar</li>
            </ul>
          </ModalBody>
          <ModalFooter>
            <Button color="default" onClick={onClose}>
              Annuler
            </Button>
            <Button color="danger">Supprimer définitivement</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
