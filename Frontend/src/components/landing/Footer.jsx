import logoImg from '../../assets/logo.png'

export default function Footer () {
  const currentYear = new Date().getFullYear()

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'About', href: '#about' },
    { label: 'Reviews', href: '#reviews' }
  ]

  const handleNavClick = (href) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className='bg-white pt-10 pb-8 text-slate-600 border-t border-slate-100'>
      <div className='max-w-[1160px] mx-auto px-4 sm:px-6'>
        
        {/* Main Footer Row */}
        <div className='flex flex-col md:flex-row items-center justify-between gap-6 pb-8'>
          
          {/* Brand Logo, Name & Tagline */}
          <div className='flex items-center gap-2.5'>
            <div className='w-7 h-7 flex items-center justify-center flex-shrink-0'>
              <img src={logoImg} alt='The Patron Index' className='h-full w-full object-contain' />
            </div>
            <div>
              <div className='text-sm sm:text-base font-bold text-[#0B2545] font-display leading-tight'>
                The Patron Index
              </div>
              <div className='text-[10px] text-slate-400 font-medium'>
                Where Buyers Become Insight
              </div>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className='flex items-center gap-8 text-xs font-medium text-slate-600'>
            {navLinks.map((link) => (
              <button
                key={link.label}
                type='button'
                onClick={() => handleNavClick(link.href)}
                className='hover:text-[#0066FF] transition-colors cursor-pointer'
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Social Icons */}
          <div className='flex items-center gap-3'>
            <a
              href='https://linkedin.com'
              target='_blank'
              rel='noreferrer'
              aria-label='LinkedIn'
              className='w-7 h-7 rounded-full bg-[#EBF3FE] text-[#0066FF] hover:bg-[#0066FF] hover:text-white flex items-center justify-center transition-colors'
            >
              <svg className='w-3.5 h-3.5 fill-current' viewBox='0 0 24 24'>
                <path d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z' />
              </svg>
            </a>
            <a
              href='https://twitter.com'
              target='_blank'
              rel='noreferrer'
              aria-label='Twitter'
              className='w-7 h-7 rounded-full bg-[#EBF3FE] text-[#0066FF] hover:bg-[#0066FF] hover:text-white flex items-center justify-center transition-colors'
            >
              <svg className='w-3.5 h-3.5 fill-current' viewBox='0 0 24 24'>
                <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
              </svg>
            </a>
            <a
              href='https://github.com'
              target='_blank'
              rel='noreferrer'
              aria-label='GitHub'
              className='w-7 h-7 rounded-full bg-[#EBF3FE] text-[#0B2545] hover:bg-[#0B2545] hover:text-white flex items-center justify-center transition-colors'
            >
              <svg className='w-3.5 h-3.5 fill-current' viewBox='0 0 24 24'>
                <path fillRule='evenodd' clipRule='evenodd' d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Centered Copyright */}
        <div className='pt-6 border-t border-slate-100 text-center text-xs text-slate-400'>
          &copy; {currentYear} The Patron Index. All rights reserved.
        </div>

      </div>
    </footer>
  )
}
