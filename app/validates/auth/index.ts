import { isEmail, isNotEmpty } from '@mantine/form'

export const validateEmail = (value: string) => {
  if (isNotEmpty()(value)) {
    return '이메일을 입력해주세요'
  }

  if (isEmail()(value)) {
    return '이메일을 정확히 입력해주세요'
  }

  return null
}
