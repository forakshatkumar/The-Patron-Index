import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Star, BarChart3, Zap, ArrowRight, CheckCircle2, Sliders, Shield } from 'lucide-react'

export default function PowerfulFeaturesSection ({ onOpenDemo }) {
  const [activeFeature, setActiveFeature] = useState('segments')
  const [interactiveScore, setInteractiveScore] = useState(82)

  const features = [
    {
      id: 'segments',
      icon: Users,
      title: 'Customer Segmentation',
      desc: 'Classify customers into meaningful segments',
      tag: '7 Behavioral Classes',
      summary: 'Separates VIP, Loyal, Regular, New, Occasional, At-Risk, and Inactive patrons with deterministic RFM logic.',
      bullets: [
        'Pinpoint customers whose visit frequency is quietly slipping away.',
        'Isolate top 10% VIP patrons driving 40%+ of business revenue.',
        'Zero subjective guesswork: every customer classification is fully explainable.'
      ]
    },
    {
      id: 'score',
      icon: Star,
      title: 'Patron Index Score',
      desc: 'Measure customer value with confidence',
      tag: '0–100 Weighted Index',
      summary: 'Composite metric combining Recency (30%), Frequency (25%), Monetary Spend (25%), and Loyalty Cadence (20%).',
      bullets: [
        'Normalized 0 to 100 benchmark readable by anyone without statistics training.',
        'Reveals rising stars who are ready for tier elevation.',
        'Alerts you instantly when high-value patrons cross into risk thresholds.'
      ]
    },
    {
      id: 'dashboard',
      icon: BarChart3,
      title: 'Interactive Dashboard',
      desc: 'Visualize trends and key insights',
      tag: 'Real-Time Telemetry',
      summary: 'Clean, clutter-free telemetry tracking your business health, retention rate, and customer cohort velocity.',
      bullets: [
        'Instant multi-parameter customer search and drill-down views.',
        'Exportable CSV and PDF reports with zero vendor data lock-in.',
        'Multi-tenant complete database isolation per business workspace.'
      ]
    },
    {
      id: 'ai',
      icon: Zap,
      title: 'AI-Powered Recommendations',
      desc: 'Get personalized suggestions to boost your business',
      tag: 'Grounded Action Steps',
      summary: 'Grounded intelligence pairing verified numerical facts with concrete, immediate business actions.',
      bullets: [
        'Mathematical separation between observed facts and suggested tactics.',
        'AI explains insights without ever hallucinating or inventing numbers.',
        'Actionable outreach playbooks tailored to your specific trade.'
      ]
    }
  ]

  const current = features.find((f) => f.id === activeFeature) || features[0]
  const CurrentIcon = current.icon

  return (
    <section id='features' className='py-20 md:py-28 bg-[#F7F9FC] border-b border-[#E5EBF3] relative'>
      <div className='patron-container'>
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className='text-center max-w-3xl mx-auto mb-14 sm:mb-16'
        >
          <span className='text-xs font-bold tracking-wider uppercase text-[#0866F5] flex items-center justify-center gap-2 mb-2.5 font-mono'>
            <span className='w-6 h-0.5 bg-[#0866F5]' />
            <span>POWERFUL FEATURES</span>
            <span className='w-6 h-0.5 bg-[#0866F5]' />
          </span>
          <h2 className='section-title-clamp font-black text-[#0B2345] font-display leading-tight'>
            Everything you need to understand and grow your customer base
          </h2>
          <p className='text-[#344563] text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed'>
            Built for retailers, independent shop owners, and sellers who want immediate clarity without data complexity.
          </p>
        </motion.div>

        {/* 4 Feature Cards Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
          {features.map((feat, idx) => {
            const Icon = feat.icon
            const isSelected = activeFeature === feat.id

            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                onClick={() => setActiveFeature(feat.id)}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-full ${
                  isSelected
                    ? 'bg-white border-[#0866F5] shadow-[0_12px_36px_rgba(8,102,245,0.08)] ring-2 ring-[#0866F5]/20'
                    : 'bg-white border-[#E5EBF3] hover:border-slate-300 shadow-2xs hover:shadow-xs'
                }`}
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4.5 transition-colors ${
                      isSelected
                        ? 'bg-[#0866F5] text-white shadow-xs'
                        : 'bg-[#EFF5FF] text-[#0866F5]'
                    }`}
                  >
                    <Icon className='w-6 h-6' />
                  </div>

                  <h3 className='text-base font-bold text-[#0B2345] font-display mb-1.5 leading-snug'>
                    {feat.title}
                  </h3>
                  <p className='text-xs text-[#8190A5] leading-relaxed mb-4'>
                    {feat.desc}
                  </p>
                </div>

                <div className='pt-3 border-t border-[#E5EBF3] flex items-center justify-between text-xs font-semibold'>
                  <span className='text-[10px] text-[#8190A5] font-mono'>{feat.tag}</span>
                  <span className={isSelected ? 'text-[#0866F5]' : 'text-[#8190A5]'}>
                    {isSelected ? 'Active' : 'Inspect →'}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Dynamic Detail & Interactive Showcase Box */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className='p-6 sm:p-8 rounded-2xl bg-white border border-[#E5EBF3] shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-8'
          >
            {/* Feature bullets */}
            <div className='space-y-4 max-w-2xl'>
              <div className='flex items-center gap-3'>
                <div className='w-11 h-11 rounded-xl bg-[#EFF5FF] text-[#0866F5] flex items-center justify-center flex-shrink-0'>
                  <CurrentIcon className='w-5 h-5' />
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <span className='text-[10px] font-mono uppercase font-bold text-[#0866F5] bg-[#EFF5FF] px-2 py-0.5 rounded'>
                      {current.tag}
                    </span>
                  </div>
                  <h4 className='text-lg sm:text-xl font-bold text-[#0B2345] font-display mt-0.5'>
                    {current.title}
                  </h4>
                </div>
              </div>

              <p className='text-xs sm:text-sm text-[#344563] leading-relaxed'>
                {current.summary}
              </p>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1'>
                {current.bullets.map((pt, idx) => (
                  <div key={idx} className='flex items-start gap-2 text-xs text-[#344563]'>
                    <CheckCircle2 className='w-4 h-4 text-[#00B884] flex-shrink-0 mt-0.5' />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Widget on Right */}
            <div className='w-full lg:w-72 bg-[#F7F9FC] border border-[#E5EBF3] rounded-xl p-4 flex flex-col justify-between flex-shrink-0'>
              {current.id === 'score' ? (
                <div className='space-y-3 text-center'>
                  <div className='flex items-center justify-between text-xs text-[#8190A5] font-semibold'>
                    <span className='flex items-center gap-1 text-[#344563]'>
                      <Sliders className='w-3.5 h-3.5 text-[#0866F5]' />
                      <span>Live Score Dial</span>
                    </span>
                    <span className='text-[#00B884] font-bold font-mono'>{interactiveScore}/100</span>
                  </div>

                  <div className='relative w-24 h-24 mx-auto flex items-center justify-center'>
                    <svg className='w-full h-full -rotate-90' viewBox='0 0 100 100'>
                      <circle cx='50' cy='50' r='40' fill='none' stroke='#E5EBF3' strokeWidth='8' />
                      <circle
                        cx='50'
                        cy='50'
                        r='40'
                        fill='none'
                        stroke='#0866F5'
                        strokeWidth='8'
                        strokeDasharray={`${(interactiveScore / 100) * 251} 251`}
                        strokeLinecap='round'
                        className='transition-all duration-300'
                      />
                    </svg>
                    <div className='absolute flex flex-col items-center'>
                      <span className='text-xl font-black text-[#0B2345] font-mono leading-none'>
                        {interactiveScore}
                      </span>
                      <span className='text-[9px] font-bold text-[#0866F5] uppercase mt-0.5'>
                        {interactiveScore >= 80 ? 'VIP Patron' : 'Regular'}
                      </span>
                    </div>
                  </div>

                  <input
                    type='range'
                    min='30'
                    max='100'
                    value={interactiveScore}
                    onChange={(e) => setInteractiveScore(Number(e.target.value))}
                    className='w-full accent-[#0866F5] cursor-pointer'
                  />
                  <span className='text-[10px] text-[#8190A5] block'>Drag slider to test RFM score</span>
                </div>
              ) : (
                <div className='space-y-3 text-center py-2'>
                  <Shield className='w-8 h-8 text-[#0866F5] mx-auto' />
                  <div className='text-xs font-bold text-[#0B2345]'>Ready to test live?</div>
                  <p className='text-[11px] text-[#8190A5] leading-tight'>
                    Open the fully populated interactive demo sandbox with sample transactions.
                  </p>
                  <button
                    type='button'
                    onClick={onOpenDemo}
                    className='w-full py-2.5 rounded-full text-xs font-bold text-white bg-[#0B2345] hover:bg-[#0866F5] transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer'
                  >
                    <span>Launch Sandbox</span>
                    <ArrowRight className='w-3 h-3' />
                  </button>
                </div>
              )}
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
