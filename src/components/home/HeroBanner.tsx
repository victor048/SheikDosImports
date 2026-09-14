import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Shield, Truck, Award, Gem, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function HeroBanner() {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImgLoaded(true);
    img.onerror = () => setImgLoaded(false);
    img.src = '/banner.png';
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + 3) % 3);
  const next = () => setCurrent((c) => (c + 1) % 3);

  const slides = [
    { tag: 'Bem-vindo', title: 'Sheik dos Imports', sub: 'De Dubai para o Brasil', cta: 'Ver Colecao' },
    { tag: 'Novidades', title: 'Produtos Premium', sub: 'Qualidade importada com garantia', cta: 'Conferir' },
    { tag: 'Ofertas', title: 'Frete Gratis', sub: 'Em compras acima de R$ 199', cta: 'Aproveitar' },
  ];

  const trustBar = (
    <div className="bg-black border-t border-yellow-500/20 py-2.5">
      <div className="container flex items-center justify-between px-4 text-[10px] text-yellow-400/70 sm:justify-center sm:gap-4 sm:text-xs md:gap-8">
        <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> Frete Gratis</span>
        <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Compra Segura</span>
        <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5" /> Premium</span>
        <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5" /> Garantia</span>
      </div>
    </div>
  );

  if (imgLoaded) {
    return (
      <div className="relative overflow-hidden bg-black">
        <div className="relative h-48 sm:h-56 md:h-72 lg:h-80">
          <img src="/banner.png" alt="Sheik dos Imports" className="h-full w-full object-cover" />
        </div>
        {trustBar}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div key={idx} className="min-w-full">
            <div className="relative h-48 overflow-hidden sm:h-56 md:h-72 lg:h-80">
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />

              {/* Glow orbs */}
              <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-yellow-500/10 blur-[100px]" />
              <div className="absolute bottom-1/4 right-1/4 h-48 w-48 animate-pulse rounded-full bg-amber-600/10 blur-[80px]" style={{ animationDelay: '1s' }} />

              {/* Geometric */}
              <div className="absolute top-4 right-4 h-24 w-24 rotate-45 border border-yellow-500/10 md:top-8 md:right-8 md:h-40 md:w-40" />
              <div className="absolute bottom-4 left-4 h-16 w-16 rotate-12 border border-yellow-500/5 md:bottom-8 md:left-8 md:h-24 md:w-24" />

              {/* Gold dots */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-0.5 w-0.5 rounded-full bg-yellow-400/40"
                  style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                />
              ))}

              {/* Borders */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container px-4">
                  <div className="flex items-center justify-between">
                    <div className="max-w-lg space-y-2 sm:space-y-3 md:space-y-4">
                      {/* Tag */}
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="h-px w-6 bg-yellow-400 md:w-12" />
                        <span className="text-[9px] font-bold tracking-[0.3em] text-yellow-400 uppercase md:text-[10px]">
                          {slide.tag}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl font-black leading-tight sm:text-3xl md:text-5xl lg:text-6xl">
                        {idx === 0 ? (
                          <>
                            <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                              Sheik
                            </span>
                            <br />
                            <span className="text-white drop-shadow-lg">dos Imports</span>
                          </>
                        ) : (
                          <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
                            {slide.title}
                          </span>
                        )}
                      </h2>

                      {/* Subtitle */}
                      <p className="text-sm font-medium text-yellow-400/80 md:text-lg">
                        {slide.sub}
                      </p>

                      {/* CTA */}
                      <Link to="/buscar">
                        <Button
                          size="sm"
                          className="mt-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold hover:from-yellow-400 hover:to-amber-400 px-6 py-4 text-xs tracking-wide shadow-[0_0_30px_rgba(234,179,8,0.35)] md:mt-2 md:px-8 md:py-5 md:text-sm"
                        >
                          <Gem className="mr-2 h-3.5 w-3.5" />
                          {slide.cta}
                        </Button>
                      </Link>
                    </div>

                    {/* Decorative globe */}
                    <div className="hidden md:flex flex-col items-center gap-3">
                      <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-yellow-500/20 lg:h-36 lg:w-36">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-yellow-500/30 lg:h-28 lg:w-28">
                          <Globe className="h-10 w-10 text-yellow-400/40 lg:h-12 lg:w-12" />
                        </div>
                      </div>
                      <span className="text-[9px] tracking-[0.3em] text-yellow-400/50 uppercase">Premium</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-yellow-500/20 bg-black/50 text-yellow-400 backdrop-blur-sm hover:bg-yellow-500/20 md:left-4"
        onClick={prev}
      >
        <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-yellow-500/20 bg-black/50 text-yellow-400 backdrop-blur-sm hover:bg-yellow-500/20 md:right-4"
        onClick={next}
      >
        <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={cn(
              'h-1 rounded-full transition-all duration-300',
              current === idx ? 'w-6 bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'w-1 bg-white/30 hover:bg-white/50'
            )}
          />
        ))}
      </div>

      {trustBar}
    </div>
  );
}
