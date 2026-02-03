import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { WhatsAppButton } from './WhatsAppButton';

interface LayoutProps {
  children: ReactNode;
  hideBottomNav?: boolean;
}

export function Layout({ children, hideBottomNav = false }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
      <WhatsAppButton />
    </div>
  );
}
