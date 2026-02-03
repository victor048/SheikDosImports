import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  link: string;
}

const slides: BannerSlide[] = [
  {
    id: '1',
    title: 'Super Promoção',
    subtitle: 'Até 70% de desconto em eletrônicos',
    cta: 'Ver Ofertas',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
    link: '/ofertas',
  },
  {
    id: '2',
    title: 'Nova Coleção',
    subtitle: 'Moda verão 2024 chegou',
    cta: 'Conferir',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200',
    link: '/categoria/moda-feminina',
  },
  {
    id: '3',
    title: 'Frete Grátis',
    subtitle: 'Em compras acima de R$ 199',
    cta: 'Aproveitar',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
    link: '/produtos',
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => setCurrent(index);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <div className="relative overflow-hidden bg-secondary">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="relative min-w-full"
          >
            <div className="relative aspect-[21/9] md:aspect-[3/1]">
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="container">
                  <div className="max-w-md space-y-2 text-white md:space-y-4">
                    <h2 className="text-2xl font-extrabold md:text-4xl lg:text-5xl">
                      {slide.title}
                    </h2>
                    <p className="text-sm md:text-lg">
                      {slide.subtitle}
                    </p>
                    <Button
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {slide.cta}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/40 md:left-4"
        onClick={prev}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/40 md:right-4"
        onClick={next}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={cn(
              'h-2 w-2 rounded-full transition-all',
              current === idx ? 'w-6 bg-white' : 'bg-white/50'
            )}
          />
        ))}
      </div>
    </div>
  );
}
