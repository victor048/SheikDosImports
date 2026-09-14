import * as localDb from './localDb';

const categories = [
  { id: 'cat-eletronicos', name: 'Eletronicos', slug: 'eletronicos', icon: '📱' },
  { id: 'cat-relogios', name: 'Relogios', slug: 'relogios', icon: '⌚' },
  { id: 'cat-perfumes', name: 'Perfumes', slug: 'perfumes', icon: '🧴' },
  { id: 'cat-acessorios', name: 'Acessorios', slug: 'acessorios', icon: '💍' },
  { id: 'cat-tenis', name: 'Tenis', slug: 'tenis', icon: '👟' },
];

const products = [
  {
    name: 'iPhone 15 Pro Max 256GB',
    slug: 'iphone-15-pro-max-256gb',
    description: 'iPhone 15 Pro Max com chip A17 Pro, camera de 48MP e tela Super Retina XDR de 6.7 polegadas. Importado Dubai.',
    price: 8499.90,
    original_price: 10999.90,
    category_id: 'cat-eletronicos',
    brand: 'Apple',
    stock: 15,
    is_featured: true,
    is_on_sale: true,
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600'],
  },
  {
    name: 'Galaxy S24 Ultra 512GB',
    slug: 'galaxy-s24-ultra-512gb',
    description: 'Samsung Galaxy S24 Ultra com S Pen, camera de 200MP e tela Dynamic AMOLED 2X. Edicao especial Dubai.',
    price: 7299.90,
    original_price: 8999.90,
    category_id: 'cat-eletronicos',
    brand: 'Samsung',
    stock: 12,
    is_featured: true,
    is_on_sale: true,
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600'],
  },
  {
    name: 'Rolex Submariner Date',
    slug: 'rolex-submariner-date',
    description: 'Relogio Rolex Submariner Date em aco inoxidavel 904L, movimento automatico Calibre 3235. Importado suico.',
    price: 45999.90,
    original_price: null,
    category_id: 'cat-relogios',
    brand: 'Rolex',
    stock: 3,
    is_featured: true,
    is_on_sale: false,
    images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600'],
  },
  {
    name: 'Apple Watch Ultra 2',
    slug: 'apple-watch-ultra-2',
    description: 'Apple Watch Ultra 2 com GPS + Cellular, caixa de titanio de 49mm e tela Always-On Retina.',
    price: 6499.90,
    original_price: 7499.90,
    category_id: 'cat-relogios',
    brand: 'Apple',
    stock: 8,
    is_featured: false,
    is_on_sale: true,
    images: ['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600'],
  },
  {
    name: 'Bleu de Chanel Parfum',
    slug: 'bleu-de-chanel-parfum',
    description: 'Bleu de Chanel Parfum 100ml - fragrancia masculina amadeirada aromatica. Importado Franca.',
    price: 899.90,
    original_price: 1199.90,
    category_id: 'cat-perfumes',
    brand: 'Chanel',
    stock: 25,
    is_featured: true,
    is_on_sale: true,
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=600'],
  },
  {
    name: 'Sauvage Elixir Dior',
    slug: 'sauvage-elixir-dior',
    description: 'Dior Sauvage Elixir 60ml - fragrancia intensa com notas de especiarias e lavanda. Importado Dubai.',
    price: 749.90,
    original_price: null,
    category_id: 'cat-perfumes',
    brand: 'Dior',
    stock: 18,
    is_featured: false,
    is_on_sale: false,
    images: ['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600'],
  },
  {
    name: 'AirPods Max',
    slug: 'airpods-max',
    description: 'Apple AirPods Max com cancelamento ativo de ruido, audio espacial e caixa de aco inoxidavel.',
    price: 4999.90,
    original_price: 5999.90,
    category_id: 'cat-eletronicos',
    brand: 'Apple',
    stock: 10,
    is_featured: true,
    is_on_sale: true,
    images: ['https://images.unsplash.com/photo-1625242661910-51cc240a3f79?w=600'],
  },
  {
    name: 'Nike Air Max 90 Premium',
    slug: 'nike-air-max-90-premium',
    description: 'Nike Air Max 90 Premium Edition em couro preto com detalhes dourados. Edicao limitada.',
    price: 1299.90,
    original_price: 1599.90,
    category_id: 'cat-tenis',
    brand: 'Nike',
    stock: 20,
    is_featured: false,
    is_on_sale: true,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
  },
  {
    name: 'Anel Dourado Masculino',
    slug: 'anel-dourado-masculino',
    description: 'Anel masculino em ouro 18k com design arabesco. Acessorio premium importado Dubai.',
    price: 2499.90,
    original_price: null,
    category_id: 'cat-acessorios',
    brand: 'Sheik Premium',
    stock: 5,
    is_featured: true,
    is_on_sale: false,
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600'],
  },
  {
    name: 'Ray-Ban Aviator Classic',
    slug: 'ray-ban-aviator-classic',
    description: 'Oculos Ray-Ban Aviator Classic com lentes verde espelhado e armação dourada. Importado EUA.',
    price: 899.90,
    original_price: 1199.90,
    category_id: 'cat-acessorios',
    brand: 'Ray-Ban',
    stock: 30,
    is_featured: false,
    is_on_sale: true,
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600'],
  },
];

export function seedDatabase() {
  const existingSlugs = new Set(localDb.getAllProducts().map((p) => p.slug));
  const existingCategories = localDb.getAllCategories();
  const existingCatSlugs = new Set(existingCategories.map((c) => c.slug));

  categories.forEach((cat) => {
    if (!existingCatSlugs.has(cat.slug)) {
      localDb.createCategory(cat);
    }
  });

  products.forEach((product) => {
    if (existingSlugs.has(product.slug)) return;

    const created = localDb.createProduct({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      original_price: product.original_price,
      category_id: product.category_id,
      brand: product.brand,
      stock: product.stock,
      is_featured: product.is_featured,
      is_on_sale: product.is_on_sale,
      is_active: true,
      rating: 4 + Math.random(),
      reviews_count: Math.floor(Math.random() * 50) + 5,
    });

    product.images.forEach((url, index) => {
      localDb.createProductImage({
        product_id: created.id,
        url,
        alt: product.name,
        position: index,
      });
    });
  });
}
