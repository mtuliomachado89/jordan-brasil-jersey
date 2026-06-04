// api/checkout.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PrismaClient } from "@prisma/client";
import {
  createTransaction,
  checkoutToCustomer,
  type TriboPayCreateTransactionPayload,
} from "../src/lib/tribopay";

const prisma = new PrismaClient();
const OFFER_HASH_COMBO = process.env.TRIBOPAY_OFFER_HASH_COMBO || "4264kncjde";
const OFFER_HASH_SINGLE = process.env.TRIBOPAY_OFFER_HASH_SINGLE || "ygiusk7jkx";

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
    // Clean and normalize inputs
    const cleanCpf = formData.cpf.replace(/\D/g, "");
    const cleanEmail = formData.email.trim().toLowerCase();

    // Check if the customer exists by email or CPF to prevent Unique Constraint violations on upsert
    const existingWithEmail = await prisma.customer.findUnique({
      where: { email: cleanEmail },
    });

    const existingWithCpf = await prisma.customer.findUnique({
      where: { cpf: cleanCpf },
    });

    let customer;

    if (existingWithCpf) {
      // If the CPF is already in use, update that customer's details (and safely update email)
      customer = await prisma.customer.update({
        where: { cpf: cleanCpf },
        data: {
          fullName: formData.fullName,
          email: cleanEmail,
          phone: formData.phone.replace(/\D/g, ""),
          cep: formData.cep,
          street: formData.street,
          number: formData.number,
          complement: formData.complement || null,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
        },
      });
    } else if (existingWithEmail) {
      // If email exists but CPF didn't match, update current email record with new details and CPF
      customer = await prisma.customer.update({
        where: { email: cleanEmail },
        data: {
          fullName: formData.fullName,
          cpf: cleanCpf,
          phone: formData.phone.replace(/\D/g, ""),
          cep: formData.cep,
          street: formData.street,
          number: formData.number,
          complement: formData.complement || null,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
        },
      });
    } else {
      // Brand new registration
      customer = await prisma.customer.create({
        data: {
          fullName: formData.fullName,
          email: cleanEmail,
          phone: formData.phone.replace(/\D/g, ""),
          cpf: cleanCpf,
          cep: formData.cep,
          street: formData.street,
          number: formData.number,
          complement: formData.complement || null,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
        },
      });
    }

    const triboCustomer = checkoutToCustomer(formData);
    const amountInCents = Math.round(finalTotal * 100);

    const isCombo = cart.quantity >= 2;
    const selectedOfferHash = isCombo ? OFFER_HASH_COMBO : OFFER_HASH_SINGLE;

    let customizationText = "";
    if (cart.customizations && cart.customizations.length > 0) {
      customizationText = " [Personalizações: " + cart.customizations.map((c: any, index: number) => `Camisa #${index + 1}: ${c.name} - #${c.number}`).join(", ") + "]";
    } else if (cart.customName && cart.customNumber) {
      customizationText = ` [Personalizada: ${cart.customName} - #${cart.customNumber}]`;
    }

    const payload: TriboPayCreateTransactionPayload = {
      amount: amountInCents,
      offer_hash: selectedOfferHash,
      payment_method: "pix",
      customer: triboCustomer,
      cart: [
        {
          product_hash: selectedOfferHash,
          title: (cart.name || "Camisa Jordan x Brasil Edição Especial 2026") + customizationText,
          price: amountInCents,
          quantity: cart.quantity || 1,
          operation_type: 1,
          tangible: false,
        },
      ],
    };

    const triboResponse = await createTransaction(payload);

    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        productName: cart.name + customizationText,
        quantity: cart.quantity,
        size: cart.size,
        secondSize: cart.secondSize || null,
        subtotal: Math.round(subtotal * 100),
        couponCode: couponCode || null,
        couponDiscount: Math.round((couponDiscount || 0) * 100),
        pixDiscount: Math.round((pixDiscount || 0) * 100),
        total: amountInCents,
        paymentMethod: "PIX",
        installments: 1,
        triboTransactionHash: triboResponse.transaction_hash,
        triboStatus:
          triboResponse.status === "paid"
            ? "PAID"
            : triboResponse.status === "failed"
            ? "FAILED"
            : "PENDING",
        pixQrCode: triboResponse.pix_qr_code || null,
        pixCode: triboResponse.pix_code || null,
        pixExpiresAt:
          triboResponse.expires_at ? new Date(triboResponse.expires_at) : null,
      },
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      transactionHash: triboResponse.transaction_hash,
      status: triboResponse.status,
      pixCode: triboResponse.pix_code,
      pixQrCode: triboResponse.pix_qr_code,
      pixExpiresAt: triboResponse.expires_at,
    });
  } catch (err: any) {
    console.error("[checkout error]", err);
    let userMessage = err.message || "Erro interno";

    // Handle Prisma specific exceptions with informative messages
    if (err.code) {
      switch (err.code) {
        case "P2002":
          const target = err.meta?.target ? ` (${err.meta.target.join(", ")})` : "";
          userMessage = `Erro de redundância: Um cadastro com este dado já existe no sistema.${target}`;
          break;
        case "P2021":
          userMessage = "As tabelas do banco de dados não foram encontradas. Por favor, certifique-se de executar 'npx prisma db push' para sincronizar seu esquema do banco de dados.";
          break;
        case "P1001":
          userMessage = "Erro de conexão: Não foi possível se conectar ao banco de dados Postgres. Verifique se as credenciais DATABASE_URL ou DIRECT_URL estão corretas e se o acesso IP externo está habilitado.";
          break;
        default:
          userMessage = `Erro no banco de dados [${err.code}]: ${err.message || 'Erro desconhecido'}`;
      }
    }

    return res.status(500).json({ error: userMessage });
  } finally {
    await prisma.$disconnect();
  }
}
