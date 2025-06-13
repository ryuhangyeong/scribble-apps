import React from 'react'
import MantineProvider from '~/providers/mantine'
import AuthProvider from './auth'

export interface MainProviderProps {
  children: React.ReactNode
}

function MainProvider({ children }: MainProviderProps) {
  return (
    <AuthProvider>
      <MantineProvider>{children}</MantineProvider>
    </AuthProvider>
  )
}

export default MainProvider
