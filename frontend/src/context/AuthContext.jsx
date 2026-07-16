import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import { loginUser } from '../api/authApi'

const AuthContext = createContext(null)

const TOKEN_STORAGE_KEY = 'resolveone_token'
const USER_STORAGE_KEY = 'resolveone_user'

const readStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY)

    if (!storedUser) {
      return null
    }

    return JSON.parse(storedUser)
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY)
    return null
  }
}

const getStoredSession = () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  const user = readStoredUser()

  if (!token || !user) {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)

    return {
      token: null,
      user: null,
    }
  }

  return {
    token,
    user,
  }
}

export const AuthProvider = ({ children }) => {
  const [initialSession] = useState(getStoredSession)
  const [token, setToken] = useState(initialSession.token)
  const [user, setUser] = useState(initialSession.user)

  const login = useCallback(async (credentials) => {
    const apiResponse = await loginUser(credentials)
    const loginData = apiResponse?.data

    if (!apiResponse?.success || !loginData?.token) {
      throw new Error(
        apiResponse?.message || 'Login failed. Please try again.',
      )
    }

    const authenticatedUser = {
      id: loginData.userId,
      name: loginData.name,
      email: loginData.email,
      role: loginData.role,
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, loginData.token)
    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify(authenticatedUser),
    )

    setToken(loginData.token)
    setUser(authenticatedUser)

    return authenticatedUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)

    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [token, user, login, logout],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used inside an AuthProvider',
    )
  }

  return context
}