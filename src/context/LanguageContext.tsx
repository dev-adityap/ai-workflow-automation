// src/context/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<string, string>> = {
  English: {
    dashboard: 'Dashboard',
    builder: 'Builder',
    templates: 'Templates',
    connectedApps: 'Connected Apps',
    executionLogs: 'Execution Logs',
    analytics: 'Analytics',
    settings: 'Settings',
    profile: 'Profile',
    monitoring: 'Monitoring',
    account: 'Account',
    searchPlaceholder: 'Search workflows, logs, settings...',
    systemOnline: 'System Online',
    settingsTitle: 'Settings',
    settingsSubtitle: 'Manage your application preferences and system configurations.',
  },
  Spanish: {
    dashboard: 'Panel',
    builder: 'Constructor',
    templates: 'Plantillas',
    connectedApps: 'Apps Conectadas',
    executionLogs: 'Registros',
    analytics: 'Analítica',
    settings: 'Ajustes',
    profile: 'Perfil',
    monitoring: 'Monitoreo',
    account: 'Cuenta',
    searchPlaceholder: 'Buscar flujos, registros, ajustes...',
    systemOnline: 'Sistema en Línea',
    settingsTitle: 'Ajustes',
    settingsSubtitle: 'Administre las preferencias de su aplicación y la configuración del sistema.',
  },
  French: {
    dashboard: 'Tableau de bord',
    builder: 'Constructeur',
    templates: 'Modèles',
    connectedApps: 'Applications',
    executionLogs: 'Journaux',
    analytics: 'Analytique',
    settings: 'Paramètres',
    profile: 'Profil',
    monitoring: 'Surveillance',
    account: 'Compte',
    searchPlaceholder: 'Rechercher des flux...',
    systemOnline: 'En ligne',
    settingsTitle: 'Paramètres',
    settingsSubtitle: 'Gérez les préférences de votre application et les configurations système.',
  },
  German: {
    dashboard: 'Dashboard',
    builder: 'Baukasten',
    templates: 'Vorlagen',
    connectedApps: 'Verbundene Apps',
    executionLogs: 'Protokolle',
    analytics: 'Analytik',
    settings: 'Einstellungen',
    profile: 'Profil',
    monitoring: 'Überwachung',
    account: 'Konto',
    searchPlaceholder: 'Suchen...',
    systemOnline: 'System Online',
    settingsTitle: 'Einstellungen',
    settingsSubtitle: 'Verwalten Sie Ihre Anwendungseinstellungen und Systemkonfigurationen.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('app_language');
      return saved || 'English';
    } catch {
      return 'English';
    }
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  const setLanguage = (lang: string) => {
    if (translations[lang]) {
      setLanguageState(lang);
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['English']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};