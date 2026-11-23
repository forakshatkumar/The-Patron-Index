import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, TrendingUp, Users, ShoppingBag, UserCheck, CheckCircle2 } from 'lucide-react'

export default function HeroSection ({ onOpenDemo }) {
  const [activePoint, setActivePoint] = useState(null)
  const [selectedSegment, setSelectedSegment] = useState(null)
  const [timeframe, setTimeframe] = useState('6M')

  // Data sets based on selected timeframe
  const datasets = {
    '6M': [
      { month: 'Jan', val: 5.2, x: 25, y: 72 },
      { month: 'Feb', val: 6.1, x: 75, y: 64 },
      { month: 'Mar', val: 5.8, x: 125, y: 68 },
      { month: 'Apr', val: 7.3, x: 175, y: 46 },
      { month: 'May', val: 7.9, x: 225, y: 38 },
      { month: 'Jun', val: 8.4, x: 275, y: 22 }
    ],
    '3M': [
      { month: 'Apr', val: 7.3, x: 45, y: 55 },
      { month: 'May', val: 7.9, x: 150, y: 40 },
      { month: 'Jun', val: 8.4, x: 255, y: 24 }
    ],
    'YTD': [
      { month: 'Q1', val: 17.1, x: 60, y: 60 },
      { month: 'Q2', val: 23.6, x: 150, y: 35 },
      { month: 'Q3', val: 28.2, x: 240, y: 20 }
    ]
  }

  const currentPoints = datasets[timeframe] || datasets['6M']

  const segments = [
    { name: 'High-Value', pct: '18%', color: '#0B2345', offset: 0, dash: 36, buyers: 2246 },
    { name: 'Loyal', pct: '32%', color: '#0866F5', offset: -36, dash: 64, buyers: 3993 },
    { name: 'Regular', pct: '28%', color: '#00B8D9', offset: -100, dash: 56, buyers: 3494 },
    { name: 'At-Risk', pct: '14%', color: '#FFAB00', offset: -156, dash: 28, buyers: 1747 },
    { name: 'Inactive', pct: '8%', color: '#8190A5', offset: -184, dash: 16, buyers: 998 }
  ]

  const activeSegmentData = selectedSegment
    ? segments.find((s) => s.name === selectedSegment)
    : null

  return (
    <section id='home' className='relative pt-8 pb-16 md:py-20 overflow-hidden bg-[#FFFFFF]'>
      {/* Decorative soft pastel organic background highlights */}
      <div className='absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full bg-[#EFF5FF] blur-3xl opacity-80 pointer-events-none' />
      <div className='absolute top-1/2 -left-40 w-[420px] h-[420px] rounded-full bg-[#F3F7FD] blur-3xl opacity-70 pointer-events-none' />

      <div className='patron-container relative'>
        <div className='hero-two-col-grid'>
          
          {/* LEFT COLUMN: Headings, Descriptions, CTAs, Trust Badges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className='space-y-6'
          >
            <div>
              <h1 className='hero-title-clamp font-black text-[#0B2345] font-display mb-2'>
                The Patron Index
              </h1>
              <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0866F5] font-display tracking-tight'>
                Where Buyers Become Insight
              </h2>
            </div>

            <p className='text-[#344563] text-base sm:text-lg leading-relaxed max-w-xl'>
              Turn your business data into powerful customer intelligence. Understand. Segment. Grow.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className='flex flex-wrap items-center gap-4 pt-1'>
              <Link
                to='/register'
                className='inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white bg-[#0B2345] hover:bg-[#0866F5] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
              >
                <span>Get Started Free</span>
                <ArrowRight className='w-4 h-4' />
              </Link>

              <a
                href='#about'
                className='inline-flex items-center px-7 py-3.5 rounded-full text-sm font-semibold text-[#344563] bg-white border border-[#E5EBF3] hover:border-[#0866F5] hover:text-[#0866F5] transition-all shadow-2xs hover:shadow-xs'
              >
                Learn More
              </a>
            </div>

            {/* Trust Indicators in clean horizontal row */}
            <div className='flex flex-wrap items-center gap-6 pt-2 text-xs text-[#8190A5] font-medium'>
              <span className='flex items-center gap-1.5'>
                <CheckCircle2 className='w-4 h-4 text-[#00B884] flex-shrink-0' />
                <span className='text-[#344563]'>No code required</span>
              </span>
              <span className='flex items-center gap-1.5'>
                <CheckCircle2 className='w-4 h-4 text-[#00B884] flex-shrink-0' />
                <span className='text-[#344563]'>Zero data lock-in</span>
              </span>
              <span className='flex items-center gap-1.5'>
                <CheckCircle2 className='w-4 h-4 text-[#00B884] flex-shrink-0' />
                <span className='text-[#344563]'>Instant CSV audit</span>
              </span>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Customer Overview Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className='relative'
          >
            {/* Soft decorative glow background */}
            <div className='absolute inset-0 bg-gradient-to-tr from-[#EFF5FF] to-[#DCEBFE] rounded-3xl -rotate-1 scale-102 opacity-80 blur-xs -z-10' />

            <div className='bg-white border border-[#E5EBF3] rounded-2xl p-5 sm:p-6 shadow-[0_16px_40px_rgba(11,35,69,0.08)] space-y-4 sm:space-y-5'>
              
              {/* Dashboard Card Header */}
              <div className='flex items-center justify-between pb-3 border-b border-[#E5EBF3]'>
                <div>
                  <h3 className='text-base sm:text-lg font-bold text-[#0B2345] font-display leading-tight'>
                    Customer Overview
                  </h3>
                  <p className='text-[11px] text-[#8190A5]'>Real-time aggregated intelligence</p>
                </div>

                {/* Filter Controls with highlighted active selection */}
                <div className='flex items-center bg-[#F7F9FC] border border-[#E5EBF3] rounded-lg p-0.5 text-xs font-semibold'>
                  {['6M', '3M', 'YTD'].map((t) => (
                    <button
                      key={t}
                      type='button'
                      onClick={() => { setTimeframe(t); setActivePoint(null); }}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        timeframe === t
                          ? 'bg-white text-[#0B2345] shadow-2xs font-bold'
                          : 'text-[#8190A5] hover:text-[#0B2345]'
                      }`}
                    >
                      {t === '6M' ? 'Last 6 Months' : t === '3M' ? 'Last 3 Months' : 'YTD'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Metric Cards in Equal Height Row */}
              <div className='grid grid-cols-3 gap-2.5 sm:gap-3.5'>
                {/* Total Customers */}
                <div className='p-3 sm:p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E5EBF3] flex flex-col justify-between'>
                  <div className='flex items-center gap-1.5 text-[#8190A5] text-[11px] font-medium mb-1'>
                    <Users className='w-3.5 h-3.5 text-[#0866F5] flex-shrink-0' />
                    <span className='truncate'>Total Customers</span>
                  </div>
                  <div>
                    <div className='text-lg sm:text-xl font-extrabold text-[#0B2345] font-display'>
                      12,480
                    </div>
                    <div className='text-[10px] font-bold text-[#00B884] flex items-center gap-0.5 mt-0.5'>
                      <TrendingUp className='w-2.5 h-2.5' />
                      <span>+12%</span>
                    </div>
                  </div>
                </div>

                {/* Total Revenue */}
                <div className='p-3 sm:p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E5EBF3] flex flex-col justify-between'>
                  <div className='flex items-center gap-1.5 text-[#8190A5] text-[11px] font-medium mb-1'>
                    <ShoppingBag className='w-3.5 h-3.5 text-[#0866F5] flex-shrink-0' />
                    <span className='truncate'>Total Revenue</span>
                  </div>
                  <div>
                    <div className='text-lg sm:text-xl font-extrabold text-[#0B2345] font-display'>
                      ₹8.4L
                    </div>
                    <div className='text-[10px] font-bold text-[#00B884] flex items-center gap-0.5 mt-0.5'>
                      <TrendingUp className='w-2.5 h-2.5' />
                      <span>+18%</span>
                    </div>
                  </div>
                </div>

                {/* Active Customers */}
                <div className='p-3 sm:p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E5EBF3] flex flex-col justify-between'>
                  <div className='flex items-center gap-1.5 text-[#8190A5] text-[11px] font-medium mb-1'>
                    <UserCheck className='w-3.5 h-3.5 text-[#00B884] flex-shrink-0' />
                    <span className='truncate'>Active Customers</span>
                  </div>
                  <div>
                    <div className='text-lg sm:text-xl font-extrabold text-[#0B2345] font-display'>
                      8,960
                    </div>
                    <div className='text-[10px] font-bold text-[#00B884] flex items-center gap-0.5 mt-0.5'>
                      <TrendingUp className='w-2.5 h-2.5' />
                      <span>+14%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lower Section: Revenue Trend Line Graph & Customer Segments Donut */}
              <div className='grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center pt-1'>
                
                {/* SVG Revenue Line Graph */}
                <div className='sm:col-span-7 bg-[#F7F9FC] border border-[#E5EBF3] rounded-xl p-3.5'>
                  <div className='flex items-center justify-between mb-2 text-xs'>
                    <span className='font-bold text-[#0B2345]'>Revenue Trend</span>
                    <span className='text-[10px] text-[#00B884] font-bold'>+28.4% QoQ</span>
                  </div>

                  <div className='relative h-28 w-full'>
                    <svg className='w-full h-full overflow-visible' viewBox='0 0 300 90'>
                      <defs>
                        <linearGradient id='heroRevenueGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                          <stop offset='0%' stopColor='#0866F5' stopOpacity='0.25' />
                          <stop offset='100%' stopColor='#0866F5' stopOpacity='0.0' />
                        </linearGradient>
                      </defs>

                      {/* Area Gradient Fill */}
                      <path
                        d='M 25 72 C 60 65, 90 70, 125 68 C 160 65, 190 40, 225 38 C 255 35, 265 24, 275 22 L 275 90 L 25 90 Z'
                        fill='url(#heroRevenueGradient)'
                      />

                      {/* Line Stroke */}
                      <path
                        d='M 25 72 C 60 65, 90 70, 125 68 C 160 65, 190 40, 225 38 C 255 35, 265 24, 275 22'
                        fill='none'
                        stroke='#0866F5'
                        strokeWidth='2.8'
                        strokeLinecap='round'
                      />

                      {/* Hoverable Data Points with Tooltip */}
                      {currentPoints.map((pt, idx) => (
                        <g key={idx}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={activePoint === idx ? '6' : '3.5'}
                            fill='#FFFFFF'
                            stroke='#0866F5'
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
                              fill='#0B2345'
                            >
                              ₹{pt.val}L
                            </text>
                          )}
                        </g>
                      ))}
                    </svg>

                    {/* X-axis labels properly spaced without overlapping */}
                    <div className='flex justify-between text-[10px] text-[#8190A5] px-1 pt-1 font-mono font-medium'>
                      {currentPoints.map((p) => (
                        <span key={p.month}>{p.month}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Donut Chart: Customer Segments */}
                <div className='sm:col-span-5 bg-[#F7F9FC] border border-[#E5EBF3] rounded-xl p-3.5 flex flex-col items-center justify-between'>
                  <span className='text-xs font-bold text-[#0B2345] self-start mb-2'>
                    Customer Segments
                  </span>

                  <div className='flex items-center gap-3 w-full justify-between'>
                    {/* SVG Donut Circle */}
                    <div className='relative w-20 h-20 flex-shrink-0'>
                      <svg className='w-full h-full -rotate-90' viewBox='0 0 100 100'>
                        <circle cx='50' cy='50' r='32' fill='none' stroke='#E5EBF3' strokeWidth='14' />
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
                        <span className='text-[10px] font-black text-[#0B2345] leading-none'>
                          {selectedSegment ? activeSegmentData?.pct : '100%'}
                        </span>
                      </div>
                    </div>

                    {/* Donut Legend */}
                    <div className='flex flex-col gap-1 text-[10px] text-[#344563] font-medium'>
                      {segments.map((s) => (
                        <button
                          key={s.name}
                          type='button'
                          onClick={() => setSelectedSegment(selectedSegment === s.name ? null : s.name)}
                          className='flex items-center gap-1.5 hover:text-[#0866F5] transition-colors cursor-pointer text-left'
                        >
                          <span
                            className='w-2 h-2 rounded-full flex-shrink-0'
                            style={{ backgroundColor: s.color }}
                          />
                          <span className={`truncate ${selectedSegment === s.name ? 'font-bold text-[#0866F5]' : ''}`}>
                            {s.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Real-time telemetry badge & Experience Live Demo link */}
              <div className='pt-1 flex items-center justify-between text-[11px] text-[#8190A5]'>
                <span className='flex items-center gap-1.5 font-medium'>
                  <span className='w-2 h-2 rounded-full bg-[#00B884] animate-pulse' />
                  <span className='text-[#344563]'>Real-time tenant data sync</span>
                </span>
                <button
                  type='button'
                  onClick={onOpenDemo}
                  className='text-[#0866F5] font-bold hover:underline cursor-pointer'
                >
                  Experience Live Demo →
                </button>
              </div>

              {/* Selected Segment Toast Notification */}
              <AnimatePresence>
                {activeSegmentData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className='overflow-hidden text-[11px] bg-[#EFF5FF] border border-[#E5EBF3] rounded-lg p-2.5 text-[#344563] flex items-center justify-between'
                  >
                    <div>
                      <strong className='text-[#0B2345] font-semibold'>{activeSegmentData.name}:</strong>{' '}
                      <span>{activeSegmentData.buyers.toLocaleString()} buyers ({activeSegmentData.pct} revenue share).</span>
                    </div>
                    <button
                      type='button'
                      onClick={() => setSelectedSegment(null)}
                      className='text-[#8190A5] hover:text-[#0B2345] ml-2 font-bold cursor-pointer'
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
