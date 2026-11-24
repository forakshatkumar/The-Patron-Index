import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Settings () {
  const { user } = useAuth()

  const [form, setForm] = useState(() => {
    try {
      const stored = localStorage.getItem('patron-business-settings')
      if (stored) {
        const parsed = JSON.parse(stored)
        // Clean out legacy mock data if present so user can enter their own data
        const phone = parsed.phone === '+91 98765 43210' ? '' : (parsed.phone || '')
        const location = parsed.location === 'New Delhi, India' ? '' : (parsed.location || '')
        const industry = parsed.industry === 'Retail & Commerce' ? '' : (parsed.industry || '')
        const businessName = parsed.businessName === 'Patron Analytics' ? '' : (parsed.businessName || '')

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
      businessName: '',
      ownerName: user?.name || '',
      email: user?.email || '',
      phone: '',
      industry: '',
      location: ''
    }
  })

  const [message, setMessage] = useState('')

  const handleChange = event => {
    const { name, value } = event.target

    setForm(current => ({
      ...current,
      [name]: value
    }))
  }

  const handleSubmit = event => {
    event.preventDefault()

    localStorage.setItem('patron-business-settings', JSON.stringify(form))

    setMessage('Settings saved successfully.')

    setTimeout(() => {
      setMessage('')
    }, 2500)
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

        <section className='card settings-card'>
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
              <button type='submit' className='primary-button'>
                Save Changes
              </button>

              {message && <span className='success-message'>{message}</span>}
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}

export default Settings
