export interface Performance {
  id: string;
  title: string;
  genre: string;
  year: string;
  thumbnailUrl: string;
  videoUrl: string;
  views?: string;
  duration?: string;
}

export interface Short {
  id: string;
  title: string;
  thumbnailUrl: string;
  views: string;
}

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventDate: string;
  eventType: string;
  venue: string;
  message?: string;
  status: 'Pending' | 'Contacted' | 'Approved';
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
}
