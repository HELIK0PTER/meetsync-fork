"use client";

import { title } from "@/components/primitives";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Spacer,
  Checkbox,
} from "@heroui/react";
import React from "react";
import { getLocalTimeZone, now } from "@internationalized/date";
import { Divider } from "@heroui/divider";
import { I18nProvider } from "@react-aria/i18n";
import { useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

export default function Dashboard() {
  const [isPaid, setIsPaid] = React.useState(false);
  const [price, setPrice] = React.useState("");
  const [paypalEmail, setPaypalEmail] = React.useState("");
  const [hasReminder, setHasReminder] = React.useState(false);
  const [isEmailDisabled, setIsEmailDisabled] = React.useState(true);
  const [isPublic, setIsPublic] = React.useState(false);

  const [userId, setUserId] = React.useState<String | null>(null);

  const supabase = createClient();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    };
    fetchUser().then((user) => {
      if (user) {
        setUserId(user.id);
      } else {
        setUserId(null);
      }
    });
  }, [supabase]);

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center m-auto  w-full pb-10 h-full pt-10 min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsPaid(checked);
    if (!checked) {
      setPrice("");
      setPaypalEmail("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    let data = Object.fromEntries(new FormData(e.currentTarget));
    console.log(data);
    console.log(userId);
    console.log(isPublic);
    console.log(hasReminder);

    const { data: inserted, error } = await supabase
      .from("event")
      .insert({
        event_name: data.event_name,
        event_date: data.event_date.toString().split("T")[0],
        country: data.country,
        city: data.city,
        rue: data.rue,
        price: data.price,
        paypal_email: data.paypal_email,
        owner_id: userId,
        has_reminder: hasReminder,
        is_public: isPublic,
      })
      .select();

    if (error) {
      setIsSubmitting(false);
      console.error(error);
      return;
    }
    // On récupère l'id de l'événement créé
    const eventId = inserted && inserted[0]?.id;
    // Attendre 1 seconde puis rediriger
    setTimeout(() => {
      setIsSubmitting(false);
      if (eventId) {
        router.push(`/dashboard/my_event/${eventId}`);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center m-auto w-full pb-10 h-full pt-10 min-h-screen relative overflow-hidden">
      {/* Éléments décoratifs animés */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Cercles lumineux */}
        <div className="absolute left-0 top-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Lignes animées */}
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent animate-pulse"></div>
        <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-pink-500/20 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Particules flottantes */}
        <div className="absolute left-10 top-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-float"></div>
        <div className="absolute right-20 top-3/4 w-2 h-2 bg-purple-400/30 rounded-full animate-float" style={{ animationDelay: '1.1s' }}></div>
        <div className="absolute left-1/3 top-1/2 w-2 h-2 bg-indigo-400/30 rounded-full animate-float" style={{ animationDelay: '1.3s' }}></div>
      </div>

      <div className="w-full max-w-xl mx-auto px-4 relative">
        <div className="text-center mb-8">
          <span className={title({ color: "violet" })}>
            Création d'événements&nbsp;
          </span>
          <p className="text-gray-400 mt-2">Remplissez les informations ci-dessous pour créer votre événement</p>
        </div>
        <Spacer y={4} />
        {isSubmitting && (
          <div className="flex flex-col items-center justify-center w-full py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-white">Création de l'événement...</p>
          </div>
        )}
        {!isSubmitting && (
          <Form
            className="w-full flex flex-col gap-8 items-center"
            onSubmit={handleSubmit}
          >
            <div className="space-y-6 w-full max-w-md">
              <Input
                isRequired
                errorMessage="Merci d'entrer un nom d'événement valide"
                label="Nom de l'événement"
                labelPlacement="outside"
                name="event_name"
                placeholder="Nom de l'événement"
                type="text"
                classNames={{
                  input: "bg-black/40 border-neutral-800",
                  label: "text-gray-300"
                }}
              />

              <I18nProvider locale="fr">
                <DatePicker
                  hideTimeZone
                  showMonthAndYearPickers
                  defaultValue={now(getLocalTimeZone())}
                  minValue={now(getLocalTimeZone())}
                  label="Date de l'événement"
                  name="event_date"
                  variant="bordered"
                  classNames={{
                    input: "bg-black/40 border-neutral-800",
                    label: "text-gray-300",
                    calendar: "text-white"
                  }}
                />
              </I18nProvider>

              <Input
                isRequired
                errorMessage="Merci d'entrer un pays valide"
                label="Pays"
                labelPlacement="outside"
                name="country"
                placeholder="Pays"
                type="text"
                classNames={{
                  input: "bg-black/40 border-neutral-800",
                  label: "text-gray-300"
                }}
              />

              <Input
                isRequired
                errorMessage="Merci d'entrer une ville valide"
                label="Ville"
                labelPlacement="outside"
                name="city"
                placeholder="Ville"
                type="text"
                classNames={{
                  input: "bg-black/40 border-neutral-800",
                  label: "text-gray-300"
                }}
              />

              <Input
                isRequired
                errorMessage="Merci d'entrer une adresse valide"
                label="Rue"
                labelPlacement="outside"
                name="rue"
                placeholder="Rue et numéro"
                type="text"
                classNames={{
                  input: "bg-black/40 border-neutral-800",
                  label: "text-gray-300"
                }}
              />
            </div>

            <Divider className="my-2 w-full max-w-md" />
            
            <div className="space-y-6 w-full max-w-md">
              <div className="flex flex-col gap-6">
                <Checkbox 
                  isSelected={isPublic} 
                  onChange={() => setIsPublic(!isPublic)}
                  classNames={{
                    label: "text-gray-300 text-lg",
                    wrapper: "border-2 border-purple-500/30 rounded-lg p-2"
                  }}
                >
                  Événement public
                </Checkbox>

                <div className="flex flex-col gap-6">
                  <Checkbox 
                    isSelected={isPaid} 
                    onChange={handleCheckboxChange}
                    classNames={{
                      label: "text-gray-300 text-lg",
                      wrapper: "border-2 border-purple-500/30 rounded-lg p-2"
                    }}
                  >
                    Événement payant
                  </Checkbox>

                  {isPaid && (
                    <div className="flex flex-col gap-6 ml-6 border-l-2 border-purple-500/20 pl-4">
                      <div>
                        <Input
                          isRequired
                          errorMessage="Merci d'entrer un prix valide"
                          label="Prix"
                          labelPlacement="outside"
                          name="price"
                          placeholder="Prix en euros"
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          classNames={{
                            input: "bg-black/40 border-neutral-800",
                            label: "text-gray-300"
                          }}
                        />
                      </div>
                      <div>
                        <Input
                          isRequired
                          errorMessage="Merci d'entrer un email PayPal valide"
                          label="Email PayPal"
                          labelPlacement="outside"
                          name="paypal_email"
                          placeholder="Email PayPal"
                          type="email"
                          value={paypalEmail}
                          onChange={(e) => setPaypalEmail(e.target.value)}
                          classNames={{
                            input: "bg-black/40 border-neutral-800",
                            label: "text-gray-300"
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Checkbox 
                  onClick={() => setHasReminder(!hasReminder)}
                  classNames={{
                    label: "text-gray-300 text-lg",
                    wrapper: "border-2 border-purple-500/30 rounded-lg p-2"
                  }}
                >
                  Rappel automatique
                </Checkbox>
              </div>

              <div className="space-y-2 text-center">
                <Checkbox
                  isDisabled={isEmailDisabled}
                  onClick={() => setIsEmailDisabled(!isEmailDisabled)}
                  classNames={{
                    label: "text-gray-300"
                  }}
                >
                  Email personnalisé
                </Checkbox>
                <p className="text-gray-500 text-xs">
                  Email personnalisé est seulement pour les offres{" "}
                  <span className="text-purple-400">Pro</span>
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center w-full max-w-md">
              <Button 
                type="reset" 
                variant="flat"
                className="bg-black/40 hover:bg-black/60 text-gray-300 border border-neutral-800"
              >
                Réinitialiser
              </Button>
              <Button 
                color="secondary" 
                type="submit"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                Créer l'événement
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
}
