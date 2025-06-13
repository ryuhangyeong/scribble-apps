import React from 'react'
import { redirect } from 'react-router'
import { DEFAULT_ERROR_MESSAGE, SIGN_IN_LABEL } from '~/constants'

const { VITE_APP_NAME } = import.meta.env

export async function clientLoader() {
  const hash = window?.location?.hash?.substring?.(1)
  const params = new URLSearchParams(hash)
  const error = params?.get('error')
  const errorDescription = params?.get('error_description')

  if (error) {
    alert(errorDescription || DEFAULT_ERROR_MESSAGE)
  }

  return redirect(`/`)
}

function CallbackPage() {
  return <div />
}

export function HydrateFallback() {
  return <div />
}

export default CallbackPage

export function meta() {
  return [
    { title: VITE_APP_NAME },
    { name: 'description', content: `${SIGN_IN_LABEL} | ${VITE_APP_NAME}` }
  ]
}
