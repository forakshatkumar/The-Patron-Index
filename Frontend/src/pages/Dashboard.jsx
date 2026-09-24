import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import RevenueChart from '../components/RevenueChart'
import SegmentBadge from '../components/SegmentBadge'
import { useAuth } from '../context/AuthContext'
import { getCustomers, getDashboardSummary } from '../services/api'
import { normalizeCustomer } from '../services/customerMapper'
import {
  dashboardStats as demoStats,
  revenueData,
  segmentData as demoSegments,
  customers as demoCustomers,
  dashboardInsights,
  purchaseActivity
} from '../data/mockData'

function Dashboard () {
  const { demoMode } = useAuth()
  const [summary, setSummary] = useState(null)
  const [customers, setCustomers] = useState(demoMode ? demoCustomers : [])
  const [error, setError] = useState('')

  useEffect(() => {
    if (demoMode) return
    Promise.all([getDashboardSummary(), getCustomers()])
      .then(([summaryData, customerData]) => {
        setSummary(summaryData)
        setCustomers((customerData.customers || []).map(normalizeCustomer))
      })
      .catch(err => setError(`${err.message}. Showing demo analytics where live data is unavailable.`))
  }, [demoMode])

  const useDemoFallback = demoMode || Boolean(error)
  const stats = summary || (useDemoFallback ? demoStats : { totalCustomers: 0, activeCustomers: 0, highValueCustomers: 0, totalRevenue: 0 })
  const recentCustomers = (useDemoFallback ? demoCustomers : customers).slice(0, 5)

  const segments = useMemo(() => {
    if (useDemoFallback) return demoSegments
    if (!customers.length) return []
    const total = customers.length
    const counts = customers.reduce((acc, customer) => {
      acc[customer.segment] = (acc[customer.segment] || 0) + 1
      return acc
    }, {})
    return Object.entries(counts).map(([name, count], index) => ({
      id: index + 1,
      name,
      customers: count,
      percentage: Math.round((count / total) * 100)
    }))
  }, [customers, useDemoFallback])

  return (
    <div className='page'>
      <div className='page-heading'>
        <div><h2>Business Overview</h2><p>Track customer activity, revenue and customer value.</p></div>
        <div className='page-actions'><Link to='/import' className='secondary-button'>Import Data</Link><Link to='/customers' className='primary-button'>View Customers</Link></div>
      </div>

      {error && <div className='info-banner'>{error}</div>}
      {demoMode && <div className='demo-banner'>Demo mode is active. Sign in to use live MongoDB data and secure uploads.</div>}

      <div className='stats-grid'>
        <StatCard title='Total Customers' value={Number(stats.totalCustomers || 0).toLocaleString()} change='Live' description={summary ? 'from database' : 'demo data'} icon='◉' />
        <StatCard title='Active Customers' value={Number(stats.activeCustomers ?? demoStats.activeCustomers).toLocaleString()} change='Current' description='active customers' icon='✓' />
        <StatCard title='High-Value Customers' value={Number(stats.highValueCustomers ?? demoStats.highValueCustomers).toLocaleString()} change='VIP + Loyal' description='priority segment' icon='★' />
        <StatCard title='Total Revenue' value={`₹${(Number(stats.totalRevenue ?? demoStats.totalRevenue) / 100000).toFixed(1)}L`} change='Tracked' description='customer value' icon='₹' />
      </div>

      <div className='dashboard-grid'>
        <section className='card dashboard-large-card'><div className='card-header'><div><h3>Revenue Trend</h3><p>Revenue performance over the last 6 months</p></div></div><RevenueChart data={revenueData} /></section>
        <section className='card'><div className='card-header'><div><h3>Customer Segments</h3><p>Distribution of your customer base</p></div><Link to='/segments' className='text-button'>View all</Link></div>
          <div className='segment-list'>{segments.map(segment => <div className='segment-summary-row' key={segment.id || segment.name}><SegmentBadge segment={segment.name} /><div className='segment-summary-right'><strong>{Number(segment.customers || 0).toLocaleString()}</strong><span>{segment.percentage}%</span></div></div>)}</div>
        </section>
      </div>

      <div className='dashboard-grid'>
        <section className='card dashboard-large-card'><div className='card-header'><div><h3>Purchase Activity</h3><p>New and repeat customer purchases</p></div></div>
          <div className='activity-chart'>{purchaseActivity.map(item => <div className='activity-column' key={item.month}><div className='activity-bars'><div className='activity-bar new-bar' style={{ height: `${item.newCustomers / 2}px` }}></div><div className='activity-bar repeat-bar' style={{ height: `${item.repeatCustomers / 2}px` }}></div></div><span>{item.month}</span></div>)}</div>
          <div className='chart-legend'><span><i className='legend-dot new-dot'></i>New Customers</span><span><i className='legend-dot repeat-dot'></i>Repeat Customers</span></div>
        </section>
        <section className='card'><div className='card-header'><div><h3>Key Insights</h3><p>Important changes in your business</p></div></div><div className='insight-list'>{dashboardInsights.map(insight => <div className={`insight-item ${insight.type}`} key={insight.id}><span className='insight-icon'>{insight.type === 'warning' ? '!' : '✓'}</span><p>{insight.title}</p></div>)}</div></section>
      </div>

      <section className='card'><div className='card-header'><div><h3>Recent Customers</h3><p>Recently active customers</p></div><Link to='/customers' className='text-button'>View all customers</Link></div>
        <div className='table-wrapper'><table className='data-table'><thead><tr><th>Customer</th><th>Segment</th><th>Total Spending</th><th>Purchases</th><th>Patron Index</th><th>Status</th></tr></thead><tbody>{recentCustomers.map(customer => <tr key={customer.id}><td><Link to={`/customers/${customer.id}`} className='customer-link'><strong>{customer.name}</strong><span>{customer.id}</span></Link></td><td><SegmentBadge segment={customer.segment} /></td><td>₹{Number(customer.totalSpending || 0).toLocaleString()}</td><td>{customer.totalPurchases}</td><td><strong>{customer.patronIndex}</strong></td><td><span className={`status-badge ${customer.status === 'Active' ? 'status-active' : customer.status === 'At Risk' ? 'status-risk' : 'status-inactive'}`}>{customer.status}</span></td></tr>)}</tbody></table></div>
      </section>
    </div>
  )
}

export default Dashboard
