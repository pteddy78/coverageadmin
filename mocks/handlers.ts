import { http } from 'msw'
import type { Database } from '@/types/supabase'

type Tables = Database['public']['Tables']
type Client = Tables['Client']['Row']
type Booking = Tables['Booking']['Row']
type BookingException = Tables['BookingExceptionLog']['Row']

// Mock data
const mockClients: Client[] = [
  {
    clientid: 1,
    companyname: "Test Company",
    created_at: new Date().toISOString(),
    unitcount2024: 100,
    price2024: 1000,
    rate2024: 10,
    increaseperc: 5,
    hasbooking: true
  }
]

const mockBookings: Booking[] = [
  {
    bookingid: 1,
    clientid: 1,
    cover_startdate: "2025-12-24",
    cover_enddate: "2025-12-26",
    unitcount2025: 100,
    primary_contact: "John Doe",
    primary_email: "john@test.com",
    booking_notes: "Test booking",
    full_request: null,
    created_at: new Date().toISOString(),
    created_by: "test-user",
    edited_at: null,
    edited_by: null,
    bookingstatusid: 1,
    coverageid: 1
  }
]

const mockExceptions: BookingException[] = [
  {
    exceptionlogid: 1,
    bookingid: 1,
    bookingexceptionstatusid: 1,
    resolved: false,
    created_at: new Date().toISOString(),
    created_by: "test-user"
  }
]

export const handlers = [
  // Clients endpoints
  http.get('/api/clients', ({ request }) => {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (id) {
      const client = mockClients.find(c => c.clientid === Number(id))
      if (!client) {
        return Response.json({ error: 'Client not found' }, { status: 404 })
      }
      return Response.json(client)
    }
    return Response.json(mockClients)
  }),

  http.post('/api/clients', async ({ request }) => {
    const body = await request.json() as Partial<Client>
    const newClient: Client = {
      companyname: null,
      unitcount2024: null,
      price2024: null,
      rate2024: null,
      increaseperc: null,
      hasbooking: null,
      ...body,
      clientid: mockClients.length + 1,
      created_at: new Date().toISOString()
    }
    mockClients.push(newClient)
    return Response.json(newClient)
  }),

  // Bookings endpoints
  http.get('/api/bookings', ({ request }) => {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const clientId = url.searchParams.get('clientId')

    if (id) {
      const booking = mockBookings.find(b => b.bookingid === Number(id))
      if (!booking) {
        return Response.json({ error: 'Booking not found' }, { status: 404 })
      }
      return Response.json(booking)
    }

    if (clientId) {
      const bookings = mockBookings.filter(b => b.clientid === Number(clientId))
      return Response.json(bookings)
    }

    return Response.json(mockBookings)
  }),

  http.post('/api/bookings', async ({ request }) => {
    const body = await request.json() as Partial<Booking>
    const newBooking: Booking = {
      clientid: 0,
      cover_startdate: null,
      cover_enddate: null,
      unitcount2025: null,
      primary_contact: null,
      primary_email: null,
      booking_notes: '',
      full_request: null,
      bookingstatusid: null,
      coverageid: null,
      edited_at: null,
      edited_by: null,
      ...body,
      bookingid: mockBookings.length + 1,
      created_at: new Date().toISOString(),
      created_by: 'test-user'
    }
    mockBookings.push(newBooking)
    return Response.json(newBooking)
  }),

  http.put('/api/bookings', async ({ request }) => {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id) {
      return Response.json({ error: 'Booking ID is required' }, { status: 400 })
    }

    const body = await request.json() as Partial<Booking>
    const index = mockBookings.findIndex(b => b.bookingid === Number(id))
    if (index === -1) {
      return Response.json({ error: 'Booking not found' }, { status: 404 })
    }

    mockBookings[index] = {
      ...mockBookings[index],
      ...body,
      edited_at: new Date().toISOString(),
      edited_by: 'test-user'
    }
    return Response.json(mockBookings[index])
  }),

  // Exceptions endpoints
  http.get('/api/exceptions', ({ request }) => {
    const url = new URL(request.url)
    const resolved = url.searchParams.get('resolved')
    if (resolved !== null) {
      const isResolved = resolved === 'true'
      return Response.json(mockExceptions.filter(e => e.resolved === isResolved))
    }
    return Response.json(mockExceptions)
  }),

  http.post('/api/exceptions', async ({ request }) => {
    const body = await request.json() as Partial<BookingException>
    const newException: BookingException = {
      bookingid: 0,
      bookingexceptionstatusid: 0,
      resolved: null,
      ...body,
      exceptionlogid: mockExceptions.length + 1,
      created_at: new Date().toISOString(),
      created_by: 'test-user'
    }
    mockExceptions.push(newException)
    return Response.json(newException)
  }),

  http.put('/api/exceptions', async ({ request }) => {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    if (!id) {
      return Response.json({ error: 'Exception ID is required' }, { status: 400 })
    }

    const body = await request.json() as Partial<BookingException>
    const index = mockExceptions.findIndex(e => e.exceptionlogid === Number(id))
    if (index === -1) {
      return Response.json({ error: 'Exception not found' }, { status: 404 })
    }

    mockExceptions[index] = {
      ...mockExceptions[index],
      ...body
    }
    return Response.json(mockExceptions[index])
  })
]
