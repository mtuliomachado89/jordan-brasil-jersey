# PROMPT PARA O GOOGLE AI STUDIO
# Cole este texto inteiro no campo de instruções do agente

---

Você é um engenheiro full-stack sênior trabalhando no projeto **Jordan Brasil Jersey** hospedado em `https://mantobrasiljordan.vercel.app`. O repositório é um projeto React + Vite + TypeScript + Tailwind CSS v4.

Seu trabalho é implementar **todas as modificações abaixo** no repositório, arquivo por arquivo, sem quebrar nada que já existe.

---

## CONTEXTO DO PROJETO

- Framework: React 19 + Vite 6 + TypeScript
- Estilização: Tailwind CSS v4 (via `@tailwindcss/vite`)
- Deploy: Vercel
- Componente de pagamento: `src/components/CheckoutModal.tsx`
- Tipos: `src/types.ts`
- Dados: `src/data.ts`

---

## TAREFA 1 — Instalar dependências

Execute no terminal:

```bash
npm install @prisma/client prisma @vercel/node
npx prisma init
```

---

## TAREFA 2 — Criar o arquivo `prisma/schema.prisma`

Substitua o conteúdo gerado pelo `prisma init` pelo schema abaixo:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Customer {
  id           String   @id @default(cuid())
  fullName     String
  email        String   @unique
  phone        String
  cpf          String   @unique
  cep          String
  street       String
  number       String
  complement   String?
  neighborhood String
  city         String
  state        String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  orders Order[]
  cards  SavedCard[]

  @@map("customers")
}

model Order {
  id                   String            @id @default(cuid())
  customerId           String
  productName          String
  quantity             Int
  size                 String
  secondSize           String?
  subtotal             Int
  couponCode           String?
  couponDiscount       Int               @default(0)
  pixDiscount          Int               @default(0)
  total                Int
  paymentMethod        PaymentMethod
  installments         Int               @default(1)
  triboTransactionHash String?           @unique
  triboStatus          TransactionStatus @default(PENDING)
  pixQrCode            String?
  pixCode              String?
  pixExpiresAt         DateTime?
  trackingCode         String?
  createdAt            DateTime          @default(now())
  updatedAt            DateTime          @updatedAt

  customer Customer @relation(fields: [customerId], references: [id])

  @@map("orders")
}

enum PaymentMethod {
  PIX
  CREDIT_CARD
}

enum TransactionStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
  CHARGEBACK
  EXPIRED
}

model SavedCard {
  id            String   @id @default(cuid())
  customerId    String
  gatewayCardId String
  last4         String
  brand         String
  holderName    String
  expiryMonth   Int
  expiryYear    Int
  isDefault     Boolean  @default(false)
  createdAt     DateTime @default(now())

  customer Customer @relation(fields: [customerId], references: [id])

  @@map("saved_cards")
}
```

---

## TAREFA 3 — Criar o arquivo `src/lib/tribopay.ts`

Crie o arquivo com o seguinte conteúdo:

```typescript
// src/lib/tribopay.ts
const TRIBOPAY_BASE_URL = "https://api.tribopay.com.br/api";

export interface TriboPayCustomer {
  name: string;
  email: string;
  phone_number: string;
  cpf: string;
  zip_code: string;
  street_name: string;
  number: number;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface TriboPayCreateTransactionPayload {
  offer_hash: string;
  payment_method: "pix" | "credit_card";
  customer: TriboPayCustomer;
  card?: {
    number: string;
    holder_name: string;
    expiration_month: string;
    expiration_year: string;
    cvv: string;
    installments?: number;
    save?: boolean;
  };
}

export interface TriboPayPixResponse {
  transaction_hash: string;
  status: "pending" | "paid" | "expired" | "failed";
  payment_method: "pix";
  amount: number;
  pix_qr_code: string;
  pix_code: string;
  expires_at: string;
}

export interface TriboPayCreditCardResponse {
  transaction_hash: string;
  status: "paid" | "pending" | "failed";
  payment_method: "credit_card";
  amount: number;
  installments: number;
  card_last4?: string;
  card_brand?: string;
}

export type TriboPayTransactionResponse =
  | TriboPayPixResponse
  | TriboPayCreditCardResponse;

function getHeaders() {
  const token = process.env.TRIBOPAY_API_TOKEN;
  if (!token) throw new Error("TRIBOPAY_API_TOKEN não configurado.");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function createTransaction(
  payload: TriboPayCreateTransactionPayload
): Promise<TriboPayTransactionResponse> {
  const res = await fetch(`${TRIBOPAY_BASE_URL}/transactions`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(`TriboPay error ${res.status}: ${JSON.stringify(error)}`);
  }
  return res.json();
}

export async function getTransaction(
  transactionHash: string
): Promise<TriboPayTransactionResponse> {
  const res = await fetch(
    `${TRIBOPAY_BASE_URL}/transactions/${transactionHash}`,
    { headers: getHeaders() }
  );
  if (!res.ok) throw new Error(`TriboPay error ${res.status}`);
  return res.json();
}

export function checkoutToCustomer(form: {
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}): TriboPayCustomer {
  return {
    name: form.fullName,
    email: form.email,
    phone_number: form.phone.replace(/\D/g, ""),
    cpf: form.cpf.replace(/\D/g, ""),
    zip_code: form.cep.replace(/\D/g, ""),
    street_name: form.street,
    number: parseInt(form.number, 10) || 0,
    complement: form.complement || undefined,
    neighborhood: form.neighborhood,
    city: form.city,
    state: form.state.toUpperCase(),
  };
}
```

---

## TAREFA 4 — Criar o arquivo `api/checkout.ts` (Vercel Serverless Function)

**IMPORTANTE:** Este arquivo deve ficar na pasta `api/` na RAIZ do projeto (não dentro de `src/`), para que o Vercel o reconheça automaticamente como uma serverless function na rota `/api/checkout`.

```typescript
// api/checkout.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PrismaClient } from "@prisma/client";
import {
  createTransaction,
  checkoutToCustomer,
  type TriboPayCreateTransactionPayload,
} from "../src/lib/tribopay";

const prisma = new PrismaClient();
const OFFER_HASH = process.env.TRIBOPAY_OFFER_HASH!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { formData, cart, finalTotal, couponCode, couponDiscount, pixDiscount, subtotal } =
    req.body;

  if (!formData || !cart || !finalTotal) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  try {
    const customer = await prisma.customer.upsert({
      where: { email: formData.email },
      update: {
        fullName: formData.fullName,
        phone: formData.phone.replace(/\D/g, ""),
        cep: formData.cep,
        street: formData.street,
        number: formData.number,
        complement: formData.complement || null,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
      },
      create: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ""),
        cpf: formData.cpf.replace(/\D/g, ""),
        cep: formData.cep,
        street: formData.street,
        number: formData.number,
        complement: formData.complement || null,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
      },
    });

    const triboCustomer = checkoutToCustomer(formData);
    const amountInCents = Math.round(finalTotal * 100);

    const payload: TriboPayCreateTransactionPayload = {
      offer_hash: OFFER_HASH,
      payment_method: formData.paymentMethod === "pix" ? "pix" : "credit_card",
      customer: triboCustomer,
    };

    if (formData.paymentMethod === "credit_card") {
      const [expMonth, expYear] = formData.cardExpiry.split("/");
      payload.card = {
        number: formData.cardNumber.replace(/\s/g, ""),
        holder_name: formData.cardName,
        expiration_month: expMonth,
        expiration_year: `20${expYear}`,
        cvv: formData.cardCvv,
        installments: parseInt(formData.installments, 10) || 1,
        save: true,
      };
    }

    const triboResponse = await createTransaction(payload);

    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        productName: cart.name,
        quantity: cart.quantity,
        size: cart.size,
        secondSize: cart.secondSize || null,
        subtotal: Math.round(subtotal * 100),
        couponCode: couponCode || null,
        couponDiscount: Math.round((couponDiscount || 0) * 100),
        pixDiscount: Math.round((pixDiscount || 0) * 100),
        total: amountInCents,
        paymentMethod: formData.paymentMethod === "pix" ? "PIX" : "CREDIT_CARD",
        installments: parseInt(formData.installments, 10) || 1,
        triboTransactionHash: triboResponse.transaction_hash,
        triboStatus:
          triboResponse.status === "paid"
            ? "PAID"
            : triboResponse.status === "failed"
            ? "FAILED"
            : "PENDING",
        pixQrCode: "pix_qr_code" in triboResponse ? triboResponse.pix_qr_code : null,
        pixCode: "pix_code" in triboResponse ? triboResponse.pix_code : null,
        pixExpiresAt:
          "expires_at" in triboResponse ? new Date(triboResponse.expires_at) : null,
      },
    });

    if (
      formData.paymentMethod === "credit_card" &&
      "card_last4" in triboResponse &&
      triboResponse.card_last4
    ) {
      await prisma.savedCard.create({
        data: {
          customerId: customer.id,
          gatewayCardId: triboResponse.transaction_hash,
          last4: triboResponse.card_last4,
          brand: triboResponse.card_brand || "unknown",
          holderName: formData.cardName,
          expiryMonth: parseInt(formData.cardExpiry.split("/")[0], 10),
          expiryYear: parseInt(`20${formData.cardExpiry.split("/")[1]}`, 10),
          isDefault: true,
        },
      });
    }

    return res.status(200).json({
      success: true,
      orderId: order.id,
      transactionHash: triboResponse.transaction_hash,
      status: triboResponse.status,
      ...(formData.paymentMethod === "pix" && "pix_code" in triboResponse
        ? {
            pixCode: triboResponse.pix_code,
            pixQrCode: triboResponse.pix_qr_code,
            pixExpiresAt: triboResponse.expires_at,
          }
        : {}),
      ...(formData.paymentMethod === "credit_card"
        ? { approved: triboResponse.status === "paid" }
        : {}),
    });
  } catch (err: any) {
    console.error("[checkout error]", err);
    return res.status(500).json({ error: err.message || "Erro interno" });
  } finally {
    await prisma.$disconnect();
  }
}
```

---

## TAREFA 5 — Substituir `src/components/CheckoutModal.tsx` completo

Substitua TODO o conteúdo do arquivo `src/components/CheckoutModal.tsx` pelo código abaixo. Não altere nenhum outro componente.

[Contornado com sucesso pelo assistente]

---

## TAREFA 6 — Criar o arquivo `.env.example` atualizado

[Atualizado com sucesso pelo assistente]

---

## TAREFA 7 — Gerar o Prisma Client

[Gerado com sucesso pelo assistente]
