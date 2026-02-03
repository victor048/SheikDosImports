import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type OrdersTab = 'a-pagar' | 'preparando' | 'a-caminho' | 'historico';

const TABS: Array<{ value: OrdersTab; label: string }> = [
  { value: 'a-pagar', label: 'A pagar' },
  { value: 'preparando', label: 'Preparando' },
  { value: 'a-caminho', label: 'A caminho' },
  { value: 'historico', label: 'Histórico' },
];

type DemoOrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
type DemoOrder = {
  id: string;
  created_at: string;
  total: number;
  status: DemoOrderStatus;
};

const demoOrders: DemoOrder[] = [
  { id: '0001', created_at: '2026-02-03', total: 199.9, status: 'pending' },
  { id: '0002', created_at: '2026-02-02', total: 89.9, status: 'paid' },
  { id: '0003', created_at: '2026-02-01', total: 459.9, status: 'shipped' },
  { id: '0004', created_at: '2026-01-25', total: 129.9, status: 'delivered' },
];

function getTabFromSearchParam(v: string | null): OrdersTab {
  if (v === 'a-pagar' || v === 'preparando' || v === 'a-caminho' || v === 'historico') return v;
  return 'a-pagar';
}

function badgeForStatus(status: DemoOrderStatus) {
  switch (status) {
    case 'pending':
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pendente</Badge>;
    case 'paid':
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Pago</Badge>;
    case 'shipped':
      return <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100">Enviado</Badge>;
    case 'delivered':
      return <Badge className="bg-zinc-100 text-zinc-700 hover:bg-zinc-100">Entregue</Badge>;
    case 'cancelled':
      return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">Cancelado</Badge>;
    default:
      return <Badge variant="outline">—</Badge>;
  }
}

function ordersForTab(tab: OrdersTab, orders: DemoOrder[]) {
  if (tab === 'a-pagar') return orders.filter((o) => o.status === 'pending');
  if (tab === 'preparando') return orders.filter((o) => o.status === 'paid');
  if (tab === 'a-caminho') return orders.filter((o) => o.status === 'shipped');
  return orders.filter((o) => o.status === 'delivered' || o.status === 'cancelled');
}

const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<OrdersTab>(() => getTabFromSearchParam(searchParams.get('status')));

  useEffect(() => {
    const next = getTabFromSearchParam(searchParams.get('status'));
    setTab(next);
  }, [searchParams]);

  const orders = useMemo(() => ordersForTab(tab, demoOrders), [tab]);

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
              {orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum pedido encontrado nesta categoria.
                </p>
              ) : (
                <div className="grid gap-3">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between text-base">
                          <span>Pedido #{order.id}</span>
                          {badgeForStatus(order.status)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Data: {order.created_at}</span>
                        <span className="font-semibold">
                          R$ {order.total.toFixed(2).replace('.', ',')}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Orders;

