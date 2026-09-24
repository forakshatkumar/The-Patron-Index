import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SegmentBadge from '../components/SegmentBadge'
import { useAuth } from '../context/AuthContext'
import { getCustomers } from '../services/api'
import { normalizeCustomer } from '../services/customerMapper'
import { customers as demoCustomers, segmentData } from '../data/mockData'

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
  const itemsPerPage = 6

  useEffect(() => {
    if (demoMode) return
    getCustomers()
      .then(data => setAllCustomers((data.customers || []).map(normalizeCustomer)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [demoMode])

  const filteredCustomers = useMemo(() => {
    let result = [...allCustomers]
    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter(c => c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query) || c.id.toLowerCase().includes(query))
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

  const updateParam = (key, value, allValue) => {
    const next = new URLSearchParams(searchParams)
    if (!value || value === allValue) next.delete(key)
    else next.set(key, value)
    setSearchParams(next)
  }

  return (
    <div className='page'>
      <div className='page-heading'><div><h2>Customers</h2><p>View and manage your customer base.</p></div><Link to='/import' className='primary-button'>+ Import Customers</Link></div>
      {error && <div className='upload-error'>{error}</div>}
      <section className='card'>
        <div className='customer-controls'>
          <input className='search-input' placeholder='Search by name, email or ID...' value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); updateParam('q', e.target.value, '') }} />
          <select value={segment} onChange={e => { setSegment(e.target.value); setCurrentPage(1); updateParam('segment', e.target.value, 'All') }}><option value='All'>All Segments</option>{segmentData.map(item => <option value={item.name} key={item.id}>{item.name}</option>)}</select>
          <select value={status} onChange={e => { setStatus(e.target.value); setCurrentPage(1) }}><option value='All'>All Statuses</option><option value='Active'>Active</option><option value='At Risk'>At Risk</option><option value='Inactive'>Inactive</option></select>
          <select value={sort} onChange={e => setSort(e.target.value)}><option value='score-high'>Highest Patron Index</option><option value='spending-high'>Highest Spending</option><option value='purchases-high'>Most Purchases</option><option value='name'>Name A-Z</option></select>
        </div>
        {loading ? <div className='empty-state'><h3>Loading customers...</h3></div> : <div className='table-wrapper'><table className='data-table'><thead><tr><th>Customer</th><th>Segment</th><th>Total Spending</th><th>Purchase Frequency</th><th>Last Purchase</th><th>Patron Index</th><th>Status</th></tr></thead><tbody>{visibleCustomers.map(customer => <tr key={customer.id}><td><Link className='customer-link' to={`/customers/${customer.id}`}><strong>{customer.name}</strong><span>{customer.id}</span></Link></td><td><SegmentBadge segment={customer.segment} /></td><td>₹{Number(customer.totalSpending).toLocaleString()}</td><td>{customer.purchaseFrequency}</td><td>{customer.lastPurchaseText}</td><td><strong>{customer.patronIndex}</strong></td><td><span className={`status-badge ${customer.status === 'Active' ? 'status-active' : customer.status === 'At Risk' ? 'status-risk' : 'status-inactive'}`}>{customer.status}</span></td></tr>)}</tbody></table>{!visibleCustomers.length && <div className='empty-state'><h3>No customers found</h3><p>{demoMode ? 'Try changing your filters.' : 'Import a customer CSV to populate the database.'}</p></div>}</div>}
        <div className='pagination'><span>Showing {visibleCustomers.length} of {filteredCustomers.length} customers</span><div><button disabled={currentPage === 1} onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>Previous</button><span>Page {currentPage} of {totalPages}</span><button disabled={currentPage === totalPages} onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}>Next</button></div></div>
      </section>
    </div>
  )
}

export default Customers
