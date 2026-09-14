interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export function WhatsAppButton({
  phoneNumber = '5511917567489',
  message = 'Ola! Vim pelo site Sheik dos Imports e gostaria de mais informacoes.'
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110 hover:shadow-xl md:bottom-6 md:h-16 md:w-16"
      aria-label="Falar no WhatsApp"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white md:h-8 md:w-8">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.744 3.054 9.378L1.054 31.25l6.074-1.98A15.91 15.91 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.342 22.59c-.39 1.1-1.932 2.014-3.164 2.28-.84.18-1.936.324-5.626-1.21-4.724-1.962-7.762-6.79-8-7.104-.226-.314-1.864-2.484-1.864-4.738 0-2.254 1.18-3.358 1.602-3.816.39-.42.938-.56 1.248-.56.31 0 .62.002.89.016.286.014.666-.108 1.04.794.39.94 1.33 3.242 1.444 3.478.116.236.194.51.038.824-.158.314-.236.51-.47.786-.236.276-.494.616-.706.826-.236.236-.48.49-.204.962.276.472 1.226 2.02 2.63 3.272 1.806 1.61 3.326 2.11 3.804 2.344.478.236.754-.118 1.03-.514.276-.396.824-1.092 1.114-1.466.29-.374.58-.31.986-.186.406.12 2.586 1.22 3.03 1.442.444.222.74.334.848.518.108.184.108 1.068-.282 2.168z" />
      </svg>
    </button>
  );
}
