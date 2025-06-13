import React, { useMemo } from 'react'
import { Link } from 'react-router'
import { Anchor, Button, Divider, TextInput, useProps } from '@mantine/core'

import SocialLoginButtons from '~/components/organisms/auth/social-login-buttons'
import {
  ACCOUNTS_LABEL,
  OR_LABEL,
  SIGN_IN,
  SIGN_IN_LABEL,
  SIGN_UP,
  SIGN_UP_LABEL
} from '~/constants'

import type { Fetcher } from 'react-router'
import type { UseFormReturnType } from '@mantine/form'
import type { SignUpFormValues } from '~/hooks/auth/use-sign-up'

const { VITE_APP_NAME } = import.meta.env

export interface AuthFormSectionProps {
  authType?: typeof SIGN_IN | typeof SIGN_UP
  form: UseFormReturnType<SignUpFormValues>
  fetcher?: Fetcher
}

const defaultProps: Partial<AuthFormSectionProps> = {}

function AuthFormSection(_props: AuthFormSectionProps) {
  const { authType, form, fetcher } = useProps(
    'AuthFormSection',
    defaultProps,
    _props
  )

  const title = useMemo(() => {
    if (authType === SIGN_IN) {
      return `${SIGN_IN_LABEL}`
    }

    return `${ACCOUNTS_LABEL} 만들기`
  }, [authType])

  const description = useMemo(() => {
    if (authType === SIGN_IN) {
      return `${ACCOUNTS_LABEL}이 없으신가요?`
    }

    return `이미 ${ACCOUNTS_LABEL}이 있으신가요?`
  }, [authType])

  const loading = useMemo(() => {
    return ['submitting'].includes(fetcher?.state || '')
  }, [fetcher?.state])

  return (
    <div>
      <div className="my-10 flex justify-center">
        <h2 className="text-4xl font-bold">
          <span className="mr-2 font-[Roboto]">{VITE_APP_NAME}</span>
          <span>{title}</span>
        </h2>
      </div>

      <SocialLoginButtons authType={authType} />

      <Divider
        my={'lg'}
        label={<p className="text-[var(--mantine-color-gray-8)]">{OR_LABEL}</p>}
        labelPosition="center"
      />

      <div className="flex flex-col gap-4">
        <div>
          <TextInput
            size="md"
            label="이메일 주소"
            classNames={{
              label: 'mb-2'
            }}
            name="email"
            readOnly={loading}
            {...form.getInputProps('email')}
          />
        </div>

        <div>
          <Button
            type="submit"
            color="var(--mantine-color-gray-9)"
            fullWidth
            size="lg"
            loading={loading}>
            {authType === SIGN_IN ? SIGN_IN_LABEL : SIGN_UP_LABEL?.slice(2, 4)}
          </Button>
        </div>

        <div className="flex justify-between">
          <p className="text-sm">{description}</p>
          <div>
            <Anchor
              component={Link}
              to={`/auth/${authType === SIGN_IN ? SIGN_UP : SIGN_IN}`}
              c={'var(--mantine-color-gray-8)'}
              size="sm"
              fw={700}>
              {authType === SIGN_IN ? SIGN_UP_LABEL : SIGN_IN_LABEL}
            </Anchor>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthFormSection
