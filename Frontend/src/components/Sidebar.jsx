import { NavLink, Link } from 'react-router-dom'
import { LayoutDashboard, Users, ArrowLeftRight, ChartNoAxesCombined, Settings, X } from 'lucide-react'
import logo from '../assets/logo.png'

export default function Sidebar ({ sidebarRef, hidden, onClose, onNavigate }) {
  const items = [[LayoutDashboard,'Overview','/dashboard'],[Users,'Customers & Segments','/customers'],[ArrowLeftRight,'Transactions','/transactions'],[ChartNoAxesCombined,'Analytics','/analytics']]
  const item = ([Icon,label,to]) => <NavLink key={to} to={to} onClick={onNavigate} title={label} aria-label={label} className={({isActive}) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}><Icon size={20} aria-hidden='true'/><span className='premium-sidebar-label'>{label}</span></NavLink>
  return <aside ref={sidebarRef} id='workspace-navigation' className='sidebar premium-sidebar' aria-label='Workspace navigation' aria-hidden={hidden || undefined} inert={hidden}>
    <Link to='/dashboard' onClick={onNavigate} className='premium-brand' aria-label='The Patron Index — Overview' title='The Patron Index'><img src={logo} alt=''/><span className='premium-sidebar-label'>The Patron Index<small>Where buyers become insight</small></span></Link>
    <button type='button' className='mobile-close' onClick={onClose} aria-label='Close navigation'><X size={20}/></button>
    <div className='sidebar-section-label'>WORKSPACE</div><nav className='sidebar-nav'>{items.map(item)}</nav>
    <div className='premium-sidebar-bottom'><nav>{item([Settings,'Settings','/settings'])}</nav></div>
  </aside>
}
