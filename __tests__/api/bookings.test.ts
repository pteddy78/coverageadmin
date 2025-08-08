import { createMocks } from 'node-mocks-http'
import { GET, POST, PUT } from '@/app/api/bookings/route'

describe('/api/bookings', () => {
  describe('GET', () => {
    it('should return all bookings when no parameters are provided', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      })

      await GET(req)
      const data = await res._getJSONData()

      expect(res._getStatusCode()).toBe(200)
      expect(Array.isArray(data)).toBeTruthy()
    })

    it('should return a single booking when id is provided', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '?id=1',
      })

      await GET(req)
      const data = await res._getJSONData()

      expect(res._getStatusCode()).toBe(200)
      expect(data.bookingid).toBe(1)
    })

    it('should return bookings for a specific client', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '?clientId=1',
      })

      await GET(req)
      const data = await res._getJSONData()

      expect(res._getStatusCode()).toBe(200)
      expect(Array.isArray(data)).toBeTruthy()
      data.forEach((booking: any) => {
        expect(booking.clientid).toBe(1)
      })
    })
  })

  describe('POST', () => {
    it('should create a new booking', async () => {
      const bookingData = {
        clientid: 1,
        cover_startdate: "2025-12-24",
        cover_enddate: "2025-12-26",
        unitcount2025: 100,
        primary_contact: "John Doe",
        primary_email: "john@test.com",
        booking_notes: "Test booking",
        bookingstatusid: 1,
        coverageid: 1,
        bookingDays: [
          {
            coverage_day: "2025-12-24",
            start_time: "09:00",
            end_time: "17:00"
          }
        ]
      }

      const { req, res } = createMocks({
        method: 'POST',
        body: bookingData,
      })

      await POST(req)
      const data = await res._getJSONData()

      expect(res._getStatusCode()).toBe(200)
      expect(data.bookingid).toBeDefined()
      expect(data.clientid).toBe(bookingData.clientid)
    })

    it('should return 400 for invalid booking data', async () => {
      const invalidData = {
        // Missing required clientid
        booking_notes: "Test"
      }

      const { req, res } = createMocks({
        method: 'POST',
        body: invalidData,
      })

      await POST(req)
      const data = await res._getJSONData()

      expect(res._getStatusCode()).toBe(400)
      expect(data.error).toBe('Validation error')
    })
  })

  describe('PUT', () => {
    it('should update an existing booking', async () => {
      const updateData = {
        booking_notes: "Updated notes",
        bookingDays: [
          {
            coverage_day: "2025-12-24",
            start_time: "10:00",
            end_time: "18:00"
          }
        ]
      }

      const { req, res } = createMocks({
        method: 'PUT',
        url: '?id=1',
        body: updateData,
      })

      await PUT(req)
      const data = await res._getJSONData()

      expect(res._getStatusCode()).toBe(200)
      expect(data.bookingid).toBe(1)
      expect(data.booking_notes).toBe(updateData.booking_notes)
    })

    it('should return 400 when no booking id is provided', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        body: { booking_notes: "Test" },
      })

      await PUT(req)
      const data = await res._getJSONData()

      expect(res._getStatusCode()).toBe(400)
      expect(data.error).toBe('Booking ID is required')
    })

    it('should return 404 for non-existent booking', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        url: '?id=999',
        body: { booking_notes: "Test" },
      })

      await PUT(req)
      const data = await res._getJSONData()

      expect(res._getStatusCode()).toBe(404)
      expect(data.error).toBe('Booking not found')
    })
  })
})
