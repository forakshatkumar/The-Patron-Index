import { NavLink, Link } from 'react-router-dom'
import { LayoutDashboard, Users, ArrowLeftRight, ChartNoAxesCombined, Settings, Upload, X } from 'lucide-react'
import logo from '../assets/logo.png'
export default function Sidebar ({ onClose }) {
  const items = [[LayoutDashboard,'Overview','/dashboard'],[Users,'Customers & Segments','/customers'],[ArrowLeftRight,'Transactions','/transactions'],[ChartNoAxesCombined,'Analytics','/analytics']]
  const item = ([Icon,label,to]) => <NavLink key={to} to={to} onClick={onClose} title={label} aria-label={label} className={({isActive}) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}><Icon size={19}/><span>{label}</span></NavLink>
  return <aside className='sidebar premium-sidebar' aria-label='Workspace navigation'>
    <Link to='/dashboard' onClick={onClose} className='premium-brand'><img src={logo} alt=''/><span>The Patron Index<small>Workspace</small></span></Link>
    <button className='mobile-close' onClick={onClose} aria-label='Close navigation'><X size={20}/></button>
    <div className='sidebar-section-label'>WORKSPACE</div><nav className='sidebar-nav'>{items.map(item)}</nav>
    <div className='premium-sidebar-bottom'><Link to='/import' onClick={onClose} title='Import data' aria-label='Import data' className='premium-import'><Upload size={18}/><span>Import data</span></Link><nav>{item([Settings,'Settings','/settings'])}</nav></div>
  </aside>
}
