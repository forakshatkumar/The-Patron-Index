import { useState } from 'react'
import { POWER_BI_COLORS } from '../data/chartConstants'

export function PowerBIDonut ({
  segments = [],
  totalCustomers = 0,
  activeSegment = 'All',
  onSelectSegment
}) {
  const [hoveredSegment, setHoveredSegment] = useState(null)

  const radius = 80
  const circumference = 2 * Math.PI * radius

  const slices = segments.map((seg, idx) => {
    const pct = seg.percentage || 0
    const strokeLength = (pct / 100) * circumference
    const strokeSpace = circumference - strokeLength
    const offset = -segments.slice(0, idx).reduce((acc, s) => acc + ((s.percentage || 0) / 100) * circumference, 0)
    return {
      ...seg,
      strokeLength,
      strokeSpace,
      offset
    }
  })

  const displayedSegment = hoveredSegment || (activeSegment !== 'All' ? segments.find(s => s.name === activeSegment) : null)

  return (
    <div className='powerbi-donut-container'>
      <div className='powerbi-chart-header'>
        <div>
          <h4>Segment Portfolio Composition</h4>
          <span className='powerbi-sub'>Interactive breakdown by customer volume & share</span>
        </div>
        {activeSegment !== 'All' && (
          <button
            type='button'
            className='powerbi-reset-btn'
            onClick={() => onSelectSegment && onSelectSegment('All')}
          >
            Clear Filter (✕ {activeSegment})
          </button>
        )}
      </div>

      <div className='powerbi-donut-visual'>
        <div className='powerbi-svg-wrapper'>
          <svg
            className='powerbi-donut-svg'
            viewBox='0 0 240 240'
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <defs>
              <linearGradient id='grad-vip' x1='0' y1='0' x2='1' y2='1'>
                <stop offset='0%' stopColor='#8B5CF6' />
                <stop offset='100%' stopColor='#6D28D9' />
              </linearGradient>
              <linearGradient id='grad-loyal' x1='0' y1='0' x2='1' y2='1'>
                <stop offset='0%' stopColor='#38BDF8' />
                <stop offset='100%' stopColor='#0284C7' />
              </linearGradient>
              <linearGradient id='grad-regular' x1='0' y1='0' x2='1' y2='1'>
                <stop offset='0%' stopColor='#2DD4BF' />
                <stop offset='100%' stopColor='#0D9488' />
              </linearGradient>
              <linearGradient id='grad-new' x1='0' y1='0' x2='1' y2='1'>
                <stop offset='0%' stopColor='#34D399' />
                <stop offset='100%' stopColor='#059669' />
              </linearGradient>
              <linearGradient id='grad-occasional' x1='0' y1='0' x2='1' y2='1'>
                <stop offset='0%' stopColor='#FBBF24' />
                <stop offset='100%' stopColor='#D97706' />
              </linearGradient>
              <linearGradient id='grad-atrisk' x1='0' y1='0' x2='1' y2='1'>
                <stop offset='0%' stopColor='#FB923C' />
                <stop offset='100%' stopColor='#EA580C' />
              </linearGradient>
              <linearGradient id='grad-inactive' x1='0' y1='0' x2='1' y2='1'>
                <stop offset='0%' stopColor='#F87171' />
                <stop offset='100%' stopColor='#DC2626' />
              </linearGradient>
              <filter id='donut-glow' x='-20%' y='-20%' width='140%' height='140%'>
                <feDropShadow dx='0' dy='4' stdDeviation='6' floodOpacity='0.25' />
              </filter>
            </defs>

            {/* Background Track */}
            <circle
              cx='120'
              cy='120'
              r={radius}
              className='powerbi-donut-track'
              fill='none'
              strokeWidth='24'
            />

            {/* Segments Arcs */}
            {slices.map((seg, idx) => {
              const isHovered = hoveredSegment?.name === seg.name
              const isSelected = activeSegment === seg.name
              const colors = POWER_BI_COLORS[seg.name] || { base: '#94A3B8', gradient: '#94A3B8' }

              return (
                <circle
                  key={seg.name}
                  cx='120'
                  cy='120'
                  r={radius}
                  fill='none'
                  stroke={colors.gradient}
                  strokeWidth={isHovered || isSelected ? '30' : '22'}
                  strokeDasharray={`${Math.max(0, seg.strokeLength - 2)} ${seg.strokeSpace + 2}`}
                  strokeDashoffset={seg.offset}
                  className={`powerbi-donut-slice ${isHovered || isSelected ? 'slice-active' : ''}`}
                  style={{
                    transformOrigin: '120px 120px',
                    transform: 'rotate(-90deg)',
                    filter: isHovered || isSelected ? 'url(#donut-glow)' : 'none',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    animationDelay: `${idx * 0.05}s`
                  }}
                  onMouseEnter={() => setHoveredSegment(seg)}
                  onClick={() => onSelectSegment && onSelectSegment(activeSegment === seg.name ? 'All' : seg.name)}
                />
              )
            })}
          </svg>

          {/* Dynamic Center Callout */}
          <div className='powerbi-donut-center'>
            {displayedSegment ? (
              <>
                <span className='powerbi-center-tag' style={{ color: POWER_BI_COLORS[displayedSegment.name]?.base }}>
                  {displayedSegment.name}
                </span>
                <strong className='powerbi-center-value'>
                  {displayedSegment.customers.toLocaleString()}
                </strong>
                <span className='powerbi-center-meta'>
                  {displayedSegment.percentage}% of Base
                </span>
              </>
            ) : (
              <>
                <span className='powerbi-center-tag'>Total Patrons</span>
                <strong className='powerbi-center-value'>
                  {totalCustomers.toLocaleString()}
                </strong>
                <span className='powerbi-center-meta'>Active Cohorts</span>
              </>
            )}
          </div>
        </div>

        {/* Multi-Color Power BI Legend & Filter Pills */}
        <div className='powerbi-legend-grid'>
          {segments.map(seg => {
            const isSelected = activeSegment === seg.name
            const isHovered = hoveredSegment?.name === seg.name
            const color = POWER_BI_COLORS[seg.name]?.base || '#64748B'

            return (
              <button
                key={seg.name}
                type='button'
                className={`powerbi-legend-item ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredSegment(seg)}
                onMouseLeave={() => setHoveredSegment(null)}
                onClick={() => onSelectSegment && onSelectSegment(isSelected ? 'All' : seg.name)}
              >
                <span className='powerbi-legend-dot' style={{ backgroundColor: color }} />
                <span className='powerbi-legend-name'>{seg.name}</span>
                <span className='powerbi-legend-pct'>{seg.percentage}%</span>
                <span className='powerbi-legend-count'>({seg.customers.toLocaleString()})</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function PowerBIBarChart ({
  segments = [],
  metric = 'spending',
  activeSegment = 'All',
  onSelectSegment
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const isSpending = metric === 'spending'
  const values = segments.map(s => isSpending ? (s.averageSpending || 0) : (s.revenueContribution || 0))
  const maxValue = Math.max(...values, 1)

  return (
    <div className='powerbi-barchart-container'>
      <div className='powerbi-chart-header'>
        <div>
          <h4>Cohort Economic Contribution</h4>
          <span className='powerbi-sub'>
            {isSpending ? 'Average customer spend (₹) per segment' : 'Revenue contribution percentage (%)'}
          </span>
        </div>
        {hoveredIndex !== null && segments[hoveredIndex] && (
          <div className='powerbi-header-readout'>
            <span className='readout-dot' style={{ backgroundColor: POWER_BI_COLORS[segments[hoveredIndex].name]?.base }} />
            <strong>{segments[hoveredIndex].name}:</strong>
            <span>{isSpending ? `₹${(segments[hoveredIndex].averageSpending || 0).toLocaleString()} avg` : `${segments[hoveredIndex].revenueContribution}% rev`}</span>
          </div>
        )}
      </div>

      <div className='powerbi-bar-canvas' onMouseLeave={() => setHoveredIndex(null)}>
        {segments.map((seg, idx) => {
          const val = isSpending ? (seg.averageSpending || 0) : (seg.revenueContribution || 0)
          const heightPct = Math.max(8, Math.round((val / maxValue) * 100))
          const isSelected = activeSegment === seg.name
          const isHovered = hoveredIndex === idx
          const color = POWER_BI_COLORS[seg.name]?.base || '#118DFF'

          return (
            <div
              key={seg.name}
              className={`powerbi-bar-col ${isSelected ? 'bar-selected' : ''} ${isHovered ? 'bar-hovered' : ''}`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onClick={() => onSelectSegment && onSelectSegment(isSelected ? 'All' : seg.name)}
            >
              {/* Value Label Above Bar */}
              <span className='powerbi-bar-val-label' style={{ color: isHovered || isSelected ? color : '#475569' }}>
                {isSpending ? `₹${val.toLocaleString()}` : `${val}%`}
              </span>

              {/* Animated Column Bar */}
              <div className='powerbi-bar-track'>
                <div
                  className='powerbi-bar-fill'
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: color,
                    boxShadow: isHovered || isSelected ? `0 6px 16px ${color}55` : 'none',
                    animationDelay: `${idx * 0.05}s`
                  }}
                />
              </div>

              {/* Cohort Name Below Bar */}
              <span className='powerbi-bar-x-label' style={{ fontWeight: isSelected ? 700 : 500 }}>
                {seg.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
