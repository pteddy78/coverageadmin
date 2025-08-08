import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { ApiError } from '@/types/api'

export function handleApiError(error: unknown): NextResponse<ApiError> {
  console.error('API Error:', error)

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: 'Validation error', details: error.errors },
      { status: 400 }
    )
  }

  if (error instanceof Error) {
    // Handle specific database errors
    if (error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    if (error.message.includes('duplicate')) {
      return NextResponse.json(
        { error: 'Resource already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  )
}

export async function validateRequest<T>(
  request: Request,
  schema: { parse: (data: unknown) => T }
): Promise<T> {
  const body = await request.json()
  return schema.parse(body)
}
