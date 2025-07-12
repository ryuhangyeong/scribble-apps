import React from 'react'
import {
  RichTextEditor,
  Link,
  type RichTextEditorLabels
} from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import Highlight from '@tiptap/extension-highlight'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript'
import SubScript from '@tiptap/extension-subscript'
import { noop, useProps } from '@mantine/core'

interface TiptapEditorProps {
  value?: string
  editable?: boolean

  onChange?: ({ value }: { value: string }) => void
}

const defaultProps: Partial<TiptapEditorProps> = {
  value: '',
  editable: true,

  onChange: noop
}

const TiptapEditor = (_props: TiptapEditorProps) => {
  const {
    value: content,
    editable,
    onChange
  } = useProps('TiptapEditor', defaultProps, _props)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content,
    onUpdate: ({ editor }) => {
      const value = editor?.getHTML() || ''
      onChange?.({ value })
    },
    editable
  })

  const editorStyles = !editable
    ? {
        root: {
          border: 'none',
          '--mantine-spacing-md': 0
        }
      }
    : {}

  return (
    <div>
      <style>
        {/* @MEMO tailwindcss 기본 스타일에 영향을 받기 때문에, 오버라이딩 처리함 */}
        {`
          .tiptap ul {
            list-style-type: disc;
          }

          .tiptap ol {
            list-style-type: decimal;
          }

          .tiptap blockquote {
            background-color: white;
            border-left: 2px solid var(--mantine-color-gray-9);
            border-radius: 0;
          }
        `}
      </style>
      <RichTextEditor
        editor={editor}
        labels={getLabel()}
        styles={editorStyles}>
        {editable && (
          <RichTextEditor.Toolbar>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
        )}

        <RichTextEditor.Content />
      </RichTextEditor>
    </div>
  )
}

export default TiptapEditor

function getLabel(): Partial<RichTextEditorLabels> {
  return {
    linkControlLabel: '링크',
    colorPickerControlLabel: '텍스트 색상',
    highlightControlLabel: '텍스트 강조',
    colorControlLabel: color => `텍스트 색상 설정: ${color}`,
    boldControlLabel: '굵게',
    italicControlLabel: '기울임꼴',
    underlineControlLabel: '밑줄',
    strikeControlLabel: '취소선',
    clearFormattingControlLabel: '서식 지우기',
    unlinkControlLabel: '링크 제거',
    bulletListControlLabel: '글머리 기호 목록',
    orderedListControlLabel: '번호 매기기 목록',
    h1ControlLabel: '제목 1',
    h2ControlLabel: '제목 2',
    h3ControlLabel: '제목 3',
    h4ControlLabel: '제목 4',
    h5ControlLabel: '제목 5',
    h6ControlLabel: '제목 6',
    blockquoteControlLabel: '인용문',
    alignLeftControlLabel: '텍스트 왼쪽 정렬',
    alignCenterControlLabel: '텍스트 가운데 정렬',
    alignRightControlLabel: '텍스트 오른쪽 정렬',
    alignJustifyControlLabel: '텍스트 양쪽 정렬',
    codeControlLabel: '코드',
    codeBlockControlLabel: '코드 블록',
    subscriptControlLabel: '아래 첨자',
    superscriptControlLabel: '위 첨자',
    unsetColorControlLabel: '색상 초기화',
    hrControlLabel: '수평선',
    undoControlLabel: '실행 취소',
    redoControlLabel: '다시 실행',

    // 할 일 목록
    tasksControlLabel: '할 일 목록',
    tasksSinkLabel: '할 일 단계 줄이기',
    tasksLiftLabel: '할 일 단계 늘리기',

    // 링크 편집기
    linkEditorInputLabel: 'URL 입력',
    linkEditorInputPlaceholder: 'https://example.com/',
    linkEditorExternalLink: '새 탭에서 링크 열기',
    linkEditorInternalLink: '같은 탭에서 링크 열기',
    linkEditorSave: '저장',

    // 색상 선택기
    colorPickerCancel: '취소',
    colorPickerClear: '색상 지우기',
    colorPickerColorPicker: '색상 선택기',
    colorPickerPalette: '색상 팔레트',
    colorPickerSave: '저장',
    colorPickerColorLabel: color => `텍스트 색상 설정: ${color}`
  }
}
