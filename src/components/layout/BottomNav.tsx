import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Grid3X3, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Início' },
  { to: '/buscar', icon: Search, label: 'Buscar' },
  { to: '/categorias', icon: Grid3X3, label: 'Categorias' },
  { to: '/carrinho', icon: ShoppingCart, label: 'Carrinho' },
  { to: '/conta', icon: User, label: 'Conta' },
];

export function BottomNav() {
  const location = useLocation();
  const { totalItems } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card pb-safe md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          const isCart = to === '/carrinho';

          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <div className="relative">
                <Icon className={cn('h-5 w-5', isActive && 'stroke-[2.5px]')} />
                {isCart && totalItems > 0 && (
                  <Badge className="absolute -right-2.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive p-0 text-[10px] font-bold">
                    {totalItems > 9 ? '9+' : totalItems}
                  </Badge>
                )}
              </div>
              <span className={cn('text-[10px]', isActive && 'font-semibold')}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
