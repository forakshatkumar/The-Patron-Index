import { NavLink } from 'react-router-dom'

function Sidebar ({ isOpen = true, onClose }) {
  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
          <rect x='3' y='3' width='7' height='7' rx='1.5' />
          <rect x='14' y='3' width='7' height='7' rx='1.5' />
          <rect x='14' y='14' width='7' height='7' rx='1.5' />
          <rect x='3' y='14' width='7' height='7' rx='1.5' />
        </svg>
      )
    },
    {
      name: 'Customers & Segments',
      path: '/customers',
      icon: (
        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
          <circle cx='12' cy='12' r='9' />
          <circle cx='12' cy='12' r='3.5' fill='currentColor' />
        </svg>
      )
    },
    {
      name: 'Transactions',
      path: '/transactions',
      icon: (
        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
          <polyline points='17 8 21 12 17 16' />
          <line x1='3' y1='12' x2='21' y2='12' />
          <polyline points='7 16 3 12 7 8' />
        </svg>
      )
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: (
        <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
          <polyline points='22 12 18 12 15 21 9 3 6 12 2 12' />
        </svg>
      )
    }
  ]

  const handleNavClick = () => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
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
