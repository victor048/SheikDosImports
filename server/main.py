from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import qrcode
from io import BytesIO
import base64


class PixRequest(BaseModel):
  amount: float
  method: str
  currency: str | None = "BRL"


app = FastAPI(title="ShopFlow Payments API")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


@app.get("/health")
def health():
  return {"status": "ok"}


@app.post("/api/pix/charge")
def create_pix_charge(payload: PixRequest):
  if payload.method != "pix":
    raise HTTPException(status_code=400, detail="Método inválido, use 'pix'.")

  if payload.amount <= 0:
    raise HTTPException(status_code=400, detail="Valor inválido para pagamento.")

  # TODO: integrar aqui com o provedor de PIX para gerar o payload EMV real.
  base_payload = os.getenv(
    "PIX_BASE_PAYLOAD",
    "PIX DEMO - valor R$ {AMOUNT} - moeda {CURRENCY}",
  )

  pix_text = base_payload.format(
    AMOUNT=f"{payload.amount:.2f}",
    CURRENCY=payload.currency or "BRL",
  )

  # Gera QR Code como Data URL (PNG base64)
  qr_img = qrcode.make(pix_text)
  buffer = BytesIO()
  qr_img.save(buffer, format="PNG")
  qr_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
  qr_data_url = f"data:image/png;base64,{qr_base64}"

  return {
    "qrCodeImageUrl": qr_data_url,
    "qrCodeText": pix_text,
  }

