import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function PreFooterBanner () {
  return (
    <section className='py-12 sm:py-16 bg-white'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className='relative rounded-3xl bg-[#0B2545] p-8 sm:p-12 md:p-14 overflow-hidden text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8'
        >
          {/* Subtle curved overlay circles */}
          <div className='absolute -right-20 -bottom-20 w-80 h-80 rounded-full border border-white/10 pointer-events-none' />
          <div className='absolute -right-10 -bottom-10 w-96 h-96 rounded-full border border-white/5 pointer-events-none' />
          <div className='absolute -left-12 -top-12 w-64 h-64 rounded-full bg-[#0066FF]/10 blur-2xl pointer-events-none' />

          {/* Text Content */}
          <div className='relative z-10 max-w-xl text-center md:text-left'>
            <h2 className='text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-white mb-2 leading-tight'>
              Ready to unlock the power of your customer data?
            </h2>
            <p className='text-slate-300 text-sm sm:text-base leading-relaxed'>
              Join The Patron Index today and turn your data into growth.
            </p>
          </div>

          {/* Action Button */}
          <div className='relative z-10 flex-shrink-0'>
            <Link
              to='/register'
              className='inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-[#0B2545] bg-white hover:bg-slate-100 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-103 active:scale-97'
            >
              <span>Sign Up Free</span>
              <ArrowRight className='w-4 h-4 text-[#0B2545]' />
            </Link>
          </div>

        </motion.div>
      </div>
    </section>
  )
}
