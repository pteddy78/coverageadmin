import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getClients, getClientById } from '@/lib/database'

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  })
}

export function useClient(clientId: number) {
  return useQuery({
    queryKey: ['clients', clientId],
    queryFn: () => getClientById(clientId),
    enabled: !!clientId,
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create client')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}
