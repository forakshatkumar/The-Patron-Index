import { useState } from 'react'
import { Users, Star, BarChart3, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function PowerfulFeaturesSection ({ onOpenDemo }) {
  const [activeFeature, setActiveFeature] = useState('segments')

  const features = [
    {
      id: 'segments',
      icon: Users,
      title: 'Customer Segmentation',
      desc: 'Classify customers into meaningful segments',
      tag: 'Automatic 7 Segments',
      points: [
        'Separates VIP, Loyal, Regular, New, Occasional, At-Risk and Inactive patrons.',
        'Prevents churn by pinpointing customers whose visit intervals are widening.',
        'Deterministic calculations with zero arbitrary guesswork.'
      ]
    },
    {
      id: 'score',
      icon: Star,
      title: 'Patron Index Score',
      desc: 'Measure customer value with confidence',
      tag: '0–100 Explainable Score',
      points: [
        'Composite metric combining Recency (30%), Frequency (25%), Spend (25%) & Loyalty (20%).',
        'Transparent formula with direct visual breakdown for every customer.',
        'Identifies high-potential buyers who are ready to become VIPs.'
      ]
    },
    {
      id: 'dashboard',
      icon: BarChart3,
      title: 'Interactive Dashboard',
      desc: 'Visualize trends and key insights',
      tag: 'Real-Time Telemetry',
      points: [
        'Instant tracking of customer retention, month-over-month revenue, and order velocity.',
        'Filter by segment or date range with fast instant search.',
        'Export reports with zero data lock-in at any time.'
      ]
    },
    {
      id: 'ai',
      icon: Zap,
      title: 'AI-Powered Recommendations',
      desc: 'Get personalized suggestions to boost your business',
      tag: 'Grounded Intelligence',
      points: [
        'AI strictly explains calculations and suggests actionable business steps.',
        'Never hallucinates or invents revenue numbers.',
        'Clear distinction between verified numerical facts and suggested actions.'
      ]
    }
  ]

  const current = features.find((f) => f.id === activeFeature) || features[0]
  const CurrentIcon = current.icon

  return (
    <section id='features' className='py-20 md:py-28 bg-[#F8FAFD] border-b border-slate-100 relative'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* Header */}
        <div className='text-center max-w-3xl mx-auto mb-16'>
          <span className='text-xs font-bold tracking-wider uppercase text-[#0066FF] flex items-center justify-center gap-2 mb-2'>
            <span className='w-6 h-0.5 bg-[#0066FF]' />
            <span>Powerful Features</span>
            <span className='w-6 h-0.5 bg-[#0066FF]' />
          </span>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B2545] tracking-tight font-display'>
            Everything you need to understand and grow your customer base
          </h2>
          <p className='text-slate-600 text-sm sm:text-base mt-3 max-w-xl mx-auto'>
            Built specifically for independent retailers and small business owners who want clarity, not complexity.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
          {features.map((feat) => {
            const Icon = feat.icon
            const isSelected = activeFeature === feat.id

            return (
              <div
                key={feat.id}
                onClick={() => setActiveFeature(feat.id)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#0066FF] shadow-[0_12px_36px_rgba(0,102,255,0.08)] -translate-y-1 ring-2 ring-[#0066FF]/20'
                    : 'bg-white border-slate-100 hover:border-slate-200 shadow-2xs hover:shadow-xs'
                }`}
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform ${
                      isSelected
                        ? 'bg-[#0066FF] text-white shadow-sm'
                        : 'bg-[#EEF4FC] text-[#0066FF]'
                    }`}
                  >
                    <Icon className='w-6 h-6' />
                  </div>

                  <h3 className='text-base font-bold text-[#0B2545] font-display mb-1.5'>
                    {feat.title}
                  </h3>
                  <p className='text-xs text-slate-500 leading-relaxed mb-4'>
                    {feat.desc}
                  </p>
                </div>

                <div className='pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold'>
                  <span className='text-[10px] text-slate-400 font-mono'>{feat.tag}</span>
                  <span className={isSelected ? 'text-[#0066FF]' : 'text-slate-400'}>
                    {isSelected ? 'Viewing' : 'Explore →'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Dynamic Detail Spotlight Box */}
        <div className='p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-8 animate-fadeIn'>
          <div className='space-y-4 max-w-2xl'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-full bg-[#EEF4FC] text-[#0066FF] flex items-center justify-center flex-shrink-0'>
                <CurrentIcon className='w-5 h-5' />
              </div>
              <div>
                <span className='text-[10px] font-mono uppercase font-bold text-[#0066FF]'>
                  Feature Focus // {current.tag}
                </span>
                <h4 className='text-lg font-bold text-[#0B2545] font-display'>
                  {current.title}
                </h4>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2'>
              {current.points.map((pt, idx) => (
                <div key={idx} className='flex items-start gap-2.5 text-xs text-slate-600'>
                  <CheckCircle2 className='w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5' />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto'>
            <button
              type='button'
              onClick={onOpenDemo}
              className='w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold text-white bg-[#0B2545] hover:bg-[#0066FF] transition-all flex items-center justify-center gap-2 shadow-xs'
            >
              <span>Test Interactive Feature</span>
              <ArrowRight className='w-4 h-4' />
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
