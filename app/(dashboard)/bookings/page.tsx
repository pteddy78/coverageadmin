"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RefreshCcw, AlertCircle } from 'lucide-react'
import { DataTable } from "@/components/data-table"
import { bookingColumns } from "@/components/booking-columns"
import { useBookings } from "@/hooks/use-bookings"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { BookingDetailsDialog } from "@/components/booking-details-dialog"
import type { BookingWithRelations } from "@/types/api"
import { testSupabaseConnection } from "@/lib/database"

type StatusFilter = "all" | "confirmed" | "pending" | "cancelled"
type CoverageFilter = "all" | "phone" | "onsite" | "both"
type PeriodFilter = "all" | "christmas" | "newyear"

export default function BookingsPage() {
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<StatusFilter>("all")
  const [coverage, setCoverage] = React.useState<CoverageFilter>("all")
  const [period, setPeriod] = React.useState<PeriodFilter>("all")
  const [selectedBooking, setSelectedBooking] = React.useState<BookingWithRelations | null>(null)

  const { data: bookings, isLoading, error } = useBookings()

  // Test Supabase connection on component mount
  React.useEffect(() => {
    testSupabaseConnection().catch(console.error)
  }, [])

  const filtered = React.useMemo(() => {
    if (!bookings) return []
    
    let result = bookings
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (b) =>
          b.booking_notes?.toLowerCase().includes(q) ||
          b.Client?.companyname?.toLowerCase().includes(q) ||
          b.primary_contact?.toLowerCase().includes(q)
      )
    }
    if (status !== "all") {
      result = result.filter((b) => 
        b.BookingStatus?.bookingstatus_shortdesc?.toLowerCase() === status
      )
    }
    if (coverage !== "all") {
      result = result.filter((b) => {
        const cov = b.CoverageConfig?.coverage_name?.toLowerCase() || ""
        if (coverage === "both") return cov.includes("phone") && cov.includes("onsite")
        return cov.includes(coverage)
      })
    }
    if (period !== "all") {
      // Filter by date range - this would need to be implemented based on your data structure
      // For now, we'll show all bookings
      result = result
    }
    return result
  }, [bookings, query, status, coverage, period])

  const resetFilters = () => {
    setQuery("")
    setStatus("all")
    setCoverage("all")
    setPeriod("all")
  }

  const columns = React.useMemo(() => bookingColumns((booking) => setSelectedBooking(booking)), [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-[280px]" />
          <Skeleton className="h-10 w-[160px]" />
          <Skeleton className="h-10 w-[180px]" />
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
          Failed to load bookings. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  const toolbar = (
    <div className="flex w-full flex-col gap-2 md:flex-row md:items-center">
      <div className="md:w-[280px]">
        <Input
          placeholder="Search bookings..."
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
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={coverage}
        onValueChange={(v) => setCoverage(v as CoverageFilter)}
      >
        <SelectTrigger className="md:w-[180px]">
          <SelectValue placeholder="Coverage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All coverage</SelectItem>
          <SelectItem value="phone">Phone</SelectItem>
          <SelectItem value="onsite">Onsite</SelectItem>
          <SelectItem value="both">Phone + Onsite</SelectItem>
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
      <BookingDetailsDialog
        booking={selectedBooking ?? undefined}
        open={!!selectedBooking}
        onOpenChange={(open) => {
          if (!open) setSelectedBooking(null)
        }}
      />
    </>
  )
}
