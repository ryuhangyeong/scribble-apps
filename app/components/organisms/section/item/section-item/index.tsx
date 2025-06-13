import React from 'react'
import { Divider, UnstyledButton, useProps } from '@mantine/core'
import { GoPlus } from 'react-icons/go'
import TodoEditInput from '~/components/organisms/todo/input/todo-edit-input'
import { CREATE_TODO_LABEL, EDIT, VIEW } from '~/constants/todo'
import type {
  HandleCreateTodoType,
  HandleEditTodoType,
  TodoType
} from '~/components/pages/todo'

export interface SectionItemProps {
  data: {
    id: string | null
    title: string | null
    mode: string | null
    todos: TodoType[]
  }

  onEditSection?: ({ id }: { id: string | null }) => void

  onEditTodo?: HandleEditTodoType
  onCreateTodo?: HandleCreateTodoType
}

const defaultProps: Partial<SectionItemProps> = {}

const SectionItem = (_props: SectionItemProps) => {
  const { data, onEditSection, onEditTodo, onCreateTodo } = useProps(
    'SectionItem',
    defaultProps,
    _props
  )

  const handleEditTodo: HandleEditTodoType = ({ id, todo }) => {
    onEditTodo?.({ id, todo })
  }

  const handleCreateTodo: HandleCreateTodoType = ({ todo }) => {
    onCreateTodo?.({ todo })
  }

  return (
    <div>
      <div>
        <Divider
          label={
            <div>
              <UnstyledButton className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--mantine-color-gray-9)]">
                  {data?.title}
                </span>
              </UnstyledButton>
            </div>
          }
          className="my-8"
          color={'var(--mantine-color-gray-3)'}
        />
      </div>

      {data?.mode === EDIT && (
        <div>
          <TodoEditInput
            isFocusTrap={true}
            onEdit={handleEditTodo}
            onCreate={handleCreateTodo}
          />
        </div>
      )}

      {data?.mode === VIEW && (
        <div>
          <UnstyledButton
            size={'xl'}
            onClick={() =>
              onEditSection?.({
                id: data?.id || null
              })
            }>
            <div className="flex items-center gap-2">
              <div>
                <GoPlus />
              </div>
              <span className="text-sm">{CREATE_TODO_LABEL}</span>
            </div>
          </UnstyledButton>
        </div>
      )}
    </div>
  )
}

export default SectionItem
