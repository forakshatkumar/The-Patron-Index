import { motion } from 'framer-motion'
import { UploadCloud, ShieldCheck, BarChart2, Lightbulb, ArrowRight } from 'lucide-react'

export default function HowItWorksSection () {
  const steps = [
    {
      id: 1,
      title: '1. Upload Your Data',
      desc: 'Drag and drop your business CSV file',
      icon: UploadCloud
    },
    {
      id: 2,
      title: '2. Validate & Clean',
      desc: 'Our platform checks for errors and inconsistencies',
      icon: ShieldCheck
    },
    {
      id: 3,
      title: '3. Analyse Customers',
      desc: 'Discover segments like loyal, high-value or at-risk',
      icon: BarChart2
    },
    {
      id: 4,
      title: '4. Get Actionable Insights',
      desc: 'Receive easy-to-understand recommendations',
      icon: Lightbulb
    }
  ]

  return (
    <section id='how-it-works' className='py-16 md:py-24 bg-white relative'>
      <div className='max-w-[1160px] mx-auto px-4 sm:px-6'>
        
        {/* Centered Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className='text-center max-w-2xl mx-auto mb-14 sm:mb-16'
        >
          {/* Eyebrow with flanking lines */}
          <div className='flex items-center justify-center gap-3 text-xs font-semibold text-slate-400 mb-2.5'>
            <span className='inline-block w-8 h-[1px] bg-slate-300' />
            <span className='text-slate-600 font-bold'>How It Works</span>
            <span className='inline-block w-8 h-[1px] bg-slate-300' />
          </div>

          <h2 className='text-2xl sm:text-3xl font-extrabold text-[#0B2545] font-display tracking-tight'>
            From Data to Decisions in 4 Simple Steps
          </h2>
        </motion.div>

        {/* 4 Steps in Horizontal Flow with Arrows */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 relative'>
          {steps.map((st, idx) => {
            const Icon = st.icon
            return (
              <motion.div
                key={st.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                className='relative flex flex-col items-center text-center px-2'
              >
                {/* Horizontal Arrow on Desktop */}
                {idx < steps.length - 1 && (
                  <div className='hidden lg:flex items-center justify-center absolute -right-3 top-6 z-10 text-slate-300 pointer-events-none'>
                    <ArrowRight className='w-4 h-4 text-slate-300' />
                  </div>
                )}

                {/* Circular Icon Badge */}
                <div className='w-12 h-12 rounded-full bg-[#EBF3FE] text-[#0066FF] flex items-center justify-center mb-4.5 shadow-2xs hover:scale-105 transition-transform'>
                  <Icon className='w-5 h-5' />
                </div>

                {/* Title */}
                <h3 className='text-sm sm:text-base font-bold text-[#0B2545] font-display mb-1.5 leading-snug'>
                  {st.title}
                </h3>

                {/* Subtitle / Desc */}
                <p className='text-xs text-slate-500 leading-relaxed max-w-[210px]'>
                  {st.desc}
                </p>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
