import { Layout } from '@/components/layout/Layout';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryBar } from '@/components/home/CategoryBar';
import { FlashSale } from '@/components/home/FlashSale';
import { ProductGrid } from '@/components/products/ProductGrid';
import { products } from '@/data/mockData';

const Index = () => {
  const featuredProducts = products.filter(p => p.is_featured);
  const onSaleProducts = products.filter(p => p.is_on_sale);

  return (
    <Layout>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Category Navigation */}
      <CategoryBar />

      {/* Flash Sale Section */}
      <div className="border-t bg-secondary/30">
        <FlashSale products={onSaleProducts.slice(0, 6)} />
      </div>

      {/* Main Content */}
      <div className="container space-y-6 py-6">
        {/* Featured Products */}
        <ProductGrid products={featuredProducts} title="🔥 Produtos em Destaque" />

        {/* All Products */}
        <ProductGrid products={products} title="📦 Recomendados para Você" />
      </div>
    </Layout>
  );
};

export default Index;
