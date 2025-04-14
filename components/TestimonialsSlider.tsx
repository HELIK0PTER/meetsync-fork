import React from 'react';
import { Card, CardBody, Avatar, Chip } from "@heroui/react";
import { motion } from "framer-motion";

type Plan = 'Basic' | 'Plus' | 'Pro';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
  plan: Plan;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Martin",
    role: "Organisatrice d'événements",
    content: "MeetSync a révolutionné la façon dont je gère mes réunions. L'interface est intuitive et les fonctionnalités sont exactement ce dont j'avais besoin.",
    avatar: "https://i.pravatar.cc/150?img=32",
    plan: "Pro"
  },
  {
    id: 2,
    name: "Thomas Dubois",
    role: "Chef de projet",
    content: "Un outil indispensable pour notre équipe. La synchronisation des calendriers est parfaite et nous fait gagner un temps précieux.",
    avatar: "https://i.pravatar.cc/150?img=33",
    plan: "Plus"
  },
  {
    id: 3,
    name: "Marie Laurent",
    role: "Consultante",
    content: "Je recommande vivement MeetSync. La planification de réunions n'a jamais été aussi simple et efficace.",
    avatar: "https://i.pravatar.cc/150?img=34",
    plan: "Basic"
  },
  {
    id: 4,
    name: "Lucas Bernard",
    role: "Entrepreneur",
    content: "Une solution élégante qui répond parfaitement à nos besoins. L'équipe adore l'utiliser au quotidien.",
    avatar: "https://i.pravatar.cc/150?img=35",
    plan: "Pro"
  }
];

const planColors: Record<Plan, "default" | "secondary" | "primary"> = {
  Basic: "default",
  Plus: "secondary",
  Pro: "primary"
};

export default function TestimonialsSlider() {
  return (
    <div className="relative overflow-hidden w-full py-10">
      <div className="flex gap-8 animate-scroll">
        {[...testimonials, ...testimonials].map((testimonial, index) => (
          <Card 
            key={`${testimonial.id}-${index}`}
            className="min-w-[300px] max-w-[300px] bg-content1"
          >
            <CardBody className="gap-4">
              <div className="flex gap-3 items-center">
                <Avatar src={testimonial.avatar} size="lg" />
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-small text-default-500">{testimonial.role}</p>
                  <Chip 
                    size="sm" 
                    variant="flat" 
                    color={planColors[testimonial.plan]}
                    className="mt-1"
                  >
                    Plan {testimonial.plan}
                  </Chip>
                </div>
              </div>
              <p className="text-default-500">{testimonial.content}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
