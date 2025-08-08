"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, MapPin, Ticket, Mail, AlertTriangle, ExternalLink } from 'lucide-react'
import { useBookingsByClient } from "@/hooks/use-bookings"
import { Skeleton } from "@/components/ui/skeleton"
import type { Client, BookingWithRelations } from "@/types/api"
import { debugAllBookings } from "@/lib/database"
import { useRouter } from "next/navigation"

export function BookingDialog({
  client,
  open = false,
  onOpenChange = () => {},
}: {
  client?: Client
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const { data: bookings, isLoading } = useBookingsByClient(client?.clientid ?? 0)
  const router = useRouter()

  // Debug: Check if there are any bookings at all
  React.useEffect(() => {
    if (open && client?.clientid) {
      debugAllBookings().catch(console.error)
    }
  }, [open, client?.clientid])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Bookings for {client?.companyname}</DialogTitle>
          <DialogDescription>Client ID: {client?.clientid}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : bookings?.length === 0 ? (
            <div className="text-sm text-muted-foreground">No bookings found for this client.</div>
          ) : (
            <div className="grid gap-4">
              {bookings?.map((b: BookingWithRelations) => (
                <div key={b.bookingid} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-lg">Booking #{b.bookingid}</span>
                      <Badge variant={
                        b.BookingStatus?.bookingstatus_shortdesc?.toLowerCase() === "confirmed" ? "default" : 
                        b.BookingStatus?.bookingstatus_shortdesc?.toLowerCase() === "pending" ? "secondary" : 
                        "outline"
                      }>
                        {b.BookingStatus?.bookingstatus_shortdesc}
                      </Badge>
                      {b.BookingExceptionLog && b.BookingExceptionLog.length > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          Issues {b.BookingExceptionLog.length}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Created: {new Date(b.created_at ?? '').toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">Coverage Period</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(b.cover_startdate ?? '').toLocaleDateString()} - {new Date(b.cover_enddate ?? '').toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">Booking Status</div>
                          <div className="text-sm text-muted-foreground">
                            {b.BookingStatus?.bookingstatus_shortdesc ?? '—'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {b.primary_contact && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">Primary Contact</div>
                            <div className="text-sm text-muted-foreground">{b.primary_contact}</div>
                          </div>
                        </div>
                      )}
                      
                      {b.primary_email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">Email</div>
                            <div className="text-sm text-muted-foreground">{b.primary_email}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {b.booking_notes && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-sm font-medium mb-1">Notes</div>
                      <div className="text-sm text-muted-foreground">{b.booking_notes}</div>
                    </div>
                  )}
                  
                  {/* Exception Log Display */}
                  {b.BookingExceptionLog && b.BookingExceptionLog.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-red-200 bg-red-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium text-red-800">Booking has {b.BookingExceptionLog.length} issue{b.BookingExceptionLog.length > 1 ? 's' : ''}</span>
                      </div>
                      
                      {b.BookingExceptionLog.map((exception) => (
                        <div key={exception.exceptionlogid} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="destructive" className="text-xs">
                              {exception.BookingExceptionStatus?.exception_shortdesc || 'Unknown Issue'}
                            </Badge>
                            <span className="text-xs text-red-600">
                              {exception.BookingExceptionStatus?.exception_shortdesc || 'Unknown Issue'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(exception.created_at).toLocaleString()}
                            </span>
                          </div>
                          
                          {exception.BookingExceptionStatus?.exception_longdesc && (
                            <div className="text-sm text-red-700">
                              {exception.BookingExceptionStatus.exception_longdesc}
                            </div>
                          )}
                          
                          <div className="text-sm text-red-600">
                            Details: {exception.BookingExceptionStatus?.exception_longdesc || 'No additional details available.'}
                          </div>
                          
                          <div 
                            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 cursor-pointer"
                            onClick={() => {
                              onOpenChange(false) // Close the modal
                              router.push('/exceptions') // Navigate to exceptions page
                            }}
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>View in Exception Log</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
