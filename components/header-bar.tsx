"use client"

import { usePathname } from "next/navigation"

export function HeaderBar() {
  const pathname = usePathname()
  const title =
    pathname?.startsWith("/clients")
      ? "Clients"
      : pathname?.startsWith("/bookings")
      ? "Bookings"
      : pathname?.startsWith("/exceptions")
      ? "Exception Log"
      : "Dashboard"

  return (
    <div className="flex w-full items-center">
      <h1 className="text-lg font-semibold">{title}</h1>
    </div>
  )
}
