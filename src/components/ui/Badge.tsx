import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'pending' | 'approved' | 'rejected' | 'active' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-white/70 border border-white/10',
  pending: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  approved: 'bg-green-500/15 text-green-400 border border-green-500/20',
  rejected: 'bg-red-500/15 text-red-400 border border-red-500/20',
  active: 'bg-brand-500/15 text-brand-400 border border-brand-500/20',
  success: 'bg-green-500/15 text-green-400 border border-green-500/20',
  warning: 'bg-orange-500/15 text-orange-400 border border-orange-500/20',
  danger: 'bg-red-500/15 text-red-400 border border-red-500/20',
  info: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20',
}

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-white/50',
  pending: 'bg-yellow-400',
  approved: 'bg-green-400',
  rejected: 'bg-red-400',
  active: 'bg-brand-400',
  success: 'bg-green-400',
  warning: 'bg-orange-400',
  danger: 'bg-red-400',
  info: 'bg-cyan-400',
}

export function Badge({ variant = 'default', children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />
      )}
      {children}
    </span>
  )
}

export function MediaStatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, BadgeVariant> = {
    pending: 'pending',
    approved: 'approved',
    rejected: 'rejected',
  }
  return (
    <Badge variant={variantMap[status] || 'default'} dot>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}
