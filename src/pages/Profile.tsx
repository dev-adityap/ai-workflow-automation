
import { useState } from 'react';
import { User,  Key, Save, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Profile = () => {
  const { showToast } = useToast();
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('user_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      
    }
    return {
      name: 'Alex Rivera',
      email: 'alex.rivera@aiworkflow.io',
      role: 'Senior AI Automation Architect',
      organization: 'Enterprise Neural Systems',
      apiKeyId: 'ak_live_987654321fedcba',
    };
  });

  const handleChange = (key: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem('user_profile', JSON.stringify(profile));
      showToast('Profile updated successfully!', 'success');
    } catch {
      showToast('Failed to update profile.', 'error');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text">User Profile</h1>
          <p className="text-secondary-text mt-1">Manage your personal credentials, account details, and developer access tokens.</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary/20 cursor-pointer text-sm"
        >
          <Save size={16} /> Save Profile
        </button>
      </div>

      {/* Avatar & Basic Info Card */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-3xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary text-3xl font-bold shadow-inner">
          AR
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-text">{profile.name}</h2>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-success/10 text-success text-xs font-semibold">
              <CheckCircle2 size={12} /> Verified
            </span>
          </div>
          <p className="text-xs font-medium text-primary">{profile.role}</p>
          <p className="text-xs text-secondary-text">{profile.organization}</p>
        </div>
      </div>

      {/* Personal Details Form */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary"><User size={20} /></div>
          <h2 className="text-lg font-semibold text-text">Personal Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              name="profile_name"
              value={profile.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              name="profile_email"
              value={profile.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">Role Title</label>
            <input
              type="text"
              name="profile_role"
              value={profile.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-secondary-text uppercase tracking-wider mb-2">Organization</label>
            <input
              type="text"
              name="profile_organization"
              value={profile.organization}
              onChange={(e) => handleChange('organization', e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Developer Access Token */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="p-2 bg-warning/10 rounded-lg text-warning"><Key size={20} /></div>
          <h2 className="text-lg font-semibold text-text">Developer Access Token</h2>
        </div>
        <div className="space-y-3">
          <p className="text-xs text-secondary-text">Use this secret token to authenticate programmatic pipeline requests against the AI automation REST API.</p>
          <div className="flex items-center gap-3">
            <input
              type="password"
              name="profile_api_key"
              readOnly
              value={profile.apiKeyId}
              className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-text font-mono focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(profile.apiKeyId);
                showToast('Developer token copied to clipboard!', 'success');
              }}
              className="px-4 py-2.5 bg-secondary-background hover:bg-border text-text rounded-xl text-xs font-medium transition-colors border border-border cursor-pointer"
            >
              Copy Token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};