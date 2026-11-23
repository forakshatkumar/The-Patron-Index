import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function TestimonialsSection () {
  const reviews = [
    {
      id: 1,
      quote: '“The Patron Index has completely changed the way I understand my customers. Super easy to use!”',
      name: 'Priya Sharma',
      role: 'Retail Store Owner',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      initials: 'PS',
      color: '#0B2545'
    },
    {
      id: 2,
      quote: '“Simple, powerful and insightful. A must-have for any small business.”',
      name: 'Rohit Mehta',
      role: 'Shop Owner',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      initials: 'RM',
      color: '#0066FF'
    },
    {
      id: 3,
      quote: '“Finally, a platform that makes customer analytics simple!”',
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
    <section id='reviews' className='py-16 md:py-24 bg-white relative'>
      <div className='max-w-[1160px] mx-auto px-4 sm:px-6'>
        
        {/* Centered Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className='text-center max-w-2xl mx-auto mb-12 sm:mb-14'
        >
          {/* Eyebrow with flanking lines */}
          <div className='flex items-center justify-center gap-3 text-xs font-semibold text-slate-400'>
            <span className='inline-block w-8 h-[1px] bg-slate-300' />
            <span className='text-slate-600 font-bold'>What Our Users Say</span>
            <span className='inline-block w-8 h-[1px] bg-slate-300' />
          </div>
        </motion.div>

        {/* 3 Review Cards in Horizontal Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-6'>
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className='p-6 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(11,37,69,0.04)] hover:shadow-[0_8px_30px_rgba(11,37,69,0.08)] transition-all flex flex-col justify-between'
            >
              <div>
                {/* Circular Quote Mark Badge */}
                <div className='w-7 h-7 rounded-full bg-[#EBF3FE] text-[#0066FF] flex items-center justify-center font-serif text-lg font-bold leading-none mb-4 select-none'>
                  “
                </div>

                {/* Quote Text */}
                <p className='text-xs sm:text-[13px] text-slate-600 leading-relaxed font-normal mb-6'>
                  {rev.quote}
                </p>
              </div>

              {/* Author Info & Star Rating */}
              <div className='flex items-center gap-3 pt-3 border-t border-slate-100'>
                {!imgErrors[rev.id] ? (
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    onError={() => handleImgError(rev.id)}
                    className='w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs'
                  />
                ) : (
                  <div
                    className='w-10 h-10 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-2xs'
                    style={{ backgroundColor: rev.color }}
                  >
                    {rev.initials}
                  </div>
                )}

                <div className='flex flex-col'>
                  <strong className='text-xs sm:text-sm font-bold text-[#0B2545] font-display leading-tight'>
                    {rev.name}
                  </strong>
                  <span className='text-[11px] text-slate-400 mb-1 leading-tight'>
                    {rev.role}
                  </span>
                  <div className='flex items-center gap-0.5 text-amber-400'>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className='w-3 h-3 fill-amber-400 text-amber-400' />
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
