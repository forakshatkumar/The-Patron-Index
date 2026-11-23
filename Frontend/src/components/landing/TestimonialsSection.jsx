import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

export default function TestimonialsSection () {
  const reviews = [
    {
      id: 1,
      quote: 'The Patron Index has completely changed the way I understand my customers. Super easy to use!',
      name: 'Priya Sharma',
      role: 'Retail Store Owner',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      initials: 'PS',
      color: '#0B2545'
    },
    {
      id: 2,
      quote: 'Simple, powerful and insightful. A must-have for any small business looking to improve retention.',
      name: 'Rohit Mehta',
      role: 'Shop Owner',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      initials: 'RM',
      color: '#0066FF'
    },
    {
      id: 3,
      quote: 'Finally, a platform that makes customer analytics simple! No spreadsheets, just clear decisions.',
      name: 'Sneha Verma',
      role: 'Business Owner',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      initials: 'SV',
      color: '#0B2545'
    }
  ]

  const [imgErrors, setImgErrors] = useState({})

  const handleImgError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }))
  }

  return (
    <section id='reviews' className='py-20 md:py-28 bg-white border-b border-slate-100 relative'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className='text-center max-w-2xl mx-auto mb-16'
        >
          <span className='text-xs font-bold tracking-wider uppercase text-[#0066FF] flex items-center justify-center gap-2 mb-2.5'>
            <span className='w-6 h-0.5 bg-[#0066FF]' />
            <span>What Our Users Say</span>
            <span className='w-6 h-0.5 bg-[#0066FF]' />
          </span>
          <h2 className='text-3xl sm:text-4xl lg:text-[40px] font-black text-[#0B2545] tracking-tight font-display leading-tight'>
            Loved by Retailers & Business Owners
          </h2>
          <p className='text-slate-600 text-sm sm:text-base mt-3'>
            Real feedback from shop owners who transformed their raw sales logs into repeat customers.
          </p>
        </motion.div>

        {/* 3 Review Cards Horizontal Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8'>
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className='p-6 sm:p-7 rounded-2xl bg-[#F8FAFD] border border-slate-100/90 flex flex-col justify-between hover:border-slate-200/90 shadow-2xs hover:shadow-xs transition-all'
            >
              <div>
                {/* Quote Icon in circular badge */}
                <div className='w-8 h-8 rounded-full bg-[#EEF4FC] text-[#0066FF] flex items-center justify-center mb-5'>
                  <Quote className='w-4 h-4 fill-[#0066FF]' />
                </div>

                <p className='text-sm sm:text-base text-slate-700 leading-relaxed font-medium italic mb-6'>
                  &ldquo;{rev.quote}&rdquo;
                </p>
              </div>

              {/* Author & Star Rating Footer */}
              <div className='flex items-center gap-3 pt-4 border-t border-slate-200/60'>
                {!imgErrors[rev.id] ? (
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    onError={() => handleImgError(rev.id)}
                    className='w-11 h-11 rounded-full object-cover border-2 border-white shadow-2xs'
                  />
                ) : (
                  <div
                    className='w-11 h-11 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-2xs'
                    style={{ backgroundColor: rev.color }}
                  >
                    {rev.initials}
                  </div>
                )}

                <div className='flex flex-col'>
                  <strong className='text-sm font-bold text-[#0B2545] font-display leading-tight'>
                    {rev.name}
                  </strong>
                  <span className='text-xs text-slate-500 mb-1 leading-tight'>
                    {rev.role}
                  </span>
                  <div className='flex items-center gap-0.5 text-amber-400'>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className='w-3.5 h-3.5 fill-amber-400 text-amber-400' />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
