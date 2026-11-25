import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
const Landing = lazy(() => import('./pages/Landing'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Customers = lazy(() => import('./pages/Customers'))
const CustomerProfile = lazy(() => import('./pages/CustomerProfile'))
const Transactions = lazy(() => import('./pages/Transactions'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Settings = lazy(() => import('./pages/Settings'))
const ImportData = lazy(() => import('./pages/ImportData'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const NotFound = lazy(() => import('./pages/NotFound'))

const Profile = lazy(() => import('./pages/Profile'))
function PublicPage ({ children }) {
  const { loading, isAuthenticated } = useAuth()
  if (loading) return <div className='session-state' aria-busy='true'><div className='session-skeleton'/></div>
  return isAuthenticated ? <Navigate to='/dashboard' replace/> : children
}
function CustomerDetailRoute () { const { id } = useParams(); return <CustomerProfile key={id} /> }
function App () {
  return (
    <Suspense fallback={<div className="session-state" aria-busy="true"><div className="session-skeleton"/></div>}><Routes>
      <Route path='/' element={<PublicPage><Landing /></PublicPage>} />
      <Route path='/login' element={<PublicPage><Login /></PublicPage>} />
      <Route path='/register' element={<PublicPage><Register /></PublicPage>} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/customers' element={<Customers />} />
        <Route path='/customers/:id' element={<CustomerDetailRoute />} />
        <Route path='/segments' element={<Navigate to='/customers' replace />} />
        <Route path='/transactions' element={<Transactions />} />
        <Route path='/analytics' element={<Analytics />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/import' element={<ImportData />} />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes></Suspense>
  )
}

export default App
