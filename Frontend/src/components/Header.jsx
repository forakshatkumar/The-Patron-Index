import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate, Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoImg from '../assets/logo.png'

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
      {/* Top-Left Corner: Patron Index Icon & Workspace Title */}
      <div className='header-left'>
        <Link to='/dashboard' className='header-brand-link' aria-label='Patron Index Home' title='The Patron Index'>
          <img src={logoImg} alt='The Patron Index' className='header-brand-logo' />
        </Link>

        <div className='header-title'>
          <h1>{getPageTitle()}</h1>
          <p>Understand your customers and grow your business.</p>
        </div>
      </div>

      {/* Top-Right Docker Capsule: Buttons & Icons Stored in Dock Style */}
      <div className='header-right'>
        <nav className='navbar-docker' aria-label='Quick navigation dock'>
          {/* Quick Page Icons Group */}
          <div className='docker-nav-group'>
            <NavLink
              to='/dashboard'
              className={({ isActive }) => `docker-item ${isActive ? 'docker-item-active' : ''}`}
              aria-label='Dashboard'
            >
              <span className='docker-icon'>
                <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <rect x='3' y='3' width='7' height='7' rx='1.5' />
                  <rect x='14' y='3' width='7' height='7' rx='1.5' />
                  <rect x='14' y='14' width='7' height='7' rx='1.5' />
                  <rect x='3' y='14' width='7' height='7' rx='1.5' />
                </svg>
              </span>
              <span className='docker-tooltip'>Dashboard</span>
              <span className='docker-running-dot' />
            </NavLink>

            <NavLink
              to='/customers'
              className={({ isActive }) => `docker-item ${isActive ? 'docker-item-active' : ''}`}
              aria-label='Customers & Segments'
            >
              <span className='docker-icon'>
                <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <circle cx='12' cy='12' r='9' />
                  <circle cx='12' cy='12' r='3.5' fill='currentColor' />
                </svg>
              </span>
              <span className='docker-tooltip'>Customers</span>
              <span className='docker-running-dot' />
            </NavLink>

            <NavLink
              to='/transactions'
              className={({ isActive }) => `docker-item ${isActive ? 'docker-item-active' : ''}`}
              aria-label='Transactions'
            >
              <span className='docker-icon'>
                <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <polyline points='17 8 21 12 17 16' />
                  <line x1='3' y1='12' x2='21' y2='12' />
                  <polyline points='7 16 3 12 7 8' />
                </svg>
              </span>
              <span className='docker-tooltip'>Transactions</span>
              <span className='docker-running-dot' />
            </NavLink>

            <NavLink
              to='/analytics'
              className={({ isActive }) => `docker-item ${isActive ? 'docker-item-active' : ''}`}
              aria-label='Analytics'
            >
              <span className='docker-icon'>
                <svg width='17' height='17' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <polyline points='22 12 18 12 15 21 9 3 6 12 2 12' />
                </svg>
              </span>
              <span className='docker-tooltip'>Analytics</span>
              <span className='docker-running-dot' />
            </NavLink>
          </div>

          {/* Dock Separator */}
          <span className='docker-divider' />

          {/* Action Buttons Group */}
          <div className='docker-controls-group'>
            {/* Notification Bell Icon */}
            <div className='docker-item-wrapper'>
              <button
                type='button'
                className='docker-item docker-btn-notification'
                onClick={handleNotification}
                aria-label='Notifications'
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
                <span className='docker-tooltip'>Notifications</span>
              </button>
            </div>

            {/* Circular Profile Avatar Icon */}
            <div className='header-profile-menu-wrapper' ref={profileMenuRef}>
              <button
                type='button'
                className={`docker-item docker-profile-btn ${isProfileOpen ? 'profile-btn-active' : ''}`}
                onClick={() => setIsProfileOpen(prev => !prev)}
                aria-label='User Profile Menu'
                aria-expanded={isProfileOpen}
              >
                <span className='circular-avatar-text'>{initials}</span>
                <span className='docker-tooltip'>Account</span>
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

            {/* Hamburger Navigation Drawer Toggle Icon */}
            <div className='docker-item-wrapper'>
              <button
                type='button'
                className={`docker-item docker-toggle-btn ${sidebarOpen ? 'sidebar-btn-open' : ''}`}
                onClick={onToggleSidebar}
                aria-label={sidebarOpen ? 'Close sidebar navigation' : 'Open sidebar navigation'}
              >
                <svg
                  className='hamburger-icon'
                  width='18'
                  height='18'
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
                <span className='docker-tooltip'>Workspace Menu</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
