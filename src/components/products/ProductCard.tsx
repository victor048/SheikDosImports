import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/types/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <Link
      to={`/produto/${product.slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-product transition-all duration-200 hover:shadow-lg',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {discount > 0 && (
            <Badge className="bg-gradient-sale text-destructive-foreground px-1.5 py-0.5 text-xs font-bold animate-pulse-sale">
              -{discount}%
            </Badge>
          )}
          {product.is_featured && (
            <Badge className="bg-primary text-primary-foreground px-1.5 py-0.5 text-xs">
              Destaque
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 text-muted-foreground opacity-0 backdrop-blur-sm transition-opacity hover:bg-white hover:text-destructive group-hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart className="h-4 w-4" />
        </Button>

        {/* Quick Add Button */}
        <Button
          size="sm"
          className="absolute bottom-2 left-1/2 -translate-x-1/2 translate-y-full opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-1 h-4 w-4" />
          Adicionar
        </Button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        {/* Brand */}
        {product.brand && (
          <span className="mb-0.5 text-xs text-muted-foreground">
            {product.brand}
          </span>
        )}

        {/* Name */}
        <h3 className="mb-2 line-clamp-2 text-sm font-medium leading-tight text-foreground transition-colors group-hover:text-primary">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mb-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">
            ({product.reviews_count})
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          {product.original_price && (
            <span className="block text-xs text-muted-foreground line-through">
              R$ {product.original_price.toFixed(2).replace('.', ',')}
            </span>
          )}
          <span className="text-lg font-bold text-primary">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          <span className="ml-1 text-xs text-muted-foreground">
            ou 12x de R$ {(product.price / 12).toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>
    </Link>
  );
}
