import { useState, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout () {
  // Start closed on each new workspace visit; keep the choice during navigation.
  const [desktopOpen, setDesktopOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 900px)').matches)
  const toggleRef = useRef(null)
  const sidebarRef = useRef(null)
  const { pathname } = useLocation()
  const open = isMobile ? mobileOpen : desktopOpen

  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)')
    const change = event => { setIsMobile(event.matches); setMobileOpen(false) }
    media.addEventListener('change', change)
    return () => media.removeEventListener('change', change)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])
  const closeMobile = () => { setMobileOpen(false); requestAnimationFrame(() => toggleRef.current?.focus()) }
  const toggle = () => {
    if (isMobile) setMobileOpen(value => !value)
    else setDesktopOpen(value => !value)
  }

  useEffect(() => {
    if (!open) return
    if (isMobile) sidebarRef.current?.querySelector('.mobile-close')?.focus()
    const close = event => {
      if (event.key !== 'Escape' || event.defaultPrevented || document.querySelector('dialog[open]')) return
      if (isMobile) setMobileOpen(false)
      else setDesktopOpen(false)
      requestAnimationFrame(() => toggleRef.current?.focus())
    }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [open, isMobile])

  return <div className={`app-layout premium-layout ${desktopOpen ? 'desktop-open' : ''} ${mobileOpen && isMobile ? 'mobile-open' : ''}`}>
    <Sidebar sidebarRef={sidebarRef} open={open} onClose={closeMobile} onNavigate={() => { if (isMobile) closeMobile() }} />
    {mobileOpen && isMobile && <button type='button' className='premium-backdrop' aria-label='Close navigation' tabIndex={-1} onClick={closeMobile} />}
    <div className='app-content' inert={isMobile && mobileOpen}><Header onToggleSidebar={toggle} navigationOpen={open} toggleRef={toggleRef} /><main className='page-content'><Outlet /></main></div>
  </div>
}
