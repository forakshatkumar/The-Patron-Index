import { NavLink } from 'react-router-dom'
import logoImg from '../assets/logo.png'

function Sidebar ({ isOpen = true, onClose }) {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '▦' },
    { name: 'Customers & Segments', path: '/customers', icon: '◉' },
    { name: 'Transactions', path: '/transactions', icon: '↔' },
    { name: 'Analytics', path: '/analytics', icon: '⌁' }
  ]

  const handleNavClick = () => {
    if (onClose) {
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
    </aside>
  )
}

export default Sidebar
