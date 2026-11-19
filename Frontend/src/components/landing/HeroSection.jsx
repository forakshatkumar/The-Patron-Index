import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UploadCloud, Play, ArrowDown, FileSpreadsheet, CheckCircle2 } from 'lucide-react'
import { HERO_PARTICLES } from '../../data/mock'

export default function HeroSection ({ onOpenDemo }) {
  const [isUploaded, setIsUploaded] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [uploadProgress, setUploadProgress] = useState(0)

  // Cursor-reactive parallax
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    const x = (clientX / window.innerWidth - 0.5) * 20
    const y = (clientY / window.innerHeight - 0.5) * 20
    setMousePos({ x, y })
  }

  const triggerUploadDemo = () => {
    if (isUploaded) return
    let current = 0
    const interval = setInterval(() => {
      current += 20
      setUploadProgress(current)
      if (current >= 100) {
        clearInterval(interval)
        setIsUploaded(true)
      }
    }, 120)
  }

  const words = ['Understand', 'your', 'customers.', 'Grow', 'your', 'business.']

  return (
    <section
      id='hero'
      onMouseMove={handleMouseMove}
      className='relative min-h-[92vh] pt-32 pb-20 flex flex-col justify-between items-center text-center overflow-hidden'
    >
      {/* Dynamic Background Particle Field */}
      <div
        className='absolute inset-0 pointer-events-none transition-transform duration-300 ease-out'
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`
        }}
      >
        {HERO_PARTICLES.map((p, idx) => {
          // When uploaded, dots cluster into 7 colored segment groups
          const clusterTargets = [
            { x: 25, y: 30 },
            { x: 75, y: 30 },
            { x: 30, y: 70 },
            { x: 70, y: 70 },
            { x: 50, y: 45 },
            { x: 15, y: 55 },
            { x: 85, y: 55 }
          ]
          const target = isUploaded ? clusterTargets[idx % clusterTargets.length] : { x: p.x, y: p.y }

          return (
            <div
              key={p.id}
              className='absolute rounded-full transition-all duration-1000 ease-out flex items-center justify-center text-[10px] font-semibold text-white'
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                width: isUploaded ? '28px' : '10px',
                height: isUploaded ? '28px' : '10px',
                backgroundColor: p.color,
                boxShadow: `0 0 16px ${p.color}`,
                opacity: isUploaded ? 0.9 : 0.35,
                transform: `scale(${isUploaded ? 1.1 : 0.9})`
              }}
              title={p.label}
            >
              {isUploaded && <span className='opacity-90 scale-90'>◉</span>}
            </div>
          )
        })}
      </div>

      <div className='relative z-20 max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center'>
        {/* Animated Word-by-word Reveal Headline */}
        <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#E8EEF5] tracking-tight leading-[1.12] mb-6 font-display'>
          {words.map((word, i) => (
            <span
              key={i}
              className='inline-block mr-3 animate-fadeIn'
              style={{ animationDelay: `${i * 90}ms` }}
            >
              {word === 'customers.' ? (
                <span className='text-[#4F8CFF]'>{word}</span>
              ) : word === 'business.' ? (
                <span className='text-[#3DD6A0]'>{word}</span>
              ) : (
                word
              )}
            </span>
          ))}
        </h1>

        {/* Sub-line */}
        <p className='text-base sm:text-lg md:text-xl text-[#8A98A8] max-w-2xl mx-auto leading-relaxed mb-10'>
          A simpler way to turn raw business data into meaningful customer intelligence. Your business already has the data. We help you understand what it means.
        </p>

        {/* Interactive Centerpiece: Drag-and-drop CSV Dropzone Mock */}
        <div
          onMouseEnter={triggerUploadDemo}
          onClick={triggerUploadDemo}
          className='w-full max-w-md bg-[#121820]/80 backdrop-blur-md border border-[#222B36] hover:border-[#4F8CFF]/60 rounded-2xl p-6 mb-10 cursor-pointer shadow-xl transition-all duration-300 group'
          role='button'
          tabIndex={0}
          aria-label='Interactive CSV Upload Demo'
        >
          <div className='flex items-center justify-between mb-4 border-b border-[#222B36]/60 pb-3'>
            <div className='flex items-center gap-2 text-xs font-semibold text-[#8A98A8]'>
              <FileSpreadsheet className='w-4 h-4 text-[#4F8CFF]' />
              <span>sample_pos_transactions.csv</span>
            </div>
            <span className='text-[10px] font-mono px-2 py-0.5 rounded bg-[#18222E] text-[#4F8CFF] border border-[#222B36]'>
              {isUploaded ? 'Segmented' : 'Hover to Ingest'}
            </span>
          </div>

          <div className='border-2 border-dashed border-[#222B36] group-hover:border-[#4F8CFF]/50 rounded-xl p-6 flex flex-col items-center justify-center transition-colors bg-[#0B0F14]/40'>
            {isUploaded ? (
              <div className='flex flex-col items-center animate-fadeIn'>
                <div className='w-12 h-12 rounded-full bg-[#3DD6A0]/20 text-[#3DD6A0] flex items-center justify-center mb-2'>
                  <CheckCircle2 className='w-6 h-6' />
                </div>
                <strong className='text-sm text-[#E8EEF5]'>2,482 Rows Ingested &amp; Clustered</strong>
                <span className='text-xs text-[#8A98A8] mt-1'>Customers self-organized into 7 deterministic segments</span>
              </div>
            ) : uploadProgress > 0 ? (
              <div className='w-full flex flex-col items-center'>
                <span className='text-xs text-[#E8EEF5] mb-2'>Parsing transactions... {uploadProgress}%</span>
                <div className='w-full bg-[#18222E] h-2 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-[#4F8CFF] transition-all duration-150'
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className='flex flex-col items-center'>
                <UploadCloud className='w-10 h-10 text-[#4F8CFF] mb-2 group-hover:scale-110 transition-transform' />
                <span className='text-sm font-semibold text-[#E8EEF5]'>Drop your sales spreadsheet here</span>
                <span className='text-xs text-[#8A98A8] mt-1'>or click to watch automated segmentation</span>
              </div>
            )}
          </div>
        </div>

        {/* Dual Primary CTAs */}
        <div className='flex flex-wrap items-center justify-center gap-4 mb-6'>
          <Link
            to='/register'
            className='px-6 py-3 text-sm font-bold text-[#0B0F14] bg-[#4F8CFF] hover:bg-[#689DFF] rounded-full shadow-lg shadow-[#4F8CFF]/25 transition-all hover:scale-105 active:scale-95'
          >
            Upload your data
          </Link>
          <button
            type='button'
            onClick={onOpenDemo}
            className='flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#E8EEF5] bg-[#121820] hover:bg-[#18222E] border border-[#222B36] rounded-full transition-all hover:scale-105'
          >
            <Play className='w-4 h-4 text-[#3DD6A0]' />
            <span>Watch how it works</span>
          </button>
        </div>
      </div>

      {/* Scroll Indicator Prompt */}
      <div className='relative z-20 flex flex-col items-center gap-1.5 text-[#8A98A8] animate-bounce pt-4'>
        <span className='text-[11px] font-mono tracking-wider uppercase'>Scroll down the data thread</span>
        <ArrowDown className='w-4 h-4 text-[#4F8CFF]' />
      </div>
    </section>
  )
}

