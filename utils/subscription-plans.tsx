export const SUBSCRIPTION_PLANS = {
    BASIC: {
        id: 'basic',
        name: 'Basic',
        price: 0,
        stripePriceId: 'price_1RSftGRLiPMLnwACcWJsidWR',
        features: [
            'Création d\'événements basiques',
            'Gestion des participants',
            'Notifications par email'
        ]
    },
    PLUS: {
        id: 'plus',
        name: 'Plus',
        price: 9.99,
        stripePriceId: 'price_1RSftdRLiPMLnwACCyXtCo6j', // À remplacer par votre ID Stripe
        features: [
            'Tout du plan Basic',
            'Personnalisation avancée',
            'Statistiques détaillées',
            'Support prioritaire'
        ]
    },
    PRO: {
        id: 'pro',
        name: 'Pro',
        price: 19.99,
        stripePriceId: 'price_1RSftwRLiPMLnwACVVv1fMhA', // À remplacer par votre ID Stripe
        features: [
            'Tout du plan Plus',
            'API personnalisée',
            'Intégrations avancées',
            'Support 24/7'
        ]
    }
} as const;

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS;