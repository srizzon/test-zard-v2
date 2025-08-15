export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  images: string[];
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  colors: string[];
  sizes: string[];
  tags: string[];
  specifications?: { [key: string]: string };
  features?: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
  inStock: boolean;
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  description: string;
  estimatedDays: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
  verified: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingOption: ShippingOption;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  estimatedDelivery?: Date;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedDate: Date;
}