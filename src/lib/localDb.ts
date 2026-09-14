import type { CategoryWithSubcategories } from '@/hooks/useCategories';

const PRODUCTS_KEY = 'shopflow_products';
const CATEGORIES_KEY = 'shopflow_categories';
const IMAGES_KEY = 'shopflow_product_images';
const VARIATIONS_KEY = 'shopflow_product_variations';
const OPTIONS_KEY = 'shopflow_variation_options';
const ORDERS_KEY = 'shopflow_orders';

function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function getFromStorage<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export interface LocalProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category_id: string | null;
  brand: string | null;
  stock: number;
  is_featured: boolean | null;
  is_on_sale: boolean | null;
  is_active: boolean | null;
  rating: number | null;
  reviews_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface LocalProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  position: number | null;
}

export interface LocalProductVariation {
  id: string;
  product_id: string;
  name: string;
  type: string;
}

export interface LocalVariationOption {
  id: string;
  variation_id: string;
  value: string;
  color_hex: string | null;
  price_modifier: number | null;
  stock: number | null;
}

export interface LocalCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  parent_id: string | null;
}

export function getAllProducts(): LocalProduct[] {
  return getFromStorage<LocalProduct>(PRODUCTS_KEY);
}

export function getProductById(id: string): LocalProduct | undefined {
  return getAllProducts().find((p) => p.id === id);
}

export function getProductBySlug(slug: string): LocalProduct | undefined {
  return getAllProducts().find((p) => p.slug === slug);
}

export function searchProducts(query?: string): LocalProduct[] {
  let products = getAllProducts();
  if (query) {
    const lower = query.toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(lower) || (p.description && p.description.toLowerCase().includes(lower))
    );
  }
  return products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function createProduct(data: Omit<LocalProduct, 'id' | 'created_at' | 'updated_at'>): LocalProduct {
  const products = getAllProducts();
  const now = new Date().toISOString();
  const product: LocalProduct = {
    ...data,
    id: generateId(),
    created_at: now,
    updated_at: now,
  };
  products.push(product);
  setToStorage(PRODUCTS_KEY, products);
  return product;
}

export function updateProduct(id: string, data: Partial<Omit<LocalProduct, 'id' | 'created_at'>>): LocalProduct {
  const products = getAllProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Produto nao encontrado');
  products[index] = { ...products[index], ...data, updated_at: new Date().toISOString() };
  setToStorage(PRODUCTS_KEY, products);
  return products[index];
}

export function deleteProduct(id: string): void {
  const products = getAllProducts().filter((p) => p.id !== id);
  setToStorage(PRODUCTS_KEY, products);

  const images = getProductImages(id);
  images.forEach((img) => deleteProductImage(img.id));

  const variations = getProductVariations(id);
  variations.forEach((v) => {
    const options = getVariationOptions(v.id);
    options.forEach((opt) => deleteVariationOption(opt.id));
    deleteProductVariation(v.id);
  });
}

export function getProductImages(productId: string): LocalProductImage[] {
  return getFromStorage<LocalProductImage>(IMAGES_KEY).filter((img) => img.product_id === productId);
}

export function createProductImage(data: Omit<LocalProductImage, 'id'>): LocalProductImage {
  const images = getFromStorage<LocalProductImage>(IMAGES_KEY);
  const image: LocalProductImage = { ...data, id: generateId() };
  images.push(image);
  setToStorage(IMAGES_KEY, images);
  return image;
}

export function deleteProductImage(id: string): void {
  const images = getFromStorage<LocalProductImage>(IMAGES_KEY).filter((img) => img.id !== id);
  setToStorage(IMAGES_KEY, images);
}

export function getProductVariations(productId: string): LocalProductVariation[] {
  return getFromStorage<LocalProductVariation>(VARIATIONS_KEY).filter((v) => v.product_id === productId);
}

export function createProductVariation(data: Omit<LocalProductVariation, 'id'>): LocalProductVariation {
  const variations = getFromStorage<LocalProductVariation>(VARIATIONS_KEY);
  const variation: LocalProductVariation = { ...data, id: generateId() };
  variations.push(variation);
  setToStorage(VARIATIONS_KEY, variations);
  return variation;
}

export function deleteProductVariation(id: string): void {
  const variations = getFromStorage<LocalProductVariation>(VARIATIONS_KEY).filter((v) => v.id !== id);
  setToStorage(VARIATIONS_KEY, variations);
}

export function getVariationOptions(variationId: string): LocalVariationOption[] {
  return getFromStorage<LocalVariationOption>(OPTIONS_KEY).filter((opt) => opt.variation_id === variationId);
}

export function createVariationOption(data: Omit<LocalVariationOption, 'id'>): LocalVariationOption {
  const options = getFromStorage<LocalVariationOption>(OPTIONS_KEY);
  const option: LocalVariationOption = { ...data, id: generateId() };
  options.push(option);
  setToStorage(OPTIONS_KEY, options);
  return option;
}

export function deleteVariationOption(id: string): void {
  const options = getFromStorage<LocalVariationOption>(OPTIONS_KEY).filter((opt) => opt.id !== id);
  setToStorage(OPTIONS_KEY, options);
}

export function getAllCategories(): LocalCategory[] {
  return getFromStorage<LocalCategory>(CATEGORIES_KEY);
}

export function createCategory(data: Omit<LocalCategory, 'id'>): LocalCategory {
  const categories = getAllCategories();
  const category: LocalCategory = { ...data, id: generateId() };
  categories.push(category);
  setToStorage(CATEGORIES_KEY, categories);
  return category;
}

export function deleteCategory(id: string): void {
  const categories = getAllCategories().filter((c) => c.id !== id && c.parent_id !== id);
  setToStorage(CATEGORIES_KEY, categories);
}

export function getAllBrands(): string[] {
  const products = getAllProducts();
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))] as string[];
  return brands.sort();
}

export function getProductWithRelations(productId: string) {
  const product = getProductById(productId);
  if (!product) return null;

  const images = getProductImages(productId);
  const variations = getProductVariations(productId).map((v) => ({
    ...v,
    options: getVariationOptions(v.id),
  }));

  return { ...product, images, variations };
}

export function getProductWithRelationsBySlug(slug: string) {
  const product = getProductBySlug(slug);
  if (!product) return null;

  const images = getProductImages(product.id);
  const variations = getProductVariations(product.id).map((v) => ({
    ...v,
    options: getVariationOptions(v.id),
  }));

  return { ...product, images, variations };
}

export function getAllProductsWithRelations(): (LocalProduct & { images: LocalProductImage[]; variations: (LocalProductVariation & { options: LocalVariationOption[] })[] })[] {
  return getAllProducts().map((product) => {
    const images = getProductImages(product.id);
    const variations = getProductVariations(product.id).map((v) => ({
      ...v,
      options: getVariationOptions(v.id),
    }));
    return { ...product, images, variations };
  });
}

export function getAllCategoriesWithSubcategories(): CategoryWithSubcategories[] {
  const categories = getAllCategories();
  const parentCategories = categories.filter((c) => !c.parent_id);
  const subCategories = categories.filter((c) => c.parent_id);

  return parentCategories.map((parent) => ({
    ...parent,
    subcategories: subCategories.filter((sub) => sub.parent_id === parent.id),
  }));
}

export type OrderStatus = 'a-pagar' | 'preparando' | 'a-caminho' | 'historico';

export interface LocalOrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string | null;
  quantity: number;
  selected_variations?: Record<string, string>;
}

export interface LocalOrder {
  id: string;
  items: LocalOrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  payment_method: 'pix';
  status: OrderStatus;
  shipping_address: {
    name: string;
    phone: string;
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
  };
  created_at: string;
  updated_at: string;
}

export function getAllOrders(): LocalOrder[] {
  return getFromStorage<LocalOrder>(ORDERS_KEY).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getOrdersByStatus(status: OrderStatus): LocalOrder[] {
  return getAllOrders().filter((o) => o.status === status);
}

export function getOrderById(id: string): LocalOrder | undefined {
  return getAllOrders().find((o) => o.id === id);
}

export function createOrder(data: Omit<LocalOrder, 'id' | 'created_at' | 'updated_at'>): LocalOrder {
  const orders = getFromStorage<LocalOrder>(ORDERS_KEY);
  const now = new Date().toISOString();
  const order: LocalOrder = {
    ...data,
    id: generateId(),
    created_at: now,
    updated_at: now,
  };
  orders.push(order);
  setToStorage(ORDERS_KEY, orders);
  return order;
}

export function updateOrderStatus(id: string, status: OrderStatus): LocalOrder {
  const orders = getFromStorage<LocalOrder>(ORDERS_KEY);
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) throw new Error('Pedido nao encontrado');
  orders[index] = { ...orders[index], status, updated_at: new Date().toISOString() };
  setToStorage(ORDERS_KEY, orders);
  return orders[index];
}
