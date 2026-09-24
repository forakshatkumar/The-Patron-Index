import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SegmentBadge from '../components/SegmentBadge'
import { useAuth } from '../context/AuthContext'
import { getCustomers } from '../services/api'
import { normalizeCustomer } from '../services/customerMapper'
import { segmentData as demoSegments, customers as demoCustomers } from '../data/mockData'

function Segments () {
  const { demoMode } = useAuth()
  const [customers, setCustomers] = useState(demoMode ? demoCustomers : [])
  useEffect(() => { if (!demoMode) getCustomers().then(data => setCustomers((data.customers || []).map(normalizeCustomer))).catch(() => {}) }, [demoMode])

  const segments = useMemo(() => {
    if (demoMode) return demoSegments
    const total = customers.length
    const names = ['VIP', 'Loyal', 'Regular', 'New', 'Occasional', 'At-Risk', 'Inactive']
    return names.map((name, index) => {
      const group = customers.filter(c => c.segment === name)
      const revenue = group.reduce((sum, c) => sum + c.totalSpending, 0)
      const allRevenue = customers.reduce((sum, c) => sum + c.totalSpending, 0) || 1
      return {
        id: index + 1, name, customers: group.length,
        percentage: Math.round((group.length / total) * 100),
        revenueContribution: Math.round((revenue / allRevenue) * 100),
        averageSpending: group.length ? Math.round(revenue / group.length) : 0,
        purchaseFrequency: group.length ? Math.round(group.reduce((sum, c) => sum + c.purchaseFrequency, 0) / group.length) : 0,
        lastActivity: group.length ? `${Math.min(...group.map(c => c.recency || 0))} days ago` : '—'
      }
    })
  }, [customers, demoMode])

  return <div className='page'><div className='page-heading'><div><h2>Customer Segments</h2><p>Understand customer behaviour and contribution to your business.</p></div></div><div className='segment-card-grid'>{segments.map(segment => <section className='card segment-card' key={segment.id}><div className='segment-card-header'><SegmentBadge segment={segment.name} /><strong>{segment.percentage}%</strong></div><h2>{segment.customers.toLocaleString()}</h2><span className='muted-text'>Customers</span><div className='segment-metrics'><div><span>Revenue Contribution</span><strong>{segment.revenueContribution}%</strong></div><div><span>Average Spending</span><strong>₹{segment.averageSpending.toLocaleString()}</strong></div><div><span>Purchase Frequency</span><strong>{segment.purchaseFrequency}</strong></div><div><span>Last Activity</span><strong>{segment.lastActivity}</strong></div></div><Link to={`/customers?segment=${encodeURIComponent(segment.name)}`} className='segment-view-button'>View Customers →</Link></section>)}</div></div>
}

export default Segments
