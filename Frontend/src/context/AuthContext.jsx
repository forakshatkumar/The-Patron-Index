/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { loginUser, registerUser, googleLogin, removeToken, getToken, getUser, saveUser } from '../services/api'

const AuthContext = createContext(null)

const DEMO_USER = {
  name: 'Demo Account',
  email: 'demo@patronindex.local',
  role: 'admin',
  organization: 'Patron Index Demo'
}

export function AuthProvider ({ children }) {
  const [token, setToken] = useState(getToken())
  const [demoMode, setDemoMode] = useState(localStorage.getItem('patron_demo') === 'true')
  const [user, setUser] = useState(() => getUser() || (localStorage.getItem('patron_demo') === 'true' ? DEMO_USER : null))

  const login = async (email, password) => {
    const data = await loginUser(email, password)
    setToken(data.token)
    const normalizedEmail = email.trim().toLowerCase()
    const authenticatedUser = {
      id: data.user?.id || data.userId || 'usr_current',
      name: data.user?.name || normalizedEmail.split('@')[0],
      email: data.user?.email || normalizedEmail,
      role: data.user?.role || 'analyst',
      organization: data.user?.organization || 'Enterprise Workspace'
    }
    setUser(authenticatedUser)
    saveUser(authenticatedUser)
    setDemoMode(false)
    localStorage.removeItem('patron_demo')
    return data
  }

  const register = async (userData) => {
    const data = await registerUser(userData)
    if (data.token) {
      setToken(data.token)
      const normalizedEmail = userData.email.trim().toLowerCase()
      const authenticatedUser = {
        id: data.user?.id || data.userId || 'usr_current',
        name: data.user?.name || userData.name || normalizedEmail.split('@')[0],
        email: data.user?.email || normalizedEmail,
        role: data.user?.role || userData.role || 'analyst',
        organization: data.user?.organization || 'Enterprise Workspace'
      }
      setUser(authenticatedUser)
      saveUser(authenticatedUser)
      setDemoMode(false)
      localStorage.removeItem('patron_demo')
      return data
    }
    if (userData.email && userData.password) {
      return await login(userData.email, userData.password)
    }
    return data
  }

  const loginWithGoogle = async (credential) => {
    const data = await googleLogin(credential)
    if (data.token) {
      setToken(data.token)
      if (data.user) {
        setUser(data.user)
        saveUser(data.user)
      }
      setDemoMode(false)
      localStorage.removeItem('patron_demo')
    }
    return data
  }

  const enterDemo = () => {
    removeToken()
    setToken(null)
    localStorage.setItem('patron_demo', 'true')
    setDemoMode(true)
    setUser(DEMO_USER)
    saveUser(DEMO_USER)
  }

  const logout = () => {
    removeToken()
    localStorage.removeItem('patron_demo')
    setToken(null)
    setDemoMode(false)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      token,
      user: user || (demoMode ? DEMO_USER : null),
      demoMode,
      isAuthenticated: Boolean(token || demoMode),
      login,
      register,
      loginWithGoogle,
      logout,
      enterDemo
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token, user, demoMode]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
