"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Client } from "@/types/api"

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n?.[0] ?? '')
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function clientColumns(onViewBookings?: (client: Client) => void): ColumnDef<Client>[] {
  return [
    {
      accessorKey: "clientid",
      header: "Client ID",
      cell: ({ row }) => {
        const c = row.original
        return (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              #{c.clientid}
            </Badge>
          </div>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: "companyname",
      header: "Client",
      cell: ({ row }) => {
        const c = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials(c.companyname ?? '')}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{c.companyname}</div>
            </div>
          </div>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: "unitcount2024",
      header: "2024 Units",
      cell: ({ getValue }) => {
        const value = getValue() as number | null
        return <span className="text-sm tabular-nums">{value ?? '—'}</span>
      },
      enableSorting: true,
    },
    {
      accessorKey: "hasbooking",
      header: "Status",
      cell: ({ row }) => {
        const hasBooking = row.original.hasbooking
        return (
          <Badge variant={hasBooking ? "default" : "outline"}>
            {hasBooking ? "Has Bookings" : "No Bookings"}
          </Badge>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: "price2024",
      header: "2024 Price",
      cell: ({ getValue }) => {
        const value = getValue() as number | null
        return (
          <span className="text-sm tabular-nums">
            {value ? `£${value.toLocaleString()}` : '—'}
          </span>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: "rate2024",
      header: "2024 Rate",
      cell: ({ getValue }) => {
        const value = getValue() as number | null
        return (
          <span className="text-sm tabular-nums">
            {value ? `£${value.toLocaleString()}` : '—'}
          </span>
        )
      },
      enableSorting: true,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const c = row.original
        return (
          <div className="flex justify-end">
            <Button 
              size="sm" 
              onClick={() => onViewBookings?.(c)}
              disabled={!c.hasbooking}
            >
              View bookings
            </Button>
          </div>
        )
      },
      enableSorting: false,
    },
  ]
}
