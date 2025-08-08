export type Client = {
  id: string
  name: string
  email: string
  company: string
  status: "Active" | "Inactive"
}

export type Booking = {
  id: string
  clientId: string
  service: string
  coverage: string
  date: string
  startTime?: string
  endTime?: string
  location?: string
  status: "Confirmed" | "Pending" | "Cancelled"
  notes?: string
  periodTag: "christmas" | "newyear"
}

export type Exception = {
  id: string
  bookingId: string
  type: string
  message: string
  createdAt: string
}

export const clients: Client[] = [
  { id: "c1", name: "Alice Johnson", email: "alice@acme.com", company: "Acme Ltd", status: "Active" },
  { id: "c2", name: "Bob Smith", email: "bob@globex.com", company: "Globex Corp", status: "Active" },
  { id: "c3", name: "Carol White", email: "carol@initech.com", company: "Initech", status: "Inactive" },
  { id: "c4", name: "David Brown", email: "david@umbrella.com", company: "Umbrella", status: "Active" },
  { id: "c5", name: "Emma Davis", email: "emma@stark.com", company: "Stark Industries", status: "Active" },
  { id: "c6", name: "Frank Miller", email: "frank@wayne.com", company: "Wayne Enterprises", status: "Inactive" },
  { id: "c7", name: "Grace Lee", email: "grace@hooli.com", company: "Hooli", status: "Active" },
  { id: "c8", name: "Henry Wilson", email: "henry@oscorp.com", company: "Oscorp", status: "Active" },
  { id: "c9", name: "Ivy Martinez", email: "ivy@wonka.com", company: "Wonka", status: "Active" },
  { id: "c10", name: "Jack Taylor", email: "jack@soylent.com", company: "Soylent", status: "Inactive" },
  { id: "c11", name: "Karen Thomas", email: "karen@zapp.com", company: "Zapponi", status: "Active" },
  { id: "c12", name: "Leo Hernandez", email: "leo@tyrell.com", company: "Tyrell", status: "Active" },
  { id: "c13", name: "Mia Clark", email: "mia@cyberdyne.com", company: "Cyberdyne", status: "Active" },
  { id: "c14", name: "Noah Rodriguez", email: "noah@oceanic.com", company: "Oceanic", status: "Inactive" },
  { id: "c15", name: "Olivia Lewis", email: "olivia@dalek.com", company: "Dalek Inc", status: "Active" },
  { id: "c16", name: "Paul Walker", email: "paul@bluebook.com", company: "BlueBook", status: "Active" },
  { id: "c17", name: "Quincy Hall", email: "quincy@massive.com", company: "Massive Dynamic", status: "Active" },
  { id: "c18", name: "Rita Allen", email: "rita@blackmesa.com", company: "Black Mesa", status: "Inactive" },
  { id: "c19", name: "Sam Young", email: "sam@aperture.com", company: "Aperture Science", status: "Active" },
  { id: "c20", name: "Tina King", email: "tina@monarch.com", company: "Monarch", status: "Active" },
  { id: "c21", name: "Uma Patel", email: "uma@helix.com", company: "Helix", status: "Active" },
  { id: "c22", name: "Victor Gomez", email: "victor@trask.com", company: "Trask", status: "Inactive" },
  { id: "c23", name: "Wendy Perez", email: "wendy@vought.com", company: "Vought", status: "Active" },
  { id: "c24", name: "Xavier Scott", email: "xavier@genysis.com", company: "Genisys", status: "Active" },
]

export const bookings: Booking[] = [
  { id: "b1", clientId: "c1", service: "Holiday On-call Support", coverage: "Phone + Onsite", date: "2025-12-23", startTime: "09:00", endTime: "17:00", location: "London", status: "Confirmed", notes: "Tier-2 engineer required", periodTag: "christmas" },
  { id: "b2", clientId: "c1", service: "System Monitoring", coverage: "Phone", date: "2025-12-24", startTime: "08:00", endTime: "16:00", location: "Remote", status: "Pending", periodTag: "christmas" },
  { id: "b3", clientId: "c2", service: "Outage Response", coverage: "Onsite", date: "2025-12-26", startTime: "10:00", endTime: "18:00", location: "Manchester", status: "Confirmed", periodTag: "christmas" },
  { id: "b4", clientId: "c3", service: "Holiday Coverage", coverage: "Phone", date: "2025-12-31", startTime: "12:00", endTime: "20:00", location: "Remote", status: "Cancelled", periodTag: "newyear" },
  { id: "b5", clientId: "c4", service: "Critical Response", coverage: "Phone + Onsite", date: "2026-01-01", startTime: "09:00", endTime: "21:00", location: "Birmingham", status: "Confirmed", periodTag: "newyear" },
  { id: "b6", clientId: "c5", service: "System Monitoring", coverage: "Phone", date: "2025-12-27", location: "Remote", status: "Pending", periodTag: "christmas" },
  { id: "b7", clientId: "c6", service: "Holiday On-call Support", coverage: "Onsite", date: "2025-12-24", startTime: "11:00", endTime: "19:00", location: "Leeds", status: "Confirmed", periodTag: "christmas" },
  { id: "b8", clientId: "c7", service: "Critical Response", coverage: "Phone + Onsite", date: "2025-12-29", startTime: "07:00", endTime: "15:00", location: "London", status: "Pending", periodTag: "christmas" },
  { id: "b9", clientId: "c8", service: "System Monitoring", coverage: "Phone", date: "2025-12-30", location: "Remote", status: "Confirmed", periodTag: "christmas" },
  { id: "b10", clientId: "c9", service: "Outage Response", coverage: "Onsite", date: "2026-01-01", startTime: "10:00", endTime: "18:00", location: "Bristol", status: "Pending", periodTag: "newyear" },
  { id: "b11", clientId: "c10", service: "Holiday Coverage", coverage: "Phone", date: "2025-12-25", location: "Remote", status: "Confirmed", periodTag: "christmas" },
  { id: "b12", clientId: "c11", service: "Holiday On-call Support", coverage: "Phone + Onsite", date: "2025-12-28", startTime: "09:00", endTime: "17:00", location: "Glasgow", status: "Confirmed", periodTag: "christmas" },
  { id: "b13", clientId: "c12", service: "Critical Response", coverage: "Phone + Onsite", date: "2025-12-31", startTime: "14:00", endTime: "22:00", location: "London", status: "Pending", periodTag: "newyear" },
  { id: "b14", clientId: "c13", service: "System Monitoring", coverage: "Phone", date: "2026-01-01", location: "Remote", status: "Confirmed", periodTag: "newyear" },
  { id: "b15", clientId: "c14", service: "Outage Response", coverage: "Onsite", date: "2025-12-26", startTime: "10:00", endTime: "18:00", location: "Edinburgh", status: "Cancelled", periodTag: "christmas" },
  { id: "b16", clientId: "c15", service: "Holiday Coverage", coverage: "Phone", date: "2025-12-27", location: "Remote", status: "Pending", periodTag: "christmas" },
  { id: "b17", clientId: "c16", service: "Holiday On-call Support", coverage: "Phone + Onsite", date: "2025-12-24", startTime: "12:00", endTime: "20:00", location: "Leicester", status: "Confirmed", periodTag: "christmas" },
  { id: "b18", clientId: "c17", service: "Critical Response", coverage: "Phone + Onsite", date: "2025-12-23", startTime: "08:00", endTime: "16:00", location: "Sheffield", status: "Pending", periodTag: "christmas" },
  { id: "b19", clientId: "c18", service: "System Monitoring", coverage: "Phone", date: "2025-12-30", location: "Remote", status: "Confirmed", periodTag: "christmas" },
  { id: "b20", clientId: "c19", service: "Outage Response", coverage: "Onsite", date: "2025-12-31", startTime: "11:00", endTime: "19:00", location: "Cardiff", status: "Confirmed", periodTag: "newyear" },
  { id: "b21", clientId: "c20", service: "Holiday Coverage", coverage: "Phone", date: "2025-12-29", location: "Remote", status: "Pending", periodTag: "christmas" },
  { id: "b22", clientId: "c21", service: "Holiday On-call Support", coverage: "Onsite", date: "2025-12-25", startTime: "09:00", endTime: "17:00", location: "York", status: "Confirmed", periodTag: "christmas" },
  { id: "b23", clientId: "c22", service: "Critical Response", coverage: "Phone + Onsite", date: "2026-01-01", startTime: "09:00", endTime: "17:00", location: "London", status: "Pending", periodTag: "newyear" },
  { id: "b24", clientId: "c23", service: "System Monitoring", coverage: "Phone", date: "2025-12-28", location: "Remote", status: "Confirmed", periodTag: "christmas" },
  { id: "b25", clientId: "c24", service: "Outage Response", coverage: "Onsite", date: "2025-12-27", startTime: "10:00", endTime: "18:00", location: "Nottingham", status: "Confirmed", periodTag: "christmas" },
]

export const bookingsByClientId: Record<string, Booking[]> = bookings.reduce((acc, b) => {
  acc[b.clientId] = acc[b.clientId] || []
  acc[b.clientId]!.push(b)
  return acc
}, {} as Record<string, Booking[]>)

export const clientsById: Record<string, Client> = clients.reduce((acc, c) => {
  acc[c.id] = c
  return acc
}, {} as Record<string, Client>)

export const bookingsById: Record<string, Booking> = bookings.reduce((acc, b) => {
  acc[b.id] = b
  return acc
}, {} as Record<string, Booking>)

export const exceptions: Exception[] = [
  {
    id: "e1",
    bookingId: "b2",
    type: "Scheduling Conflict",
    message: "Engineer assigned to overlapping shifts.",
    createdAt: "2025-12-15 10:24",
  },
  {
    id: "e2",
    bookingId: "b4",
    type: "Cancelled Without Reason",
    message: "Booking marked as Cancelled but no reason supplied.",
    createdAt: "2025-12-16 08:03",
  },
  {
    id: "e3",
    bookingId: "b8",
    type: "Missing Location",
    message: "Onsite coverage requires a location.",
    createdAt: "2025-12-17 14:51",
  },
  {
    id: "e4",
    bookingId: "b13",
    type: "Unapproved Overtime",
    message: "Shift exceeds approved overtime limit.",
    createdAt: "2025-12-18 09:40",
  },
  {
    id: "e5",
    bookingId: "b16",
    type: "Unverified Contact",
    message: "Client contact details not verified for holiday period.",
    createdAt: "2025-12-19 16:19",
  },
  {
    id: "e6",
    bookingId: "b21",
    type: "Engineer Availability",
    message: "No Tier-2 engineer available for requested window.",
    createdAt: "2025-12-20 11:07",
  },
]
