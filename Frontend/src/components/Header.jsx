import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Header () {
  const navigate = useNavigate()
  const location = useLocation()

  const [search, setSearch] = useState('')

  const pageNames = {
    '/dashboard': 'Dashboard',
    '/customers': 'Customers',
    '/segments': 'Customer Segments',
    '/transactions': 'Transactions',
    '/analytics': 'Analytics',
    '/reports': 'Reports',
    '/settings': 'Settings',
    '/import': 'Import Customer Data'
  }

  const getPageTitle = () => {
    if (location.pathname.startsWith('/customers/')) {
      return 'Customer Profile'
    }

    return pageNames[location.pathname] || 'The Patron Index'
  }

  const handleSearch = event => {
    event.preventDefault()

    const value = search.trim()

    if (!value) {
      return
    }

    navigate(`/customers?q=${encodeURIComponent(value)}`)

    setSearch('')
  }

  const handleNotification = () => {
    alert('You have no new notifications.')
  }

  return (
    <header className='top-header'>
      <div className='header-title'>
        <h1>{getPageTitle()}</h1>
        <p>Understand your customers and grow your business.</p>
      </div>

      <div className='header-right'>
        <form className='header-search' onSubmit={handleSearch}>
          <span className='search-icon'>⌕</span>

          <input
            type='text'
            placeholder='Search customers...'
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
        </form>

        <select className='date-filter' defaultValue='30'>
          <option value='7'>Last 7 days</option>

          <option value='30'>Last 30 days</option>

          <option value='90'>Last 3 months</option>

          <option value='365'>Last 12 months</option>
        </select>

        <button
          className='notification-button'
          onClick={handleNotification}
          aria-label='Notifications'
        >
          ♢<span className='notification-dot'></span>
        </button>

        <button
          className='header-profile'
          onClick={() => navigate('/settings')}
        >
          <div className='profile-avatar'>AK</div>

          <div className='profile-details'>
            <strong>Brew & Bites</strong>
            <span>Admin</span>
          </div>

          <span className='profile-arrow'>▾</span>
        </button>
      </div>
    </header>
  )
}

export default Header
