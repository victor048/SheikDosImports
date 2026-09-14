import { useState } from 'react';
import { Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProducts } from '@/hooks/useProducts';
import { useCategories, useBrands } from '@/hooks/useCategories';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState('relevance');

  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();

  const filteredProducts = products.filter(product => {
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(query.toLowerCase()));
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
    
    return matchesQuery && matchesPrice && matchesCategory && matchesBrand;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setQuery('');
    setPriceRange([0, 3000]);
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSortBy('relevance');
  };

  const hasFilters = query || priceRange[0] > 0 || priceRange[1] < 3000 || 
    selectedCategory !== 'all' || selectedBrand !== 'all';

  return (
    <Layout>
      <div className="container py-4">
        {/* Search Bar */}
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar produtos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filters Sheet - Mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Marca</Label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as marcas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as marcas</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Faixa de Preco</Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={3000}
                    step={50}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>R$ {priceRange[0]}</span>
                    <span>R$ {priceRange[1]}</span>
                  </div>
                </div>

                {hasFilters && (
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    <X className="mr-2 h-4 w-4" />
                    Limpar Filtros
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Filters & Sort */}
        <div className="mb-6 hidden md:flex md:items-center md:gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 flex-1">
            <Label className="whitespace-nowrap text-sm">Preco:</Label>
            <div className="w-48">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={3000}
                step={50}
              />
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              R$ {priceRange[0]} - R$ {priceRange[1]}
            </span>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevancia</SelectItem>
              <SelectItem value="price_asc">Menor Preco</SelectItem>
              <SelectItem value="price_desc">Maior Preco</SelectItem>
              <SelectItem value="rating">Avaliacao</SelectItem>
              <SelectItem value="newest">Mais Recentes</SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-1 h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Carregando...' : `${sortedProducts.length} produto${sortedProducts.length !== 1 && 's'} encontrado${sortedProducts.length !== 1 && 's'}`}
          </p>
          
          {/* Mobile Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-36 md:hidden">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevancia</SelectItem>
              <SelectItem value="price_asc">Menor Preco</SelectItem>
              <SelectItem value="price_desc">Maior Preco</SelectItem>
              <SelectItem value="rating">Avaliacao</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <p className="text-muted-foreground">Carregando produtos...</p>
          </div>
        ) : sortedProducts.length > 0 ? (
          <ProductGrid products={sortedProducts} />
        ) : (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <div className="rounded-full bg-secondary p-6">
              <SearchIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold">Nenhum produto encontrado</h2>
            <p className="text-center text-muted-foreground">
              Tente ajustar os filtros ou buscar por outros termos
            </p>
            <Button onClick={clearFilters}>Limpar Filtros</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
