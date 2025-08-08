import { supabase } from './supabase'
import type { Database } from '@/types/supabase'
import type { 
  BookingWithRelations, 
  ExceptionWithRelations 
} from '@/types/api'

type Tables = Database['public']['Tables']
type Client = Tables['Client']['Row']
type Booking = Tables['Booking']['Row']
type BookingDays = Tables['BookingDays']['Row']
type BookingException = Tables['BookingExceptionLog']['Row']
type BookingStatus = Tables['BookingStatus']['Row']

// Client queries
export async function getClients() {
  const { data, error } = await supabase
    .from('Client')
    .select(`
      *,
      Booking (
        bookingid
      )
    `)
    .order('companyname')

  if (error) throw error
  
  // Transform data to include hasbooking
  return data.map(client => ({
    ...client,
    hasbooking: (client.Booking?.length ?? 0) > 0
  }))
}

export async function getClientById(clientId: number) {
  const { data, error } = await supabase
    .from('Client')
    .select(`
      *,
      Booking!inner (
        bookingid
      )
    `)
    .eq('clientid', clientId)
    .single()

  if (error) throw error
  
  return {
    ...data,
    hasbooking: data.Booking?.length > 0
  }
}

// Booking queries
export async function getBookings(): Promise<BookingWithRelations[]> {
  console.log('Fetching all bookings...')
  
  try {
    const { data, error } = await supabase
      .from('Booking')
      .select(`
        *,
        Client (
          clientid,
          companyname
        ),
        BookingStatus (
          bookingstatus_shortdesc
        ),
        CoverageConfig (
          coverage_name
        ),
        BookingDays (
          bookingdayid,
          bookingid,
          coverage_day,
          start_time,
          end_time,
          created_at
        )
      `)
      .order('cover_startdate')

    if (error) {
      console.error('Supabase error fetching bookings:', error)
      throw new Error(`Database error: ${error.message}`)
    }
    
    console.log('Total bookings found:', data?.length || 0)
    return data || []
  } catch (err) {
    console.error('Exception in getBookings:', err)
    throw new Error(`Failed to fetch bookings: ${err instanceof Error ? err.message : 'Unknown error'}`)
  }
}

export async function getBookingById(bookingId: number): Promise<BookingWithRelations> {
  const { data, error } = await supabase
    .from('Booking')
    .select(`
      *,
      Client (
        clientid,
        companyname
      ),
      BookingStatus (
        bookingstatus_shortdesc
      ),
      CoverageConfig (
        coverage_name
      ),
      BookingDays (
        bookingdayid,
        bookingid,
        coverage_day,
        start_time,
        end_time,
        created_at
      )
    `)
    .eq('bookingid', bookingId)
    .single()

  if (error) throw error
  return data
}

export async function getBookingsByClientId(clientId: number): Promise<BookingWithRelations[]> {
  console.log('Fetching bookings for client:', clientId)
  
  const { data, error } = await supabase
    .from('Booking')
    .select(`
      *,
      Client (
        clientid,
        companyname
      ),
      BookingStatus (
        bookingstatus_shortdesc
      ),
      CoverageConfig (
        coverage_name
      ),
      BookingDays (
        bookingdaysid,
        bookingid,
        coverage_day,
        start_time,
        end_time,
        created_at
      )
    `)
    .eq('clientid', clientId)
    .order('cover_startdate')

  if (error) {
    console.error('Error fetching bookings:', error)
    throw error
  }
  
  console.log('Bookings found:', data?.length || 0, 'for client', clientId)
  if (data?.length === 0) {
    console.log('No bookings found for client:', clientId)
  }
  
  return data || []
}

// Exception queries
export async function getExceptions(): Promise<ExceptionWithRelations[]> {
  console.log('Fetching exceptions...')
  
  const { data, error } = await supabase
    .from('BookingExceptionLog')
    .select(`
      *,
      Booking (
        bookingid,
        clientid,
        cover_startdate,
        cover_enddate,
        primary_contact,
        Client (
          companyname
        )
      ),
      BookingExceptionStatus (
        exception_shortdesc,
        exception_longdesc
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching exceptions:', error)
    throw error
  }
  
  console.log('Total exceptions found:', data?.length || 0)
  return data || []
}

// Configuration queries
export async function getBookingStatuses() {
  const { data, error } = await supabase
    .from('BookingStatus')
    .select('*')
    .order('bookingstatusid')

  if (error) throw error
  return data
}

export async function getCoverageConfigs() {
  const { data, error } = await supabase
    .from('CoverageConfig')
    .select(`
      *,
      CoverageDetailConfig (
        coveragedetail_name,
        coveragedetail_date,
        CoverageType (
          coveragetype_shortdesc
        )
      )
    `)
    .order('coverage_name')

  if (error) throw error
  return data
}

// Mutation functions
export async function createBooking(data: Partial<Booking> & { bookingDays?: Partial<BookingDays>[] }) {
  const { bookingDays, ...bookingData } = data
  
  // Start a transaction
  const { data: booking, error: bookingError } = await supabase
    .from('Booking')
    .insert(bookingData)
    .select()
    .single()

  if (bookingError) throw bookingError

  if (bookingDays?.length) {
    const daysWithBookingId = bookingDays.map(day => ({
      ...day,
      bookingid: booking.bookingid
    }))

    const { error: daysError } = await supabase
      .from('BookingDays')
      .insert(daysWithBookingId)

    if (daysError) throw daysError
  }

  return booking
}

export async function updateBooking(
  bookingId: number, 
  data: Partial<Booking> & { bookingDays?: Partial<BookingDays>[] }
) {
  const { bookingDays, ...bookingData } = data

  // Update booking
  const { data: booking, error: bookingError } = await supabase
    .from('Booking')
    .update(bookingData)
    .eq('bookingid', bookingId)
    .select()
    .single()

  if (bookingError) throw bookingError

  if (bookingDays?.length) {
    // Delete existing days
    const { error: deleteError } = await supabase
      .from('BookingDays')
      .delete()
      .eq('bookingid', bookingId)

    if (deleteError) throw deleteError

    // Insert new days
    const daysWithBookingId = bookingDays.map(day => ({
      ...day,
      bookingid: bookingId
    }))

    const { error: daysError } = await supabase
      .from('BookingDays')
      .insert(daysWithBookingId)

    if (daysError) throw daysError
  }

  return booking
}

export async function updateException(
  exceptionId: number,
  data: Partial<BookingException>
) {
  const { data: exception, error } = await supabase
    .from('BookingExceptionLog')
    .update(data)
    .eq('exceptionlogid', exceptionId)
    .select()
    .single()

  if (error) throw error
  return exception
}

// Debug function to check all bookings
export async function debugAllBookings() {
  const { data, error } = await supabase
    .from('Booking')
    .select('*')
    .limit(10)

  if (error) {
    console.error('Error fetching all bookings:', error)
    throw error
  }

  console.log('All bookings in database:', data?.length || 0)
  console.log('Sample bookings:', data)
  return data
}

// Debug function to check all exceptions
export async function debugAllExceptions() {
  const { data, error } = await supabase
    .from('BookingExceptionLog')
    .select('*')
    .limit(10)

  if (error) {
    console.error('Error fetching all exceptions:', error)
    throw error
  }

  console.log('All exceptions in database:', data?.length || 0)
  console.log('Sample exceptions:', data)
  return data
}

// Test Supabase connection
export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    const { data, error } = await supabase
      .from('Client')
      .select('clientid')
      .limit(1)

    if (error) {
      console.error('Supabase connection test failed:', error)
      throw error
    }

    console.log('Supabase connection successful!')
    console.log('Sample client data:', data)
    return true
  } catch (err) {
    console.error('Supabase connection test failed:', err)
    throw err
  }
}
