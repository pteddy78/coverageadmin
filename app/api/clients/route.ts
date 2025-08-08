import { NextResponse } from 'next/server'
import { getClients, getClientById } from '@/lib/database'
import { handleApiError, validateRequest } from '@/lib/api-utils'
import { createClientSchema } from '@/lib/validations'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('id')

    if (clientId) {
      const client = await getClientById(Number(clientId))
      if (!client) {
        return NextResponse.json(
          { error: 'Client not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(client)
    }

    const clients = await getClients()
    return NextResponse.json(clients)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: Request) {
  try {
    const data = await validateRequest(request, createClientSchema)
    
    const { data: client, error } = await supabase
      .from('Client')
      .insert(data)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(client)
  } catch (error) {
    return handleApiError(error)
  }
}
