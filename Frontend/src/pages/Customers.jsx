import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SegmentBadge from '../components/SegmentBadge'
import { PowerBIDonut, PowerBIBarChart } from '../components/PowerBICharts'
import { POWER_BI_COLORS } from '../data/chartConstants'
import { useAuth } from '../context/AuthContext'
import { getCustomers, createCustomer as apiCreateCustomer } from '../services/api'
import { normalizeCustomer } from '../services/customerMapper'
import { customers as demoCustomers, segmentData as demoSegments } from '../data/mockData'

const SEGMENT_NAMES = ['VIP', 'Loyal', 'Regular', 'New', 'Occasional', 'At-Risk', 'Inactive']

function calculateMockPatronIndex (recency, frequency, monetary) {
  const clamp = (val, min = 0, max = 100) => Math.max(min, Math.min(max, Number(val) || 0))
  const rScore = clamp(100 - recency)
  const fScore = clamp(frequency * 5)
  const mScore = clamp(monetary / 1000)
  return Math.round(rScore * 0.35 + fScore * 0.30 + mScore * 0.35)
}

function predictSegment (recency, frequency, monetary, score) {
  if (recency >= 120) return 'Inactive'
  if (recency >= 60) return 'At-Risk'
  if (frequency <= 2 && recency <= 30) return 'New'
  if (score >= 85 || (monetary >= 75000 && frequency >= 15)) return 'VIP'
  if (score >= 70 || frequency >= 12) return 'Loyal'
  if (frequency >= 6) return 'Regular'
  return 'Occasional'
}

function Customers () {
  const { demoMode } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [allCustomers, setAllCustomers] = useState(demoMode ? demoCustomers : [])
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [segment, setSegment] = useState(searchParams.get('segment') || 'All')
  const [status, setStatus] = useState('All')
  const [sort, setSort] = useState('score-high')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(!demoMode)
  const [error, setError] = useState('')
  const [chartMetric, setChartMetric] = useState('spending')

  // Add Customer Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    customerId: '',
    name: '',
    email: '',
    totalSpent: '0',
    totalOrders: '0'
  })
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState('')
  const [successToast, setSuccessToast] = useState('')

  const itemsPerPage = 8

  useEffect(() => {
    if (demoMode) return
    getCustomers()
      .then(data => setAllCustomers((data.customers || []).map(normalizeCustomer)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [demoMode])

  // Sync segment param
  const updateSegment = (newSegment) => {
    setSegment(newSegment)
    setCurrentPage(1)
    const next = new URLSearchParams(searchParams)
    if (newSegment === 'All') {
      next.delete('segment')
    } else {
      next.set('segment', newSegment)
    }
    setSearchParams(next)
  }

  // Dynamic Segment Aggregation
  const dynamicSegments = useMemo(() => {
    const total = allCustomers.length || 1
    const totalRevenue = allCustomers.reduce((sum, c) => sum + (c.totalSpending || 0), 0) || 1

    return SEGMENT_NAMES.map((name, index) => {
      const group = allCustomers.filter(c => c.segment === name)
      const groupRev = group.reduce((sum, c) => sum + (c.totalSpending || 0), 0)
      const count = group.length
      const avgSpend = count ? Math.round(groupRev / count) : 0
      const avgOrders = count ? Math.round(group.reduce((sum, c) => sum + (c.purchaseFrequency || 0), 0) / count) : 0

      // Fallback to demo percentages if customer base is 0 and demo mode is active
      if (!allCustomers.length && demoMode && demoSegments[index]) {
        return demoSegments[index]
      }

      return {
        id: index + 1,
        name,
        customers: count,
        percentage: Math.round((count / total) * 100),
        revenueContribution: Math.round((groupRev / totalRevenue) * 100),
        totalRevenue: groupRev,
        averageSpending: avgSpend,
        purchaseFrequency: avgOrders
      }
    })
  }, [allCustomers, demoMode])

  // Filtered customers for registry table
  const filteredCustomers = useMemo(() => {
    let result = [...allCustomers]
    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query)
      )
    }
    if (segment !== 'All') result = result.filter(c => c.segment === segment)
    if (status !== 'All') result = result.filter(c => c.status === status)

    if (sort === 'score-high') result.sort((a, b) => b.patronIndex - a.patronIndex)
    if (sort === 'spending-high') result.sort((a, b) => b.totalSpending - a.totalSpending)
    if (sort === 'purchases-high') result.sort((a, b) => b.totalPurchases - a.totalPurchases)
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name))

    return result
  }, [allCustomers, search, segment, status, sort])

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / itemsPerPage))
  const visibleCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Real-time calculation preview for Add Customer dialog
  const previewScore = useMemo(() => {
    const monetary = Number(addForm.totalSpent) || 0
    const frequency = Number(addForm.totalOrders) || 0
    return calculateMockPatronIndex(10, frequency, monetary)
  }, [addForm.totalSpent, addForm.totalOrders])

  const previewCohort = useMemo(() => {
    const monetary = Number(addForm.totalSpent) || 0
    const frequency = Number(addForm.totalOrders) || 0
    return predictSegment(10, frequency, monetary, previewScore)
  }, [addForm.totalSpent, addForm.totalOrders, previewScore])

  // Handle Add Customer submit
  const handleAddSubmit = async (e) => {
    e.preventDefault()
    setAddError('')

    if (!addForm.customerId.trim() || !addForm.name.trim() || !addForm.email.trim()) {
      setAddError('Customer ID, Name, and Email are required.')
      return
    }

    setAddLoading(true)

    try {
      const payload = {
        customerId: addForm.customerId.trim(),
        name: addForm.name.trim(),
        email: addForm.email.trim(),
        totalSpent: Math.max(0, Number(addForm.totalSpent) || 0),
        totalOrders: Math.max(1, Number(addForm.totalOrders) || 1)
      }

      let created
      if (!demoMode) {
        const response = await apiCreateCustomer(payload)
        created = normalizeCustomer(response.customer)
      } else {
        // Demo mode local addition
        created = {
          id: payload.customerId,
          name: payload.name,
          email: payload.email,
          totalSpending: payload.totalSpent,
          totalPurchases: payload.totalOrders,
          averageOrderValue: Math.round(payload.totalSpent / payload.totalOrders),
          purchaseFrequency: payload.totalOrders,
          recency: 5,
          lastPurchaseText: '5 days ago',
          patronIndex: previewScore,
          segment: previewCohort,
          status: 'Active',
          customerSince: 'Just now',
          recommendation: 'Newly added customer. Engage with introductory loyalty benefits.'
        }
      }

      setAllCustomers(prev => [created, ...prev])
      setSuccessToast(`Customer ${created.name} (${created.id}) added and classified as ${created.segment}!`)
      setIsAddModalOpen(false)

      // Reset form
      setAddForm({
        customerId: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        name: '',
        email: '',
        totalSpent: '15000',
        totalOrders: '3'
      })

      setTimeout(() => setSuccessToast(''), 4500)
    } catch (err) {
      setAddError(err.message || 'Failed to create customer.')
    } finally {
      setAddLoading(false)
    }
  }

  // Export filtered customers as CSV (replaces standalone Reports page smoothly)
  const handleExportCsv = () => {
    const headers = ['Customer ID', 'Name', 'Email', 'Segment', 'Total Spending (INR)', 'Purchases', 'Patron Index', 'Status']
    const rows = filteredCustomers.map(c => [
      c.id,
      c.name,
      c.email,
      c.segment,
      c.totalSpending,
      c.totalPurchases,
      c.patronIndex,
      c.status
    ])

    const escapeCell = value => {
      const raw = String(value ?? '')
      const safe = typeof value === 'string' && /^[\s]*[=+@-]/.test(raw) ? "'" + raw : raw
      return `"${safe.replace(/"/g, '""')}"`
    }
    const csvContent = [headers.join(','), ...rows.map(row => row.map(escapeCell).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `patron-index-customers-${segment.toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className='page customers-page'>
      {/* Page Header with Action Controls */}
      <div className='page-heading'>
        <div>
          <h2>Customers & Segments</h2>
          <p>Unified customer intelligence, behavioral cohort analytics, and RFM scoring.</p>
        </div>
        <div className='page-actions'>
          <button
            type='button'
            className='powerbi-primary-btn'
            onClick={() => {
              setAddForm(prev => ({ ...prev, customerId: `CUST-${Math.floor(1000 + Math.random() * 9000)}` }))
              setAddError('')
              setIsAddModalOpen(true)
            }}
          >
            <span>＋</span> Add Customer
          </button>
          <Link to='/import' className='secondary-button'>
            Import CSV
          </Link>
          <button
            type='button'
            className='secondary-button'
            onClick={handleExportCsv}
            title='Export currently filtered table as CSV'
          >
            ↓ Export CSV
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successToast && (
        <div className='powerbi-toast-banner'>
          <span>✓</span> {successToast}
        </div>
      )}

      {error && <div className='upload-error'>{error}</div>}

      {/* Power BI Cohort Ribbon: 7 Interactive KPI Cards */}
      <section className='powerbi-ribbon-grid'>
        {dynamicSegments.map(seg => {
          const isSelected = segment === seg.name
          const colors = POWER_BI_COLORS[seg.name] || { base: '#118DFF' }

          return (
            <div
              key={seg.name}
              className={`powerbi-ribbon-card ${isSelected ? 'ribbon-card-active' : ''}`}
              style={{ '--accent-color': colors.base }}
              onClick={() => updateSegment(isSelected ? 'All' : seg.name)}
            >
              <div className='ribbon-card-header'>
                <span className='ribbon-badge-dot' style={{ backgroundColor: colors.base }} />
                <span className='ribbon-name'>{seg.name}</span>
                {isSelected && <span className='ribbon-filter-tag'>Filtered</span>}
              </div>
              <div className='ribbon-card-body'>
                <strong className='ribbon-count'>{seg.customers.toLocaleString()}</strong>
                <span className='ribbon-share'>{seg.percentage}% of base</span>
              </div>
              <div className='ribbon-card-footer'>
                <span>Avg: ₹{(seg.averageSpending || 0).toLocaleString()}</span>
                <span>{seg.revenueContribution}% Rev</span>
              </div>
            </div>
          )
        })}
      </section>

      {/* Power BI Interactive Multi-Color Visualizations */}
      <div className='powerbi-visuals-grid'>
        <section className='card powerbi-card'>
          <PowerBIDonut
            segments={dynamicSegments}
            totalCustomers={allCustomers.length}
            activeSegment={segment}
            onSelectSegment={updateSegment}
          />
        </section>

        <section className='card powerbi-card'>
          <div className='powerbi-metric-toggle'>
            <button
              type='button'
              className={`toggle-chip ${chartMetric === 'spending' ? 'active' : ''}`}
              onClick={() => setChartMetric('spending')}
            >
              Average Spend (₹)
            </button>
            <button
              type='button'
              className={`toggle-chip ${chartMetric === 'revenue' ? 'active' : ''}`}
              onClick={() => setChartMetric('revenue')}
            >
              Revenue Contribution (%)
            </button>
          </div>
          <PowerBIBarChart
            segments={dynamicSegments}
            metric={chartMetric}
            activeSegment={segment}
            onSelectSegment={updateSegment}
          />
        </section>
      </div>

      {/* Customer Registry Table */}
      <section className='card customer-registry-card'>
        <div className='card-header-bar'>
          <div className='registry-title-group'>
            <h3>Customer Directory</h3>
            <span className='registry-counter'>
              {filteredCustomers.length} {segment !== 'All' ? `${segment} ` : ''}patrons
            </span>
          </div>

          <div className='customer-controls'>
            <input
              className='search-input'
              placeholder='Search by name, email or ID...'
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
            />
            <select
              value={segment}
              onChange={e => updateSegment(e.target.value)}
            >
              <option value='All'>All Segments</option>
              {SEGMENT_NAMES.map(name => (
                <option value={name} key={name}>{name}</option>
              ))}
            </select>
            <select
              value={status}
              onChange={e => {
                setStatus(e.target.value)
                setCurrentPage(1)
              }}
            >
              <option value='All'>All Statuses</option>
              <option value='Active'>Active</option>
              <option value='At Risk'>At Risk</option>
              <option value='Inactive'>Inactive</option>
            </select>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value='score-high'>Highest Patron Index</option>
              <option value='spending-high'>Highest Spending</option>
              <option value='purchases-high'>Most Purchases</option>
              <option value='name'>Name A-Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className='empty-state'>
            <div className='powerbi-spinner' />
            <h3>Loading Customer Portfolio...</h3>
          </div>
        ) : (
          <div className='table-wrapper'>
            <table className='data-table'>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Segment</th>
                  <th>Total Spending</th>
                  <th>Purchase Frequency</th>
                  <th>Last Purchase</th>
                  <th>Patron Index</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleCustomers.map(customer => {
                  const colors = POWER_BI_COLORS[customer.segment] || { base: '#118DFF' }
                  return (
                    <tr key={customer.id} className='customer-table-row'>
                      <td>
                        <Link className='customer-link' to={`/customers/${encodeURIComponent(customer.id)}`}>
                          <strong>{customer.name}</strong>
                          <span className='customer-sub-id'>{customer.id} • {customer.email}</span>
                        </Link>
                      </td>
                      <td>
                        <SegmentBadge segment={customer.segment} />
                      </td>
                      <td>
                        <div className='spend-cell'>
                          <strong>₹{Number(customer.totalSpending || 0).toLocaleString()}</strong>
                          <div
                            className='spend-bar'
                            style={{
                              width: `${Math.min(100, Math.max(12, ((customer.totalSpending || 0) / 100000) * 100))}%`,
                              backgroundColor: colors.base
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <span className='frequency-badge'>{customer.purchaseFrequency || customer.totalPurchases || 0} orders</span>
                      </td>
                      <td>
                        <span className='recency-text'>{customer.lastPurchaseText}</span>
                      </td>
                      <td>
                        <div className='patron-index-cell'>
                          <div
                            className='index-score-pill'
                            style={{
                              borderColor: colors.base,
                              color: colors.base
                            }}
                          >
                            {customer.patronIndex}
                          </div>
                          <span className='score-meter-label'>/ 100</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${
                          customer.status === 'Active' ? 'status-active' :
                          customer.status === 'At Risk' ? 'status-risk' : 'status-inactive'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {!visibleCustomers.length && (
              <div className='empty-state'>
                <h3>No customers match the active filters</h3>
                <p>Try clearing your segment or search filters, or click "Add Customer" to insert one.</p>
                {segment !== 'All' && (
                  <button
                    type='button'
                    className='secondary-button'
                    onClick={() => updateSegment('All')}
                    style={{ marginTop: '12px' }}
                  >
                    Reset Segment Filter
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Pagination Bar */}
        <div className='pagination'>
          <span>Showing {visibleCustomers.length} of {filteredCustomers.length} customers</span>
          <div>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* Add Customer Modal Dialog */}
      {isAddModalOpen && (
        <div className='modal-backdrop' onClick={() => !addLoading && setIsAddModalOpen(false)}>
          <div className='modal-container powerbi-modal' onClick={e => e.stopPropagation()}>
            <div className='modal-header'>
              <div>
                <h3 className='modal-title'>Add New Customer</h3>
                <span className='modal-subtitle'>Insert customer record with real-time RFM classification</span>
              </div>
              <button
                type='button'
                className='modal-close-btn'
                onClick={() => !addLoading && setIsAddModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className='modal-body'>
                {addError && <div className='upload-error'>{addError}</div>}

                <div className='form-row-2col'>
                  <div className='form-group'>
                    <label htmlFor='add-cust-id'>Customer ID</label>
                    <input
                      id='add-cust-id'
                      type='text'
                      required
                      value={addForm.customerId}
                      onChange={e => setAddForm(prev => ({ ...prev, customerId: e.target.value }))}
                      placeholder='e.g. CUST-1042'
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor='add-cust-name'>Full Name</label>
                    <input
                      id='add-cust-name'
                      type='text'
                      required
                      value={addForm.name}
                      onChange={e => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder='e.g. Priya Sharma'
                    />
                  </div>
                </div>

                <div className='form-group'>
                  <label htmlFor='add-cust-email'>Email Address</label>
                  <input
                    id='add-cust-email'
                    type='email'
                    required
                    value={addForm.email}
                    onChange={e => setAddForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder='priya@example.com'
                  />
                </div>

                <div className='form-row-2col'>
                  <div className='form-group'>
                    <label htmlFor='add-cust-spend'>Total Spending (₹)</label>
                    <input
                      id='add-cust-spend'
                      type='number'
                      min='0'
                      step='100'
                      required
                      value={addForm.totalSpent}
                      onChange={e => setAddForm(prev => ({ ...prev, totalSpent: e.target.value }))}
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor='add-cust-orders'>Total Orders</label>
                    <input
                      id='add-cust-orders'
                      type='number'
                      min='1'
                      max='1000'
                      required
                      value={addForm.totalOrders}
                      onChange={e => setAddForm(prev => ({ ...prev, totalOrders: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Real-time RFM Score & Cohort Preview Card */}
                <div className='powerbi-preview-card'>
                  <div className='preview-label'>
                    <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'>
                      <path d='M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83' />
                    </svg>
                    <span>Automated Classification Preview</span>
                  </div>
                  <div className='preview-metrics'>
                    <div className='preview-metric-box'>
                      <span className='preview-metric-label'>Patron Index</span>
                      <strong className='preview-metric-value' style={{ color: POWER_BI_COLORS[previewCohort]?.base }}>
                        {previewScore} <small>/ 100</small>
                      </strong>
                    </div>
                    <div className='preview-metric-divider' />
                    <div className='preview-metric-box'>
                      <span className='preview-metric-label'>Cohort</span>
                      <SegmentBadge segment={previewCohort} />
                    </div>
                    <div className='preview-metric-divider' />
                    <div className='preview-metric-box'>
                      <span className='preview-metric-label'>Status</span>
                      <span className='status-badge status-active'>
                        <span className='status-dot-active' />
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='modal-actions'>
                <button
                  type='button'
                  className='secondary-button'
                  disabled={addLoading}
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='powerbi-primary-btn'
                  disabled={addLoading}
                >
                  {addLoading ? 'Saving Customer...' : 'Save & Classify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Customers
