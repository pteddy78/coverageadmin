"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, MapPin, Ticket, Mail, Calendar, Clock } from 'lucide-react'

import type { BookingWithRelations } from "@/types/api"

export function BookingDetailsDialog({
  booking,
  open = false,
  onOpenChange = () => {},
}: {
  booking?: BookingWithRelations
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Booking Details <Badge variant="outline" className="font-mono text-xs">#{booking?.bookingid}</Badge></DialogTitle>
          <DialogDescription>
            {booking?.Client?.companyname} • {booking?.primary_contact} • <Badge variant="outline" className="font-mono text-xs">#{booking?.clientid}</Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {!booking ? (
            <div className="text-sm text-muted-foreground">No booking selected.</div>
          ) : (
            <>
              {/* Booking Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Coverage Period</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(booking.cover_startdate ?? '').toLocaleDateString()} - {new Date(booking.cover_enddate ?? '').toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Booking Status</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.BookingStatus?.bookingstatus_shortdesc ?? '—'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Coverage Type</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.CoverageConfig?.coverage_name ?? '—'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {booking.primary_contact && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Primary Contact</div>
                        <div className="text-sm text-muted-foreground">{booking.primary_contact}</div>
                      </div>
                    </div>
                  )}
                  
                  {booking.primary_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Email</div>
                        <div className="text-sm text-muted-foreground">{booking.primary_email}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Created</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(booking.created_at ?? '').toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Booking Days */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm font-medium">Booking Days</div>
                  <Badge variant="outline">{booking.BookingDays?.length || 0} days</Badge>
                </div>
                
                                 {booking.BookingDays && booking.BookingDays.length > 0 ? (
                   <div className="grid gap-3">
                     {booking.BookingDays.map((day, index) => {
                       // Debug the date value
                       console.log('Day date value:', day.coverage_day, typeof day.coverage_day)
                       
                       // Try to parse the date safely
                       let displayDate = '—'
                       if (day.coverage_day) {
                         try {
                           const date = new Date(day.coverage_day)
                           if (!isNaN(date.getTime())) {
                             displayDate = date.toLocaleDateString()
                           }
                         } catch (error) {
                           console.error('Error parsing date:', day.coverage_day, error)
                         }
                       }
                       
                       return (
                         <div key={index} className="rounded-lg border p-3">
                           <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                               <Calendar className="h-4 w-4 text-muted-foreground" />
                               <span className="text-sm font-medium">
                                 {displayDate}
                               </span>
                             </div>
                             <div className="flex items-center gap-2">
                               {day.start_time && (
                                 <span className="text-xs text-muted-foreground">
                                   {day.start_time} - {day.end_time || '—'}
                                 </span>
                               )}
                             </div>
                           </div>
                         </div>
                       )
                     })}
                   </div>
                 ) : (
                   <div className="text-sm text-muted-foreground">No specific days configured for this booking.</div>
                 )}
              </div>
              
              {/* Notes */}
              {booking.booking_notes && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Notes</div>
                  <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                    {booking.booking_notes}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
