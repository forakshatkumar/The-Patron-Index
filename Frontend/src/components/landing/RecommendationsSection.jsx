import { useState } from 'react'
import { Lightbulb, CheckCircle2, Sparkles } from 'lucide-react'
import { RECOMMENDATIONS_DATA } from '../../data/mock'

export default function RecommendationsSection () {
  const [activeRecommendationId, setActiveRecommendationId] = useState(1)

  return (
    <section id='recommendations' className='py-28 px-4 sm:px-6 lg:px-8 border-t border-[#222B36] bg-[#0B0F14]/90'>
      <div className='max-w-5xl mx-auto'>
        <div className='text-center max-w-2xl mx-auto mb-16'>
          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#F5B83D]/15 text-[#F5B83D] border border-[#F5B83D]/30 mb-4'>
            <Lightbulb className='w-3.5 h-3.5' />
            <span>PRD Section 5.10 // Grounded Intelligence</span>
          </span>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#E8EEF5] tracking-tight font-display mb-4'>
            Observed Facts vs. Practical Actions
          </h2>
          <p className='text-sm sm:text-base text-[#8A98A8] leading-relaxed'>
            We don&apos;t just tell you what happened. Every analytical observation pairs a verified numerical fact with a concrete business step.
          </p>
        </div>

        {/* Stack of Observation & Action Cards */}
        <div className='space-y-4'>
          {RECOMMENDATIONS_DATA.map((rec) => {
            const isSelected = activeRecommendationId === rec.id

            return (
              <div
                key={rec.id}
                onClick={() => setActiveRecommendationId(rec.id)}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-[#18222E] border-[#4F8CFF] shadow-lg shadow-[#4F8CFF]/10'
                    : 'bg-[#121820] border-[#222B36] hover:border-[#2E3B4B]'
                }`}
                role='button'
                tabIndex={0}
              >
                <div className='flex flex-wrap items-center justify-between gap-3 mb-4'>
                  <span className='text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#4F8CFF]/20 text-[#4F8CFF] border border-[#4F8CFF]/30 uppercase'>
                    {rec.tag}
                  </span>
                  <span className='text-xs font-mono text-[#3DD6A0] font-semibold'>
                    {rec.metric}
                  </span>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-12 gap-6 items-start'>
                  {/* Observation (Fact) */}
                  <div className='md:col-span-5 flex flex-col justify-between'>
                    <div className='flex items-center gap-2 text-xs font-bold font-mono text-[#8A98A8] uppercase tracking-wider mb-2'>
                      <span className='w-2 h-2 rounded-full bg-[#4F8CFF]' />
                      <span>Observed Fact (From Your CSV)</span>
                    </div>
                    <p className='text-sm font-semibold text-[#E8EEF5] leading-relaxed'>
                      &quot;{rec.observation}&quot;
                    </p>
                  </div>

                  {/* Arrow separator on desktop */}
                  <div className='hidden md:flex md:col-span-1 items-center justify-center pt-4 text-[#8A98A8] font-mono text-base'>
                    &rarr;
                  </div>

                  {/* Suggested Action */}
                  <div className='md:col-span-6 p-4 rounded-xl bg-[#0B0F14] border border-[#222B36]'>
                    <div className='flex items-center gap-2 text-xs font-bold font-mono text-[#3DD6A0] uppercase tracking-wider mb-1.5'>
                      <CheckCircle2 className='w-3.5 h-3.5 text-[#3DD6A0]' />
                      <span>Suggested Business Action</span>
                    </div>
                    <p className='text-xs text-[#8A98A8] leading-relaxed'>
                      {rec.suggestedAction}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Required Footer Line from Prompt */}
        <div className='text-center mt-12 text-xs font-mono text-[#8A98A8] flex items-center justify-center gap-2'>
          <Sparkles className='w-3.5 h-3.5 text-[#F5B83D]' />
          <span>Numbers come from your data. AI only explains them.</span>
        </div>
      </div>
    </section>
  )
}

