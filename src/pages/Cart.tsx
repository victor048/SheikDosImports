import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-12">
          <div className="rounded-full bg-secondary p-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold">Seu carrinho está vazio</h2>
          <p className="text-center text-muted-foreground">
            Adicione produtos para continuar comprando
          </p>
          <Link to="/">
            <Button size="lg">Ver Produtos</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-4 md:py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold md:text-2xl">
            Meu Carrinho ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
          </h1>
          <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive">
            Limpar carrinho
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-xl border bg-card p-4 shadow-sm"
              >
                {/* Image */}
                <Link to={`/produto/${item.product.slug}`} className="flex-shrink-0">
                  <img
                    src={item.product.images[0]?.url}
                    alt={item.product.name}
                    className="h-24 w-24 rounded-lg object-cover md:h-32 md:w-32"
                  />
                </Link>

                {/* Info */}
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        to={`/produto/${item.product.slug}`}
                        className="font-medium text-foreground hover:text-primary line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      {item.selected_variations && Object.keys(item.selected_variations).length > 0 && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {Object.values(item.selected_variations).join(' / ')}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-2">
                    {/* Quantity */}
                    <div className="flex items-center rounded-lg border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <span className="text-lg font-bold text-primary">
                        R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground">
                          R$ {item.product.price.toFixed(2).replace('.', ',')} cada
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">Resumo do Pedido</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({totalItems} itens)</span>
                  <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-success font-medium">Grátis</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="text-xl font-bold text-primary">
                      R$ {totalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <p className="mt-1 text-right text-xs text-muted-foreground">
                    ou 12x de R$ {(totalPrice / 12).toFixed(2).replace('.', ',')} sem juros
                  </p>
                  <p className="mt-1 text-right text-sm text-success font-medium">
                    R$ {(totalPrice * 0.9).toFixed(2).replace('.', ',')} no PIX
                  </p>
                </div>
              </div>

              <Link to="/checkout" className="mt-6 block">
                <Button size="lg" className="w-full bg-gradient-primary hover:opacity-90">
                  Finalizar Compra
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link to="/" className="mt-3 block">
                <Button variant="outline" size="lg" className="w-full">
                  Continuar Comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
