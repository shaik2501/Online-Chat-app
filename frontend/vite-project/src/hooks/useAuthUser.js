import { getAuthUser } from '../lib/api'
import toast, { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'

export const useAuthUser = () => {
        const authUser = useQuery({
        queryKey:["authUser"],
        queryFn: getAuthUser,
        retry: false,  //auth check for multiple times
      });

      return {isLoading:authUser.isLoading, authUser:authUser.data?.user}
}
