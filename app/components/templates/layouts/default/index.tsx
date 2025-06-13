import React from 'react'
import { redirect } from 'react-router'
import supabaseClient from '~/libs/supabase/client'

import { getAuth } from '~/providers/auth/hooks/use-auth'

export async function clientLoader() {
  const authData = await getAuth()

  if (authData) {
    const projectData = await supabaseClient
      .from('projects')
      .select(
        `
          id,
          type
        `
      )
      .order('created_at', { ascending: false })

    const targetProject = projectData?.data?.find(
      project => project.type === 'MY'
    )

    if (targetProject) {
      return redirect(`/todo/${targetProject?.id}`)
    }
  }

  return redirect('/auth/sign-in')
}

function DefaultLayout() {
  return <div />
}

export function HydrateFallback() {
  return <div />
}

export default DefaultLayout
