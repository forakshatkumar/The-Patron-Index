import { motion } from 'framer-motion'
import { UploadCloud, BarChart3, Lightbulb, ArrowRight, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'
import logoImg from '../../assets/logo.png'

export default function AboutSection ({ onOpenDemo }) {
  const points = [
    {
      icon: UploadCloud,
      title: 'Upload your CSV data in seconds',
      desc: 'Seamless ingestion supporting Excel, POS, Square, and e-commerce transaction logs.'
    },
    {
      icon: BarChart3,
      title: 'Get detailed insights and customer segments',
      desc: 'Instant categorisation into 7 distinct behavioral classes and score metrics.'
    },
    {
      icon: Lightbulb,
      title: 'Make smarter business decisions',
      desc: 'Grounded recommendations tailored directly to identified customer retention opportunities.'
    }
  ]

  const segmentBars = [
    { label: 'VIP', val: '₹3.2L', pct: '88%', count: '2,246', color: '#0B2345' },
    { label: 'Loyal', val: '₹2.4L', pct: '72%', count: '3,993', color: '#0866F5' },
    { label: 'Regular', val: '₹1.6L', pct: '54%', count: '3,494', color: '#00B8D9' },
    { label: 'New', val: '₹85K', pct: '38%', count: '1,120', color: '#7C5CFF' },
    { label: 'At-Risk', val: '₹42K', pct: '26%', count: '1,747', color: '#FFAB00' },
    { label: 'Inactive', val: '₹18K', pct: '16%', count: '998', color: '#8190A5' }
  ]

  return (
    <section id='about' className='py-20 md:py-28 bg-[#F7F9FC] border-t border-b border-[#E5EBF3] relative overflow-hidden'>
      {/* Soft blue background highlight */}
      <div className='absolute -left-28 top-1/4 w-96 h-96 bg-[#EFF5FF] rounded-full blur-3xl opacity-75 pointer-events-none' />

      <div className='patron-container relative'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center'>
          
          {/* LEFT COLUMN: Section Eyebrow, Headings, Feature Highlights & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className='lg:col-span-6 space-y-6'
          >
            <div>
              <span className='text-xs font-bold tracking-wider uppercase text-[#0866F5] flex items-center gap-2 mb-2.5 font-mono'>
                <span>ABOUT THE PATRON INDEX</span>
                <span className='w-6 h-0.5 bg-[#0866F5]' />
              </span>
              <h2 className='section-title-clamp font-black text-[#0B2345] font-display mb-4'>
                Understand your customers. <br className='hidden sm:block' />Grow your business.
              </h2>
              <p className='text-[#344563] text-base sm:text-lg leading-relaxed'>
                The Patron Index helps you analyse your customer behaviour, identify valuable segments, and make data-driven decisions — all in a simple, secure and affordable platform.
              </p>
            </div>

            {/* 3 Feature Cards */}
            <div className='space-y-3.5 pt-1'>
              {points.map((pt, i) => {
                const IconComponent = pt.icon
                return (
                  <motion.div
                    key={i}
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                    className='flex items-start gap-4 p-4 rounded-xl bg-white border border-[#E5EBF3] shadow-2xs hover:border-[#0866F5]/40 hover:shadow-xs transition-all'
                  >
                    <div className='w-11 h-11 rounded-full bg-[#EFF5FF] text-[#0866F5] flex items-center justify-center flex-shrink-0 mt-0.5'>
                      <IconComponent className='w-5 h-5' />
                    </div>
                    <div>
                      <h3 className='text-sm sm:text-base font-bold text-[#0B2345] font-display leading-tight'>
                        {pt.title}
                      </h3>
                      <p className='text-xs text-[#8190A5] mt-1 leading-relaxed'>
                        {pt.desc}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Know More CTA Button */}
            <div className='pt-2'>
              <button
                type='button'
                onClick={onOpenDemo}
                className='inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white bg-[#0B2345] hover:bg-[#0866F5] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
              >
                <span>Know More</span>
                <ArrowRight className='w-4 h-4' />
              </button>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Fully Rendered Laptop Dashboard Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className='lg:col-span-6 relative'
          >
            <div className='relative mx-auto max-w-[540px]'>
              {/* Laptop Screen Bezel */}
              <div className='relative rounded-t-2xl bg-slate-900 p-3 sm:p-3.5 shadow-2xl border-2 border-slate-800'>
                {/* Webcam dot */}
                <div className='w-2 h-2 rounded-full bg-slate-700 mx-auto mb-2.5' />

                {/* Internal Screen Content with Complete Dashboard Layout */}
                <div className='rounded-lg bg-white overflow-hidden border border-[#E5EBF3] aspect-[16/10.5] p-4 flex flex-col justify-between text-xs select-none shadow-inner'>
                  
                  {/* Product Header inside Screen */}
                  <div className='flex items-center justify-between pb-2.5 border-b border-[#E5EBF3]'>
                    <div className='flex items-center gap-2'>
                      <img src={logoImg} alt='The Patron Index' className='w-5 h-5 object-contain' />
                      <span className='font-bold text-[#0B2345] text-xs font-display'>The Patron Index</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='px-2 py-0.5 rounded text-[9px] bg-emerald-50 text-[#00B884] font-bold flex items-center gap-1 border border-emerald-200/60'>
                        <Sparkles className='w-2.5 h-2.5 text-[#00B884]' />
                        <span>Live Intelligence</span>
                      </span>
                      <ShieldCheck className='w-3.5 h-3.5 text-[#0866F5]' />
                    </div>
                  </div>

                  {/* 3 Metric Counters */}
                  <div className='grid grid-cols-3 gap-2 py-2'>
                    <div className='p-2 bg-[#F7F9FC] rounded-lg border border-[#E5EBF3]'>
                      <div className='text-[9px] text-[#8190A5] font-medium'>Total Buyers</div>
                      <div className='text-xs font-black text-[#0B2345] font-display'>12,480</div>
                    </div>
                    <div className='p-2 bg-[#F7F9FC] rounded-lg border border-[#E5EBF3]'>
                      <div className='text-[9px] text-[#8190A5] font-medium'>Revenue Tracked</div>
                      <div className='text-xs font-black text-[#0866F5] font-display'>₹8.4L</div>
                    </div>
                    <div className='p-2 bg-[#F7F9FC] rounded-lg border border-[#E5EBF3]'>
                      <div className='text-[9px] text-[#8190A5] font-medium'>Patron Score</div>
                      <div className='text-xs font-black text-[#00B884] font-display'>84 / 100</div>
                    </div>
                  </div>

                  {/* Complete, Meaningful Segment Breakdown Chart Area */}
                  <div className='bg-[#F7F9FC] p-3 rounded-lg border border-[#E5EBF3] flex-1 flex flex-col justify-between'>
                    <div className='flex justify-between items-center text-[9px] text-[#344563] font-semibold mb-1'>
                      <div className='flex items-center gap-1.5'>
                        <span className='font-bold text-[#0B2345]'>Segment Breakdown</span>
                        <span className='text-[8px] bg-[#EFF5FF] text-[#0866F5] px-1.5 py-0.2 rounded font-mono'>RFM Telemetry</span>
                      </div>
                      <span className='text-[#00B884] font-bold flex items-center gap-0.5'>
                        <TrendingUp className='w-2.5 h-2.5' />
                        <span>Optimal Health</span>
                      </span>
                    </div>

                    {/* Chart Bars with Visible Heights, Guidelines, and Values */}
                    <div className='relative flex items-end justify-between h-20 sm:h-22 gap-2 px-1 pt-1'>
                      {/* Dotted horizontal guidelines */}
                      <div className='absolute inset-x-0 top-1/4 border-b border-dashed border-slate-200/80 pointer-events-none' />
                      <div className='absolute inset-x-0 top-2/4 border-b border-dashed border-slate-200/80 pointer-events-none' />
                      <div className='absolute inset-x-0 top-3/4 border-b border-dashed border-slate-200/80 pointer-events-none' />

                      {segmentBars.map((bar, idx) => (
                        <div key={idx} className='flex-1 flex flex-col items-center gap-1 h-full justify-end z-10 group cursor-default'>
                          {/* Value pill on hover or default */}
                          <span className='text-[7px] font-bold text-[#344563] font-mono leading-none'>
                            {bar.val}
                          </span>
                          <div
                            className='w-full rounded-t-sm shadow-xs transition-all duration-300 group-hover:opacity-90'
                            style={{ height: bar.pct, backgroundColor: bar.color }}
                          />
                          <span className='text-[8px] font-bold text-[#344563] font-mono'>{bar.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Summary Footer Bar inside Dashboard */}
                    <div className='mt-1 pt-1 border-t border-[#E5EBF3] flex items-center justify-between text-[8px] text-[#8190A5] font-mono'>
                      <span>High-Value Retention: 92%</span>
                      <span className='text-[#0866F5] font-bold'>Deterministic Calculation</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Laptop Keyboard Lip and Stand */}
              <div className='relative h-3.5 bg-slate-300 rounded-b-xl shadow-lg border-t border-slate-400 flex items-center justify-center'>
                <div className='w-16 h-1 rounded-full bg-slate-400' />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
