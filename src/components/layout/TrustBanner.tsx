import { Shield, Lock, CreditCard, Mail, Phone, MessageCircle } from 'lucide-react';

export function TrustBanner() {
  return (
    <section className="border-t border-yellow-500/10 bg-black py-6">
      <div className="container">
        {/* Payment methods */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-4 md:gap-8">
          <div className="flex items-center gap-2 text-xs text-yellow-400/60">
            <Lock className="h-4 w-4" />
            <span>Compra 100% Segura</span>
          </div>
          <div className="h-4 w-px bg-yellow-500/20" />
          <div className="flex items-center gap-3">
            {/* Visa */}
            <div className="flex h-8 items-center rounded border border-yellow-500/20 bg-white/5 px-2">
              <span className="text-[10px] font-bold text-white/80">VISA</span>
            </div>
            {/* Mastercard */}
            <div className="flex h-8 items-center rounded border border-yellow-500/20 bg-white/5 px-2">
              <span className="text-[10px] font-bold text-white/80">MC</span>
            </div>
            {/* PIX */}
            <div className="flex h-8 items-center rounded border border-yellow-500/20 bg-white/5 px-2">
              <span className="text-[10px] font-bold text-yellow-400">PIX</span>
            </div>
            {/* Boleto */}
            <div className="flex h-8 items-center rounded border border-yellow-500/20 bg-white/5 px-2">
              <span className="text-[10px] font-bold text-white/80">BOLETO</span>
            </div>
          </div>
          <div className="h-4 w-px bg-yellow-500/20" />
          <div className="flex items-center gap-2 text-xs text-yellow-400/60">
            <CreditCard className="h-4 w-4" />
            <span>Ate 12x sem juros</span>
          </div>
        </div>

        {/* Contact info */}
        <div className="border-t border-yellow-500/10 pt-6">
          <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3 md:text-left">
            {/* WhatsApp */}
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/20">
                <MessageCircle className="h-5 w-5 text-[#25D366]" />
              </div>
              <div>
                <p className="text-xs text-yellow-400/50">WhatsApp</p>
                <p className="text-sm font-medium text-white">(11) 91756-7489</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
                <Mail className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-yellow-400/50">E-mail</p>
                <p className="text-sm font-medium text-white">contato@sheikdosimports.com</p>
              </div>
            </div>

            {/* CNPJ */}
            <div className="flex items-center justify-center gap-3 md:justify-end">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
                <Shield className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-yellow-400/50">CNPJ</p>
                <p className="text-sm font-medium text-white">00.000.000/0001-00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="border-t border-yellow-500/10 mt-6 pt-6">
          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-yellow-400/40 md:gap-8 md:text-xs">
            <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> SSL Seguro</span>
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Dados Protegidos</span>
            <span className="flex items-center gap-1"><CreditCard className="h-3 w-3" /> Pagamento Seguro</span>
            <span className="flex items-center gap-1">🔒 Site Verificado</span>
          </div>
        </div>
      </div>
    </section>
  );
}
