import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, ShieldCheck, BarChart2, Lightbulb, ArrowRight, Check, Play } from 'lucide-react'

export default function HowItWorksSection ({ onOpenDemo }) {
  const [selectedStep, setSelectedStep] = useState(1)

  const steps = [
    {
      id: 1,
      num: '1',
      title: '1. Upload Your Data',
      desc: 'Drag and drop your business CSV file',
      icon: UploadCloud,
      badge: 'Step 1 // Ingestion',
      detail: 'Easily export sales records from Shopify, Square, WooCommerce, or Excel. We support standard columns: Customer ID, Order Date, Product, and Spend Amount.',
      demoPreview: '2,480 transaction rows parsed • UTF-8 encoding verified • Zero columns omitted'
    },
    {
      id: 2,
      num: '2',
      title: '2. Validate & Clean',
      desc: 'Our platform checks for errors and inconsistencies',
      icon: ShieldCheck,
      badge: 'Step 2 // Data Integrity',
      detail: 'Automated scans detect negative charges, missing identifiers, and duplicate entries. Anomalies are isolated while your original source file remains permanently untouched.',
      demoPreview: '14 duplicate records isolated • 3 date anomalies flagged • Source file locked'
    },
    {
      id: 3,
      num: '3',
      title: '3. Analyse Customers',
      desc: 'Discover segments like loyal, high-value or at-risk',
      icon: BarChart2,
      badge: 'Step 3 // Segmentation',
      detail: 'Our algorithm models customer purchasing intervals into an explainable 0–100 Patron Index score across 7 distinct classes: VIP, Loyal, Regular, New, Occasional, At-Risk, and Inactive.',
      demoPreview: '7 behavioral classes generated • Deterministic RFM weights calculated'
    },
    {
      id: 4,
      num: '4',
      title: '4. Get Actionable Insights',
      desc: 'Receive easy-to-understand recommendations',
      icon: Lightbulb,
      badge: 'Step 4 // Execution',
      detail: 'Actionable observations link numerical facts directly to targeted retention playbooks to re-engage slipping patrons and expand lifetime value.',
      demoPreview: '3 high-priority actions ready • At-risk retention workflow configured'
    }
  ]

  const current = steps.find((s) => s.id === selectedStep) || steps[0]
  const CurrentIcon = current.icon

  return (
    <section id='how-it-works' className='py-20 md:py-28 bg-[#FFFFFF] border-b border-[#E5EBF3] relative'>
      <div className='patron-container'>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className='text-center max-w-3xl mx-auto mb-14 sm:mb-16'
        >
          <span className='text-xs font-bold tracking-wider uppercase text-[#0866F5] flex items-center justify-center gap-2 mb-2.5 font-mono'>
            <span className='w-6 h-0.5 bg-[#0866F5]' />
            <span>HOW IT WORKS</span>
            <span className='w-6 h-0.5 bg-[#0866F5]' />
          </span>
          <h2 className='section-title-clamp font-black text-[#0B2345] font-display leading-tight'>
            From Data to Decisions in 4 Simple Steps
          </h2>
          <p className='text-[#344563] text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed'>
            No technical background needed. Transform your transaction records into clear, repeatable customer retention steps.
          </p>
        </motion.div>

        {/* 4 Step Cards Grid: 4 columns desktop, 2 columns tablet, 1 column mobile */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative'>
          {steps.map((st, idx) => {
            const Icon = st.icon
            const isSelected = selectedStep === st.id

            return (
              <motion.div
                key={st.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className='relative flex flex-col'
              >
                {/* Horizontal Connector Arrow (desktop only) */}
                {idx < steps.length - 1 && (
                  <div className='hidden lg:block absolute -right-3.5 top-12 z-10 text-[#8190A5]/40 pointer-events-none'>
                    <ArrowRight className='w-5 h-5 text-[#8190A5]/50' />
                  </div>
                )}

                {/* Step Card */}
                <div
                  onClick={() => setSelectedStep(st.id)}
                  className={`flex flex-col items-center text-center p-6 rounded-2xl border transition-all duration-200 cursor-pointer h-full ${
                    isSelected
                      ? 'bg-white border-[#0866F5] shadow-[0_12px_32px_rgba(8,102,245,0.08)] -translate-y-1 ring-2 ring-[#0866F5]/20'
                      : 'bg-[#F7F9FC] border-[#E5EBF3] hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  {/* Icon Circle */}
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center mb-5 transition-transform ${
                      isSelected
                        ? 'bg-[#0866F5] text-white shadow-md shadow-[#0866F5]/25 scale-105'
                        : 'bg-[#EFF5FF] text-[#0866F5]'
                    }`}
                  >
                    <Icon className='w-6 h-6' />
                  </div>

                  {/* Title & Desc */}
                  <h3 className='text-base font-bold text-[#0B2345] font-display mb-2 leading-snug'>
                    {st.title}
                  </h3>
                  <p className='text-xs text-[#8190A5] leading-relaxed mb-4'>
                    {st.desc}
                  </p>

                  <div className='mt-auto pt-3 border-t border-[#E5EBF3] w-full flex items-center justify-center'>
                    <span className={`text-[11px] font-bold flex items-center gap-1 ${isSelected ? 'text-[#0866F5]' : 'text-[#8190A5]'}`}>
                      {isSelected ? <Check className='w-3.5 h-3.5' /> : <Play className='w-2.5 h-2.5' />}
                      <span>{isSelected ? 'Inspecting Step' : 'Click to preview'}</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Selected Step Spotlight Bar */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className='mt-10 p-6 sm:p-7 rounded-2xl bg-[#F7F9FC] border border-[#E5EBF3] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs'
          >
            <div className='flex items-center gap-4.5'>
              <div className='w-12 h-12 rounded-xl bg-white border border-[#E5EBF3] text-[#0866F5] flex items-center justify-center flex-shrink-0 shadow-2xs'>
                <CurrentIcon className='w-6 h-6' />
              </div>
              <div>
                <div className='flex items-center gap-2 mb-1'>
                  <span className='text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#0866F5]/10 text-[#0866F5] font-mono'>
                    {current.badge}
                  </span>
                  <h4 className='text-sm sm:text-base font-bold text-[#0B2345] font-display'>
                    {current.title}
                  </h4>
                </div>
                <p className='text-xs text-[#344563] max-w-2xl leading-relaxed'>
                  {current.detail}
                </p>
                <div className='mt-2 inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#00B884] bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200/60'>
                  <span>✔</span>
                  <span>{current.demoPreview}</span>
                </div>
              </div>
            </div>

            <button
              type='button'
              onClick={onOpenDemo}
              className='px-6 py-3 rounded-full text-xs font-bold text-white bg-[#0B2345] hover:bg-[#0866F5] transition-all duration-200 flex items-center gap-2 flex-shrink-0 shadow-xs cursor-pointer hover:scale-102 active:scale-98'
            >
              <span>Launch Demo</span>
              <ArrowRight className='w-3.5 h-3.5' />
            </button>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
