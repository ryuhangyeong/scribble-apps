import React from 'react'
import { useProps } from '@mantine/core'
import TodoEditInput from '../../input/todo-edit-input'
import TodoItem from '../todo-item'
import { EDIT, VIEW } from '~/constants/todo'

import type {
  HandleChangeTodoStatus,
  HandleCreateTodoType,
  HandleDeleteTodoType,
  HandleEditTodoType,
  HandleToggleTodoModalType,
  TodoType
} from '~/components/pages/todo'
// import TodoItemSkeleton from '../todo-item-skeleton'

export interface TodoItemWrapperProps {
  data: TodoType

  onEdit?: HandleEditTodoType
  onCreate?: HandleCreateTodoType
  onDelete?: HandleDeleteTodoType
  onChangeTodoStatus?: HandleChangeTodoStatus
  onToggleModal?: HandleToggleTodoModalType
}

const defaultProps: Partial<TodoItemWrapperProps> = {}

const TodoItemWrapper = (_props: TodoItemWrapperProps) => {
  const {
    data,
    onEdit,
    onCreate,
    onDelete,
    onChangeTodoStatus,
    onToggleModal
  } = useProps('TodoItemWrapper', defaultProps, _props)

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
          onToggleModal={onToggleModal}
        />
      )}

      {/* <TodoItemSkeleton /> */}
    </div>
  )
}

export default TodoItemWrapper
