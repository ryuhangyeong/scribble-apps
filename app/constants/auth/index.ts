import { DEFAULT_ERROR_MESSAGE } from '../error'

export const SIGN_IN = 'sign-in'
export const SIGN_UP = 'sign-up'

export const ACCOUNTS_LABEL = '계정'

export const SIGN_IN_LABEL = '로그인'
export const SIGN_UP_LABEL = '회원가입'
export const LOGOUT_LABEL = '로그아웃'

export const GOOGLE_LABEL = '구글'

export const OR_LABEL = '또는'

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  over_email_send_rate_limit:
    '이 이메일 주소로 너무 많은 이메일이 전송되었습니다. 잠시 후 다시 시도해 주세요.',
  email_address_invalid: '이메일 주소가 잘못되었습니다.',
  '': DEFAULT_ERROR_MESSAGE
}
