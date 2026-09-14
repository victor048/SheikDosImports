# Sheik dos Imports

E-commerce de produtos importados com checkout via WhatsApp.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS + shadcn-ui
- Supabase (banco de dados)
- QR Code PIX (geracao local)

## Como rodar

```sh
# Instalar dependencias
npm i

# Iniciar dev server
npm run dev
```

## Funcionalidades

- Carrinho de compras
- Checkout com redirect para WhatsApp
- Desconto de 10% no pagamento via PIX
- Painel administrativo para gerenciar produtos
- Categorias e busca de produtos
- Lista de desejos

## Estrutura

```
src/
  components/    # Componentes UI e layout
  contexts/      # Contextos (Carrinho, Favoritos)
  hooks/         # Hooks customizados
  integrations/  # Integracao com Supabase e pagamentos
  pages/         # Paginas da aplicacao
  lib/           # Utilitarios e banco local
```
