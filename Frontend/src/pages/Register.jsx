import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'

function Register () {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'analyst' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async event => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await registerUser(form)
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='auth-page'>
      <div className='auth-card'>
        <div className='auth-brand'><div className='brand-logo'>P</div><div><h1>The Patron Index</h1><p>Customer Intelligence Platform</p></div></div>
        <h2>Create your account</h2>
        <form className='auth-form' onSubmit={submit}>
          <label>Name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
          <label>Email<input type='email' value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></label>
          <label>Password<input type='password' minLength='6' value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></label>
          {error && <div className='upload-error'>{error}</div>}
          <button className='primary-button auth-submit' disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <p className='auth-switch'>Already registered? <Link to='/login'>Sign in</Link></p>
      </div>
    </div>
  )
}

export default Register
