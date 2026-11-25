import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export default function ProtectedRoute ({ children }) {
  const { isAuthenticated, loading, sessionError, restore } = useAuth()
  const location = useLocation()
  if (loading) return <main className='session-state' aria-busy='true'><div className='session-skeleton'/><p>Restoring your workspace…</p></main>
  if (sessionError) return <main className='session-state'><p>{sessionError}</p><button className='primary-button' onClick={restore}>Try again</button></main>
  if (!isAuthenticated) return <Navigate to='/login' replace state={{ from: location.pathname }} />
  return children
}
