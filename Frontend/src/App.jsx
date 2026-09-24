import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import CustomerProfile from './pages/CustomerProfile'
import Segments from './pages/Segments'
import Transactions from './pages/Transactions'
import Analytics from './pages/Analytics'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import ImportData from './pages/ImportData'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

function App () {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to='/dashboard' replace />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/customers' element={<Customers />} />
        <Route path='/customers/:id' element={<CustomerProfile />} />
        <Route path='/segments' element={<Segments />} />
        <Route path='/transactions' element={<Transactions />} />
        <Route path='/analytics' element={<Analytics />} />
        <Route path='/reports' element={<Reports />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/import' element={<ImportData />} />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
