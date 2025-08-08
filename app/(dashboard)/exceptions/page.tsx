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


export default function ExceptionsPage() {
  const [query, setQuery] = useState("")
  const { data: exceptions, isLoading, error } = useExceptions()





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
                  <div className="grid gap-3 sm:grid-cols-1">
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
          <div className="space-y-4">
                                    {filtered.map((e) => {
                          const booking = e.Booking
                          const client = booking?.Client
                          return (
                            <Card key={e.exceptionlogid} className="border-l-4 border-l-orange-500">
                              <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                                      <h3 className="font-semibold text-lg">
                                        {e.BookingExceptionStatus?.exception_shortdesc || 'Unknown Error'}
                                      </h3>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                      ID: {e.exceptionlogid}
                                    </Badge>
                                    <Badge variant={e.resolved ? "default" : "destructive"} className="text-xs">
                                      {e.resolved ? 'Resolved' : 'Unresolved'}
                                    </Badge>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(e.created_at).toLocaleString()}
                                  </span>
                                </div>
                                
                                <div className="mb-4">
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {e.BookingExceptionStatus?.exception_longdesc || 'No description available'}
                                  </p>
                                </div>

                                {booking ? (
                                  <div className="bg-muted/50 rounded-lg p-4">
                                    <h4 className="font-medium text-sm mb-3 text-muted-foreground">Booking Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                      <div>
                                        <span className="text-muted-foreground block text-xs">Client</span>
                                        <span className="font-medium">{client?.companyname || '—'}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground block text-xs">Booking ID</span>
                                        <span className="font-medium">{booking.bookingid || '—'}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground block text-xs">Contact</span>
                                        <span className="font-medium">{booking.primary_contact || '—'}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground block text-xs">Email</span>
                                        <span className="font-medium">{booking.primary_email || '—'}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground block text-xs">Start Date</span>
                                        <span className="font-medium">
                                          {booking.cover_startdate ? new Date(booking.cover_startdate).toLocaleDateString() : '—'}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground block text-xs">End Date</span>
                                        <span className="font-medium">
                                          {booking.cover_enddate ? new Date(booking.cover_enddate).toLocaleDateString() : '—'}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground block text-xs">Booking Status</span>
                                        <span className="font-medium">{booking.BookingStatus?.bookingstatus_shortdesc || '—'}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground block text-xs">Created</span>
                                        <span className="font-medium">
                                          {booking.created_at ? new Date(booking.created_at).toLocaleDateString() : '—'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-muted/50 rounded-lg p-4">
                                    <div className="text-sm text-muted-foreground">
                                      <AlertCircle className="h-4 w-4 inline mr-2" />
                                      No booking associated with this exception.
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )
                        })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
