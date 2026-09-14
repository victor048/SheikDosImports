import { Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

const menuItems = [
  { icon: Heart, label: 'Lista de Desejos', to: '/favoritos' },
];

const Account = () => {
  return (
    <Layout>
      <div className="container py-4 md:py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Minha Conta</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seus pedidos e favoritos.
          </p>
        </div>

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
      </div>
    </Layout>
  );
};

export default Account;
