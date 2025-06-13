import React from 'react'
import { Container, useProps } from '@mantine/core'

import AuthFormSection from '~/components/organisms/auth/auth-form-section'
import { SIGN_IN } from '~/constants'

import type { UseFormReturnType } from '@mantine/form'
import type { Fetcher } from 'react-router'

import type { SignInFormValues } from '~/hooks/auth/use-sign-in'

export interface SignInTemplateProps {
  form: UseFormReturnType<SignInFormValues>
  fetcher?: Fetcher
}

const defaultProps: Partial<SignInTemplateProps> = {}

function SignInTemplate(_props: SignInTemplateProps) {
  const { form, fetcher } = useProps('SignInTemplate', defaultProps, _props)

  return (
    <Container>
      <AuthFormSection
        authType={SIGN_IN}
        form={form}
        fetcher={fetcher}
      />
    </Container>
  )
}

export default SignInTemplate
