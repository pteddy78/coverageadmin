import { NextResponse } from 'next/server'
import { getExceptions } from '@/lib/database'
import { handleApiError, validateRequest } from '@/lib/api-utils'
import { createExceptionSchema, updateExceptionSchema } from '@/lib/validations'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const resolved = searchParams.get('resolved')
    
    const exceptions = await getExceptions()
    
    if (resolved !== null) {
      const isResolved = resolved === 'true'
      return NextResponse.json(
        exceptions.filter(e => e.resolved === isResolved)
      )
    }
    
    return NextResponse.json(exceptions)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const data = await validateRequest(request, createExceptionSchema)
    
    const { data: exception, error } = await supabase
      .from('BookingExceptionLog')
      .insert(data)
      .select(`
        *,
        Booking (
          bookingid,
          clientid,
          Client (
            companyname
          )
        ),
        BookingExceptionStatus (
          exception_shortdesc,
          exception_longdesc
        )
      `)
      .single()

    if (error) throw error
    return NextResponse.json(exception)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const exceptionId = searchParams.get('id')
    
    if (!exceptionId) {
      return NextResponse.json(
        { error: 'Exception ID is required' },
        { status: 400 }
      )
    }

    const data = await validateRequest(request, updateExceptionSchema)
    
    const { data: exception, error } = await supabase
      .from('BookingExceptionLog')
      .update(data)
      .eq('exceptionlogid', exceptionId)
      .select(`
        *,
        Booking (
          bookingid,
          clientid,
          Client (
            companyname
          )
        ),
        BookingExceptionStatus (
          exception_shortdesc,
          exception_longdesc
        )
      `)
      .single()

    if (error) throw error
    return NextResponse.json(exception)
  } catch (error) {
    return handleApiError(error)
  }
}
