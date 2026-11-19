import { useEffect, useState } from 'react'

export default function PatronThread () {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalHeight))
        setScrollProgress(progress)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 1000 length nominal path
  const pathLength = 1200
  const dashoffset = pathLength - scrollProgress * pathLength

  return (
    <div
      className='pointer-events-none fixed inset-0 z-10 overflow-hidden select-none'
      aria-hidden='true'
    >
      <svg
        className='w-full h-full'
        viewBox='0 0 100 1200'
        preserveAspectRatio='none'
        fill='none'
      >
        <defs>
          <linearGradient id='threadGrad' x1='0%' y1='0%' x2='0%' y2='100%'>
            <stop offset='0%' stopColor='#4F8CFF' stopOpacity='0.2' />
            <stop offset='20%' stopColor='#7C5CFF' stopOpacity='0.9' />
            <stop offset='45%' stopColor='#3DD6A0' stopOpacity='0.9' />
            <stop offset='70%' stopColor='#F5B83D' stopOpacity='0.9' />
            <stop offset='100%' stopColor='#4F8CFF' stopOpacity='1' />
          </linearGradient>

          <filter id='threadGlow' x='-20%' y='-20%' width='140%' height='140%'>
            <feGaussianBlur stdDeviation='2' result='blur' />
            <feMerge>
              <feMergeNode in='blur' />
              <feMergeNode in='SourceGraphic' />
            </feMerge>
          </filter>
        </defs>

        {/* Subtle Background Guide Track */}
        <path
          d='M 50,0 Q 48,150 52,300 T 48,600 T 52,900 T 50,1200'
          stroke='#222B36'
          strokeWidth='1.5'
          strokeDasharray='4 6'
          strokeOpacity='0.4'
        />

        {/* Active Animated Glowing Thread Spine */}
        <path
          d='M 50,0 Q 48,150 52,300 T 48,600 T 52,900 T 50,1200'
          stroke='url(#threadGrad)'
          strokeWidth='2'
          strokeLinecap='round'
          filter='url(#threadGlow)'
          style={{
            strokeDasharray: pathLength,
            strokeDashoffset: dashoffset,
            transition: 'stroke-dashoffset 0.1s linear'
          }}
        />

        {/* Traveling Pulsing Data Node */}
        {scrollProgress > 0.02 && scrollProgress < 0.98 && (
          <circle
            cx='50'
            cy={scrollProgress * 1200}
            r='4'
            fill='#E8EEF5'
            filter='url(#threadGlow)'
          >
            <animate
              attributeName='r'
              values='3;5;3'
              dur='1.5s'
              repeatCount='indefinite'
            />
          </circle>
        )}
      </svg>
    </div>
  )
}

