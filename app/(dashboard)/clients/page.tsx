"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RefreshCcw, AlertCircle } from 'lucide-react'
import { DataTable } from "@/components/data-table"
import { clientColumns } from "@/components/client-columns"
import { BookingDialog } from "@/components/booking-dialog"
import { useClients } from "@/hooks/use-clients"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import type { ClientWithBookings } from "@/types/api"

type StatusFilter = "all" | "active" | "inactive"
type PeriodFilter = "all" | "christmas" | "newyear"

export default function ClientsPage() {
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<StatusFilter>("all")
  const [period, setPeriod] = React.useState<PeriodFilter>("all")
  const [dialogClient, setDialogClient] = React.useState<ClientWithBookings | null>(null)

  const { data: clients, isLoading, error } = useClients()

  const filtered = React.useMemo(() => {
    if (!clients) return []
    
    let result = clients
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter((c) =>
        c.companyname?.toLowerCase().includes(q) ||
        c.hasbooking?.toString().includes(q)
      )
    }
    if (status !== "all") {
      result = result.filter((c) => c.hasbooking === (status === "active"))
    }
    if (period !== "all") {
      // Filter by booking period - this would need to be implemented based on your data structure
      // For now, we'll show all clients with bookings for any period
      result = result.filter((c) => c.hasbooking)
    }
    return result
  }, [clients, query, status, period])

  const resetFilters = () => {
    setQuery("")
    setStatus("all")
    setPeriod("all")
  }

  const columns = React.useMemo(() => clientColumns((c) => setDialogClient(c)), [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[160px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load clients. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  const toolbar = (
    <div className="flex w-full flex-col gap-2 md:flex-row md:items-center">
      <div className="md:w-[260px]">
        <Input
          placeholder="Search clients..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Select
        value={status}
        onValueChange={(v) => setStatus(v as StatusFilter)}
      >
        <SelectTrigger className="md:w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="active">Has bookings</SelectItem>
          <SelectItem value="inactive">No bookings</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={period}
        onValueChange={(v) => setPeriod(v as PeriodFilter)}
      >
        <SelectTrigger className="md:w-[180px]">
          <SelectValue placeholder="Period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All periods</SelectItem>
          <SelectItem value="christmas">Christmas Week</SelectItem>
          <SelectItem value="newyear">New Year</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" className="md:ml-auto" onClick={resetFilters}>
        <RefreshCcw className="mr-2 h-4 w-4" />
        Reset
      </Button>
    </div>
  )

  return (
    <>
      <DataTable columns={columns} data={filtered} toolbar={toolbar} initialPageSize={10} />
      <BookingDialog
        client={dialogClient ?? undefined}
        open={!!dialogClient}
        onOpenChange={(o) => {
          if (!o) setDialogClient(null)
        }}
      />
    </>
  )
}
