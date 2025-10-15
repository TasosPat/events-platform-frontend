export interface NewEvent {
    title: string;
    description: string;
    date: string; // ISO format (YYYY-MM-DD)
    location: string;
    price?: number; // optional, since some events are free
    start_time: string;
    end_time: string;
}

export interface Event extends NewEvent {
    event_id: number;
  }