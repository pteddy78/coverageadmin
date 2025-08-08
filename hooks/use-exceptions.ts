import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getExceptions, updateException } from '@/lib/database'

export function useExceptions(resolved?: boolean) {
  return useQuery({
    queryKey: ['exceptions', resolved],
    queryFn: async () => {
      console.log('=== useExceptions hook calling getExceptions directly... ===')
      try {
        const result = await getExceptions()
        console.log('=== getExceptions result:', result?.length || 0, 'exceptions ===')
        console.log('=== getExceptions result data:', result === null ? 'null' : result === undefined ? 'undefined' : Array.isArray(result) ? 'array' : typeof result, '===' )
        return result
      } catch (error) {
        console.error('=== Error in useExceptions queryFn:', error, '===')
        throw error
      }
    },
    select: (data) => {
      console.log('=== useExceptions select function called with:', data?.length || 0, 'exceptions ===')
      if (resolved !== undefined) {
        const filtered = data.filter(exception => exception.resolved === resolved)
        console.log('=== Filtered for resolved:', resolved, 'result:', filtered?.length || 0, 'exceptions ===')
        return filtered
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
