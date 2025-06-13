import {
  Container,
  createTheme,
  InputBase,
  Select,
  TextInput,
  Tooltip
} from '@mantine/core'

const theme = createTheme({
  fontFamily:
    'Noto Sans KR, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
  components: {
    Container: Container.extend({
      defaultProps: {
        size: 'xs'
      }
    }),
    Select: Select.extend({
      defaultProps: {
        allowDeselect: false,
        checkIconPosition: 'right'
      }
    }),
    TextInput: TextInput.extend({}),
    InputBase: InputBase.extend({
      defaultProps: {
        styles: {
          input: {
            '--input-bd-focus': 'var(--mantine-color-gray-8)'
          }
        }
      }
    }),
    Tooltip: Tooltip.extend({
      defaultProps: {
        position: 'bottom'
      }
    })
  },
  focusClassName: 'default-focus'
})

export default theme
