import React from 'react'
import { Button, createPolymorphicComponent, useProps } from '@mantine/core'
import classNames from './index.module.css'

import type { Ref } from 'react'
import type { ButtonProps } from '@mantine/core'

export interface HoverButtonProps extends ButtonProps {
  ref?: Ref<HTMLButtonElement>
}

const defaultProps: Partial<HoverButtonProps> = {
  variant: 'white',
  __vars: {
    '--button-hover': 'var(--mantine-color-gray-1)',
    '--button-color': 'var(--mantine-color-gray-9)',
    '--button-justify': 'flex-start'
  }
}

function HoverButton(_props: HoverButtonProps) {
  const { ref, ...others } = useProps('HoverButton', defaultProps, _props)

  return (
    <Button
      ref={ref}
      {...others}
      classNames={classNames}
    />
  )
}

export default createPolymorphicComponent<'button', HoverButtonProps>(
  HoverButton
)
