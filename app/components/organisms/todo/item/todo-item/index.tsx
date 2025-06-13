import React from 'react'
import { ActionIcon, Checkbox, Tooltip, useProps } from '@mantine/core'
import { FiEdit } from 'react-icons/fi'
import { FaRegTrashCan } from 'react-icons/fa6'

import type {
  HandleDeleteTodoType,
  HandleEditTodoType,
  TodoType
} from '~/components/pages/todo'
import { EDIT, LOW } from '~/constants/todo'
import { priorityColorMap } from '../../input/todo-edit-input'
import TodoItemLayoutSection from '../todo-item-layout-section'

export interface TodoItemProps {
  data: TodoType

  onEdit?: HandleEditTodoType
  onDelete?: HandleDeleteTodoType

  onChangeTodoStatus?: ({
    checked,
    id
  }: {
    checked: boolean
    id: string
  }) => void
}

const defaultProps: Partial<TodoItemProps> = {}

const TodoItem = (_props: TodoItemProps) => {
  const { data, onEdit, onDelete, onChangeTodoStatus } = useProps(
    'TodoItem',
    defaultProps,
    _props
  )

  return (
    <TodoItemLayoutSection
      checkboxSection={
        <Checkbox
          radius="lg"
          size="sm"
          styles={{
            body: {
              border: `1px solid ${priorityColorMap[data?.priority || LOW]}`,
              borderRadius: '50%'
            }
          }}
          color={priorityColorMap[data?.priority || LOW]}
          onChange={e => {
            onChangeTodoStatus?.({
              checked: e?.target?.checked || false,
              id: data?.id || ''
            })
          }}
          checked={data?.status === 'done'}
        />
      }
      titleSection={<p className="text-md">{data?.title}</p>}
      descriptionSection={<p className="text-xs">{data?.description}</p>}
      actionSection={
        <>
          <div>
            <Tooltip
              label="편집"
              onClick={() =>
                onEdit?.({
                  id: data?.id || null,
                  todo: {
                    ...data,
                    mode: EDIT
                  }
                })
              }>
              <ActionIcon
                variant="white"
                __vars={{
                  '--ai-hover': `var(--mantine-color-gray-1)`
                }}
                c={'var(--mantine-color-gray-9)'}>
                <FiEdit />
              </ActionIcon>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              label="삭제"
              onClick={() => onDelete?.({ id: data?.id })}>
              <ActionIcon
                variant="white"
                __vars={{
                  '--ai-hover': `var(--mantine-color-gray-1)`
                }}
                c={'var(--mantine-color-gray-9)'}>
                <FaRegTrashCan className="text-[var(--mantine-color-red-4)]" />
              </ActionIcon>
            </Tooltip>
          </div>
        </>
      }
    />
  )
}

export default TodoItem
