export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  categoryName: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  description: string;
  weight: string;
  inStock: boolean;
  stockCount: number;
  isVeg: boolean;
  isBestseller?: boolean;
  isTrending?: boolean;
  isDeal?: boolean;
  image: string;
  tags: string[];
  ingredients: string[];
  nutrition: {
    calories: string;
    carbs: string;
    sugar: string;
    protein: string;
    fat: string;
  };
  reviews: Review[];
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  description: string;
  image: string;
  productCount?: number;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

export type OrderStatus =
  | 'Order Placed'
  | 'Order Confirmed'
  | 'Preparing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface TrackingStep {
  status: OrderStatus;
  timestamp: string;
  note: string;
  done: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  paymentMethod: 'cod' | 'upi' | 'card';
  paymentStatus: 'Paid' | 'Pending (COD)';
  address: Address;
  createdAt: string;
  estimatedDelivery: string;
  trackingTimeline: TrackingStep[];
  deliveryPerson?: {
    name: string;
    phone: string;
    vehicle: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'fixed' | 'percent';
  value: number;
  minOrder: number;
  description: string;
  expiry: string;
}
