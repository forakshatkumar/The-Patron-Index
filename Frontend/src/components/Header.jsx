import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, PanelLeft, Settings as SettingsIcon, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function Avatar ({ user, size = 'small' }) {
  const initials = (user?.name || 'Patron Index').split(/\s+/).slice(0, 2).map(s => s[0]).join('').toUpperCase()
  return <span className={`premium-avatar ${size}`}>{user?.avatar ? <img src={user.avatar} alt='' referrerPolicy='no-referrer' /> : initials}</span>
}

export default function Header ({ onToggleSidebar, navigationOpen, toggleRef }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, preferences, logout, demoMode } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const notifRef = useRef(null)
  const profileMenuRef = useRef(null)

  const [businessSettings, setBusinessSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('patron-business-settings')
      if (stored) {
        const parsed = JSON.parse(stored)
        const businessName = (parsed.businessName === 'Patron Analytics' || parsed.businessName === 'Enterprise Workspace') ? '' : (parsed.businessName || '')
        const industry = (parsed.industry === 'Retail & Commerce') ? '' : (parsed.industry || '')
        const location = (parsed.location === 'New Delhi, India') ? '' : (parsed.location || '')
        const phone = (parsed.phone === '+91 98765 43210') ? '' : (parsed.phone || '')
        return {
          businessName,
          ownerName: parsed.ownerName || '',
          email: parsed.email || '',
          phone,
          industry,
          location
        }
      }
    } catch {
      // fallback
    }
    if (user?.businessName || user?.industry) {
      return {
        businessName: user.businessName || '',
        ownerName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        industry: user.industry || '',
        location: user.location || ''
      }
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

  const displayName = businessSettings?.ownerName?.trim() || user?.name || (user?.email ? user.email.split('@')[0] : (demoMode ? 'Demo Account' : 'Authenticated User'))
  const displayEmail = businessSettings?.email?.trim() || user?.email || (demoMode ? 'demo@patronindex.local' : '')
  const initials = (displayName || 'Patron Index').split(/\s+/).slice(0, 2).map(s => s[0]).join('').toUpperCase()

  const handleGoToSettings = () => {
    setIsProfileOpen(false)
    navigate('/settings')
  }

  const handleSignOut = async () => {
    setIsProfileOpen(false)
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch {
      navigate('/login', { replace: true })
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
          aria-label={navigationOpen ? 'Close navigation' : 'Open navigation'}
          aria-controls='workspace-navigation'
          aria-expanded={navigationOpen}
          onClick={onToggleSidebar}
        >
          <PanelLeft size={20} />
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
            <div className='header-profile-dropdown' role='menu'>
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
                <button
                  type='button'
                  className='dropdown-menu-item'
                  onClick={handleGoToSettings}
                >
                  <span className='dropdown-item-icon'>
                    <SettingsIcon size={16} />
                  </span>
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
