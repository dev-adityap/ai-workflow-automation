// src/pages/Settings.tsx
import { useState } from 'react';
import { Save, RotateCcw, Shield, Bell, Palette, Globe, Key } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

interface SettingsState {
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  workflowAlerts: boolean;
  executionAlerts: boolean;
  compactSidebar: boolean;
  animations: boolean;
  twoFactor: boolean;
  geminiKey: string;
  webhookUrl: string;
  openaiKey: string;
  [key: string]: any;
}

export const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const { language, setLanguage, t } = useLanguage();

  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const saved = localStorage.getItem('app_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            language: parsed.language || language,
            timezone: parsed.timezone || 'UTC (Coordinated Universal Time)',
            emailNotifications: !!parsed.emailNotifications,
            pushNotifications: !!parsed.pushNotifications,
            workflowAlerts: !!parsed.workflowAlerts,
            executionAlerts: !!parsed.executionAlerts,
            compactSidebar: !!parsed.compactSidebar,
            animations: parsed.animations !== false,
            twoFactor: !!parsed.twoFactor,
            geminiKey: parsed.geminiKey || 'AIzaSyD-mock-gemini-key-12345',
            webhookUrl: parsed.webhookUrl || 'https://api.aiworkflow.io/v1/webhook/hook_98765',
            openaiKey: parsed.openaiKey || 'sk-proj-mock-openai-key-98765',
          };
        }
      }
    } catch {
      // fallback
    }
    return {
      language: language,
      timezone: 'UTC (Coordinated Universal Time)',
      emailNotifications: true,
      pushNotifications: false,
      workflowAlerts: true,
      executionAlerts: true,
      compactSidebar: false,
      animations: true,
      twoFactor: false,
      geminiKey: 'AIzaSyD-mock-gemini-key-12345',
      webhookUrl: 'https://api.aiworkflow.io/v1/webhook/hook_98765',
      openaiKey: 'sk-proj-mock-openai-key-98765',
    };
  });

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === 'language') {
        setLanguage(value);
      }
      return updated;
    });
  };

  const handleSave = () => {
    try {
      localStorage.setItem('app_settings', JSON.stringify(settings));
      setLanguage(settings.language);
      window.dispatchEvent(new Event('app-settings-changed'));
      showToast('Settings saved successfully to Local Storage!', 'success');
    } catch {
      showToast('Failed to save settings.', 'error');
    }
  };

  const handleReset = () => {
    localStorage.removeItem('app_settings');
    setSettings({
      language: 'English',
      timezone: 'UTC (Coordinated Universal Time)',
      emailNotifications: true,
      pushNotifications: false,
      workflowAlerts: true,
      executionAlerts: true,
      compactSidebar: false,
      animations: true,
      twoFactor: false,
      geminiKey: 'AIzaSyD-mock-gemini-key-12345',
      webhookUrl: 'https://api.aiworkflow.io/v1/webhook/hook_98765',
      openaiKey: 'sk-proj-mock-openai-key-98765',
    });
    setLanguage('English');
    window.dispatchEvent(new Event('app-settings-changed'));
    showToast('Settings reset to defaults.', 'info');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text">{t('settingsTitle')}</h1>
          <p className="text-secondary-text mt-1">{t('settingsSubtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-secondary-background hover:bg-border text-text rounded-xl font-medium transition-colors border border-border cursor-pointer text-sm"
          >
            <RotateCcw size={16} /> {t('reset')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-blue-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary/20 cursor-pointer text-sm"
          >
            <Save size={16} /> {t('saveChanges')}
          </button>
        </div>
      </div>

      {/* General Section */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary"><Globe size={20} /></div>
          <h2 className="text-lg font-semibold text-text">{t('generalPreferences')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">{t('languageLabel')}</label>
            <select
              name="settings_language"
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="English" className="bg-card text-text py-1">English</option>
              <option value="Spanish" className="bg-card text-text py-1">Spanish</option>
              <option value="French" className="bg-card text-text py-1">French</option>
              <option value="German" className="bg-card text-text py-1">German</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">{t('timezoneLabel')}</label>
            <select
              name="settings_timezone"
              value={settings.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="UTC (Coordinated Universal Time)" className="bg-card text-text py-1">UTC (Coordinated Universal Time)</option>
              <option value="EST (Eastern Standard Time)" className="bg-card text-text py-1">EST (Eastern Standard Time)</option>
              <option value="PST (Pacific Standard Time)" className="bg-card text-text py-1">PST (Pacific Standard Time)</option>
              <option value="IST (Indian Standard Time)" className="bg-card text-text py-1">IST (Indian Standard Time)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="p-2 bg-warning/10 rounded-lg text-warning"><Bell size={20} /></div>
          <h2 className="text-lg font-semibold text-text">{t('notifications')}</h2>
        </div>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', labelKey: 'emailNotifications', descKey: 'emailNotificationsDesc' },
            { key: 'pushNotifications', labelKey: 'pushNotifications', descKey: 'pushNotificationsDesc' },
            { key: 'workflowAlerts', labelKey: 'workflowAlerts', descKey: 'workflowAlertsDesc' },
            { key: 'executionAlerts', labelKey: 'executionAlerts', descKey: 'executionAlertsDesc' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-text">{t(item.labelKey)}</p>
                <p className="text-xs text-secondary-text">{t(item.descKey)}</p>
              </div>
              <input
                type="checkbox"
                name={item.key}
                checked={!!settings[item.key]}
                onChange={(e) => handleChange(item.key, e.target.checked)}
                className="w-5 h-5 accent-primary cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Appearance Section */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="p-2 bg-success/10 rounded-lg text-success"><Palette size={20} /></div>
          <h2 className="text-lg font-semibold text-text">{t('appearance')}</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-text">{t('darkMode')}</p>
              <p className="text-xs text-secondary-text">{t('darkModeDesc')}</p>
            </div>
            <input
              type="checkbox"
              name="dark_mode_toggle"
              checked={theme === 'dark'}
              onChange={toggleTheme}
              className="w-5 h-5 accent-primary cursor-pointer"
            />
          </div>
          {[
            { key: 'compactSidebar', labelKey: 'compactSidebar', descKey: 'compactSidebarDesc' },
            { key: 'animations', labelKey: 'uiAnimations', descKey: 'uiAnimationsDesc' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-text">{t(item.labelKey)}</p>
                <p className="text-xs text-secondary-text">{t(item.descKey)}</p>
              </div>
              <input
                type="checkbox"
                name={item.key}
                checked={!!settings[item.key]}
                onChange={(e) => handleChange(item.key, e.target.checked)}
                className="w-5 h-5 accent-primary cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="p-2 bg-error/10 rounded-lg text-error"><Shield size={20} /></div>
          <h2 className="text-lg font-semibold text-text">{t('security')}</h2>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-text">{t('changePassword')}</p>
            <p className="text-xs text-secondary-text">{t('changePasswordDesc')}</p>
          </div>
          <button
            type="button"
            onClick={() => showToast('Password reset link sent to your email.', 'info')}
            className="px-4 py-2 bg-secondary-background hover:bg-border text-text rounded-xl text-sm font-medium transition-colors border border-border cursor-pointer"
          >
            {t('updatePassword')}
          </button>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-border pt-4">
          <div>
            <p className="text-sm font-medium text-text">{t('twoFactor')}</p>
            <p className="text-xs text-secondary-text">{t('twoFactorDesc')}</p>
          </div>
          <input
            type="checkbox"
            name="two_factor_auth"
            checked={!!settings.twoFactor}
            onChange={(e) => handleChange('twoFactor', e.target.checked)}
            className="w-5 h-5 accent-primary cursor-pointer"
          />
        </div>
      </div>

      {/* API Settings Section */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary"><Key size={20} /></div>
          <h2 className="text-lg font-semibold text-text">{t('apiIntegrations')}</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">{t('geminiKey')}</label>
            <input
              type="password"
              name="gemini_api_key"
              value={settings.geminiKey}
              onChange={(e) => handleChange('geminiKey', e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-primary font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">{t('openaiKey')}</label>
            <input
              type="password"
              name="openai_api_key"
              value={settings.openaiKey}
              onChange={(e) => handleChange('openaiKey', e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-primary font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">{t('webhookUrl')}</label>
            <input
              type="text"
              name="webhook_url"
              value={settings.webhookUrl}
              onChange={(e) => handleChange('webhookUrl', e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-primary font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};