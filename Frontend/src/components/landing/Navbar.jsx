import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logoImg from '../../assets/logo.png'

export default function Navbar () {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      const sections = ['home', 'about', 'how-it-works', 'features', 'reviews']
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'features', label: 'Features', href: '#features' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'reviews', label: 'Reviews', href: '#reviews' }
  ]

  const handleNavClick = (href) => {
    setMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-100 py-3.5'
          : 'bg-white py-4.5'
      }`}
    >
      <div className='max-w-[1160px] mx-auto px-4 sm:px-6'>
        <div className='flex items-center justify-between'>
          
          {/* LEFT: Logo & Brand Name */}
          <a
            href='#home'
            onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
            className='flex items-center gap-2.5 group cursor-pointer select-none'
          >
            <div className='w-7 h-7 flex items-center justify-center flex-shrink-0'>
              <img
                src={logoImg}
                alt='The Patron Index'
                className='h-full w-full object-contain'
              />
            </div>
            <span className='text-base sm:text-lg font-bold tracking-tight text-[#0B2545] font-display'>
              The Patron Index
            </span>
          </a>

          {/* CENTER: Navigation Links */}
          <nav className='hidden md:flex items-center gap-8'>
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <button
                  key={link.id}
                  type='button'
                  onClick={() => handleNavClick(link.href)}
                  className={`text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#0066FF] font-semibold'
                      : 'text-slate-700 hover:text-[#0066FF]'
                  }`}
                >
                  {link.label}
                </button>
              )
            })}
          </nav>

          {/* RIGHT: Login & Sign Up Compact Pills */}
          <div className='hidden md:flex items-center gap-2.5'>
            <Link
              to='/login'
              className='px-4 py-1.5 text-xs font-semibold text-[#0B2545] bg-white border border-slate-300 hover:border-[#0066FF] hover:text-[#0066FF] transition-all rounded-full'
            >
              Login
            </Link>
            <Link
              to='/register'
              className='px-4.5 py-1.5 text-xs font-semibold text-white bg-[#0B2545] hover:bg-[#0066FF] transition-all rounded-full shadow-2xs'
            >
              Sign Up
            </Link>
          </div>

          {/* MOBILE: Hamburger Button */}
          <button
            type='button'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='md:hidden p-1.5 text-slate-700 hover:text-[#0B2545] rounded-lg'
            aria-label='Toggle menu'
          >
            {mobileMenuOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className='md:hidden mt-3 pt-3 pb-4 border-t border-slate-100 flex flex-col gap-2'>
            {navLinks.map((link) => (
              <button
                key={link.id}
                type='button'
                onClick={() => handleNavClick(link.href)}
                className='text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#0066FF] hover:bg-slate-50 rounded-lg'
              >
                {link.label}
              </button>
            ))}
            <div className='pt-2 border-t border-slate-100 flex items-center gap-2'>
              <Link
                to='/login'
                className='flex-1 text-center py-1.5 text-xs font-semibold text-[#0B2545] border border-slate-300 rounded-full'
              >
                Login
              </Link>
              <Link
                to='/register'
                className='flex-1 text-center py-1.5 text-xs font-semibold text-white bg-[#0B2545] hover:bg-[#0066FF] rounded-full'
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
