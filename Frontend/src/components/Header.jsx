import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Header ({ onToggleSidebar, sidebarOpen = true }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, demoMode } = useAuth()

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileMenuRef = useRef(null)

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

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsProfileOpen(false)
    }

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isProfileOpen])

  const handleNotification = () => {
    alert('You have no new notifications.')
  }

  const handleGoToSettings = () => {
    setIsProfileOpen(false)
    navigate('/settings')
  }

  const handleSignOut = () => {
    setIsProfileOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  // Derive display name, email, and organization dynamically from authenticated user
  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : (demoMode ? 'Demo Account' : 'Authenticated User'))
  const displayEmail = user?.email || (demoMode ? 'demo@patronindex.local' : '')
  const displayOrganization = user?.organization || (demoMode ? 'Patron Index Demo' : 'Enterprise Workspace')

  // Get initials for circular avatar
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'PI'

  return (
    <header className='top-header'>
      {/* Top-Left Corner: Hamburger Toggle & Workspace Title */}
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

      {/* Top-Right Corner: Notifications & Circular Profile with Dropdown Menu */}
      <div className='header-right'>
        {/* Notification Bell */}
        <button
          type='button'
          className='notification-button'
          onClick={handleNotification}
          aria-label='Notifications'
          title='Notifications'
        >
          <svg
            width='18'
            height='18'
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

        {/* Circular Profile Icon & Dropdown Container */}
        <div className='header-profile-menu-wrapper' ref={profileMenuRef}>
          <button
            type='button'
            className={`header-circular-profile-btn ${isProfileOpen ? 'profile-btn-active' : ''}`}
            onClick={() => setIsProfileOpen(prev => !prev)}
            aria-label='User Profile Menu'
            aria-expanded={isProfileOpen}
            title='Account Profile'
          >
            <span className='circular-avatar-text'>{initials}</span>
          </button>

          {/* Interactive Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className='header-profile-dropdown'>
              {/* Account Information Header */}
              <div className='dropdown-account-header'>
                <div className='dropdown-large-avatar'>
                  {initials}
                </div>
                <div className='dropdown-user-info'>
                  <strong className='dropdown-user-name'>{displayName}</strong>
                  {displayEmail && <span className='dropdown-user-email'>{displayEmail}</span>}
                  <div className='dropdown-badge-row'>
                    <span className={`dropdown-role-pill ${demoMode ? 'role-demo' : 'role-admin'}`}>
                      {demoMode ? 'Demo Session' : `${user?.role ? user.role.toUpperCase() : 'USER'} • BUSINESS`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Workspace Summary */}
              <div className='dropdown-tier-card'>
                <div className='tier-label-group'>
                  <span className='tier-name'>{displayOrganization}</span>
                  <span className='tier-tag'>ENTERPRISE</span>
                </div>
                <span className='tier-sub'>Active Workspace</span>
              </div>

              <div className='dropdown-divider' />

              {/* Two Action Buttons: Settings & Sign Out */}
              <div className='dropdown-actions-menu'>
                <button
                  type='button'
                  className='dropdown-menu-item'
                  onClick={handleGoToSettings}
                >
                  <span className='dropdown-item-icon'>⚙</span>
                  <div className='dropdown-item-text'>
                    <strong>Settings</strong>
                    <span>Manage organization and security</span>
                  </div>
                </button>

                <button
                  type='button'
                  className='dropdown-menu-item dropdown-item-signout'
                  onClick={handleSignOut}
                >
                  <span className='dropdown-item-icon'>↪</span>
                  <div className='dropdown-item-text'>
                    <strong>{demoMode ? 'Exit Demo' : 'Sign Out'}</strong>
                    <span>End current authenticated session</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
