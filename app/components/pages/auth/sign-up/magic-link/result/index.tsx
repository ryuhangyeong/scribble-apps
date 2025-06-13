import React from 'react'
import { useProps } from '@mantine/core'

import { SIGN_UP } from '~/constants'
import SignUpMagicLinkResultTemplate from '~/components/templates/auth/sign-up/magic-link/result'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SignUpMagicLinkResultPageProps {}

const defaultProps: Partial<SignUpMagicLinkResultPageProps> = {}

function SignUpMagicLinkResultPage(_props: SignUpMagicLinkResultPageProps) {
  useProps('SignUpMagicLinkResultPage', defaultProps, _props)

  return <SignUpMagicLinkResultTemplate authType={SIGN_UP} />
}

export default SignUpMagicLinkResultPage
