import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'
import logoImg from '../assets/logo.png'
import './Auth.css'

function Register () {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'analyst' })
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async event => {
    event.preventDefault()
    if (!agreed) {
      setError('You must confirm age eligibility and agree to the Terms of Service and Privacy Policy to register.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await registerUser({
        ...form,
        email: form.email.trim().toLowerCase(),
        name: form.name.trim()
      })
      navigate('/login', { replace: true, state: { email: form.email.trim(), registered: true } })
    } catch (err) {
      setError(err.message)
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

        <h1 id='account-title'>Create your account</h1>
        <p className='account-copy'>Start turning buyer behavior into actionable business intelligence.</p>

        <form className='account-form' onSubmit={submit}>
          <div className='account-field'>
            <label htmlFor='account-name'>Name</label>
            <input
              id='account-name'
              type='text'
              autoComplete='name'
              maxLength={120}
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder='Your name or business'
              required
            />
          </div>

          <div className='account-field'>
            <label htmlFor='account-email'>Email</label>
            <input
              id='account-email'
              type='email'
              autoComplete='email'
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder='you@business.com'
              required
            />
          </div>

          <div className='account-field'>
            <label htmlFor='account-password'>Password</label>
            <input
              id='account-password'
              type='password'
              autoComplete='new-password'
              minLength={6}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder='••••••••'
              required
            />
            <span className='account-hint'>Use at least 6 characters.</span>
          </div>

          <label className='account-consent'>
            <input
              type='checkbox'
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              required
            />
            <span>
              I confirm I am at least 18 years of age and agree to the{' '}
              <Link to='/?policy=terms' target='_blank' rel='noreferrer'>Terms of Service</Link> and{' '}
              <Link to='/?policy=privacy' target='_blank' rel='noreferrer'>Privacy Policy</Link>.
            </span>
          </label>

          {error && <span className='account-error' role='alert'>{error}</span>}

          <button className='account-submit' type='submit' disabled={loading || !agreed}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className='account-switch'>
          <span>Already registered? </span>
          <Link to='/login'>Sign in</Link>
        </p>
      </section>
    </main>
  )
}

export default Register
