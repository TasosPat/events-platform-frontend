export interface Event {
    event_id: number;
    title: string;
    description: string;
    date: string; // ISO format (YYYY-MM-DD)
    location: string;
    price?: number; // optional, since some events are free
  }