import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  label?: string
  showLabel?: boolean
  size?: 'sm' | 'md'
  color?: 'brand' | 'green' | 'yellow' | 'red'
}

const colors = {
  brand: 'bg-brand-600',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
}

export function Progress({ value, max = 100, label, showLabel = false, size = 'md', color = 'brand' }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const autoColor = pct >= 90 ? 'red' : pct >= 70 ? 'yellow' : color

  return (
    <div className="w-full">
      {(label || showLabel) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-white/50">{label}</span>}
          {showLabel && <span className="text-xs font-medium text-white/70">{pct.toFixed(0)}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-white/10 rounded-full overflow-hidden', size === 'sm' ? 'h-1.5' : 'h-2.5')}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', colors[autoColor])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function StorageBar({ used, total }: { used: number; total: number }) {
  const pct = (used / total) * 100
  const usedGB = (used / 1024 / 1024 / 1024).toFixed(2)
  const totalGB = (total / 1024 / 1024 / 1024).toFixed(0)

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-white/50">Storage used</span>
        <span className="text-xs font-medium text-white/70">{usedGB} / {totalGB} GB</span>
      </div>
      <Progress value={pct} max={100} />
    </div>
  )
}
