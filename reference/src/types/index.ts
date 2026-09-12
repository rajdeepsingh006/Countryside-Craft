export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  itemCount?: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  detailedStory?: string;
  images: string[];
  video?: string;
  price: number;
  originalPrice?: number;
  discountPercent: number;
  stock: number;
  category: string; // Category slug or ID
  categoryName?: string;
  tags: string[]; // e.g. ["Hand Block Print", "Festive", "Organic Cotton", "100% Canvas", "Zipper Closure"]
  isFeatured: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  ratingAverage: number;
  ratingCount: number;
  dimensions?: string; // e.g. "16\" H x 14\" W x 4\" Gusset"
  material?: string; // e.g. "450 GSM Heavyweight Organic Cotton Canvas"
  handleLength?: string; // e.g. "11\" Drop Length (Reinforced Cross-Stitch)"
  closureType?: string; // e.g. "Antique Brass YKK Zip & Magnetic Snap"
  features?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  productId: string;
  productName?: string;
  customerName: string;
  customerLocation?: string;
  rating: number;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  customGiftNote?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  note?: string;
  giftWrap?: boolean;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedColor?: string;
}

export interface Order {
  _id: string;
  orderNumber: string; // e.g. "VANA-2026-0842"
  customer: CustomerInfo;
  items: OrderItemSnapshot[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  shippingNote: string;
  status: OrderStatus;
  whatsappMessageSent: boolean;
  sessionToken?: string;
  whatsappUrl?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AdminRole = 'main_admin' | 'admin';

export interface AdminUser {
  _id: string;
  name: string;
  username: string;
  email?: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin?: string;
  createdBy?: string;
  createdAt: string;
}

export interface GalleryItem {
  _id: string;
  title: string;
  category: 'workshops' | 'events' | 'behind-the-scenes' | 'custom-bulk';
  description: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  eventDate: string;
  location?: string;
  attendeesCount?: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  announcementBarText: string;
  announcementEnabled: boolean;
  whatsappNumber: string; // e.g. "919876543210"
  shippingNote: string;
  currencySymbol: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  instagramUrl: string;
  facebookUrl: string;
  pinterestUrl: string;
  freeShippingThreshold: number;
}
