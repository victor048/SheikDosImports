import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { WhatsAppButton } from './WhatsAppButton';
import { TrustBanner } from './TrustBanner';

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
      <TrustBanner />
      {!hideBottomNav && <BottomNav />}
      <WhatsAppButton />
    </div>
  );
}
