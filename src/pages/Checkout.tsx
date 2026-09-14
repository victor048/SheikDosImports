import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShoppingBag, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';

const WHATSAPP_NUMBER = '5511917567489';

function buildWhatsAppUrl(
  items: ReturnType<typeof import('@/contexts/CartContext')['useCart']>['items'],
  totalPrice: number,
  address: {
    name: string;
    phone: string;
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
  },
): string {
  const pixDiscount = totalPrice * 0.1;
  const finalPrice = totalPrice - pixDiscount;

  let msg = '*Pedido - Sheik dos Imports*\n\n';
  msg += '*Produtos:*\n';
  items.forEach((item) => {
    const price = (item.product.price * item.quantity).toFixed(2).replace('.', ',');
    const imgUrl = item.product.images[0]?.url;
    msg += `- ${item.product.name} (x${item.quantity}) - R$ ${price}\n`;
    if (imgUrl) msg += `  ${imgUrl}\n`;
  });
  msg += `\n*Subtotal:* R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
  msg += `\n*Desconto PIX (10%):* -R$ ${pixDiscount.toFixed(2).replace('.', ',')}`;
  msg += `\n*Total:* R$ ${finalPrice.toFixed(2).replace('.', ',')}`;
  msg += '\n\n*Dados de Entrega:*';
  msg += `\nNome: ${address.name}`;
  msg += `\nTelefone: ${address.phone}`;
  msg += `\nEndereco: ${address.street}, ${address.number}${address.complement ? ' - ' + address.complement : ''}`;
  msg += `\nBairro: ${address.neighborhood}`;
  msg += `\nCidade: ${address.city}`;
  msg += `\nCEP: ${address.cep}`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

const Checkout = () => {
  const { items, totalPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const pixDiscount = totalPrice * 0.1;
  const finalPrice = totalPrice - pixDiscount;

  if (items.length === 0) {
    return (
      <Layout hideBottomNav>
        <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-12">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-xl font-bold">Carrinho vazio</h2>
          <p className="text-muted-foreground">Adicione produtos para continuar</p>
          <Link to="/">
            <Button>Ver Produtos</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    const form = e.target as HTMLFormElement;
    const getValue = (id: string) => (form.querySelector(`#${id}`) as HTMLInputElement)?.value || '';

    const address = {
      name: getValue('name'),
      phone: getValue('phone'),
      cep: getValue('cep'),
      street: getValue('street'),
      number: getValue('number'),
      complement: getValue('complement'),
      neighborhood: getValue('neighborhood'),
      city: getValue('city'),
    };

    const url = buildWhatsAppUrl(items, totalPrice, address);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsProcessing(false);
  };

  return (
    <Layout hideBottomNav>
      <div className="container py-4 md:py-8">
        <h1 className="mb-6 text-xl font-bold md:text-2xl">Finalizar Compra</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border bg-card p-4 md:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">Endereco de Entrega</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input id="name" placeholder="Seu nome" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" type="tel" placeholder="(00) 00000-0000" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input id="cep" placeholder="00000-000" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street">Rua</Label>
                    <Input id="street" placeholder="Nome da rua" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number">Numero</Label>
                    <Input id="number" placeholder="123" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input id="complement" placeholder="Apto, bloco..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input id="neighborhood" placeholder="Seu bairro" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" placeholder="Sua cidade" required />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-20 h-fit">
              <div className="rounded-xl border bg-card p-4 md:p-6">
                <h2 className="mb-4 font-semibold">Resumo do Pedido</h2>

                <div className="mb-4 max-h-48 space-y-3 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]?.url}
                        alt={item.product.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">
                        R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="text-success font-medium">Gratis</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Desconto PIX (10%)</span>
                    <span className="text-success font-medium">
                      -R$ {pixDiscount.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="text-xl font-bold text-primary">
                        R$ {finalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="mt-6 w-full bg-gradient-primary"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    'Finalizar Pedido via WhatsApp'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
