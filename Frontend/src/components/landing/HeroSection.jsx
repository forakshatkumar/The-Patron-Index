import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Users, ShoppingBag } from 'lucide-react'

export default function HeroSection ({ onOpenDemo }) {
  const [activePoint, setActivePoint] = useState(null)
  const [selectedSegment, setSelectedSegment] = useState(null)

  const linePoints = [
    { month: 'Jan', val: 5.2, x: 25, y: 72 },
    { month: 'Feb', val: 6.1, x: 75, y: 64 },
    { month: 'Mar', val: 5.8, x: 125, y: 68 },
    { month: 'Apr', val: 7.3, x: 175, y: 46 },
    { month: 'May', val: 7.9, x: 225, y: 38 },
    { month: 'Jun', val: 8.4, x: 275, y: 22 }
  ]

  const segments = [
    { name: 'High-Value', count: '18%', color: '#0B2545', offset: 0, dash: 36 },
    { name: 'Loyal', count: '32%', color: '#0066FF', offset: -36, dash: 64 },
    { name: 'Regular', count: '28%', color: '#38BDF8', offset: -100, dash: 56 },
    { name: 'At-Risk', count: '14%', color: '#F59E0B', offset: -156, dash: 28 },
    { name: 'Inactive', count: '8%', color: '#94A3B8', offset: -184, dash: 16 }
  ]

  return (
    <section id='home' className='relative pt-8 pb-20 md:py-24 overflow-hidden bg-white'>
      {/* Decorative soft blue organic backdrop curves matching design mockup */}
      <div className='absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#EEF4FC] blur-2xl opacity-70 pointer-events-none' />
      <div className='absolute top-1/2 -left-40 w-[450px] h-[450px] rounded-full bg-[#F3F7FD] blur-3xl opacity-60 pointer-events-none' />

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center'>
          
          {/* Left Column: Headlines & CTAs */}
          <div className='lg:col-span-6 space-y-6'>
            <div>
              <h1 className='text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B2545] tracking-tight font-display leading-[1.1] mb-2'>
                The Patron Index
              </h1>
              <h2 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0066FF] tracking-tight font-display'>
                Where Buyers Become Insight
              </h2>
            </div>

            <p className='text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl'>
              Turn your business data into powerful customer intelligence. Understand. Segment. Grow.
            </p>

            <div className='flex flex-wrap items-center gap-4 pt-2'>
              <Link
                to='/register'
                className='inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#0066FF] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5'
              >
                <span>Get Started Free</span>
                <ArrowRight className='w-4 h-4' />
              </Link>

              <a
                href='#about'
                className='inline-flex items-center px-7 py-3.5 rounded-full text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:border-[#0066FF] hover:text-[#0066FF] transition-all shadow-xs'
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right Column: Floating Customer Overview Dashboard Mockup */}
          <div className='lg:col-span-6 relative'>
            {/* Background circular accent glow */}
            <div className='absolute inset-0 bg-gradient-to-tr from-[#EEF4FC] to-[#E0EDFD] rounded-3xl -rotate-1 scale-102 opacity-70 blur-xs -z-10' />

            <div className='bg-white border border-slate-100/80 rounded-2xl p-5 sm:p-7 shadow-[0_12px_40px_rgba(11,37,69,0.08)] space-y-5'>
              {/* Header */}
              <div className='flex items-center justify-between pb-3 border-b border-slate-100'>
                <div>
                  <h3 className='text-base sm:text-lg font-bold text-[#0B2545] font-display'>
                    Customer Overview
                  </h3>
                  <p className='text-xs text-slate-400'>Real-time aggregated intelligence</p>
                </div>
                <div className='text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-1 flex items-center gap-1.5'>
                  <span>Last 6 Months</span>
                  <span className='text-[10px] text-slate-400'>▾</span>
                </div>
              </div>

              {/* 3 KPI Metric Cards */}
              <div className='grid grid-cols-3 gap-3 sm:gap-4'>
                <div className='p-3 sm:p-4 rounded-xl bg-[#F8FAFD] border border-slate-100 flex flex-col justify-between'>
                  <div className='flex items-center gap-1.5 text-slate-400 text-[11px] mb-1'>
                    <Users className='w-3.5 h-3.5 text-[#0066FF]' />
                    <span className='truncate'>Total Customers</span>
                  </div>
                  <div>
                    <div className='text-lg sm:text-xl font-extrabold text-[#0B2545]'>12,480</div>
                    <div className='text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5'>
                      <TrendingUp className='w-2.5 h-2.5' />
                      <span>+12%</span>
                    </div>
                  </div>
                </div>

                <div className='p-3 sm:p-4 rounded-xl bg-[#F8FAFD] border border-slate-100 flex flex-col justify-between'>
                  <div className='flex items-center gap-1.5 text-slate-400 text-[11px] mb-1'>
                    <ShoppingBag className='w-3.5 h-3.5 text-[#0066FF]' />
                    <span className='truncate'>Total Revenue</span>
                  </div>
                  <div>
                    <div className='text-lg sm:text-xl font-extrabold text-[#0B2545]'>₹8.4L</div>
                    <div className='text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5'>
                      <TrendingUp className='w-2.5 h-2.5' />
                      <span>+18%</span>
                    </div>
                  </div>
                </div>

                <div className='p-3 sm:p-4 rounded-xl bg-[#F8FAFD] border border-slate-100 flex flex-col justify-between'>
                  <div className='flex items-center gap-1.5 text-slate-400 text-[11px] mb-1'>
                    <Users className='w-3.5 h-3.5 text-emerald-600' />
                    <span className='truncate'>Active Customers</span>
                  </div>
                  <div>
                    <div className='text-lg sm:text-xl font-extrabold text-[#0B2545]'>8,960</div>
                    <div className='text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5'>
                      <TrendingUp className='w-2.5 h-2.5' />
                      <span>+14%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lower Section: Revenue Curve + Donut Customer Segments */}
              <div className='grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-2'>
                {/* SVG Revenue Line Graph */}
                <div className='sm:col-span-7 bg-[#F8FAFD] border border-slate-100 rounded-xl p-3.5'>
                  <div className='flex items-center justify-between mb-2 text-xs'>
                    <span className='font-semibold text-slate-700'>Revenue Trend</span>
                    <span className='text-[10px] text-emerald-600 font-bold'>+28.4% QoQ</span>
                  </div>

                  <div className='relative h-28 w-full'>
                    <svg className='w-full h-full overflow-visible' viewBox='0 0 300 90'>
                      <defs>
                        <linearGradient id='heroLineGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                          <stop offset='0%' stopColor='#0066FF' stopOpacity='0.25' />
                          <stop offset='100%' stopColor='#0066FF' stopOpacity='0.0' />
                        </linearGradient>
                      </defs>

                      {/* Area Fill */}
                      <path
                        d='M 25 72 C 60 65, 90 70, 125 68 C 160 65, 190 40, 225 38 C 255 35, 265 24, 275 22 L 275 90 L 25 90 Z'
                        fill='url(#heroLineGradient)'
                      />

                      {/* Line Path */}
                      <path
                        d='M 25 72 C 60 65, 90 70, 125 68 C 160 65, 190 40, 225 38 C 255 35, 265 24, 275 22'
                        fill='none'
                        stroke='#0066FF'
                        strokeWidth='2.8'
                        strokeLinecap='round'
                      />

                      {/* Interactive Data points */}
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
                    <div className='flex justify-between text-[10px] text-slate-400 px-1 pt-1'>
                      {linePoints.map((p) => (
                        <span key={p.month}>{p.month}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Donut Chart: Customer Segments */}
                <div className='sm:col-span-5 bg-[#F8FAFD] border border-slate-100 rounded-xl p-3.5 flex flex-col items-center'>
                  <span className='text-xs font-semibold text-slate-700 self-start mb-2'>
                    Customer Segments
                  </span>

                  <div className='flex items-center gap-3 w-full justify-between'>
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
                        <span className='text-[10px] font-bold text-[#0B2545] leading-none'>
                          {selectedSegment ? selectedSegment.slice(0, 5) : '100%'}
                        </span>
                      </div>
                    </div>

                    {/* Mini Legend */}
                    <div className='flex flex-col gap-1 text-[10px] text-slate-600'>
                      {segments.map((s) => (
                        <div key={s.name} className='flex items-center gap-1.5'>
                          <span
                            className='w-2 h-2 rounded-full flex-shrink-0'
                            style={{ backgroundColor: s.color }}
                          />
                          <span className='truncate'>{s.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom live indicator */}
              <div className='pt-1 flex items-center justify-between text-[11px] text-slate-500'>
                <span className='flex items-center gap-1.5'>
                  <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                  <span>Real-time tenant data sync</span>
                </span>
                <button
                  type='button'
                  onClick={onOpenDemo}
                  className='text-[#0066FF] font-semibold hover:underline'
                >
                  Explore Interactive App →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
