import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const { preferences, saveProfile, logout, demoMode } = useAuth()
  const navigate = useNavigate()

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

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
            <p>Manage appearance, accessibility and account security.</p>
          </div>
        </div>

        {error && <p role='alert' className='info-banner'>{error}</p>}

        <section className='card preference-card'><h3>Account</h3><div className='preference-row'><div><strong>Personal and business information</strong><p>Manage your name, avatar and business details in your profile.</p></div><Link className='secondary-button' to='/profile'>Open profile</Link></div></section>

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
