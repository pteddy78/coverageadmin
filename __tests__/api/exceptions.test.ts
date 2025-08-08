import { createMocks } from 'node-mocks-http'
import { GET, POST, PUT } from '@/app/api/exceptions/route'

describe('/api/exceptions', () => {
  describe('GET', () => {
    it('should return all exceptions when no parameters are provided', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      })

      await GET(req)
      const data = await res._getJSONData()

      expect(res._getStatusCode()).toBe(200)
      expect(Array.isArray(data)).toBeTruthy()
    })

    it('should return only resolved exceptions', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '?resolved=true',
      })

      await GET(req)
      const data = await res._getJSONData()

      expect(res._getStatusCode()).toBe(200)
      expect(Array.isArray(data)).toBeTruthy()
      data.forEach((exception: any) => {
        expect(exception.resolved).toBe(true)
      })
    })

    it('should return only unresolved exceptions', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '?resolved=false',
      })

      await GET(req)
      const data = await res._getJSONData()

      expect(res._getStatusCode()).toBe(200)
      expect(Array.isArray(data)).toBeTruthy()
      data.forEach((exception: any) => {
        expect(exception.resolved).toBe(false)
      })
    })
  })

  describe('POST', () => {
    it('should create a new exception', async () => {
      const exceptionData = {
        bookingid: 1,
        bookingexceptionstatusid: 1,
        resolved: false
      }

      const { req, res } = createMocks({
        method: 'POST',
        body: exceptionData,
      })

      await POST(req)
      const data = await res._getJSONData()

      expect(res._getStatusCode()).toBe(200)
      expect(data.exceptionlogid).toBeDefined()
      expect(data.bookingid).toBe(exceptionData.bookingid)
      expect(data.resolved).toBe(false)
    })

    it('should return 400 for invalid exception data', async () => {
      const invalidData = {
        // Missing required bookingid
        resolved: false
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
    it('should update an existing exception', async () => {
      const updateData = {
        resolved: true
      }

      const { req, res } = createMocks({
        method: 'PUT',
        url: '?id=1',
        body: updateData,
      })

      await PUT(req)
      const data = await res._getJSONData()

      expect(res._getStatusCode()).toBe(200)
      expect(data.exceptionlogid).toBe(1)
      expect(data.resolved).toBe(true)
    })

    it('should return 400 when no exception id is provided', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        body: { resolved: true },
      })

      await PUT(req)
      const data = await res._getJSONData()

      expect(res._getStatusCode()).toBe(400)
      expect(data.error).toBe('Exception ID is required')
    })

    it('should return 404 for non-existent exception', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        url: '?id=999',
        body: { resolved: true },
      })

      await PUT(req)
      const data = await res._getJSONData()

      expect(res._getStatusCode()).toBe(404)
      expect(data.error).toBe('Exception not found')
    })
  })
})
