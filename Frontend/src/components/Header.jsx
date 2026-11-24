import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Header ({ onToggleSidebar, sidebarOpen = true }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [search, setSearch] = useState('')

  const pageNames = {
    '/dashboard': 'Dashboard',
    '/customers': 'Customers & Segments',
    '/transactions': 'Transactions',
    '/analytics': 'Analytics',
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
      <div className='header-left'>
        <button
          type='button'
          className='sidebar-toggle-btn'
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <svg
            className='hamburger-icon'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2.2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <line x1='3' y1='12' x2='21' y2='12' />
            <line x1='3' y1='6' x2='21' y2='6' />
            <line x1='3' y1='18' x2='21' y2='18' />
          </svg>
        </button>

        <div className='header-title'>
          <h1>{getPageTitle()}</h1>
          <p>Understand your customers and grow your business.</p>
        </div>
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
