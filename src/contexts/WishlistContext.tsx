import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Product } from '@/types/store';

type WishlistContextType = {
  items: Product[];
  toggleItem: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  totalFavorites: number;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wishlist');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const toggleItem = (product: Product) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isFavorite = (productId: string) => items.some((p) => p.id === productId);

  const clear = () => setItems([]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        toggleItem,
        isFavorite,
        totalFavorites: items.length,
        clear,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist deve ser usado dentro de WishlistProvider');
  }
  return ctx;
}

