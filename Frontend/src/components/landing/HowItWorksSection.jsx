import { useState } from 'react'
import { Check, ArrowRight, UserPlus, Upload, ShieldCheck, Cpu, PieChart, Lightbulb } from 'lucide-react'
import { STEPS_DATA } from '../../data/mock'

export default function HowItWorksSection () {
  const [activeStep, setActiveStep] = useState(1)

  const stepIcons = [UserPlus, Upload, ShieldCheck, Cpu, PieChart, Lightbulb]

  return (
    <section id='how-it-works' className='py-28 px-4 sm:px-6 lg:px-8 bg-[#0B0F14]'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center max-w-2xl mx-auto mb-16'>
          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#4F8CFF]/15 text-[#4F8CFF] border border-[#4F8CFF]/30 mb-4'>
            <span>Sequential Automation</span>
          </span>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#E8EEF5] tracking-tight font-display mb-4'>
            How The Patron Index Works
          </h2>
          <p className='text-sm sm:text-base text-[#8A98A8] leading-relaxed'>
            From raw transaction records to actionable retention decisions in six transparent, deterministic steps.
          </p>
        </div>

        {/* Stepper Navigation Bar with Fill Progress */}
        <div className='relative mb-12'>
          <div className='hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#222B36] -translate-y-1/2 z-0' />
          <div
            className='hidden md:block absolute top-1/2 left-0 h-0.5 bg-[#4F8CFF] -translate-y-1/2 z-0 transition-all duration-500'
            style={{ width: `${((activeStep - 1) / (STEPS_DATA.length - 1)) * 100}%` }}
          />

          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 relative z-10'>
            {STEPS_DATA.map((step) => {
              const isDone = activeStep > step.step
              const isCurrent = activeStep === step.step

              return (
                <button
                  key={step.step}
                  type='button'
                  onClick={() => setActiveStep(step.step)}
                  className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                    isCurrent
                      ? 'bg-[#18222E] border-[#4F8CFF] text-[#E8EEF5] shadow-lg shadow-[#4F8CFF]/20 scale-105'
                      : isDone
                      ? 'bg-[#121820] border-[#3DD6A0]/40 text-[#E8EEF5]'
                      : 'bg-[#0B0F14] border-[#222B36] text-[#8A98A8] hover:border-[#2E3B4B]'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 text-xs font-bold ${
                      isCurrent
                        ? 'bg-[#4F8CFF] text-[#0B0F14]'
                        : isDone
                        ? 'bg-[#3DD6A0] text-[#0B0F14]'
                        : 'bg-[#18222E] text-[#8A98A8]'
                    }`}
                  >
                    {isDone ? <Check className='w-4 h-4' /> : step.step}
                  </div>
                  <span className='text-xs font-semibold leading-tight'>{step.title}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Step Spotlight Mock Display */}
        {(() => {
          const current = STEPS_DATA.find((s) => s.step === activeStep) || STEPS_DATA[0]
          const CurrentIcon = stepIcons[current.step - 1]

          return (
            <div className='bg-[#121820] border border-[#222B36] rounded-2xl p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
              <div className='flex flex-col justify-center'>
                <div className='inline-flex items-center gap-2 text-xs font-mono font-bold text-[#4F8CFF] uppercase tracking-wider mb-2'>
                  <CurrentIcon className='w-4 h-4' />
                  <span>{current.badge}</span>
                </div>
                <h3 className='text-2xl sm:text-3xl font-extrabold text-[#E8EEF5] font-display mb-3'>
                  {current.title}
                </h3>
                <p className='text-base text-[#E8EEF5] font-medium mb-3 leading-snug'>
                  {current.summary}
                </p>
                <p className='text-xs text-[#8A98A8] leading-relaxed mb-6'>
                  {current.detail}
                </p>

                <div className='flex items-center gap-3'>
                  {activeStep > 1 && (
                    <button
                      type='button'
                      onClick={() => setActiveStep(activeStep - 1)}
                      className='px-4 py-2 text-xs font-semibold text-[#8A98A8] hover:text-[#E8EEF5] bg-[#18222E] border border-[#222B36] rounded-full'
                    >
                      &larr; Previous Step
                    </button>
                  )}
                  {activeStep < 6 ? (
                    <button
                      type='button'
                      onClick={() => setActiveStep(activeStep + 1)}
                      className='px-4 py-2 text-xs font-semibold text-[#0B0F14] bg-[#4F8CFF] hover:bg-[#689DFF] rounded-full flex items-center gap-1.5'
                    >
                      <span>Next: Step 0{activeStep + 1}</span>
                      <ArrowRight className='w-3.5 h-3.5' />
                    </button>
                  ) : (
                    <a
                      href='#data-audit'
                      className='px-4 py-2 text-xs font-semibold text-[#0B0F14] bg-[#3DD6A0] hover:bg-[#52E4B0] rounded-full flex items-center gap-1.5'
                    >
                      <span>Try Interactive Audit Below</span>
                      <ArrowRight className='w-3.5 h-3.5' />
                    </a>
                  )}
                </div>
              </div>

              {/* Animated Mini Mock UI */}
              <div className='bg-[#0B0F14] border border-[#222B36] rounded-xl p-5 font-mono text-xs text-[#8A98A8] shadow-inner'>
                <div className='flex items-center justify-between border-b border-[#222B36] pb-3 mb-4'>
                  <span className='text-[11px] text-[#4F8CFF]'>Stage Mock // {current.title}</span>
                  <span className='w-2 h-2 rounded-full bg-[#3DD6A0] animate-ping' />
                </div>

                {activeStep === 1 && (
                  <div className='space-y-3'>
                    <div className='p-3 bg-[#18222E] rounded border border-[#222B36] text-[#E8EEF5]'>
                      <span className='text-xs text-[#8A98A8] block mb-1'>Tenant Key:</span>
                      <code>tenant_usr_99812_isolated</code>
                    </div>
                    <div className='text-[11px] text-[#3DD6A0]'>✓ Isolated database partition mapped</div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className='space-y-2'>
                    <div className='p-3 border border-dashed border-[#4F8CFF]/50 rounded bg-[#18222E]/40 text-center text-[#E8EEF5]'>
                      Drag sales_ledger_2026.csv
                    </div>
                    <span className='text-[10px] text-[#8A98A8] block'>Columns parsed: customer_id, name, date, amount</span>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className='space-y-2'>
                    <div className='p-2.5 bg-[#FF5D6C]/10 border border-[#FF5D6C]/40 rounded text-[#FF5D6C] flex items-center justify-between'>
                      <span>Row #2: Amount = -₹450</span>
                      <span className='px-1.5 py-0.5 bg-[#FF5D6C]/20 rounded text-[9px]'>Negative</span>
                    </div>
                    <div className='p-2.5 bg-[#F5B83D]/10 border border-[#F5B83D]/40 rounded text-[#F5B83D] flex items-center justify-between'>
                      <span>Row #4: Duplicate ID CUST-1041</span>
                      <span className='px-1.5 py-0.5 bg-[#F5B83D]/20 rounded text-[9px]'>Duplicate</span>
                    </div>
                  </div>
                )}

                {activeStep === 4 && (
                  <div className='space-y-3'>
                    <div className='w-full bg-[#18222E] h-2 rounded-full overflow-hidden'>
                      <div className='w-4/5 h-full bg-[#3DD6A0]' />
                    </div>
                    <span className='text-[11px] text-[#E8EEF5] block'>1,392 of 1,420 records sanitized &amp; ready</span>
                  </div>
                )}

                {activeStep === 5 && (
                  <div className='grid grid-cols-2 gap-2 text-center'>
                    <div className='p-2 bg-[#18222E] rounded border border-[#222B36]'>
                      <span className='text-[#F5B83D] font-bold block'>VIP (8%)</span>
                      <span className='text-[10px] text-[#8A98A8]'>Score: 85–100</span>
                    </div>
                    <div className='p-2 bg-[#18222E] rounded border border-[#222B36]'>
                      <span className='text-[#3DD6A0] font-bold block'>Loyal (24%)</span>
                      <span className='text-[10px] text-[#8A98A8]'>Score: 70–84</span>
                    </div>
                  </div>
                )}

                {activeStep === 6 && (
                  <div className='p-3 bg-[#18222E] border border-[#222B36] rounded text-[#E8EEF5]'>
                    <span className='text-[#F5B83D] font-bold text-xs block mb-1'>Action Alert</span>
                    <span className='text-[11px] text-[#8A98A8]'>Send personalized re-engagement incentives to 34 declining VIP patrons.</span>
                  </div>
                )}
              </div>
            </div>
          )
        })()}
      </div>
    </section>
  )
}

