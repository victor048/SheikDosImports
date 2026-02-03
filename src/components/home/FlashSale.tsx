import { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { Product } from '@/types/store';
import { ProductCard } from '@/components/products/ProductCard';

interface FlashSaleProps {
  products: Product[];
}

export function FlashSale({ products }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="py-4">
      <div className="container">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg bg-gradient-sale px-3 py-1.5 text-destructive-foreground">
              <Flame className="h-5 w-5 animate-pulse" />
              <span className="font-bold">OFERTA RELÂMPAGO</span>
            </div>
          </div>
          
          {/* Countdown */}
          <div className="flex items-center gap-1 text-sm">
            <span className="text-muted-foreground">Termina em:</span>
            <div className="flex gap-1">
              <span className="rounded bg-foreground px-1.5 py-0.5 font-mono text-xs font-bold text-background">
                {pad(timeLeft.hours)}
              </span>
              <span className="text-foreground">:</span>
              <span className="rounded bg-foreground px-1.5 py-0.5 font-mono text-xs font-bold text-background">
                {pad(timeLeft.minutes)}
              </span>
              <span className="text-foreground">:</span>
              <span className="rounded bg-foreground px-1.5 py-0.5 font-mono text-xs font-bold text-background">
                {pad(timeLeft.seconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Products Scroll */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className="w-36 flex-shrink-0 md:w-44"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
