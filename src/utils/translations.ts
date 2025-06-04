export const translations = {
  fr: {
    navbar: {
      home: 'Accueil',
      portfolio: 'Portfolio',
      about: 'À propos'
    },
    hero: {
      contact: 'Me contacter',
      viewPortfolio: 'Voir mon portfolio'
    },
    admin: {
      title: 'Administration',
      subtitle: 'Gérez vos projets et expériences depuis cette interface.',
      manageTools: 'Gérer les logiciels',
      manageRoles: 'Gérer les rôles'
    }
  },
  en: {
    navbar: {
      home: 'Home',
      portfolio: 'Portfolio',
      about: 'About'
    },
    hero: {
      contact: 'Contact me',
      viewPortfolio: 'View portfolio'
    },
    admin: {
      title: 'Administration',
      subtitle: 'Manage your projects and experiences from this interface.',
      manageTools: 'Manage tools',
      manageRoles: 'Manage roles'
    }
  }
} as const;

export type TranslationKey = keyof typeof translations['fr'];
