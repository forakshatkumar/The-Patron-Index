import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
export default function Layout () {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('patron_sidebar') === 'collapsed')
  const [mobileOpen, setMobileOpen] = useState(false)
  const toggle = () => {
    if (window.matchMedia('(max-width: 900px)').matches) setMobileOpen(v => !v)
    else setCollapsed(v => { localStorage.setItem('patron_sidebar', v ? 'expanded' : 'collapsed'); return !v })
  }
  useEffect(() => {
    const close = e => { if (e.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close)
  }, [])
  return <div className={`app-layout premium-layout ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
    <Sidebar onClose={() => setMobileOpen(false)} />
    {mobileOpen && <button className='premium-backdrop' aria-label='Close navigation' onClick={() => setMobileOpen(false)} />}
    <div className='app-content'><Header onToggleSidebar={toggle} /><main className='page-content'><Outlet /></main></div>
  </div>
}
