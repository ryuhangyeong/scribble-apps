import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/tiptap/styles.css'

import 'dayjs/locale/ko'

import React from 'react'
import { MantineProvider as MantineCoreProvider } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import { ModalsProvider } from '@mantine/modals'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

import theme from '~/libs/mantine/theme'

export interface MantineProviderProps {
  children: React.ReactNode
}

function MantineProvider({ children }: MantineProviderProps) {
  return (
    <MantineCoreProvider
      theme={theme}
      defaultColorScheme="light">
      <ModalsProvider>
        <DatesProvider
          settings={{ locale: 'ko', firstDayOfWeek: 0, consistentWeeks: true }}>
          {children}
        </DatesProvider>
      </ModalsProvider>
    </MantineCoreProvider>
  )
}

export default MantineProvider
