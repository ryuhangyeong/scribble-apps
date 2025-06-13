import React from 'react'
import { useProps } from '@mantine/core'

export interface TodoItemLayoutSectionProps {
  checkboxSection?: React.ReactNode
  titleSection?: React.ReactNode
  descriptionSection?: React.ReactNode
  actionSection?: React.ReactNode
}

const defaultProps: Partial<TodoItemLayoutSectionProps> = {}

const TodoItemLayoutSection = (_props: TodoItemLayoutSectionProps) => {
  const { checkboxSection, titleSection, descriptionSection, actionSection } =
    useProps('TodoItemLayoutSection', defaultProps, _props)

  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <div className="mt-1">{checkboxSection}</div>
        <div className="flex flex-col gap-1">
          <div>{titleSection}</div>
          <div>{descriptionSection}</div>
        </div>
      </div>
      <div className="flex gap-1">{actionSection}</div>
    </div>
  )
}

export default TodoItemLayoutSection
