import React, { useMemo } from 'react'
import { noop, Tooltip, useProps } from '@mantine/core'

import GoogleSocialLoginLogo from '~/components/atoms/logo/google-social-login'
import SocialLoginButton from '~/components/atoms/button/social-login-button'
import {
  GOOGLE_LABEL,
  SIGN_IN,
  SIGN_IN_LABEL,
  SIGN_UP,
  SIGN_UP_LABEL
} from '~/constants'

export interface SocialLoginButtons {
  authType?: typeof SIGN_IN | typeof SIGN_UP

  onClickGoogleLogin?: () => void
  onClickKakaoLogin?: () => void
}

export const defaultProps: Partial<SocialLoginButtons> = {
  authType: SIGN_IN,

  onClickGoogleLogin: noop
}

function SocialLoginButtons(_props: SocialLoginButtons) {
  const { authType, onClickGoogleLogin } = useProps(
    'SocialLoginButtons',
    defaultProps,
    _props
  )

  const authTypeLabel = useMemo(() => {
    if (authType === SIGN_IN) {
      return SIGN_IN_LABEL
    }

    if (authType === SIGN_UP) {
      return SIGN_UP_LABEL
    }
  }, [authType])

  return (
    <div className="flex flex-col gap-2">
      <div>
        <Tooltip label="준비중입니다">
          <SocialLoginButton
            logoSection={<GoogleSocialLoginLogo />}
            onClick={onClickGoogleLogin}
            disabled>
            <span className="font-normal">
              {GOOGLE_LABEL}로 {authTypeLabel}
            </span>
          </SocialLoginButton>
        </Tooltip>
      </div>
    </div>
  )
}

export default SocialLoginButtons
