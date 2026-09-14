import QRCode from 'qrcode';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export type PaymentMethod = 'pix';

export type PaymentResult =
  | { type: 'pix_qr'; qrCodeImageUrl: string; qrCodeText?: string }
  | { type: 'error'; message: string };

function generatePixPayload(amount: number): string {
  const merchantName = 'Sheik dos Imports';
  const merchantCity = 'Sao Paulo';
  const txId = Math.random().toString(36).substring(2, 14).toUpperCase();

  function formatField(id: string, value: string): string {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
  }

  function crc16(payload: string): string {
    let crc = 0xffff;
    for (let i = 0; i < payload.length; i++) {
      crc ^= payload.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
        crc &= 0xffff;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  let payload = '';
  payload += formatField('00', '01');
  payload += formatField('26', formatField('00', 'br.gov.bcb.pix') + formatField('01', 'pix@lacerdaexpress.com'));
  payload += formatField('52', '0000');
  payload += formatField('53', '986');
  payload += formatField('54', amount.toFixed(2));
  payload += formatField('58', 'BR');
  payload += formatField('59', merchantName);
  payload += formatField('60', merchantCity);
  payload += formatField('62', formatField('05', txId));

  const payloadWithCrc = payload + '6304';
  return payloadWithCrc + crc16(payloadWithCrc);
}

async function generatePixQRCode(amount: number): Promise<PaymentResult> {
  try {
    const payload = generatePixPayload(amount);
    const qrCodeImageUrl = await QRCode.toDataURL(payload.toUpperCase(), {
      width: 400,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });
    return {
      type: 'pix_qr',
      qrCodeImageUrl,
      qrCodeText: payload.toUpperCase(),
    };
  } catch (error) {
    console.error('Erro ao gerar QR Code PIX:', error);
    return { type: 'error', message: 'Erro ao gerar QR Code PIX.' };
  }
}

export async function createPixPayment(amount: number): Promise<PaymentResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${API_URL}/api/create-pix-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, description: 'Pedido Sheik dos Imports' }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const data = await response.json();

    if (!response.ok) {
      return generatePixQRCode(amount);
    }

    return {
      type: 'pix_qr',
      qrCodeImageUrl: `data:image/png;base64,${data.qrCode}`,
      qrCodeText: data.copyPaste,
    };
  } catch {
    return generatePixQRCode(amount);
  }
}
