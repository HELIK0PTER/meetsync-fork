import {subtitle, title} from "@/components/primitives";
import {Link} from "@heroui/link";
import {siteConfig} from "@/config/site";
import { button as buttonStyles } from "@heroui/theme";
import { CiCirclePlus  } from 'react-icons/ci';

export default function Dashboard() {
    return (
        <div className="flex items-center justify-center m-auto  w-full h-full min-h-screen">
            <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <div className="inline-block max-w-xl text-center justify-center">
                    <span className={title()}>Bienvenue sur&nbsp;</span>
                    <span className={title({color: "violet"})}>MeetSync&nbsp;</span>
                    <span className={title()}>!&nbsp;</span>
                    <div className={subtitle({class: "mt-4"})}>
                        Vous venez d’arriver ? Commencez par crée un événements.
                    </div>
                </div>

                <div className="flex gap-3">
                    <Link
                        className={buttonStyles({
                            color: "secondary",
                            radius: "full",
                            variant: "shadow",
                        })}
                        href="/dashboard/create"
                    >
                        <CiCirclePlus className="text-3xl"/> Creer un événements
                    </Link>
                </div>
            </div>
        </div>
    );
}