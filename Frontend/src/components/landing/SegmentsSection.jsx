import { useState } from 'react'
import { Users, Info } from 'lucide-react'
import { SEGMENTS_DATA } from '../../data/mock'

const SEGMENTS_WITH_OFFSETS = SEGMENTS_DATA.map((seg, idx, arr) => {
  const pct = seg.percentage || 4
  const priorSum = arr.slice(0, idx).reduce((sum, item) => sum + (item.percentage || 4), 0)
  return {
    ...seg,
    pct,
    offset: -priorSum * 2.38,
    strokeDash: `${pct * 2.38} ${100 * 2.38}`
  }
})

export default function SegmentsSection () {
  const [activeSegmentId, setActiveSegmentId] = useState('vip')

  const activeSegment = SEGMENTS_DATA.find((s) => s.id === activeSegmentId) || SEGMENTS_DATA[0]

  return (
    <section id='segments' className='py-28 px-4 sm:px-6 lg:px-8 bg-[#0B0F14]'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center max-w-2xl mx-auto mb-14'>
          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#7C5CFF]/15 text-[#7C5CFF] border border-[#7C5CFF]/30 mb-4'>
            <Users className='w-3.5 h-3.5' />
            <span>PRD Section 5.4 // Customer Segmentation</span>
          </span>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#E8EEF5] tracking-tight font-display mb-4'>
            7 Deterministic Customer Segments
          </h2>
          <p className='text-sm sm:text-base text-[#8A98A8] leading-relaxed'>
            Customers are categorized into 7 clear groups based on real purchase recency, frequency, and spend. Click any segment below to explore typical behavior and proven retention actions.
          </p>
          <span className='inline-block text-[11px] font-mono text-[#8A98A8] bg-[#121820] border border-[#222B36] px-2.5 py-0.5 rounded-full mt-3'>
            Sample data // Illustrative distribution
          </span>
        </div>

        {/* Filter Chip Selector Row */}
        <div className='flex flex-wrap items-center justify-center gap-2 mb-10'>
          {SEGMENTS_DATA.map((seg) => {
            const isSelected = activeSegmentId === seg.id
            return (
              <button
                key={seg.id}
                type='button'
                onClick={() => setActiveSegmentId(seg.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#18222E] border-[#4F8CFF] text-[#E8EEF5] shadow-md shadow-[#4F8CFF]/20 scale-105'
                    : 'bg-[#121820] border-[#222B36] text-[#8A98A8] hover:text-[#E8EEF5]'
                }`}
              >
                <span
                  className='w-2.5 h-2.5 rounded-full'
                  style={{ backgroundColor: seg.color }}
                />
                <span>{seg.name}</span>
                <span className='text-[10px] font-mono opacity-60'>({seg.percentage}%)</span>
              </button>
            )
          })}
        </div>

        {/* Interactive Radial Distribution Ring & Expanded Card Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#121820] border border-[#222B36] rounded-2xl p-6 sm:p-10'>
          {/* Radial Segment Map (Visual Ring) */}
          <div className='lg:col-span-5 flex flex-col items-center justify-center relative'>
            <div className='relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center'>
              <svg className='w-full h-full -rotate-90' viewBox='0 0 100 100'>
                {/* Background Ring */}
                <circle
                  cx='50'
                  cy='50'
                  r='38'
                  fill='none'
                  stroke='#18222E'
                  strokeWidth='10'
                />

                {/* Segments rendered as color arcs */}
                {SEGMENTS_WITH_OFFSETS.map((seg) => (
                  <circle
                    key={seg.id}
                    cx='50'
                    cy='50'
                    r='38'
                    fill='none'
                    stroke={seg.color}
                    strokeWidth={activeSegmentId === seg.id ? '13' : '9'}
                    strokeDasharray={seg.strokeDash}
                    strokeDashoffset={seg.offset}
                    className='cursor-pointer transition-all duration-300'
                    onClick={() => setActiveSegmentId(seg.id)}
                    opacity={activeSegmentId === seg.id ? 1 : 0.65}
                  />
                ))}
              </svg>

              {/* Center Stat Hub */}
              <div className='absolute flex flex-col items-center text-center pointer-events-none'>
                <span className='text-[11px] font-mono text-[#8A98A8] uppercase tracking-wider'>Selected</span>
                <strong className='text-lg font-bold text-[#E8EEF5] leading-tight font-display'>
                  {activeSegment.name}
                </strong>
                <span
                  className='text-xl font-extrabold font-mono mt-0.5'
                  style={{ color: activeSegment.color }}
                >
                  {activeSegment.count} Patrons
                </span>
                <span className='text-[10px] text-[#8A98A8]'>({activeSegment.percentage}% of cohort)</span>
              </div>
            </div>
            <span className='text-xs text-[#8A98A8] mt-4 font-mono'>Click an arc on the ring to inspect</span>
          </div>

          {/* Expanded Segment Detail Card */}
          <div className='lg:col-span-7 flex flex-col justify-between space-y-6 bg-[#0B0F14]/70 border border-[#222B36] rounded-xl p-6'>
            <div className='flex items-start justify-between border-b border-[#222B36] pb-4'>
              <div>
                <span
                  className='text-xs font-mono font-bold uppercase tracking-wider block mb-1'
                  style={{ color: activeSegment.color }}
                >
                  ● {activeSegment.name}
                </span>
                <h3 className='text-xl font-bold text-[#E8EEF5] font-display'>
                  {activeSegment.definition}
                </h3>
              </div>
              <div className='text-right'>
                <span className='text-[10px] font-mono text-[#8A98A8] block'>Avg Lifetime Spend</span>
                <strong className='text-base font-bold text-[#3DD6A0]'>{activeSegment.avgSpend}</strong>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs'>
              <div className='p-3 bg-[#121820] rounded-lg border border-[#222B36]'>
                <span className='text-[#8A98A8] block mb-1 font-semibold'>Purchase Frequency:</span>
                <strong className='text-[#E8EEF5] font-mono'>{activeSegment.frequency}</strong>
              </div>
              <div className='p-3 bg-[#121820] rounded-lg border border-[#222B36]'>
                <span className='text-[#8A98A8] block mb-1 font-semibold'>Typical Customer Behaviour:</span>
                <p className='text-[#E8EEF5]'>{activeSegment.typicalBehaviour}</p>
              </div>
            </div>

            {/* Suggested Retention Action Callout */}
            <div className='p-4 rounded-xl bg-[#18222E] border border-[#4F8CFF]/30'>
              <div className='flex items-center gap-2 text-xs font-bold text-[#4F8CFF] mb-1.5'>
                <Info className='w-4 h-4' />
                <span>Recommended Retention Action:</span>
              </div>
              <p className='text-xs text-[#E8EEF5] leading-relaxed'>
                {activeSegment.suggestedAction}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

