import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Heart, Share2, Minus, Plus, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { products } from '@/data/mockData';
import { cn } from '@/lib/utils';

const ProductDetail = () => {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);
  const { addItem } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});

  if (!product) {
    return (
      <Layout>
        <div className="container flex min-h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">Produto não encontrado</p>
        </div>
      </Layout>
    );
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariations);
  };

  return (
    <Layout>
      <div className="container py-4 md:py-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary/30">
              <img
                src={product.images[selectedImage]?.url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {discount > 0 && (
                <Badge className="absolute left-3 top-3 bg-gradient-sale text-destructive-foreground text-sm font-bold">
                  -{discount}% OFF
                </Badge>
              )}
            </div>
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      'h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                      selectedImage === idx ? 'border-primary' : 'border-transparent'
                    )}
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            {/* Brand */}
            {product.brand && (
              <span className="text-sm font-medium text-primary">{product.brand}</span>
            )}

            {/* Title */}
            <h1 className="text-xl font-bold text-foreground md:text-2xl lg:text-3xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < Math.round(product.rating)
                        ? 'fill-warning text-warning'
                        : 'fill-muted text-muted'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews_count} avaliações)
              </span>
              <span className="text-sm text-muted-foreground">|</span>
              <span className="text-sm text-muted-foreground">
                {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
              </span>
            </div>

            {/* Price */}
            <div className="rounded-lg bg-secondary/50 p-4">
              {product.original_price && (
                <span className="text-sm text-muted-foreground line-through">
                  R$ {product.original_price.toFixed(2).replace('.', ',')}
                </span>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary md:text-4xl">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                {discount > 0 && (
                  <Badge className="bg-destructive text-destructive-foreground">
                    {discount}% OFF
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                ou <strong>12x de R$ {(product.price / 12).toFixed(2).replace('.', ',')}</strong> sem juros
              </p>
              <p className="mt-1 text-sm text-success font-medium">
                R$ {(product.price * 0.9).toFixed(2).replace('.', ',')} no PIX (10% off)
              </p>
            </div>

            {/* Variations */}
            {product.variations?.map((variation) => (
              <div key={variation.id} className="space-y-2">
                <label className="text-sm font-medium">
                  {variation.name}: <span className="text-primary">{selectedVariations[variation.id] || 'Selecione'}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {variation.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedVariations(prev => ({ ...prev, [variation.id]: option.value }))}
                      className={cn(
                        'rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all',
                        selectedVariations[variation.id] === option.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      {variation.type === 'color' && option.color_hex && (
                        <span
                          className="mr-2 inline-block h-4 w-4 rounded-full border"
                          style={{ backgroundColor: option.color_hex }}
                        />
                      )}
                      {option.value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantidade</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.stock} disponíveis
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                size="lg"
                className="flex-1 bg-gradient-primary hover:opacity-90"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Adicionar ao Carrinho
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-2 pt-4">
              <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 p-3 text-center">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">Frete Grátis</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 p-3 text-center">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">Compra Segura</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-lg bg-secondary/50 p-3 text-center">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">7 dias devolução</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mt-8">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Descrição</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações ({product.reviews_count})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-4">
              {/* Sample reviews */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                      ))}
                    </div>
                    <span className="font-medium">Cliente Satisfeito</span>
                    <span className="text-sm text-muted-foreground">há {i} dias</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Produto excelente! Chegou antes do prazo e veio muito bem embalado. Recomendo!
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProductDetail;
