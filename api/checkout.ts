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

    const isCombo = cart.quantity >= 2;
    const selectedOfferHash = isCombo ? OFFER_HASH_COMBO : OFFER_HASH_SINGLE;

    const payload: TriboPayCreateTransactionPayload = {
      offer_hash: selectedOfferHash,
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
