const useCases = [
  {
    emoji: '💍',
    type: 'Weddings',
    description: 'Collect every candid shot from every guest. Share a QR on tables, photo walls, or invites.',
    stat: '300+ photos avg',
  },
  {
    emoji: '🎂',
    type: 'Birthdays & Majorate',
    description: 'Let the whole party contribute to the memory bank. No more chasing photos on WhatsApp.',
    stat: '150+ photos avg',
  },
  {
    emoji: '✝️',
    type: 'Baptisms',
    description: 'A beautiful, curated gallery of the most intimate family moments, approved by you.',
    stat: '80+ photos avg',
  },
  {
    emoji: '🎉',
    type: 'Private Parties',
    description: 'Keep the vibe going after the event with a shared gallery everyone can browse.',
    stat: '200+ photos avg',
  },
  {
    emoji: '💼',
    type: 'Corporate Events',
    description: 'Team days, launches, conferences — collect professional content from all angles.',
    stat: '100+ photos avg',
  },
]

export function UseCasesSection() {
  return (
    <section id="use-cases" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Built for every <span className="gradient-text">occasion</span>
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto">
            From intimate family gatherings to large corporate events.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {useCases.map((uc) => (
            <div
              key={uc.type}
              className="glass-card p-6 text-center group hover:border-brand-500/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{uc.emoji}</div>
              <h3 className="font-bold text-white mb-2">{uc.type}</h3>
              <p className="text-xs text-white/50 leading-relaxed mb-4">{uc.description}</p>
              <span className="glass px-3 py-1 rounded-full text-xs font-semibold text-brand-400 border border-brand-500/20">
                {uc.stat}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
