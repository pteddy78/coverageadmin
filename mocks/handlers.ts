import { rest } from 'msw'
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
  rest.get('/api/clients', (req, res, ctx) => {
    const id = req.url.searchParams.get('id')
    if (id) {
      const client = mockClients.find(c => c.clientid === Number(id))
      if (!client) {
        return res(ctx.status(404), ctx.json({ error: 'Client not found' }))
      }
      return res(ctx.json(client))
    }
    return res(ctx.json(mockClients))
  }),

  rest.post('/api/clients', async (req, res, ctx) => {
    const body = await req.json()
    const newClient: Client = {
      ...body,
      clientid: mockClients.length + 1,
      created_at: new Date().toISOString()
    }
    mockClients.push(newClient)
    return res(ctx.json(newClient))
  }),

  // Bookings endpoints
  rest.get('/api/bookings', (req, res, ctx) => {
    const id = req.url.searchParams.get('id')
    const clientId = req.url.searchParams.get('clientId')

    if (id) {
      const booking = mockBookings.find(b => b.bookingid === Number(id))
      if (!booking) {
        return res(ctx.status(404), ctx.json({ error: 'Booking not found' }))
      }
      return res(ctx.json(booking))
    }

    if (clientId) {
      const bookings = mockBookings.filter(b => b.clientid === Number(clientId))
      return res(ctx.json(bookings))
    }

    return res(ctx.json(mockBookings))
  }),

  rest.post('/api/bookings', async (req, res, ctx) => {
    const body = await req.json()
    const newBooking: Booking = {
      ...body,
      bookingid: mockBookings.length + 1,
      created_at: new Date().toISOString(),
      created_by: 'test-user'
    }
    mockBookings.push(newBooking)
    return res(ctx.json(newBooking))
  }),

  rest.put('/api/bookings', async (req, res, ctx) => {
    const id = req.url.searchParams.get('id')
    if (!id) {
      return res(ctx.status(400), ctx.json({ error: 'Booking ID is required' }))
    }

    const body = await req.json()
    const index = mockBookings.findIndex(b => b.bookingid === Number(id))
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Booking not found' }))
    }

    mockBookings[index] = {
      ...mockBookings[index],
      ...body,
      edited_at: new Date().toISOString(),
      edited_by: 'test-user'
    }
    return res(ctx.json(mockBookings[index]))
  }),

  // Exceptions endpoints
  rest.get('/api/exceptions', (req, res, ctx) => {
    const resolved = req.url.searchParams.get('resolved')
    if (resolved !== null) {
      const isResolved = resolved === 'true'
      return res(ctx.json(mockExceptions.filter(e => e.resolved === isResolved)))
    }
    return res(ctx.json(mockExceptions))
  }),

  rest.post('/api/exceptions', async (req, res, ctx) => {
    const body = await req.json()
    const newException: BookingException = {
      ...body,
      exceptionlogid: mockExceptions.length + 1,
      created_at: new Date().toISOString(),
      created_by: 'test-user'
    }
    mockExceptions.push(newException)
    return res(ctx.json(newException))
  }),

  rest.put('/api/exceptions', async (req, res, ctx) => {
    const id = req.url.searchParams.get('id')
    if (!id) {
      return res(ctx.status(400), ctx.json({ error: 'Exception ID is required' }))
    }

    const body = await req.json()
    const index = mockExceptions.findIndex(e => e.exceptionlogid === Number(id))
    if (index === -1) {
      return res(ctx.status(404), ctx.json({ error: 'Exception not found' }))
    }

    mockExceptions[index] = {
      ...mockExceptions[index],
      ...body
    }
    return res(ctx.json(mockExceptions[index]))
  })
]
