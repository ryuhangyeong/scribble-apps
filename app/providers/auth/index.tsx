import React from 'react'
import { createContext, useContext } from 'react'
import { INIT_AUTH_STATE, useAuth } from './hooks/use-auth'

import type { AuthDispatchType, AuthStateType } from './hooks/use-auth'

export const AuthStateContext = createContext<AuthStateType>(INIT_AUTH_STATE)

export const AuthDispatchContext = createContext<AuthDispatchType | null>(null)

export interface AuthProviderProps {
  children: React.ReactNode
}

function AuthProvider({ children }: AuthProviderProps) {
  const { state, setData, setStatus } = useAuth()

  return (
    <AuthDispatchContext.Provider
      value={{
        setData,
        setStatus
      }}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  )
}

export function useAuthState() {
  const ctx = useContext(AuthStateContext)

  if (ctx === null) {
    throw new Error(
      `${useAuthState?.name} must be used within a ${AuthProvider?.name}`
    )
  }

  return ctx
}

export function useAuthDispatch() {
  const ctx = useContext(AuthDispatchContext)

  if (ctx === null) {
    throw new Error(
      `${useAuthDispatch?.name} must be used within a ${AuthProvider?.name}`
    )
  }

  return ctx
}

export default AuthProvider
