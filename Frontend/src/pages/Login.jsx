import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login () {
  const { login, enterDemo } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async event => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const demo = () => {
    enterDemo()
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className='auth-page'>
      <div className='auth-card'>
        <div className='auth-brand'><div className='brand-logo'>P</div><div><h1>The Patron Index</h1><p>Customer Intelligence Platform</p></div></div>
        <h2>Welcome back</h2>
        <p className='muted-text'>Sign in to access your business dashboard.</p>
        <form className='auth-form' onSubmit={submit}>
          <label>Email<input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='you@business.com' required /></label>
          <label>Password<input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='••••••••' required /></label>
          {error && <div className='upload-error'>{error}</div>}
          <button className='primary-button auth-submit' disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <button className='secondary-button demo-button' onClick={demo}>Open Demo Dashboard</button>
        <p className='auth-switch'>New here? <Link to='/register'>Create an account</Link></p>
      </div>
    </div>
  )
}

export default Login
