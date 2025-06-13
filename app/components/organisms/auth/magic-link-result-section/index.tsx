import React from 'react'
import { Link } from 'react-router'
import { Alert, Anchor, useProps } from '@mantine/core'
import { HiOutlineChevronLeft } from 'react-icons/hi2'

import { SIGN_IN, SIGN_IN_LABEL, SIGN_UP, SIGN_UP_LABEL } from '~/constants'

export interface MagicLinkResultSectionProps {
  authType?: typeof SIGN_IN | typeof SIGN_UP
}

const defaultProps: Partial<MagicLinkResultSectionProps> = {}

function MagicLinkResultSection(_props: MagicLinkResultSectionProps) {
  const { authType } = useProps('MagicLinkResultSection', defaultProps, _props)

  return (
    <div>
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <HiOutlineChevronLeft />

          <Anchor
            component={Link}
            to={`/auth/${authType}`}
            size="sm"
            c={`var(--mantine-color-gray-9)`}>
            뒤로 가기
          </Anchor>
        </div>
      </div>

      <div className="my-8">
        <Alert
          variant="filled"
          color={`var(--mantine-color-gray-9)`}
          radius="xs"
          title="이메일 확인">
          <p className="font-thin">
            {authType === SIGN_IN ? SIGN_IN_LABEL : SIGN_UP_LABEL} 링크가
            이메일로 전송되었습니다.
          </p>
        </Alert>
      </div>
    </div>
  )
}

export default MagicLinkResultSection
