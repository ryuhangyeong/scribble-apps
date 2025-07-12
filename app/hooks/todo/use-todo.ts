import { isNotEmpty, useForm } from '@mantine/form'
import { useWindowEvent } from '@mantine/hooks'
import dayjs from 'dayjs'
import { produce } from 'immer'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import type { TodoItemProps } from '~/components/organisms/todo/item/todo-item'
import type {
  HandleCreateTodoType,
  HandleDeleteTodoType,
  HandleEditTodoType,
  HandleToggleTodoModalType,
  SectionFormValues,
  TodoPageFormValues,
  TodoType
} from '~/components/pages/todo'
import { DEFAULT_DAYJS_FORMAT } from '~/constants/date'
import { DEFAULT_ORDER, EDIT, LOW, NOT_SECTION, VIEW } from '~/constants/todo'
import supabaseClient from '~/libs/supabase/client'
import { useAuthState } from '~/providers/auth'
import { DEFAULT_ERROR_MESSAGE } from '~/constants'

import type { TodoTemplateProps } from '~/components/templates/todo'
import type { Tables } from '~/libs/supabase/types/database.types'

export const useTodo = () => {
  const params = useParams()
  const authState = useAuthState()

  const [data, setData] = useState<
    {
      id: string
      title: string | null
      mode: string | null
      todos: (TodoType & {
        modal?: {
          opened?: boolean
        }
      })[]
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
      let query = supabaseClient
        .from('todos')
        .select('order')
        .order('order', { ascending: false })
        .limit(1)

      if (todo?.section_id) {
        query = query.eq('section_id', todo.section_id)
      } else {
        query = query.is('section_id', null)
      }

      const { data } = await query

      await supabaseClient.from('todos').insert({
        project_id: params?.projectId,
        user_id: authState?.data?.session?.user?.id,
        title: todo?.title,
        description: todo?.description || null,
        priority: todo?.priority || LOW,
        section_id: todo?.section_id || null,
        start_at: todo?.section_id ? todayRange?.startAt : null,
        end_at: todo?.section_id ? todayRange?.endAt : null,
        status: 'todo',
        order:
          data?.length === 0
            ? DEFAULT_ORDER
            : (data?.[0]?.order || DEFAULT_ORDER) + DEFAULT_ORDER
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
            end_at,
            order
          `
        )
        .is('section_id', null)
        .is('start_at', null)
        .is('end_at', null)
        .order('order', { ascending: true })

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
              end_at,
              order
            )
          `
        )
        .order('order', { foreignTable: 'todos', ascending: true })
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
              mode: VIEW,
              modal: {
                opened: false
              }
            }
          }) as (TodoType & {
            modal?: {
              opened?: boolean
            }
          })[]
        }
      })

      setData(data)
    } catch (error) {
      alert(DEFAULT_ERROR_MESSAGE)
      console.log(error)
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
    } catch (error) {
      alert(DEFAULT_ERROR_MESSAGE)
      console.log(error)
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
    } catch (error) {
      alert(DEFAULT_ERROR_MESSAGE)
      console.log(error)
    }
  }

  const handleDragEnd: TodoTemplateProps['onDragEnd'] = async value => {
    const { source, destination } = value

    // 변경사항이 없는 경우 무시
    if (
      !source ||
      !destination ||
      (source?.droppableId === destination?.droppableId &&
        source?.index === destination?.index)
    ) {
      return
    }

    if (
      source?.droppableId !== destination?.droppableId &&
      !(
        source?.droppableId?.split('/')[1] === NOT_SECTION &&
        destination?.droppableId?.split('/')[1] !== NOT_SECTION
      )
    ) {
      alert('다른 섹션으로 이동할 수 없습니다.')
      return
    }

    const getDragData = (
      data: {
        id: string
        title: string | null
        mode: string | null
        todos: TodoType[]
      }[]
    ) => {
      // 드래그 시작점 섹션 정보
      const sourceSection = (data || [])?.find(s => {
        return s?.id === source?.droppableId?.split?.('/')?.[1]
      })

      // 드래그 도착점 섹션 정보
      const destinationSection = (data || [])?.find(s => {
        return s?.id === destination?.droppableId?.split?.('/')?.[1]
      })

      // 드래그한 할 일 정보
      const sourceTodo = (sourceSection?.todos || [])?.find(t => {
        return t?.id === value?.draggableId
      })

      return {
        sourceSection,
        destinationSection,
        sourceTodo
      }
    }

    setData(
      produce(draft => {
        const { sourceSection, destinationSection, sourceTodo } = getDragData(
          draft || []
        )

        if (!sourceSection || !destinationSection || !sourceTodo) return

        // 드래그 시작점 섹션에서 기존 할 일 제거
        sourceSection?.todos?.splice(source?.index, 1)
        // 드래그 도착점 섹션에 할 일 추가
        destinationSection?.todos?.splice(
          destination?.index || 0,
          0,
          sourceTodo
        )
      })
    )

    // @REFACTOR 간소화 작업 필요
    try {
      const UPDATED_SAME_SECTION =
        source?.droppableId?.split('/')?.[1] !== NOT_SECTION &&
        destination?.droppableId?.split('/')?.[1] !== NOT_SECTION

      const UPDATED_SAME_NOT_SECTION =
        source?.droppableId?.split('/')?.[1] === NOT_SECTION &&
        destination?.droppableId?.split('/')?.[1] === NOT_SECTION

      const UPDATE_NOT_SECTION_TO_SECTION =
        source?.droppableId?.split('/')?.[1] === NOT_SECTION &&
        destination?.droppableId?.split('/')?.[1] !== NOT_SECTION

      if (
        UPDATED_SAME_SECTION ||
        UPDATED_SAME_NOT_SECTION ||
        UPDATE_NOT_SECTION_TO_SECTION
      ) {
        let order: number = DEFAULT_ORDER

        const { destinationSection, sourceTodo } = getDragData(data || [])

        // destination.index 0인 경우
        if (destination?.index === 0) {
          const currentTodo = destinationSection?.todos?.[destination?.index]

          if (currentTodo) {
            order = (currentTodo?.order || 0) / 2
          }
        }

        // destination.index가 todos?.length - 1인 경우
        if (
          destination?.index ===
          (destinationSection?.todos || [])?.length -
            (UPDATE_NOT_SECTION_TO_SECTION ? 0 : 1)
        ) {
          const currentTodo =
            destinationSection?.todos?.[destination?.index - 1]

          if (currentTodo && currentTodo?.order) {
            order = currentTodo?.order + DEFAULT_ORDER
          }
        }

        // destination.index가 중간인 경우
        if (
          destination?.index > 0 &&
          destination?.index <
            (destinationSection?.todos || [])?.length -
              (UPDATE_NOT_SECTION_TO_SECTION ? 0 : 1)
        ) {
          let todo1 = destinationSection?.todos?.[destination.index - 1]
          let todo2 = destinationSection?.todos?.[destination.index]

          if (
            (UPDATED_SAME_SECTION || UPDATED_SAME_NOT_SECTION) &&
            source?.index < destination?.index
          ) {
            todo1 = destinationSection?.todos?.[destination.index]
            todo2 = destinationSection?.todos?.[destination.index + 1]
          }

          if (todo1 && todo2) {
            order =
              ((todo1.order || DEFAULT_ORDER) +
                (todo2.order || DEFAULT_ORDER)) /
              2
          }
        }

        if (sourceTodo) {
          const updateData = {
            order
          } as Tables<'todos'>

          if (UPDATE_NOT_SECTION_TO_SECTION && destinationSection?.id) {
            updateData.section_id = destinationSection?.id
            updateData.start_at = todayRange?.startAt
            updateData.end_at = todayRange?.endAt
          }

          await supabaseClient
            .from('todos')
            .update(updateData)
            .eq('id', sourceTodo?.id)

          getData()
        }
      }
    } catch (error) {
      alert(DEFAULT_ERROR_MESSAGE)
      console.log(error)
    }
  }

  const handleToggleModal: HandleToggleTodoModalType = ({ todo, opened }) => {
    setData(
      produce(draft => {
        const allTodo = draft?.reduce(
          (acc, section) => {
            ;(section?.todos || [])?.forEach(t => {
              acc.push(t)
            })
            return acc
          },
          [] as (TodoType & {
            modal?: {
              opened?: boolean
            }
          })[]
        )

        const targetTodo = allTodo?.find(t => t?.id === todo?.id)
        if (!targetTodo) return

        targetTodo.modal = {
          opened: opened || false
        }
      })
    )
  }

  const handleUpdateTodo = ({ todo }: { todo: TodoType }) => {
    setData(
      produce(draft => {
        const allTodo = draft?.reduce(
          (acc, section) => {
            ;(section?.todos || [])?.forEach(t => {
              acc.push(t)
            })
            return acc
          },
          [] as (TodoType & {
            modal?: {
              opened?: boolean
            }
          })[]
        )

        const targetTodo = allTodo?.find(t => t?.id === todo?.id)
        if (!targetTodo) return

        targetTodo.title = todo?.title
        targetTodo.description = todo?.description
      })
    )
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

  useWindowEvent('focus', () => {})

  return {
    data,
    form,
    sectionForm,

    handleEditTodo,
    handleCreateTodo,
    handleDeleteTodo,
    handleEditSection,
    handleCreateSection,
    handleChangeTodoStatus,
    handleDragEnd,
    handleToggleModal,
    handleUpdateTodo
  }
}
