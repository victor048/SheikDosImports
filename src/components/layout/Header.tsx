import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu, User, Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { categories } from '@/data/mockData';

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-primary shadow-md">
      <div className="container flex h-14 items-center justify-between gap-2 md:h-16">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-primary-foreground md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-14 items-center border-b px-4">
              <Link to="/" className="text-xl font-bold text-primary">
                MegaShop
              </Link>
            </div>
            <nav className="p-4">
              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                Categorias
              </p>
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/categoria/${cat.slug}`}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-secondary"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-1">
          <span className="text-xl font-extrabold tracking-tight text-primary-foreground md:text-2xl">
            MegaShop
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden flex-1 max-w-xl mx-4 md:flex">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Buscar produtos, marcas e muito mais..."
              className="h-10 w-full rounded-full bg-white/95 pl-4 pr-12 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-white/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              size="icon"
              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-primary hover:bg-primary/90"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground md:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>

          {/* Wishlist - Desktop */}
          <Button variant="ghost" size="icon" className="hidden text-primary-foreground md:flex">
            <Heart className="h-5 w-5" />
          </Button>

          {/* Account */}
          <Link to="/login">
            <Button variant="ghost" size="icon" className="text-primary-foreground">
              <User className="h-5 w-5" />
            </Button>
          </Link>

          {/* Cart */}
          <Link to="/carrinho" className="relative">
            <Button variant="ghost" size="icon" className="text-primary-foreground">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive p-0 text-xs font-bold text-destructive-foreground animate-cart-bounce">
                  {totalItems > 99 ? '99+' : totalItems}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="border-t border-white/20 bg-gradient-primary p-3 md:hidden animate-slide-up">
          <div className="relative">
            <Input
              type="search"
              placeholder="Buscar produtos..."
              className="h-10 w-full rounded-full bg-white/95 pl-4 pr-12 text-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <Button
              size="icon"
              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-primary"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
