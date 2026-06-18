'use client'
import { useState } from 'react'
import { User, Lock, Bell, Globe, Shield, Trash2, Save } from 'lucide-react'

const TABS = [
  { id: 'profile',   label: 'Profile',        icon: User },
  { id: 'password',  label: 'Password',        icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy',   label: 'Privacy',         icon: Shield },
  { id: 'account',   label: 'Account',         icon: Globe },
]

export default function SettingsPage() {
  const [tab, setTab] = useState('profile')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
      <p className="text-slate-400 text-sm mb-6">Manage your account preferences and privacy.</p>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <nav className="w-52 flex-shrink-0 space-y-0.5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all text-left
                ${tab === id
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-slate-400 hover:bg-surface hover:text-white'}`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {/* Panel */}
        <div className="flex-1 card p-6 space-y-6">

          {tab === 'profile' && (
            <>
              <h2 className="font-semibold text-white">Profile Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                  <input className="input w-full" defaultValue="Laban Kirwa" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Email</label>
                  <input className="input w-full" type="email" defaultValue="simplykae2@gmail.com" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Headline</label>
                  <input className="input w-full" placeholder="e.g. Full Stack Developer" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Location</label>
                  <input className="input w-full" placeholder="e.g. Nairobi, Kenya" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Bio</label>
                  <textarea className="input w-full h-24 resize-none" placeholder="Tell people about yourself…" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Website</label>
                  <input className="input w-full" type="url" placeholder="https://yoursite.com" />
                </div>
              </div>
            </>
          )}

          {tab === 'password' && (
            <>
              <h2 className="font-semibold text-white">Change Password</h2>
              <div className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Current Password</label>
                  <input className="input w-full" type="password" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">New Password</label>
                  <input className="input w-full" type="password" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Confirm New Password</label>
                  <input className="input w-full" type="password" />
                </div>
              </div>
            </>
          )}

          {tab === 'notifications' && (
            <>
              <h2 className="font-semibold text-white">Notification Preferences</h2>
              <div className="space-y-3">
                {[
                  ['New opportunity matches', true],
                  ['Application status updates', true],
                  ['New reviews on your profile', true],
                  ['Payment confirmations', true],
                  ['Weekly career digest', false],
                  ['Marketing & product updates', false],
                ].map(([label, def]) => (
                  <label key={label as string} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                    <span className="text-sm text-slate-300">{label as string}</span>
                    <input type="checkbox" defaultChecked={def as boolean}
                      className="w-4 h-4 accent-primary cursor-pointer" />
                  </label>
                ))}
              </div>
            </>
          )}

          {tab === 'privacy' && (
            <>
              <h2 className="font-semibold text-white">Privacy Settings</h2>
              <div className="space-y-3">
                {[
                  ['Make profile public', true],
                  ['Show trust score publicly', true],
                  ['Allow recruiters to contact me', true],
                  ['Show income history publicly', false],
                  ['Allow data use for AI recommendations', true],
                ].map(([label, def]) => (
                  <label key={label as string} className="flex items-center justify-between py-2 border-b border-surface-border last:border-0">
                    <span className="text-sm text-slate-300">{label as string}</span>
                    <input type="checkbox" defaultChecked={def as boolean}
                      className="w-4 h-4 accent-primary cursor-pointer" />
                  </label>
                ))}
              </div>
            </>
          )}

          {tab === 'account' && (
            <>
              <h2 className="font-semibold text-white">Account</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-surface border border-surface-border">
                  <p className="text-sm text-slate-300 font-medium mb-1">Export your data</p>
                  <p className="text-xs text-slate-500 mb-3">Download a copy of all your profile, income, and activity data.</p>
                  <button className="btn-primary px-4 py-2 text-sm rounded-lg">Request Export</button>
                </div>
                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                  <p className="text-sm text-red-400 font-medium mb-1 flex items-center gap-2">
                    <Trash2 size={14} /> Delete Account
                  </p>
                  <p className="text-xs text-slate-500 mb-3">
                    Permanently delete your account and all associated data. This cannot be undone.
                  </p>
                  <button className="px-4 py-2 text-sm rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                    Delete My Account
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Save button */}
          {tab !== 'account' && (
            <div className="pt-2 flex items-center gap-3">
              <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium">
                <Save size={15} /> Save Changes
              </button>
              {saved && <span className="text-xs text-green-400">Saved!</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
