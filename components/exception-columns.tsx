"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, AlertCircle, Eye, Calendar, User } from 'lucide-react'
import type { ExceptionWithRelations } from "@/types/api"

export function exceptionColumns(onViewDetails?: (exception: ExceptionWithRelations) => void): ColumnDef<ExceptionWithRelations>[] {
  return [
    {
      accessorKey: "exceptionlogid",
      header: "Exception ID",
      cell: ({ row }) => {
        const exception = row.original
        return (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              #{exception.exceptionlogid}
            </Badge>
          </div>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: "resolved",
      header: "Status",
      cell: ({ row }) => {
        const isResolved = row.original.resolved
        return (
          <Badge variant={isResolved ? "default" : "destructive"}>
            {isResolved ? "Resolved" : "Unresolved"}
          </Badge>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: "BookingExceptionStatus.exception_shortdesc",
      header: "Issue",
      cell: ({ row }) => {
        const exception = row.original
        const shortDesc = exception.BookingExceptionStatus?.exception_shortdesc || 'Unknown Issue'
        return (
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span className="font-medium">{shortDesc}</span>
          </div>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: "BookingExceptionStatus.exception_longdesc",
      header: "Description",
      cell: ({ row }) => {
        const longDesc = row.original.BookingExceptionStatus?.exception_longdesc || 'No description available'
        return (
          <div className="max-w-xs">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {longDesc}
            </p>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "Booking.Client.companyname",
      header: "Client",
      cell: ({ row }) => {
        const client = row.original.Booking?.Client
        return (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {client?.companyname || 'No Client'}
            </span>
          </div>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: "Booking.bookingid",
      header: "Booking Info",
      cell: ({ row }) => {
        const booking = row.original.Booking
        if (!booking) {
          return (
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">No booking</span>
            </div>
          )
        }
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="text-xs">
                #{booking.bookingid}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {booking.BookingStatus?.bookingstatus_shortdesc}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {booking.cover_startdate ? new Date(booking.cover_startdate).toLocaleDateString() : '—'}
              </span>
            </div>
          </div>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const createdAt = row.original.created_at
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {createdAt ? new Date(createdAt).toLocaleDateString() : '—'}
            </span>
          </div>
        )
      },
      enableSorting: true,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const exception = row.original
        return (
          <div className="flex justify-end">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onViewDetails?.(exception)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Details
            </Button>
          </div>
        )
      },
      enableSorting: false,
    },
  ]
}
