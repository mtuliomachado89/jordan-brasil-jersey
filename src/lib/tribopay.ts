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
