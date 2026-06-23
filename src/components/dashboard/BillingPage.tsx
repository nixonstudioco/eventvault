'use client'

import { useState } from 'react'
import { Check, Crown, Zap, CreditCard, Calendar, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import type { Plan, Subscription } from '@/types'
import toast from 'react-hot-toast'

interface Props {
  plans: Plan[]
  subscription: (Subscription & { plan?: Plan }) | null
  userId: string
}

export function BillingPage({ plans, subscription, userId }: Props) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (planId: string, stripePriceId: string | null) => {
    if (!stripePriceId) {
      toast.error('This plan is not yet available for purchase')
      return
    }
    setLoading(planId)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: stripePriceId, planId }),
      })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Checkout failed')
    } finally {
      setLoading(null)
    }
  }

  const handleManage = async () => {
    setLoading('manage')
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const { url } = await res.json()
      window.location.href = url
    } catch {
      toast.error('Failed to open billing portal')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">Billing & Plans</h1>
        <p className="text-white/50 mt-1">Manage your subscription and payment details.</p>
      </div>

      {/* Current plan */}
      {subscription && (
        <Card className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <p className="font-bold text-white">
                  {subscription.plan?.name || 'Unknown plan'}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant={subscription.status === 'active' ? 'approved' : 'warning'} dot>
                    {subscription.status}
                  </Badge>
                  {subscription.current_period_end && (
                    <span className="text-xs text-white/40 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Renews {formatDate(subscription.current_period_end, { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleManage}
              loading={loading === 'manage'}
            >
              Manage subscription
            </Button>
          </div>
          {subscription.cancel_at_period_end && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center gap-2 text-sm text-yellow-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              Your subscription will cancel at the end of the billing period.
            </div>
          )}
        </Card>
      )}

      {/* Plans */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {plans.map((plan) => {
            const isCurrent = subscription?.plan_id === plan.id
            const icons = { basic: Zap, premium: Crown }
            const Icon = icons[plan.slug as keyof typeof icons] || Zap
            const highlight = plan.slug === 'premium'

            return (
              <Card
                key={plan.id}
                className={`p-6 ${highlight ? 'border-brand-500/40 bg-brand-600/5' : ''} ${isCurrent ? 'ring-2 ring-green-500/40' : ''}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${highlight ? 'bg-brand-600' : 'bg-white/10'}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">{plan.name}</h3>
                      {isCurrent && <Badge variant="approved" dot>Current</Badge>}
                    </div>
                    <p className="text-xs text-white/50">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-5">
                  <span className="text-3xl font-black text-white">${plan.price_monthly}</span>
                  <span className="text-white/40 text-sm ml-1">/event</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((f: string) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isCurrent ? 'secondary' : highlight ? 'primary' : 'secondary'}
                  className="w-full"
                  disabled={isCurrent}
                  loading={loading === plan.id}
                  onClick={() => !isCurrent && handleCheckout(plan.id, plan.stripe_price_id)}
                >
                  {isCurrent ? 'Current plan' : `Get ${plan.name}`}
                </Button>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
