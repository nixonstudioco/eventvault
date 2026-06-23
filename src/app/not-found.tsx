import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-white/10 mb-4">404</div>
        <h1 className="text-2xl font-black text-white mb-2">Page not found</h1>
        <p className="text-white/50 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button variant="primary" icon={<Home className="w-4 h-4" />}>
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  )
}
