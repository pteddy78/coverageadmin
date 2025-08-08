import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getExceptions, updateException } from '@/lib/database'

export function useExceptions(resolved?: boolean) {
  return useQuery({
    queryKey: ['exceptions', resolved],
    queryFn: () => getExceptions(),
    select: (data) => {
      if (resolved !== undefined) {
        return data.filter(exception => exception.resolved === resolved)
      }
      return data
    },
  })
}

export function useCreateException() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/exceptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create exception')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exceptions'] })
    },
  })
}

export function useUpdateException() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/exceptions?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update exception')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exceptions'] })
    },
  })
}
