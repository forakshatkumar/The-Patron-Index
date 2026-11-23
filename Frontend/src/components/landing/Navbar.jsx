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
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_2px_12px_rgba(11,35,69,0.05)] border-b border-[#E5EBF3] py-3.5'
          : 'bg-white/90 backdrop-blur-sm border-b border-[#E5EBF3]/60 py-4'
      }`}
    >
      <div className='patron-container'>
        <div className='flex items-center justify-between'>
          
          {/* LEFT: Brand Logo, Product Name & Tagline */}
          <a
            href='#home'
            onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
            className='flex items-center gap-3 group cursor-pointer select-none'
          >
            <div className='w-10 h-10 rounded-xl flex items-center justify-center p-0.5 bg-white border border-[#E5EBF3] shadow-2xs group-hover:scale-105 transition-transform flex-shrink-0'>
              <img
                src={logoImg}
                alt='The Patron Index'
                className='h-full w-full object-contain'
              />
            </div>
            <div className='flex flex-col'>
              <span className='text-base sm:text-lg font-black tracking-tight text-[#0B2345] font-display leading-tight'>
                The Patron Index
              </span>
              <span className='text-[10px] sm:text-[11px] text-[#0866F5] font-semibold tracking-wide leading-none hidden sm:block'>
                Where Buyers Become Insight
              </span>
            </div>
          </a>

          {/* CENTER: Navigation Links */}
          <nav className='hidden md:flex items-center gap-8 lg:gap-10'>
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <button
                  key={link.id}
                  type='button'
                  onClick={() => handleNavClick(link.href)}
                  className={`text-sm font-semibold transition-colors cursor-pointer relative py-1 ${
                    isActive
                      ? 'text-[#0866F5]'
                      : 'text-[#344563] hover:text-[#0B2345]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId='activeNavbarIndicator'
                      className='absolute bottom-0 left-0 right-0 h-0.5 bg-[#0866F5] rounded-full'
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </nav>

          {/* RIGHT: Login & High-Contrast Sign Up Action Buttons */}
          <div className='hidden md:flex items-center gap-3'>
            <Link
              to='/login'
              className='px-4 py-2 text-sm font-semibold text-[#344563] hover:text-[#0B2345] transition-colors rounded-full'
            >
              Login
            </Link>
            <Link
              to='/register'
              className='inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold text-white bg-[#0B2345] hover:bg-[#0866F5] transition-all duration-200 rounded-full shadow-xs hover:shadow-md hover:scale-102 active:scale-98'
            >
              <span>Sign Up</span>
              <ArrowRight className='w-3.5 h-3.5 text-white' />
            </Link>
          </div>

          {/* MOBILE: Accessible Menu Hamburger */}
          <button
            type='button'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='md:hidden p-2 text-[#344563] hover:text-[#0B2345] rounded-lg'
            aria-label='Toggle navigation menu'
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className='md:hidden overflow-hidden pt-3 pb-4 border-t border-[#E5EBF3] flex flex-col gap-2 mt-3'
            >
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type='button'
                  onClick={() => handleNavClick(link.href)}
                  className='text-left px-3 py-2 text-sm font-semibold text-[#344563] hover:text-[#0866F5] hover:bg-[#EFF5FF] rounded-lg transition-colors'
                >
                  {link.label}
                </button>
              ))}
              <div className='pt-2 border-t border-[#E5EBF3] flex flex-col gap-2'>
                <Link
                  to='/login'
                  className='w-full text-center py-2 text-sm font-semibold text-[#344563] hover:bg-slate-50 rounded-lg'
                >
                  Login
                </Link>
                <Link
                  to='/register'
                  className='w-full text-center py-2.5 text-sm font-bold text-white bg-[#0B2345] hover:bg-[#0866F5] rounded-lg shadow-xs'
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
