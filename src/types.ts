export type EventType = 'WEDDING' | 'BIRTHDAY' | 'BABY_SHOWER' | 'CORPORATE' | 'OTHER';

export type EventStatus = 'DRAFT' | 'PUBLISHED';

export type GiftType = 'PHYSICAL_ITEM' | 'CASH_CONTRIBUTION' | 'FREE_PIX';

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Event {
  id: string;
  ownerId: string;
  slug: string;
  title: string;
  eventType: EventType;
  status: EventStatus;
  eventDate: string;
  venueName: string;
  venueAddress: string;
  createdAt: string;
  themeConfig?: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor?: string;
    layoutTheme?: 'classic' | 'modern' | 'neon' | 'pastel';
    fontTitle?: string;
    fontBody?: string;
    welcomeText?: string;
    backgroundImageUrl?: string;
    showCountdown?: boolean;
    showMural?: boolean;
    showGallery?: boolean;
    schedule?: Array<{ id: string; time: string; activity: string }>;
    
    // Website Builder Additions
    headerStyle?: 'classic_hero' | 'split_hero' | 'minimalist';
    cardStyle?: 'glass' | 'solid' | 'frosted';
    borderStyle?: 'rounded' | 'sharp' | 'pill';
    bgPattern?: 'none' | 'dots' | 'leaves' | 'swirls';
    
    showStory?: boolean;
    storyTitle?: string;
    storyText?: string;
    storyTimeline?: Array<{ id: string; year: string; title: string; desc: string }>;
    
    rsvpHeading?: string;
    rsvpIntro?: string;
    giftsHeading?: string;
    giftsIntro?: string;
    muralHeading?: string;
    muralIntro?: string;
    galleryHeading?: string;
    galleryIntro?: string;
    sectionOrder?: string[];
  };
}

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  inviteToken: string;
  guestGroup?: string;
}

export interface Rsvp {
  id: string;
  guestId: string;
  confirmed: boolean;
  adultsCount: number;
  childrenCount: number;
  dietaryRestriction?: string;
  respondedAt: string;
}

export interface Gift {
  id: string;
  eventId: string;
  name: string;
  description: string;
  photoUrl: string;
  suggestedAmount?: number;
  giftType: GiftType;
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface GiftContribution {
  id: string;
  giftId: string;
  guestName?: string;
  amount: number;
  message?: string;
  paymentStatus: PaymentStatus;
  externalPaymentId?: string;
  createdAt: string;
}

export interface GuestMessage {
  id: string;
  eventId: string;
  guestName?: string;
  message: string;
  createdAt: string;
  approved: boolean;
}

export interface GalleryPhoto {
  id: string;
  eventId: string;
  url: string;
  guestName?: string;
  createdAt: string;
  approved: boolean;
}
