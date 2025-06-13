import React from 'react'
import { useProps } from '@mantine/core'

import { SIGN_IN } from '~/constants'
import SignUpMagicLinkResultTemplate from '~/components/templates/auth/sign-up/magic-link/result'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SignInMagicLinkResultPageProps {}

const defaultProps: Partial<SignInMagicLinkResultPageProps> = {}

function SignInMagicLinkResultPage(_props: SignInMagicLinkResultPageProps) {
  useProps('SignInMagicLinkResultPage', defaultProps, _props)

  return <SignUpMagicLinkResultTemplate authType={SIGN_IN} />
}

export default SignInMagicLinkResultPage
