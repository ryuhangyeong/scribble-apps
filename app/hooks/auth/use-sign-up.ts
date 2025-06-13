import { useFetcher } from 'react-router'
import { useForm } from '@mantine/form'

import { validateEmail } from '~/validates/auth'

import type { AuthCommonFormValues } from '~/types/auth'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SignUpFormValues extends AuthCommonFormValues {}

export function useSignUp() {
  const fetcher = useFetcher()

  const form = useForm<SignUpFormValues>({
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
