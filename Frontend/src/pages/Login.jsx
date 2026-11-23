import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoImg from '../assets/logo.png'

function Login () {
  const { login, enterDemo } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(() => location.state?.email || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(() =>
    location.state?.registered ? 'Account created successfully! Please sign in below.' : ''
  )
  const [loading, setLoading] = useState(false)

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

  const fillDemoCredentials = () => {
    setEmail('demo@patronindex.com')
    setPassword('password123')
    setError('')
  }

  const demo = () => {
    enterDemo()
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className='auth-page'>
      <div className='auth-card'>
        <Link to='/' className='auth-brand-link' aria-label='The Patron Index Home'>
          <div className='auth-brand'><img src={logoImg} alt='The Patron Index' className='brand-logo-img' /><div><h1>The Patron Index</h1><p>Customer Intelligence Platform</p></div></div>
        </Link>
        <h2>Welcome back</h2>
        <p className='muted-text'>Sign in to access your business dashboard.</p>

        {success && <div className='info-banner' style={{ color: '#3DD6A0', backgroundColor: '#182E25', borderColor: '#265C46', marginBottom: '14px', fontSize: '12px' }}>{success}</div>}

        <form className='auth-form' onSubmit={submit}>
          <label>Email<input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='you@business.com' required /></label>
          <label>Password<input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='••••••••' required /></label>
          {error && <div className='upload-error'>{error}</div>}
          <button className='primary-button auth-submit' disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>

        <div style={{ marginTop: '14px', padding: '10px 12px', background: '#121820', border: '1px solid #222B36', borderRadius: '8px', fontSize: '11px', color: '#8A98A8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontWeight: 600, color: '#E8EEF5' }}>Test Account</span>
            <button
              type='button'
              onClick={fillDemoCredentials}
              style={{ background: 'none', border: 'none', color: '#4F8CFF', cursor: 'pointer', padding: 0, fontSize: '11px', fontWeight: 600, textDecoration: 'underline' }}
            >
              Fill Credentials
            </button>
          </div>
          <div>Email: <span style={{ fontFamily: 'monospace', color: '#E8EEF5' }}>demo@patronindex.com</span></div>
          <div>Password: <span style={{ fontFamily: 'monospace', color: '#E8EEF5' }}>password123</span></div>
        </div>

        <button className='secondary-button demo-button' onClick={demo}>Open Demo Dashboard</button>
        <p className='auth-switch'>New here? <Link to='/register'>Create an account</Link></p>
      </div>
    </div>
  )
}

export default Login
