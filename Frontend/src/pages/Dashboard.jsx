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
  const [period, setPeriod] = useState('6')

  useEffect(() => {
    if (demoMode) return
    Promise.all([getDashboardSummary(), getCustomers()])
      .then(([summaryData, customerData]) => {
        setSummary(summaryData)
        setCustomers((customerData.customers || []).map(normalizeCustomer))
      })
      .catch(err => setError(err.message))
  }, [demoMode])

  const stats = demoMode ? demoStats : (summary || { totalCustomers: 0, activeCustomers: 0, highValueCustomers: 0, totalRevenue: 0 })
  const recentCustomers = (demoMode ? demoCustomers : customers).slice(0, 5)

  const segments = useMemo(() => {
    if (demoMode) return demoSegments
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
  }, [customers, demoMode])

  const liveRevenueData = useMemo(() => {
    if (demoMode) return revenueData
    if (summary?.monthlyRevenue?.length) return summary.monthlyRevenue
    return []
  }, [demoMode, summary])

  const insights = useMemo(() => {
    if (demoMode) return dashboardInsights
    if (!summary || summary.totalCustomers === 0) {
      return [
        { id: 1, type: 'info', title: 'Customer database is ready. Import a CSV file to generate customer insights.' },
        { id: 2, type: 'info', title: 'RFM segmentation will run automatically once data is loaded.' }
      ]
    }
    const list = []
    if (summary.highValueCustomers > 0) {
      list.push({ id: 1, type: 'positive', title: `${summary.highValueCustomers} high-value customers identified in VIP and Loyal tiers.` })
    }
    if (summary.totalRevenue > 0) {
      list.push({ id: 2, type: 'positive', title: `Total revenue tracked is ₹${Number(summary.totalRevenue).toLocaleString()}.` })
    }
    if (summary.returningCustomers > 0) {
      list.push({ id: 3, type: 'info', title: `${summary.returningCustomers} returning patrons with multiple recorded purchases.` })
    }
    return list.length ? list : [{ id: 1, type: 'info', title: 'Customer records are synchronized with database.' }]
  }, [demoMode, summary])

  const activityList = useMemo(() => {
    if (demoMode) return purchaseActivity
    if (summary?.monthlyActivity?.length) return summary.monthlyActivity
    return []
  }, [demoMode, summary])

  if (!demoMode && !summary) return <div className='page'><div className='card workspace-loading' role={error ? 'alert' : 'status'}>{error || 'Loading your workspace…'}{error && <button className='secondary-button' onClick={() => window.location.reload()}>Try again</button>}</div></div>
  return (
    <div className='page'>
      <div className='page-heading'>
        <div>
          <h2>Business overview</h2>
          <p>Track customer activity, revenue and customer value.</p>
        </div>
        <div className='page-actions'>
          <Link to='/import' className='secondary-button'>Import Data</Link>
          <Link to='/customers' className='primary-button'>View Customers</Link>
        </div>
      </div>

      {error && <div className='info-banner'>{error}</div>}
      {demoMode && <div className='demo-banner'>Demo mode is active. Sign in to use live MongoDB data and secure uploads.</div>}

      <div className='stats-grid'>
        <StatCard title='Total Customers' value={Number(stats.totalCustomers || 0).toLocaleString()} change='Live' description={demoMode ? 'demo data' : 'live database'} icon='◉' />
        <StatCard title='Active Customers' value={Number(stats.activeCustomers || 0).toLocaleString()} change='Current' description='active customers' icon='●' />
        <StatCard title='High-Value Customers' value={Number(stats.highValueCustomers || 0).toLocaleString()} change='VIP + Loyal' description='priority segment' icon='★' />
        <StatCard title='Total Revenue' value={`₹${(Number(stats.totalRevenue || 0) / 100000).toFixed(2)}L`} change='Tracked' description='customer value' icon='₹' />
      </div>

      <div className='dashboard-grid'>
        <section className='card dashboard-large-card'>
          <div className='card-header'>
            <div>
              <h3>Revenue Trend</h3>
              <p>Revenue from recorded transactions</p>
            </div>
          </div>
          {liveRevenueData.length > 0 ? (
            <><label className='premium-chart-filter'>Months <select aria-label='Revenue period' value={period} onChange={e=>setPeriod(e.target.value)}><option value='6'>Last 6 recorded</option><option value='12'>Last 12 recorded</option><option value='all'>All recorded</option></select></label><RevenueChart data={period==='all' ? liveRevenueData : liveRevenueData.slice(-Number(period))} /></>
          ) : (
            <div className='empty-state' style={{ padding: '40px 20px', textAlign: 'center' }}>
              <p className='muted-text'>No revenue records found yet. Import customer transactions to view trends.</p>
            </div>
          )}
        </section>
        <section className='card'>
          <div className='card-header'>
            <div>
              <h3>Customer Segments</h3>
              <p>Distribution of your customer base</p>
            </div>
            <Link to='/customers' className='text-button'>View all</Link>
          </div>
          <div className='segment-list'>
            {segments.length > 0 ? (
              segments.map(segment => (
                <div className='segment-summary-row' key={segment.id || segment.name}>
                  <SegmentBadge segment={segment.name} />
                  <div className='segment-summary-right'>
                    <strong>{Number(segment.customers || 0).toLocaleString()}</strong>
                    <span>{segment.percentage}%</span>
                  </div>
                </div>
              ))
            ) : (
              <div className='empty-state' style={{ padding: '30px 10px', textAlign: 'center' }}>
                <p className='muted-text'>No segment data available yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className='dashboard-grid'>
        <section className='card dashboard-large-card'>
          <div className='card-header'>
            <div>
              <h3>Purchase Activity</h3>
              <p>New and repeat customer purchases</p>
            </div>
          </div>
          {activityList.length > 0 ? (
            <>
              <div className='activity-chart'>
                {activityList.map((item, index) => (
                  <div className='activity-column' key={item.month}>
                    <div className='activity-bars'>
                      <div
                        className='activity-bar new-bar'
                        style={{
                          height: `${(item.newCustomers / Math.max(1,...activityList.flatMap(x=>[x.newCustomers,x.repeatCustomers]))) * 120}px`,
                          '--delay': `${index * 0.08}s`
                        }}
                        title={`New Customers: ${item.newCustomers}`}
                      />
                      <div
                        className='activity-bar repeat-bar'
                        style={{
                          height: `${(item.repeatCustomers / Math.max(1,...activityList.flatMap(x=>[x.newCustomers,x.repeatCustomers]))) * 120}px`,
                          '--delay': `${index * 0.08 + 0.04}s`
                        }}
                        title={`Repeat Customers: ${item.repeatCustomers}`}
                      />
                    </div>
                    <span>{item.month}</span>
                  </div>
                ))}
              </div>
              <div className='chart-legend'>
                <span><i className='legend-dot new-dot' />New Customers</span>
                <span><i className='legend-dot repeat-dot' />Repeat Customers</span>
              </div>
            </>
          ) : (
            <div className='empty-state' style={{ padding: '40px 20px', textAlign: 'center' }}>
              <p className='muted-text'>No purchase transactions recorded yet. Upload a customer CSV file to track purchase trends.</p>
            </div>
          )}
        </section>

        <section className='card'>
          <div className='card-header'>
            <div>
              <h3>Key Insights</h3>
              <p>Important changes in your business</p>
            </div>
          </div>
          <div className='insight-list'>
            {insights.map(insight => (
              <div className={`insight-item ${insight.type}`} key={insight.id}>
                <span className='insight-icon'>{insight.type === 'warning' ? '!' : '✓'}</span>
                <p>{insight.title}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className='card'>
        <div className='card-header'>
          <div>
            <h3>Recent Customers</h3>
            <p>Recently active customers</p>
          </div>
          <Link to='/customers' className='text-button'>View all customers</Link>
        </div>
        <div className='table-wrapper'>
          <table className='data-table'>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Segment</th>
                <th>Total Spending</th>
                <th>Purchases</th>
                <th>Patron Index</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentCustomers.length > 0 ? (
                recentCustomers.map(customer => (
                  <tr key={customer.id}>
                    <td>
                      <Link to={`/customers/${encodeURIComponent(customer.id)}`} className='customer-link'>
                        <strong>{customer.name}</strong>
                        <span>{customer.id}</span>
                      </Link>
                    </td>
                    <td><SegmentBadge segment={customer.segment} /></td>
                    <td>₹{Number(customer.totalSpending || 0).toLocaleString()}</td>
                    <td>{customer.totalPurchases}</td>
                    <td><strong>{customer.patronIndex}</strong></td>
                    <td>
                      <span className={`status-badge ${customer.status === 'Active' ? 'status-active' : customer.status === 'At Risk' ? 'status-risk' : 'status-inactive'}`}>
                        {customer.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='6' style={{ textAlign: 'center', padding: '30px' }} className='muted-text'>
                    No customers recorded in your database yet. <Link to='/import' className='text-button'>Import CSV Data</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
