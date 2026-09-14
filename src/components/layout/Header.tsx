import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, User, Heart, X, ChevronLeft, PackagePlus, Lock, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCategories } from '@/hooks/useCategories';
import { toast } from 'sonner';

const ADMIN_PASSWORD = 'admin123';

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [pendingNavigate, setPendingNavigate] = useState('/admin/produtos');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    return localStorage.getItem('admin_access') === 'true';
  });
  const { totalItems } = useCart();
  const { totalFavorites } = useWishlist();
  const { data: categories = [] } = useCategories();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAdminUnlocked(true);
      localStorage.setItem('admin_access', 'true');
      setPasswordDialogOpen(false);
      navigate(pendingNavigate);
      toast.success('Acesso liberado!');
    } else {
      setPasswordError('Senha incorreta');
    }
  };

  const handleAdminClick = (target: string) => {
    if (isAdminUnlocked) {
      navigate(target);
    } else {
      setPendingNavigate(target);
      setPasswordDialogOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-primary shadow-md">
      <div className="container flex h-14 items-center justify-between gap-2 md:h-16">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Menu</TooltipContent>
            </Tooltip>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-14 items-center border-b px-4">
              <Link to="/" className="text-xl font-bold text-white">
                Sheik dos Imports
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

        {/* Back button + Logo */}
        <div className="flex items-center gap-1">
          {!isHome && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground"
                  onClick={() => navigate(-1)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Voltar</TooltipContent>
            </Tooltip>
          )}
          <Link to="/" className="flex items-center gap-1">
            <span className="text-xl font-extrabold tracking-tight text-white md:text-2xl">
              Sheik dos Imports
            </span>
          </Link>
        </div>

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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground md:hidden"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{searchOpen ? 'Fechar busca' : 'Buscar'}</TooltipContent>
          </Tooltip>

          {/* Painel Administrativo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground"
                onClick={() => handleAdminClick('/admin')}
              >
                <LayoutDashboard className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Painel Administrativo</TooltipContent>
          </Tooltip>

          {/* Cadastrar Produtos */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground"
                onClick={() => handleAdminClick('/admin/produtos')}
              >
                <PackagePlus className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Cadastrar Produtos</TooltipContent>
          </Tooltip>

          {/* Wishlist - Desktop */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/favoritos">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hidden text-primary-foreground md:flex"
                >
                  <Heart className="h-5 w-5" />
                  {totalFavorites > 0 && (
                    <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive p-0 text-[10px] font-bold text-destructive-foreground">
                      {totalFavorites > 9 ? '9+' : totalFavorites}
                    </Badge>
                  )}
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Favoritos</TooltipContent>
          </Tooltip>

          {/* Account */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/conta">
                <Button variant="ghost" size="icon" className="text-primary-foreground">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Minha Conta</TooltipContent>
          </Tooltip>

          {/* Cart */}
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent>Carrinho</TooltipContent>
          </Tooltip>
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

      {/* Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Acesso Restrito
            </DialogTitle>
            <DialogDescription>
              Digite a senha para acessar o painel de administracao.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Senha</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Digite a senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                autoFocus
              />
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
            </div>
            <Button type="submit" className="w-full bg-gradient-primary">
              Acessar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
}
