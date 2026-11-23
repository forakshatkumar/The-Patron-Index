import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'
import logoImg from '../assets/logo.png'

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
    <div className='auth-page'>
      <div className='auth-card'>
        <Link to='/' className='auth-brand-link' aria-label='The Patron Index Home'>
          <div className='auth-brand'><img src={logoImg} alt='The Patron Index' className='brand-logo-img' /><div><h1>The Patron Index</h1><p>Customer Intelligence Platform</p></div></div>
        </Link>
        <h2>Create your account</h2>
        <form className='auth-form' onSubmit={submit}>
          <label>Name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
          <label>Email<input type='email' value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></label>
          <label>Password<input type='password' minLength='6' value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></label>
          <label className='auth-checkbox-label'>
            <input
              type='checkbox'
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              required
            />
            <span>I confirm I am at least 18 years of age and agree to the <Link to='/?policy=terms' target='_blank' rel='noreferrer'>Terms of Service</Link> and <Link to='/?policy=privacy' target='_blank' rel='noreferrer'>Privacy Policy</Link>.</span>
          </label>
          {error && <div className='upload-error'>{error}</div>}
          <button className='primary-button auth-submit' disabled={loading || !agreed}>{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <p className='auth-switch'>Already registered? <Link to='/login'>Sign in</Link></p>
      </div>
    </div>
  )
}

export default Register
