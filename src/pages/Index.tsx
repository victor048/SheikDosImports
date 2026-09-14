import { Layout } from '@/components/layout/Layout';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryBar } from '@/components/home/CategoryBar';
import { FlashSale } from '@/components/home/FlashSale';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useProducts } from '@/hooks/useProducts';

const Index = () => {
  const { data: products = [], isLoading } = useProducts();
  const featuredProducts = products.filter(p => p.is_featured);
  const onSaleProducts = products.filter(p => p.is_on_sale);

  return (
    <Layout>
      <HeroBanner />
      <CategoryBar />

      <div className="border-t bg-secondary/30">
        <FlashSale products={onSaleProducts.slice(0, 6)} />
      </div>

      <div className="container space-y-6 py-6">
        {featuredProducts.length > 0 && (
          <ProductGrid products={featuredProducts} title="Produtos em Destaque" />
        )}

        {isLoading && (
          <div className="py-8 text-center text-muted-foreground">Carregando produtos...</div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
