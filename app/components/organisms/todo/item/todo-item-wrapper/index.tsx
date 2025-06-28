import React from 'react'
import { useProps } from '@mantine/core'
import TodoEditInput from '../../input/todo-edit-input'
import TodoItem, { type TodoItemProps } from '../todo-item'
import { EDIT, VIEW } from '~/constants/todo'

import type {
  HandleCreateTodoType,
  HandleDeleteTodoType,
  HandleEditTodoType,
  TodoType
} from '~/components/pages/todo'
// import TodoItemSkeleton from '../todo-item-skeleton'

export interface TodoItemWrapperProps {
  data: TodoType

  onEdit?: HandleEditTodoType
  onCreate?: HandleCreateTodoType
  onDelete?: HandleDeleteTodoType
  onChangeTodoStatus?: TodoItemProps['onChangeTodoStatus']
}

const defaultProps: Partial<TodoItemWrapperProps> = {}

const TodoItemWrapper = (_props: TodoItemWrapperProps) => {
  const { data, onEdit, onCreate, onDelete, onChangeTodoStatus } = useProps(
    'TodoItemWrapper',
    defaultProps,
    _props
  )

  return (
    <div className="w-full">
      {data?.mode === EDIT && (
        <TodoEditInput
          data={data}
          createLabel="수정하기"
          isFocusTrap={true}
          onEdit={onEdit}
          onCreate={onCreate}
          paperStylesProps={{
            root: {
              '--paper-border-color': `var(--mantine-color-gray-4)`
            }
          }}
        />
      )}

      {data?.mode === VIEW && (
        <TodoItem
          data={data}
          onEdit={onEdit}
          onDelete={onDelete}
          onChangeTodoStatus={onChangeTodoStatus}
        />
      )}

      {/* <TodoItemSkeleton /> */}
    </div>
  )
}

export default TodoItemWrapper
