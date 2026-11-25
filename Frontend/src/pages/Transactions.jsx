import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getTransactions } from '../services/api'
import { transactions as demoTransactions } from '../data/mockData'

function Transactions () {
  const { demoMode } = useAuth()
  const [dbTransactions, setDbTransactions] = useState([])
  const [loading, setLoading] = useState(!demoMode)
  const [search, setSearch] = useState('')
  const [payment, setPayment] = useState('All')

  useEffect(() => {
    if (demoMode) return
    getTransactions()
      .then(data => {
        setDbTransactions(data.transactions || [])
      })
      .catch(() => {})
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
      paymentMethod: t.paymentMethod || 'UPI',
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
            onChange={event => setSearch(event.target.value)}
          />

          <select
            value={payment}
            onChange={event => setPayment(event.target.value)}
          >
            <option value='All'>All Payment Methods</option>

            <option value='UPI'>UPI</option>

            <option value='Card'>Card</option>
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
              {loading ? (
                <tr>
                  <td colSpan='8' style={{ textAlign: 'center', padding: '40px' }} className='muted-text'>
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>

                    <td>
                      <Link
                        className='customer-link'
                        to={`/customers/${transaction.customerId}`}
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
                    {demoMode
                      ? 'No transactions match the selected filter.'
                      : <span>No transaction records found in your database. <Link to='/import' className='text-button'>Import CSV Data</Link></span>
                    }
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

export default Transactions
