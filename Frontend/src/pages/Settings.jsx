import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Toggle ({ label, description, checked, onChange, disabled }) {
  return (
    <div className='preference-row'>
      <div>
        <strong>{label}</strong>
        <p>{description}</p>
      </div>
      <button
        type='button'
        className={`premium-switch ${checked ? 'on' : ''}`}
        role='switch'
        aria-label={label}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  )
}

export default function Settings () {
  const { user, preferences, saveProfile, logout, demoMode } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(() => {
    try {
      const stored = localStorage.getItem('patron-business-settings')
      if (stored) {
        const parsed = JSON.parse(stored)
        const phone = parsed.phone === '+91 98765 43210' ? '' : (parsed.phone || '')
        const location = parsed.location === 'New Delhi, India' ? '' : (parsed.location || '')
        const industry = parsed.industry === 'Retail & Commerce' ? '' : (parsed.industry || '')
        const businessName = (parsed.businessName === 'Patron Analytics' || parsed.businessName === 'Enterprise Workspace') ? '' : (parsed.businessName || '')

        return {
          businessName,
          ownerName: parsed.ownerName || user?.name || '',
          email: parsed.email || user?.email || '',
          phone,
          industry,
          location
        }
      }
    } catch {
      // fallback
    }

    return {
      businessName: user?.businessName || '',
      ownerName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      industry: user?.industry || '',
      location: user?.location || ''
    }
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setForm(prev => {
        if (!prev.ownerName && !prev.email && user) {
          return {
            ...prev,
            ownerName: user.name || '',
            email: user.email || ''
          }
        }
        return prev
      })
    }, 0)
    return () => clearTimeout(timer)
  }, [user])

  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')

    try {
      // Persist locally for instant availability and dispatch update event
      localStorage.setItem('patron-business-settings', JSON.stringify(form))
      window.dispatchEvent(new CustomEvent('patron:settings_updated', { detail: form }))

      // Persist to backend user profile if authenticated
      await saveProfile({
        name: form.ownerName,
        businessName: form.businessName,
        industry: form.industry,
        location: form.location,
        phone: form.phone
      })

      setMessage('Settings saved successfully.')
      setTimeout(() => setMessage(''), 3000)
    } catch {
      // Fallback message if backend fails
      setMessage('Settings saved locally.')
      setTimeout(() => setMessage(''), 3000)
    } finally {
      setBusy(false)
    }
  }

  const savePref = async (patch) => {
    setBusy(true)
    setError('')
    try {
      await saveProfile({ preferences: { ...preferences, ...patch } })
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  const signout = async (all) => {
    if (all && !window.confirm('Sign out of all devices?')) return
    setBusy(true)
    setError('')
    try {
      await logout(all)
      navigate('/login', { replace: true })
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className='page settings-page'>
      <div className='settings-container'>
        <div className='page-heading'>
          <div>
            <h2>Settings</h2>
            <p>Manage your business information.</p>
          </div>
        </div>

        {error && <p role='alert' className='info-banner'>{error}</p>}

        <section className='card settings-card' style={{ marginBottom: '24px' }}>
          <form className='settings-form' onSubmit={handleSubmit}>
            <div className='form-group'>
              <label>Business Name</label>
              <input
                type='text'
                name='businessName'
                value={form.businessName}
                onChange={handleChange}
                placeholder='Enter business name'
              />
            </div>

            <div className='form-group'>
              <label>Owner Name</label>
              <input
                type='text'
                name='ownerName'
                value={form.ownerName}
                onChange={handleChange}
                placeholder='Enter owner name'
              />
            </div>

            <div className='form-group'>
              <label>Email</label>
              <input
                type='email'
                name='email'
                value={form.email}
                onChange={handleChange}
                placeholder='Enter email'
              />
            </div>

            <div className='form-group'>
              <label>Phone</label>
              <input
                type='text'
                name='phone'
                value={form.phone}
                onChange={handleChange}
                placeholder='Enter phone number'
              />
            </div>

            <div className='form-group'>
              <label>Industry</label>
              <input
                type='text'
                name='industry'
                value={form.industry}
                onChange={handleChange}
                placeholder='Enter industry'
              />
            </div>

            <div className='form-group'>
              <label>Location</label>
              <input
                type='text'
                name='location'
                value={form.location}
                onChange={handleChange}
                placeholder='Enter city, country'
              />
            </div>

            <div className='settings-actions'>
              <button type='submit' className='primary-button' disabled={busy}>
                {busy ? 'Saving...' : 'Save Changes'}
              </button>
              {message && <span className='success-message' style={{ color: '#10b981', fontWeight: 600 }}>{message}</span>}
            </div>
          </form>
        </section>

        <section className='card preference-card' style={{ marginBottom: '16px' }}>
          <h3>Appearance & Preferences</h3>
          <div className='preference-row'>
            <div>
              <strong>Theme</strong>
              <p>Choose your preferred workspace appearance.</p>
            </div>
            <select aria-label='Theme' value={preferences.theme} onChange={e => savePref({ theme: e.target.value })} disabled={busy}>
              <option value='system'>System</option>
              <option value='light'>Light</option>
              <option value='dark'>Dark</option>
            </select>
          </div>
          <Toggle label='Reduced motion' description='Minimize transitions and decorative animation.' checked={preferences.reducedMotion} onChange={v => savePref({ reducedMotion: v })} disabled={busy} />
          <Toggle label='In-app notification center' description='Show or hide the notification bell in your workspace.' checked={preferences.notifications} onChange={v => savePref({ notifications: v })} disabled={busy} />
        </section>

        <section className='card preference-card' style={{ marginBottom: '24px' }}>
          <h3>Security</h3>
          <div className='preference-row'>
            <div>
              <strong>Session</strong>
              <p>{demoMode ? 'Demo visit' : 'Persistent sign-in expires after 30 days.'}</p>
            </div>
          </div>
          {!demoMode && (
            <div className='preference-row'>
              <div>
                <strong>Other devices</strong>
                <p>Revoke all active persistent sessions.</p>
              </div>
              <button type='button' className='secondary-button' disabled={busy} onClick={() => signout(true)}>Sign out all devices</button>
            </div>
          )}
        </section>

        <button type='button' className='premium-signout' disabled={busy} onClick={() => signout(false)}>Sign Out</button>
        {demoMode && <p className='muted-text' style={{ marginTop: '8px' }}>Demo preferences are temporary.</p>}
      </div>
    </div>
  )
}
