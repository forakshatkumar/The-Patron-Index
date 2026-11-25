import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import AppErrorBoundary from './components/AppErrorBoundary'
import { AuthProvider } from './context/AuthContext'
import './tokens.css'
import './styles.css'
import './premium.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppErrorBoundary><App /></AppErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
