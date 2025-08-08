import { z } from 'zod'

// Base schemas
export const clientSchema = z.object({
  companyname: z.string().min(1, 'Company name is required'),
  unitcount2024: z.number().nullable(),
  price2024: z.number().nullable(),
  rate2024: z.number().nullable(),
  increaseperc: z.number().nullable(),
  hasbooking: z.boolean().nullable()
})

export const bookingDaysSchema = z.object({
  coverage_day: z.string().datetime().nullable(),
  start_time: z.string().nullable(),
  end_time: z.string().nullable()
})

export const bookingSchema = z.object({
  clientid: z.number(),
  cover_startdate: z.string().datetime().nullable(),
  cover_enddate: z.string().datetime().nullable(),
  unitcount2025: z.number().nullable(),
  primary_contact: z.string().nullable(),
  primary_email: z.string().email().nullable(),
  booking_notes: z.string(),
  full_request: z.any().nullable(),
  bookingstatusid: z.number().nullable(),
  coverageid: z.number().nullable(),
  bookingDays: z.array(bookingDaysSchema).optional()
})

export const exceptionSchema = z.object({
  bookingid: z.number(),
  bookingexceptionstatusid: z.number(),
  resolved: z.boolean().nullable()
})

// Request validation schemas
export const createClientSchema = clientSchema

export const updateClientSchema = clientSchema.partial()

export const createBookingSchema = bookingSchema

export const updateBookingSchema = bookingSchema.partial()

export const createExceptionSchema = exceptionSchema

export const updateExceptionSchema = exceptionSchema.partial()
