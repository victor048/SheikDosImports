import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingBag, CreditCard, QrCode, ChevronRight } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import type { OrderStatus, LocalOrder } from '@/lib/localDb';

type OrdersTab = 'a-pagar' | 'preparando' | 'a-caminho' | 'historico';

const TABS: Array<{ value: OrdersTab; label: string }> = [
  { value: 'a-pagar', label: 'A pagar' },
  { value: 'preparando', label: 'Preparando' },
  { value: 'a-caminho', label: 'A caminho' },
  { value: 'historico', label: 'Historico' },
];

const STATUS_LABELS: Record<OrderStatus, string> = {
  'a-pagar': 'Aguardando pagamento',
  'preparando': 'Em preparacao',
  'a-caminho': 'Em transito',
  'historico': 'Entregue',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  'a-pagar': 'bg-yellow-100 text-yellow-700',
  'preparando': 'bg-blue-100 text-blue-700',
  'a-caminho': 'bg-orange-100 text-orange-700',
  'historico': 'bg-green-100 text-green-700',
};

function getTabFromSearchParam(v: string | null): OrdersTab {
  if (v === 'a-pagar' || v === 'preparando' || v === 'a-caminho' || v === 'historico') return v;
  return 'a-pagar';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function OrderCard({ order }: { order: LocalOrder }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Pedido</p>
            <p className="font-mono text-sm font-medium">{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <Badge className={STATUS_COLORS[order.status]}>
            {STATUS_LABELS[order.status]}
          </Badge>
        </div>

        <div className="space-y-2 mb-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              {item.product_image ? (
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="h-10 w-10 rounded-md object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{item.product_name}</p>
                <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
              </div>
              <span className="text-sm font-medium">
                R$ {(item.product_price * item.quantity).toFixed(2).replace('.', ',')}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t pt-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              {order.payment_method === 'pix' ? (
                <><QrCode className="h-3 w-3" /> PIX</>
              ) : (
                <><CreditCard className="h-3 w-3" /> Cartao</>
              )}
            </span>
            <span className="font-bold">Total: R$ {order.total.toFixed(2).replace('.', ',')}</span>
          </div>
          <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<OrdersTab>(() => getTabFromSearchParam(searchParams.get('status')));
  const { data: orders = [] } = useOrders(tab);

  useEffect(() => {
    const next = getTabFromSearchParam(searchParams.get('status'));
    setTab(next);
  }, [searchParams]);

  return (
    <Layout>
      <div className="container py-4 md:py-8 space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meus pedidos</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe o status dos seus pedidos.
          </p>
        </div>

        <Tabs
          value={tab}
          onValueChange={(v) => {
            const next = getTabFromSearchParam(v);
            setSearchParams((prev) => {
              const p = new URLSearchParams(prev);
              p.set('status', next);
              return p;
            });
          }}
        >
          <TabsList className="w-full justify-start overflow-x-auto">
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map((t) => (
            <TabsContent key={t.value} value={t.value} className="mt-4">
              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-secondary p-4 mb-4">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Nenhum pedido</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mb-4">
                      {t.value === 'a-pagar' && 'Voce nao tem pedidos aguardando pagamento.'}
                      {t.value === 'preparando' && 'Nenhum pedido em preparacao no momento.'}
                      {t.value === 'a-caminho' && 'Nenhum pedido em transito.'}
                      {t.value === 'historico' && 'Seu historico de pedidos esta vazio.'}
                    </p>
                    <Link to="/">
                      <Button variant="outline" size="sm">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Ver Produtos
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Orders;
