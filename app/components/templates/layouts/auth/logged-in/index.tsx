import React from 'react'
import { Outlet, redirect } from 'react-router'

import { getAuth } from '~/providers/auth/hooks/use-auth'

export async function clientLoader() {
  const authData = await getAuth()

  if (!authData) {
    return redirect('/auth/sign-in')
  }
}

function AuthLoggedInLayout() {
  return <Outlet />
}

export function HydrateFallback() {
  return <div />
}

export default AuthLoggedInLayout
