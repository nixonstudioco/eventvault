import { Plus, QrCode, Upload, CheckCircle } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Plus,
    title: 'Create your event',
    description: 'Set up your event in minutes. Choose the name, date, type, and privacy settings.',
    color: 'from-brand-600 to-purple-600',
  },
  {
    step: '02',
    icon: QrCode,
    title: 'Share the QR code',
    description: 'Download your unique QR code and print it, display it on screens, or add it to invitations.',
    color: 'from-purple-600 to-cyan-600',
  },
  {
    step: '03',
    icon: Upload,
    title: 'Guests upload memories',
    description: 'Guests scan the QR and instantly upload photos and videos from their phone — no app needed.',
    color: 'from-cyan-600 to-brand-600',
  },
  {
    step: '04',
    icon: CheckCircle,
    title: 'You approve & share',
    description: 'Review uploads, approve the best ones, and share the gallery link with everyone.',
    color: 'from-brand-600 to-green-600',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto">
            From setup to shared gallery in under 5 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-brand-600/40 via-purple-600/40 to-brand-600/40" />

          {steps.map((step, i) => (
            <div key={step.step} className="relative text-center group">
              <div className="relative inline-block mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-surface-800 border border-white/10 text-xs font-bold text-white/50 flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
