import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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

  useEffect(() => {
    const timer = setTimeout(() => setDonutLoaded(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const currentOverview = previewData[overviewRange]
  const currentOverviewCurve = generateSvgCurve(currentOverview.values)

  const currentLaptop = previewData[laptopMetric]
  const currentLaptopCurve = generateSvgCurve(currentLaptop.values)

  const featureList = [
    {
      id: 'feature-panel-0',
      title: 'Customer Segmentation',
      img: 'data:image/webp;base64,UklGRg4DAABXRUJQVlA4IAIDAABwEQCdASonACcAPikQh0IhoQquqwAMAUJQBYj9TjOhuzmvxB6Du4A/ZzdgOtA9DPpW/2o/Wb2YKOJ+O/JsZc/WMzDkjXsl+gGoQcT7GL+onr4/6vmD+g/+D7hP6n/7E0nM3GXRGrffh79DEBQy4Ut/ZszyltJp41oQ4bETrjGskOtZkHBooQO9Cj7N5/2mnxv6qftAAP7//pRNT+NxzJD4z4Tmsap/Ktafy9KIbjqYyPEXqwEoWU6WqX+NDCY+D7j3QeIvNn3yMZ8etRRGoDZ6V9JXzX+747jp8/PXikYIUCdSoPo4tmiKYGtOfokn+coJo89pu2Cl+7/huHsrCne3KzCqLQ2mzPC5QUAxJQBn/8X/D/OaqN01xDIztqeFx0YPw5+jZZNCEi82U1t/s1jpP3TudvgtmEJHwO0/tMXgPgk+BbdpjUfNLL3HJ29zfJP8l59NCRDphuY3OtidnP3kf8d3kIf0AVT/91b9vXdrMnjAVIpDCUrcESVq/MtXEL9U6pa0ctPsbAp7sc4rxSuxxaSHcFOsZZQl6WRxRTv875fQ/xlZgsscX11z+8T0sK+uXM7GacgUx+Z7M34Eo+gHjqi0GaoCFJNT6EPy/f/mY17kFP/01hjT2ufdrFotn/wMiutTyGQnhnHXT/LHT83xH3hMQqeJSri0VYG19Dz9PjrIUizwUfD02PqF2d7ZZPFu0gjUmsZb0yYGEvJOiX/Hl/vRDDbznU/fxiEjcCr17lb5T8jui7YgKRXY8RofrEFGPMGdubK0yAm7pUSi3z/EYx/70o81VUcDbq5+1L6NxCPffKs88oAkEljH/SWB50l7YDpk448GW0ObuAVRoat40NLNDsPXYVrEGk/XzDD+1e69LSQ++H+yitz1x3UqAvt/Vn/tDkZFI2/ILK5NOIKU3KEyEH1btZnunNv8bJmcJFllvyXXj72lbYOBIEpHAftgNRhGRTK2CbdnQsRNqcfQBucp7EuDu3iltuO6mScgXuIx3xrjmynbO7k9uQbQmwAAAA==',
      description: 'Group customers by purchase behaviour and see which segments drive your business.',
      example: 'High-value · Loyal · At-risk'
    },
    {
      id: 'feature-panel-1',
      title: 'Patron Index Score',
      img: 'data:image/webp;base64,UklGRpgCAABXRUJQVlA4IIwCAAAwDQCdASonACcAPikQhkIhoQqtV1QMAUJQBgh7FCTNtjLSxB6AHS9t/9uxfLNPuHpTqp2cN6T/6Xqm/6X8zu8Z5MyHKyBDcMykWYh2cyWtVkFR95/OxSPqzMUNws8Or38FTa4OmZDztfsG8vQ9HNFrCgAA/v/+jdQJj6Rjb8J4KlM2sQtPK52GaPf2dDmFh7iw34xSy/dXuRcUNz+B/GuN9oCgaXAJyfoBTKlO/xapV2M4Sz5BX2HvEZkB4Rv7a68O2Otdp6sRvGqibElZ0/Bw8QJ6/zX/35MAn2e+xHK0X7erd91b849M0qsP5HaZOmaz+XCK7VRWVRDYqf2+wfXBOBV4tN1//lBPnEVIcpXgZfF2U6hvdiq8X+Em7TfvuJMqnxWFdUcOvw7YP9FIRzYq5IBREirU04Z9jMQlnC61Cnoof/6HnmMD9BV0j4UD9Oj/1YubGNK3Olso3wwla3eXYXDgLRFLM+YBG8cwnj0ob8NV2hwegJGG5QjF9QfkqH3j8N5fX9EwHNrQRSbmn8xGVP3xoJgxv/8xmzP+NLwfhAVMrEBz8GCoxG+uyDjh8kZ5K4UU7cA8AJJ1vqnPzRSnPJQQ1Mc86VHdtAuAIyrueIr0dwXWes7/xlEa/KSIa+6ZhWzbMTiJuTxVJF330ACdYLamPGQOVJ6GblK8u9TOlMP0gMsM2XcrkzP+W1OiLNkad/drxvP4AyObKefMwK/41+b+sULqFZAjgOYF1HDtbRZecXfea+f+uneT0PWuMEpHGhq2njTs4nqhff1CUTOJJ2DyWVyeEw8qlzNagaCJ/gZ3Dz06OFH1eotkTZ8Xf2coBlOuA//0Pbj0/0FnDZ/xFAektNluq48AAAAA',
      description: 'See customer value at a glance and identify which relationships to prioritise.',
      example: 'Example score · 84 / 100'
    },
    {
      id: 'feature-panel-2',
      title: 'Interactive Dashboard',
      img: 'data:image/webp;base64,UklGRqgCAABXRUJQVlA4IJwCAAAwDwCdASonACcAPikSh0IhoQquqqoMAUJYwC+ezRJGEM64G8zgHk5dCrwHflbe0HJruPz/F3Ptfjpkjv8BpDX+O/GDXMef7oxVCf5L/T/+KXfsCTAJxjRI+/OfhKWhznJj8mRhMvnNIezBbyCf7nNTVDruE0yuws4O4458Zvy1pDyAAP7//o3vFwASMZQ8/3sg9yufRhDmsCIc/iUc08u4ta9OX/OdNeNMrR3L2wDeJuPM9me/Z/+SYIQjsL2D6ui/TRdApednqN84X2EkQ+1kqZ4p0qDNEi+VhIV+qNbyPYL2JwhhRJQi4TWj+4n+0E4sAHN6Mt2xy0Yfv7wkdxPT+NmXkgUqoJdZB5odT1UaAI46L5arXo5HM02XbDm9RPlTuF4sa5ldN/I/3xru9ha5nIel73+C6VmjprDn/HiaE08LH2bu0891U0yYygePJ6t0AO9euWBdH3aAf9Ci/8388I/+rJ9hX4eqN8g6e9/xcYpB8Dvq+zhr9dXU/7A8HI3TTKtdnRdtIytigNdBJiSs0Biqje45KDguff+CtjcV+0gcqX/3BIbe5qNcfA6Frx42W//jGsGHBCc8B9jRilv7FeUv5uKqot7e2r4MWGcjiG1h3qtnV+mcjTrSmOH4diXcf/4Gf/xzg4PU17YiGWcwcyP5e9ahbYGMWXw01npmZUustkYInUD+j6ePz9KSrtxT0bq+3QMvkSGoDbRvbgo6MT/nZsvGD+lALQZrCmaoDcx+Ah6uwhaHj49GKfEeZeSaxwWG3CAq3LiHyLELpg9chc6+HjhLnTLVUPin+h6x3m+4UWRFBAa9Ospucr1da8SoVgs/y/CkaFtj9kKwpMWPTTdyNiTRFxUNf+FMyQKVgzPhyugucvXIgAAAAA==',
      description: 'Explore customer and revenue trends by changing the date range on the overview chart.',
      example: 'Customer growth · ↑ 12%'
    },
    {
      id: 'feature-panel-3',
      title: 'AI-Powered Recommendations',
      img: 'data:image/webp;base64,UklGRjgCAABXRUJQVlA4ICwCAADQDACdASonACcAPikSh0KhoQnOAtoMAUJYwCxHsF7vk+sN3WgbzhLZsXhAgV4B/aeMGMZ58Hp3/ge4GUGAGsmN/UVtiL5z9KvQVmEbJ9L16VeR2TMA+Zf8LzykD03mV7PBHWJdVwU+K4v01/83bUAA/v/+lEXfVzInL7TnC3vmGXSr7Nd+ndnlNDJTxLzOCH/Qnbpt33xoMq7fF4IP2xmtf41aoOq2LGhUrpus0EwA/Lf9/5en/Et0dDZH7fVPPBmsH4K8XJIX5/1JDi9/2ac1Nqar9wbNo95dc9YG3glmpn3qNLZ/3y5tz4zV7aCleHIRY2X4ouAzrfNLwiMfMjhoP+DH6SDfuPfZhpmxRaRRkEBPbk0O8l9YAK7WkizICLZ9u8ATEEnPTVcTaSsiQTf/2ClHfqfyOeX0KjKtyXHDt5R1TrYii0mIh/5bq/z/1qK/7QPVJvvXx2JQxGX5QcziRbZCqYRvTvhDRkfFov+5KboG1fv7ySP65TjY3HP347VIB7wSdm9Lodo8K3oWKOqeAO5GTqDQZwDpiRbIZ/9//HGsnDPrWr0jxwk2G9P+D+j1+Z1yHoOUShNBLNRaArYrzCyPfPXsJa5j+l1UNv+O58JPHO5/XhPyvNWBggCpl0xT5z3e5nz3H1gUb+SwpYDzZEJYAYpW9xubfhwWO8QmiyS5RMnQYc3NX+vtHd6A8okAV5/D993BoE9Z0p+rtA6f7n+snw+D+Rh5QAAA=',
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
          <a href='#reviews'>Reviews</a>
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
                <Link to='/register' className='btn'>Get Started Free &rarr;</Link>
                <a className='btn outline' href='#about'>Learn More</a>
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
                    <img src='data:image/webp;base64,UklGRgICAABXRUJQVlA4IPYBAABwCgCdASofACAAPikQhkIhoQwCAAwBQlAE6ZQjtEapwCYztiDnuI+r+JPGzVEzJOOT+2bUSfxm1qPmK+2/qs/5P8s1DVzmCwc6s6gLFHH7tzhGJtJERbmQbrvEAAD+//7/e0lp/pU19RdCDAxe4X8SqWh8dVSlZMw4tSmlJWIa1BPppa7+1bvqLJicpH9zuxAdh4odJAKbU0lL1f3x+rl4EzMc3Nz+/+HlPIOevMOPBMvfPkEP3S5ZMGeAB1bU7ECNmdLawjhVy7/k8/y1P/n/xDhqcJgF9U5AGpYDXco68q1LeKcnRTzqZ7d6kAHve8+b8z7LYNhGC/1bP+HrJdJ/GD8Wr4/OwPgsXtGvOGh7qHiL+M4680p7AV/P9Ay//NooIh9d0kOWAdEz1Bm/mgd1vcCf/d+HHuv1bVjQPCDxSrJGb0fzbdmKny+jExOUr95lzkgEJ/zc65B5vJs/jAjHlDjmxTUZWLOIfhNahu+n/jj4ACbViIvsplxOJeyeRGKssNqhdvcPodAl9V4bjxT6AIKEauHKWj5aVQIZBH6+1j52Hi6u6P3eWW5ubh3mb70Vun3N10N9f7ogyv2wswrbCAkBdk4unxxJlH97RVjn5kzLSRWmyCWUs23JN6MdOZaeBbpNDB8p9dqN6rhZlNqP8TagAAAA==' alt='' />
                    <div>Total Customers<b>{currentOverview.metric}</b><small>{currentOverview.delta}</small></div>
                  </div>
                  <div className='stat'>
                    <img src='data:image/webp;base64,UklGRtgBAABXRUJQVlA4IMwBAADQCQCdASofACAAPikQhkIhoQwGAgAMAUJaACdMzQ+MK61nCFbyOcdv+Lti/kQNQd4MHkweoNoa9lvVH/wX5eqGtVGCBFJvAAHgbK2WHXI5HpINJ2Lz1iAA/v//A3059ig8rYyv1UlwjnMlAiguVy1h9vIGVjHnY9mc97EyJ/F4tm5AaA/2HX4XhKg1dyPh8GwT+cyWUtBn0HY/wgBqixC/usIwmgn1/oYKIGj50DtRCuSz4fP/M7n/7fsewPbD/4ZkcsP+6zl8latEurbWvicnuYi8u2S/Q2YhplLKWWP5nb/3WVdpnVof85/8WG+c35M9rJ2+I4A5bdmeql1zGEdhtC/hgbq/5+ut50P0cnqZNRXZru+DbfkRi8fWN58XmOV/5TMR9ZFC5ixzwsCxH15quPLex1UKK/3Lg8O/IBT1UAft/+8aL6biELdd+MyfI/zNNlpPzfRygBAOci2+/7SnmcY6d8U3LdJ6SEG1iCyM1Wz0hFJKF/JFDkOkIoC222/y+6kGtOtkQ38UtplFgkcVHQe1Nj75m+hoKV1c4tRCBIwzq/2ixJpafzf+czkZVSLoiZHXczOdxmJ7ainzQ4ZW5PsP2HX/mJbQAAAA==' alt='' />
                    <div>Total Revenue<b>{currentOverview.revenue}</b><small>{currentOverview.revenueDelta}</small></div>
                  </div>
                  <div className='stat'>
                    <img src='data:image/webp;base64,UklGRrYBAABXRUJQVlA4IKoBAAAQCQCdASofACAAPikQhUIhoQwGAwAMAUJZgCdMuN7WIK22MXmxm+PSKTiwFTAeo3nreffOoXQp8D9seXxMXfFXg8mhd6TXz38DtASBVmDLTAAA/v/+/3zsbbTXyY86LxrtHu2fUYIkn9XS94szQfsmL974S83/3dttJ4rWXAoUPsKExGz/NnyZdEa0zHjUpQnHKb9Vn8+qtZ/ncu/5yfFPsBs58y23N//dP/73SvfNsSOX+ErjjXslNTqiYuguQO40Jt/MhSt/8w/Spw09Z+/mrpBRKsW3V+BQt1Ny95EIuVrBMEycVsDc3Pk1QYdRAl5OROSbm+X2XTsD5/+f+6cz8n5+geLajSlEZ/o8KVPvvjar5S+j5sD+kSL7n9cLjQd+bYJMOndE3SS2Pfvyj/6x7/+6Z/xoRV2f+KgZFqu9P9DFiPoJyrA0deVhf0/6/e5PsbvGXFBkHG8uvR4JDMu4DhsP7sZdVw1fb+8ebNC8ho6zf5r6b9NzR8+/2smOSf21WZkA76loBfSt/dgw/0hNm3SpsTOm4Mv9uOFiEdiJeQX0U7V++slAAAA=' alt='' />
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
            <a className='btn' href='#how'>Know More &rarr;</a>
          </div>
          <div className='benefits'>
            <div className='benefit'>
              <img src='data:image/webp;base64,UklGRsgCAABXRUJQVlA4ILwCAAAQEACdASorACsAPikSh0KhoQjiwAwBQlAFiPc0udcA6AHkwdY76AHlgey/+2XpGUe38Xsnb97zJP4q5ZB8e0SDxM+Gj57+e35r9gf+Tf13/SpfegRABxE7j9W0Q/D9dcP8JPY86IIu6+g9pZ1YRu7hAI/f005LyAyD3Vp4CQ4FiTnh0CeFHWmsAAD+//7OS/3TEgnDX9FO3S/QW+yRdxDWlsC4fP/dX/etFmno3mWKn+IlINDoNqz3aQV/jHiuIu8Tn5kDLCZ5aspwXr/4HI21WUPW0Xl2IPfWYLSv+cFFgDk225PpmwBoCtwweapi+MxxsWuRMrl/UtWtQ/5rzKEXjQ/3ufgB4a70jMRBMiw+/8YKAgjcJ5Z1P09qz05s2Ng6dkJNUz3Tf3/fe60YSWUyOM2Q/bXvQ1dm9/BlvawDcucx/eB+3J//pWNSjP77a9pJLXrQZ94AI/gi+aRxubyV/+MX7OaoKO7gGYDk3UE2YJOm8SvTk0x391St8z8cjgx/RvvfidTuMfZjKXZ1TcdP3SOQ8nxaK2VIAdLfk+ht/umTFV4j/4guohqVtA7QhrMldx/Mv+woyYSTOnsafYu8Hdq0Hl+eml9nRdZn9fiXFlU/vA5+tzKVb9DwDrzb4lv0VB5K3R50v9PQbmcGvAZlQGMNl69yLK+gax1iE2H6byQPrMmut9Og7+6xuXaM4Ywsp2iPjHCITp0eXhjE/7sMOfqMogjwNLL+K/ePWPvVrgUi1pfWRpqTVmf+o2tX4e/nakddzDGDxYZBq8z2viTP0wuj+Xv3qy98EJzvafIbJ/0AG/7Tkv/i+V910gLu/8KPgCgEl2/AS8peQQJGZb0bgVlgl6mNp9+qduILO2LbRaqJyTAm3XYBV8wzNZv2p8Vle9UF+yvs+xCfC86od21/dy7gfHH1XmzkAAAA=' alt='' />
              <span>Upload your CSV data<br />in seconds</span>
            </div>
            <div className='benefit'>
              <img src='data:image/webp;base64,UklGRnQCAABXRUJQVlA4IGgCAACwDACdASorACsAPikSh0KhoQjjAAwBQlAE6Z6omAJ3UDngNOA9CWE3fkrj5PyAz4GOP0GvkJMPc0n/IKTbimoysGdxgfStRs9LJ9uIf6AWxKiE0kpBm0KWoOrTlC9kCSOrmdvyyNQNsmH2sdQhkAD+//7I7rNVnSvNkUCDq8+IfuoqyI7UXpvZwRKSCSaclFwsKYZOQ+xTXffdy0fVLjx/HJEMRMeo6nIdb3gWhtjGOdGWur8XunJj/pwSJrpYB8tN/Ihb43baaz8n/Mf95IF4lQ7O7riz/ukKsbsqaiv1gK6DxFnJEvjVj63DfGb7LmJ9hzhxloMW0+varPxYfxT51L+D/+rjb43mg2kHHmf2P85AYGjBOaiHBZxG4ONiwrpXPvI9WmYmn9a0semL/HAfQI2Vh8TzKhZvweqrcI+wMEUcWMh542ceC/jsBHxOsg03jQeqfh0HtMPvVvE+f8GvxkB1ObbevfC1Pk1ervTx0wzacfBqBRAZfIcbzXsZH/Pj8CI9xkxrCo5W2FfwYxOh3cEarBIV5Lp2BBV83n3x/p3EEgJeMlP7QBUOdAbNwgmWf/RZLmf0E08YS/rTWlqnP9TwsB/eztoANjtp9/+LWkFembp8a7r8BPc+t+ki4dRnPV6a/dKLIEDap0QlPxqcaPELBM/Tf2V7eSmAvdBqu+GjjwW7DKFBx4v2VYVXzrEwvGxem/pYbYK1aWjgSdsVaGzEcmCIaGF+pCrWd6Usq7AVgiHsappOQdfWYX6LqAFzI0wSByhEnDr8cSldelS5ksmgPpsz9LhGr8Fs4ZNgJGQThh/GRAAA=' alt='' />
              <span>Get detailed insights<br />and customer segments</span>
            </div>
            <div className='benefit'>
              <img src='data:image/webp;base64,UklGRoQCAABXRUJQVlA4IHgCAADQDQCdASorACsAPikQh0KhoQnOAyQMAUJZQCdMxHDzYDetXbpvLEm7Y+78VZ8BwgdqrqOf8B6nOdn249wb9P/9n+Z3GOmsqe5/nk9J1dz+NpfSmzMbROBb0mqi/7VdotA7LLtSD40zcRkF/qg6DBJoyPRIvqtEIAD+//6UUDfv8Z7kN6RO0Kjv7x9XfEOf+VUtIv/BCWAq33r+9llOHATB382XzAuBYzSeBAy78zqYDRhuuB+AdKsQvlT4Um8ICAuX1O8fjm/OY+DNEKzeCPP2mYGC7et9rr8/9MKC9j/sDOj55Jj/+2H+Xp/4IA1blYhfvY+xSjsuwnPuZiN2bfX+13/mkUzb3K/5pjmvxrheQDPKxlSWlB9r/xfPsTIbeBrsyjvXPIY2IQEtz0p/7SiCetKAeQ6MXyULAKwJMljfETMiJse0rQe54LRJLmHqX/ceX/VL+dy5SZ/6iF929Ut/TFgv/rT+6k1XI/YeNhe4c23nrIOSVksU6E60iDWoIPu89y+wYcfsrsL7xFCeNjJckzpJlN5jmoZROjWVBiTOqODReXgS1ncvdKJ38MZyd1muDsRv9WtCHPsn+3O5/uzl+J57j0LziANXoBFvFQBkVj0hHSUUB1DpjpwbkQIOkgoL8o/5Wfs/RU3nqq8gEAUEOn9iMait/XH0G68TQyowFVqBSFiAfoJINVNC965rPqS+zxNY/c8a1XyOBUwHnte0vY2nQ8ChEBHoWq7dccMytFQUyhwrSIrwB6d6qfXwLyqNHQAGimDSArNl76G3j6XjnjfIHW4RcF9e3sSccdcAjr36wEN4T4asLJmAURU68Q18souIx6lIAA==' alt='' />
              <span>Make smarter business<br />decisions</span>
            </div>
          </div>
          <div className='laptop'>
            <div className='laptop-lid'>
              <div className='laptop-screen'>
                <div className='screen-head'>
                  <strong>Customer analytics</strong>
                  <select
                    className='period'
                    aria-label='Laptop analytics metric'
                    value={laptopMetric}
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
                        <stop stopColor='#dae9fa' />
                        <stop offset='1' stopColor='#f4f8fc' />
                      </linearGradient>
                    </defs>
                    <path className='trend-area' fill='url(#area-laptop)' d={currentLaptopCurve.area} />
                    <path className='trend-line' pathLength='1' fill='none' stroke='#195994' strokeWidth='1.6' d={currentLaptopCurve.line} />
                    <g className='trend-markers' fill='#195994'>
                      {currentLaptopCurve.points.map((pt, i) => (
                        <circle key={i} cx={pt.x} cy={pt.y} r='2' />
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
        </section>

        {/* How It Works Section */}
        <section className='how center wrap' id='how'>
          <p className='eyebrow ruled'>How It Works</p>
          <h2>From Data to Decisions in 4 Simple Steps</h2>
          <div className='steps'>
            <article className='step'>
              <img src='data:image/webp;base64,UklGRnYEAABXRUJQVlA4IGoEAADQFQCdASpDAEMAPikSiEKhoSETPMxoGAKEsoBlVhCpZ13BVgE4Hm4L8YDed98A6XP9rvRyo9n5KZT38B+TnJ3tHf33Hk/3f8sNSk5EGMD/d+ptosehfYK/V7/YDOOY63L8ro6S/bOW3+FhftFLyOiLcJ9WI+d4o7uFl0o0HULuh+JN38FqArN+GAjunNSSl+3Hv7a2G5GBAcxplcjpcyL0YKg4rtXznz6gUv/M1I97gJU0cuKtbuAA/v/+YkLouANWO20vaXvC/ROLw7K9QMln6lvZlteV2HMsE2VWfKDpsainIBbl7LtoUFlfGL8272LZP9NqLokEKC/svGojBZdSK2A6D9dPUG7kZ4CWks8bd1n5XgJAOmX3Zhyg+MyotvQWQtIhMep+X/IxJ+KgHW50B7H6AAYh/1Yyvad+jXMQh51qU21UWr23Vq4o3yy8TlyWi4a5jg+FqX8AgjRW+nKIKHx1/mOj99s0/UxwGvu8o2ESBs8+zPgwEG+AYWCRL++VDztX0V+vL/muCbObV85oJ1TyHsgiPefbUaF3BnrLir+Q79k6t504UHjHb4sPd6flc56gndlCGU0hdmg8tqMli2LhngFd06dEXsMNy7HS4E4I+7HhujZZ7YiF95mabWkC5+1ery3c1/lfMitgTfw+jc5NL0SuYvsFK9yzTPy+/Sql2AKLrRjBP+mv8IKYNRzm6ezvn+/NOMt7vixP8VD2w+rU7ZVvf+vaeDE3Z9jMmbpaOKsdY90Vzdq5+ckHzxE6ne2x5dNb+nhOg64YgQfV4JHfaAdUtEnUmAOrO49djOOpdnmcdfG1YYtAj/ClTpD8JfVC/3uvASgbr9/TtFHuyaQ/fXVraDcWvxFILlgRbHFBeN7edJiMTfGJEpCfEZVfv6zzPGOpXWUu/0ZZrhLqwETeIrXyJn70b0o4d5vO6zOuaL/ocB0l0n8DHs/o2v6wSb80UoCZfUarw4dKV57+nhxHruBi3lMs3rv8wIFbT1+cPITkLxmynUSvrN0P5Gldc8Yv4Nfa8MlmWHnbkbdWX0rDIaH0CmIfVFrf3slOe/f8X70kkqIWKrtnxetuPvnTVv//IrQEO7RlMCXaaiTKaekzM9m93fgtK1/xv392LM9SIFV3wDOzciQ0Zl/Wgr8RYXOhIN8f4vpqz4F7RkbQwEOxySzIjTl34PHd832SD2D/jJIYNI9F6yBUijGZLsMpFpWgdU5FSPzfJVE6aLHxCpk46wSx8nv70t09FkeNk1UtK9HfmGKluyh6We/bCti8gdT04Kbb8TBjsCMaA64qomQkwyphavzXnhaqZrQ/Z7CLCufDMgG3lBkVDY8a1xuOW7PukgBPVp9ep5dX6B/yI0xkwWfYe6fs/tqKIwgVSlhv4M3kb01lk91PvPo60l2hGpqQlmqz7wh0tgUYNdsL01Tbvcs9ELysqNorv7LUKfzfQKyM95IDmJG23vc+9kZ/sWYRYvEk1TK3sIYjGthvq8VYRDoYTsAAAA=' alt='' />
              <h3>1. Upload Your Data</h3>
              <p>Drag and drop your<br />business CSV file</p>
            </article>
            <article className='step'>
              <img src='data:image/webp;base64,UklGRnQEAABXRUJQVlA4IGgEAAAQGACdASpDAEMAPikSiEKhoSESnfz0GAKEsYBk3hNJKKsHPfv9Es9nb++YDcVep059X2lf2c9FV1qvJ3oduLUuXt3M0Xx+/T3/S9wP+Tf2TrZei4P3qnksBx6nrtZubdF0VsevEM300iea3UvsX1Yx3kVrTo0cC75KOKzLvis5iaml5o7qnYsE1i6XO7WoNff8gABlGHdc0+mGp2Ug/VGIY7SenZ9h0i3BNcQvE2c4YlYga+Y5z9jbHOGg84hsP2b4CSPO/eQo8AAA/v/+Wpb0OjSZw4cc9EGkBd0kb40BIYgLdGp8AS0fFix+w4JBtfwtHaBoNnh6gXjg5HCX2Y0clOQTvUhhVgnndUkU/Wufiw/2i7I//j3WD0d82QcRjB27FEoZxXBFAco2Na49j9VF3BxHZPqgIoo91bnbgDfz3cbjwpNZKGJtdzcWBgwUTOmkM5aukrGzE7WO64Uk8kCg//e9Zt8WFM+mF42USGC3mku+ojvfpr+2yxY/p/8wH6qqjwVXIfKHm71Da2TOe1ont3kzpAwnB0wlXgcNvCtq5n0gUjScklX6iPpaYfCsPreirj1gJzb+zrzr4V/owL77+uRa00wc6WVqo1xxzl0scYOwZzPSId8qHZmB1y7/HrmRP9b9PojlM2my8tyGTFVG3drbjcrNmTpaL6XSkOHUbxqWXgxOVKQvgddHnZ/7r59x/yTOSjpRDWcCtotRG1d3pX/Px9tX5P0TNTMefq/fP8HT6PUvxgYkzshxY+867IHe1EiW81GxueiNkYgc+rRt25qaYkmwB4D0Q5fkzzRsJ//GgfyTXbaaP97Mz7B3B4WOhFuKOeRnkaltOyLiKCHsLD7jsGiysDZ6PDOUXZlpK//cyxHEZ1usxCkgBKfrM0hWEmOH85i45wX5vXjQI4f1bfexPf8XJwz224G3nFHD+Iz+svsOx7nyzOS426qkhuyLVe/JCxFqEcZ3Ge/+p1Ap1wHkG1KGS3GqzSD7ckdqv2reCu4jisRGhxrFcbqSsCWso+MYcb/I+9TyB3BGpdu+HQd2zp+jpzGhVHUY0LI4+YFH84RIatWP5K240ol8+IF+joQiD6Dp6t7I3GY0Lf2w7F7WFmyAUuDHv5trrskJESMrW6aydGFurJ7wF5Vein4mFhs6ZfgnxdQp2lvnCtzwNCs/Sx23bAIC6upyDhEuhQG5ehiwaj84RT3Zu8DENvZz2NuY/yJTrsYiOPP7CFWy59EfbAM5xiXsf8AGP1yA8Puhzd1IROm2tG2sMvnNikW+KFPhs1FX2D/hKeRO6f+qAk/hjJnxvxC5FZLIpZO63E5yXiI9L/yo7E4VE6xxBXjODXlh0OMUzdz5jDB6v1isPftl9C+XgBniwk6NQgSKGQ+WRjdN/PPxcodKIjS4uD77B9egpYS+c8w8FUdf/IU2cQYQII7SPypiI4mQDHabKpJbXRw33cojjc6Mpda6cCzL36zdOFPI901KigxAiH+LllY9gJQAAAA=' alt='' />
              <h3>2. Validate &amp; Clean</h3>
              <p>Our platform checks<br />for errors and inconsistencies</p>
            </article>
            <article className='step'>
              <img src='data:image/webp;base64,UklGRkIEAABXRUJQVlA4IDYEAADwFgCdASpDAEMAPikSiEKhoSER/VVEGAKEsoBk3hoM89k/JvbfFd6h285eib5afs0y4z8esfd+QGfV/HDLL/on970hf+9al/xyvOFqEfqj/tuwuPEgIkWzkyjJXdra1Rm0GfkJQ+lit3M7g9+T5ZQeb73EOiEtV14UXNKwZ1atyvAWtCuG5kfeCcDLeoUY/+/KhST4vL7QoiMbjH2OXrz44G0sZiluMjeGRqGvuMGy2VD0LfwO0Rj8iQDAwQi1KVgA/v/+WjzwfbOTiuC7XjD3BXtR4JIBVuS7EwhHyIhOa5AK3bE0uT/ISrw6l6aiXvDVyeV8v/g1cg6z5hxSph2aghIsj8h86fOuLKuuHV9VnWAAgj2JN7yZFVYpM1g1BpTy5F8s8glA3eIPNbC35ovTROso9PZ0n9Ps0s/aCbbn9F8rPmg9XtXoonn8/fi5R55O3AIG8Zv/yIPss85hdMEnfvX4DSeJrt5K0gyyzFm7B2lytsXTdbfdOzl/5ymiO+r3e77myc8nBCdirl/8rP4sPQpu8j/wvxYm3PSxtkJP4Jp0RsXS4/3RlslwIC9bTswPPVaTnnGP/797+5f5L/zQsEQF1L/0il48J2nD5UkYrAb88J/hr0aLVUHPoVrj2M+7toHVEbS6l0lYwHcJinvI9Q7FJ3gqFvS8bXtazgOuSWyuEpKWPTVQ//pwLGd5owK2/7/2N6egknfT8x7IutzAfMLcc/hjql1yF+GUpDysS11/EtWzEgQ3SZ+uGCGYkrT9dEFzFv+HgBVILJx+CUvHPa0Y2L4ACmY78uTPrr1fKv6mG08ZKDDCcQl5ajHj/QBw+SskOmSrQJosJgx7JR+0qfGX/iP/DqqvRTNv3I//zyrmXpcwl3fv5QdAB7/73EzO/twhgYb4s3KsDilFc2VZFoBDSVPDDqx0oT3n7XXPIj6fKPRLS4tlOkIVXOeppC0+VdGb626Z6gE9516vHvJDC3rNNviv+GIcvZ78u3m5lwh/qIduK9J0kIO+KLv5h8fl+gqvGi9k8F/pTc6GzEpZzbeUNd4wv85/pu/yno+MrqAlNAPcM1D5GSCNgHsJP6mvL2jbSmbvzSXLtb4GSg/4HQn+zg8uVemDuZ3ZyZN1+AO0g/YJKs3pPODyRO/KfmhGA8D4yGfjLluZeGfgr6Amovjg38uNZaclrGZIW6xKV5HzmSivzhnFcw64uTPkYKTnhNUzwNNxWEju2tVtiy8IsSi0wJfN8rSKSxOWrRMLtnqFWLTOLunYtpCRbS09ExfhXO/xxpWLjdfoOtjQlx5H4dX7pEs8m8y6qbI67W6RjBE7WzKRFWiX5STXI+v30zn8fyMlHDxofVYpugDGgvQd311i4MZgBwUkwnpC9n1LvCwuCwEZohMXOAAAAAmk+EZRQtmYYsKz1o8hjJVg0vzVYSUPYAAA=' alt='' />
              <h3>3. Analyse Customers</h3>
              <p>Discover segments like<br />loyal, high-value or at-risk</p>
            </article>
            <article className='step'>
              <img src='data:image/webp;base64,UklGRjAEAABXRUJQVlA4ICQEAACQFgCdASpDAEMAPikUh0KhoQlO/pIMAUJZQDIzFWSVqZH0FCzGD1itN53nyW2filj1eJ3XS/Ev8a6Ap/t3IuzC/7X6MH+P9oHuk+lf+N7g36t/6b+jfuhwwBErZQui/+JgrU38dmquo5dURjuBLro72xINhTVUaGu9QbDLw3H5u8etbvyJhTHHuDqDVpTuVTKeb4deNR1BYqMFTQsarzxMsJQq3v1IiasYkf+9pT6mf6zZ/j1RpdEeAnbNbgAA/v/+lDbOCVoSPYIQF6T9dRf4I6lOQlBHYNZU9GLyooFEf/9/wjUxQ0lwIBYw8EV2ov3sYlMydk15gdoaZviu6VIf7UuyxHi+UriQ/9p6RpXH4dvWyWSHPKDJeNpKLClvsBQ2G52rmK3B4QMC+4SpYWCPGl8DB6eoQFd2edK/+nRf/ywKhvhTZe4zHNqcs+gnlvXExu5mUoOTTySzKWDpiNZww+FCUBDIBbXduOZCL5FddDEv3R7bc+8so7H0FTk1JuUZMrDnD8H8648z47UvH1w8WdV/q7v+J9T3zHtF386bg/8AB3tPtn8LPELHMc5SZEaIOZXm52s9w6qJfyYm/ZNNr/OvEW0gUEzPuIXNXFxcbVq5YuPJROCObbqN1Dfi/MseHlK9zRv/UoRcJwQYzzp1Eqqz/QT3OOOFlKuGi95kQL8oGBN/H3PqSr+ILeoq0AgpnvCf4q5En/fUD9NgZZz//FeP1xgJaYhxmit0vVusVRXASehwZfDwG7d9blX/+OFYqXyBKdKfhlKiCgCR/ePjbxz/lVRAv+vjqOH3TnQhjM2i6t8xkej8+bMFqExtb6Wch/xyJN+hTQ2XAaKdYe+hKdjawhW2UZXfr9V3VnghYKrmlE2GepG6Sw9HgMOT0cZwYdDL6OosBYl5jPZ+Gj1KzPAVA/ZpJirZJE6whb26UeUyh288ZEqP7zl56VdejZXS9iG/K/w6NG8rff/Q89vxdAhqcQdqYydL/5GIT/fLFWLx4bA1+q+GSU175VYjtgr5jST+SXkBntj0NJMONn6cLNJ2aAzlsoGse9LrWcSxEWw+MqIU9FtDEc7A8VX2SsVkEGYUMjuO9t/yQh32L//1fI81wVaxegJFkHwoXaroV+6bPT5D/g16uKI7z1R9CdBilHDz9R0KFD0zPnO0OIAGANqez07sHBwVpNiWpH/vtid9FOeXjcFtUilVNkOLviMhneyJyCz/DuKaDU3IdB4DD8mtgHhAP/N62AC5ZunlrvafezpHlM/aZinH0A0gSGqZSYV0oO/KGhILJfD0eeJBMfMGPSbJx/29c5KeRNNK8lt3MokNrTiargToUGGgwMwRYigKUmMNwov4gzWViRK7AHlcFK9s/F6f2Y6RFwjyZojRb1vYJuNhppXq4//K8ZHoAAAA=' alt='' />
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
              {featureList.map((feat, idx) => (
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
                  <img src={feat.img} alt='' />
                  {feat.title}
                </button>
              ))}
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

        {/* Reviews Section */}
        <section className='reviews-section center wrap' id='reviews'>
          <h2 className='ruled'>What Our Users Say</h2>
          <div className='reviews'>
            <article className='review card'>
              <div className='quote'>
                <span aria-hidden='true'>&ldquo;</span>
                <p>&ldquo;The Patron Index has completely changed the way I understand my customers. Super easy to use!&rdquo;</p>
              </div>
              <div className='person'>
                <img src='data:image/webp;base64,UklGRg4EAABXRUJQVlA4IAIEAADwEQCdASopACkAPikUhkKhoQnOApIMAUJYwCdMoSGhIiq/XSCxQqdvNzSlm9T6Dk38Fe0nJE5Q7JX3TOTf27+U77/ArtkOQXkD8+X/g/wv43e3H6R/63uFfq7/vCN9looC18suBkvkt/CjPg7vfJno/c2/44AKEFpaSx0KpLsjpfvpnVCFNGL2OpxiPWteDSuFH9zVDtDsAAD+//6UhOM7b6w8s9bxgj1/WODQz4xOFzVS+IWaJ1CQXRnfv/Psyu4scqVeDBriKkBtUHoHgJkGz86a422kb0EguT9MK+/gemhnmozlYdfrjS0uSk/4M9MbGw1vymGgHDXa7PQrAC7eZPzAHf875f1KhhYKj/aNXmOMVqX+7a5zXoiXU3y6bLzif4nBpeEvriDFf8fesCVWLLQ5skO/EH28jYPX43aXqXPnepfP01uafsshQzOeD5rygeZIcoui9iBb+M2XSH7mR1lwlOxCU1WtQfozU8LAXbvW1lf/BZ34Ka2Gli3I9FzQGExgW0cyJo4suHEXmGyhDDQmatqdfxXUWDPLccl2Av+LaW+7J47Jinu0fw94kx5sJPRTr9OesJv/ilsbcXLWTl4XKrReYJVJ1riOglWFouOtF8E20zfQsf16sz3PfdI07l/Dz7OKFP+53wcJPNz2fPOMSQOmI5UqnGerOadbUGsGg/75GqV6RuwXtS0bTQKJ1Yc7uATnjn77RpYKy/Gf/HEazDW7TngUZKm4nN729yBF2nGDyyZg6IGhmFA7bp4+k6T5TTwY3rcrqjmZjf8+YJ6GwVcPK/oYBwlzCoRh2smQIyF//OL2gQg7454Uwfoutdk/HklZI+bA+FhUQi9WrqxcDvobqZ2rdGCCfGPFTWqWn2hseLsNE+Jhw0cptNvlZ4jMu5+aIvMN6SNWYXZXNxOIZWC8Cp6mTDvD7YyPbPw9mJAyrZXLnT1X3Qzm23SL6abWwno3gnqK9fZsU1mRUsnKcK2XKdHejsDLxMAXDfv++2Km7gboYpfhiRyybtkl2GKergWz79jzWip/zFDmCvRRyfV0xI+BCtMLG95vF4v/9TMmEaaB/k2t/s+Sfk2/FZL+h1/VnQDixEOPMYXKnWTYd7OfyLJ2cKYxV97+9bDHi3dpSb03578ec/uyQsC20VRpEfwwFZ/iNFKv/PW1FLCTWJ36Q/SbM5gNz1vdIs5EBsB3izn/Lniy3sBF7K1/2R25TyMHE2nVEV3+1uHGP/v//1enpYbfleas6i1So8D1JJ228L5R4Midu04r5Ebs/nP3A/GBtQv1uvK7SbIMp5Z1N/LffeDv/wa/LivOQbtkN4o1GjobX6MUmPDSU9/VPG7eDZaGY0ZeVI2rUzMAAAA=' alt='' />
                <div>
                  <b>Priya Sharma</b>
                  <small>Retail Store Owner</small>
                  <span className='stars' aria-label='5 out of 5 stars'>★★★★★</span>
                </div>
              </div>
            </article>
            <article className='review card'>
              <div className='quote'>
                <span aria-hidden='true'>&ldquo;</span>
                <p>&ldquo;Simple, powerful and insightful. A must-have for any small business.&rdquo;</p>
              </div>
              <div className='person'>
                <img src='data:image/webp;base64,UklGRugDAABXRUJQVlA4INwDAACQEgCdASopACkAPikQh0KhoQnOAtoMAUJQBOmXsICz3+5a5cUfsinRbbrPM+t79ADpcPJVuYHgv39PTvsfk13wXgu74b/Nv8d/Kd/GyRxAd5vhaI7/Px/3vMf9H+wX+rX+74E0vH/2avhn3F4E4hCd81mCPi+It8tUeN/bJJNzkI1fgBDLpItx3aDOih9f8pYg1xdGEv9n8R7EMTkAAP7//pSJs05ONrtM5QsrJHLH/c83fpsODcUZ8sBPsu+2qAH7qx/MFmMpeeP7sFXD33aySMY3nxQdxgu3s4ulH+9SPZW4Oiw7jPVIRJaAzHZq+VQGnMA9T18HvuN4ypGWLPmv9N8G9I0lYdrDjb9leBaYn/0bjtdYqWPIF6H4fHf08WizTS/nyRzhUiVLqTfyZmf/ySNAyT3aIVRbBEaBAFkuC+4P3pzxmiewmF4MvP70tTx1IX/kmOPlZEGDoRMDDkhG3xNGc2cAB5gaP8qpfhzfNYVP1BKpl1CuZIeEy+ZSjRHcQQEOcBVD9V6bRkQfdbQzYW0EDuQe/64HWDVcsKVqGnP8JXOmCENufvaCXVUKtqrLOA3/4N6nYR6B1txIGnNm4JDubQ5G7ioGoHx1o2W8qepqokTzp2PMzd2DFGp8v38vCIZ6xmNmufqG8VCzriqpR6d6IAPNOZuydNo2nonACf9V030Ub3NGhjEgLv1J17j225XMgm3gErH+tQhT/pjm6qHwddQuBwUJtxZGJ0CLGNvSBa2td2GEZQAJLFLaf5WDFy2mrPwGrDSkQP8kU1sCSH7Ch7ZWWzQpHTTIKDJtmh3kWR+6e//sHCed3fhG5L+e71mrHv0YoX6+wD0S9qMhHBL91JpWdgXI0usqgVw/HO9heEg+BU9qos5jedMH5cW+FRPxdBf1oYoUudeXThDzZ3+SN6rd9hOkzF1c9J4MCR3pl7EP74AVTG/fCpBiXlHFn18qi5xLpVELBw6bWQOUVolf8UhwuZ7IWTV1fHiwE11MoaNg4XhsoJCEJOjBO398UX84dfkSs8IIX/r8qmAP92TtopY1rIcSNhkpn5HbAaPFGhTsTzwCVaWGpcurSOLxNe5TKWx7X66hqY3NaAyL9/69/OxFfSR6EvfQmwSav9Nu5r2kR7Ytj7uDLxsQJJDSDK9TDe/0K6A4FXp64XnaQiU2m4w74jrNhIBC96MXp8TdzkWABeWUg4RT8tSfbbvBYkEXL80JvDFRV5eTKpL/nblHVdQ2HLufYG5FILEYSQDXqKTNbv3T7kEsW0gkDuR612llemCjWimRj5cgp+JnzxC2K4SXkjbICwAA' alt='' />
                <div>
                  <b>Rohit Mehta</b>
                  <small>Shop Owner</small>
                  <span className='stars' aria-label='5 out of 5 stars'>★★★★★</span>
                </div>
              </div>
            </article>
            <article className='review card'>
              <div className='quote'>
                <span aria-hidden='true'>&ldquo;</span>
                <p>&ldquo;Finally, a platform that makes customer analytics simple!&rdquo;</p>
              </div>
              <div className='person'>
                <img src='data:image/webp;base64,UklGRuoDAABXRUJQVlA4IN4DAACwEgCdASopACkAPikShkKhoQnKkgwBQljAJ0y8cLJTb3L3+B7t3JpmnzXI/2k9lNytvr/t/5S/lV8K9KT5J/659pPET5S/1H5O8wHbGcclHr/r/T6/3vMr9Hf9T3CP1T/135jcbAr0M8YOw9XqEYOyjfjYGr3x8ZBeGIv3n5R5nKjMkhGVHkuwkkWo0Zfcb9myMCJ/XIiy//6QQlE6AAD+//7OVHXExfflkH7r/0FLoqAuMD1Prg/v7M+ePkX4QgcSF5hrsfeane77VTcquTX4Nqfzf4Cq8BZeOSwO7OyYJlmbprsb7DnEywMB0sYTxMGh8lIvXtwaSAj1IW9cDVNqJpxZBviODnSnq6CPNB6jbPdql3wwipxN+7GzKB28xMM++eQQs9I67yfTSIqnEbe3Qp9bKW/Yw6CvrQ65zJfhOXt7XcHRo26xBNrwOW9jmfXKbbTvx7+/s0t35AFWOAlGXji7uLb5rJiQNwIxcr7lpfLQmtA+XXIneLVBQHVVpC1osmf5xEpNeq9TUJ5qWHjJ0fk8Yfj2+J/M2v9uOyuoNdZ+RVmjhXGa9OJ4ZvRq57juX+tC9c7JDuJFvJ+HQa5uuoqx0K63tKtZ+KlIa/+vuk/JDYHYCKKaeuMiaysFx3jBP6xL7IxrVZtcXDUx+g9nB4A1RTGNnKRFSbZXYXJDeHwRnv2XZVh9jucjGtEtdCT/j+5HOG1o7OixZ3lD9J2y64EE+/NaQWyPlYzuCbd6w2/1fVSvVgh2DjuJAj7EgMyGRvR7/Dz48jCTLBxS8Suo4Yrf4sWZFQDZC+3en0ssdzh17SS324OEvLWf07usv2poo6XK/5Ke7814fkdTAxLHn8GCEIVWHbimZbZKEDwV5QsYLUbThRjQFE2jvhfIASfxK2zO09Y3X+K74vHxWboLL/KsqdTXYHFAoSf64lfxuOhbGdInYk23p2f8S3OSzpILqxj15B0gDmzVZsXt24vI87AhlzA08c75U+UB9zpLvSkPzx1aaKgG6+/mvC+23GQkjPrNwCdzq9uQzaTvn5Y3IHXf34FEZ6bponDc7Y2MCAI04FNQ6IZtxKi8orm7wqaI6Zn6puKuHBrbv87XIw88uTjgyMnLfNC9b+y71JH2LRAsZ4VpouYnUlv2MblUsYX5a5D5mXGbwhEjEYTzD1cRmU7+TGueDJ8ftCKoj4JVD7xnMSlr5BzhXRbUeUI/qYi8hau2+OdGnrbqD61orvjwW5Z38FNs5GztsQN/uQY2v9XFVqbDqGMm8kaZdJoZEXEMlifjahPTb2jX23tC1OHgMCirnTgiMSzLPYAAAAA=' alt='' />
                <div>
                  <b>Sneha Verma</b>
                  <small>Business Owner</small>
                  <span className='stars' aria-label='5 out of 5 stars'>★★★★★</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className='cta center'>
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
            <img src='data:image/webp;base64,UklGRioCAABXRUJQVlA4IB4CAABwDQCdASoWABYAPikSh0KhoQoCAAwBQlsAJ0yhHA3gH4V/kzz5+mXbPJR4AHiAdIDzAY7d6FfSt1jPlAfYDJ/vXPxgzwH5AZKf+taLNkgGe35+/13uEfql/ovzGC9K4ve4NabuNYNTrqxg7sUHmUohF+Il0AD+/+mbNoUxiG97tIn27PXku6+HOxxPLD+S9+pnIjoLHW61aL+3cRGR0/ztn6TNHIbn4zc44uRMD82Pf82LG0m7sp1lLrqk7JR+Sj7n7tUwve/LRWcfdDgSUmINDHK9VZMnhY7zprCsH97D1A8uoyNm2nRl6S5ITtm2D2//v9gav8eTmX//Ewoe80P2DJqc//N1GW33yRFqPe9E/Kv93IgOSK0EDcfiiz0rro7+af+XnciUpDouO3zwfQL7/JFK2zq7o4JFj1oamXpNEj8wX+IH7hC7BP+R0wzZ78SLb29cCesNnMR09vEV//6Nm/EC425jx3p8cOSxE/yTidBp1v8dCRlj0TuqgOwhsWMmcCLD/C/Z0HC+AcQVVr5S9ite/7Y8fMZ+1nF8sS05Kdnjg9nH2j+UBeSHahu3lUO+qqoXdZlO8kj06RG1wV+1+0N/+DJLfJHu6vQmtGC17BMIS+y0aqfxV0BIfu7D2O15HgqGu+s4cECIr1VeMqLHiKYQsAxw1BOHFzRwp/IW4NhmA0Xcm0/0SYLHXWcgVUwkjf8YQqCTJ0LiMAAAAA==' alt='LinkedIn' />
            <img src='data:image/webp;base64,UklGRqwBAABXRUJQVlA4IKABAABwCQCdASoWABYAPikQhkIhoQoDVAwBQlsAJ0y43UHjHCGaBGQaQxSAG88/sRMWvxGx3c0Q+0CfOeSH55DBb/9N/S79PiTDS8XK/7AVQ+mmthHgBAAA/v/0FqGu1On134/m/er4u89/G95v3+20v9/93uIv5XxBa8D/ofKwsPGfdkd++CMjOlAKq6Rs99XdUa2O6cg+jrnu9RA55iTFefnv/JofFlYHTvMLj+Zb8WVtLHibYPnDHFedhtuAgX/JKkvM0Qvg6xpRKY+X7dbBrLx5Wg3w9l7NLmb/9sP/XC/7J2/6cN++vcA4v8q//7RjSgRTbjaM0D7qxvv17dQCaG53CRhxip7yVHSOQJsq14/NbMA8J35lHxaYundf5WP6+Z2ufBLVyzTVoQrlpmcs9S1jwCDhrHsHZ2WEmOm/+vf+9XKedIY4W+NZTsXL0K+9emZ3P+Ob91M3fy+Vwc6NeZZFSsuHDD0G4Rg81DDKP+3vCalZvoPUd5P28X+f/3veKk2e57sTrcMvi8yvZceloUh4oTLWMsUkI3tKiYLOKAAAAA==' alt='Twitter' />
            <img src='data:image/webp;base64,UklGRmYCAABXRUJQVlA4IFoCAADQDgCdASoWABYAPikSh0KhoQoCAAwBQlAE6ZQj0/1XjO9NWw2wHkzvHeaA/WbWAN50rDv4Ac/Z6gZNd53+Ruej/FH8scxt/bPyj8QDvO+UBqLf9F9s3xg6Bvmr/fe4L+ov+Y/M7jJQ+sTkAAi8X3Ph75DJ7oxK1NbERp/uuj+oAP7/6T4n/ufGAKfqBP3jHLg7CF7bXyz5BFu3bqJqkrK9mAv/Eoyv8hk/6JoOD4jKYv/+zUsu+opM1qJVrFpfM4f/5IGu8MzheHk4bx/hsGVxq1nxPULmKdAQxO0r/0BiBYmsRpyv1BvKjOzYJaqS8RMxY3ywzgvn+vuRY3dcPxl3YePpODgxnvRlUwU8Q+ywfPKfkET/7NOiqppMfBKfUJvUdN1KUy8B7/BA3IpQOjAmjKh/WLxFUNSvESpDfwO/WpX/NAFtNxBH+yZ0+HUd6zrFQIdQJIMEhe+OCP077iMGyL1vLjk28N8j5/S3SWOT56lCrXU0Px4hY9nhnmfhqaAG7S29Bm0oHVMZjB03L1wJlpNoEsOyajM5cPh/LOd9wA6vsualTe/uxW1rb4bMcJ2X/yl9/GJ/+ltDRi2w8+f/vD/8MJXXBRzGxb71S7wT9yLQq8OhN6vWPvsSFjjqWDIs1Buj/RtSGXH4b5hrX+nn/iY+be8OBVvki2ym+0zob/wVdgNDkPqefe9P239522YerQuWXnt48VFrk4JKsQIiAELc7Zrcx4zj2kT1f4didz6/c19bXZ9PgDilASsIL5GBaZkOMaOU6ZTRCu3Kj6FWyNADd1jPnjAAAA==' alt='GitHub' />
          </div>
        </div>
        <p className='copyright'>&copy; 2026 The Patron Index. All rights reserved.</p>
      </footer>
    </div>
  )
}
