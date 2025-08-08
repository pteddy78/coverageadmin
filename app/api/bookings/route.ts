import { NextResponse } from 'next/server'
import { getBookings, getBookingById, getBookingsByClientId } from '@/lib/database'
import { handleApiError, validateRequest } from '@/lib/api-utils'
import { createBookingSchema, updateBookingSchema } from '@/lib/validations'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('id')
    const clientId = searchParams.get('clientId')

    if (bookingId) {
      const booking = await getBookingById(Number(bookingId))
      if (!booking) {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(booking)
    }

    if (clientId) {
      const bookings = await getBookingsByClientId(Number(clientId))
      return NextResponse.json(bookings)
    }

    const bookings = await getBookings()
    return NextResponse.json(bookings)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const data = await validateRequest(request, createBookingSchema)
    
    // Start a transaction to insert booking and booking days
    const { bookingDays, ...bookingData } = data
    
    // Insert booking
    const { data: booking, error: bookingError } = await supabase
      .from('Booking')
      .insert(bookingData)
      .select()
      .single()

    if (bookingError) throw bookingError
    
    // Insert booking days if provided
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

    return NextResponse.json(booking)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('id')
    
    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    const data = await validateRequest(request, updateBookingSchema)
    const { bookingDays, ...bookingData } = data

    // Update booking
    const { data: booking, error: bookingError } = await supabase
      .from('Booking')
      .update(bookingData)
      .eq('bookingid', bookingId)
      .select()
      .single()

    if (bookingError) throw bookingError

    // Update booking days if provided
    if (bookingDays?.length) {
      // Delete existing booking days
      const { error: deleteError } = await supabase
        .from('BookingDays')
        .delete()
        .eq('bookingid', bookingId)

      if (deleteError) throw deleteError

      // Insert new booking days
      const daysWithBookingId = bookingDays.map(day => ({
        ...day,
        bookingid: Number(bookingId)
      }))
      
      const { error: daysError } = await supabase
        .from('BookingDays')
        .insert(daysWithBookingId)

      if (daysError) throw daysError
    }

    return NextResponse.json(booking)
  } catch (error) {
    return handleApiError(error)
  }
}
