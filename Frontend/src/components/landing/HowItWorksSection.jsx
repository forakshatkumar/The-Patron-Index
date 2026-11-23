import { useState } from 'react'
import { UploadCloud, ShieldCheck, BarChart2, Lightbulb, ArrowRight, Check } from 'lucide-react'

export default function HowItWorksSection ({ onOpenDemo }) {
  const [selectedStep, setSelectedStep] = useState(1)

  const steps = [
    {
      id: 1,
      num: '1',
      title: '1. Upload Your Data',
      desc: 'Drag and drop your business CSV file',
      icon: UploadCloud,
      detail: 'Easily export your sales from Shopify, Square, WooCommerce, or Excel. We accept standard columns like Order ID, Customer, Date, and Amount.'
    },
    {
      id: 2,
      num: '2',
      title: '2. Validate & Clean',
      desc: 'Our platform checks for errors and inconsistencies',
      icon: ShieldCheck,
      detail: 'Deterministic scanning checks for negative amounts, corrupted dates, and duplicate entries. Your original file remains permanently unmodified.'
    },
    {
      id: 3,
      num: '3',
      title: '3. Analyse Customers',
      desc: 'Discover segments like loyal, high-value or at-risk',
      icon: BarChart2,
      detail: 'Our algorithm automatically profiles customers across Recency, Frequency, Spend, and Loyalty into an explainable 0–100 Patron Index score.'
    },
    {
      id: 4,
      num: '4',
      title: '4. Get Actionable Insights',
      desc: 'Receive easy-to-understand recommendations',
      icon: Lightbulb,
      detail: 'Clear, grounded observations convert your customer patterns into high-impact business decisions to boost repeat visits and protect revenue.'
    }
  ]

  return (
    <section id='how-it-works' className='py-20 md:py-28 bg-white border-b border-slate-100 relative'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* Section Header */}
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <span className='text-xs font-bold tracking-wider uppercase text-[#0066FF] flex items-center justify-center gap-2 mb-2'>
            <span className='w-6 h-0.5 bg-[#0066FF]' />
            <span>How It Works</span>
            <span className='w-6 h-0.5 bg-[#0066FF]' />
          </span>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B2545] tracking-tight font-display'>
            From Data to Decisions in 4 Simple Steps
          </h2>
          <p className='text-slate-600 text-sm sm:text-base mt-3 max-w-xl mx-auto'>
            No data science background needed. Turn raw transaction records into customer intelligence in minutes.
          </p>
        </div>

        {/* 4 Connected Step Cards with subtle horizontal flow */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 relative'>
          {steps.map((st, idx) => {
            const Icon = st.icon
            const isSelected = selectedStep === st.id

            return (
              <div key={st.id} className='relative flex flex-col'>
                {/* Horizontal Connector Arrow (hidden on mobile and on last card) */}
                {idx < steps.length - 1 && (
                  <div className='hidden md:block absolute -right-3 top-10 z-10 text-slate-300'>
                    <ArrowRight className='w-5 h-5 text-slate-300' />
                  </div>
                )}

                {/* Step Card */}
                <div
                  onClick={() => setSelectedStep(st.id)}
                  className={`flex flex-col items-center text-center p-6 rounded-2xl border transition-all cursor-pointer h-full ${
                    isSelected
                      ? 'bg-white border-[#0066FF] shadow-[0_8px_30px_rgba(0,102,255,0.08)] -translate-y-1'
                      : 'bg-[#F8FAFD] border-slate-100 hover:border-slate-200'
                  }`}
                >
                  {/* Icon Circle */}
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center mb-5 transition-transform ${
                      isSelected
                        ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/20 scale-105'
                        : 'bg-[#EEF4FC] text-[#0066FF]'
                    }`}
                  >
                    <Icon className='w-6 h-6' />
                  </div>

                  {/* Title & Desc */}
                  <h3 className='text-base font-bold text-[#0B2545] font-display mb-2'>
                    {st.title}
                  </h3>
                  <p className='text-xs text-slate-500 leading-relaxed'>
                    {st.desc}
                  </p>

                  <div className='mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-center'>
                    <span className={`text-[11px] font-semibold flex items-center gap-1 ${isSelected ? 'text-[#0066FF]' : 'text-slate-400'}`}>
                      {isSelected ? <Check className='w-3.5 h-3.5' /> : null}
                      <span>{isSelected ? 'Active Step' : 'Click to inspect'}</span>
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Selected Step Spotlight Bar */}
        {(() => {
          const current = steps.find((s) => s.id === selectedStep) || steps[0]
          const CurrentIcon = current.icon

          return (
            <div className='mt-10 p-6 sm:p-7 rounded-2xl bg-[#F8FAFD] border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs animate-fadeIn'>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 rounded-xl bg-white border border-slate-200 text-[#0066FF] flex items-center justify-center flex-shrink-0 shadow-xs'>
                  <CurrentIcon className='w-6 h-6' />
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <span className='text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#0066FF]/10 text-[#0066FF]'>
                      Step {current.num}
                    </span>
                    <h4 className='text-sm sm:text-base font-bold text-[#0B2545] font-display'>
                      {current.title}
                    </h4>
                  </div>
                  <p className='text-xs text-slate-600 mt-1 max-w-2xl'>
                    {current.detail}
                  </p>
                </div>
              </div>

              <button
                type='button'
                onClick={onOpenDemo}
                className='px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#0B2545] hover:bg-[#0066FF] transition-all flex items-center gap-2 flex-shrink-0 shadow-xs'
              >
                <span>Try Live Demo</span>
                <ArrowRight className='w-3.5 h-3.5' />
              </button>
            </div>
          )
        })()}

      </div>
    </section>
  )
}
