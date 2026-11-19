import { useState } from 'react'
import { AlertTriangle, FileX2 } from 'lucide-react'
import { MESSY_FRAGMENTS } from '../../data/mock'

export default function ProblemSection () {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <section
      id='problem'
      className='relative py-28 px-4 sm:px-6 lg:px-8 border-t border-b border-[#222B36] bg-[#0B0F14]/90 overflow-hidden'
    >
      <div className='max-w-5xl mx-auto'>
        <div className='text-center max-w-2xl mx-auto mb-16'>
          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#FF9F43]/15 text-[#FF9F43] border border-[#FF9F43]/30 mb-4'>
            <AlertTriangle className='w-3.5 h-3.5' />
            <span>The Spreadsheet Dilemma</span>
          </span>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#E8EEF5] tracking-tight font-display mb-4'>
            Spreadsheets get messy. Answers stay hidden.
          </h2>
          <p className='text-sm sm:text-base text-[#8A98A8] leading-relaxed'>
            Most businesses track transactions manually. Over time, negative amounts slip in, customer names are mistyped, and nobody knows who is silently stopping by less.
          </p>
        </div>

        {/* Colliding Messy Data Fragment Scene */}
        <div className='relative min-h-[340px] bg-[#121820]/60 border border-[#222B36] rounded-2xl p-6 sm:p-10 flex flex-col justify-center items-center overflow-hidden'>
          {/* Floating fragments */}
          <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 z-20'>
            {MESSY_FRAGMENTS.map((frag, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs font-mono transition-all duration-700 flex items-center gap-2.5 ${
                  collapsed
                    ? 'opacity-20 scale-90 translate-y-6 bg-[#0B0F14] border-[#222B36]'
                    : 'bg-[#18222E]/80 border-[#FF5D6C]/30 text-[#FF5D6C] shadow-md'
                }`}
              >
                <FileX2 className='w-4 h-4 flex-shrink-0' />
                <span>{frag.text}</span>
              </div>
            ))}
          </div>

          {/* Central Collapsing Hook */}
          <div className='z-20 text-center max-w-lg mx-auto'>
            <p className='text-lg font-bold text-[#E8EEF5] mb-2'>
              &quot;Who is your best customer? Who stopped coming?&quot;
            </p>
            <p className='text-xs text-[#8A98A8] mb-6'>
              Raw numbers don&apos;t answer these questions until they are deterministically audited and scored.
            </p>
            <button
              type='button'
              onClick={() => setCollapsed(!collapsed)}
              className='px-4 py-2 text-xs font-semibold rounded-full bg-[#4F8CFF]/20 text-[#4F8CFF] hover:bg-[#4F8CFF]/30 border border-[#4F8CFF]/40 transition-all'
            >
              {collapsed ? 'Reset Messy Fragment View' : 'Collapse Mess into The Patron Thread ↓'}
            </button>
          </div>

          {/* Background grid lines */}
          <div className='absolute inset-0 opacity-10 bg-[radial-gradient(#4F8CFF_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none' />
        </div>
      </div>
    </section>
  )
}

