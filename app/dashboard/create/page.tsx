"use client"

import {subtitle, title} from "@/components/primitives";
import {Link} from "@heroui/link";
import {siteConfig} from "@/config/site";
import { button as buttonStyles } from "@heroui/theme";
import { CiCirclePlus  } from 'react-icons/ci';
import {Button, DatePicker, Form, Input, Spacer, Checkbox} from "@heroui/react";
import React from "react";
import {getLocalTimeZone, now} from "@internationalized/date";
import {Divider} from "@heroui/divider";
import {I18nProvider} from "@react-aria/i18n";

export default function Dashboard() {
    const [action, setAction] = React.useState<string | null>(null);
    const [isPaid, setIsPaid] = React.useState(false);
    const [price, setPrice] = React.useState("");
    const [paypalEmail, setPaypalEmail] = React.useState("");
    const [isReminderDisabled, setIsReminderDisabled] = React.useState(true);
    const [isEmailDisabled, setIsEmailDisabled] = React.useState(true);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setIsPaid(checked);
        if (!checked) {
            setPrice("");
            setPaypalEmail("");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center m-auto  w-full pb-10 h-full pt-10 min-h-screen">
            <span className={title({color: "violet"})}>Création d'événements&nbsp;</span>
            <Spacer y={4} />
            <Form
                className="w-full max-w-xs flex flex-col gap-4"
                onReset={() => setAction("reset")}
                onSubmit={(e) => {
                    e.preventDefault();
                    let data = Object.fromEntries(new FormData(e.currentTarget));

                    setAction(`submit ${JSON.stringify(data)}`);
                }}
            >
                <Input
                    isRequired
                    errorMessage="Merci d'entrer un nom d'événements valide"
                    label="Nom de l'événement"
                    labelPlacement="outside"
                    name="username"
                    placeholder="Entré le nom de l'événements"
                    type="text"
                />

                <I18nProvider locale="fr">
                    <DatePicker
                        hideTimeZone
                        showMonthAndYearPickers
                        defaultValue={now(getLocalTimeZone())}
                        label="date de l'événéments"
                        variant="bordered"
                    />
                </I18nProvider>
                <Divider />
                <p className="text-xl">Emplacement</p>

                <Input
                    isRequired
                    errorMessage="Merci d'entrer un nom d'événements valide"
                    label="Pays"
                    labelPlacement="outside"
                    name="pays"
                    placeholder="Entré le pays de l'événement"
                    type="text"
                />

                <Input
                    isRequired
                    errorMessage="Merci d'entrer un nom d'événements valide"
                    label="Ville"
                    labelPlacement="outside"
                    name="ville"
                    placeholder="Entrer le nom de la ville"
                    type="text"
                />

                <Input
                    isRequired
                    errorMessage="Merci d'entrer un nom d'événements valide"
                    label="Rue"
                    labelPlacement="outside"
                    name="username"
                    placeholder="Entrer le nom de la rue et le numéro"
                    type="text"
                />

                <Divider />
                <p className="text-xl">Autres</p>

                <Checkbox
                    isSelected={isPaid}
                    onChange={handleCheckboxChange}
                >
                    Événement payant
                </Checkbox>

                {isPaid && (
                    <>
                        <Input
                            isRequired
                            errorMessage="Merci d'entrer un prix valide"
                            label="Prix"
                            labelPlacement="outside"
                            name="prix"
                            placeholder="Entrer le prix de l'événement"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <Input
                            isRequired
                            errorMessage="Merci d'entrer un email PayPal valide"
                            label="Email PayPal"
                            labelPlacement="outside"
                            name="paypalEmail"
                            placeholder="Entrer l'email PayPal du vendeur"
                            type="email"
                            value={paypalEmail}
                            onChange={(e) => setPaypalEmail(e.target.value)}
                        />
                    </>
                )}

                <Checkbox
                    isDisabled={isReminderDisabled}
                    onClick={() => setIsReminderDisabled(!isReminderDisabled)}
                >
                    Rappel automatique
                </Checkbox>
                <p className="text-gray-500 text-xs">
                    Rappel automatique est seulement pour les offres <span className="text-violet-500">Plus</span> et <span className="text-violet-500">Pro</span>
                </p>

                <Checkbox
                    isDisabled={isEmailDisabled}
                    onClick={() => setIsEmailDisabled(!isEmailDisabled)}
                >
                    Email personnalisé
                </Checkbox>
                <p className="text-gray-500 text-xs">
                    Email personnalisé est seulement pour les offres <span className="text-violet-500">Pro</span>
                </p>

                <div className="flex gap-2">
                    <Button color="secondary" type="submit">
                        Submit
                    </Button>
                    <Button type="reset" variant="flat">
                        Reset
                    </Button>
                </div>
                {action && (
                    <div className="text-small text-default-500">
                        Action: <code>{action}</code>
                    </div>
                )}
            </Form>
        </div>
    );
}