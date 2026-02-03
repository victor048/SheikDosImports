import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export function WhatsAppButton({ 
  phoneNumber = '5511999999999', 
  message = 'Olá! Vim pelo site e gostaria de mais informações.' 
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110 hover:bg-[#22c55e] md:bottom-6 md:h-16 md:w-16"
      size="icon"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="h-7 w-7 fill-white text-white md:h-8 md:w-8" />
    </Button>
  );
}
