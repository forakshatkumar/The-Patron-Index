import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, TrendingUp, Users, ShoppingBag, CheckCircle2 } from 'lucide-react'

export default function HeroSection ({ onOpenDemo }) {
  const [activePoint, setActivePoint] = useState(null)
  const [selectedSegment, setSelectedSegment] = useState(null)
  const [timeframe, setTimeframe] = useState('6M')

  // Sample data points for smooth line chart
  const linePoints = [
    { month: 'Jan', val: 5.2, x: 25, y: 72 },
    { month: 'Feb', val: 6.1, x: 75, y: 64 },
    { month: 'Mar', val: 5.8, x: 125, y: 68 },
    { month: 'Apr', val: 7.3, x: 175, y: 46 },
    { month: 'May', val: 7.9, x: 225, y: 38 },
    { month: 'Jun', val: 8.4, x: 275, y: 22 }
  ]

  // Donut chart segments
  const segments = [
    { name: 'High-Value', pct: '18%', color: '#0B2545', offset: 0, dash: 36, buyers: 2246 },
    { name: 'Loyal', pct: '32%', color: '#0066FF', offset: -36, dash: 64, buyers: 3993 },
    { name: 'Regular', pct: '28%', color: '#38BDF8', offset: -100, dash: 56, buyers: 3494 },
    { name: 'At-Risk', pct: '14%', color: '#F59E0B', offset: -156, dash: 28, buyers: 1747 },
    { name: 'Inactive', pct: '8%', color: '#94A3B8', offset: -184, dash: 16, buyers: 998 }
  ]

  const activeSegmentData = selectedSegment
    ? segments.find((s) => s.name === selectedSegment)
    : null

  return (
    <section id='home' className='relative pt-8 pb-18 md:py-20 overflow-hidden bg-white'>
      {/* Decorative soft pastel organic blobs matching design mockup */}
      <div className='absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-[#EBF3FE] blur-3xl opacity-75 pointer-events-none' />
      <div className='absolute top-1/2 -left-36 w-[420px] h-[420px] rounded-full bg-[#F3F8FE] blur-3xl opacity-80 pointer-events-none' />

      <div className='relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center'>
          
          {/* Left Column: Headlines & Action Buttons */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className='lg:col-span-6 space-y-6'
          >
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className='text-4xl sm:text-5xl lg:text-[56px] font-black text-[#0B2545] tracking-tight font-display leading-[1.08] mb-2'
              >
                The Patron Index
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className='text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0066FF] tracking-tight font-display'
              >
                Where Buyers Become Insight
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className='text-slate-600 text-base sm:text-lg leading-relaxed max-w-lg'
            >
              Turn your business data into powerful customer intelligence. Understand. Segment. Grow.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className='flex flex-wrap items-center gap-4 pt-1'
            >
              <Link
                to='/register'
                className='inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white bg-[#0B2545] hover:bg-[#0066FF] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
              >
                <span>Get Started Free</span>
                <ArrowRight className='w-4 h-4' />
              </Link>

              <a
                href='#about'
                className='inline-flex items-center px-7 py-3.5 rounded-full text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:border-[#0066FF] hover:text-[#0066FF] transition-all shadow-2xs hover:shadow-xs'
              >
                Learn More
              </a>
            </motion.div>

            {/* Quick trust reassurance bullets */}
            <div className='flex items-center gap-6 pt-2 text-xs text-slate-500 font-medium'>
              <span className='flex items-center gap-1.5'>
                <CheckCircle2 className='w-4 h-4 text-emerald-500' />
                <span>No code required</span>
              </span>
              <span className='flex items-center gap-1.5'>
                <CheckCircle2 className='w-4 h-4 text-emerald-500' />
                <span>Zero data lock-in</span>
              </span>
              <span className='flex items-center gap-1.5'>
                <CheckCircle2 className='w-4 h-4 text-emerald-500' />
                <span>Instant CSV audit</span>
              </span>
            </div>
          </motion.div>

          {/* Right Column: Floating Customer Overview Dashboard Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className='lg:col-span-6 relative'
          >
            {/* Soft decorative shadow backdrop */}
            <div className='absolute inset-0 bg-gradient-to-tr from-[#EBF3FE] to-[#D9EAFE] rounded-3xl -rotate-1 scale-102 opacity-75 blur-xs -z-10' />

            <div className='bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-7 shadow-[0_16px_48px_rgba(11,37,69,0.08)] space-y-5'>
              
              {/* Card Header */}
              <div className='flex items-center justify-between pb-3 border-b border-slate-100'>
                <div>
                  <h3 className='text-base sm:text-lg font-bold text-[#0B2545] font-display leading-tight'>
                    Customer Overview
                  </h3>
                  <p className='text-[11px] text-slate-400'>Aggregate customer metrics</p>
                </div>

                {/* Dropdown pill */}
                <div className='flex items-center bg-[#F8FAFD] border border-slate-200 rounded-lg p-0.5 text-xs font-semibold text-slate-600'>
                  {['6M', '3M', 'YTD'].map((t) => (
                    <button
                      key={t}
                      type='button'
                      onClick={() => setTimeframe(t)}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        timeframe === t
                          ? 'bg-white text-[#0B2545] shadow-2xs font-bold'
                          : 'text-slate-500 hover:text-[#0B2545]'
                      }`}
                    >
                      {t === '6M' ? 'Last 6 Months' : t === '3M' ? 'Last 3 Months' : 'YTD'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 KPI Metric Cards in a Row */}
              <div className='grid grid-cols-3 gap-3'>
                {/* Total Customers */}
                <div className='p-3 sm:p-3.5 rounded-xl bg-[#F8FAFD] border border-slate-100/90 flex flex-col justify-between hover:border-slate-200 transition-colors'>
                  <div className='flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1'>
                    <Users className='w-3.5 h-3.5 text-[#0066FF] flex-shrink-0' />
                    <span className='truncate'>Total Customers</span>
                  </div>
                  <div>
                    <div className='text-lg sm:text-xl font-extrabold text-[#0B2545] font-display'>
                      12,480
                    </div>
                    <div className='text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5'>
                      <TrendingUp className='w-2.5 h-2.5' />
                      <span>+12%</span>
                    </div>
                  </div>
                </div>

                {/* Total Revenue */}
                <div className='p-3 sm:p-3.5 rounded-xl bg-[#F8FAFD] border border-slate-100/90 flex flex-col justify-between hover:border-slate-200 transition-colors'>
                  <div className='flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1'>
                    <ShoppingBag className='w-3.5 h-3.5 text-[#0066FF] flex-shrink-0' />
                    <span className='truncate'>Total Revenue</span>
                  </div>
                  <div>
                    <div className='text-lg sm:text-xl font-extrabold text-[#0B2545] font-display'>
                      ₹8.4L
                    </div>
                    <div className='text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5'>
                      <TrendingUp className='w-2.5 h-2.5' />
                      <span>+18%</span>
                    </div>
                  </div>
                </div>

                {/* Active Customers */}
                <div className='p-3 sm:p-3.5 rounded-xl bg-[#F8FAFD] border border-slate-100/90 flex flex-col justify-between hover:border-slate-200 transition-colors'>
                  <div className='flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1'>
                    <Users className='w-3.5 h-3.5 text-emerald-600 flex-shrink-0' />
                    <span className='truncate'>Active Customers</span>
                  </div>
                  <div>
                    <div className='text-lg sm:text-xl font-extrabold text-[#0B2545] font-display'>
                      8,960
                    </div>
                    <div className='text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5'>
                      <TrendingUp className='w-2.5 h-2.5' />
                      <span>+14%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lower Split: Line Graph & Donut Segments */}
              <div className='grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1'>
                
                {/* SVG Revenue Line Graph */}
                <div className='sm:col-span-7 bg-[#F8FAFD] border border-slate-100 rounded-xl p-3.5'>
                  <div className='flex items-center justify-between mb-2 text-xs'>
                    <span className='font-bold text-slate-700'>Revenue Trend</span>
                    <span className='text-[10px] text-emerald-600 font-bold'>+28.4% growth</span>
                  </div>

                  <div className='relative h-28 w-full'>
                    <svg className='w-full h-full overflow-visible' viewBox='0 0 300 90'>
                      <defs>
                        <linearGradient id='heroCurveGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                          <stop offset='0%' stopColor='#0066FF' stopOpacity='0.25' />
                          <stop offset='100%' stopColor='#0066FF' stopOpacity='0.0' />
                        </linearGradient>
                      </defs>

                      {/* Area Gradient Fill */}
                      <path
                        d='M 25 72 C 60 65, 90 70, 125 68 C 160 65, 190 40, 225 38 C 255 35, 265 24, 275 22 L 275 90 L 25 90 Z'
                        fill='url(#heroCurveGradient)'
                      />

                      {/* Line Stroke */}
                      <path
                        d='M 25 72 C 60 65, 90 70, 125 68 C 160 65, 190 40, 225 38 C 255 35, 265 24, 275 22'
                        fill='none'
                        stroke='#0066FF'
                        strokeWidth='2.8'
                        strokeLinecap='round'
                      />

                      {/* Interactive Data Points */}
                      {linePoints.map((pt, idx) => (
                        <g key={idx}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={activePoint === idx ? '6' : '3.5'}
                            fill='#FFFFFF'
                            stroke='#0066FF'
                            strokeWidth='2.5'
                            className='cursor-pointer transition-all'
                            onMouseEnter={() => setActivePoint(idx)}
                            onMouseLeave={() => setActivePoint(null)}
                          />
                          {activePoint === idx && (
                            <text
                              x={pt.x}
                              y={pt.y - 10}
                              textAnchor='middle'
                              fontSize='9'
                              fontWeight='bold'
                              fill='#0B2545'
                            >
                              ₹{pt.val}L
                            </text>
                          )}
                        </g>
                      ))}
                    </svg>

                    {/* X-axis labels */}
                    <div className='flex justify-between text-[10px] text-slate-400 px-1 pt-1 font-mono'>
                      {linePoints.map((p) => (
                        <span key={p.month}>{p.month}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Donut Chart: Customer Segments */}
                <div className='sm:col-span-5 bg-[#F8FAFD] border border-slate-100 rounded-xl p-3.5 flex flex-col items-center justify-between'>
                  <span className='text-xs font-bold text-slate-700 self-start mb-2'>
                    Customer Segments
                  </span>

                  <div className='flex items-center gap-3 w-full justify-between'>
                    {/* SVG Donut Circle */}
                    <div className='relative w-20 h-20 flex-shrink-0'>
                      <svg className='w-full h-full -rotate-90' viewBox='0 0 100 100'>
                        <circle cx='50' cy='50' r='32' fill='none' stroke='#E2E8F0' strokeWidth='14' />
                        {segments.map((seg, i) => (
                          <circle
                            key={i}
                            cx='50'
                            cy='50'
                            r='32'
                            fill='none'
                            stroke={seg.color}
                            strokeWidth={selectedSegment === seg.name ? '17' : '14'}
                            strokeDasharray={`${seg.dash} 201`}
                            strokeDashoffset={seg.offset}
                            className='cursor-pointer transition-all'
                            onMouseEnter={() => setSelectedSegment(seg.name)}
                            onMouseLeave={() => setSelectedSegment(null)}
                          />
                        ))}
                      </svg>
                      <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
                        <span className='text-[10px] font-black text-[#0B2545] leading-none'>
                          {selectedSegment ? activeSegmentData?.pct : '100%'}
                        </span>
                      </div>
                    </div>

                    {/* Donut Legend */}
                    <div className='flex flex-col gap-1 text-[10px] text-slate-600 font-medium'>
                      {segments.map((s) => (
                        <button
                          key={s.name}
                          type='button'
                          onClick={() => setSelectedSegment(selectedSegment === s.name ? null : s.name)}
                          className='flex items-center gap-1.5 hover:text-[#0B2545] transition-colors cursor-pointer text-left'
                        >
                          <span
                            className='w-2 h-2 rounded-full flex-shrink-0'
                            style={{ backgroundColor: s.color }}
                          />
                          <span className={`truncate ${selectedSegment === s.name ? 'font-bold text-[#0B2545]' : ''}`}>
                            {s.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom live indicator and demo link */}
              <div className='pt-1 flex items-center justify-between text-[11px] text-slate-500'>
                <span className='flex items-center gap-1.5 font-medium'>
                  <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                  <span>Real-time transaction analysis</span>
                </span>
                <button
                  type='button'
                  onClick={onOpenDemo}
                  className='text-[#0066FF] font-bold hover:underline cursor-pointer'
                >
                  Experience Live Demo →
                </button>
              </div>

              {/* Selected Segment Toast */}
              <AnimatePresence>
                {activeSegmentData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className='overflow-hidden text-[11px] bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-slate-600 flex items-center justify-between'
                  >
                    <div>
                      <strong className='text-[#0B2545] font-semibold'>{activeSegmentData.name}:</strong>{' '}
                      <span>{activeSegmentData.buyers.toLocaleString()} buyers ({activeSegmentData.pct} of total revenue).</span>
                    </div>
                    <button
                      type='button'
                      onClick={() => setSelectedSegment(null)}
                      className='text-slate-400 hover:text-slate-700 ml-2'
                    >
                      ✕
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
