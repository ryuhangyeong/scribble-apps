import React from 'react'
import { Container, useProps } from '@mantine/core'

import AuthFormSection from '~/components/organisms/auth/auth-form-section'
import { SIGN_UP } from '~/constants'

import type { UseFormReturnType } from '@mantine/form'
import type { Fetcher } from 'react-router'

import type { SignUpFormValues } from '~/hooks/auth/use-sign-up'

export interface SignUpTemplateProps {
  form: UseFormReturnType<SignUpFormValues>
  fetcher?: Fetcher
}

const defaultProps: Partial<SignUpTemplateProps> = {}

function SignUpTemplate(_props: SignUpTemplateProps) {
  const { form, fetcher } = useProps('SignUpTemplate', defaultProps, _props)

  return (
    <Container>
      <AuthFormSection
        authType={SIGN_UP}
        form={form}
        fetcher={fetcher}
      />
    </Container>
  )
}

export default SignUpTemplate
