import React from 'react'
import { useForm } from '@mantine/form'
import type { TodoType } from '~/components/pages/todo'
import TodoDetailTemplate from '~/components/templates/todo/detail'
import { EDIT, VIEW } from '~/constants/todo'
import supabaseClient from '~/libs/supabase/client'
import { DEFAULT_ERROR_MESSAGE } from '~/constants'
import { useProps } from '@mantine/core'

export interface TodoDetailModalProps {
  todo?: TodoType
  onUpdateTodo?: ({ todo }: { todo: TodoType }) => void
}

const defaultProps: Partial<TodoDetailModalProps> = {}

export interface TodoDetailFormValues extends TodoType {
  editorMode?: typeof EDIT | typeof VIEW
}

export type HandleUpdateTodo = () => void

export const TodoDetailModalDefaultProps = {
  styles: {
    body: {
      '--mb-padding': '0'
    }
  },
  classNames: {
    header:
      'border-0 border-b-1 border-solid border-[var(--mantine-color-gray-3)]'
  },
  size: 800
}

export const TodoDetailModal = (_props: TodoDetailModalProps) => {
  const { todo, onUpdateTodo } = useProps(
    'TodoDetailModal',
    defaultProps,
    _props
  )

  const form = useForm<TodoDetailFormValues>({
    initialValues: {
      ...(todo as TodoType),
      editorMode: VIEW
    }
  })

  const handleUpdateTodo: HandleUpdateTodo = async () => {
    try {
      if (todo?.id) {
        const getUpdateData = await supabaseClient
          .from('todos')
          .update({
            title: form?.values?.title || '',
            description: form?.values?.description || ''
          })
          .eq('id', todo?.id)
          .select()

        console.log(getUpdateData)

        alert('수정 되었습니다.')
        form?.setFieldValue('editorMode', VIEW)

        onUpdateTodo?.({
          todo: getUpdateData?.data?.[0] || ({} as TodoType)
        })
      }
    } catch {
      alert(DEFAULT_ERROR_MESSAGE)
    }
  }

  return (
    <div>
      <TodoDetailTemplate
        todo={todo || ({} as TodoType)}
        form={form}
        onUpdateTodo={handleUpdateTodo}
      />
    </div>
  )
}
