"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RefreshCcw, AlertCircle } from 'lucide-react'
import { DataTable } from "@/components/data-table"
import { exceptionColumns } from "@/components/exception-columns"
import { ExceptionDialog } from "@/components/exception-dialog"
import { useExceptions } from "@/hooks/use-exceptions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import type { ExceptionWithRelations } from "@/types/api"


type StatusFilter = "all" | "resolved" | "unresolved"
type DateFilter = "all" | "7days" | "30days"

export default function ExceptionsPage() {
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<StatusFilter>("all")
  const [dateFilter, setDateFilter] = React.useState<DateFilter>("all")
  const [dialogException, setDialogException] = React.useState<ExceptionWithRelations | null>(null)

  const { data: exceptions, isLoading, error } = useExceptions()

  const filtered = React.useMemo(() => {
    if (!exceptions) return []
    
    let result = exceptions
    
    // Search filter
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter((e) => {
        return (
          e.exceptionlogid.toString().toLowerCase().includes(q) ||
          e.BookingExceptionStatus?.exception_shortdesc?.toLowerCase().includes(q) ||
          e.BookingExceptionStatus?.exception_longdesc?.toLowerCase().includes(q) ||
          e.Booking?.Client?.companyname?.toLowerCase().includes(q)
        )
      })
    }
    
    // Status filter
    if (status !== "all") {
      result = result.filter((e) => e.resolved === (status === "resolved"))
    }
    
    // Date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const daysAgo = dateFilter === "7days" ? 7 : 30
      const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000))
      
      result = result.filter((e) => {
        const createdDate = new Date(e.created_at)
        return createdDate >= cutoffDate
      })
    }
    
    return result
  }, [exceptions, query, status, dateFilter])

  const resetFilters = () => {
    setQuery("")
    setStatus("all")
    setDateFilter("all")
  }

  const columns = React.useMemo(() => exceptionColumns((e) => setDialogException(e)), [])

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
          Failed to load exceptions. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  const toolbar = (
    <div className="flex w-full flex-col gap-2 md:flex-row md:items-center">
      <div className="md:w-[260px]">
        <Input
          placeholder="Search exceptions..."
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
          <SelectItem value="unresolved">Unresolved</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={dateFilter}
        onValueChange={(v) => setDateFilter(v as DateFilter)}
      >
        <SelectTrigger className="md:w-[180px]">
          <SelectValue placeholder="Date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All time</SelectItem>
          <SelectItem value="7days">Last 7 days</SelectItem>
          <SelectItem value="30days">Last 30 days</SelectItem>
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
      <ExceptionDialog
        exception={dialogException ?? undefined}
        open={!!dialogException}
        onOpenChange={(o) => {
          if (!o) setDialogException(null)
        }}
      />
    </>
  )
}
