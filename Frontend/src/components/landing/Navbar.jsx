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
          if (rect.top <= 120 && rect.bottom >= 120) {
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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-100 py-3'
          : 'bg-white/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between'>
          {/* Logo Brand */}
          <a
            href='#home'
            onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
            className='flex items-center gap-2.5 group cursor-pointer'
          >
            <img
              src={logoImg}
              alt='The Patron Index'
              className='h-9 w-9 object-contain transition-transform group-hover:scale-105'
            />
            <div className='flex flex-col'>
              <span className='text-lg font-extrabold tracking-tight text-[#0B2545] font-display leading-tight'>
                The Patron Index
              </span>
              <span className='text-[10px] text-[#0066FF] font-medium leading-none hidden sm:block'>
                Where Buyers Become Insight
              </span>
            </div>
          </a>

          {/* Center Navigation Links */}
          <nav className='hidden md:flex items-center gap-8'>
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <button
                  key={link.id}
                  type='button'
                  onClick={() => handleNavClick(link.href)}
                  className={`text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#0066FF] font-semibold'
                      : 'text-slate-600 hover:text-[#0B2545]'
                  }`}
                >
                  {link.label}
                </button>
              )
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className='hidden md:flex items-center gap-3'>
            <Link
              to='/login'
              className='px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#0B2545] transition-colors rounded-full'
            >
              Login
            </Link>
            <Link
              to='/register'
              className='px-5 py-2 text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#0066FF] transition-all rounded-full shadow-sm hover:shadow-md'
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type='button'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='md:hidden p-2 text-slate-700 hover:text-[#0B2545] rounded-lg'
            aria-label='Toggle navigation menu'
          >
            {mobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className='md:hidden mt-3 pt-3 pb-4 border-t border-slate-100 flex flex-col gap-2 animate-fadeIn'>
            {navLinks.map((link) => (
              <button
                key={link.id}
                type='button'
                onClick={() => handleNavClick(link.href)}
                className='text-left px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#0066FF] hover:bg-slate-50 rounded-lg'
              >
                {link.label}
              </button>
            ))}
            <div className='pt-2 border-t border-slate-100 flex flex-col gap-2'>
              <Link
                to='/login'
                className='w-full text-center py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg'
              >
                Login
              </Link>
              <Link
                to='/register'
                className='w-full text-center py-2 text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#0066FF] rounded-lg'
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
