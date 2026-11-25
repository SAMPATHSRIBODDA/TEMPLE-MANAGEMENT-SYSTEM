export type TicketStatus = 'VALID' | 'USED' | 'EXPIRED';

export interface Ticket {
  id: string;
  type: string; // 'Darshan', 'Pooja', 'Prasadam'
  title: string;
  date: string;
  time: string;
  persons: number;
  qrPayload: string;
  status: TicketStatus;
  bookingRef: string;
  gate?: string;
  amount: number;
}
