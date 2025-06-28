import React from 'react'

import TodoTemplate from '~/components/templates/todo'
import { EDIT, VIEW } from '~/constants/todo'
import { useTodo } from '~/hooks/todo/use-todo'

import type { Tables } from '~/libs/supabase/types/database.types'

const { VITE_APP_NAME } = import.meta.env

export interface TodoType extends Tables<'todos'> {
  mode?: string | null
}

export type HandleEditTodoType = ({
  id,
  todo
}: {
  id: string | null
  todo: TodoType
}) => void
export type HandleCreateTodoType = ({ todo }: { todo: TodoType }) => void
export type HandleDeleteTodoType = ({ id }: { id: string | null }) => void

export async function clientLoader() {}

export interface TodoPageFormValues {
  today: string | null
}

export interface SectionFormValues {
  title: string
  mode: typeof EDIT | typeof VIEW
}

function TodoPage() {
  const {
    data,
    form,
    sectionForm,

    handleEditTodo,
    handleCreateTodo,
    handleDeleteTodo,
    handleEditSection,
    handleCreateSection,
    handleChangeTodoStatus,
    handleDragEnd
  } = useTodo()

  return (
    <TodoTemplate
      form={form}
      sectionForm={sectionForm}
      data={data}
      onEditSection={handleEditSection}
      onEdit={handleEditTodo}
      onCreate={handleCreateTodo}
      onDelete={handleDeleteTodo}
      onCreateSection={handleCreateSection}
      onChangeTodoStatus={handleChangeTodoStatus}
      onDragEnd={handleDragEnd}
    />
  )
}

export function HydrateFallback() {
  return <div />
}

export default TodoPage

export function meta() {
  return [
    { title: VITE_APP_NAME },
    { name: 'description', content: '기록이 생활이 되는 곳' }
  ]
}
