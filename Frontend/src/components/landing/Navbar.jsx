import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'
import logoImg from '../../assets/logo.png'

export default function Navbar ({ onOpenDemo }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)

      const sections = ['hero', 'problem', 'how-it-works', 'data-audit', 'segments', 'score-engine', 'dashboard', 'recommendations', 'trust']
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
    { id: 'how-it-works', label: 'How it works' },
    { id: 'data-audit', label: 'Data Audit' },
    { id: 'segments', label: 'Segments' },
    { id: 'score-engine', label: 'Score Engine' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'recommendations', label: 'Insights' }
  ]

  const handleNavClick = (id) => {
    setMobileMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-[#0B0F14]/85 backdrop-blur-md border-b border-[#222B36]'
          : 'py-5 bg-transparent'
      }`}
      role='navigation'
      aria-label='Main Navigation'
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
        {/* Brand Logo & Title */}
        <Link to='/' className='flex items-center gap-3 group' aria-label='The Patron Index Home'>
          <div className='w-9 h-9 rounded-lg bg-[#121820] border border-[#222B36] p-1 flex items-center justify-center transition-transform group-hover:scale-105'>
            <img src={logoImg} alt='The Patron Index' className='w-full h-full object-contain' />
          </div>
          <div className='flex flex-col'>
            <span className='text-sm font-bold text-[#E8EEF5] tracking-tight'>The Patron Index</span>
            <span className='text-[10px] text-[#8A98A8] font-medium'>Customer Intelligence</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className='hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full bg-[#121820]/70 border border-[#222B36]/80'>
          {navLinks.map((link) => {
            const isActive = activeSection === link.id
            return (
              <button
                key={link.id}
                type='button'
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  isActive
                    ? 'bg-[#4F8CFF]/20 text-[#4F8CFF] shadow-sm shadow-[#4F8CFF]/20'
                    : 'text-[#8A98A8] hover:text-[#E8EEF5] hover:bg-[#18222E]'
                }`}
              >
                {link.label}
              </button>
            )
          })}
        </div>

        {/* Action CTAs */}
        <div className='hidden sm:flex items-center gap-3'>
          <button
            type='button'
            onClick={onOpenDemo}
            className='px-3.5 py-1.5 text-xs font-medium text-[#E8EEF5] bg-[#121820] hover:bg-[#18222E] border border-[#222B36] rounded-full transition-colors'
          >
            Live Demo
          </button>
          <Link
            to='/login'
            className='text-xs font-medium text-[#8A98A8] hover:text-[#E8EEF5] px-2 py-1 transition-colors'
          >
            Sign In
          </Link>
          <Link
            to='/register'
            className='flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-[#0B0F14] bg-[#4F8CFF] hover:bg-[#689DFF] rounded-full shadow-sm shadow-[#4F8CFF]/30 transition-transform hover:scale-[1.02] active:scale-[0.98]'
          >
            <span>Get Started</span>
            <ArrowRight className='w-3.5 h-3.5' />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className='flex md:hidden items-center gap-2'>
          <button
            type='button'
            onClick={onOpenDemo}
            className='px-2.5 py-1 text-[11px] font-medium text-[#E8EEF5] bg-[#121820] border border-[#222B36] rounded-full'
          >
            Demo
          </button>
          <button
            type='button'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='p-1.5 text-[#8A98A8] hover:text-[#E8EEF5] rounded-md focus:outline-none'
            aria-label='Toggle Menu'
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Slide-in Drawer */}
      {mobileMenuOpen && (
        <div className='md:hidden px-4 pt-3 pb-6 bg-[#0B0F14]/95 backdrop-blur-xl border-b border-[#222B36] space-y-3 animate-fadeIn'>
          <div className='flex flex-col gap-1.5'>
            {navLinks.map((link) => (
              <button
                key={link.id}
                type='button'
                onClick={() => handleNavClick(link.id)}
                className='text-left px-3 py-2 text-sm text-[#8A98A8] hover:text-[#E8EEF5] hover:bg-[#121820] rounded-lg'
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className='pt-3 border-t border-[#222B36] flex flex-col gap-2'>
            <button
              type='button'
              onClick={() => { setMobileMenuOpen(false); onOpenDemo(); }}
              className='w-full py-2 text-center text-xs font-medium text-[#E8EEF5] bg-[#121820] border border-[#222B36] rounded-lg'
            >
              Open Interactive Demo
            </button>
            <Link
              to='/register'
              onClick={() => setMobileMenuOpen(false)}
              className='w-full py-2 text-center text-xs font-semibold text-[#0B0F14] bg-[#4F8CFF] rounded-lg'
            >
              Create Business Account
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

