"use client";
import {Button, Card, CardFooter, Form, Image, Input, Spacer} from "@heroui/react";
import { useUser } from "@/lib/UserContext";
import {Divider} from "@heroui/divider";
import {CardBody, CardHeader} from "@heroui/card";
import {Link} from "@heroui/link";
import {Chip} from "@heroui/chip";

export default function Dashboard() {
  const { user, loading } = useUser();


  const renderAccountTypeChip = (accountType) => {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const renderRenewType = (renewType) => {
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
    <div className="flex flex-row p-10 flex-wrap gap-16 items-center justify-center">
      <div className="flex flex-col w-1/3 gap-4">
        <Card className="max-w-[400px]">
          <CardHeader className="flex gap-3">
            <Image
                alt="heroui logo"
                height={40}
                radius="sm"
                src={user.user_metadata?.avatar_url}
                width={40}
            />
            <div className="flex flex-col">
              <p className="text-md">{user.user_metadata?.full_name}</p>
              <p className="text-small text-default-500">{user.user_metadata?.email}</p>
            </div>

          </CardHeader>
          <Divider />
          <CardBody>
            <p>Type de compte :</p>
            {renderAccountTypeChip(user.account_type)}
            <Spacer y={2} />
            <p>Renouvellement :</p>
            {renderRenewType(user.renew_type)}
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
            <Button color="secondary">
              Exporter les données
            </Button>
            <Spacer y={2} />
            <Button color="secondary" isDisabled>Activer la mfa ( soon )</Button>
            <Spacer y={2} />
            <Button color="danger">Supprimer le compte</Button>


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
              <p>Le changement de mot est passe est désactivé pour les compte connecté depuis un compte Google.</p>
          ) : (
            <Form onSubmit={renderAccountTypeChip}>
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
              <Button type="submit" color="secondary">Changer</Button>
            </Form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
