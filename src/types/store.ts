export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  parent_id?: string;
  subcategories?: Category[];
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
}

export interface ProductVariation {
  id: string;
  name: string;
  type: 'color' | 'size' | 'other';
  options: VariationOption[];
}

export interface VariationOption {
  id: string;
  value: string;
  price_modifier?: number;
  stock?: number;
  color_hex?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  images: ProductImage[];
  category_id: string;
  category?: Category;
  brand?: string;
  rating: number;
  reviews_count: number;
  stock: number;
  variations?: ProductVariation[];
  is_featured?: boolean;
  is_on_sale?: boolean;
  created_at: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selected_variations?: Record<string, string>;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  images?: string[];
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  phone?: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'pix' | 'credit_card';
  shipping_address: ShippingAddress;
  created_at: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface SearchFilters {
  query?: string;
  category_id?: string;
  min_price?: number;
  max_price?: number;
  brand?: string;
  min_rating?: number;
  sort_by?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'best_seller';
}
