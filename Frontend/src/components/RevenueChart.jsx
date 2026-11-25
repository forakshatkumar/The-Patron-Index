import { useState } from 'react'

function RevenueChart ({ data = [] }) {
  const [activePoint, setActivePoint] = useState(null)

  if (!data.length) {
    return <div className='chart-empty'>No revenue data available.</div>
  }

  const width = 700
  const height = 260

  const paddingLeft = 74
  const paddingRight = 20
  const paddingTop = 25
  const paddingBottom = 40

  const chartWidth = width - paddingLeft - paddingRight
  const chartHeight = height - paddingTop - paddingBottom

  const values = data.map(item => item.value)
  const maximum = Math.max(1,...values)
  const minimum = Math.min(0,...values)
  const range = maximum - minimum || 1

  const points = data.map((item, index) => {
    const x = paddingLeft + (data.length === 1 ? .5 : index / (data.length - 1)) * chartWidth
    const normalized = (item.value - minimum) / range
    const y = paddingTop + chartHeight - normalized * chartHeight
    return {
      x,
      y,
      ...item
    }
  })

  const path = points
    .map((point, index) =>
      index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
    )
    .join(' ')

  const groundY = height - paddingBottom
  const areaPath = `${path} L ${points[points.length - 1].x} ${groundY} L ${points[0].x} ${groundY} Z`

  return (
    <div className='revenue-chart-wrapper'>
      <svg
        className='revenue-chart'
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio='none'
        onMouseLeave={() => setActivePoint(null)}
      >
        <defs>
          <linearGradient id='revenue-area-gradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#0866f5' stopOpacity='0.28' />
            <stop offset='100%' stopColor='#0866f5' stopOpacity='0.02' />
          </linearGradient>
        </defs>

        {/* Horizontal guide lines */}
        {[0, 1, 2, 3].map(line => {
          const y = paddingTop + (line / 3) * chartHeight
          return (
            <g key={line}><text x={paddingLeft-8} y={y+4} textAnchor="end" className="chart-label">₹{Math.round(maximum - line/3*range).toLocaleString("en-IN")}</text><line
              x1={paddingLeft}
              x2={width - paddingRight}
              y1={y}
              y2={y}
              className='chart-grid-line'
            /></g>
          )
        })}

        {/* Gradient Area Fill */}
        <path d={areaPath} className='chart-area' fill='url(#revenue-area-gradient)' />

        {/* Revenue line with transition animation */}
        <path d={path} className='chart-line animated-chart-line' fill='none' />

        {/* Data points */}
        {points.map((point, idx) => (
          <g key={point.label} className='chart-point-group'>
            <circle
              cx={point.x}
              cy={point.y}
              r={activePoint?.label === point.label ? '6' : '4'}
              className={`chart-point ${activePoint?.label === point.label ? 'active' : ''}`}
              style={{ animationDelay: `${0.2 + idx * 0.08}s` }}
              onMouseEnter={() => setActivePoint(point)}
              onClick={() => setActivePoint(prev => prev?.label === point.label ? null : point)}
            />
            {/* Enlarged touch target */}
            <circle
              cx={point.x}
              cy={point.y}
              r='18'
              fill='transparent'
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setActivePoint(point)}
              onClick={() => setActivePoint(prev => prev?.label === point.label ? null : point)}
            />
          </g>
        ))}

        {/* Month labels */}
        {points.map(point => (
          <text
            key={`${point.label}-label`}
            x={point.x}
            y={height - 12}
            textAnchor='middle'
            className='chart-label'
          >
            {point.label}
          </text>
        ))}

        {/* Active Tooltip */}
        {activePoint && (
          <g
            className='chart-tooltip'
            style={{ pointerEvents: 'none' }}
            transform={`translate(${Math.min(Math.max(activePoint.x - 55, 10), width - 120)}, ${Math.max(activePoint.y - 42, 10)})`}
          >
            <rect
              width='110'
              height='30'
              rx='6'
              fill='#0b2345'
              opacity='0.94'
            />
            <text
              x='55'
              y='19'
              textAnchor='middle'
              fill='#ffffff'
              fontSize='11'
              fontWeight='600'
            >
              {activePoint.label}: ₹{Number(activePoint.value).toLocaleString()}
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}

export default RevenueChart
