import { User, Package, Heart, MapPin, LogOut, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { icon: Package, label: 'Meus Pedidos', to: '/pedidos' },
  { icon: Heart, label: 'Lista de Desejos', to: '/favoritos' },
  { icon: MapPin, label: 'Endereços', to: '/enderecos' },
  { icon: User, label: 'Dados da Conta', to: '/dados' },
];

const Account = () => {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-12">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl">?</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">Faça login para continuar</h2>
          <p className="text-center text-muted-foreground">
            Acesse sua conta para ver seus pedidos e favoritos
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-gradient-primary">
              Entrar na Conta
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground">
            Para acessar o painel administrativo, use o e-mail <span className="font-mono font-semibold">admin@Lacerda Express.com</span>.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-4 md:py-8">
        {/* Profile Header */}
        <div className="mb-6 flex items-center gap-4 rounded-xl bg-gradient-primary p-4 text-primary-foreground">
          <Avatar className="h-16 w-16 border-2 border-white/20">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" />
            <AvatarFallback>{user?.name?.[0] ?? user?.email?.[0] ?? '?'}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-bold">{user?.name ?? 'Cliente Lacerda Express'}</h1>
            <p className="text-sm opacity-90">{user?.email}</p>
            {isAdmin && (
              <Link
                to="/admin"
                className="mt-1 inline-flex items-center text-xs font-medium underline-offset-2 hover:underline"
              >
                Acessar painel administrativo
              </Link>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map(({ icon: Icon, label, to }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center justify-between rounded-xl border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">{label}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          ))}
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="mt-6 w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair da Conta
        </Button>
      </div>
    </Layout>
  );
};

export default Account;
