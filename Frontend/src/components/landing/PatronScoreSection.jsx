import { useState } from 'react'
import { Activity, Sliders, AlertCircle } from 'lucide-react'

export default function PatronScoreSection () {
  const [recencyDays, setRecencyDays] = useState(14)
  const [frequencyOrders, setFrequencyOrders] = useState(12)
  const [monetarySpend, setMonetarySpend] = useState(38000)
  const [loyaltyFactor, setLoyaltyFactor] = useState(85)

  // Deterministic normalized calculation 0-100
  const rScore = Math.max(0, Math.min(25, 25 - (recencyDays / 180) * 25))
  const fScore = Math.min(25, (frequencyOrders / 25) * 25)
  const mScore = Math.min(30, (monetarySpend / 50000) * 30)
  const lScore = Math.min(20, (loyaltyFactor / 100) * 20)

  const totalScore = Math.round(rScore + fScore + mScore + lScore)
  const clampedScore = Math.max(0, Math.min(100, totalScore))

  // Color shifting by score band
  let bandColor = 'var(--regular)' // default
  let bandName = 'Regular Customer (Consistent Cadence)'
  if (clampedScore >= 85) {
    bandColor = 'var(--vip)'
    bandName = 'VIP Customer (High Value & Strong Engagement)'
  } else if (clampedScore >= 70) {
    bandColor = 'var(--loyal)'
    bandName = 'Loyal Customer (Frequent Repeat Buyer)'
  } else if (recencyDays > 90) {
    bandColor = 'var(--at-risk)'
    bandName = 'At-Risk Customer (Purchase Gap Exceeded)'
  } else if (clampedScore < 40) {
    bandColor = 'var(--inactive)'
    bandName = 'Inactive or Occasional Buyer'
  }

  // Deterministic template explainer sentence (no LLM, purely deterministic)
  const generateExplainer = () => {
    const parts = []
    if (recencyDays <= 30) {
      parts.push(`Recent purchase (${recencyDays}d ago) gives strong recency (+${Math.round(rScore)} pts)`)
    } else {
      parts.push(`Extended gap since last order (${recencyDays}d) lowers recency (+${Math.round(rScore)} pts)`)
    }

    if (frequencyOrders >= 10) {
      parts.push(`High order volume (${frequencyOrders} orders) contributes +${Math.round(fScore)} pts`)
    } else {
      parts.push(`Modest order frequency (${frequencyOrders} orders) adds +${Math.round(fScore)} pts`)
    }

    if (monetarySpend >= 30000) {
      parts.push(`Significant lifetime spend (₹${monetarySpend.toLocaleString()}) earns top monetary weight (+${Math.round(mScore)} pts)`)
    }

    return parts.join('. ') + '.'
  }

  // SVG Dial parameters
  const radius = 64
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference

  return (
    <section id='score-engine' className='py-28 px-4 sm:px-6 lg:px-8 border-t border-[#222B36] bg-[#0B0F14]/90'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center max-w-2xl mx-auto mb-16'>
          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#3DD6A0]/15 text-[#3DD6A0] border border-[#3DD6A0]/30 mb-4'>
            <Activity className='w-3.5 h-3.5' />
            <span>PRD Section 5.5 // Patron Index Score</span>
          </span>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#E8EEF5] tracking-tight font-display mb-4'>
            The Patron Index Score: Interactive Engine
          </h2>
          <p className='text-sm sm:text-base text-[#8A98A8] leading-relaxed'>
            Every customer receives an explainable 0 to 100 score built from Recency, Frequency, Monetary Value, and Loyalty. Move the sliders to test the live scoring algorithm.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#121820] border border-[#222B36] rounded-2xl p-6 sm:p-10'>
          {/* 4 Interactive Sliders */}
          <div className='lg:col-span-7 space-y-6'>
            <div className='flex items-center gap-2 text-xs font-mono text-[#8A98A8] uppercase tracking-wider mb-2 border-b border-[#222B36] pb-2'>
              <Sliders className='w-4 h-4 text-[#4F8CFF]' />
              <span>Customer Purchasing Dimensions</span>
            </div>

            {/* Recency Slider */}
            <div className='space-y-1.5'>
              <div className='flex justify-between text-xs font-semibold'>
                <span className='text-[#E8EEF5]'>Recency: Days Since Last Order</span>
                <span className='font-mono text-[#4F8CFF]'>{recencyDays} days ago</span>
              </div>
              <input
                type='range'
                min='1'
                max='180'
                value={recencyDays}
                onChange={(e) => setRecencyDays(Number(e.target.value))}
                className='w-full h-2 bg-[#18222E] rounded-lg appearance-none cursor-pointer accent-[#4F8CFF]'
              />
              <span className='text-[10px] text-[#8A98A8] block'>Score contribution: {Math.round(rScore)} / 25 pts</span>
            </div>

            {/* Frequency Slider */}
            <div className='space-y-1.5'>
              <div className='flex justify-between text-xs font-semibold'>
                <span className='text-[#E8EEF5]'>Frequency: Total Completed Orders</span>
                <span className='font-mono text-[#3DD6A0]'>{frequencyOrders} orders</span>
              </div>
              <input
                type='range'
                min='1'
                max='40'
                value={frequencyOrders}
                onChange={(e) => setFrequencyOrders(Number(e.target.value))}
                className='w-full h-2 bg-[#18222E] rounded-lg appearance-none cursor-pointer accent-[#3DD6A0]'
              />
              <span className='text-[10px] text-[#8A98A8] block'>Score contribution: {Math.round(fScore)} / 25 pts</span>
            </div>

            {/* Monetary Spend Slider */}
            <div className='space-y-1.5'>
              <div className='flex justify-between text-xs font-semibold'>
                <span className='text-[#E8EEF5]'>Monetary Value: Lifetime Spend</span>
                <span className='font-mono text-[#F5B83D]'>₹{monetarySpend.toLocaleString()}</span>
              </div>
              <input
                type='range'
                min='500'
                max='80000'
                step='500'
                value={monetarySpend}
                onChange={(e) => setMonetarySpend(Number(e.target.value))}
                className='w-full h-2 bg-[#18222E] rounded-lg appearance-none cursor-pointer accent-[#F5B83D]'
              />
              <span className='text-[10px] text-[#8A98A8] block'>Score contribution: {Math.round(mScore)} / 30 pts</span>
            </div>

            {/* Loyalty Consistency Slider */}
            <div className='space-y-1.5'>
              <div className='flex justify-between text-xs font-semibold'>
                <span className='text-[#E8EEF5]'>Loyalty Factor: Regularity of Visits</span>
                <span className='font-mono text-[#7C5CFF]'>{loyaltyFactor}% regularity</span>
              </div>
              <input
                type='range'
                min='10'
                max='100'
                value={loyaltyFactor}
                onChange={(e) => setLoyaltyFactor(Number(e.target.value))}
                className='w-full h-2 bg-[#18222E] rounded-lg appearance-none cursor-pointer accent-[#7C5CFF]'
              />
              <span className='text-[10px] text-[#8A98A8] block'>Score contribution: {Math.round(lScore)} / 20 pts</span>
            </div>
          </div>

          {/* Animated 0-100 Dial Display */}
          <div className='lg:col-span-5 flex flex-col items-center justify-center p-6 bg-[#0B0F14]/70 border border-[#222B36] rounded-xl text-center'>
            <div className='relative w-48 h-48 flex items-center justify-center mb-4'>
              <svg className='w-full h-full -rotate-90' viewBox='0 0 160 160'>
                {/* Dial Track */}
                <circle
                  cx='80'
                  cy='80'
                  r={radius}
                  fill='none'
                  stroke='#18222E'
                  strokeWidth='12'
                />
                {/* Dial Value Arc */}
                <circle
                  cx='80'
                  cy='80'
                  r={radius}
                  fill='none'
                  stroke={bandColor}
                  strokeWidth='12'
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap='round'
                  className='transition-all duration-300'
                />
              </svg>

              <div className='absolute flex flex-col items-center'>
                <span className='text-4xl font-extrabold font-mono tracking-tight text-[#E8EEF5]'>
                  {clampedScore}
                </span>
                <span className='text-[10px] font-mono text-[#8A98A8] uppercase tracking-wider'>
                  Score / 100
                </span>
              </div>
            </div>

            <span
              className='text-xs font-bold font-mono px-3 py-1 rounded-full border mb-4'
              style={{
                color: bandColor,
                borderColor: `${bandColor}40`,
                backgroundColor: `${bandColor}15`
              }}
            >
              {bandName}
            </span>

            {/* Dynamic Deterministic "Why this score?" sentence */}
            <div className='p-3.5 bg-[#121820] border border-[#222B36] rounded-lg text-left text-xs'>
              <strong className='text-[#E8EEF5] block mb-1 font-semibold'>Why this score?</strong>
              <p className='text-[#8A98A8] leading-relaxed'>{generateExplainer()}</p>
            </div>

            {/* Illustrative methodology note required by spec */}
            <div className='flex items-center gap-1.5 text-[11px] font-mono text-[#8A98A8] mt-4'>
              <AlertCircle className='w-3.5 h-3.5 flex-shrink-0 text-[#F5B83D]' />
              <span>Illustrative weights. Final scoring methodology is configurable.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

