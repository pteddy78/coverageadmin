import type { Database } from './supabase'

type Tables = Database['public']['Tables']

export type ApiError = {
  error: string
}

export type ApiResponse<T> = T | ApiError

// Table Types
export type Client = Tables['Client']['Row']
export type Booking = Tables['Booking']['Row']
export type BookingDays = Tables['BookingDays']['Row']
export type BookingException = Tables['BookingExceptionLog']['Row']
export type BookingStatus = Tables['BookingStatus']['Row']
export type CoverageConfig = Tables['CoverageConfig']['Row']

// Extended Types with Relations
export type BookingWithRelations = Booking & {
  Client: Pick<Client, 'clientid' | 'companyname'>
  BookingStatus: Pick<BookingStatus, 'bookingstatus_shortdesc'>
  CoverageConfig: Pick<CoverageConfig, 'coverage_name'>
  BookingDays?: BookingDays[]
}

export type ExceptionWithRelations = BookingException & {
  Booking: {
    bookingid: number
    clientid: number
    cover_startdate: string | null
    cover_enddate: string | null
    primary_contact: string | null
    primary_email: string | null
    created_at: string
    Client: Pick<Client, 'clientid' | 'companyname'>
    BookingStatus: Pick<BookingStatus, 'bookingstatusid' | 'bookingstatus_shortdesc'>
  } | null
  BookingExceptionStatus: {
    bookingexceptionstatusid: number
    exception_shortdesc: string | null
    exception_longdesc: string | null
  } | null
}

// Request Types
export type CreateBookingRequest = Omit<Booking, 'bookingid' | 'created_at' | 'created_by'> & {
  bookingDays?: Omit<BookingDays, 'bookingdayid' | 'created_at' | 'created_by'>[]
}

export type UpdateBookingRequest = Partial<Omit<Booking, 'bookingid' | 'created_at' | 'created_by'>> & {
  bookingDays?: Omit<BookingDays, 'bookingdayid' | 'created_at' | 'created_by'>[]
}

export type CreateExceptionRequest = Omit<BookingException, 'exceptionlogid' | 'created_at' | 'created_by'>

export type UpdateExceptionRequest = Partial<Omit<BookingException, 'exceptionlogid' | 'created_at' | 'created_by'>>
