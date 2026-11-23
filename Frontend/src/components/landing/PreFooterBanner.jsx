import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function PreFooterBanner () {
  return (
    <section className='py-12 sm:py-16 bg-white'>
      <div className='max-w-[1160px] mx-auto px-4 sm:px-6'>
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 16 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className='relative rounded-2xl bg-[#0B2545] px-8 py-9 sm:px-12 sm:py-10 overflow-hidden text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6'
        >
          {/* Concentric curved line rings on the left edge */}
          <div className='absolute -left-16 -top-24 w-80 h-80 rounded-full border border-white/10 pointer-events-none' />
          <div className='absolute -left-10 -top-16 w-80 h-80 rounded-full border border-white/10 pointer-events-none' />
          <div className='absolute -left-4 -top-8 w-80 h-80 rounded-full border border-white/15 pointer-events-none' />

          {/* Text Content */}
          <div className='relative z-10 text-center md:text-left space-y-1.5'>
            <h2 className='text-xl sm:text-2xl font-bold font-display tracking-tight text-white'>
              Ready to unlock the power of your customer data?
            </h2>
            <p className='text-slate-300 text-xs sm:text-sm font-normal'>
              Join The Patron Index today and turn your data into growth.
            </p>
          </div>

          {/* White Pill Action Button */}
          <div className='relative z-10 flex-shrink-0'>
            <Link
              to='/register'
              className='inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-[#0B2545] bg-white hover:bg-slate-100 transition-all duration-200 shadow-sm hover:shadow hover:scale-102 active:scale-98'
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
