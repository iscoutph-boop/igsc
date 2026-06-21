// Lightweight client-side booking store (localStorage).
// Used by the consultation form and the Manage Booking modal so a freshly
// created reference can be looked up immediately during the same session.

export type BookingStatus =
  | "Pending Confirmation"
  | "Confirmed"
  | "Site Visit Scheduled"
  | "Reschedule Requested"
  | "Cancellation Requested"
  | "Cancelled";

export interface BookingRecord {
  reference: string;
  client: string;
  email: string;
  phone: string;
  projectType: string;
  details: string;
  submittedAt: string; // ISO
  schedule?: string;
  status: BookingStatus;
  reschedule?: { date: string; time: string; notes: string; requestedAt: string };
  cancelledAt?: string;
}

const KEY = "igs.bookings.v1";

function read(): BookingRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BookingRecord[]) : [];
  } catch {
    return [];
  }
}

function write(list: BookingRecord[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore quota */
  }
}

export function generateReference(date = new Date()): string {
  const year = date.getFullYear();
  const num = Math.floor(1000 + Math.random() * 9000); // 4 digits
  return `IGS-${year}-${num}`;
}

export function saveBooking(input: Omit<BookingRecord, "reference" | "submittedAt" | "status"> & {
  reference?: string;
  status?: BookingStatus;
}): BookingRecord {
  const list = read();
  let reference = input.reference ?? generateReference();
  // Avoid collisions
  while (list.some((b) => b.reference === reference)) reference = generateReference();
  const record: BookingRecord = {
    reference,
    client: input.client,
    email: input.email,
    phone: input.phone,
    projectType: input.projectType,
    details: input.details,
    submittedAt: new Date().toISOString(),
    status: input.status ?? "Pending Confirmation",
  };
  list.push(record);
  write(list);
  return record;
}

function normalize(s: string) {
  return s.trim().toLowerCase().replace(/\s|-/g, "");
}

export function findBooking(reference: string, contact: string): BookingRecord | null {
  const ref = reference.trim().toUpperCase();
  const c = normalize(contact);
  const list = read();
  const match = list.find(
    (b) =>
      b.reference.toUpperCase() === ref &&
      (normalize(b.email) === c || normalize(b.phone) === c),
  );
  return match ?? null;
}

export function updateBooking(reference: string, patch: Partial<BookingRecord>): BookingRecord | null {
  const list = read();
  const idx = list.findIndex((b) => b.reference.toUpperCase() === reference.trim().toUpperCase());
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch };
  write(list);
  return list[idx];
}
