import { useState } from 'react'
import { LayoutDashboard, Users, BarChart3, Search } from 'lucide-react'

export default function DashboardPreviewSection () {
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'customers' | 'analytics'
  const [hoveredRevenuePoint, setHoveredRevenuePoint] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const revenuePoints = [
    { month: 'Apr', val: 9.8, x: 20, y: 70 },
    { month: 'May', val: 11.2, x: 60, y: 60 },
    { month: 'Jun', val: 10.8, x: 100, y: 64 },
    { month: 'Jul', val: 13.9, x: 140, y: 44 },
    { month: 'Aug', val: 15.6, x: 180, y: 32 },
    { month: 'Sep', val: 18.4, x: 220, y: 15 }
  ]

  const customerRows = [
    { id: 'CUST-1041', name: 'Aarav Mehta', spend: '₹48,200', orders: 28, segment: 'VIP', score: 92 },
    { id: 'CUST-1045', name: 'Ananya Gupta', spend: '₹22,400', orders: 16, segment: 'Loyal', score: 81 },
    { id: 'CUST-1048', name: 'Rohan Verma', spend: '₹11,400', orders: 8, segment: 'Regular', score: 68 },
    { id: 'CUST-1052', name: 'Vikram Rao', spend: '₹16,900', orders: 11, segment: 'At-Risk', score: 49 },
    { id: 'CUST-1055', name: 'Neha Kapoor', spend: '₹4,100', orders: 1, segment: 'New', score: 54 }
  ]

  const filteredCustomers = customerRows.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.segment.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <section id='dashboard' className='py-28 px-4 sm:px-6 lg:px-8 bg-[#0B0F14]'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center max-w-2xl mx-auto mb-12'>
          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#4F8CFF]/15 text-[#4F8CFF] border border-[#4F8CFF]/30 mb-4'>
            <BarChart3 className='w-3.5 h-3.5' />
            <span>Interactive Workspace</span>
          </span>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#E8EEF5] tracking-tight font-display mb-4'>
            Dashboard &amp; Customer Directory
          </h2>
          <p className='text-sm sm:text-base text-[#8A98A8] leading-relaxed'>
            See exactly how your customer analytics look in production. Switch between the business dashboard, customer directory, and segment distributions.
          </p>
        </div>

        {/* Tab Switcher Controls */}
        <div className='flex justify-center mb-8'>
          <div className='inline-flex p-1 rounded-full bg-[#121820] border border-[#222B36]'>
            <button
              type='button'
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#4F8CFF] text-[#0B0F14] shadow-md shadow-[#4F8CFF]/20'
                  : 'text-[#8A98A8] hover:text-[#E8EEF5]'
              }`}
            >
              <LayoutDashboard className='w-3.5 h-3.5' />
              <span>Overview</span>
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('customers')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'customers'
                  ? 'bg-[#4F8CFF] text-[#0B0F14] shadow-md shadow-[#4F8CFF]/20'
                  : 'text-[#8A98A8] hover:text-[#E8EEF5]'
              }`}
            >
              <Users className='w-3.5 h-3.5' />
              <span>Customers Directory</span>
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-[#4F8CFF] text-[#0B0F14] shadow-md shadow-[#4F8CFF]/20'
                  : 'text-[#8A98A8] hover:text-[#E8EEF5]'
              }`}
            >
              <BarChart3 className='w-3.5 h-3.5' />
              <span>Revenue Trend</span>
            </button>
          </div>
        </div>

        {/* 3D Browser Mockup Frame */}
        <div className='relative bg-[#121820] border border-[#222B36] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-700 ease-out'>
          {/* Top Window Bar */}
          <div className='px-4 py-3 bg-[#18222E] border-b border-[#222B36] flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='w-3 h-3 rounded-full bg-[#FF5D6C]/80' />
              <span className='w-3 h-3 rounded-full bg-[#F5B83D]/80' />
              <span className='w-3 h-3 rounded-full bg-[#3DD6A0]/80' />
            </div>
            <span className='text-xs font-mono text-[#8A98A8]'>thepatronindex.internal/workspace/overview</span>
            <span className='text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B0F14] text-[#3DD6A0] border border-[#222B36]'>
              Live Session
            </span>
          </div>

          {/* Cross-fading View Content */}
          <div className='p-6 sm:p-8'>
            {/* TAB 1: DASHBOARD VIEW */}
            {activeTab === 'dashboard' && (
              <div className='space-y-6 animate-fadeIn'>
                {/* 4 KPI Cards */}
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                  <div className='p-4 bg-[#0B0F14] rounded-xl border border-[#222B36]'>
                    <span className='text-xs text-[#8A98A8] block mb-1'>Total Customers</span>
                    <strong className='text-2xl font-bold font-mono text-[#E8EEF5]'>2,482</strong>
                    <span className='text-[10px] text-[#3DD6A0] block mt-1'>+12% this quarter</span>
                  </div>
                  <div className='p-4 bg-[#0B0F14] rounded-xl border border-[#222B36]'>
                    <span className='text-xs text-[#8A98A8] block mb-1'>Active Customers</span>
                    <strong className='text-2xl font-bold font-mono text-[#4F8CFF]'>1,864</strong>
                    <span className='text-[10px] text-[#3DD6A0] block mt-1'>75.1% retention rate</span>
                  </div>
                  <div className='p-4 bg-[#0B0F14] rounded-xl border border-[#222B36]'>
                    <span className='text-xs text-[#8A98A8] block mb-1'>High-Value Segment</span>
                    <strong className='text-2xl font-bold font-mono text-[#F5B83D]'>286</strong>
                    <span className='text-[10px] text-[#F5B83D] block mt-1'>VIP &amp; Loyal cohort</span>
                  </div>
                  <div className='p-4 bg-[#0B0F14] rounded-xl border border-[#222B36]'>
                    <span className='text-xs text-[#8A98A8] block mb-1'>Tracked Revenue</span>
                    <strong className='text-2xl font-bold font-mono text-[#3DD6A0]'>₹18.4L</strong>
                    <span className='text-[10px] text-[#3DD6A0] block mt-1'>Last 6 months</span>
                  </div>
                </div>

                {/* Split preview */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  <div className='p-5 bg-[#0B0F14] rounded-xl border border-[#222B36]'>
                    <div className='flex justify-between items-center mb-4'>
                      <strong className='text-sm text-[#E8EEF5] font-display'>Segment Distribution</strong>
                      <span className='text-xs text-[#8A98A8] font-mono'>7 Classes</span>
                    </div>
                    <div className='space-y-3 text-xs'>
                      <div>
                        <div className='flex justify-between text-[#8A98A8] mb-1'>
                          <span className='text-[#F5B83D] font-bold'>VIP Customers</span>
                          <span>8% (198)</span>
                        </div>
                        <div className='h-2 bg-[#18222E] rounded-full overflow-hidden'>
                          <div className='h-full bg-[#F5B83D] w-[8%]' />
                        </div>
                      </div>
                      <div>
                        <div className='flex justify-between text-[#8A98A8] mb-1'>
                          <span className='text-[#3DD6A0] font-bold'>Loyal Customers</span>
                          <span>24% (596)</span>
                        </div>
                        <div className='h-2 bg-[#18222E] rounded-full overflow-hidden'>
                          <div className='h-full bg-[#3DD6A0] w-[24%]' />
                        </div>
                      </div>
                      <div>
                        <div className='flex justify-between text-[#8A98A8] mb-1'>
                          <span className='text-[#4F8CFF] font-bold'>Regular Customers</span>
                          <span>35% (868)</span>
                        </div>
                        <div className='h-2 bg-[#18222E] rounded-full overflow-hidden'>
                          <div className='h-full bg-[#4F8CFF] w-[35%]' />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='p-5 bg-[#0B0F14] rounded-xl border border-[#222B36] flex flex-col justify-between'>
                    <strong className='text-sm text-[#E8EEF5] font-display mb-2'>Recent Grounded Alert</strong>
                    <p className='text-xs text-[#8A98A8] leading-relaxed mb-4'>
                      &quot;34 high-value patrons have not ordered in 48 days (standard gap: 30 days). Recommended action: Send re-engagement communication before month-end.&quot;
                    </p>
                    <div className='p-3 bg-[#18222E] rounded-lg text-xs font-mono text-[#3DD6A0] border border-[#222B36]'>
                      Estimated salvageable revenue: ₹2.8L
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CUSTOMERS DIRECTORY */}
            {activeTab === 'customers' && (
              <div className='space-y-4 animate-fadeIn'>
                <div className='flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#222B36]'>
                  <div className='relative w-64'>
                    <Search className='w-4 h-4 text-[#8A98A8] absolute left-3 top-1/2 -translate-y-1/2' />
                    <input
                      type='text'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder='Search by customer or segment...'
                      className='w-full pl-9 pr-3 py-1.5 text-xs bg-[#0B0F14] border border-[#222B36] rounded-lg text-[#E8EEF5] placeholder-[#8A98A8] outline-none focus:border-[#4F8CFF]'
                    />
                  </div>
                  <span className='text-xs font-mono text-[#8A98A8]'>Showing {filteredCustomers.length} records</span>
                </div>

                <div className='overflow-x-auto'>
                  <table className='w-full text-left text-xs font-mono border-collapse'>
                    <thead>
                      <tr className='text-[#8A98A8] border-b border-[#222B36]'>
                        <th className='py-2 px-3'>ID</th>
                        <th className='py-2 px-3'>Name</th>
                        <th className='py-2 px-3'>Lifetime Spend</th>
                        <th className='py-2 px-3'>Orders</th>
                        <th className='py-2 px-3'>Segment</th>
                        <th className='py-2 px-3 text-right'>Patron Score</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-[#222B36]/60 text-[#E8EEF5]'>
                      {filteredCustomers.map((cust) => (
                        <tr key={cust.id} className='hover:bg-[#18222E]/40'>
                          <td className='py-3 px-3 text-[#4F8CFF]'>{cust.id}</td>
                          <td className='py-3 px-3 font-semibold'>{cust.name}</td>
                          <td className='py-3 px-3'>{cust.spend}</td>
                          <td className='py-3 px-3'>{cust.orders}</td>
                          <td className='py-3 px-3'>
                            <span className='px-2 py-0.5 rounded text-[10px] font-bold bg-[#18222E] border border-[#222B36]'>
                              {cust.segment}
                            </span>
                          </td>
                          <td className='py-3 px-3 text-right font-bold text-[#3DD6A0]'>{cust.score} / 100</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: REVENUE ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className='space-y-6 animate-fadeIn'>
                <div className='flex items-center justify-between'>
                  <strong className='text-sm text-[#E8EEF5] font-display'>6-Month Revenue Trend (₹ Lakhs)</strong>
                  {hoveredRevenuePoint && (
                    <span className='text-xs font-mono text-[#3DD6A0] bg-[#18222E] px-2.5 py-1 rounded border border-[#222B36]'>
                      {hoveredRevenuePoint.month}: ₹{hoveredRevenuePoint.val}L tracked revenue
                    </span>
                  )}
                </div>

                {/* Hand-built Interactive SVG Chart with Tooltip */}
                <div className='bg-[#0B0F14] border border-[#222B36] rounded-xl p-6'>
                  <svg viewBox='0 0 240 100' className='w-full h-44 overflow-visible'>
                    {/* Grid Lines */}
                    <line x1='10' y1='20' x2='230' y2='20' stroke='#222B36' strokeDasharray='3 3' />
                    <line x1='10' y1='50' x2='230' y2='50' stroke='#222B36' strokeDasharray='3 3' />
                    <line x1='10' y1='80' x2='230' y2='80' stroke='#222B36' />

                    {/* Area under curve */}
                    <polygon
                      points='20,70 60,60 100,64 140,44 180,32 220,15 220,80 20,80'
                      fill='url(#chartGrad)'
                      opacity='0.25'
                    />

                    <defs>
                      <linearGradient id='chartGrad' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='0%' stopColor='#4F8CFF' />
                        <stop offset='100%' stopColor='#4F8CFF' stopOpacity='0' />
                      </linearGradient>
                    </defs>

                    {/* Revenue Line */}
                    <polyline
                      fill='none'
                      stroke='#4F8CFF'
                      strokeWidth='2.5'
                      strokeLinecap='round'
                      points='20,70 60,60 100,64 140,44 180,32 220,15'
                    />

                    {/* Data Points */}
                    {revenuePoints.map((pt, i) => (
                      <g key={i}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r='4'
                          fill='#E8EEF5'
                          stroke='#4F8CFF'
                          strokeWidth='2'
                          className='cursor-pointer transition-transform hover:scale-150'
                          onMouseEnter={() => setHoveredRevenuePoint(pt)}
                        />
                        <text
                          x={pt.x}
                          y='92'
                          fontSize='8'
                          fill='#8A98A8'
                          textAnchor='middle'
                          fontFamily='monospace'
                        >
                          {pt.month}
                        </text>
                      </g>
                    ))}
                  </svg>
                  <span className='text-[11px] font-mono text-[#8A98A8] text-center block mt-2'>
                    Hover any point to inspect verified monthly revenue
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

