/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { loginUser, registerUser, googleLogin, removeToken, getMe, updateMe, signOut } from '../services/api'
const AuthContext = createContext(null)
const DEMO = { name: 'Demo Account', email: 'demo@patronindex.local', businessName: 'Patron Index Demo', role: 'analyst' }
export const defaultPreferences = { theme: 'system', reducedMotion: false, notifications: true }
export function AuthProvider ({ children }) {
  const [demoMode, setDemoMode] = useState(() => localStorage.getItem('patron_demo') === 'true')
  const [user, setUser] = useState(() => localStorage.getItem('patron_demo') === 'true' ? DEMO : null)
  const [loading, setLoading] = useState(true)
  const [sessionError, setSessionError] = useState('')
  const restore = useCallback(async () => {
    setLoading(true)
    setSessionError('')
    try {
      if (localStorage.getItem('patron_demo') === 'true') {
        setLoading(false)
        return
      }
      const data = await getMe()
      setUser(data.user)
    } catch (e) {
      if (e.status === 401) { removeToken(); setUser(null) }
      else setSessionError('Unable to restore your session. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      restore()
    }, 0)
    return () => clearTimeout(timer)
  }, [restore])
  useEffect(() => {
    const expired = () => { setUser(null); setDemoMode(false) }
    window.addEventListener('patron:unauthorized', expired)
    return () => window.removeEventListener('patron:unauthorized', expired)
  }, [])
  const accept = useCallback(async promise => {
    const data = await promise
    setUser(data.user); setDemoMode(false); setSessionError(''); setLoading(false)
    localStorage.removeItem('patron_demo'); return data
  }, [])
  const login = useCallback((email, password) => accept(loginUser(email, password)), [accept])
  const register = useCallback(data => accept(registerUser(data)), [accept])
  const loginWithGoogle = useCallback(credential => accept(googleLogin(credential)), [accept])
  const logout = async (all = false) => {
    if (!demoMode) await signOut(all)
    removeToken(); localStorage.removeItem('patron_demo'); setUser(null); setDemoMode(false)
  }
  const enterDemo = () => { removeToken(); localStorage.setItem('patron_demo', 'true'); setDemoMode(true); setUser(DEMO); setLoading(false); setSessionError('') }
  const saveProfile = async patch => {
    if (demoMode) { setUser(prev => ({ ...prev, ...patch })); return }
    const data = await updateMe(patch); setUser(data.user)
  }
  const preferences = { ...defaultPreferences, ...user?.preferences }
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      document.documentElement.dataset.theme = preferences.theme === 'system' ? (media.matches ? 'dark' : 'light') : preferences.theme
      document.documentElement.dataset.motion = preferences.reducedMotion ? 'reduced' : 'normal'
    }
    apply(); media.addEventListener('change', apply); return () => media.removeEventListener('change', apply)
  }, [preferences.theme, preferences.reducedMotion])
  return <AuthContext.Provider value={{ user, demoMode, preferences, loading, sessionError, restore, isAuthenticated: !!user, login, register, loginWithGoogle, logout, enterDemo, saveProfile }}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
