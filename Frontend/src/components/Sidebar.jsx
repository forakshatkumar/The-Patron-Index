import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoImg from '../assets/logo.png'

function Sidebar ({ isOpen = true, onClose }) {
  const navigate = useNavigate()
  const { logout, demoMode } = useAuth()
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '▦' },
    { name: 'Customers', path: '/customers', icon: '◉' },
    { name: 'Customer Segments', path: '/segments', icon: '◫' },
    { name: 'Transactions', path: '/transactions', icon: '↔' },
    { name: 'Analytics', path: '/analytics', icon: '⌁' },
    { name: 'Reports', path: '/reports', icon: '▤' }
  ]

  const signOut = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleNavClick = () => {
    if (window.innerWidth <= 768 && onClose) {
      onClose()
    }
  }

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className='sidebar-brand-wrapper'>
        <NavLink to='/dashboard' className='sidebar-brand' onClick={handleNavClick}>
          <img src={logoImg} alt='The Patron Index' className='brand-logo-img' />
          <div>
            <h2>The Patron Index</h2>
            <span>Customer Intelligence</span>
          </div>
        </NavLink>
        <button
          type='button'
          className='sidebar-close-btn'
          onClick={onClose}
          aria-label='Close sidebar'
        >
          ✕
        </button>
      </div>

      <div className='sidebar-section-label'>WORKSPACE</div>
      <nav className='sidebar-nav'>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleNavClick}
            className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
          >
            <span className='sidebar-icon'>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className='sidebar-bottom'>
        <NavLink to='/import' onClick={handleNavClick} className='import-button'>
          <span>＋</span>
          Import Data
        </NavLink>
        <NavLink
          to='/settings'
          onClick={handleNavClick}
          className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
        >
          <span className='sidebar-icon'>⚙</span>
          <span>Settings</span>
        </NavLink>
        <button type='button' className='sidebar-link sidebar-logout' onClick={signOut}>
          <span className='sidebar-icon'>↪</span>
          <span>{demoMode ? 'Exit Demo' : 'Sign Out'}</span>
        </button>
        <div className='sidebar-user'>
          <div className='sidebar-avatar'>PI</div>
          <div className='sidebar-user-info'>
            <strong>{demoMode ? 'Demo Business' : 'Business Account'}</strong>
            <span>{demoMode ? 'Demo Mode' : 'Secure Session'}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
