import { useFetcher } from 'react-router'
import { useForm } from '@mantine/form'

import { validateEmail } from '~/validates/auth'

import type { AuthCommonFormValues } from '~/types/auth'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SignInFormValues extends AuthCommonFormValues {}

export function useSignIn() {
  const fetcher = useFetcher()

  const form = useForm<SignInFormValues>({
    initialValues: {
      email: ''
    },
    validate: {
      email: (value: string) => {
        return validateEmail(value)
      }
    }
  })

  function handleSubmit(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault()

    if (e?.currentTarget) {
      fetcher.submit(e?.currentTarget, {
        method: 'post'
      })
    }
  }

  return {
    fetcher,
    form,
    handleSubmit
  }
}
