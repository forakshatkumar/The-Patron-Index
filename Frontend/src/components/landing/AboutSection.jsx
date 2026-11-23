import { UploadCloud, BarChart3, Lightbulb, ArrowRight, ShieldCheck } from 'lucide-react'
import logoImg from '../../assets/logo.png'

export default function AboutSection ({ onOpenDemo }) {
  const points = [
    {
      icon: UploadCloud,
      title: 'Upload your CSV data in seconds',
      desc: 'Seamless ingestion supporting Excel, POS, and e-commerce transaction logs.'
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

  return (
    <section id='about' className='py-20 md:py-28 bg-[#F8FAFD] border-t border-b border-slate-100 relative overflow-hidden'>
      {/* Decorative soft blue backdrop highlight */}
      <div className='absolute -left-32 top-1/3 w-96 h-96 bg-[#EEF4FC] rounded-full blur-3xl opacity-80 pointer-events-none' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center'>
          
          {/* Left Column: Text & Features */}
          <div className='lg:col-span-6 space-y-6'>
            <div>
              <span className='text-xs font-bold tracking-wider uppercase text-[#0066FF] flex items-center gap-1.5 mb-2'>
                <span>About The Patron Index</span>
                <span className='w-6 h-0.5 bg-[#0066FF]' />
              </span>
              <h2 className='text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B2545] tracking-tight font-display leading-tight mb-4'>
                Understand your customers. <br className='hidden sm:block' />Grow your business.
              </h2>
              <p className='text-slate-600 text-base sm:text-lg leading-relaxed'>
                The Patron Index helps you analyse your customer behaviour, identify valuable segments, and make data-driven decisions — all in a simple, secure and affordable platform.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className='space-y-4 pt-2'>
              {points.map((pt, i) => {
                const IconComponent = pt.icon
                return (
                  <div key={i} className='flex items-start gap-4 p-3.5 rounded-xl bg-white border border-slate-100 shadow-2xs hover:border-[#0066FF]/30 transition-all'>
                    <div className='w-10 h-10 rounded-full bg-[#EEF4FC] text-[#0066FF] flex items-center justify-center flex-shrink-0 mt-0.5'>
                      <IconComponent className='w-5 h-5' />
                    </div>
                    <div>
                      <h3 className='text-sm sm:text-base font-bold text-[#0B2545] font-display'>
                        {pt.title}
                      </h3>
                      <p className='text-xs text-slate-500 mt-0.5'>
                        {pt.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* CTA */}
            <div className='pt-2'>
              <button
                type='button'
                onClick={onOpenDemo}
                className='inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#0066FF] transition-all shadow-md hover:shadow-lg'
              >
                <span>Know More</span>
                <ArrowRight className='w-4 h-4' />
              </button>
            </div>
          </div>

          {/* Right Column: Realistic Laptop Mockup with Live UI */}
          <div className='lg:col-span-6 relative'>
            <div className='relative mx-auto max-w-[540px]'>
              {/* Laptop Screen Body */}
              <div className='relative rounded-t-2xl bg-slate-900 p-2.5 sm:p-3 shadow-2xl border-2 border-slate-800'>
                {/* Camera dot */}
                <div className='w-2 h-2 rounded-full bg-slate-700 mx-auto mb-2' />

                {/* Internal Screen with App UI */}
                <div className='rounded-lg bg-white overflow-hidden border border-slate-200 aspect-[16/10] p-4 flex flex-col justify-between text-xs select-none shadow-inner'>
                  {/* Mock Top bar */}
                  <div className='flex items-center justify-between pb-2.5 border-b border-slate-100'>
                    <div className='flex items-center gap-2'>
                      <img src={logoImg} alt='Logo' className='w-5 h-5 object-contain' />
                      <span className='font-bold text-[#0B2545] text-[11px]'>The Patron Index</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='px-2 py-0.5 rounded text-[9px] bg-emerald-50 text-emerald-600 font-bold'>
                        Live Intelligence
                      </span>
                      <ShieldCheck className='w-3.5 h-3.5 text-[#0066FF]' />
                    </div>
                  </div>

                  {/* Mock Stats inside Screen */}
                  <div className='grid grid-cols-3 gap-2 py-2'>
                    <div className='p-2 bg-[#F8FAFD] rounded-lg border border-slate-100'>
                      <div className='text-[9px] text-slate-400'>Total Buyers</div>
                      <div className='text-xs font-bold text-[#0B2545]'>12,480</div>
                    </div>
                    <div className='p-2 bg-[#F8FAFD] rounded-lg border border-slate-100'>
                      <div className='text-[9px] text-slate-400'>Revenue Tracked</div>
                      <div className='text-xs font-bold text-[#0066FF]'>₹8.4L</div>
                    </div>
                    <div className='p-2 bg-[#F8FAFD] rounded-lg border border-slate-100'>
                      <div className='text-[9px] text-slate-400'>Patron Score</div>
                      <div className='text-xs font-bold text-emerald-600'>84 / 100</div>
                    </div>
                  </div>

                  {/* Mock Bar Chart inside screen */}
                  <div className='bg-[#F8FAFD] p-2.5 rounded-lg border border-slate-100 flex-1 flex flex-col justify-between'>
                    <div className='flex justify-between items-center text-[9px] text-slate-500 font-semibold mb-1'>
                      <span>Segment Breakdown</span>
                      <span className='text-[#0066FF]'>Deterministic RFM</span>
                    </div>

                    <div className='flex items-end justify-between h-16 gap-2 px-1'>
                      {[
                        { label: 'VIP', height: '85%', color: '#0B2545' },
                        { label: 'Loyal', height: '70%', color: '#0066FF' },
                        { label: 'Regular', height: '55%', color: '#38BDF8' },
                        { label: 'New', height: '40%', color: '#7C5CFF' },
                        { label: 'At-Risk', height: '28%', color: '#F59E0B' },
                        { label: 'Inactive', height: '15%', color: '#94A3B8' }
                      ].map((bar, idx) => (
                        <div key={idx} className='flex-1 flex flex-col items-center gap-1 h-full justify-end'>
                          <div
                            className='w-full rounded-t-sm transition-all duration-500'
                            style={{ height: bar.height, backgroundColor: bar.color }}
                          />
                          <span className='text-[8px] font-mono text-slate-500'>{bar.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Laptop Keyboard Base & Hinge */}
              <div className='relative h-3 sm:h-4 bg-slate-300 rounded-b-xl shadow-lg border-t border-slate-400 flex items-center justify-center'>
                <div className='w-16 h-1 rounded-full bg-slate-400' />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
