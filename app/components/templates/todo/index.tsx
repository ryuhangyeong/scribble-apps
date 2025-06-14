import React from 'react'
import {
  Button,
  Container,
  Divider,
  Popover,
  TextInput,
  UnstyledButton,
  useProps
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'

import { HiOutlineChevronDown } from 'react-icons/hi2'
import { GoPlus } from 'react-icons/go'

import { DEFAULT_DAYJS_FORMAT } from '~/constants/date'
import HoverButton from '~/components/atoms/button/hover-button'
import TodoItemWrapper from '~/components/organisms/todo/item/todo-item-wrapper'
import { EDIT, VIEW } from '~/constants/todo'
import type {
  HandleCreateTodoType,
  HandleDeleteTodoType,
  HandleEditTodoType,
  SectionFormValues,
  TodoPageFormValues,
  TodoType
} from '~/components/pages/todo'
import dayjs from 'dayjs'
import SectionItem from '~/components/organisms/section/item/section-item'
import TodoEditInput from '~/components/organisms/todo/input/todo-edit-input'

import type { UseFormReturnType } from '@mantine/form'
import type { TodoItemProps } from '~/components/organisms/todo/item/todo-item'

export interface TodoTemplateProps {
  form: UseFormReturnType<TodoPageFormValues>
  sectionForm: UseFormReturnType<SectionFormValues>
  data?: {
    id: string
    title: string | null
    mode: string | null
    todos: TodoType[]
  }[]

  onEditSection?: ({ id }: { id: string | null }) => void

  onEdit?: HandleEditTodoType
  onCreate?: HandleCreateTodoType
  onDelete?: HandleDeleteTodoType

  onCreateSection?: () => void

  onChangeTodoStatus?: TodoItemProps['onChangeTodoStatus']
}

const defaultProps: Partial<TodoTemplateProps> = {
  data: []
}

function TodoTemplate(_props: TodoTemplateProps) {
  const {
    form,
    sectionForm,
    data,
    onEditSection,
    onEdit,
    onCreate,
    onDelete,
    onCreateSection,
    onChangeTodoStatus
  } = useProps('TodoTemplate', defaultProps, _props)

  return (
    <Container size={'md'}>
      <div className="pt-4">
        <TodoEditInput
          isFocusTrap={true}
          isShowCancelButton={false}
          onCreate={onCreate}
        />
      </div>

      {(data || [])?.slice(0, 1)?.[0]?.todos?.length > 0 && (
        <div className="mt-4">
          <ul>
            {(data || [])?.slice(0, 1).map(section => {
              return (
                <li key={section?.id}>
                  <div>
                    {section?.title && (
                      <SectionItem
                        data={section}
                        onCreateTodo={onCreate}
                        onEditSection={onEditSection}
                      />
                    )}

                    {(section?.todos || [])?.length > 0 && (
                      <ul>
                        {(section?.todos || [])?.map(todo => {
                          return (
                            <TodoItemWrapper
                              data={todo}
                              key={todo?.id}
                              onEdit={onEdit}
                              onCreate={onCreate}
                              onDelete={onDelete}
                              onChangeTodoStatus={onChangeTodoStatus}
                            />
                          )
                        })}
                      </ul>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <div className="flex justify-between pt-8">
        <div />

        <div>
          <Popover
            shadow="none"
            position="bottom-end">
            <Popover.Target>
              <HoverButton>
                <div className="flex gap-2">
                  <div>
                    <p>
                      {dayjs(form?.values?.today)?.format(DEFAULT_DAYJS_FORMAT)}
                    </p>
                  </div>
                  <div>
                    <HiOutlineChevronDown />
                  </div>
                </div>
              </HoverButton>
            </Popover.Target>
            <Popover.Dropdown>
              <div>
                <div>
                  <DatePicker {...form.getInputProps('today')} />
                </div>
              </div>
            </Popover.Dropdown>
          </Popover>
        </div>
      </div>

      <div className="mt-4">
        <ul>
          {(data || []).slice(1).map(section => {
            return (
              <li key={section?.id}>
                <div>
                  {section?.title && (
                    <SectionItem
                      data={section}
                      onCreateTodo={onCreate}
                      onEditSection={onEditSection}
                    />
                  )}

                  {(section?.todos || [])?.length > 0 && (
                    <ul>
                      {(section?.todos || [])?.map(todo => {
                        return (
                          <TodoItemWrapper
                            data={todo}
                            key={todo?.id}
                            onEdit={onEdit}
                            onCreate={onCreate}
                            onDelete={onDelete}
                            onChangeTodoStatus={onChangeTodoStatus}
                          />
                        )
                      })}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
        {sectionForm?.values?.mode === VIEW && (
          <Divider
            label={
              <div>
                <UnstyledButton
                  className="flex items-center gap-2"
                  onClick={() => {
                    sectionForm?.reset()
                    sectionForm?.setFieldValue('mode', EDIT)
                  }}>
                  <span>
                    <GoPlus />
                  </span>
                  <span className="text-sm font-bold text-[var(--mantine-color-gray-9)]">
                    섹션 추가
                  </span>
                </UnstyledButton>
              </div>
            }
            className="my-8"
            color={'var(--mantine-color-gray-3)'}
          />
        )}
        {sectionForm?.values?.mode === EDIT && (
          <div className="my-8">
            <form onSubmit={sectionForm?.onSubmit(() => onCreateSection?.())}>
              <div>
                <TextInput
                  placeholder="섹션 이름"
                  {...sectionForm.getInputProps('title')}
                  autoFocus
                />
              </div>

              <div className="mt-2 flex gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  color="var(--mantine-color-red-9)"
                  onClick={() => {
                    sectionForm?.setFieldValue('mode', VIEW)
                  }}>
                  취소
                </Button>

                <Button
                  size="xs"
                  variant="outline"
                  color="var(--mantine-color-gray-9)"
                  type="submit">
                  추가
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Container>
  )
}

export default TodoTemplate
