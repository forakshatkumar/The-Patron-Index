import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  revenueData,
  customerGrowthData,
  segmentData,
  purchaseActivity
} from '../data/mockData'
import { POWER_BI_COLORS } from '../data/chartConstants'

// 1. Interactive Multi-Color Revenue Growth Chart
function InteractiveRevenueChart ({ data = [] }) {
  const [activePoint, setActivePoint] = useState(null)

  const width = 640
  const height = 240
  const paddingLeft = 45
  const paddingRight = 20
  const paddingTop = 25
  const paddingBottom = 35

  const chartWidth = width - paddingLeft - paddingRight
  const chartHeight = height - paddingTop - paddingBottom

  const values = data.map(item => item.value)
  const maximum = Math.max(...values, 1)
  const minimum = Math.min(...values, 0)
  const range = maximum - minimum || 1

  const points = data.map((item, index) => {
    const x = paddingLeft + (index / (data.length - 1 || 1)) * chartWidth
    const normalized = (item.value - minimum) / range
    const y = paddingTop + chartHeight - normalized * chartHeight
    const prevValue = index > 0 ? data[index - 1].value : item.value
    const growth = index > 0 ? Math.round(((item.value - prevValue) / prevValue) * 100) : 0
    return {
      x,
      y,
      growth,
      ...item
    }
  })

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const groundY = height - paddingBottom
  const areaPath = `${path} L ${points[points.length - 1].x} ${groundY} L ${points[0].x} ${groundY} Z`

  return (
    <div className='interactive-chart-wrapper' onMouseLeave={() => setActivePoint(null)}>
      <svg className='interactive-svg' viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id='rev-line-gradient' x1='0' y1='0' x2='1' y2='0'>
            <stop offset='0%' stopColor='#118DFF' />
            <stop offset='45%' stopColor='#00B4D8' />
            <stop offset='100%' stopColor='#8B5CF6' />
          </linearGradient>
          <linearGradient id='rev-area-gradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#118DFF' stopOpacity='0.35' />
            <stop offset='60%' stopColor='#8B5CF6' stopOpacity='0.12' />
            <stop offset='100%' stopColor='#8B5CF6' stopOpacity='0.01' />
          </linearGradient>
          <filter id='point-glow' x='-40%' y='-40%' width='180%' height='180%'>
            <feDropShadow dx='0' dy='2' stdDeviation='4' floodColor='#118DFF' floodOpacity='0.45' />
          </filter>
        </defs>

        {/* Horizontal Grid lines */}
        {[0, 1, 2, 3].map(line => {
          const y = paddingTop + (line / 3) * chartHeight
          const val = maximum - (line / 3) * range
          return (
            <g key={line}>
              <line
                x1={paddingLeft}
                x2={width - paddingRight}
                y1={y}
                y2={y}
                stroke='#E2E8F0'
                strokeDasharray='4 4'
                strokeWidth='1'
              />
              <text x={paddingLeft - 8} y={y + 4} textAnchor='end' fill='#64748B' fontSize='10'>
                ₹{(val / 100000).toFixed(1)}L
              </text>
            </g>
          )
        })}

        {/* Vibrant Gradient Area */}
        <path d={areaPath} fill='url(#rev-area-gradient)' />

        {/* Multi-Color Gradient Trendline */}
        <path
          d={path}
          fill='none'
          stroke='url(#rev-line-gradient)'
          strokeWidth='3.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='animated-chart-line'
        />

        {/* Vertical Active Crosshair */}
        {activePoint && (
          <line
            x1={activePoint.x}
            x2={activePoint.x}
            y1={paddingTop}
            y2={groundY}
            stroke='#8B5CF6'
            strokeWidth='1.5'
            strokeDasharray='3 3'
          />
        )}

        {/* Multi-Colored Interactive Points */}
        {points.map((pt, idx) => {
          const isActive = activePoint?.label === pt.label
          const colors = ['#118DFF', '#0EA5E9', '#06B6D4', '#6366F1', '#8B5CF6', '#7C3AED']
          const ptColor = colors[idx % colors.length]

          return (
            <g key={pt.label} onMouseEnter={() => setActivePoint(pt)} style={{ cursor: 'pointer' }}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isActive ? 8 : 5}
                fill='#ffffff'
                stroke={ptColor}
                strokeWidth={isActive ? 3.5 : 2.5}
                filter={isActive ? 'url(#point-glow)' : 'none'}
                style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
              {/* Invisible larger hover hit area */}
              <circle cx={pt.x} cy={pt.y} r='18' fill='transparent' />
              <text
                x={pt.x}
                y={height - 12}
                textAnchor='middle'
                fill={isActive ? '#0F172A' : '#64748B'}
                fontWeight={isActive ? 700 : 500}
                fontSize='11'
              >
                {pt.label}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Floating Interactive Tooltip */}
      {activePoint && (
        <div
          className='chart-float-tooltip'
          style={{
            left: `${(activePoint.x / width) * 100}%`,
            top: `${(activePoint.y / height) * 100}%`
          }}
        >
          <div className='tooltip-header'>
            <strong>{activePoint.label} 2026</strong>
            <span className={`growth-tag ${activePoint.growth >= 0 ? 'pos' : 'neg'}`}>
              {activePoint.growth >= 0 ? `+${activePoint.growth}%` : `${activePoint.growth}%`}
            </span>
          </div>
          <div className='tooltip-metric'>
            <span>Settled Revenue</span>
            <strong>₹{Number(activePoint.value).toLocaleString()}</strong>
          </div>
          <div className='tooltip-sub'>Daily Velocity: ₹{Math.round(activePoint.value / 30).toLocaleString()}/day</div>
        </div>
      )}
    </div>
  )
}

// 2. Interactive Multi-Color Customer Growth Chart
function InteractiveCustomerGrowthChart ({ data = [] }) {
  const [activePoint, setActivePoint] = useState(null)

  const width = 640
  const height = 240
  const paddingLeft = 45
  const paddingRight = 20
  const paddingTop = 25
  const paddingBottom = 35

  const chartWidth = width - paddingLeft - paddingRight
  const chartHeight = height - paddingTop - paddingBottom

  const values = data.map(item => item.customers)
  const maximum = Math.max(...values, 1)
  const minimum = Math.min(...values, 0)
  const range = maximum - minimum || 1

  const points = data.map((item, index) => {
    const x = paddingLeft + (index / (data.length - 1 || 1)) * chartWidth
    const normalized = (item.customers - minimum) / range
    const y = paddingTop + chartHeight - normalized * chartHeight
    const prevCount = index > 0 ? data[index - 1].customers : item.customers
    const netAdditions = index > 0 ? item.customers - prevCount : 0
    return {
      x,
      y,
      netAdditions,
      ...item
    }
  })

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const groundY = height - paddingBottom
  const areaPath = `${path} L ${points[points.length - 1].x} ${groundY} L ${points[0].x} ${groundY} Z`

  return (
    <div className='interactive-chart-wrapper' onMouseLeave={() => setActivePoint(null)}>
      <svg className='interactive-svg' viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id='cust-line-gradient' x1='0' y1='0' x2='1' y2='0'>
            <stop offset='0%' stopColor='#10B981' />
            <stop offset='50%' stopColor='#00B4D8' />
            <stop offset='100%' stopColor='#3B82F6' />
          </linearGradient>
          <linearGradient id='cust-area-gradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#10B981' stopOpacity='0.32' />
            <stop offset='60%' stopColor='#00B4D8' stopOpacity='0.12' />
            <stop offset='100%' stopColor='#00B4D8' stopOpacity='0.01' />
          </linearGradient>
          <filter id='cust-point-glow' x='-40%' y='-40%' width='180%' height='180%'>
            <feDropShadow dx='0' dy='2' stdDeviation='4' floodColor='#10B981' floodOpacity='0.5' />
          </filter>
        </defs>

        {/* Horizontal Grid lines */}
        {[0, 1, 2, 3].map(line => {
          const y = paddingTop + (line / 3) * chartHeight
          const val = Math.round(maximum - (line / 3) * range)
          return (
            <g key={line}>
              <line
                x1={paddingLeft}
                x2={width - paddingRight}
                y1={y}
                y2={y}
                stroke='#E2E8F0'
                strokeDasharray='4 4'
                strokeWidth='1'
              />
              <text x={paddingLeft - 8} y={y + 4} textAnchor='end' fill='#64748B' fontSize='10'>
                {val.toLocaleString()}
              </text>
            </g>
          )
        })}

        {/* Multi-Color Gradient Area */}
        <path d={areaPath} fill='url(#cust-area-gradient)' />

        {/* Trendline */}
        <path
          d={path}
          fill='none'
          stroke='url(#cust-line-gradient)'
          strokeWidth='3.5'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='animated-chart-line'
        />

        {/* Vertical Active Crosshair */}
        {activePoint && (
          <line
            x1={activePoint.x}
            x2={activePoint.x}
            y1={paddingTop}
            y2={groundY}
            stroke='#00B4D8'
            strokeWidth='1.5'
            strokeDasharray='3 3'
          />
        )}

        {/* Interactive Points */}
        {points.map((pt, idx) => {
          const isActive = activePoint?.month === pt.month
          const colors = ['#10B981', '#059669', '#0D9488', '#00B4D8', '#0284C7', '#3B82F6']
          const ptColor = colors[idx % colors.length]

          return (
            <g key={pt.month} onMouseEnter={() => setActivePoint(pt)} style={{ cursor: 'pointer' }}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isActive ? 8 : 5}
                fill='#ffffff'
                stroke={ptColor}
                strokeWidth={isActive ? 3.5 : 2.5}
                filter={isActive ? 'url(#cust-point-glow)' : 'none'}
                style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
              <circle cx={pt.x} cy={pt.y} r='18' fill='transparent' />
              <text
                x={pt.x}
                y={height - 12}
                textAnchor='middle'
                fill={isActive ? '#0F172A' : '#64748B'}
                fontWeight={isActive ? 700 : 500}
                fontSize='11'
              >
                {pt.month}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Floating Tooltip */}
      {activePoint && (
        <div
          className='chart-float-tooltip'
          style={{
            left: `${(activePoint.x / width) * 100}%`,
            top: `${(activePoint.y / height) * 100}%`
          }}
        >
          <div className='tooltip-header'>
            <strong>{activePoint.month} 2026</strong>
            <span className='growth-tag pos'>+{activePoint.netAdditions} new</span>
          </div>
          <div className='tooltip-metric'>
            <span>Active Patron Base</span>
            <strong>{activePoint.customers.toLocaleString()}</strong>
          </div>
          <div className='tooltip-sub'>Cumulative Growth: +{Math.round(((activePoint.customers - data[0].customers) / data[0].customers) * 100)}%</div>
        </div>
      )}
    </div>
  )
}

// 3. Interactive Multi-Color Segment Distribution Progress List
function InteractiveSegmentDistribution ({ segments = [] }) {
  const [hoveredSegment, setHoveredSegment] = useState(null)

  return (
    <div className='analytics-segment-list-vibrant' onMouseLeave={() => setHoveredSegment(null)}>
      {segments.map((segment, index) => {
        const colors = POWER_BI_COLORS[segment.name] || { base: '#118DFF' }
        const isHovered = hoveredSegment?.id === segment.id

        return (
          <Link
            key={segment.id}
            to={`/customers?segment=${encodeURIComponent(segment.name)}`}
            className={`analytics-segment-row-vibrant ${isHovered ? 'row-active' : ''}`}
            onMouseEnter={() => setHoveredSegment(segment)}
            style={{ '--segment-color': colors.base }}
          >
            <div className='segment-meta-col'>
              <span className='segment-color-dot' style={{ backgroundColor: colors.base }} />
              <strong className='segment-row-name'>{segment.name}</strong>
              <span className='segment-row-count'>({segment.customers.toLocaleString()})</span>
            </div>

            <div className='progress-track-vibrant'>
              <div
                className='progress-fill-vibrant'
                style={{
                  width: `${segment.percentage}%`,
                  backgroundColor: colors.base,
                  boxShadow: isHovered ? `0 2px 10px ${colors.base}66` : 'none',
                  animationDelay: `${index * 0.08}s`
                }}
              />
            </div>

            <div className='segment-percentage-col'>
              <strong style={{ color: isHovered ? colors.base : 'inherit' }}>
                {segment.percentage}%
              </strong>
            </div>

            {/* Hover Tooltip Details */}
            {isHovered && (
              <div className='segment-hover-card'>
                <span><strong>Avg Spend:</strong> ₹{(segment.averageSpending || 0).toLocaleString()}</span>
                <span><strong>Rev Share:</strong> {segment.revenueContribution || 0}%</span>
                <span><strong>Velocity:</strong> {segment.purchaseFrequency || 0} orders</span>
              </div>
            )}
          </Link>
        )
      })}
    </div>
  )
}

// 4. Interactive Multi-Color New vs Repeat Clustered Bar Chart
function InteractiveNewVsRepeatChart ({ activity = [] }) {
  const [hoveredMonth, setHoveredMonth] = useState(null)

  const maxVal = Math.max(...activity.map(a => Math.max(a.newCustomers, a.repeatCustomers)), 1)

  return (
    <div className='activity-chart-interactive-wrapper' onMouseLeave={() => setHoveredMonth(null)}>
      {/* Legend & Summary Ribbon */}
      <div className='activity-legend-bar'>
        <div className='activity-legend-item'>
          <span className='legend-color-box new-box' />
          <span>New Customers</span>
        </div>
        <div className='activity-legend-item'>
          <span className='legend-color-box repeat-box' />
          <span>Repeat Customers</span>
        </div>
        <span className='activity-retention-pill'>68.7% Retention Rate</span>
      </div>

      <div className='activity-chart-interactive'>
        {activity.map((item, index) => {
          const isHovered = hoveredMonth?.month === item.month
          const newHeight = Math.max(12, Math.round((item.newCustomers / maxVal) * 140))
          const repeatHeight = Math.max(12, Math.round((item.repeatCustomers / maxVal) * 140))
          const total = item.newCustomers + item.repeatCustomers
          const repeatPct = Math.round((item.repeatCustomers / total) * 100)

          return (
            <div
              key={item.month}
              className={`activity-column-interactive ${isHovered ? 'col-active' : ''}`}
              onMouseEnter={() => setHoveredMonth(item)}
            >
              <div className='activity-bars-interactive'>
                {/* New Customers Column */}
                <div
                  className='activity-bar-vibrant bar-new'
                  style={{
                    height: `${newHeight}px`,
                    animationDelay: `${index * 0.07}s`
                  }}
                  title={`New Customers: ${item.newCustomers}`}
                />

                {/* Repeat Customers Column */}
                <div
                  className='activity-bar-vibrant bar-repeat'
                  style={{
                    height: `${repeatHeight}px`,
                    animationDelay: `${index * 0.07 + 0.04}s`
                  }}
                  title={`Repeat Customers: ${item.repeatCustomers}`}
                />
              </div>

              <span className={`activity-x-label ${isHovered ? 'x-label-active' : ''}`}>
                {item.month}
              </span>

              {/* Hover Floating Tooltip */}
              {isHovered && (
                <div className='activity-tooltip'>
                  <div className='act-tooltip-title'>{item.month} 2026</div>
                  <div className='act-tooltip-row'>
                    <span className='dot-new' />
                    <span>New: <strong>{item.newCustomers}</strong></span>
                  </div>
                  <div className='act-tooltip-row'>
                    <span className='dot-repeat' />
                    <span>Repeat: <strong>{item.repeatCustomers}</strong></span>
                  </div>
                  <div className='act-tooltip-footer'>
                    <span>Repeat Share: <strong>{repeatPct}%</strong></span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Analytics () {
  return (
    <div className='page analytics-page'>
      <div className='page-heading'>
        <div>
          <h2>Analytics & Behavioral Insights</h2>
          <p>Interactive customer intelligence, cohort economic velocity, and retention dynamics.</p>
        </div>
      </div>

      <div className='analytics-page-grid'>
        {/* Card 1: Revenue Growth */}
        <section className='card analytics-card'>
          <div className='card-header-bar'>
            <div>
              <h3>Revenue Growth</h3>
              <p>Last 6 months performance trajectory</p>
            </div>
            <span className='analytics-kpi-badge kpi-purple'>
              Peak: ₹18.4L (+87.8%)
            </span>
          </div>
          <InteractiveRevenueChart data={revenueData} />
        </section>

        {/* Card 2: Customer Growth */}
        <section className='card analytics-card'>
          <div className='card-header-bar'>
            <div>
              <h3>Customer Growth</h3>
              <p>Total expanding active customer portfolio</p>
            </div>
            <span className='analytics-kpi-badge kpi-emerald'>
              Base: 2,482 (+74.8%)
            </span>
          </div>
          <InteractiveCustomerGrowthChart data={customerGrowthData} />
        </section>

        {/* Card 3: Segment Distribution */}
        <section className='card analytics-card'>
          <div className='card-header-bar'>
            <div>
              <h3>Segment Distribution</h3>
              <p>Breakdown across 7 behavioral cohorts</p>
            </div>
            <Link to='/customers' className='text-button' style={{ fontSize: '12px' }}>
              Explore Cohorts →
            </Link>
          </div>
          <InteractiveSegmentDistribution segments={segmentData} />
        </section>

        {/* Card 4: New vs Repeat Customers */}
        <section className='card analytics-card'>
          <div className='card-header-bar'>
            <div>
              <h3>New vs Repeat Customers</h3>
              <p>Transaction velocity and cohort retention balance</p>
            </div>
          </div>
          <InteractiveNewVsRepeatChart activity={purchaseActivity} />
        </section>
      </div>
    </div>
  )
}

export default Analytics
