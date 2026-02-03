export type PaymentMethod = 'pix' | 'credit_card';

export type PaymentRequest = {
  amount: number;
  method: PaymentMethod;
  currency?: string;
};

export type PaymentResult =
  | { type: 'redirect'; url: string }
  | { type: 'pix_qr'; qrCodeImageUrl: string; qrCodeText?: string }
  | { type: 'success' }
  | { type: 'error'; message: string };

// URL da API de geração de QR Code PIX.
// Usa VITE_PIX_QR_API_URL se definida; caso contrário, assume backend local.
const PIX_QR_API_URL =
  (import.meta.env.VITE_PIX_QR_API_URL as string | undefined) ??
  'http://localhost:4000/api/pix/charge';
const PIX_LINK = import.meta.env.VITE_PAYMENT_LINK_PIX as string | undefined;
const CARD_LINK = import.meta.env.VITE_PAYMENT_LINK_CARD as string | undefined;

/**
 * Gateway de pagamento simples baseado em Payment Links.
 *
 * - Se estiver configurado um Payment Link (Stripe, Mercado Pago, etc) via .env,
 *   o usuário é redirecionado para a página de pagamento externa.
 * - Se não houver Payment Link configurado, cai em um fluxo "mock" que apenas
 *   simula o pagamento com sucesso.
 *
 * Para uso real:
 * - Crie um Payment Link no seu gateway e coloque a URL em:
 *   - VITE_PAYMENT_LINK_PIX
 *   - VITE_PAYMENT_LINK_CARD
 */
export async function createPayment(
  request: PaymentRequest,
): Promise<PaymentResult> {
  const { method } = request;

  // Fluxo PIX com geração de QR Code via API própria
  if (method === 'pix' && PIX_QR_API_URL) {
    try {
      const response = await fetch(PIX_QR_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        console.error('Erro ao gerar QR Code PIX', await response.text());
        return {
          type: 'error',
          message: 'Não foi possível gerar o QR Code PIX.',
        };
      }

      const data = await response.json() as {
        qrCodeImageUrl: string;
        qrCodeText?: string;
      };

      if (!data.qrCodeImageUrl) {
        return {
          type: 'error',
          message: 'Resposta inválida da API de PIX.',
        };
      }

      return {
        type: 'pix_qr',
        qrCodeImageUrl: data.qrCodeImageUrl,
        qrCodeText: data.qrCodeText,
      };
    } catch (error) {
      console.error('Erro inesperado ao gerar QR Code PIX', error);
      return {
        type: 'error',
        message: 'Erro inesperado ao gerar QR Code PIX.',
      };
    }
  }

  // Fallback baseado em Payment Links (outras formas de pagamento)
  const link = method === 'pix' ? PIX_LINK : CARD_LINK;

  if (link) {
    return { type: 'redirect', url: link };
  }

  // Mock genérico: simula aprovação em ~2s
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { type: 'success' };
}

