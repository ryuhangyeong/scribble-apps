import React from 'react'
import { Container, useProps } from '@mantine/core'

import { SIGN_IN, SIGN_UP } from '~/constants'
import MagicLinkResultSection from '~/components/organisms/auth/magic-link-result-section'

export interface SignInMagicLinkResultTemplateProps {
  authType?: typeof SIGN_IN | typeof SIGN_UP
}

const defaultProps: Partial<SignInMagicLinkResultTemplateProps> = {}

function SignInMagicLinkResultTemplate(
  _props: SignInMagicLinkResultTemplateProps
) {
  const { authType } = useProps(
    'SignInMagicLinkResultTemplate',
    defaultProps,
    _props
  )

  return (
    <Container>
      <MagicLinkResultSection authType={authType} />
    </Container>
  )
}

export default SignInMagicLinkResultTemplate
