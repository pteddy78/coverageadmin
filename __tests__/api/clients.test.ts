import { createMocks } from 'node-mocks-http'
import { GET, POST } from '@/app/api/clients/route'

describe('/api/clients', () => {
  describe('GET', () => {
    it('should return all clients when no id is provided', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      })

      await GET(req)
      const data = await res._getJSONData()

      expect(res._getStatusCode()).toBe(200)
      expect(Array.isArray(data)).toBeTruthy()
    })

    it('should return a single client when id is provided', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '?id=1',
      })

      await GET(req)
      const data = await res._getJSONData()

      expect(res._getStatusCode()).toBe(200)
      expect(data.clientid).toBe(1)
    })

    it('should return 404 for non-existent client', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '?id=999',
      })

      await GET(req)
      const data = await res._getJSONData()

      expect(res._getStatusCode()).toBe(404)
      expect(data.error).toBe('Client not found')
    })
  })

  describe('POST', () => {
    it('should create a new client', async () => {
      const clientData = {
        companyname: "New Company",
        unitcount2024: 50,
        price2024: 500,
        rate2024: 10,
        increaseperc: 5,
        hasbooking: false
      }

      const { req, res } = createMocks({
        method: 'POST',
        body: clientData,
      })

      await POST(req)
      const data = await res._getJSONData()

      expect(res._getStatusCode()).toBe(200)
      expect(data.companyname).toBe(clientData.companyname)
      expect(data.clientid).toBeDefined()
    })

    it('should return 400 for invalid client data', async () => {
      const invalidData = {
        // Missing required companyname
        unitcount2024: 50
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
})
