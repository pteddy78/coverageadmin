import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBookings, getBookingById, getBookingsByClientId, createBooking, updateBooking } from '@/lib/database'

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  })
}

export function useBooking(bookingId: number) {
  return useQuery({
    queryKey: ['bookings', bookingId],
    queryFn: () => getBookingById(bookingId),
    enabled: !!bookingId,
  })
}

export function useBookingsByClient(clientId: number) {
  return useQuery({
    queryKey: ['bookings', 'client', clientId],
    queryFn: () => getBookingsByClientId(clientId),
    enabled: !!clientId,
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create booking')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

export function useUpdateBooking() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/bookings?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update booking')
      return response.json()
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['bookings', id] })
    },
  })
}
