'use client'

import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { forwardRef } from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-white/60 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none bg-surface-700 border rounded-xl px-4 py-3 pr-10 text-white text-sm',
              'focus:outline-none focus:ring-1 transition-all duration-200',
              error
                ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20'
                : 'border-white/10 focus:border-brand-500/50 focus:ring-brand-500/20',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" className="bg-surface-800 text-white/50">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-surface-800 text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
        </div>
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-white/40">{hint}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select }
