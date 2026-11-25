import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'
export default function NotFound () {
  const { isAuthenticated } = useAuth()
  return <main className='not-found premium-not-found'><img src={logo} alt='The Patron Index' width='48' height='48'/><span className='not-found-code'>404 / PAGE NOT FOUND</span><h1>Looks like a wrong turn.</h1><p>We couldn’t find the page you were looking for.</p><Link className='primary-button' to={isAuthenticated ? '/dashboard' : '/'}>{isAuthenticated ? 'Back to workspace' : 'Back to home'}</Link></main>
}
