export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  category?: string;
  startDate?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  image?: string;
  rating?: number;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  /** Invio consentito solo se true (GDPR). */
  privacyAccepted?: boolean;
}

