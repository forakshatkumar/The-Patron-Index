import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Users,
  IndianRupee,
  UserCheck,
  UploadCloud,
  ShieldCheck,
  BarChart2,
  Sparkles,
  Award,
  LayoutDashboard,
  PieChart,
  Lightbulb,
  TrendingUp,
  Menu,
  X
} from 'lucide-react'
import logoImg from '../assets/logo.png'
import './Landing.css'

gsap.registerPlugin(ScrollTrigger)

const previewData = {
  six: {
    values: [26, 44, 36, 58, 51, 76, 61, 79, 93],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    metric: '12,480',
    delta: '↑ 12%',
    revenue: '₹8.4L',
    revenueDelta: '↑ 18%',
    active: '8,960',
    activeDelta: '↑ 14%',
    segments: [
      { name: 'High-Value', pct: 25, count: '3,120', color: '#0b2345' },
      { name: 'Loyal', pct: 28, count: '3,494', color: '#0866f5' },
      { name: 'Regular', pct: 18, count: '2,246', color: '#22b8f5' },
      { name: 'At-Risk', pct: 17, count: '2,122', color: '#f59e0b' },
      { name: 'Inactive', pct: 12, count: '1,498', color: '#8da2b5' }
    ]
  },
  three: {
    values: [41, 55, 49, 68, 61, 80, 89],
    months: ['Apr', 'May', 'Jun'],
    metric: '7,380',
    delta: '↑ 9%',
    revenue: '₹4.9L',
    revenueDelta: '↑ 11%',
    active: '5,240',
    activeDelta: '↑ 8%',
    segments: [
      { name: 'High-Value', pct: 29, count: '2,140', color: '#0b2345' },
      { name: 'Loyal', pct: 27, count: '1,992', color: '#0866f5' },
      { name: 'Regular', pct: 20, count: '1,476', color: '#22b8f5' },
      { name: 'At-Risk', pct: 14, count: '1,033', color: '#f59e0b' },
      { name: 'Inactive', pct: 10, count: '739', color: '#8da2b5' }
    ]
  },
  customers: {
    values: [22, 35, 32, 56, 53, 68, 64, 87],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    metric: '12,480',
    delta: '↑ 12%'
  },
  revenue: {
    values: [18, 30, 48, 40, 61, 75, 68, 94],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    metric: '₹8.4L',
    delta: '↑ 18%'
  }
}

function generateSvgCurve (values) {
  const points = values.map((val, idx) => ({
    x: 2 + (idx * 236) / (values.length - 1),
    y: 100 - val
  }))
  const first = points[0]
  const last = points[points.length - 1]
  let line = `M${first.x} ${first.y}`
  points.slice(1).forEach((pt, idx) => {
    const prev = points[idx]
    const midX = (prev.x + pt.x) / 2
    line += ` C${midX} ${prev.y} ${midX} ${pt.y} ${pt.x} ${pt.y}`
  })
  const area = `${line} L${last.x} 100 H${first.x} Z`
  return { line, area, points }
}

export default function Landing () {
  const [overviewRange, setOverviewRange] = useState('six')
  const [laptopMetric, setLaptopMetric] = useState('customers')
  const [selectedFeature, setSelectedFeature] = useState(0)
  const [activeSegment, setActiveSegment] = useState(null)
  const [donutLoaded, setDonutLoaded] = useState(false)

  const landingRef = useRef(null)
  const stepsContainerRef = useRef(null)
  const [timelineProgress, setTimelineProgress] = useState(0)
  const [isLaptopOpen, setIsLaptopOpen] = useState(false)
  const laptopSectionRef = useRef(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    const handleResize = () => {
      if (window.innerWidth >= 840 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    // Ensure the landing page loads at the very top so only the hero section is visible initially
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
    const timer = setTimeout(() => setDonutLoaded(true), 50)

    // Pre-warm backend on Render to eliminate cold-start delay
    const apiBase = '/api'
    fetch(`${apiBase}/health`).catch(() => {})

    return () => clearTimeout(timer)
  }, [])

  // GSAP ScrollTrigger Integration with responsive matchMedia & reduced-motion support
  useEffect(() => {
    const mm = gsap.matchMedia(landingRef)

    mm.add({
      isDesktop: '(min-width: 1025px)',
      isTablet: '(min-width: 768px) and (max-width: 1024px)',
      isMobile: '(max-width: 767px)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    }, (context) => {
      const { reduceMotion, isMobile } = context.conditions

      // 1. Scroll-Linked 3D Laptop Flap: opens as user scrolls into view, shuts when scrolling back up
      if (laptopSectionRef.current) {
        ScrollTrigger.create({
          trigger: laptopSectionRef.current,
          start: isMobile ? 'top 90%' : 'top 85%',
          end: 'bottom 15%',
          onEnter: () => setIsLaptopOpen(true),
          onLeaveBack: () => setIsLaptopOpen(false),
          onEnterBack: () => setIsLaptopOpen(true),
          onUpdate: (self) => {
            if (self.direction === 1 && self.progress > 0.04) {
              setIsLaptopOpen(true)
            } else if (self.direction === -1 && self.progress < 0.15) {
              setIsLaptopOpen(false)
            }
          }
        })
      }

      // 2. 4-Steps Timeline Progress with butter-smooth scrub
      if (stepsContainerRef.current) {
        ScrollTrigger.create({
          trigger: stepsContainerRef.current,
          start: isMobile ? 'top 85%' : 'top 75%',
          end: 'bottom 25%',
          scrub: 0.25,
          onUpdate: (self) => {
            setTimelineProgress(self.progress)
          }
        })
      }

      if (!reduceMotion) {
        // 3. Staggered Scroll Entrance for About Benefits
        gsap.from('.benefit', {
          scrollTrigger: {
            trigger: '.benefits',
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: isMobile ? 18 : 28,
          opacity: 0,
          duration: 0.7,
          stagger: 0.14,
          ease: 'power2.out'
        })

        // 4. Staggered Entrance for Timeline Step Articles
        if (stepsContainerRef.current) {
          gsap.from('.steps article.step', {
            scrollTrigger: {
              trigger: stepsContainerRef.current,
              start: isMobile ? 'top 85%' : 'top 80%',
              toggleActions: 'play none none none'
            },
            y: isMobile ? 16 : 25,
            opacity: 0,
            duration: 0.8,
            stagger: 0.16,
            ease: 'power2.out'
          })
        }

        // 5. Powerful Features Section Reveal
        gsap.from('.feature-explorer', {
          scrollTrigger: {
            trigger: '#features',
            start: isMobile ? 'top 88%' : 'top 82%',
            toggleActions: 'play none none none'
          },
          y: isMobile ? 20 : 32,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        })

        // 6. Call To Action Banner Reveal
        gsap.from('.cta', {
          scrollTrigger: {
            trigger: '.cta',
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: isMobile ? 18 : 28,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        })
      }
    })

    const handleRefresh = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', handleRefresh)
    window.addEventListener('orientationchange', handleRefresh)

    return () => {
      window.removeEventListener('resize', handleRefresh)
      window.removeEventListener('orientationchange', handleRefresh)
      mm.revert()
    }
  }, [])

  const currentOverview = previewData[overviewRange]
  const currentOverviewCurve = generateSvgCurve(currentOverview.values)

  const currentLaptop = previewData[laptopMetric]
  const currentLaptopCurve = generateSvgCurve(currentLaptop.values)

  const featureList = [
    {
      id: 'feature-panel-0',
      title: 'Customer Segmentation',
      icon: Users,
      description: 'Group customers by purchase behaviour and see which segments drive your business.',
      example: 'High-value · Loyal · At-risk'
    },
    {
      id: 'feature-panel-1',
      title: 'Patron Index Score',
      icon: Award,
      description: 'See customer value at a glance and identify which relationships to prioritise.',
      example: 'Example score · 84 / 100'
    },
    {
      id: 'feature-panel-2',
      title: 'Interactive Dashboard',
      icon: LayoutDashboard,
      description: 'Explore customer and revenue trends by changing the date range on the overview chart.',
      example: 'Customer growth · ↑ 12%'
    },
    {
      id: 'feature-panel-3',
      title: 'Segment-based Recommendations',
      icon: Sparkles,
      description: 'Get suggestions based on customer behaviour and spot opportunities to improve retention.',
      example: 'Example action · Re-engage at-risk customers'
    }
  ]

  return (
    <div className='patron-landing-page' id='home' ref={landingRef}>
      {/* Header / Navbar */}
      <header className='header wrap'>
        <a className='brand' href='#home'>
          <img src={logoImg} alt='The Patron Index' />
          <span>The Patron Index</span>
        </a>
        <nav className='desktop-nav' aria-label='Main navigation'>
          <a href='#home'>Home</a>
          <a href='#features'>Features</a>
          <a href='#about'>About</a>
          <a href='#how'>How It Works</a>
        </nav>
        <div className='actions desktop-actions'>
          <Link to='/login' className='btn outline'>Login</Link>
          <Link to='/register' className='btn'>Sign Up</Link>
        </div>

        {/* Mobile Hamburger Toggle Button (< 840px) */}
        <button
          type='button'
          className='mobile-menu-toggle'
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls='mobile-navigation-drawer'
          onClick={() => setMobileMenuOpen(prev => !prev)}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile Navigation Drawer & Backdrop (< 840px) */}
      {mobileMenuOpen && (
        <div
          className='mobile-nav-backdrop'
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden='true'
        />
      )}
      <div
        id='mobile-navigation-drawer'
        className={`mobile-nav-drawer ${mobileMenuOpen ? 'is-open' : ''}`}
        aria-hidden={!mobileMenuOpen} inert={!mobileMenuOpen}
      >
        <div className='mobile-nav-header'>
          <div className='brand'>
            <img src={logoImg} alt='The Patron Index' />
            <span>The Patron Index</span>
          </div>
          <button
            type='button'
            className='mobile-nav-close'
            aria-label='Close navigation menu'
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className='mobile-nav-links' aria-label='Mobile navigation'>
          <a href='#home' onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href='#features' onClick={() => setMobileMenuOpen(false)}>Features</a>
          <a href='#about' onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href='#how' onClick={() => setMobileMenuOpen(false)}>How It Works</a>
        </nav>

        <div className='mobile-nav-actions'>
          <Link to='/login' className='btn outline mobile-btn' onClick={() => setMobileMenuOpen(false)}>Login</Link>
          <Link to='/register' className='btn mobile-btn-primary' onClick={() => setMobileMenuOpen(false)}>Sign Up Free &rarr;</Link>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className='hero'>
          <div className='hero-grid wrap'>
            <div className='hero-copy'>
              <h1>Where buyers become insight</h1>
              <p className='tagline'>Know your customers. Grow with confidence.</p>
              <p>Turn purchase history into customer segments, revenue trends and practical insights — all in one workspace.</p>
              <div className='hero-buttons'>
                <Link to='/register' className='btn'>Get started</Link><a href='#how' className='btn outline'>See how it works</a>
              </div>
            </div>
            <div className='dashboard' aria-label='Illustrative dashboard preview, sample data'>
              <span className='preview-label'>PRODUCT PREVIEW · SAMPLE DATA</span>
              <span className='blob' aria-hidden='true' />
              <div className='panel'>
                <div className='panel-head'>
                  <strong>Customer Overview</strong>
                  <select
                    className='period'
                    aria-label='Customer overview date range'
                    value={overviewRange}
                    onChange={(e) => setOverviewRange(e.target.value)}
                  >
                    <option value='six'>Last 6 Months</option>
                    <option value='three'>Last 3 Months</option>
                  </select>
                </div>
                <div className='stats'>
                  <div className='stat'>
                    <div className='stat-icon-wrap user-stat'>
                      <Users className='stat-icon' />
                    </div>
                    <div>Total Customers<b>{currentOverview.metric}</b><small>{currentOverview.delta}</small></div>
                  </div>
                  <div className='stat'>
                    <div className='stat-icon-wrap revenue-stat'>
                      <IndianRupee className='stat-icon' />
                    </div>
                    <div>Total Revenue<b>{currentOverview.revenue}</b><small>{currentOverview.revenueDelta}</small></div>
                  </div>
                  <div className='stat'>
                    <div className='stat-icon-wrap active-stat'>
                      <UserCheck className='stat-icon' />
                    </div>
                    <div>Active Customers<b>{currentOverview.active}</b><small>{currentOverview.activeDelta}</small></div>
                  </div>
                </div>
                <div className='charts'>
                  <div className='trend'>
                    <div className='plot'>
                      <svg viewBox='0 0 240 100' preserveAspectRatio='none' role='img' aria-label='Customer trend rises overall'>
                        <defs>
                          <linearGradient id='area-overview' x2='0' y2='1'>
                            <stop stopColor='#dae9fa' />
                            <stop offset='1' stopColor='#f4f8fc' />
                          </linearGradient>
                        </defs>
                        <path className='trend-area' fill='url(#area-overview)' d={currentOverviewCurve.area} />
                        <path className='trend-line' pathLength='1' fill='none' stroke='#195994' strokeWidth='1.6' d={currentOverviewCurve.line} />
                        <g className='trend-markers' fill='#195994'>
                          {currentOverviewCurve.points.map((pt, i) => (
                            <circle key={i} cx={pt.x} cy={pt.y} r='2' />
                          ))}
                        </g>
                      </svg>
                    </div>
                    <div className='months'>
                      {currentOverview.months.map((m, i) => (
                        <span key={i}>{m}</span>
                      ))}
                    </div>
                  </div>
                  <div className='segments'>
                    <h3>Customer Segments</h3>
                    <div className='segment-body'>
                      <div className='donut-container'>
                        <svg
                          className='donut-svg'
                          viewBox='0 0 100 100'
                          role='img'
                          aria-label='Customer segments breakdown'
                        >
                          {(() => {
                            const C = 238.761
                            return currentOverview.segments.map((seg, idx) => {
                              const cumulativePct = currentOverview.segments.slice(0, idx).reduce((acc, s) => acc + s.pct, 0)
                              const length = (seg.pct / 100) * C
                              const offset = -(cumulativePct / 100) * C
                              const gap = 1.4
                              const dashLen = Math.max(0, length - gap)
                              const isActive = activeSegment === idx
                              const isMuted = activeSegment !== null && !isActive

                              return (
                                <circle
                                  key={seg.name}
                                  className={`donut-slice ${isActive ? 'active' : ''} ${isMuted ? 'muted' : ''}`}
                                  cx='50'
                                  cy='50'
                                  r='38'
                                  stroke={seg.color}
                                  strokeWidth={isActive ? '20' : '16'}
                                  strokeDasharray={donutLoaded ? `${dashLen} ${C - dashLen}` : `0 ${C}`}
                                  strokeDashoffset={donutLoaded ? offset : 0}
                                  onMouseEnter={() => setActiveSegment(idx)}
                                  onMouseLeave={() => setActiveSegment(null)}
                                  onClick={() => setActiveSegment(prev => prev === idx ? null : idx)}
                                >
                                  <title>{`${seg.name}: ${seg.pct}% (${seg.count} customers)`}</title>
                                </circle>
                              )
                            })
                          })()}
                        </svg>
                        <div className='donut-center-content' aria-hidden='true'>
                          {activeSegment !== null ? (
                            <>
                              <span className='donut-center-pct'>
                                {currentOverview.segments[activeSegment].pct}%
                              </span>
                              <span className='donut-center-name'>
                                {currentOverview.segments[activeSegment].name}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className='donut-center-pct'>100%</span>
                              <span className='donut-center-name'>Total</span>
                            </>
                          )}
                        </div>
                      </div>
                      <ul className='legend'>
                        {currentOverview.segments.map((seg, idx) => {
                          const isActive = activeSegment === idx
                          return (
                            <li
                              key={seg.name}
                              className={isActive ? 'active' : ''}
                              onMouseEnter={() => setActiveSegment(idx)}
                              onMouseLeave={() => setActiveSegment(null)}
                              onClick={() => setActiveSegment(prev => prev === idx ? null : idx)}
                              role='button'
                              tabIndex={0}
                              aria-label={`${seg.name}: ${seg.pct}%`}
                            >
                              <span className='legend-label'>
                                <i style={{ '--dot': seg.color, backgroundColor: seg.color }} />
                                {seg.name}
                              </span>
                              <span className='legend-pct'>{seg.pct}%</span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className='about wrap' id='about'>
          <div>
            <div className='eyebrow'>About The Patron Index</div>
            <h2>Understand your customers.<br />Grow your business.</h2>
            <p>The Patron Index helps you analyse your customer behaviour, identify valuable segments, and make data-driven decisions — all in a simple, secure and affordable platform.</p>
          </div>
          <div className='benefits'>
            <div className='benefit'>
              <div className='benefit-icon-wrap' aria-hidden='true'>
                <UploadCloud />
              </div>
              <span>Upload your CSV data<br />for validation</span>
            </div>
            <div className='benefit'>
              <div className='benefit-icon-wrap' aria-hidden='true'>
                <PieChart />
              </div>
              <span>Get detailed insights<br />and customer segments</span>
            </div>
            <div className='benefit'>
              <div className='benefit-icon-wrap' aria-hidden='true'>
                <TrendingUp />
              </div>
              <span>Make smarter business<br />decisions</span>
            </div>
          </div>
          <div className='laptop-wrapper' ref={laptopSectionRef}>
            <div
              className='laptop'
              role='region'
              aria-label='Interactive analytics laptop preview'
            >
              <div className={`laptop-lid ${isLaptopOpen ? 'open' : 'shut'}`}>
                <div className='laptop-screen'>
                  <div className='screen-head'>
                    <div className='screen-title-wrap'>
                      <strong>Customer analytics</strong>
                      <span className='live-pill'>
                        <span className='live-dot' />
                        Preview
                      </span>
                    </div>
                    <select
                      className='period'
                      aria-label='Laptop analytics metric'
                      value={laptopMetric}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setLaptopMetric(e.target.value)}
                    >
                      <option value='customers'>Customers</option>
                      <option value='revenue'>Revenue</option>
                    </select>
                  </div>
                  <div className='screen-metric'>
                    <strong>{currentLaptop.metric}</strong>
                    <small>{currentLaptop.delta}</small>
                  </div>
                  <div className='plot'>
                    <svg viewBox='0 0 240 100' preserveAspectRatio='none' role='img' aria-label='Laptop analytics curve'>
                      <defs>
                        <linearGradient id='area-laptop' x2='0' y2='1'>
                          <stop stopColor='#dae9fa' stopOpacity='0.9' />
                          <stop offset='1' stopColor='#f4f8fc' stopOpacity='0.1' />
                        </linearGradient>
                      </defs>
                      <path className='trend-area' fill='url(#area-laptop)' d={currentLaptopCurve.area} />
                      <path className='trend-line lively' pathLength='1' fill='none' stroke='#0866f5' strokeWidth='2' d={currentLaptopCurve.line} />
                      <g className='trend-markers'>
                        {currentLaptopCurve.points.map((pt, i) => (
                          <g key={i} className='lively-node' style={{ '--node-delay': `${i * 0.22}s` }}>
                            <circle className='pulse-halo' cx={pt.x} cy={pt.y} r='5' />
                            <circle className='node-dot' cx={pt.x} cy={pt.y} r='2.2' />
                          </g>
                        ))}
                      </g>
                    </svg>
                  </div>
                  <div className='months'>
                    {currentLaptop.months.map((m, i) => (
                      <span key={i}>{m}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className='laptop-base' aria-hidden='true' />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className='how center wrap' id='how'>
          <p className='eyebrow ruled'>How It Works</p>
          <h2>From Data to Decisions in 4 Simple Steps</h2>
          <div className='steps' ref={stepsContainerRef}>
            <div className='timeline-track' aria-hidden='true'>
              <div className='timeline-line-bg' />
              <div
                className='timeline-line-fill'
                style={{ height: `${Math.min(timelineProgress * 100, 100)}%` }}
              />
            </div>

            <article className={`step step-1 ${timelineProgress >= 0.06 ? 'active-step' : ''}`}>
              <div className={`step-node ${timelineProgress >= 0.06 ? 'reached' : ''}`} aria-hidden='true'>
                <span className='node-pulse-ring' />
                <span className='node-inner-dot' />
              </div>
              <div className='step-icon-box' aria-hidden='true'>
                <UploadCloud />
              </div>
              <h3>1. Upload Your Data</h3>
              <p>Drag and drop your business CSV file</p>
            </article>

            <article className={`step step-2 ${timelineProgress >= 0.32 ? 'active-step' : ''}`}>
              <div className={`step-node ${timelineProgress >= 0.32 ? 'reached' : ''}`} aria-hidden='true'>
                <span className='node-pulse-ring' />
                <span className='node-inner-dot' />
              </div>
              <div className='step-icon-box' aria-hidden='true'>
                <ShieldCheck />
              </div>
              <h3>2. Validate &amp; Clean</h3>
              <p>Our platform checks for errors and inconsistencies</p>
            </article>

            <article className={`step step-3 ${timelineProgress >= 0.62 ? 'active-step' : ''}`}>
              <div className={`step-node ${timelineProgress >= 0.62 ? 'reached' : ''}`} aria-hidden='true'>
                <span className='node-pulse-ring' />
                <span className='node-inner-dot' />
              </div>
              <div className='step-icon-box' aria-hidden='true'>
                <BarChart2 />
              </div>
              <h3>3. Analyse Customers</h3>
              <p>Discover segments like loyal, high-value or at-risk</p>
            </article>

            <article className={`step step-4 ${timelineProgress >= 0.88 ? 'active-step' : ''}`}>
              <div className={`step-node ${timelineProgress >= 0.88 ? 'reached' : ''}`} aria-hidden='true'>
                <span className='node-pulse-ring' />
                <span className='node-inner-dot' />
              </div>
              <div className='step-icon-box' aria-hidden='true'>
                <Lightbulb />
              </div>
              <h3>4. Get Actionable Insights</h3>
              <p>Receive easy-to-understand recommendations</p>
            </article>
          </div>
        </section>

        {/* Powerful Features Explorer */}
        <section className='center wrap' id='features'>
          <h2 className='ruled'>Powerful Features</h2>
          <p className='subtitle'>Everything you need to understand and grow your customer base</p>
          <div className='feature-explorer'>
            <div className='feature-tabs' role='tablist' aria-label='Powerful features'>
              {featureList.map((feat, idx) => {
                const Icon = feat.icon
                return (
                  <button
                    key={idx}
                    className='feature-tab'
                    id={`feature-tab-${idx}`}
                    role='tab'
                    aria-selected={selectedFeature === idx}
                    aria-controls={feat.id}
                    tabIndex={selectedFeature === idx ? 0 : -1}
                    onClick={() => setSelectedFeature(idx)}
                  >
                    <span className='feature-tab-icon-wrap' aria-hidden='true'>
                      <Icon />
                    </span>
                    {feat.title}
                  </button>
                )
              })}
            </div>

            {featureList.map((feat, idx) => (
              <article
                key={idx}
                className='feature-detail'
                id={feat.id}
                role='tabpanel'
                aria-labelledby={`feature-tab-${idx}`}
                tabIndex={0}
                hidden={selectedFeature !== idx}
              >
                <h3>{feat.title}</h3>
                <p>{feat.description}</p>
                <span className='feature-example'>{feat.example}</span>
              </article>
            ))}
          </div>
        </section>

        <section className='marketing-faq wrap' id='faq'><h2>Frequently asked questions</h2><details><summary>What data do I need?</summary><p>A CSV containing customer ID, name, purchase date and amount. Email and product are optional.</p></details><details><summary>How are customers segmented?</summary><p>The platform uses recency, frequency and monetary value to calculate the Patron Index score and classify customers into seven groups.</p></details><details><summary>Can I use my own business data?</summary><p>Yes. Create an account, import your purchase history and explore your own dashboard and customer records.</p></details></section>
        {/* Call to Action Banner */}
        <section className='cta center wrap'>
          <div>
            <h2>Ready to unlock the power of your customer data?</h2>
            <p>Join The Patron Index today and turn your data into growth.</p>
          </div>
          <Link to='/register' className='btn'>Sign Up Free &rarr;</Link>
        </section>
      </main>

      {/* Footer */}
      <footer className='wrap'>
        <p className='copyright'><strong className='footer-brand-tagline'>Where buyers become insight</strong>&copy; 2026 The Patron Index. All rights reserved.</p>
      </footer>
    </div>
  )
}
