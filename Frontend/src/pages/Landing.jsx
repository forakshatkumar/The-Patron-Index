import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
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
  Lightbulb
} from 'lucide-react'
import logoImg from '../assets/logo.png'
import './Landing.css'

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

  const stepsContainerRef = useRef(null)
  const [timelineProgress, setTimelineProgress] = useState(0)
  const [isLaptopOpen, setIsLaptopOpen] = useState(false)
  const laptopSectionRef = useRef(null)

  useEffect(() => {
    // Ensure the landing page loads at the very top so only the hero section is visible initially
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
    const timer = setTimeout(() => setDonutLoaded(true), 50)
    return () => clearTimeout(timer)
  }, [])

  // Scroll-linked laptop flap: opens as user scrolls down, shuts as user scrolls up
  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const handleLaptopScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!laptopSectionRef.current) {
            ticking = false
            return
          }

          const currentScrollY = window.scrollY
          const delta = currentScrollY - lastScrollY
          const rect = laptopSectionRef.current.getBoundingClientRect()
          const windowHeight = window.innerHeight

          // In viewport range
          const inView = rect.top < windowHeight * 0.92 && rect.bottom > 50

          if (inView) {
            if (delta > 0.5) {
              // Scrolling DOWN: Open flap
              setIsLaptopOpen(true)
            } else if (delta < -0.5) {
              // Scrolling UP: Close flap
              setIsLaptopOpen(false)
            }
          } else if (rect.top >= windowHeight * 0.85) {
            // Above the laptop: keep flap shut
            setIsLaptopOpen(false)
          }

          lastScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleLaptopScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleLaptopScroll)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!stepsContainerRef.current) return
      const rect = stepsContainerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const startOffset = windowHeight * 0.72
      const endOffset = windowHeight * 0.28
      const totalDistance = rect.height + (startOffset - endOffset)
      const currentScroll = startOffset - rect.top
      const progress = Math.min(Math.max(currentScroll / totalDistance, 0), 1)
      setTimelineProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
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
      title: 'AI-Powered Recommendations',
      icon: Sparkles,
      description: 'Get suggestions based on customer behaviour and spot opportunities to improve retention.',
      example: 'Example action · Re-engage at-risk customers'
    }
  ]

  return (
    <div className='patron-landing-page' id='home'>
      {/* Header / Navbar */}
      <header className='header wrap'>
        <a className='brand' href='#home'>
          <img src={logoImg} alt='The Patron Index' />
          <span>The Patron Index</span>
        </a>
        <nav aria-label='Main navigation'>
          <a href='#home'>Home</a>
          <a href='#features'>Features</a>
          <a href='#about'>About</a>
        </nav>
        <div className='actions'>
          <Link to='/login' className='btn outline'>Login</Link>
          <Link to='/register' className='btn'>Sign Up</Link>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className='hero'>
          <div className='hero-grid wrap'>
            <div className='hero-copy'>
              <h1>The Patron Index</h1>
              <p className='tagline'>Where Buyers Become Insight</p>
              <p>Turn your business data into powerful customer intelligence. Understand. Segment. Grow.</p>
              <div className='hero-buttons'>
                <Link to='/register' className='btn'>Get Started Free</Link>
              </div>
            </div>
            <div className='dashboard'>
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
              <span>Upload your CSV data<br />in seconds</span>
            </div>
            <div className='benefit'>
              <div className='benefit-icon-wrap' aria-hidden='true'>
                <PieChart />
              </div>
              <span>Get detailed insights<br />and customer segments</span>
            </div>
            <div className='benefit'>
              <div className='benefit-icon-wrap' aria-hidden='true'>
                <Lightbulb />
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
                        Live
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

            <article className={`step ${timelineProgress >= 0.10 ? 'active-step' : ''}`}>
              <div className={`step-node ${timelineProgress >= 0.10 ? 'reached' : ''}`} aria-hidden='true'>
                <span className='node-pulse-ring' />
                <span className='node-inner-dot' />
              </div>
              <div className='step-icon-box' aria-hidden='true'>
                <UploadCloud />
              </div>
              <h3>1. Upload Your Data</h3>
              <p>Drag and drop your<br />business CSV file</p>
            </article>

            <article className={`step ${timelineProgress >= 0.36 ? 'active-step' : ''}`}>
              <div className={`step-node ${timelineProgress >= 0.36 ? 'reached' : ''}`} aria-hidden='true'>
                <span className='node-pulse-ring' />
                <span className='node-inner-dot' />
              </div>
              <div className='step-icon-box' aria-hidden='true'>
                <ShieldCheck />
              </div>
              <h3>2. Validate &amp; Clean</h3>
              <p>Our platform checks<br />for errors and inconsistencies</p>
            </article>

            <article className={`step ${timelineProgress >= 0.65 ? 'active-step' : ''}`}>
              <div className={`step-node ${timelineProgress >= 0.65 ? 'reached' : ''}`} aria-hidden='true'>
                <span className='node-pulse-ring' />
                <span className='node-inner-dot' />
              </div>
              <div className='step-icon-box' aria-hidden='true'>
                <BarChart2 />
              </div>
              <h3>3. Analyse Customers</h3>
              <p>Discover segments like<br />loyal, high-value or at-risk</p>
            </article>

            <article className={`step ${timelineProgress >= 0.90 ? 'active-step' : ''}`}>
              <div className={`step-node ${timelineProgress >= 0.90 ? 'reached' : ''}`} aria-hidden='true'>
                <span className='node-pulse-ring' />
                <span className='node-inner-dot' />
              </div>
              <div className='step-icon-box' aria-hidden='true'>
                <Sparkles />
              </div>
              <h3>4. Get Actionable Insights</h3>
              <p>Receive easy-to-understand<br />recommendations</p>
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
        <div className='footer-row'>
          <a className='brand' href='#home'>
            <img src={logoImg} alt='The Patron Index' />
            <span>The Patron Index<small>Where Buyers Become Insight</small></span>
          </a>
          <div className='social' aria-label='Social platforms'>
            <a href='https://linkedin.com' target='_blank' rel='noreferrer' aria-label='LinkedIn' className='social-link'>
              <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z'/>
              </svg>
            </a>
            <a href='https://twitter.com' target='_blank' rel='noreferrer' aria-label='Twitter' className='social-link'>
              <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'/>
              </svg>
            </a>
            <a href='https://github.com' target='_blank' rel='noreferrer' aria-label='GitHub' className='social-link'>
              <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'>
                <path fillRule='evenodd' clipRule='evenodd' d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z'/>
              </svg>
            </a>
          </div>
        </div>
        <p className='copyright'>&copy; 2026 The Patron Index. All rights reserved.</p>
      </footer>
    </div>
  )
}
