import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { isNotEmpty, useForm } from '@mantine/form'

import { useParams } from 'react-router'
import TodoTemplate from '~/components/templates/todo'
import { EDIT, LOW, NOT_SECTION, VIEW } from '~/constants/todo'
import supabaseClient from '~/libs/supabase/client'
import { useAuthState } from '~/providers/auth'
import dayjs from 'dayjs'
import { DEFAULT_DAYJS_FORMAT } from '~/constants/date'
import { produce } from 'immer'
import { useWindowEvent } from '@mantine/hooks'
import type { TodoItemProps } from '~/components/organisms/todo/item/todo-item'
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
  const params = useParams()
  const authState = useAuthState()

  const [data, setData] = useState<
    {
      id: string
      title: string | null
      mode: string | null
      todos: TodoType[]
    }[]
  >([])

  const form = useForm<TodoPageFormValues>({
    initialValues: {
      today: dayjs().format(DEFAULT_DAYJS_FORMAT)
    }
  })

  const todayRange = useMemo(() => {
    const startAt = dayjs(form?.values?.today).startOf('day')
    const endAt = startAt.add(1, 'day')

    return {
      startAt: startAt?.toISOString(),
      endAt: endAt?.toISOString()
    }
  }, [form?.values?.today])

  const sectionForm = useForm<SectionFormValues>({
    initialValues: {
      title: '',
      mode: VIEW
    },
    validate: {
      title: value => {
        if (isNotEmpty()(value)) {
          return '섹션 이름을 입력해주세요.'
        }

        return null
      }
    }
  })

  const handleEditTodo: HandleEditTodoType = ({ id, todo }) => {
    setData(
      produce(draft => {
        draft?.forEach(section => {
          section?.todos?.forEach(todo => {
            todo.mode = VIEW
          })
        })

        const targetSection = (draft || [])?.find(s =>
          s?.todos?.find(t => t?.id === id)
        )

        const targetTodo = (targetSection?.todos || [])?.find(t => t?.id === id)

        if (!targetTodo) return

        targetTodo.mode = todo?.mode || VIEW
      })
    )
  }

  const handleCreateTodo: HandleCreateTodoType = async ({ todo }) => {
    if (!authState?.data?.session?.user?.id || !params?.projectId) return

    if (!todo?.id) {
      // @MEMO section_id가 있으면 오늘 날짜로 시작일과 종료일을 설정
      await supabaseClient.from('todos').insert({
        project_id: params?.projectId,
        user_id: authState?.data?.session?.user?.id,
        title: todo?.title,
        description: todo?.description || null,
        priority: todo?.priority || LOW,
        section_id: todo?.section_id || null,
        start_at: todo?.section_id ? todayRange?.startAt : null,
        end_at: todo?.section_id ? todayRange?.endAt : null,
        status: 'todo'
      })
    } else {
      await supabaseClient
        .from('todos')
        .update({
          title: todo?.title,
          description: todo?.description || null,
          priority: todo?.priority || LOW
        })
        .eq('id', todo?.id)
    }

    getData()
  }

  const handleDeleteTodo: HandleDeleteTodoType = async ({ id }) => {
    const isConfirm = window.confirm('정말 삭제하시겠습니까?')
    if (!isConfirm) return

    if (id) {
      await supabaseClient?.from('todos')?.delete()?.eq('id', id)
    }

    getData()
  }

  const handleEditSection = ({ id }: { id: string | null }) => {
    setData(
      produce(draft => {
        draft?.forEach(section => {
          section.mode = VIEW
          if (section?.id === id) {
            section.mode = EDIT
          }
        })
      })
    )
  }

  const getData = useCallback(async () => {
    try {
      // @MEMO 섹션 및 날짜 지정하지 않은 할 일 데이터 가져오기
      const { data: notSectionTodoData } = await supabaseClient
        .from('todos')
        .select(
          `
            id,
            title,
            description,
            priority,
            section_id,
            status,
            created_at,
            start_at,
            end_at
          `
        )
        .is('section_id', null)
        .is('start_at', null)
        .is('end_at', null)
        .order('created_at', { ascending: true })

      const { data: sectionData } = await supabaseClient
        .from('sections')
        .select(
          `
            id,
            title,
            todos (
              id,
              title,
              description,
              priority,
              section_id,
              status,
              created_at,
              start_at,
              end_at
            )
          `
        )
        .order('created_at', { foreignTable: 'todos', ascending: true })
        .gte('start_at', todayRange?.startAt)
        .lte('end_at', todayRange?.endAt)

      const data = [
        {
          id: NOT_SECTION,
          title: '날짜 미지정 할 일',
          mode: VIEW,
          todos: (notSectionTodoData || [])?.map(todo => {
            return {
              ...todo,
              mode: VIEW
            }
          }) as TodoType[]
        },
        ...(sectionData || [])
      ]?.map(section => {
        return {
          ...section,
          mode: VIEW,
          todos: (section?.todos || [])?.map(todo => {
            return {
              ...todo,
              mode: VIEW
            }
          }) as TodoType[]
        }
      })

      setData(data)
    } catch {
      console.log('error')
    }
  }, [todayRange?.endAt, todayRange?.startAt])

  const handleCreateSection = async () => {
    try {
      if (!authState?.data?.session?.user?.id || !params?.projectId) return

      await supabaseClient?.from('sections')?.insert({
        title: sectionForm?.values?.title,
        user_id: authState?.data?.session?.user?.id,
        project_id: params?.projectId,
        start_at: todayRange?.startAt,
        end_at: todayRange?.endAt
      })

      sectionForm.reset()
      getData()
    } catch {
      console.log('error')
    }
  }

  const handleChangeTodoStatus: TodoItemProps['onChangeTodoStatus'] = async ({
    checked,
    id
  }) => {
    try {
      if (!id) return

      await supabaseClient
        .from('todos')
        .update({
          status: checked ? 'done' : 'todo'
        })
        .eq('id', id)
      getData()
    } catch {
      console.log('error')
    }
  }

  useEffect(() => {
    getData()
  }, [todayRange.endAt, todayRange.startAt, form.values.today, getData])

  useWindowEvent('keydown', e => {
    if (e?.code === 'Escape' || e?.key === 'Escape') {
      setData(
        produce(draft => {
          draft?.forEach(section => {
            section.mode = VIEW

            section?.todos?.forEach(todo => {
              todo.mode = VIEW
            })
          })
        })
      )

      sectionForm.reset()
    }
  })

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
