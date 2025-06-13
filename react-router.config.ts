import type { Config } from '@react-router/dev/config'

export default {
  ssr: false,
  prerender: [
    '/auth/sign-in',
    '/auth/sign-in/magic-link/result',
    '/auth/sign-up',
    '/auth/sign-up/magic-link/result'
  ]
} satisfies Config
