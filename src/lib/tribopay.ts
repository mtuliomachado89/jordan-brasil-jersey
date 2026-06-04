// src/lib/tribopay.ts

const TRIBOPAY_BASE_URL = "https://api.tribopay.com.br/api/public/v1";

export interface TriboPayCustomer {
  name: string;
  email: string;
  phone_number: string;
  document: string; // CPF or CNPJ (only numbers)
  zip_code?: string;
  street_name?: string;
  number?: string | number;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export interface TriboPayCreateTransactionPayload {
  amount: number;
  offer_hash: string;
  payment_method: "pix";
  customer: TriboPayCustomer;
  cart: Array<{
    product_hash: string;
    title: string;
    price: number;
    quantity: number;
    operation_type: number;
    tangible: boolean;
  }>;
  expire_in_days?: number;
  transaction_origin?: string;
}

export interface TriboPayPixResponse {
  transaction_hash: string;
  status: "pending" | "paid" | "expired" | "failed";
  payment_method: "pix";
  amount: number;
  pix_qr_code: string; // Base64 png QR Code
  pix_code: string; // Copy and paste string
  expires_at: string;
}

export type TriboPayTransactionResponse = TriboPayPixResponse;

export async function createTransaction(
  payload: TriboPayCreateTransactionPayload
): Promise<TriboPayPixResponse> {
  const token = process.env.TRIBOPAY_API_TOKEN;
  if (!token) throw new Error("TRIBOPAY_API_TOKEN não configurado.");

  // Construct official API request payload strictly for PIX
  const apiPayload: any = {
    amount: payload.amount,
    offer_hash: payload.offer_hash,
    payment_method: "pix",
    customer: payload.customer,
    cart: payload.cart,
    expire_in_days: payload.expire_in_days || 1,
    transaction_origin: payload.transaction_origin || "api",
  };

  const res = await fetch(`${TRIBOPAY_BASE_URL}/transactions?api_token=${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(apiPayload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(`TriboPay error ${res.status}: ${JSON.stringify(error)}`);
  }

  const rawResponse: any = await res.json();

  // Standardize the response to match what the checkout handler expects
  const hash = rawResponse.hash || rawResponse.transaction || "";
  const paymentStatus = rawResponse.payment_status || "";
  
  // Map payment_status to our statuses
  let status: "pending" | "paid" | "expired" | "failed" = "pending";
  if (paymentStatus === "paid" || paymentStatus === "approved") {
    status = "paid";
  } else if (paymentStatus === "waiting_payment" || paymentStatus === "pending") {
    status = "pending";
  } else if (paymentStatus === "canceled" || paymentStatus === "refunded") {
    status = "failed";
  }

  const pixCode = rawResponse.pix?.pix_qr_code || "";
  
  // Generate QR Code as Base64 on the fly from the COPY-PASTE (BRCode) string
  let pixQrCodeBase64 = "";
  if (pixCode) {
    try {
      const qrRes = await fetch(
        `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}`
      );
      if (qrRes.ok) {
        const arrayBuf = await qrRes.arrayBuffer();
        pixQrCodeBase64 = Buffer.from(arrayBuf).toString("base64");
      }
    } catch (e) {
      console.error("Erro ao gerar QR Code base64 no SDK TriboPay:", e);
    }
  }

  return {
    transaction_hash: hash,
    status,
    payment_method: "pix",
    amount: rawResponse.amount || payload.amount || 0,
    pix_code: pixCode,
    pix_qr_code: pixQrCodeBase64,
    expires_at: rawResponse.expires_at || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  };
}

export async function getTransaction(
  transactionHash: string
): Promise<TriboPayPixResponse> {
  const token = process.env.TRIBOPAY_API_TOKEN;
  if (!token) throw new Error("TRIBOPAY_API_TOKEN não configurado.");

  const res = await fetch(
    `${TRIBOPAY_BASE_URL}/transactions/${transactionHash}?api_token=${token}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  if (!res.ok) throw new Error(`TriboPay error ${res.status}`);
  
  const rawResponse: any = await res.json();
  const hash = rawResponse.hash || transactionHash;
  const paymentStatus = rawResponse.payment_status || "";
  
  let status: "pending" | "paid" | "expired" | "failed" = "pending";
  if (paymentStatus === "paid" || paymentStatus === "approved") {
    status = "paid";
  } else if (paymentStatus === "waiting_payment" || paymentStatus === "pending") {
    status = "pending";
  } else if (paymentStatus === "canceled" || paymentStatus === "refunded") {
    status = "failed";
  }

  const pixCode = rawResponse.pix?.pix_qr_code || "";
  let pixQrCodeBase64 = "";
  if (pixCode) {
    try {
      const qrRes = await fetch(
        `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}`
      );
      if (qrRes.ok) {
        const arrayBuf = await qrRes.arrayBuffer();
        pixQrCodeBase64 = Buffer.from(arrayBuf).toString("base64");
      }
    } catch (e) {
      console.error("Erro ao obter QR Code no getTransaction:", e);
    }
  }

  return {
    transaction_hash: hash,
    status,
    payment_method: "pix",
    amount: rawResponse.amount || 0,
    pix_code: pixCode,
    pix_qr_code: pixQrCodeBase64,
    expires_at: rawResponse.expires_at || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  };
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
    document: form.cpf.replace(/\D/g, ""), // CPF / CNPJ formatted for 'document'
    zip_code: form.cep.replace(/\D/g, ""),
    street_name: form.street,
    number: form.number, // pass address number as string/number safely
    complement: form.complement || undefined,
    neighborhood: form.neighborhood,
    city: form.city,
    state: form.state.toUpperCase(),
  };
}
