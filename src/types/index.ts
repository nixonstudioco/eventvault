export type UserRole = 'user' | 'organizer' | 'admin'
export type EventType = 'wedding' | 'birthday' | 'baptism' | 'party' | 'corporate' | 'other'
export type EventStatus = 'active' | 'paused' | 'ended' | 'suspended'
export type MediaStatus = 'pending' | 'approved' | 'rejected'
export type FileType = 'image' | 'video'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'
export type GuestbookStatus = 'pending' | 'approved' | 'rejected'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  is_banned: boolean
  created_at: string
  updated_at: string
}

export interface Plan {
  id: string
  name: string
  slug: string
  description: string | null
  price_monthly: number
  stripe_price_id: string | null
  max_events: number
  max_storage_gb: number
  max_file_size_mb: number
  allow_video: boolean
  allow_custom_qr: boolean
  allow_live_gallery: boolean
  allow_guestbook: boolean
  allow_branding: boolean
  allow_bulk_download: boolean
  allow_email_notifications: boolean
  features: string[]
  is_active: boolean
  sort_order: number
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  status: SubscriptionStatus
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
  plan?: Plan
}

export interface Event {
  id: string
  organizer_id: string
  name: string
  slug: string
  type: EventType
  event_date: string | null
  location: string | null
  description: string | null
  cover_image_url: string | null
  status: EventStatus
  is_public: boolean
  allow_anonymous_upload: boolean
  require_account_upload: boolean
  allow_guest_download: boolean
  auto_approve: boolean
  storage_used_bytes: number
  total_uploads: number
  approved_uploads: number
  rejected_uploads: number
  pending_uploads: number
  created_at: string
  updated_at: string
  organizer?: Profile
  qr_code?: EventQRCode
}

export interface EventQRCode {
  id: string
  event_id: string
  template: string
  title: string | null
  subtitle: string | null
  bg_color: string
  accent_color: string
  text_color: string
  logo_url: string | null
  custom_image_url: string | null
  qr_position: string
  generated_png_url: string | null
  created_at: string
  updated_at: string
}

export interface MediaUpload {
  id: string
  event_id: string
  uploader_id: string | null
  uploader_name: string | null
  uploader_email: string | null
  is_anonymous: boolean
  file_url: string
  thumbnail_url: string | null
  file_type: FileType
  file_name: string | null
  file_size: number | null
  mime_type: string | null
  status: MediaStatus
  storage_path: string | null
  approved_at: string | null
  rejected_at: string | null
  approved_by: string | null
  rejection_reason: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
  uploader?: Profile
}

export interface GuestbookMessage {
  id: string
  event_id: string
  author_id: string | null
  author_name: string | null
  author_email: string | null
  is_anonymous: boolean
  message: string
  status: GuestbookStatus
  created_at: string
  author?: Profile
}

export interface Notification {
  id: string
  user_id: string
  event_id: string | null
  type: string
  title: string
  message: string | null
  is_read: boolean
  created_at: string
}

export interface DashboardStats {
  totalEvents: number
  activeEvents: number
  totalUploads: number
  pendingUploads: number
  approvedUploads: number
  rejectedUploads: number
  storageUsedBytes: number
  storageUsedGB: number
  totalParticipants: number
}

export type QRTemplate = 'default' | 'wedding' | 'birthday' | 'baptism' | 'party' | 'corporate'
