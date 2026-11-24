import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

function Layout () {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 950
    }
    return true
  })

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className={`app-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {sidebarOpen && (
        <div
          className='sidebar-backdrop'
          onClick={closeSidebar}
          aria-hidden='true'
        />
      )}

      <div className='app-content'>
        {/* Lively Ambient Background of Graphs */}
        <div className='dashboard-art' aria-hidden='true'>
          <svg className='dashboard-trend-bg' viewBox='0 0 1200 420' preserveAspectRatio='none'>
            <defs>
              <linearGradient id='dash-art-fill' x2='0' y2='1'>
                <stop stopColor='#0866f5' stopOpacity='0.08' />
                <stop offset='1' stopColor='#0866f5' stopOpacity='0' />
              </linearGradient>
            </defs>
            <path
              fill='url(#dash-art-fill)'
              d='M0 325 C60 325 95 235 155 235 S240 273 300 273 S370 155 450 155 S524 220 595 220 S685 128 750 128 S837 165 905 165 S1000 62 1078 66 S1164 42 1200 25 V420 H0 Z'
            />
            <path
              className='dash-art-line'
              fill='none'
              stroke='#0866f5'
              strokeWidth='1.5'
              strokeOpacity='0.22'
              d='M0 325 C60 325 95 235 155 235 S240 273 300 273 S370 155 450 155 S524 220 595 220 S685 128 750 128 S837 165 905 165 S1000 62 1078 66 S1164 42 1200 25'
            />
            <path
              className='dash-art-signal'
              pathLength='1'
              fill='none'
              stroke='#0866f5'
              strokeWidth='2.5'
              strokeLinecap='round'
              d='M0 325 C60 325 95 235 155 235 S240 273 300 273 S370 155 450 155 S524 220 595 220 S685 128 750 128 S837 165 905 165 S1000 62 1078 66 S1164 42 1200 25'
            />
            <g fill='#fff' stroke='#0866f5' strokeWidth='2' opacity='0.7'>
              <circle cx='155' cy='235' r='4' />
              <circle cx='300' cy='273' r='4' />
              <circle cx='595' cy='220' r='4' />
              <circle cx='905' cy='165' r='4' />
              <circle cx='1078' cy='66' r='4' />
            </g>
          </svg>
          <div className='dashboard-ambient-bars'>
            <span style={{ '--height': '32%', '--delay': '-1.2s' }} />
            <span style={{ '--height': '56%', '--delay': '-0.6s' }} />
            <span style={{ '--height': '44%', '--delay': '-2.4s' }} />
            <span style={{ '--height': '72%', '--delay': '-1.8s' }} />
            <span style={{ '--height': '88%', '--delay': '-3s' }} />
          </div>
          <div className='dashboard-ambient-ring' />
        </div>

        <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        <main className='page-content'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
