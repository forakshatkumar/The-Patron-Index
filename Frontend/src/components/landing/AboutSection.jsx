import { motion } from 'framer-motion'
import { UploadCloud, BarChart2, Lightbulb } from 'lucide-react'
import laptopPhoto from '../../assets/laptop-dashboard.jpg'

export default function AboutSection () {
  const points = [
    {
      icon: UploadCloud,
      text: 'Upload your CSV data in seconds'
    },
    {
      icon: BarChart2,
      text: 'Get detailed insights and customer segments'
    },
    {
      icon: Lightbulb,
      text: 'Make smarter business decisions'
    }
  ]

  return (
    <section id='about' className='py-16 md:py-24 bg-white relative overflow-hidden'>
      <div className='max-w-[1160px] mx-auto px-4 sm:px-6'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center'>
          
          {/* LEFT PART: Eyebrow, Heading, Paragraph, Know More CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className='lg:col-span-5 space-y-4 sm:space-y-5'
          >
            {/* Eyebrow with line */}
            <div className='flex items-center gap-2 text-xs font-semibold text-slate-500'>
              <span>About The Patron Index</span>
              <span className='inline-block w-8 h-[1.5px] bg-slate-300' />
            </div>

            {/* Title */}
            <h2 className='text-3xl sm:text-4xl font-extrabold text-[#0B2545] tracking-tight font-display leading-[1.15]'>
              Understand your customers. <br className='hidden sm:block' />Grow your business.
            </h2>

            {/* Paragraph */}
            <p className='text-slate-600 text-xs sm:text-sm leading-relaxed max-w-md'>
              The Patron Index helps you analyse your customer behaviour, identify valuable segments, and make data-driven decisions — all in a simple, secure and affordable platform.
            </p>
          </motion.div>

          {/* MIDDLE PART: 3 Stacked Items with Soft Blue Circular Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='lg:col-span-3 space-y-6 sm:space-y-7'
          >
            {points.map((pt, i) => {
              const Icon = pt.icon
              return (
                <div key={i} className='flex items-center gap-3.5'>
                  <div className='w-10 h-10 rounded-full bg-[#EBF3FE] text-[#0066FF] flex items-center justify-center flex-shrink-0 shadow-2xs'>
                    <Icon className='w-5 h-5' />
                  </div>
                  <span className='text-xs sm:text-[13px] font-semibold text-[#0B2545] leading-snug'>
                    {pt.text}
                  </span>
                </div>
              )
            })}
          </motion.div>

          {/* RIGHT PART: Laptop Photo on Desk */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='lg:col-span-4'
          >
            <div className='relative rounded-2xl overflow-hidden shadow-[0_12px_36px_rgba(11,37,69,0.12)] border border-slate-100 bg-slate-50'>
              <img
                src={laptopPhoto}
                alt='The Patron Index Analytics Dashboard'
                className='w-full h-auto object-cover transform hover:scale-102 transition-transform duration-500'
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
