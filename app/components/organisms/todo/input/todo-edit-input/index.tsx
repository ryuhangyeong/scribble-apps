import React, { useEffect } from 'react'
import {
  Button,
  Divider,
  FocusTrap,
  Paper,
  Select,
  Textarea,
  TextInput,
  useProps,
  type PaperProps
} from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { IoFlagSharp } from 'react-icons/io5'
import { FaCheck } from 'react-icons/fa6'
import {
  CREATE,
  CREATE_TODO_LABEL,
  EDIT,
  HIGH,
  HIGH_LABEL,
  LOW,
  LOW_LABEL,
  MEDIUM,
  MEDIUM_LABEL,
  VIEW
} from '~/constants/todo'
import type {
  HandleCreateTodoType,
  HandleEditTodoType,
  TodoType
} from '~/components/pages/todo'

export interface TodoEditInputProps {
  data: TodoType
  createLabel?: string
  mode?: typeof CREATE | typeof EDIT
  isShowCancelButton?: boolean
  isFocusTrap?: boolean
  paperStylesProps?: PaperProps['styles']

  onEdit?: HandleEditTodoType
  onCreate?: HandleCreateTodoType

  ref?: React.ForwardedRef<HTMLFormElement>
}

const defaultProps: Partial<TodoEditInputProps> = {
  isShowCancelButton: true,
  isFocusTrap: false,
  mode: EDIT,
  createLabel: CREATE_TODO_LABEL,
  paperStylesProps: {
    root: {
      '--paper-border-color': `var(--mantine-color-gray-6)`
    }
  }
}

export const priorityColorMap: Record<string, string> = {
  [LOW]: 'var(--mantine-color-gray-5)',
  [MEDIUM]: 'var(--mantine-color-yellow-5)',
  [HIGH]: 'var(--mantine-color-red-5)'
}

const TodoEditInput = (_props: TodoEditInputProps) => {
  const {
    data,
    createLabel,
    isShowCancelButton,
    isFocusTrap,
    paperStylesProps,
    onEdit,
    onCreate,
    ref
  } = useProps('TodoEditInput', defaultProps, _props)

  const form = useForm<TodoType>({
    initialValues: {
      id: '',
      title: '',
      description: '',
      priority: LOW,
      section_id: null,
      mode: VIEW
    },
    validate: {
      title: value => {
        if (isNotEmpty()(value)) {
          return '할 일을 입력해주세요.'
        }

        return null
      }
    }
  })

  useEffect(() => {
    if (data) {
      form.setValues({
        id: data.id || '',
        title: data.title || '',
        description: data.description || '',
        priority: data.priority || LOW,
        mode: data.mode || VIEW,
        section_id: data.section_id || null
      })
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <FocusTrap active={isFocusTrap}>
      <form
        onSubmit={form.onSubmit(values => {
          onCreate?.({ todo: values })
        })}
        ref={ref}>
        <Paper
          withBorder
          styles={paperStylesProps}>
          <div>
            <div className="p-2">
              <div>
                <TextInput
                  variant="unstyled"
                  size="sm"
                  placeholder="할 일"
                  styles={{
                    input: {
                      '--input-bd-focus': '#fff',
                      '--input-bd': '#fff'
                    }
                  }}
                  autoFocus
                  {...form.getInputProps('title')}
                />
              </div>
              <div>
                <Textarea
                  variant="unstyled"
                  size="xs"
                  placeholder="설명"
                  autosize
                  styles={{
                    input: {
                      '--input-bd-focus': '#fff',
                      '--input-bd': '#fff'
                    }
                  }}
                  {...form.getInputProps('description')}
                />
              </div>
            </div>

            <div>
              <Divider />
            </div>

            <div className="flex justify-between p-2">
              <div>
                <div className="flex gap-2">
                  <div>
                    <Select
                      size="xs"
                      w={100}
                      leftSection={
                        <IoFlagSharp
                          color={
                            priorityColorMap[form?.values?.priority || LOW]
                          }
                          size={16}
                        />
                      }
                      placeholder="우선순위"
                      defaultValue={null}
                      data={[
                        {
                          value: HIGH,
                          label: HIGH_LABEL
                        },
                        {
                          value: MEDIUM,
                          label: MEDIUM_LABEL
                        },
                        {
                          value: LOW,
                          label: LOW_LABEL
                        }
                      ]}
                      {...form.getInputProps('priority')}
                      renderOption={({ option, checked }) => (
                        <div className="flex w-full items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <IoFlagSharp
                              color={priorityColorMap[option?.value]}
                              size={16}
                            />
                            <span>{option.label}</span>
                          </div>
                          <div>{checked && <FaCheck />}</div>
                        </div>
                      )}
                      styles={{
                        input: {
                          '--input-bd':
                            priorityColorMap[form?.values?.priority || LOW]
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {isShowCancelButton && (
                  <div>
                    <Button
                      variant="outline"
                      size="xs"
                      color="var(--mantine-color-red-9)"
                      onClick={() =>
                        onEdit?.({
                          id: data?.id || '',
                          todo: {
                            ...data,
                            mode: VIEW
                          }
                        })
                      }>
                      취소
                    </Button>
                  </div>
                )}
                <div>
                  <Button
                    type="submit"
                    variant="outline"
                    size="xs"
                    color="var(--mantine-color-gray-9)">
                    {createLabel}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </form>
    </FocusTrap>
  )
}

export default TodoEditInput
