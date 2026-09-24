import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Sidebar () {
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

  return (
    <aside className='sidebar'>
      <NavLink to='/dashboard' className='sidebar-brand'>
        <div className='brand-logo'>P</div>
        <div><h2>The Patron Index</h2><span>Customer Intelligence</span></div>
      </NavLink>
      <div className='sidebar-section-label'>WORKSPACE</div>
      <nav className='sidebar-nav'>
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}>
            <span className='sidebar-icon'>{item.icon}</span><span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className='sidebar-bottom'>
        <NavLink to='/import' className='import-button'><span>＋</span>Import Data</NavLink>
        <NavLink to='/settings' className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}><span className='sidebar-icon'>⚙</span><span>Settings</span></NavLink>
        <button type='button' className='sidebar-link sidebar-logout' onClick={signOut}><span className='sidebar-icon'>↪</span><span>{demoMode ? 'Exit Demo' : 'Sign Out'}</span></button>
        <div className='sidebar-user'><div className='sidebar-avatar'>PI</div><div className='sidebar-user-info'><strong>{demoMode ? 'Demo Business' : 'Business Account'}</strong><span>{demoMode ? 'Demo Mode' : 'Secure Session'}</span></div></div>
      </div>
    </aside>
  )
}

export default Sidebar
