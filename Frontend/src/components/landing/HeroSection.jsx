import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Users, ShoppingCart, UserCheck } from 'lucide-react'

export default function HeroSection () {
  const [activePoint, setActivePoint] = useState(null)

  const linePoints = [
    { month: 'Jan', val: 5.2, x: 25, y: 72 },
    { month: 'Feb', val: 6.1, x: 75, y: 64 },
    { month: 'Mar', val: 5.8, x: 125, y: 68 },
    { month: 'Apr', val: 7.3, x: 175, y: 46 },
    { month: 'May', val: 7.9, x: 225, y: 38 },
    { month: 'Jun', val: 8.4, x: 275, y: 22 }
  ]

  const segments = [
    { name: 'High-Value', color: '#0B2545', offset: 0, dash: 36 },
    { name: 'Loyal', color: '#0066FF', offset: -36, dash: 64 },
    { name: 'Regular', color: '#38BDF8', offset: -100, dash: 56 },
    { name: 'At-Risk', color: '#F59E0B', offset: -156, dash: 28 },
    { name: 'Inactive', color: '#94A3B8', offset: -184, dash: 16 }
  ]

  return (
    <section id='home' className='relative pt-8 pb-16 md:py-20 overflow-hidden bg-white'>
      {/* Soft blue circular background blobs matching the screenshot */}
      <div className='absolute -top-16 right-4 sm:right-16 w-[420px] h-[420px] rounded-full bg-[#E8F1FC] blur-2xl opacity-70 pointer-events-none' />
      <div className='absolute top-2/3 right-1/3 w-[300px] h-[300px] rounded-full bg-[#F0F6FE] blur-2xl opacity-60 pointer-events-none' />

      <div className='max-w-[1160px] mx-auto px-4 sm:px-6 relative'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center'>
          
          {/* LEFT COLUMN: Headings, Subtitle & Action CTAs */}
          <div className='lg:col-span-6 space-y-5'>
            <div>
              <h1 className='text-4xl sm:text-5xl lg:text-[54px] font-black text-[#0B2545] tracking-tight font-display leading-[1.08] mb-2'>
                The Patron Index
              </h1>
              <h2 className='text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#0066FF] tracking-tight font-display'>
                Where Buyers Become Insight
              </h2>
            </div>

            <p className='text-slate-600 text-sm sm:text-base leading-relaxed max-w-md'>
              Turn your business data into powerful customer intelligence. Understand. Segment. Grow.
            </p>

            <div className='flex flex-wrap items-center gap-3.5 pt-2'>
              <Link
                to='/register'
                className='inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#0066FF] transition-all shadow-xs'
              >
                <span>Get Started Free</span>
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN: Customer Overview Floating Card */}
          <div className='lg:col-span-6 relative'>
            <div className='bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-[0_12px_40px_rgba(11,37,69,0.08)] space-y-4'>
              
              {/* Header */}
              <div className='flex items-center justify-between pb-2.5 border-b border-slate-100'>
                <h3 className='text-sm sm:text-base font-bold text-[#0B2545] font-display'>
                  Customer Overview
                </h3>
                <div className='text-[10px] sm:text-xs text-slate-500 bg-white border border-slate-200 rounded-md px-2 py-0.5 flex items-center gap-1 cursor-default'>
                  <span>Last 6 Months</span>
                  <span className='text-[9px] text-slate-400'>▾</span>
                </div>
              </div>

              {/* 3 Metric Cards */}
              <div className='grid grid-cols-3 gap-2.5 sm:gap-3'>
                {/* Total Customers */}
                <div className='p-2.5 sm:p-3 rounded-xl bg-[#F8FAFD] border border-slate-100'>
                  <div className='flex items-center gap-1.5 text-slate-400 text-[10px] mb-1'>
                    <Users className='w-3 h-3 text-[#0066FF]' />
                    <span className='truncate'>Total Customers</span>
                  </div>
                  <div className='text-base sm:text-lg font-bold text-[#0B2545] font-display leading-tight'>
                    12,480
                  </div>
                  <div className='text-[9px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5'>
                    <TrendingUp className='w-2.5 h-2.5' />
                    <span>+12%</span>
                  </div>
                </div>

                {/* Total Revenue */}
                <div className='p-2.5 sm:p-3 rounded-xl bg-[#F8FAFD] border border-slate-100'>
                  <div className='flex items-center gap-1.5 text-slate-400 text-[10px] mb-1'>
                    <ShoppingCart className='w-3 h-3 text-[#0066FF]' />
                    <span className='truncate'>Total Revenue</span>
                  </div>
                  <div className='text-base sm:text-lg font-bold text-[#0B2545] font-display leading-tight'>
                    ₹8.4L
                  </div>
                  <div className='text-[9px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5'>
                    <TrendingUp className='w-2.5 h-2.5' />
                    <span>+18%</span>
                  </div>
                </div>

                {/* Active Customers */}
                <div className='p-2.5 sm:p-3 rounded-xl bg-[#F8FAFD] border border-slate-100'>
                  <div className='flex items-center gap-1.5 text-slate-400 text-[10px] mb-1'>
                    <UserCheck className='w-3 h-3 text-[#0066FF]' />
                    <span className='truncate'>Active Customers</span>
                  </div>
                  <div className='text-base sm:text-lg font-bold text-[#0B2545] font-display leading-tight'>
                    8,960
                  </div>
                  <div className='text-[9px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5'>
                    <TrendingUp className='w-2.5 h-2.5' />
                    <span>+14%</span>
                  </div>
                </div>
              </div>

              {/* Lower Section: Revenue Trend Line Graph & Customer Segments Donut */}
              <div className='grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center pt-1'>
                
                {/* SVG Revenue Line Graph */}
                <div className='sm:col-span-7 bg-[#F8FAFD] border border-slate-100 rounded-xl p-3'>
                  <div className='relative h-24 w-full'>
                    <svg className='w-full h-full overflow-visible' viewBox='0 0 300 80'>
                      <defs>
                        <linearGradient id='heroCurveGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                          <stop offset='0%' stopColor='#0066FF' stopOpacity='0.22' />
                          <stop offset='100%' stopColor='#0066FF' stopOpacity='0.0' />
                        </linearGradient>
                      </defs>

                      {/* Area Fill */}
                      <path
                        d='M 25 65 C 60 58, 90 62, 125 60 C 160 58, 190 35, 225 32 C 255 30, 265 20, 275 18 L 275 80 L 25 80 Z'
                        fill='url(#heroCurveGradient)'
                      />

                      {/* Line Stroke */}
                      <path
                        d='M 25 65 C 60 58, 90 62, 125 60 C 160 58, 190 35, 225 32 C 255 30, 265 20, 275 18'
                        fill='none'
                        stroke='#0066FF'
                        strokeWidth='2.4'
                        strokeLinecap='round'
                      />

                      {/* Data Points */}
                      {linePoints.map((pt, idx) => (
                        <g key={idx}>
                          <circle
                            cx={pt.x}
                            cy={pt.y - 7}
                            r={activePoint === idx ? '5' : '3'}
                            fill='#FFFFFF'
                            stroke='#0066FF'
                            strokeWidth='2'
                            className='cursor-pointer transition-all'
                            onMouseEnter={() => setActivePoint(idx)}
                            onMouseLeave={() => setActivePoint(null)}
                          />
                          {activePoint === idx && (
                            <text
                              x={pt.x}
                              y={pt.y - 16}
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

                    {/* Months along bottom */}
                    <div className='flex justify-between text-[9px] text-slate-400 px-1 pt-0.5 font-medium'>
                      {linePoints.map((p) => (
                        <span key={p.month}>{p.month}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Donut Chart: Customer Segments */}
                <div className='sm:col-span-5 bg-[#F8FAFD] border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-between'>
                  <span className='text-[11px] font-bold text-[#0B2545] self-start mb-1.5'>
                    Customer Segments
                  </span>

                  <div className='flex items-center gap-2.5 w-full justify-between'>
                    {/* SVG Donut Circle */}
                    <div className='relative w-16 h-16 flex-shrink-0'>
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
                            strokeWidth='14'
                            strokeDasharray={`${seg.dash} 201`}
                            strokeDashoffset={seg.offset}
                          />
                        ))}
                      </svg>
                    </div>

                    {/* Donut Legend */}
                    <div className='flex flex-col gap-0.5 text-[9px] text-slate-600 font-medium'>
                      {segments.map((s) => (
                        <div key={s.name} className='flex items-center gap-1.5'>
                          <span
                            className='w-1.5 h-1.5 rounded-full flex-shrink-0'
                            style={{ backgroundColor: s.color }}
                          />
                          <span className='truncate'>{s.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
