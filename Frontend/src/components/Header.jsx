import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, PanelLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
export function Avatar ({ user, size = 'small' }) {
  const initials = (user?.name || 'Patron Index').split(/\s+/).slice(0,2).map(s=>s[0]).join('').toUpperCase()
  return <span className={`premium-avatar ${size}`}>{user?.avatar ? <img src={user.avatar} alt='' referrerPolicy='no-referrer'/> : initials}</span>
}
export default function Header ({ onToggleSidebar, navigationOpen, toggleRef }) {
  const { user, preferences } = useAuth()
  const { pathname } = useLocation()
  const [open,setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const close = e => { if (!ref.current?.contains(e.target) || e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown',close); document.addEventListener('keydown',close)
    return () => { document.removeEventListener('pointerdown',close); document.removeEventListener('keydown',close) }
  },[])
  const titles = {'/dashboard':'Overview','/customers':'Customers & Segments','/transactions':'Transactions','/analytics':'Analytics','/profile':'Profile','/settings':'Settings','/import':'Import data'}
  return <header className='top-header premium-header'><div className='premium-header-left'><button ref={toggleRef} type='button' className='premium-icon-button' aria-label={navigationOpen ? 'Close navigation' : 'Open navigation'} aria-controls='workspace-navigation' aria-expanded={navigationOpen} onClick={onToggleSidebar}><PanelLeft size={20}/></button><span className='premium-breadcrumb'>Workspace <span>/</span> <strong>{titles[pathname] || 'Customer profile'}</strong></span></div><div className='premium-header-right'>
    {preferences.notifications && <div className='premium-notification' ref={ref}><button className='premium-icon-button' aria-label='Notifications' aria-expanded={open} onClick={()=>setOpen(v=>!v)}><Bell size={20}/></button>{open && <div className='premium-popover'><h3>Notifications</h3><p>No live notifications available.</p></div>}</div>}
    <Link className='premium-account' to='/profile' aria-label='Your profile'><Avatar user={user}/><span>{user?.name || 'My profile'}</span></Link>
  </div></header>
}
