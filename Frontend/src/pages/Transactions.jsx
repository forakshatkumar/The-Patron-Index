import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { transactions } from '../data/mockData'

function Transactions () {
  const [search, setSearch] = useState('')

  const [payment, setPayment] = useState('All')

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch =
        transaction.customerName.toLowerCase().includes(search.toLowerCase()) ||
        transaction.product.toLowerCase().includes(search.toLowerCase()) ||
        transaction.id.toLowerCase().includes(search.toLowerCase())

      const matchesPayment =
        payment === 'All' || transaction.paymentMethod === payment

      return matchesSearch && matchesPayment
    })
  }, [search, payment])

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
              {filteredTransactions.map(transaction => (
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
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Transactions
