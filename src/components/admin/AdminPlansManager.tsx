'use client'

import { useState } from 'react'
import { Check, X, Zap, Crown, Loader2, Save } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import type { Plan } from '@/types'

interface Props { plans: Plan[] }

const featureKeys: Array<{ key: keyof Plan; label: string }> = [
  { key: 'allow_video',               label: 'Video upload' },
  { key: 'allow_custom_qr',           label: 'Custom QR poster' },
  { key: 'allow_live_gallery',        label: 'Live gallery' },
  { key: 'allow_guestbook',           label: 'Guestbook' },
  { key: 'allow_branding',            label: 'Personal branding' },
  { key: 'allow_bulk_download',       label: 'Bulk download' },
  { key: 'allow_email_notifications', label: 'Email notifications' },
]

export function AdminPlansManager({ plans: initialPlans }: Props) {
  const [plans, setPlans] = useState(initialPlans)
  const [saving, setSaving] = useState<string | null>(null)
  const supabase = createClient()

  const updatePlan = (planId: string, field: string, value: unknown) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, [field]: value } : p))
  }

  const savePlan = async (plan: Plan) => {
    setSaving(plan.id)
    const { error } = await supabase
      .from('plans')
      .update({
        name:                       plan.name,
        description:                plan.description,
        price_monthly:              plan.price_monthly,
        max_events:                 plan.max_events,
        max_storage_gb:             plan.max_storage_gb,
        max_file_size_mb:           plan.max_file_size_mb,
        allow_video:                plan.allow_video,
        allow_custom_qr:            plan.allow_custom_qr,
        allow_live_gallery:         plan.allow_live_gallery,
        allow_guestbook:            plan.allow_guestbook,
        allow_branding:             plan.allow_branding,
        allow_bulk_download:        plan.allow_bulk_download,
        allow_email_notifications:  plan.allow_email_notifications,
        is_active:                  plan.is_active,
      })
      .eq('id', plan.id)

    setSaving(null)
    if (error) toast.error('Failed to save plan')
    else toast.success(`${plan.name} plan saved`)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>Plans</h1>
        <p className="text-white/40 mt-1 text-sm">Manage pricing and feature access for each plan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => {
          const isSaving = saving === plan.id
          const Icon = plan.slug === 'premium' ? Crown : Zap
          const accentColor = plan.slug === 'premium' ? '#7B2FF7' : '#555'

          return (
            <div
              key={plan.id}
              className="rounded-2xl p-6 flex flex-col gap-5"
              style={{
                background: '#0a0a0a',
                border: `1px solid ${plan.slug === 'premium' ? 'rgba(123,47,247,0.25)' : 'rgba(255,255,255,0.07)'}`,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${accentColor}18` }}>
                    <Icon size={16} style={{ color: accentColor }} />
                  </div>
                  <input
                    value={plan.name}
                    onChange={e => updatePlan(plan.id, 'name', e.target.value)}
                    className="text-base font-bold text-white bg-transparent border-none outline-none hover:bg-white/5 rounded px-1 py-0.5 transition-colors"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-white/40">Active</span>
                  <div
                    onClick={() => updatePlan(plan.id, 'is_active', !plan.is_active)}
                    className="relative w-8 h-4 rounded-full transition-colors cursor-pointer"
                    style={{ background: plan.is_active ? '#7B2FF7' : '#333' }}
                  >
                    <div
                      className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform"
                      style={{ transform: plan.is_active ? 'translateX(18px)' : 'translateX(2px)' }}
                    />
                  </div>
                </label>
              </div>

              {/* Price + limits */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-white/30 uppercase tracking-wider mb-1 block">Price (€)</label>
                  <input
                    type="number"
                    value={plan.price_monthly}
                    onChange={e => updatePlan(plan.id, 'price_monthly', parseFloat(e.target.value))}
                    className="input-field text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-white/30 uppercase tracking-wider mb-1 block">Storage (GB)</label>
                  <input
                    type="number"
                    value={plan.max_storage_gb}
                    onChange={e => updatePlan(plan.id, 'max_storage_gb', parseInt(e.target.value))}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-white/30 uppercase tracking-wider mb-1 block">Max Events</label>
                  <input
                    type="number"
                    value={plan.max_events}
                    onChange={e => updatePlan(plan.id, 'max_events', parseInt(e.target.value))}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-white/30 uppercase tracking-wider mb-1 block">Max File (MB)</label>
                  <input
                    type="number"
                    value={plan.max_file_size_mb}
                    onChange={e => updatePlan(plan.id, 'max_file_size_mb', parseInt(e.target.value))}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              {/* Feature toggles */}
              <div>
                <p className="text-[11px] text-white/30 uppercase tracking-wider mb-3">Features</p>
                <div className="space-y-2">
                  {featureKeys.map(({ key, label }) => {
                    const enabled = !!plan[key]
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between py-2 px-3 rounded-xl cursor-pointer hover:bg-white/[0.03] transition-colors"
                        onClick={() => updatePlan(plan.id, key, !enabled)}
                      >
                        <span className="text-sm text-white/60">{label}</span>
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: enabled ? 'rgba(123,47,247,0.2)' : 'rgba(255,255,255,0.06)' }}
                        >
                          {enabled
                            ? <Check size={11} className="text-purple-400" />
                            : <X size={11} className="text-white/25" />
                          }
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Save */}
              <button
                onClick={() => savePlan(plan)}
                disabled={isSaving}
                className="btn-primary w-full justify-center"
              >
                {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {isSaving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
