"use client"

import { useMemo, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, AlertCircle } from 'lucide-react'
import { useExceptions } from "@/hooks/use-exceptions"
import { Skeleton } from "@/components/ui/skeleton"
import { debugAllExceptions } from "@/lib/database"

export default function ExceptionsPage() {
  const [query, setQuery] = useState("")
  const { data: exceptions, isLoading, error } = useExceptions()

  // Debug: Check if there are any exceptions at all
  useEffect(() => {
    debugAllExceptions().catch(console.error)
  }, [])

  const filtered = useMemo(() => {
    if (!exceptions) return []
    if (!query.trim()) return exceptions
    
    const q = query.toLowerCase()
    return exceptions.filter((e) => {
      return (
        e.exceptionlogid.toString().toLowerCase().includes(q) ||
        e.BookingExceptionStatus?.exception_shortdesc?.toLowerCase().includes(q) ||
        e.BookingExceptionStatus?.exception_longdesc?.toLowerCase().includes(q) ||
        e.Booking?.Client?.companyname?.toLowerCase().includes(q)
      )
    })
  }, [exceptions, query])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium mb-1 block">Search Exceptions</label>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load exceptions. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="">
          <label className="text-sm font-medium mb-1 block">Search Exceptions</label>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by error, message, booking, or client"
          />
        </div>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Exception Log</CardTitle>
          <Badge variant="secondary">{filtered.length} issues</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filtered.map((e) => {
              const booking = e.Booking
              const client = booking?.Client
              return (
                <Alert key={e.exceptionlogid} variant="destructive" className="border-red-300/60">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="flex items-center gap-2">
                    {e.BookingExceptionStatus?.exception_shortdesc}
                    <Badge variant="outline" className="ml-1">{e.exceptionlogid}</Badge>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {new Date(e.created_at).toLocaleString()}
                    </span>
                  </AlertTitle>
                  <AlertDescription className="mt-2">
                    <div className="text-sm">{e.BookingExceptionStatus?.exception_longdesc}</div>
                    <Accordion type="single" collapsible className="mt-2">
                      <AccordionItem value="details">
                        <AccordionTrigger>Booking details</AccordionTrigger>
                        <AccordionContent>
                          {booking ? (
                            <div className="grid gap-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Client</span>
                                <span className="font-medium">{client?.companyname}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Booking ID</span>
                                <span className="font-medium">{booking.bookingid}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Start Date</span>
                                <span className="font-medium">
                                  {booking.cover_startdate ? new Date(booking.cover_startdate).toLocaleDateString() : '—'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">End Date</span>
                                <span className="font-medium">
                                  {booking.cover_enddate ? new Date(booking.cover_enddate).toLocaleDateString() : '—'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Contact</span>
                                <span className="font-medium">{booking.primary_contact}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <span className="font-medium">{e.resolved ? 'Resolved' : 'Unresolved'}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">No booking found for this error.</div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </AlertDescription>
                </Alert>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
