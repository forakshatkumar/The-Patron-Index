import { motion } from 'framer-motion'
import { Users, Star, BarChart3, Zap } from 'lucide-react'

export default function PowerfulFeaturesSection () {
  const features = [
    {
      id: 'segmentation',
      icon: Users,
      title: 'Customer Segmentation',
      desc: 'Classify customers into meaningful segments'
    },
    {
      id: 'score',
      icon: Star,
      title: 'Patron Index Score',
      desc: 'Measure customer value with confidence'
    },
    {
      id: 'dashboard',
      icon: BarChart3,
      title: 'Interactive Dashboard',
      desc: 'Visualize trends and key insights'
    },
    {
      id: 'recommendations',
      icon: Zap,
      title: 'AI-Powered Recommendations',
      desc: 'Get personalized suggestions to boost your business'
    }
  ]

  return (
    <section id='features' className='py-16 md:py-24 bg-white relative'>
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
          <div className='flex items-center justify-center gap-3 text-xs font-semibold text-slate-400 mb-2'>
            <span className='inline-block w-8 h-[1px] bg-slate-300' />
            <span className='text-slate-600 font-bold'>Powerful Features</span>
            <span className='inline-block w-8 h-[1px] bg-slate-300' />
          </div>

          <p className='text-xs sm:text-sm text-slate-500 font-medium'>
            Everything you need to understand and grow your customer base
          </p>
        </motion.div>

        {/* 4 Cards in Horizontal Row */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6'>
          {features.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className='p-6 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(11,37,69,0.04)] hover:shadow-[0_8px_30px_rgba(11,37,69,0.08)] hover:border-[#0066FF]/30 transition-all flex flex-col items-center text-center'
              >
                <div className='w-11 h-11 rounded-xl flex items-center justify-center mb-4 text-[#0066FF]'>
                  <Icon className='w-6 h-6 stroke-[2.2]' />
                </div>

                <h3 className='text-sm sm:text-base font-bold text-[#0B2545] font-display mb-1.5 leading-snug'>
                  {feat.title}
                </h3>

                <p className='text-xs text-slate-500 leading-relaxed max-w-[200px]'>
                  {feat.desc}
                </p>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
