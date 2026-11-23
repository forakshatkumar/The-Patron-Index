import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import logoImg from '../../assets/logo.png'

export default function Navbar () {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      const sections = ['home', 'features', 'about', 'reviews']
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
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-100 py-3.5'
          : 'bg-white/85 backdrop-blur-sm py-4'
      }`}
    >
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between'>
          
          {/* Brand Logo & Name */}
          <a
            href='#home'
            onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
            className='flex items-center gap-2.5 group cursor-pointer select-none'
          >
            <div className='w-9 h-9 rounded-lg flex items-center justify-center p-0.5 bg-white border border-slate-100 shadow-2xs group-hover:scale-105 transition-transform'>
              <img
                src={logoImg}
                alt='The Patron Index'
                className='h-full w-full object-contain'
              />
            </div>
            <div className='flex flex-col'>
              <span className='text-base sm:text-lg font-black tracking-tight text-[#0B2545] font-display leading-tight'>
                The Patron Index
              </span>
              <span className='text-[10px] text-[#0066FF] font-semibold leading-none hidden sm:block'>
                Where Buyers Become Insight
              </span>
            </div>
          </a>

          {/* Navigation Links - Centered */}
          <nav className='hidden md:flex items-center gap-9'>
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <button
                  key={link.id}
                  type='button'
                  onClick={() => handleNavClick(link.href)}
                  className={`text-sm font-semibold transition-all cursor-pointer relative py-1 ${
                    isActive
                      ? 'text-[#0066FF]'
                      : 'text-slate-600 hover:text-[#0B2545]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId='activeNavIndicator'
                      className='absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066FF] rounded-full'
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Action CTAs */}
          <div className='hidden md:flex items-center gap-3'>
            <Link
              to='/login'
              className='px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#0B2545] transition-colors rounded-full'
            >
              Login
            </Link>
            <Link
              to='/register'
              className='inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white bg-[#0B2545] hover:bg-[#0066FF] transition-all duration-200 rounded-full shadow-xs hover:shadow-md hover:scale-102 active:scale-98'
            >
              <span>Sign Up</span>
              <ArrowRight className='w-3.5 h-3.5' />
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            type='button'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='md:hidden p-2 text-slate-700 hover:text-[#0B2545] rounded-lg'
            aria-label='Toggle navigation menu'
          >
            {mobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className='md:hidden overflow-hidden pt-3 pb-4 border-t border-slate-100 flex flex-col gap-2'
            >
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type='button'
                  onClick={() => handleNavClick(link.href)}
                  className='text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#0066FF] hover:bg-slate-50 rounded-lg'
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
                  className='w-full text-center py-2 text-sm font-bold text-white bg-[#0B2545] hover:bg-[#0066FF] rounded-lg'
                >
                  Sign Up
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
