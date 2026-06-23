import {
  QrCode, Shield, UserCheck, Users, Download, BookOpen,
  Palette, Bell, Zap, Lock
} from 'lucide-react'

const features = [
  {
    icon: QrCode,
    title: 'Custom QR Posters',
    description: 'Design beautiful QR code posters with wedding, birthday, or party themes. Export as PNG or PDF.',
    highlight: true,
  },
  {
    icon: Users,
    title: 'Anonymous + Account Uploads',
    description: 'Let guests upload without an account, or require sign-in so uploads are associated with their name.',
  },
  {
    icon: Shield,
    title: 'Moderated Gallery',
    description: 'Every upload goes to a pending queue. You approve, reject, or delete before it goes public.',
  },
  {
    icon: UserCheck,
    title: 'Multi-role System',
    description: 'Guests, registered users, organizers, and admins — each with the right level of access.',
  },
  {
    icon: Download,
    title: 'Bulk Media Download',
    description: 'Download the entire gallery with one click. All your memories in a single archive.',
    highlight: true,
  },
  {
    icon: BookOpen,
    title: 'Guest Guestbook',
    description: 'Guests can leave messages and well-wishes. Anonymous or signed — you moderate everything.',
  },
  {
    icon: Palette,
    title: 'Live Gallery',
    description: 'A real-time public gallery with masonry layout, lightbox viewer, and video playback.',
  },
  {
    icon: Bell,
    title: 'Email Notifications',
    description: 'Get notified when guests upload, when media is pending review, and when events end.',
  },
  {
    icon: Zap,
    title: 'Instant QR Code',
    description: 'Your unique event QR code is generated immediately after event creation. Share it anywhere.',
  },
  {
    icon: Lock,
    title: 'Private & Secure',
    description: 'Events are private by default. Gallery access controlled by you at every step.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-600/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Everything you need to{' '}
            <span className="gradient-text">collect memories</span>
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto">
            A complete toolkit for managing event media — before, during, and after.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`glass-card p-6 group hover:border-brand-500/30 transition-all duration-300 ${
                feature.highlight ? 'border-brand-500/20 bg-brand-600/5' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center mb-4 group-hover:bg-brand-600/30 transition-colors duration-300">
                <feature.icon className="w-5 h-5 text-brand-400" />
              </div>
              <h3 className="font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
