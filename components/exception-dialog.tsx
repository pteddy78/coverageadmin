"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, Calendar, User, Mail, Clock, FileText } from 'lucide-react'
import type { ExceptionWithRelations } from "@/types/api"

export function ExceptionDialog({
  exception,
  open = false,
  onOpenChange = () => {},
}: {
  exception?: ExceptionWithRelations
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  if (!exception) return null

  const booking = exception.Booking
  const client = booking?.Client
  const exceptionStatus = exception.BookingExceptionStatus

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Exception Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about this exception and associated booking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Exception Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="font-mono">
                  #{exception.exceptionlogid}
                </Badge>
                <Badge variant={exception.resolved ? "default" : "destructive"}>
                  {exception.resolved ? "Resolved" : "Unresolved"}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <Clock className="h-4 w-4 inline mr-1" />
                {new Date(exception.created_at).toLocaleString()}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  {exceptionStatus?.exception_shortdesc || 'Unknown Issue'}
                </h3>
              </div>

              {exceptionStatus?.exception_longdesc && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Description</span>
                  </div>
                  <p className="text-sm">{exceptionStatus.exception_longdesc}</p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Information */}
          {booking ? (
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-3 text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Booking Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs">Client</span>
                  <span className="font-medium flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {client?.companyname || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Booking ID</span>
                  <span className="font-medium">#{booking.bookingid || '—'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Contact</span>
                  <span className="font-medium flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {booking.primary_contact || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Email</span>
                  <span className="font-medium flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {booking.primary_email || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Start Date</span>
                  <span className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {booking.cover_startdate ? new Date(booking.cover_startdate).toLocaleDateString() : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">End Date</span>
                  <span className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {booking.cover_enddate ? new Date(booking.cover_enddate).toLocaleDateString() : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Booking Status</span>
                  <span className="font-medium">
                    {booking.BookingStatus?.bookingstatus_shortdesc || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Created</span>
                  <span className="font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {booking.created_at ? new Date(booking.created_at).toLocaleDateString() : '—'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                No booking associated with this exception.
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
