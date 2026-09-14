import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, ProductFormData } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { ProductForm } from '@/components/admin/ProductForm';
import { DeleteProductDialog } from '@/components/admin/DeleteProductDialog';
import { Plus, Pencil, Trash2, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function AdminProducts() {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const { data: products, isLoading } = useProducts(search);
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return '-';
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? `${cat.icon || ''} ${cat.name}` : categoryId;
  };

  const handleCreate = (data: ProductFormData) => {
    createProduct.mutate(data, {
      onSuccess: () => {
        toast.success('Produto criado com sucesso!');
        setFormOpen(false);
      },
      onError: (error) => {
        toast.error('Erro ao criar produto: ' + error.message);
      },
    });
  };

  const handleUpdate = (data: ProductFormData) => {
    if (!editingProduct) return;
    updateProduct.mutate(
      { id: editingProduct.id, formData: data },
      {
        onSuccess: () => {
          toast.success('Produto atualizado com sucesso!');
          setFormOpen(false);
          setEditingProduct(null);
        },
        onError: (error) => {
          toast.error('Erro ao atualizar produto: ' + error.message);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!productToDelete) return;
    deleteProduct.mutate(productToDelete.id, {
      onSuccess: () => {
        toast.success('Produto excluido com sucesso!');
        setDeleteDialogOpen(false);
        setProductToDelete(null);
      },
      onError: (error) => {
        toast.error('Erro ao excluir produto: ' + error.message);
      },
    });
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const openDeleteDialog = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  return (
    <Layout hideBottomNav>
      <div className="container space-y-6 py-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
              <p className="text-sm text-muted-foreground">
                Gerencie o catalogo de produtos da sua loja.
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setEditingProduct(null);
              setFormOpen(true);
            }}
            className="bg-gradient-primary"
          >
            <Plus className="mr-2 h-4 w-4" /> Novo produto
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Lista de produtos</CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar produto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">Carregando...</div>
            ) : products && products.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Imagem</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead className="text-right">Preco</TableHead>
                      <TableHead className="text-right">Estoque</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Acoes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="h-12 w-12 rounded-md object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                              S/F
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-sm">{getCategoryName(product.category_id)}</TableCell>
                        <TableCell>{product.brand || '-'}</TableCell>
                        <TableCell className="text-right">{formatPrice(product.price)}</TableCell>
                        <TableCell className="text-right">{product.stock}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {product.is_active !== false ? (
                              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                                Ativo
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                Inativo
                              </Badge>
                            )}
                            {product.is_featured && (
                              <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                                Destaque
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditForm(product)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(product)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                {search ? 'Nenhum produto encontrado para essa busca.' : 'Nenhum produto cadastrado.'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={editingProduct ? handleUpdate : handleCreate}
        initialData={editingProduct}
        isLoading={createProduct.isPending || updateProduct.isPending}
      />

      <DeleteProductDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        productName={productToDelete?.name || ''}
        isLoading={deleteProduct.isPending}
      />
    </Layout>
  );
}
