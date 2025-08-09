"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarClock, MapPin } from 'lucide-react'
import type { BookingWithRelations } from "@/types/api"

export function bookingColumns(onViewDetails?: (booking: BookingWithRelations) => void): ColumnDef<BookingWithRelations>[] {
  return [
    {
      accessorKey: "bookingid",
      header: "Booking ID",
      cell: ({ row }) => {
        const b = row.original
        return (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              #{b.bookingid}
            </Badge>
          </div>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: "Client.companyname",
      header: "Client",
      cell: ({ row }) => {
        const b = row.original
        return (
          <div className="flex flex-col">
            <span className="font-medium">{b.Client?.companyname ?? "—"}</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                #{b.clientid}
              </Badge>
            </div>
          </div>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: "cover_startdate",
      header: "Schedule",
      cell: ({ row }) => {
        const b = row.original
        return (
          <div className="flex flex-col">
            <span className="flex items-center gap-1">
              <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm">
                {new Date(b.cover_startdate ?? '').toLocaleDateString()}
              </span>
            </span>
            <span className="text-xs text-muted-foreground">
              to {new Date(b.cover_enddate ?? '').toLocaleDateString()}
            </span>
          </div>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: "primary_contact",
      header: "Contact",
      cell: ({ row }) => {
        const b = row.original
        return b.primary_contact ? (
          <div className="flex flex-col">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              {b.primary_contact}
            </span>
            {b.primary_email && (
              <span className="text-xs text-muted-foreground">{b.primary_email}</span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: "BookingStatus.bookingstatus_shortdesc",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.BookingStatus?.bookingstatus_shortdesc ?? ''
        const variant = 
          status.toLowerCase() === "confirmed" ? "default" : 
          status.toLowerCase() === "pending" ? "secondary" : 
          "outline"
        return <Badge variant={variant}>{status}</Badge>
      },
      enableSorting: true,
    },
    {
      accessorKey: "unitcount2025",
      header: "2025 Units",
      cell: ({ getValue }) => {
        const value = getValue() as number | null
        return (
          <span className="text-sm tabular-nums">
            {value?.toLocaleString() ?? '—'}
          </span>
        )
      },
      enableSorting: true,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const b = row.original
        return (
          <div className="flex justify-end">
            <Button 
              size="sm" 
              onClick={() => onViewDetails?.(b)}
            >
              View Details
            </Button>
          </div>
        )
      },
      enableSorting: false,
    },
  ]
}
