'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
  iconRight?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, iconRight, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-brand-600 hover:bg-brand-500 text-white glow-brand-sm',
      secondary: 'glass border-white/20 hover:bg-white/10 text-white',
      ghost: 'text-white/70 hover:text-white hover:bg-white/5',
      danger: 'bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-400 hover:text-red-300',
      success: 'bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 text-green-400',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg',
      md: 'px-5 py-2.5 text-sm rounded-xl',
      lg: 'px-7 py-3.5 text-base rounded-xl',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold',
          'transition-all duration-200 active:scale-95',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
        {children}
        {!loading && iconRight}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
