import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, QrCode, ChevronRight, MapPin, ShoppingBag } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { createPayment, type PaymentMethod } from '@/integrations/payments/gateway';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixQr, setPixQr] = useState<{ imageUrl: string; text?: string } | null>(null);

  const pixDiscount = totalPrice * 0.1;
  const finalPrice = paymentMethod === 'pix' ? totalPrice - pixDiscount : totalPrice;

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Se já geramos o QR Code PIX, este clique passa a ser a confirmação manual do pagamento
    if (paymentMethod === 'pix' && pixQr) {
      toast({
        title: 'Pedido realizado com sucesso! 🎉',
        description: 'Pagamento via PIX confirmado.',
      });
      clearCart();
      navigate('/');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await createPayment({
        amount: finalPrice,
        method: paymentMethod,
        currency: 'BRL',
      });

      if (result.type === 'pix_qr') {
        setPixQr({
          imageUrl: result.qrCodeImageUrl,
          text: result.qrCodeText,
        });
        toast({
          title: 'QR Code PIX gerado',
          description: 'Pague com o app do seu banco e depois clique em "Já paguei, concluir pedido".',
        });
        setIsProcessing(false);
        return;
      }

      if (result.type === 'redirect') {
        // Redireciona para o gateway (Stripe, Mercado Pago, etc)
        window.location.href = result.url;
        return;
      }

      if (result.type === 'error') {
        toast({
          title: 'Falha ao processar pagamento',
          description: result.message,
          variant: 'destructive',
        });
        setIsProcessing(false);
        return;
      }

      // Sucesso (mock ou confirmação imediata)
      toast({
        title: 'Pedido realizado com sucesso! 🎉',
        description:
          paymentMethod === 'pix'
            ? 'Pagamento via PIX confirmado.'
            : 'Pagamento aprovado! Seu pedido está sendo preparado.',
      });

      clearCart();
      setIsProcessing(false);
      navigate('/');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro inesperado',
        description: 'Não foi possível processar o pagamento. Tente novamente.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  return (
    <Layout hideBottomNav>
      <div className="container py-4 md:py-8">
        <h1 className="mb-6 text-xl font-bold md:text-2xl">Finalizar Compra</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="rounded-xl border bg-card p-4 md:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">Endereço de Entrega</h2>
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
                    <Label htmlFor="number">Número</Label>
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

              {/* Payment Method */}
              <div className="rounded-xl border bg-card p-4 md:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold">Forma de Pagamento</h2>
                </div>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <label
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all',
                      paymentMethod === 'pix' && 'border-primary bg-primary/5'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="pix" id="pix" />
                      <div className="flex items-center gap-2">
                        <QrCode className="h-5 w-5 text-[#32BCAD]" />
                        <div>
                          <p className="font-medium">PIX</p>
                          <p className="text-xs text-muted-foreground">Aprovação instantânea</p>
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-semibold text-success">
                      10% OFF
                    </span>
                  </label>

                  <label
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all',
                      paymentMethod === 'credit_card' && 'border-primary bg-primary/5'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Cartão de Crédito</p>
                          <p className="text-xs text-muted-foreground">Em até 12x sem juros</p>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </label>
                </RadioGroup>

                {/* Credit Card Fields */}
                {paymentMethod === 'credit_card' && (
                  <div className="mt-4 grid gap-4 border-t pt-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="card_number">Número do Cartão</Label>
                      <Input id="card_number" placeholder="0000 0000 0000 0000" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card_name">Nome no Cartão</Label>
                      <Input id="card_name" placeholder="Como está no cartão" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="card_expiry">Validade</Label>
                        <Input id="card_expiry" placeholder="MM/AA" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card_cvv">CVV</Label>
                        <Input id="card_cvv" placeholder="123" required />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-20 h-fit">
              <div className="rounded-xl border bg-card p-4 md:p-6">
                <h2 className="mb-4 font-semibold">Resumo do Pedido</h2>
                
                {/* Items Preview */}
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
                    <span className="text-success font-medium">Grátis</span>
                  </div>
                  {paymentMethod === 'pix' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Desconto PIX (10%)</span>
                      <span className="text-success font-medium">
                        -R$ {pixDiscount.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="text-xl font-bold text-primary">
                        R$ {finalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    {paymentMethod === 'credit_card' && (
                      <p className="mt-1 text-right text-xs text-muted-foreground">
                        ou 12x de R$ {(finalPrice / 12).toFixed(2).replace('.', ',')}
                      </p>
                    )}
                  </div>
                </div>

                {paymentMethod === 'pix' && pixQr && (
                  <div className="mt-4 space-y-3 rounded-lg border bg-secondary/20 p-3 text-center">
                    <p className="text-sm font-medium">Pague com PIX</p>
                    <p className="text-xs text-muted-foreground">
                      Escaneie o QR Code abaixo com o app do seu banco.
                    </p>
                    <div className="flex justify-center">
                      <img
                        src={pixQr.imageUrl}
                        alt="QR Code PIX"
                        className="h-48 w-48 rounded-lg bg-white p-2 shadow-sm"
                      />
                    </div>
                    {pixQr.text && (
                      <div className="mt-2 text-left text-xs">
                        <p className="mb-1 font-medium">Copia e cola:</p>
                        <div className="max-h-24 overflow-y-auto rounded bg-background p-2 font-mono text-[10px] text-muted-foreground">
                          {pixQr.text}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="mt-6 w-full bg-gradient-primary"
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? 'Processando...'
                    : paymentMethod === 'pix' && pixQr
                      ? 'Já paguei, concluir pedido'
                      : 'Finalizar Pedido'}
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
