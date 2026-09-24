import { Link } from 'react-router-dom'

function NotFound () {
  return (
    <div className='not-found'>
      <h1>404</h1>

      <h2>Page not found</h2>

      <p>The page you're looking for does not exist.</p>

      <Link to='/dashboard' className='primary-button'>
        Go to Dashboard
      </Link>
    </div>
  )
}

export default NotFound
