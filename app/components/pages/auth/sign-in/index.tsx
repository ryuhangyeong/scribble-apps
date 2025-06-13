import React from 'react'

import SignInTemplate from '~/components/templates/auth/sign-in'
import { useSignIn } from '~/hooks/auth/use-sign-in'
import supabaseClient from '~/libs/supabase/client'
import {
  AUTH_ERROR_MESSAGES,
  DEFAULT_ERROR_MESSAGE,
  SIGN_IN_LABEL
} from '~/constants'

import { redirect, type ClientActionFunctionArgs } from 'react-router'

const { VITE_APP_SITE_URL, VITE_APP_NAME } = import.meta.env

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const formData = await request.formData()

  const email = formData.get('email')

  const { data, error } = await supabaseClient.auth.signInWithOtp({
    email: email as string,
    options: {
      emailRedirectTo: `${VITE_APP_SITE_URL}/auth/callback`
    }
  })

  if (error) {
    alert(AUTH_ERROR_MESSAGES[error?.code || ''] || DEFAULT_ERROR_MESSAGE)
    return
  }

  if (data) {
    return redirect('/auth/sign-in/magic-link/result')
  }

  return {
    isSendMagicLink: true
  }
}

function SignInPage() {
  const { fetcher, form, handleSubmit } = useSignIn()

  return (
    <div>
      <fetcher.Form
        onSubmit={form.onSubmit((_, e) => {
          handleSubmit(e)
        })}>
        <SignInTemplate
          form={form}
          fetcher={fetcher}
        />
      </fetcher.Form>
    </div>
  )
}

export function HydrateFallback() {
  return <p>Loading...</p>
}

export default SignInPage

export function meta() {
  return [
    { title: `${SIGN_IN_LABEL} | ${VITE_APP_NAME}` },
    { name: 'description', content: `${SIGN_IN_LABEL} | ${VITE_APP_NAME}` }
  ]
}
