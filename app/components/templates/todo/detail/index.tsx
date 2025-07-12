import React from 'react'
import { EDIT, VIEW } from '~/constants/todo'
import { Button, Checkbox, noop, TextInput, useProps } from '@mantine/core'

import { type UseFormReturnType } from '@mantine/form'

import type {
  HandleUpdateTodo,
  TodoDetailFormValues
} from '../../modal/todo/detail'
import TiptapEditor from '~/components/organisms/editor/tiptap/tiptap-editor'

export interface TodoDetailTemplateProps {
  todo: TodoDetailFormValues
  form: UseFormReturnType<TodoDetailFormValues>

  onUpdateTodo: HandleUpdateTodo
}

const defaultProps: Partial<TodoDetailTemplateProps> = {
  onUpdateTodo: noop
}

const TodoDetailTemplate = (_props: TodoDetailTemplateProps) => {
  const { todo, form, onUpdateTodo } = useProps(
    'TodoDetailTemplate',
    defaultProps,
    _props
  )

  const handleChangeEditorMode = ({
    mode
  }: {
    mode: typeof EDIT | typeof VIEW
  }) => {
    form?.setFieldValue('editorMode', mode)
  }

  const handleCancel = () => {
    form?.setFieldValue('editorMode', VIEW)
    form?.setFieldValue('title', todo?.title || '')
    form?.setFieldValue('description', todo?.description || '')
  }

  const handleChangeDescription = ({ value }: { value: string }) => {
    form?.setFieldValue('description', value)
  }

  const handleSubmit = () => {
    onUpdateTodo?.()
  }

  return (
    <div className="p-1 lg:p-4">
      <div className="flex gap-2">
        <div className="mt-1">
          <Checkbox
            styles={{
              input: {
                borderRadius: '50%'
              }
            }}
          />
        </div>
        <div className="w-full flex-1 overflow-hidden">
          <div className="flex flex-col gap-2">
            <div
              onClick={() =>
                handleChangeEditorMode({
                  mode: EDIT
                })
              }>
              {form?.values?.editorMode === VIEW && <p>{todo?.title || ''}</p>}
              {form?.values?.editorMode === EDIT && (
                <div>
                  <TextInput {...form?.getInputProps('title')} />
                </div>
              )}
            </div>

            <div onClick={() => handleChangeEditorMode({ mode: EDIT })}>
              {form?.values?.editorMode === VIEW && (
                <div>
                  {todo?.description ? (
                    <TiptapEditor
                      value={todo?.description}
                      editable={false}
                    />
                  ) : (
                    <span className="text-gray-500">설명을 추가하세요</span>
                  )}
                </div>
              )}
              {form?.values?.editorMode === EDIT && (
                <div>
                  <TiptapEditor
                    value={todo?.description || ''}
                    onChange={handleChangeDescription}
                  />
                </div>
              )}
            </div>
          </div>

          {form?.values?.editorMode === EDIT && (
            <div className="mt-4 flex justify-end gap-2">
              <div>
                <Button
                  variant="outline"
                  size="xs"
                  color="var(--mantine-color-red-9)"
                  onClick={handleCancel}>
                  취소
                </Button>
              </div>

              <div>
                <Button
                  variant="outline"
                  size="xs"
                  color="var(--mantine-color-gray-9)"
                  onClick={handleSubmit}>
                  수정하기
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TodoDetailTemplate
