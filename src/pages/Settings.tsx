import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { User, Shield, Bell, Wallet, Camera, Lock, CalendarSync } from 'lucide-react'
import PaymentForm from '../components/Payment'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'billing', label: 'Billing & Sync', icon: Wallet },
  { id: 'payments', label: 'Payments', icon: Wallet },
]

export default function Settings() {
  const { profile, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [email, setEmail] = useState(profile?.email || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [timezone, setTimezone] = useState(profile?.timezone || 'America/New_York')
  const [emailNotif, setEmailNotif] = useState(profile?.email_notifications ?? true)
  const [smsNotif, setSmsNotif] = useState(profile?.sms_notifications ?? false)
  const [twoFactor, setTwoFactor] = useState(profile?.two_factor_enabled ?? false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    await updateProfile({
      full_name: fullName,
      phone,
      timezone,
      email_notifications: emailNotif,
      sms_notifications: smsNotif,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-on-surface">Account Settings</h2>
        <p className="text-base text-on-surface-variant mt-1">Manage your professional profile and security preferences.</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left p-4 rounded-lg flex items-center gap-3 text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white soft-saas-shadow border-l-4 border-primary text-primary'
                  : 'text-on-surface-variant hover:bg-white'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="col-span-9 space-y-8">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl soft-saas-shadow p-6">
              <div className="flex justify-between items-center border-b border-outline-variant pb-4 mb-6">
                <h3 className="text-lg font-semibold text-on-surface">Personal Information</h3>
                <button onClick={handleSave} disabled={saving} className="text-primary text-sm font-semibold hover:underline disabled:opacity-50">
                  {saving ? 'Saving...' : saved ? 'Saved!' : 'Update Changes'}
                </button>
              </div>
              <div className="flex gap-8 items-start">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-surface-container bg-primary-container flex items-center justify-center text-on-primary-container text-4xl font-bold">
                      {fullName.charAt(0) || 'U'}
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera size={24} className="text-white" />
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant text-center">JPG or PNG, max 2MB</p>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-on-surface">Full Name</label>
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="border border-outline-variant rounded-lg p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-on-surface">Email Address</label>
                    <input type="email" value={email} readOnly className="border border-outline-variant rounded-lg p-4 bg-surface-container-low text-on-surface-variant outline-none text-sm cursor-not-allowed" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-on-surface">Phone Number</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="border border-outline-variant rounded-lg p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-on-surface">Timezone</label>
                    <select value={timezone} onChange={e => setTimezone(e.target.value)} className="border border-outline-variant rounded-lg p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm appearance-none">
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'security' || activeTab === 'billing') && (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl soft-saas-shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-secondary-container rounded-lg"><Lock size={18} className="text-on-secondary-container" /></div>
                  <h4 className="text-sm font-semibold">Two-Factor Auth</h4>
                </div>
                <p className="text-sm text-on-surface-variant mb-6">Add an extra layer of security to your account.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-on-surface">Enabled</span>
                  <button
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${twoFactor ? 'bg-primary' : 'bg-outline-variant'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${twoFactor ? 'ml-auto' : ''}`} />
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-xl soft-saas-shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-tertiary-fixed rounded-lg"><CalendarSync size={18} className="text-tertiary" /></div>
                  <h4 className="text-sm font-semibold">Google Calendar</h4>
                </div>
                <p className="text-sm text-on-surface-variant mb-6">Sync all your BookPro appointments automatically.</p>
                <button className="w-full border border-outline-variant py-2 rounded-lg text-sm font-semibold hover:bg-surface-container-low transition-colors">Sync Account</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl soft-saas-shadow p-6">
              <h3 className="text-lg font-semibold text-on-surface border-b border-outline-variant pb-4 mb-6">Notification Preferences</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Booking Updates</p>
                    <p className="text-sm text-on-surface-variant">Receive alerts when a booking is confirmed or changed.</p>
                  </div>
                  <div className="flex gap-8">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={emailNotif} onChange={e => setEmailNotif(e.target.checked)} className="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant" />
                      <span className="text-xs font-medium">Email</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={smsNotif} onChange={e => setSmsNotif(e.target.checked)} className="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant" />
                      <span className="text-xs font-medium">SMS</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-outline-variant">
                <button onClick={handleSave} disabled={saving} className="bg-primary text-on-primary text-sm font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                  {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}

        {activeTab === 'payments' && (
            <div className="bg-white rounded-xl soft-saas-shadow p-6">
              <h3 className="text-lg font-semibold text-on-surface border-b border-outline-variant pb-4 mb-6">Payment Methods</h3>
              <PaymentForm />
              </div>
        )}
        </div>
      </div>
    </div>
  )
}
