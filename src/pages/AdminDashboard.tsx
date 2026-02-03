import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { isAdmin, user } = useAuth();

  if (!isAdmin) {
    return (
      <Layout hideBottomNav>
        <div className="container flex min-h-[70vh] flex-col items-center justify-center gap-4 py-8">
          <h1 className="text-2xl font-bold">Acesso restrito</h1>
          <p className="max-w-md text-center text-muted-foreground">
            Este painel é exclusivo para administradores. Faça login com a conta de administrador
            para continuar.
          </p>
          <Link to="/login">
            <Button className="bg-gradient-primary">Ir para login</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideBottomNav>
      <div className="container space-y-6 py-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Painel Administrativo</h1>
            <p className="text-sm text-muted-foreground">
              Bem-vindo, {user?.name || user?.email}. Gerencie produtos, categorias e pedidos da sua loja.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Visualizar loja
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Vendas hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R$ 0,00</p>
              <p className="text-xs text-muted-foreground">Métrica demonstrativa</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pedidos abertos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">Integração com Supabase pode ser adicionada</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Produtos ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">Use este painel para gerenciar o catálogo</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Últimos pedidos (demo)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>#0001</TableCell>
                  <TableCell>Cliente Exemplo</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      Pago
                    </span>
                  </TableCell>
                  <TableCell className="text-right">R$ 199,90</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>#0002</TableCell>
                  <TableCell>Maria Souza</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Pendente
                    </span>
                  </TableCell>
                  <TableCell className="text-right">R$ 89,90</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

