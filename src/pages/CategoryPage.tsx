import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = products.filter((p) => p.category_id === category?.id);

  return (
    <Layout>
      <div className="container py-4 md:py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold md:text-2xl">
              {category?.icon} {category?.name || 'Categoria'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {categoryProducts.length} produto{categoryProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Carregando...</div>
        ) : categoryProducts.length > 0 ? (
          <ProductGrid products={categoryProducts} />
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            Nenhum produto nesta categoria.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
