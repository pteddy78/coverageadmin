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
        bookingdayid,
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
  
  try {
    // Use regular joins to include ALL exceptions, even those without booking relationships
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
          primary_email,
          created_at,
          Client (
            clientid,
            companyname
          ),
          BookingStatus (
            bookingstatusid,
            bookingstatus_shortdesc
          )
        ),
        BookingExceptionStatus (
          bookingexceptionstatusid,
          exception_shortdesc,
          exception_longdesc
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error fetching exceptions:', error)
      throw new Error(`Database error: ${error.message}`)
    }
    
    console.log('Total exceptions found:', data?.length || 0)
    console.log('Sample exception data:', data?.[0])
    return data || []
  } catch (err) {
    console.error('Exception in getExceptions:', err)
    throw new Error(`Failed to fetch exceptions: ${err instanceof Error ? err.message : 'Unknown error'}`)
  }
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

// Test BookingExceptionLog table access
export async function testBookingExceptionLog() {
  try {
    console.log('Testing BookingExceptionLog table access...')
    const { data, error } = await supabase
      .from('BookingExceptionLog')
      .select('exceptionlogid')
      .limit(5)

    if (error) {
      console.error('BookingExceptionLog table access failed:', error)
      throw error
    }

    console.log('BookingExceptionLog table access successful!')
    console.log('Sample exception IDs:', data)
    return data
  } catch (err) {
    console.error('BookingExceptionLog table access failed:', err)
    throw err
  }
}

// Test simple exceptions query without inner joins
export async function testSimpleExceptions() {
  try {
    console.log('=== Testing simple exceptions query without inner joins ===')
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
          primary_email,
          created_at,
          Client (
            clientid,
            companyname
          ),
          BookingStatus (
            bookingstatusid,
            bookingstatus_shortdesc
          )
        ),
        BookingExceptionStatus (
          bookingexceptionstatusid,
          exception_shortdesc,
          exception_longdesc
        )
      `)
      .limit(5)

    if (error) {
      console.error('=== Simple exceptions query failed:', error, '===')
      throw error
    }

    console.log('=== Simple exceptions query successful! ===')
    console.log('=== Total exceptions found:', data?.length || 0, '===')
    console.log('=== Sample exception data:', data?.[0], '===')
    return data
  } catch (err) {
    console.error('=== Simple exceptions query failed:', err, '===')
    throw err
  }
}

// Test to check if there are ANY records in BookingExceptionLog at all
export async function testRawBookingExceptionLog() {
  try {
    console.log('=== Testing raw BookingExceptionLog table (no joins) ===')
    const { data, error } = await supabase
      .from('BookingExceptionLog')
      .select('*')
      .limit(10)

    if (error) {
      console.error('=== Raw BookingExceptionLog query failed:', error, '===')
      throw error
    }

    console.log('=== Raw BookingExceptionLog query successful! ===')
    console.log('=== Total raw exceptions found:', data?.length || 0, '===')
    if (data && data.length > 0) {
      console.log('=== First raw exception:', data[0], '===')
    } else {
      console.log('=== NO EXCEPTIONS FOUND IN DATABASE ===')
    }
    return data
  } catch (err) {
    console.error('=== Raw BookingExceptionLog query failed:', err, '===')
    throw err
  }
}

// Test to check if the table exists and we have permissions
export async function testTableAccess() {
  try {
    console.log('=== Testing table access and permissions ===')
    
    // Test 1: Try to get table info
    const { data: tableInfo, error: tableError } = await supabase
      .from('BookingExceptionLog')
      .select('exceptionlogid')
      .limit(1)
    
    if (tableError) {
      console.error('=== Table access error:', tableError, '===')
      return { success: false, error: tableError }
    }
    
    console.log('=== Table access successful ===')
    
    // Test 2: Try to count records
    const { count, error: countError } = await supabase
      .from('BookingExceptionLog')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('=== Count error:', countError, '===')
      return { success: false, error: countError }
    }
    
    console.log('=== Total records in table:', count, '===')
    return { success: true, count }
    
  } catch (err) {
    console.error('=== Table access test failed:', err, '===')
    return { success: false, error: err }
  }
}

// Add sample exception data for testing
export async function addSampleExceptions() {
  try {
    console.log('=== Adding sample exception data ===')
    
    // First, let's get a valid booking ID and exception status ID
    const { data: bookings } = await supabase
      .from('Booking')
      .select('bookingid')
      .limit(1)
    
    const { data: exceptionStatuses } = await supabase
      .from('BookingExceptionStatus')
      .select('bookingexceptionstatusid')
      .limit(1)
    
    if (!bookings?.length || !exceptionStatuses?.length) {
      console.log('=== No bookings or exception statuses found to create sample data ===')
      return
    }
    
    const sampleExceptions = [
      {
        bookingid: bookings[0].bookingid,
        bookingexceptionstatusid: exceptionStatuses[0].bookingexceptionstatusid,
        resolved: false
      },
      {
        bookingid: null, // Test exception without booking
        bookingexceptionstatusid: exceptionStatuses[0].bookingexceptionstatusid,
        resolved: false
      }
    ]
    
    const { data, error } = await supabase
      .from('BookingExceptionLog')
      .insert(sampleExceptions)
      .select()
    
    if (error) {
      console.error('=== Error adding sample exceptions:', error, '===')
      return
    }
    
    console.log('=== Sample exceptions added successfully:', data?.length || 0, '===')
    return data
    
  } catch (err) {
    console.error('=== Error adding sample exceptions:', err, '===')
  }
}

// Test permissions across different tables
export async function testTablePermissions() {
  try {
    console.log('=== Testing permissions across tables ===')
    
    const tables = ['Client', 'Booking', 'BookingStatus', 'BookingExceptionStatus', 'BookingExceptionLog']
    
    for (const table of tables) {
      console.log(`=== Testing ${table} table ===`)
      
      // Test 1: Try to select
      const { data: selectData, error: selectError } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (selectError) {
        console.error(`=== ${table} SELECT error:`, selectError, '===')
      } else {
        console.log(`=== ${table} SELECT successful, found:`, selectData?.length || 0, 'records ===')
      }
      
      // Test 2: Try to count
      const { count, error: countError } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (countError) {
        console.error(`=== ${table} COUNT error:`, countError, '===')
      } else {
        console.log(`=== ${table} COUNT successful, total records:`, count, '===')
      }
      
      console.log('---')
    }
    
  } catch (err) {
    console.error('=== Table permissions test failed:', err, '===')
  }
}
