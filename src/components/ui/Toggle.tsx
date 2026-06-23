'use client'

import { cn } from '@/lib/utils'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md'
}

export function Toggle({ checked, onChange, label, description, disabled, size = 'md' }: ToggleProps) {
  return (
    <label className={cn('flex items-start gap-3', !disabled && 'cursor-pointer')}>
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={cn(
            'rounded-full transition-all duration-200',
            size === 'sm' ? 'w-8 h-4' : 'w-11 h-6',
            checked ? 'bg-brand-600' : 'bg-white/20',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <div
            className={cn(
              'bg-white rounded-full shadow transition-all duration-200 absolute top-0.5',
              size === 'sm' ? 'w-3 h-3' : 'w-5 h-5',
              checked
                ? size === 'sm' ? 'translate-x-4' : 'translate-x-5'
                : 'translate-x-0.5'
            )}
          />
        </div>
      </div>
      {(label || description) && (
        <div>
          {label && <p className="text-sm font-medium text-white">{label}</p>}
          {description && <p className="text-xs text-white/50 mt-0.5">{description}</p>}
        </div>
      )}
    </label>
  )
}
