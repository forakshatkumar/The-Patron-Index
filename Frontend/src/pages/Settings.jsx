import { useState } from 'react'

import { businessProfile } from '../data/mockData'

function Settings () {
  const saved =
    JSON.parse(localStorage.getItem('patron-business-settings')) ||
    businessProfile

  const [form, setForm] = useState(saved)

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
    <div className='page'>
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
            />
          </div>

          <div className='form-group'>
            <label>Owner Name</label>

            <input
              type='text'
              name='ownerName'
              value={form.ownerName}
              onChange={handleChange}
            />
          </div>

          <div className='form-group'>
            <label>Email</label>

            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className='form-group'>
            <label>Phone</label>

            <input
              type='text'
              name='phone'
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className='form-group'>
            <label>Industry</label>

            <input
              type='text'
              name='industry'
              value={form.industry}
              onChange={handleChange}
            />
          </div>

          <div className='form-group'>
            <label>Location</label>

            <input
              type='text'
              name='location'
              value={form.location}
              onChange={handleChange}
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
  )
}

export default Settings
