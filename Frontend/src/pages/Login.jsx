import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoImg from '../assets/logo.png'

function Login () {
  const { login } = useAuth()
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

        <p className='auth-switch'>New here? <Link to='/register'>Create an account</Link></p>
      </div>
    </div>
  )
}

export default Login
