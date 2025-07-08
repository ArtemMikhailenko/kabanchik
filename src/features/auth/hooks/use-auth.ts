import { useQuery } from '@tanstack/react-query'
import { authService } from '@/features/auth'

export const useAuth = () => {
  const { data: authData, isLoading: isLoadingAuth } = useQuery({
    queryKey: ['auth'],
    queryFn: authService.signIn,
  })

  return {
    authData,
    isLoadingAuth,
  }
}
