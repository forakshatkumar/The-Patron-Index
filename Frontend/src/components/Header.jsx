import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, PanelLeftOpen, PanelLeftClose, UserRound, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function Avatar ({ user, size = 'small' }) {
  const initials = (user?.name || 'Patron Index').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase()
  return <span className={`premium-avatar ${size}`}>{user?.avatar ? <img src={user.avatar} alt='' referrerPolicy='no-referrer' /> : initials}</span>
}

export default function Header ({ onToggleSidebar, navigationOpen, toggleRef }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, preferences, logout, demoMode } = useAuth()
  const [menuError, setMenuError] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const notifRef = useRef(null)
  const profileMenuRef = useRef(null)

  const businessSettings = user
  useEffect(() => {
    const close = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileOpen(false)
      }
      if (e.key === 'Escape') {
        setNotifOpen(false)
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', close)
    }
  }, [])

  const hasBusinessSettings = Boolean(
    businessSettings && (businessSettings.businessName?.trim() || businessSettings.industry?.trim())
  )

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : (demoMode ? 'Demo Account' : 'Authenticated User'))
  const displayEmail = user?.email || (demoMode ? 'demo@patronindex.local' : '')
  const initials = (displayName || 'Patron Index').trim().split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase()

  const handleGoToProfile = () => {
    setIsProfileOpen(false)
    navigate('/profile')
  }

  const handleSignOut = async () => {
    setIsProfileOpen(false)
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (error) {
      setMenuError(error.message); setIsProfileOpen(true)
    }
  }

  const titles = {
    '/dashboard': 'Overview',
    '/customers': 'Customers & Segments',
    '/transactions': 'Transactions',
    '/analytics': 'Analytics',
    '/profile': 'Profile',
    '/settings': 'Settings',
    '/import': 'Import data'
  }

  return (
    <header className='top-header premium-header'>
      <div className='premium-header-left'>
        <button
          ref={toggleRef}
          type='button'
          className='premium-icon-button'
          aria-label={navigationOpen ? 'Collapse navigation' : 'Expand navigation'}
          aria-controls='workspace-navigation'
          aria-expanded={navigationOpen}
          onClick={onToggleSidebar}
        >
          {navigationOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
        <span className='premium-breadcrumb'>
          Workspace <span>/</span> <strong>{titles[pathname] || 'Customer profile'}</strong>
        </span>
      </div>

      <div className='premium-header-right'>
        {preferences.notifications && (
          <div className='premium-notification' ref={notifRef}>
            <button
              className='premium-icon-button'
              aria-label='Notifications'
              aria-expanded={notifOpen}
              onClick={() => {
                setNotifOpen(v => !v)
                setIsProfileOpen(false)
              }}
            >
              <Bell size={20} />
            </button>
            {notifOpen && (
              <div className='premium-popover'>
                <h3>Notifications</h3>
                <p>No live notifications available.</p>
              </div>
            )}
          </div>
        )}

        {/* Circular Profile Avatar Icon with interactive dropdown */}
        <div className='header-profile-menu-wrapper' ref={profileMenuRef}>
          <button
            type='button'
            className={`header-circular-profile-btn ${isProfileOpen ? 'profile-btn-active' : ''}`}
            onClick={() => {
              setIsProfileOpen(v => !v)
              setNotifOpen(false)
            }}
            aria-label='Account menu'
            aria-expanded={isProfileOpen}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt=''
                referrerPolicy='no-referrer'
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <span className='circular-avatar-text'>{initials}</span>
            )}
          </button>

          {isProfileOpen && (
            <div className='header-profile-dropdown' aria-label='Account actions'>
              <div className='dropdown-account-header'>
                <div className='dropdown-large-avatar'>
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt=''
                      referrerPolicy='no-referrer'
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    initials
                  )}
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

              {/* Account Workspace Summary - ONLY visible when user filled in settings */}
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

              <div className='dropdown-actions-menu'>
                {menuError && <p role='alert' className='account-error'>{menuError}</p>}
                <button
                  type='button'
                  className='dropdown-menu-item'
                  onClick={handleGoToProfile}
                >
                  <span className='dropdown-item-icon'>
                    <UserRound size={16} />
                  </span>
                  <div className='dropdown-item-text'>
                    <strong>Your profile</strong>
                    <span>View personal and business information</span>
                  </div>
                </button>

                <button
                  type='button'
                  className='dropdown-menu-item dropdown-item-signout'
                  onClick={handleSignOut}
                >
                  <span className='dropdown-item-icon'>
                    <LogOut size={16} />
                  </span>
                  <div className='dropdown-item-text'>
                    <strong>Sign Out</strong>
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
