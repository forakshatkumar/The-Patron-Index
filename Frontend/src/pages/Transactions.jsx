import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getTransactions } from '../services/api'
import { transactions as demoTransactions } from '../data/mockData'

function Transactions () {
  const { demoMode } = useAuth()
  const [dbTransactions, setDbTransactions] = useState([])
  const [loading, setLoading] = useState(!demoMode)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 25
  const [search, setSearch] = useState('')
  const [payment, setPayment] = useState('All')

  useEffect(() => {
    if (demoMode) return
    getTransactions()
      .then(data => {
        setDbTransactions(data.transactions || [])
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [demoMode])

  const rawTransactions = useMemo(() => {
    if (demoMode) return demoTransactions
    return dbTransactions.map(t => ({
      id: t.transactionId || t._id,
      customerId: t.customerId,
      customerName: t.customerName || t.customerId,
      amount: Number(t.amount || 0),
      date: t.date,
      product: t.product || 'Standard Purchase',
      category: t.category || 'General',
      paymentMethod: t.paymentMethod || 'Not specified',
      status: t.status || 'Completed'
    }))
  }, [demoMode, dbTransactions])

  const filteredTransactions = useMemo(() => {
    return rawTransactions.filter(transaction => {
      const matchesSearch =
        transaction.customerName.toLowerCase().includes(search.toLowerCase()) ||
        transaction.product.toLowerCase().includes(search.toLowerCase()) ||
        transaction.id.toLowerCase().includes(search.toLowerCase())

      const matchesPayment =
        payment === 'All' || transaction.paymentMethod === payment

      return matchesSearch && matchesPayment
    })
  }, [rawTransactions, search, payment])

  const methods = [...new Set(rawTransactions.map(t => t.paymentMethod))].sort()
  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleTransactions = filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  return (
    <div className='page'>
      <div className='page-heading'>
        <div>
          <h2>Transactions</h2>
          <p>Monitor customer purchase activity.</p>
        </div>
      </div>

      <section className='card'>
        <div className='customer-controls'>
          <input
            type='text'
            className='search-input'
            placeholder='Search transaction...'
            value={search}
            aria-label='Search transactions'
            onChange={event => { setSearch(event.target.value); setPage(1) }}
          />

          <select
            value={payment}
            aria-label='Payment method'
            onChange={event => { setPayment(event.target.value); setPage(1) }}
          >
            <option value='All'>All Payment Methods</option>

            {methods.map(method => <option key={method} value={method}>{method}</option>)}
          </select>
        </div>

        <div className='table-wrapper'>
          <table className='data-table'>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {error ? <tr><td colSpan='8' role='alert'>{error} <button className='secondary-button' onClick={() => window.location.reload()}>Try again</button></td></tr> : loading ? (
                <tr>
                  <td colSpan='8' style={{ textAlign: 'center', padding: '40px' }} className='muted-text'>
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length > 0 ? (
                visibleTransactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>

                    <td>
                      <Link
                        className='customer-link'
                        to={`/customers/${encodeURIComponent(transaction.customerId)}`}
                      >
                        <strong>{transaction.customerName}</strong>
                      </Link>
                    </td>

                    <td>{transaction.product}</td>

                    <td>{transaction.category}</td>

                    <td>₹{transaction.amount.toLocaleString()}</td>

                    <td>{transaction.date}</td>

                    <td>{transaction.paymentMethod}</td>

                    <td>
                      <span className='status-badge status-active'>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='8' style={{ textAlign: 'center', padding: '40px' }} className='muted-text'>
                    {demoMode || rawTransactions.length
                      ? 'No transactions match the selected filter.'
                      : <span>No transaction records found in your database. <Link to='/import' className='text-button'>Import CSV Data</Link></span>
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {!loading && !error && filteredTransactions.length > 0 && <div className='transaction-pagination'><span>{(currentPage-1)*pageSize+1}–{Math.min(currentPage*pageSize,filteredTransactions.length)} of {filteredTransactions.length} transactions</span><div><button className='secondary-button' disabled={currentPage===1} onClick={()=>setPage(currentPage-1)}>Previous</button><button className='secondary-button' disabled={currentPage===pageCount} onClick={()=>setPage(currentPage+1)}>Next</button></div></div>}
      </section>
    </div>
  )
}

export default Transactions
