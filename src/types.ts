/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Size = "P" | "M" | "G" | "GG" | "XG";

export interface GalleryItem {
  id: string;
  category: string;
  title: string;
  description: string;
  src: string;
}

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface DetailedFeature {
  id: string;
  title: string;
  description: string;
  image: string;
  items: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  rating: number;
  text: string;
  sizeBought: Size;
  deliveryTime: string;
  verified: boolean;
  avatarUrl?: string;
  initials: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  promoPrice: number;
  size: Size;
  quantity: number;
  image: string;
}

export interface CheckoutDetails {
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  paymentMethod: "pix" | "credit_card";
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
  installments: string;
}
