import { useLocation, useNavigate } from 'react-router-dom'

function Header ({ onToggleSidebar, sidebarOpen = true }) {
  const navigate = useNavigate()
  const location = useLocation()

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

  const handleNotification = () => {
    alert('You have no new notifications.')
  }

  return (
    <header className='top-header'>
      <div className='header-left'>
        {/* Hamburger Toggle */}
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

        {/* Top-Left Corner: Profile Icon and Notification Icon */}
        <div className='header-corner-actions'>
          <button
            type='button'
            className='header-profile-icon'
            onClick={() => navigate('/settings')}
            title='Account Profile'
            aria-label='Account Profile'
          >
            <div className='profile-avatar'>AK</div>
          </button>

          <button
            type='button'
            className='notification-button'
            onClick={handleNotification}
            aria-label='Notifications'
            title='Notifications'
          >
            <svg
              width='17'
              height='17'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' />
              <path d='M13.73 21a2 2 0 0 1-3.46 0' />
            </svg>
            <span className='notification-dot' />
          </button>
        </div>

        {/* Page Title & Subtitle */}
        <div className='header-title'>
          <h1>{getPageTitle()}</h1>
          <p>Understand your customers and grow your business.</p>
        </div>
      </div>

      <div className='header-right'>
        {/* Searchbar removed from global header — provided exclusively in customer section */}
      </div>
    </header>
  )
}

export default Header
