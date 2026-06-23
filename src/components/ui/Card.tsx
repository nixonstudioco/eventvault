import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
  hover?: boolean
  glow?: boolean
}

export function Card({ className, children, hover, glow }: CardProps) {
  return (
    <div
      className={cn(
        'glass-card',
        hover && 'transition-all duration-300 hover:bg-white/8 hover:border-white/20 cursor-pointer',
        glow && 'glow-brand-sm',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('p-6 pb-0', className)}>{children}</div>
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('p-6', className)}>{children}</div>
}

export function CardFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('px-6 py-4 border-t border-white/5', className)}>{children}</div>
  )
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  className,
}: {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: { value: number; label: string }
  className?: string
}) {
  return (
    <Card className={cn('p-6', className)}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-white/50 font-medium">{label}</p>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center text-brand-400">
            {icon}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      {trend && (
        <p className={cn('mt-1 text-xs font-medium', trend.value >= 0 ? 'text-green-400' : 'text-red-400')}>
          {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
        </p>
      )}
    </Card>
  )
}
