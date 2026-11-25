import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoImg from '../assets/logo.png'

function Header ({ onToggleSidebar, sidebarOpen = true }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, demoMode } = useAuth()

  const DEFAULT_NOTIFICATIONS = [
    {
      id: 'notif_1',
      title: 'VIP Cohort Transition',
      text: '3 high-value patrons have migrated into the VIP tier (₹50k+ spend).',
      time: '12m ago',
      type: 'vip',
      read: false
    },
    {
      id: 'notif_2',
      title: 'Revenue Velocity Milestone',
      text: "Daily transaction velocity is up +18.4% compared to this week's baseline.",
      time: '1h ago',
      type: 'growth',
      read: false
    },
    {
      id: 'notif_3',
      title: 'RFM Model Synchronized',
      text: 'Behavioral clustering updated across all registered customer profiles.',
      time: '3h ago',
      type: 'system',
      read: true
    }
  ]

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('patron_notifications')
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return DEFAULT_NOTIFICATIONS
  })

  const [businessSettings, setBusinessSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('patron-business-settings')
      if (stored) return JSON.parse(stored)
    } catch {
      // fallback
    }
    return null
  })

  useEffect(() => {
    const handleSettingsUpdated = (e) => {
      if (e.detail) {
        setBusinessSettings(e.detail)
      } else {
        try {
          const stored = localStorage.getItem('patron-business-settings')
          setBusinessSettings(stored ? JSON.parse(stored) : null)
        } catch {
          setBusinessSettings(null)
        }
      }
    }
    window.addEventListener('patron:settings_updated', handleSettingsUpdated)
    window.addEventListener('storage', handleSettingsUpdated)
    return () => {
      window.removeEventListener('patron:settings_updated', handleSettingsUpdated)
      window.removeEventListener('storage', handleSettingsUpdated)
    }
  }, [])

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const profileMenuRef = useRef(null)
  const notificationMenuRef = useRef(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Close dropdowns on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileOpen(false)
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(e.target)) {
        setIsNotificationOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsProfileOpen(false)
        setIsNotificationOpen(false)
      }
    }

    if (isProfileOpen || isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isProfileOpen, isNotificationOpen])

  const toggleNotifications = () => {
    setIsNotificationOpen(prev => {
      const next = !prev
      if (next) setIsProfileOpen(false)
      return next
    })
  }

  const toggleProfile = () => {
    setIsProfileOpen(prev => {
      const next = !prev
      if (next) setIsNotificationOpen(false)
      return next
    })
  }

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updated)
    localStorage.setItem('patron_notifications', JSON.stringify(updated))
  }

  const markItemAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n)
    setNotifications(updated)
    localStorage.setItem('patron_notifications', JSON.stringify(updated))
  }

  const clearAllNotifications = () => {
    setNotifications([])
    localStorage.setItem('patron_notifications', JSON.stringify([]))
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

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard'
      case '/customers':
        return 'Customers & Segments'
      case '/transactions':
        return 'Transactions'
      case '/analytics':
        return 'Analytics'
      case '/settings':
        return 'Settings'
      default:
        return 'Dashboard'
    }
  }

  // Check if business settings have been filled by user
  const hasBusinessSettings = Boolean(
    businessSettings && (businessSettings.businessName?.trim() || businessSettings.industry?.trim())
  )

  // Derive display name and email dynamically from authenticated user and saved business settings
  const displayName = businessSettings?.ownerName?.trim() || user?.name || (user?.email ? user.email.split('@')[0] : (demoMode ? 'Demo Account' : 'Authenticated User'))
  const displayEmail = businessSettings?.email?.trim() || user?.email || (demoMode ? 'demo@patronindex.local' : '')

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

      {/* Top-Right Action Controls */}
      <div className='header-right'>
        <nav className='navbar-docker' aria-label='Action controls'>
          {/* Action Buttons Group */}
          <div className='docker-controls-group'>
            {/* Notification Bell Icon & Interactive Dropdown Menu */}
            <div className='header-notification-menu-wrapper' ref={notificationMenuRef}>
              <button
                type='button'
                className={`docker-item docker-btn-notification ${isNotificationOpen ? 'docker-btn-active' : ''}`}
                onClick={toggleNotifications}
                aria-label='Notifications'
                aria-expanded={isNotificationOpen}
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
                {/* Blue dot ONLY visible when there are new/unread notifications */}
                {unreadCount > 0 && <span className='notification-dot' />}
                <span className='docker-tooltip'>Notifications</span>
              </button>

              {/* Notification Dropdown Panel */}
              {isNotificationOpen && (
                <div className='header-notification-dropdown'>
                  <div className='notification-dropdown-header'>
                    <div className='notification-header-title'>
                      <h4>Notifications</h4>
                      {unreadCount > 0 && (
                        <span className='notification-count-chip'>{unreadCount} new</span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button
                        type='button'
                        className='notification-header-action'
                        onClick={unreadCount > 0 ? markAllAsRead : clearAllNotifications}
                      >
                        {unreadCount > 0 ? 'Mark all read' : 'Clear all'}
                      </button>
                    )}
                  </div>

                  {notifications.length > 0 ? (
                    <div className='notification-list'>
                      {notifications.map(item => (
                        <div
                          key={item.id}
                          className={`notification-item ${!item.read ? 'unread' : ''}`}
                          onClick={() => markItemAsRead(item.id)}
                          title={!item.read ? 'Click to mark as read' : ''}
                        >
                          <div className={`notification-item-icon ${item.type || 'system'}`}>
                            {item.type === 'vip' ? '★' : item.type === 'growth' ? '↗' : 'ℹ'}
                          </div>
                          <div className='notification-item-content'>
                            <div className='notification-item-title'>
                              <span>{item.title}</span>
                              {!item.read && <span className='notification-unread-dot' />}
                            </div>
                            <span className='notification-item-text'>{item.text}</span>
                            <span className='notification-item-time'>{item.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='notification-empty-state'>
                      <div className='notification-empty-icon'>
                        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                          <path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' />
                          <path d='M13.73 21a2 2 0 0 1-3.46 0' />
                          <line x1='2' y1='2' x2='22' y2='22' />
                        </svg>
                      </div>
                      <strong>No notifications</strong>
                      <p>You&apos;re all caught up! New business alerts will appear here.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Circular Profile Avatar Icon */}
            <div className='header-profile-menu-wrapper' ref={profileMenuRef}>
              <button
                type='button'
                className={`docker-item docker-profile-btn ${isProfileOpen ? 'profile-btn-active' : ''}`}
                onClick={toggleProfile}
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
                      {hasBusinessSettings && (
                        <div className='dropdown-badge-row'>
                          <span className='dropdown-role-pill role-admin'>
                            {businessSettings.industry?.trim()
                              ? `${user?.role ? user.role.toUpperCase() : 'ANALYST'} • ${businessSettings.industry.trim().toUpperCase()}`
                              : `${user?.role ? user.role.toUpperCase() : 'ANALYST'} • BUSINESS`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Account Workspace Summary - Only visible when user filled in settings */}
                  {hasBusinessSettings && (
                    <div className='dropdown-tier-card'>
                      <div className='tier-label-group'>
                        <span className='tier-name'>{businessSettings.businessName?.trim() || 'Workspace'}</span>
                        <span className='tier-tag'>
                          {businessSettings.industry?.trim() ? businessSettings.industry.trim().toUpperCase() : 'BUSINESS'}
                        </span>
                      </div>
                      <span className='tier-sub'>
                        {businessSettings.location?.trim()
                          ? `${businessSettings.location.trim()} • Active Workspace`
                          : 'Active Workspace'}
                      </span>
                    </div>
                  )}

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
