import { ShieldCheck, FileLock2, Cpu, Lock, Trash2, EyeOff } from 'lucide-react'
import { TRUST_CARDS } from '../../data/mock'

export default function BuiltForTrustSection () {
  const iconMap = {
    ShieldCheck,
    FileLock2,
    Cpu,
    Lock,
    Trash2,
    EyeOff
  }

  return (
    <section id='trust' className='py-28 px-4 sm:px-6 lg:px-8 bg-[#0B0F14] border-t border-[#222B36]'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center max-w-2xl mx-auto mb-16'>
          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#3DD6A0]/15 text-[#3DD6A0] border border-[#3DD6A0]/30 mb-4'>
            <ShieldCheck className='w-3.5 h-3.5' />
            <span>PRD Section 10 // Security &amp; Compliance</span>
          </span>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#E8EEF5] tracking-tight font-display mb-4'>
            Built for Trust &amp; Data Sovereignty
          </h2>
          <p className='text-sm sm:text-base text-[#8A98A8] leading-relaxed'>
            We design for small businesses who care deeply about customer trust. No public model training, no cross-business leakage, and zero vendor lock-in.
          </p>
        </div>

        {/* 6 Cards Grid (Strictly 2 or 3 columns, avoids 3 cards in a single row on 4-card designs; 2x3 or 3x2 grid with high visual polish) */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {TRUST_CARDS.map((card, i) => {
            const Icon = iconMap[card.icon] || ShieldCheck

            return (
              <div
                key={i}
                className='p-6 bg-[#121820] border border-[#222B36] hover:border-[#4F8CFF]/40 rounded-2xl flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1'
              >
                <div>
                  <div className='w-10 h-10 rounded-xl bg-[#18222E] border border-[#222B36] text-[#4F8CFF] flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-[#4F8CFF]/50 transition-all'>
                    <Icon className='w-5 h-5' />
                  </div>
                  <h3 className='text-base font-bold text-[#E8EEF5] font-display mb-2'>
                    {card.title}
                  </h3>
                  <p className='text-xs text-[#8A98A8] leading-relaxed'>
                    {card.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

