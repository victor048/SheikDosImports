import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { useWishlist } from '@/contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const Favorites = () => {
  const { items, clear, toggleItem } = useWishlist();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const hasItems = items.length > 0;
  const hasSelected = selectedIds.length > 0;

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
    );
  };

  const handleRemoveSelected = () => {
    if (!hasSelected) return;
    items
      .filter((product) => selectedIds.includes(product.id))
      .forEach((product) => toggleItem(product));
    setSelectedIds([]);
  };

  const handleClearAll = () => {
    if (!hasItems) return;
    clear();
    setSelectedIds([]);
  };

  return (
    <Layout>
      <div className="container py-4 md:py-8 space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Meus Favoritos</h1>
            <p className="text-sm text-muted-foreground">
              Veja os produtos que você salvou para comprar depois.
            </p>
          </div>

          {hasItems && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveSelected}
                disabled={!hasSelected}
              >
                Remover selecionados
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClearAll}>
                Remover todos
              </Button>
            </div>
          )}
        </div>

        {!hasItems ? (
          <p className="text-muted-foreground">
            Você ainda não adicionou nenhum produto aos favoritos.
          </p>
        ) : (
          <section className="py-2">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {items.map((product) => {
                const checked = selectedIds.includes(product.id);
                return (
                  <div key={product.id} className="relative">
                    <div className="absolute left-2 top-2 z-10 rounded bg-background/80 p-1 shadow-sm">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleSelected(product.id)}
                        aria-label={`Selecionar ${product.name}`}
                      />
                    </div>
                    <ProductCard product={product} className="pt-4" />
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Favorites;

