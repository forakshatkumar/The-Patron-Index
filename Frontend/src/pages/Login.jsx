import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoImg from '../assets/logo.png'
import './Auth.css'

function Login () {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(() => location.state?.email || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(() =>
    location.state?.registered ? 'Account created successfully! Please sign in below.' : ''
  )
  const [loading, setLoading] = useState(false)
  const [isWarmupDelayed, setIsWarmupDelayed] = useState(false)

  useEffect(() => {
    // Pre-warm backend on Render to eliminate cold-start lag
    const apiBase = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? '/api' : 'http://localhost:5000/api')
    fetch(`${apiBase}/health`).catch(() => {})
  }, [])

  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => {
      setIsWarmupDelayed(true)
    }, 2500)
    return () => {
      clearTimeout(timer)
      setIsWarmupDelayed(false)
    }
  }, [loading])

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '978238561753-daj7ignsgo9lbg31ag5c0ke3lukuarbh.apps.googleusercontent.com'

    const initGoogle = () => {
      if (!window.google?.accounts?.id) return
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (response?.credential) {
              try {
                setLoading(true)
                setError('')
                await loginWithGoogle(response.credential)
                navigate('/dashboard', { replace: true })
              } catch (err) {
                setError(err.message || 'Google sign in failed')
              } finally {
                setLoading(false)
              }
            }
          }
        })
        const btnEl = document.getElementById('google-btn-login')
        if (btnEl) {
          btnEl.innerHTML = ''
          const btnWidth = Math.max(220, Math.min(360, (btnEl.parentElement?.clientWidth || window.innerWidth) - 8))
          window.google.accounts.id.renderButton(btnEl, {
            theme: 'outline',
            size: 'large',
            width: btnWidth,
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left'
          })
        }
      } catch (e) {
        console.error('Google Auth Init Error:', e)
      }
    }

    if (window.google?.accounts?.id) {
      initGoogle()
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval)
          initGoogle()
        }
      }, 150)
      return () => clearInterval(interval)
    }
  }, [loginWithGoogle, navigate])

  const submit = async event => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await login(email.trim().toLowerCase(), password)
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='account-page-root' id='account-page'>
      <div className='account-art' aria-hidden='true'>
        <svg className='account-trend' viewBox='0 0 1200 420' preserveAspectRatio='none'>
          <defs>
            <linearGradient id='account-fill' x2='0' y2='1'>
              <stop stopColor='#70a7dc' stopOpacity='.35' />
              <stop offset='1' stopColor='#70a7dc' stopOpacity='0' />
            </linearGradient>
          </defs>
          <path fill='url(#account-fill)' d='M0 325 C60 325 95 235 155 235 S240 273 300 273 S370 155 450 155 S524 220 595 220 S685 128 750 128 S837 165 905 165 S1000 62 1078 66 S1164 42 1200 25 V420 H0 Z' />
          <path id='account-line' fill='none' stroke='currentColor' strokeWidth='2' vectorEffect='non-scaling-stroke' d='M0 325 C60 325 95 235 155 235 S240 273 300 273 S370 155 450 155 S524 220 595 220 S685 128 750 128 S837 165 905 165 S1000 62 1078 66 S1164 42 1200 25' />
          <path className='signal' pathLength='1' fill='none' stroke='#1f68ad' strokeWidth='3' strokeLinecap='round' vectorEffect='non-scaling-stroke' d='M0 325 C60 325 95 235 155 235 S240 273 300 273 S370 155 450 155 S524 220 595 220 S685 128 750 128 S837 165 905 165 S1000 62 1078 66 S1164 42 1200 25' />
          <g fill='#fff' stroke='currentColor' strokeWidth='2'>
            <circle cx='155' cy='235' r='5' />
            <circle cx='300' cy='273' r='5' />
            <circle cx='905' cy='165' r='5' />
            <circle cx='1078' cy='66' r='5' />
          </g>
        </svg>
        <div className='account-bars'>
          <span style={{ '--height': '25%', '--delay': '-2s' }} />
          <span style={{ '--height': '42%', '--delay': '-1s' }} />
          <span style={{ '--height': '34%', '--delay': '-2.7s' }} />
          <span style={{ '--height': '61%', '--delay': '-.6s' }} />
          <span style={{ '--height': '72%', '--delay': '-1.8s' }} />
          <span style={{ '--height': '90%', '--delay': '-3s' }} />
        </div>
        <div className='account-ring' />
      </div>

      <section className='account-card' aria-labelledby='account-title'>
        <Link to='/' className='account-brand-link' aria-label='The Patron Index Home'>
          <div className='account-brand'>
            <span className='account-logo'>
              <img src={logoImg} alt='The Patron Index' />
            </span>
            <span>
              The Patron Index
              <small>Customer Intelligence Platform</small>
            </span>
          </div>
        </Link>

        <h1 id='account-title'>Welcome back</h1>
        <p className='account-copy'>Sign in to access your business dashboard.</p>

        {success && <div className='account-status success' role='status'>{success}</div>}
        {loading && (
          <div className='account-status loading' role='status'>
            <span className='auth-spinner' />
            <span>{isWarmupDelayed ? 'Waking up secure cloud server, please wait a moment...' : 'Signing in...'}</span>
          </div>
        )}

        <form className='account-form' onSubmit={submit}>
          <div className='account-field'>
            <label htmlFor='account-email'>Email</label>
            <input
              id='account-email'
              type='email'
              autoComplete='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='you@business.com'
              required
              aria-invalid={Boolean(error)}
            />
          </div>

          <div className='account-field'>
            <label htmlFor='account-password'>Password</label>
            <input
              id='account-password'
              type='password'
              autoComplete='current-password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder='••••••••'
              required
              aria-invalid={Boolean(error)}
            />
          </div>

          {error && <span className='account-error' role='alert'>{error}</span>}

          <button className='account-submit' type='submit' disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className='account-divider'>
          <span>or</span>
        </div>

        <div id='google-btn-login' className='google-btn-wrap' />

        <p className='account-switch'>
          <span>New here? </span>
          <Link to='/register'>Create an account</Link>
        </p>
      </section>
    </main>
  )
}

export default Login
