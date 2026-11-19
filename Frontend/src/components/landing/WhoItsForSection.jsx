import { useState } from 'react'
import { Store, ShoppingCart, UserCheck, Building, TrendingUp } from 'lucide-react'
import { PERSONAS_DATA } from '../../data/mock'

export default function WhoItsForSection ({ onOpenDemo }) {
  const [activePersonaId, setActivePersonaId] = useState('shopkeepers')

  const personaIcons = {
    shopkeepers: Store,
    retailers: ShoppingCart,
    sellers: UserCheck,
    'small-business': Building,
    growing: TrendingUp
  }

  const activePersona = PERSONAS_DATA.find((p) => p.id === activePersonaId) || PERSONAS_DATA[0]
  const ActiveIcon = personaIcons[activePersona.id] || Store

  return (
    <section id='who-its-for' className='py-28 px-4 sm:px-6 lg:px-8 bg-[#0B0F14] border-t border-[#222B36]'>
      <div className='max-w-5xl mx-auto'>
        <div className='text-center max-w-2xl mx-auto mb-14'>
          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#4F8CFF]/15 text-[#4F8CFF] border border-[#4F8CFF]/30 mb-4'>
            <span>Designed for Real Operators</span>
          </span>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#E8EEF5] tracking-tight font-display mb-4'>
            Who The Patron Index Is For
          </h2>
          <p className='text-sm sm:text-base text-[#8A98A8] leading-relaxed'>
            Built for operators who want practical customer intelligence without complex database setups or dedicated analysts.
          </p>
        </div>

        {/* Horizontal Navigation Pills */}
        <div className='flex flex-wrap items-center justify-center gap-2 mb-10'>
          {PERSONAS_DATA.map((p) => {
            const Icon = personaIcons[p.id] || Store
            const isSelected = activePersonaId === p.id

            return (
              <button
                key={p.id}
                type='button'
                onClick={() => setActivePersonaId(p.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#4F8CFF] text-[#0B0F14] shadow-md shadow-[#4F8CFF]/20 scale-105'
                    : 'bg-[#121820] text-[#8A98A8] hover:text-[#E8EEF5] border border-[#222B36]'
                }`}
              >
                <Icon className='w-3.5 h-3.5' />
                <span>{p.label}</span>
              </button>
            )
          })}
        </div>

        {/* Selected Persona Detail Box */}
        <div className='bg-[#121820] border border-[#222B36] rounded-2xl p-8 sm:p-12 text-center max-w-3xl mx-auto'>
          <div className='w-12 h-12 rounded-full bg-[#18222E] border border-[#222B36] text-[#4F8CFF] flex items-center justify-center mx-auto mb-4'>
            <ActiveIcon className='w-6 h-6' />
          </div>

          <span className='text-xs font-mono text-[#4F8CFF] uppercase font-bold tracking-wider block mb-2'>
            Primary Need: {activePersona.label}
          </span>

          <h3 className='text-xl sm:text-2xl font-bold text-[#E8EEF5] font-display mb-4'>
            &quot;{activePersona.need}&quot;
          </h3>

          <p className='text-sm text-[#8A98A8] italic max-w-xl mx-auto mb-8'>
            {activePersona.quote}
          </p>

          <button
            type='button'
            onClick={onOpenDemo}
            className='px-5 py-2.5 rounded-full text-xs font-bold text-[#0B0F14] bg-[#4F8CFF] hover:bg-[#689DFF] shadow-sm transition-all hover:scale-105'
          >
            Explore Live Demo for {activePersona.label} &rarr;
          </button>
        </div>
      </div>
    </section>
  )
}

