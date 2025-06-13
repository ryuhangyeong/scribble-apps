import { useCallback, useEffect, useReducer } from 'react'
import { produce } from 'immer'

import supabaseClient from '~/libs/supabase/client'

import type { Session } from '@supabase/supabase-js'

export const SET_DATA = 'SET_DATA'
export const SET_STATUS = 'SET_STATUS'

export interface AuthStateDataType {
  session?: Session | null
}

export interface AuthStateStatusType {
  loading?: boolean
  error?: Error | null
}

export interface AuthStateType {
  data: AuthStateDataType
  status: AuthStateStatusType
}

export interface AuthActionSetDataType {
  type: typeof SET_DATA
  data: AuthStateDataType
}

export interface AuthActionSetStatusType {
  type: typeof SET_STATUS
  data: AuthStateStatusType
}

export type AuthActionType = AuthActionSetDataType | AuthActionSetStatusType

export interface AuthDispatchType {
  setData: (value: AuthStateDataType) => void
  setStatus: (value: AuthStateStatusType) => void
}

export const INIT_AUTH_DATA_STATE = {
  session: null
}

export const INIT_AUTH_STATUS_STATE = {
  loading: false,
  error: null
}

export const INIT_AUTH_STATE: AuthStateType = {
  data: INIT_AUTH_DATA_STATE,
  status: INIT_AUTH_STATUS_STATE
}

export const authReducer = (
  state: AuthStateType,
  action: AuthActionType
): AuthStateType => {
  switch (action.type) {
    case SET_DATA:
      return produce(state, draft => {
        draft.data = {
          ...state?.data,
          ...action?.data
        }
      })
    case SET_STATUS:
      return produce(state, draft => {
        draft.status = {
          ...state?.status,
          ...action?.data
        }
      })
    default:
      throw new Error('Invalid action type')
  }
}

export function useAuth() {
  const [state, dispatch] = useReducer(authReducer, INIT_AUTH_STATE)

  const setData: AuthDispatchType['setData'] = useCallback(value => {
    dispatch({
      type: SET_DATA,
      data: value
    })
  }, [])

  const setStatus: AuthDispatchType['setStatus'] = useCallback(value => {
    dispatch({
      type: SET_STATUS,
      data: value
    })
  }, [])

  useEffect(() => {
    const {
      data: { subscription }
    } = supabaseClient.auth.onAuthStateChange((_, session) => {
      setData({
        session
      })
    })

    return () => subscription?.unsubscribe()
  }, [setData])

  return {
    state,

    setData,
    setStatus
  }
}

export function getAuth() {
  return new Promise(resolve => {
    supabaseClient.auth.onAuthStateChange((_, session) => {
      resolve(session)
    })
  })
}
