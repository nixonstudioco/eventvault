import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  href?: string
  showText?: boolean
  className?: string
}

const sizes = {
  xs: { img: 24, text: 'text-sm' },
  sm: { img: 30, text: 'text-base' },
  md: { img: 36, text: 'text-xl' },
  lg: { img: 48, text: 'text-2xl' },
}

function LogoContent({ size = 'md', showText = true }: Omit<LogoProps, 'href' | 'className'>) {
  const s = sizes[size]
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/logo.png"
        alt="EventVault"
        width={s.img}
        height={s.img}
        className="rounded-xl flex-shrink-0 object-contain"
        priority
        onError={(e) => { (e.target as HTMLImageElement).src = '/logo.svg' }}
      />
      {showText && (
        <span className={cn('font-bold tracking-tight', s.text)}>
          <span className="text-white">Event</span>
          <span className="gradient-text">Vault</span>
        </span>
      )}
    </span>
  )
}

export function Logo({ size = 'md', href = '/', showText = true, className }: LogoProps) {
  return (
    <Link href={href} className={cn('inline-flex items-center transition-opacity hover:opacity-80', className)}>
      <LogoContent size={size} showText={showText} />
    </Link>
  )
}

export function LogoStatic({ size = 'md', showText = true, className }: Omit<LogoProps, 'href'>) {
  return (
    <span className={cn('inline-flex items-center', className)}>
      <LogoContent size={size} showText={showText} />
    </span>
  )
}
