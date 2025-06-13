import React from 'react'
import { Container, useProps } from '@mantine/core'

import { SIGN_IN, SIGN_UP } from '~/constants'
import MagicLinkResultSection from '~/components/organisms/auth/magic-link-result-section'

export interface SignUpMagicLinkResultTemplateProps {
  authType?: typeof SIGN_IN | typeof SIGN_UP
}

const defaultProps: Partial<SignUpMagicLinkResultTemplateProps> = {}

function SignUpMagicLinkResultTemplate(
  _props: SignUpMagicLinkResultTemplateProps
) {
  const { authType } = useProps(
    'SignUpMagicLinkResultTemplate',
    defaultProps,
    _props
  )

  return (
    <Container>
      <MagicLinkResultSection authType={authType} />
    </Container>
  )
}

export default SignUpMagicLinkResultTemplate
