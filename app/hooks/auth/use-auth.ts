import { useNavigate } from 'react-router'
import { DEFAULT_ERROR_MESSAGE } from '~/constants'
import supabaseClient from '~/libs/supabase/client'

export function useAuth() {
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      const { error } = await supabaseClient.auth.signOut()

      if (error) {
        alert(error?.message || DEFAULT_ERROR_MESSAGE)
      }
    } catch {
      alert(DEFAULT_ERROR_MESSAGE)
    } finally {
      navigate('/')
    }
  }

  return {
    handleLogout
  }
}
