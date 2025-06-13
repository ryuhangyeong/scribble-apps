import React from 'react'
import { Button, createPolymorphicComponent, useProps } from '@mantine/core'

import type { Ref } from 'react'
import type { ButtonProps } from '@mantine/core'

export interface SocialLoginButtonProps extends ButtonProps {
  ref?: Ref<HTMLButtonElement>
  logoSection: React.ReactNode
  children: React.ReactNode
}

const defaultProps: Partial<SocialLoginButtonProps> = {
  logoSection: null,
  variant: 'default',
  fullWidth: true,
  styles: {
    root: {
      '--button-fz': '16px',
      '--button-height': '46px'
    }
  }
}

function SocialLoginButton(_props: SocialLoginButtonProps) {
  const { logoSection, children, ref, ...others } = useProps(
    'SocialLoginButton',
    defaultProps,
    _props
  )

  return (
    <Button
      ref={ref}
      {...others}>
      {logoSection && <div className="absolute left-4">{logoSection}</div>}
      {children}
    </Button>
  )
}

export default createPolymorphicComponent<'button', SocialLoginButtonProps>(
  SocialLoginButton
)
