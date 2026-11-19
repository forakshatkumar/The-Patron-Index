import { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import logoImg from '../../assets/logo.png'

export default function FinalCtaSection ({ onOpenDemo, onOpenPolicy }) {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    setIsSubmitted(true)
  }

  return (
    <section className='relative py-28 px-4 sm:px-6 lg:px-8 border-t border-[#222B36] bg-[#0B0F14] overflow-hidden'>
      <div className='max-w-4xl mx-auto text-center'>
        {/* Converging Logo Mark Terminal */}
        <div className='inline-flex p-3 rounded-2xl bg-[#121820] border border-[#222B36] mb-8 shadow-xl shadow-[#4F8CFF]/10 animate-pulse'>
          <img src={logoImg} alt='The Patron Index' className='w-12 h-12 object-contain' />
        </div>

        <h2 className='text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#E8EEF5] tracking-tight font-display mb-6 leading-tight'>
          Your business already has the data.
        </h2>

        <p className='text-base sm:text-lg text-[#8A98A8] max-w-2xl mx-auto mb-10 leading-relaxed'>
          Stop letting transaction spreadsheets collect dust. Upload a CSV now to discover your highest value patrons and stop customer churn before it happens.
        </p>

        {/* Email Capture / Get Started with tasteful non-confetti success state */}
        <div className='max-w-md mx-auto mb-12'>
          {isSubmitted ? (
            <div className='p-4 bg-[#121820] border border-[#3DD6A0] rounded-2xl flex items-center justify-center gap-2.5 text-[#3DD6A0] text-sm font-semibold animate-fadeIn'>
              <CheckCircle2 className='w-5 h-5 flex-shrink-0' />
              <span>Invite link prepared for {email}. Ready for onboarding.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='flex items-center gap-2 bg-[#121820] border border-[#222B36] p-1.5 rounded-full shadow-lg'>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your business email...'
                className='flex-1 pl-4 pr-2 py-2 text-xs bg-transparent text-[#E8EEF5] placeholder-[#8A98A8] outline-none'
              />
              <button
                type='submit'
                className='px-5 py-2.5 rounded-full text-xs font-bold text-[#0B0F14] bg-[#4F8CFF] hover:bg-[#689DFF] flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95'
              >
                <span>Get Started</span>
                <ArrowRight className='w-3.5 h-3.5' />
              </button>
            </form>
          )}
        </div>

        <div className='flex items-center justify-center gap-4 text-xs text-[#8A98A8] font-mono mb-16'>
          <span>• No credit card required</span>
          <span>• Zero data lock-in</span>
          <span>• Instant live demo</span>
        </div>

        {/* Footer with clean links & legal policies */}
        <footer className='pt-12 border-t border-[#222B36]/80 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A98A8] gap-4'>
          <div className='flex items-center gap-2'>
            <span className='font-bold text-[#E8EEF5]'>The Patron Index</span>
            <span>&copy; {new Date().getFullYear()} Customer Intelligence Platform.</span>
          </div>

          <div className='flex flex-wrap items-center gap-4'>
            <button
              type='button'
              onClick={() => onOpenPolicy('privacy')}
              className='hover:text-[#E8EEF5] transition-colors'
            >
              Privacy Policy
            </button>
            <button
              type='button'
              onClick={() => onOpenPolicy('terms')}
              className='hover:text-[#E8EEF5] transition-colors'
            >
              Terms of Service
            </button>
            <button
              type='button'
              onClick={() => onOpenPolicy('cookies')}
              className='hover:text-[#E8EEF5] transition-colors'
            >
              Cookie Preferences
            </button>
            <button
              type='button'
              onClick={() => onOpenPolicy('deletion')}
              className='hover:text-[#E8EEF5] transition-colors'
            >
              Data Deletion
            </button>
            <button
              type='button'
              onClick={onOpenDemo}
              className='text-[#4F8CFF] hover:underline font-semibold'
            >
              Live Demo
            </button>
          </div>
        </footer>
      </div>
    </section>
  )
}

