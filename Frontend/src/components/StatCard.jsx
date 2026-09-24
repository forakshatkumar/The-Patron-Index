function StatCard ({
  title,
  value,
  change,
  positive = true,
  description,
  icon
}) {
  return (
    <div className='stat-card'>
      <div className='stat-card-top'>
        <div>
          <p className='stat-title'>{title}</p>

          <h2 className='stat-value'>{value}</h2>
        </div>

        {icon && <div className='stat-icon'>{icon}</div>}
      </div>

      <div className='stat-card-bottom'>
        {change && (
          <span
            className={
              positive ? 'stat-change positive' : 'stat-change negative'
            }
          >
            {positive ? '↑' : '↓'} {change}
          </span>
        )}

        {description && <span className='stat-description'>{description}</span>}
      </div>
    </div>
  )
}

export default StatCard
