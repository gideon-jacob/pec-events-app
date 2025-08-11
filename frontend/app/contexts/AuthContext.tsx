import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

type Role = 'user' | 'admin'

type AuthUser = {
  role: Role
  name?: string
  registerNumber?: string
}

type AuthState =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'authenticated'; user: AuthUser }

type AuthContextType = {
  state: AuthState
  signIn: (user: AuthUser) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = 'auth:state:v1'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading' })

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      try {
        const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY)
        if (raw) {
          const parsed: AuthUser = JSON.parse(raw)
          if (isMounted && parsed?.role) {
            setState({ status: 'authenticated', user: parsed })
            return
          }
        }
      } catch {
        // fallthrough to unauthenticated
      }
      if (isMounted) setState({ status: 'unauthenticated' })
    })()
    return () => {
      isMounted = false
    }
  }, [])

  const signIn = useCallback(async (user: AuthUser) => {
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    setState({ status: 'authenticated', user })
  }, [])

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY)
    setState({ status: 'unauthenticated' })
  }, [])

  const value = useMemo(() => ({ state, signIn, signOut }), [state, signIn, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}


