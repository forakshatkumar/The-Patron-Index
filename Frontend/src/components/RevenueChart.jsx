function RevenueChart ({ data = [] }) {
  if (!data.length) {
    return <div className='chart-empty'>No revenue data available.</div>
  }

  const width = 700
  const height = 260

  const paddingLeft = 45
  const paddingRight = 20
  const paddingTop = 25
  const paddingBottom = 40

  const chartWidth = width - paddingLeft - paddingRight

  const chartHeight = height - paddingTop - paddingBottom

  const values = data.map(item => item.value)

  const maximum = Math.max(...values)
  const minimum = Math.min(...values)

  const range = maximum - minimum || 1

  const points = data.map((item, index) => {
    const x = paddingLeft + (index / (data.length - 1 || 1)) * chartWidth

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

  return (
    <div className='revenue-chart-wrapper'>
      <svg
        className='revenue-chart'
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio='none'
      >
        {/* Horizontal guide lines */}

        {[0, 1, 2, 3].map(line => {
          const y = paddingTop + (line / 3) * chartHeight

          return (
            <line
              key={line}
              x1={paddingLeft}
              x2={width - paddingRight}
              y1={y}
              y2={y}
              className='chart-grid-line'
            />
          )
        })}

        {/* Revenue line */}

        <path d={path} className='chart-line' fill='none' />

        {/* Data points */}

        {points.map(point => (
          <circle
            key={point.label}
            cx={point.x}
            cy={point.y}
            r='4'
            className='chart-point'
          />
        ))}

        {/* Month labels */}

        {points.map(point => (
          <text
            key={`${point.label}-label`}
            x={point.x}
            y={height - 10}
            textAnchor='middle'
            className='chart-label'
          >
            {point.label}
          </text>
        ))}
      </svg>
    </div>
  )
}

export default RevenueChart
