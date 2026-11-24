/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { loginUser, registerUser, googleLogin, removeToken, getToken, getUser, saveUser } from '../services/api'

const AuthContext = createContext(null)

const DEMO_USER = {
  name: 'Akshat Kumar',
  email: 'akshat.kumar@patronindex.com',
  role: 'admin',
  organization: 'Brew & Bites'
}

export function AuthProvider ({ children }) {
  const [token, setToken] = useState(getToken())
  const [demoMode, setDemoMode] = useState(localStorage.getItem('patron_demo') === 'true')
  const [user, setUser] = useState(() => getUser() || (localStorage.getItem('patron_demo') === 'true' ? DEMO_USER : null))

  const login = async (email, password) => {
    const data = await loginUser(email, password)
    setToken(data.token)
    if (data.user) setUser(data.user)
    setDemoMode(false)
    localStorage.removeItem('patron_demo')
    return data
  }

  const register = async (userData) => {
    const data = await registerUser(userData)
    if (data.token) {
      setToken(data.token)
      if (data.user) setUser(data.user)
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
      if (data.user) setUser(data.user)
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
      user: user || DEMO_USER,
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
