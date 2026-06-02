/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { X, Lock, ShieldCheck, Ticket, CreditCard, Sparkles, CheckCircle, Truck, Heart, ArrowRight, Copy } from "lucide-react";
import { Size, CartItem, CheckoutDetails } from "../types";
import { PRODUCT_INFO, IMAGES } from "../data";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSize: Size;
  onUpdateCartCount: (count: number) => void;
}

export default function CheckoutModal({ isOpen, onClose, selectedSize, onUpdateCartCount }: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [cart, setCart] = useState<CartItem>({
    id: "j1",
    name: "Camisa Jordan x Brasil Edição Especial 2026",
    price: PRODUCT_INFO.originalPrice,
    promoPrice: PRODUCT_INFO.promoPrice,
    size: selectedSize,
    quantity: 1,
    image: IMAGES.front,
  });

  // Keep size in sync if updated outside before opening
  useEffect(() => {
    if (isOpen) {
      setCart(prev => ({ ...prev, size: selectedSize }));
    }
  }, [selectedSize, isOpen]);

  // Form Details
  const [formData, setFormData] = useState<CheckoutDetails>({
    fullName: "",
    email: "",
    phone: "",
    cpf: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    paymentMethod: "pix",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    installments: "1",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [pixCountdown, setPixCountdown] = useState(299); // 5 minutes
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    onUpdateCartCount(isOpen ? cart.quantity : 0);
  }, [cart.quantity, isOpen]);

  // PIX timer countdown
  useEffect(() => {
    if (step === 3 && formData.paymentMethod === "pix" && pixCountdown > 0) {
      const timer = setInterval(() => {
        setPixCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, formData.paymentMethod, pixCountdown]);

  if (!isOpen) return null;

  // Calculators
  const subtotal = cart.promoPrice * cart.quantity;
  const couponDiscount = couponApplied ? subtotal * discountPercent : 0;
  const methodDiscount = formData.paymentMethod === "pix" ? (subtotal - couponDiscount) * 0.05 : 0;
  const finalTotal = subtotal - couponDiscount - methodDiscount;

  const handleApplyCoupon = () => {
    const raw = couponCode.trim().toUpperCase();
    if (raw === "MANTO10") {
      setCouponApplied(true);
      setDiscountPercent(0.10); // 10% off
      setFormErrors(prev => ({ ...prev, coupon: "" }));
    } else if (raw === "BRASIL5") {
      setCouponApplied(true);
      setDiscountPercent(0.05); // 5% off
      setFormErrors(prev => ({ ...prev, coupon: "" }));
    } else {
      setFormErrors(prev => ({ ...prev, coupon: "Cupom inválido!" }));
    }
  };

  // Autocomplete CEP Simulation
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setFormData(prev => ({ ...prev, cep: raw }));
    
    if (raw.length === 8) {
      // Simulate real postal lookup delay details
      setFormData(prev => ({
        ...prev,
        street: "Avenida Paulista",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
      }));
    }
  };

  const handleInputChange = (field: keyof CheckoutDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Custom regex validators
  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = "Nome é obrigatório";
    if (!formData.email.includes("@")) errors.email = "E-mail inválido";
    if (formData.phone.length < 10) errors.phone = "Telefone celular inválido";
    if (formData.cpf.length < 11) errors.cpf = "CPF inválido";
    if (formData.cep.length < 8) errors.cep = "CEP requerido";
    if (!formData.street.trim()) errors.street = "Logradouro requerido";
    if (!formData.number.trim()) errors.number = "Número requerido";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = () => {
    const errors: Record<string, string> = {};
    if (formData.paymentMethod === "credit_card") {
      if (formData.cardNumber.replace(/\s/g, "").length < 16) errors.cardNumber = "Cartão inválido";
      if (!formData.cardName.trim()) errors.cardName = "Nome impresso inválido";
      if (!formData.cardExpiry.includes("/")) errors.cardExpiry = "Validade expirada ou incorreta";
      if (formData.cardCvv.length < 3) errors.cardCvv = "CVV inválido";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    } else if (step === 3) {
      if (validateStep3()) setStep(4);
    }
  };

  const prevStep = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText("00020101021226870014br.gov.bcb.pix2565pix.seguro.gateway.jordan.brasil/pagamento/139.90");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatMinSec = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? `0${s}` : s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#05070a]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      
      {/* Checkout Window Frame */}
      <div className="bg-[#05070a] w-full max-w-2xl rounded-3xl border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col relative my-8 animate-scale-up">
        
        {/* Top Header */}
        <div className="bg-black/40 p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase block">CONEXÃO SSL PRIVADA</span>
              <h3 className="font-extrabold text-sm sm:text-base text-white uppercase tracking-tight">
                {step === 4 ? "✓ COMPRA CONFIRMADA" : `Passo ${step} de 3 - Checkout Premium`}
              </h3>
            </div>
          </div>

          {step < 4 && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Progress indicators */}
        {step < 4 && (
          <div className="bg-black/20 px-6 py-3 border-b border-white/5 flex items-center justify-between text-[11px] font-mono tracking-wide">
            <div className={`flex items-center space-x-1 ${step >= 1 ? "text-[#FFD400] font-bold" : "text-gray-500"}`}>
              <span>1. Carrinho</span>
            </div>
            <div className="h-0.5 w-12 bg-white/5 shrink-0" />
            <div className={`flex items-center space-x-1 ${step >= 2 ? "text-[#FFD400] font-bold" : "text-gray-500"}`}>
              <span>2. Entrega</span>
            </div>
            <div className="h-0.5 w-12 bg-white/5 shrink-0" />
            <div className={`flex items-center space-x-1 ${step >= 3 ? "text-[#FFD400] font-bold" : "text-gray-500"}`}>
              <span>3. Pagamento</span>
            </div>
          </div>
        )}

        {/* Checkout Dynamic Content Block */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[70vh]">
          
          {/* STEP 1: REVIEW CARRINHO */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex space-x-4 items-center shadow-xl">
                <div className="w-20 h-20 bg-black/45 rounded-xl overflow-hidden border border-white/10 shrink-0">
                  <img src={cart.image} alt={cart.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#FFD400] font-mono tracking-widest font-black uppercase">JORDAN X BRASIL</span>
                  <h4 className="text-sm font-bold text-white uppercase truncate">{cart.name}</h4>
                  
                  {/* Selected Size Adjustments */}
                  <div className="flex items-center space-x-3 mt-1.5">
                    <span className="text-xs text-gray-400 font-medium font-mono">Tamanho: <b className="text-white bg-white/5 border border-white/10 px-1.5 py-0.5 rounded ml-1 font-bold">{cart.size}</b></span>
                    <span className="text-xs text-emerald-450 font-mono">✓ Em Estoque</span>
                  </div>
                </div>

                {/* Adjust Quantities */}
                <div className="flex flex-col items-center space-y-1">
                  <div className="flex items-center space-x-2.5 bg-black/50 px-2 py-1 rounded-lg border border-white/10 select-none">
                    <button
                      type="button"
                      onClick={() => setCart(p => ({ ...p, quantity: Math.max(1, p.quantity - 1) }))}
                      className="text-gray-400 hover:text-white font-extrabold text-xs px-1 hover:scale-110 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs text-white font-black font-mono w-4 text-center">{cart.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setCart(p => ({ ...p, quantity: Math.min(5, p.quantity + 1) }))}
                      className="text-gray-400 hover:text-white font-extrabold text-xs px-1 hover:scale-110 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Coupon Form Input */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between gap-3 shadow-md">
                <div className="flex items-center space-x-2 shrink-0">
                  <Ticket className="w-4 h-4 text-[#FFD400] shrink-0 animate-bounce" />
                  <span className="text-xs text-gray-300 font-bold uppercase">Cupom:</span>
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Tente: MANTO10"
                    disabled={couponApplied}
                    className="flex-1 bg-black/55 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFD400] uppercase disabled:opacity-50 font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponApplied}
                    className="bg-[#FFD400] hover:brightness-110 disabled:bg-white/5 text-black font-extrabold text-xs px-3.5 py-1.5 rounded-lg active:scale-95 transition-all cursor-pointer disabled:text-white/20"
                  >
                    {couponApplied ? "APLICADO" : "APLICAR"}
                  </button>
                </div>
              </div>
              {formErrors.coupon && <span className="text-[11px] text-red-400 font-bold block -mt-4 ml-1">⚠ {formErrors.coupon}</span>}
              {couponApplied && <span className="text-[11px] text-emerald-450 font-bold block -mt-4 ml-1">✓ Desconto de {(discountPercent*100)}% ativado com sucesso!</span>}

              {/* Total Summary */}
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-2.5 shadow-2xl">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-gray-300">R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-xs text-emerald-450 font-medium">
                    <span>Cupom Desconto:</span>
                    <span className="font-mono font-bold">-R$ {couponDiscount.toFixed(2).replace(".", ",")}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Frete Expresso Seguro:</span>
                  <span className="font-mono font-black text-emerald-400 uppercase tracking-widest text-[10px]">✓ GRÁTIS</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between items-baseline">
                  <span className="text-xs text-white font-extrabold uppercase">Total Estimado:</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#FFD400] font-mono">
                    R$ {finalTotal.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DADOS PESSOAIS E ENTREGA */}
          {step === 2 && (
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-[#FFD400] block uppercase tracking-wider mb-2 animate-pulse">
                📂 IDENTIFICAÇÃO & SUPORTE DE RASTREIO
              </span>

              {/* Personal Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Ex: Rafael Machado Silva"
                    className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400 ${formErrors.fullName ? "border-red-500" : "border-slate-800"}`}
                  />
                  {formErrors.fullName && <span className="text-[10px] text-red-500 font-bold block mt-1">{formErrors.fullName}</span>}
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">E-mail para Código de Rastreamento</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className={`w-full bg-black/55 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400] ${formErrors.email ? "border-red-500" : "border-white/10"}`}
                  />
                  {formErrors.email && <span className="text-[10px] text-red-500 font-bold block mt-1">{formErrors.email}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">WhatsApp de Suporte</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, ""))}
                    placeholder="(11) 99999-9999"
                    className={`w-full bg-black/55 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400] ${formErrors.phone ? "border-red-500" : "border-white/10"}`}
                  />
                  {formErrors.phone && <span className="text-[10px] text-red-500 font-bold block mt-1">{formErrors.phone}</span>}
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">CPF (segurança fiscal)</label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange("cpf", e.target.value.replace(/\D/g, ""))}
                    placeholder="000.000.000-00"
                    maxLength={11}
                    className={`w-full bg-black/55 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400] ${formErrors.cpf ? "border-red-500" : "border-white/10"}`}
                  />
                  {formErrors.cpf && <span className="text-[10px] text-red-500 font-bold block mt-1">{formErrors.cpf}</span>}
                </div>
              </div>

              <span className="block text-xs font-mono font-bold text-[#FFD400] uppercase tracking-wider pt-3 mb-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded animate-pulse">
                🚚 ENDEREÇO DE DESPACHO
              </span>

              {/* Shipping Address Forms */}
              <div className="grid grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">CEP</label>
                  <input
                    type="text"
                    maxLength={8}
                    value={formData.cep}
                    onChange={handleCepChange}
                    placeholder="01001000"
                    className={`w-full bg-black/55 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400] font-mono ${formErrors.cep ? "border-red-500" : "border-white/10"}`}
                  />
                  {formErrors.cep && <span className="text-[10px] text-red-500 font-bold block mt-1">{formErrors.cep}</span>}
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">Logradouro (Rua/Avenida)</label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => handleInputChange("street", e.target.value)}
                    placeholder="Rua das Acacias"
                    className={`w-full bg-black/55 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400] ${formErrors.street ? "border-red-500" : "border-white/10"}`}
                  />
                  {formErrors.street && <span className="text-[10px] text-red-500 font-bold block mt-1">{formErrors.street}</span>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">Número</label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) => handleInputChange("number", e.target.value)}
                    placeholder="123"
                    className={`w-full bg-black/55 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400] ${formErrors.number ? "border-red-500" : "border-white/10"}`}
                  />
                  {formErrors.number && <span className="text-[10px] text-red-500 font-bold block mt-1">{formErrors.number}</span>}
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">Complemento / Referência</label>
                  <input
                    type="text"
                    value={formData.complement}
                    onChange={(e) => handleInputChange("complement", e.target.value)}
                    placeholder="Apto 101, Bloco B"
                    className="w-full bg-black/55 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">Bairro</label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                    placeholder="Centro"
                    className="w-full bg-black/55 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">Cidade</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="São Paulo"
                    className="w-full bg-black/55 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">Estado (UF)</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="SP"
                    className="w-full bg-black/55 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400] font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: MÈTODO DE PAGAMENTO SECURE */}
          {step === 3 && (
            <div className="space-y-6">
              
              {/* Method choice icons toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange("paymentMethod", "pix")}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    formData.paymentMethod === "pix"
                      ? "bg-emerald-950/20 border-emerald-550 text-emerald-400 scale-[1.02]"
                      : "bg-[#05070a]/90 border-white/10 text-white/50 hover:text-white"
                  }`}
                >
                  <span className="font-extrabold text-sm font-mono tracking-wider">⚡ PIX EXPEDIDO</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">✓ 5% DESCONTO EXTRA</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleInputChange("paymentMethod", "credit_card")}
                  className={`p-4 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    formData.paymentMethod === "credit_card"
                      ? "bg-yellow-950/20 border-[#FFD400] text-[#FFD400] scale-[1.02] shadow-[0_0_15px_rgba(255,212,0,0.15)]"
                      : "bg-[#05070a]/90 border-white/10 text-white/50 hover:text-white"
                  }`}
                >
                  <CreditCard className="w-5 h-5 shrink-0" />
                  <span className="font-extrabold text-sm font-sans uppercase">Cartão de Crédito</span>
                  <span className="text-[10px] text-[#FFD400] font-bold">ATÉ 12X SEM JUROS</span>
                </button>
              </div>

              {/* PIX SEGMENT */}
              {formData.paymentMethod === "pix" && (
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center space-y-4 shadow-xl">
                  <div className="bg-white p-3 rounded-xl shadow-lg">
                    {/* Highly stylized mock QR Code */}
                    <svg className="w-40 h-40 text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                      <path d="M5 5h30v30H5zm5 5h20v20H10zm55-5h30v30H65zm5 5h20v20H70zm-65 55h30v30H5zm5 5h20v20H10zm70-15h5v5h-5zm0-20h10v5H80zm5 5H80v5h5zm-20 5h5v10h-5zm10 5h5v10h-5zm-30-20h5v10h-5zm15-5h5v5h-5zm5 10h5v5h-5zm10-5h5v5h-5zm-35 25h5v5h-5zm15 10h10v5H65zm10 5h5v5h-5zm5-15h5v10h-5zm-5 5h5v10h-5zm-15-5H60v5h5zm-15-20H45v5h5zm15 10H60v5h5zm-25 0H35v5h5zm10 10H45v5h5zm20 10h5v5h-5zm-10-25h5v5h-5zm15-15H60v5h5z" />
                    </svg>
                  </div>

                  <div className="space-y-1">
                    <span className="text-red-500 text-xs font-mono font-bold block animate-pulse">
                      ⏳ Código PIX expira em: {formatMinSec(pixCountdown)}
                    </span>
                    <span className="text-xs text-gray-300 block font-medium">
                      O pagamento por PIX gera envio 50% mais rápido! Use o botão abaixo para copiar a chave e pagar.
                    </span>
                  </div>

                  {/* Pix Copy Code widget */}
                  <div className="flex gap-2 w-full max-w-sm">
                    <input
                      type="text"
                      readOnly
                      value="00020101021226870014br.gov.bcb.pix2565..."
                      className="bg-black/55 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/60 focus:outline-none w-full font-mono text-center select-all"
                    />
                    <button
                      type="button"
                      onClick={copyPixCode}
                      className="bg-[#FFD400] hover:brightness-110 text-black font-extrabold text-xs px-3.5 py-2 rounded-lg flex items-center space-x-1 cursor-pointer select-none"
                    >
                      <Copy className="w-3.5 h-3.5 shrink-0 text-black" />
                      <span>{isCopied ? "COPIADO" : "COPIAR"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* CREDIT CARD SEGMENT */}
              {formData.paymentMethod === "credit_card" && (
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-4 shadow-xl">
                  <div>
                    <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">Número do Cartão</label>
                    <input
                      type="text"
                      maxLength={19}
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 "))}
                      placeholder="0000 0000 0000 0000"
                      className={`w-full bg-black/55 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400] font-mono ${formErrors.cardNumber ? "border-red-500" : "border-white/10"}`}
                    />
                    {formErrors.cardNumber && <span className="text-[10px] text-red-500 font-bold block mt-1">{formErrors.cardNumber}</span>}
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">Nome impresso no Cartão</label>
                    <input
                      type="text"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange("cardName", e.target.value)}
                      placeholder="Ex: RAFAEL M SILVA"
                      className={`w-full bg-black/55 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400] uppercase ${formErrors.cardName ? "border-red-500" : "border-white/10"}`}
                    />
                    {formErrors.cardName && <span className="text-[10px] text-red-500 font-bold block mt-1">{formErrors.cardName}</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">Validade</label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="MM/AA"
                        value={formData.cardExpiry}
                        onChange={(e) => handleInputChange("cardExpiry", e.target.value.replace(/\s/g, ""))}
                        className={`w-full bg-black/55 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400] font-mono ${formErrors.cardExpiry ? "border-red-500" : "border-white/10"}`}
                      />
                      {formErrors.cardExpiry && <span className="text-[10px] text-red-500 font-bold block mt-1">{formErrors.cardExpiry}</span>}
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">CVC / Código de Segurança</label>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="123"
                        value={formData.cardCvv}
                        onChange={(e) => handleInputChange("cardCvv", e.target.value.replace(/\D/g, ""))}
                        className={`w-full bg-black/55 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400] font-mono ${formErrors.cardCvv ? "border-red-500" : "border-white/10"}`}
                      />
                      {formErrors.cardCvv && <span className="text-[10px] text-red-500 font-bold block mt-1">{formErrors.cardCvv}</span>}
                    </div>
                  </div>

                  {/* Installments chooser dropdown */}
                  <div>
                    <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">Escolher Parcelamento</label>
                    <select
                      value={formData.installments}
                      onChange={(e) => handleInputChange("installments", e.target.value)}
                      className="w-full bg-black/55 border border-white/10 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#FFD400]"
                    >
                      <option value="1">1x de R$ {finalTotal.toFixed(2).replace(".", ",")} (sem juros)</option>
                      <option value="2">2x de R$ {(finalTotal/2).toFixed(2).replace(".", ",")} (sem juros)</option>
                      <option value="3">3x de R$ {(finalTotal/3).toFixed(2).replace(".", ",")} (sem juros)</option>
                      <option value="4">4x de R$ {(finalTotal/4).toFixed(2).replace(".", ",")} (sem juros)</option>
                      <option value="6">6x de R$ {(finalTotal/6).toFixed(2).replace(".", ",")} (sem juros)</option>
                      <option value="10">10x de R$ {(finalTotal/10).toFixed(2).replace(".", ",")} (sem juros)</option>
                      <option value="12">12x de R$ {(finalTotal/12).toFixed(2).replace(".", ",")} (sem juros)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Secure Transaction badge details */}
              <div className="flex justify-between items-center bg-[#05070a]/80 px-4 py-3 border border-white/10 rounded-xl text-[11px] text-gray-400 shadow">
                <span className="flex items-center space-x-1.5 font-medium"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> <span>Transação Protegida SSL</span></span>
                <span>Yampi Gateways ✓</span>
              </div>

            </div>
          )}

          {/* STEP 4: COMPRA CONFIRMADA SUCCESS */}
          {step === 4 && (
            <div className="flex flex-col items-center justify-center text-center space-y-6 py-6 border-transparent">
              
              {/* Confetti simulation block */}
              <div className="relative">
                <div className="absolute inset-0 w-24 h-24 bg-emerald-500/30 rounded-full blur-xl scale-125 animate-pulse" />
                <div className="w-20 h-20 bg-emerald-500 text-slate-950 flex items-center justify-center rounded-full shadow-[0_0_25px_rgba(16,185,129,0.4)] relative">
                  <CheckCircle className="w-12 h-12 stroke-[3]" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-emerald-450 text-xs font-mono font-black uppercase tracking-widest block">SUA COMPRA FOI CONFIRMADA!</span>
                <h3 className="text-2xl sm:text-3.5xl font-extrabold text-white uppercase tracking-tight">
                  Parabéns, {formData.fullName.split(" ")[0]}!
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
                  Seu pedido <b className="text-white font-mono font-bold">#JB-2026-98A{Math.floor(Math.random()*9)}</b> já foi registrado em nosso sistema e está sendo preparado no CD de despacho.
                </p>
              </div>

              {/* Shipping receipt info box */}
              <div className="bg-white/5 w-full max-w-sm rounded-2xl border border-white/10 p-5 text-left space-y-3 font-medium text-xs text-gray-400 shadow-xl">
                <div>
                  <span className="text-[10px] text-gray-500 block">DESTINATÁRIO:</span>
                  <span className="text-white font-bold">{formData.fullName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">DESPACHADO PARA:</span>
                  <span className="text-white">{formData.street}, {formData.number} {formData.complement} {formData.city}/{formData.state}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">MÈTODO:</span>
                  <span className="text-white uppercase font-bold">{formData.paymentMethod === "pix" ? "⚡ PIX SEGURO DE DESCONTO" : "💳 CARTÃO FIXADO EM ATÉ 12X"}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between items-baseline text-sm">
                  <span className="text-white font-bold uppercase text-xs">Total cobrado:</span>
                  <span className="text-[#FFD400] font-extrabold font-mono">R$ {finalTotal.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>

              {/* Delivery and tracking warnings */}
              <div className="bg-white/5 w-full border border-white/10 p-4 rounded-xl flex items-start space-x-3 text-left max-w-md shadow-md">
                <Truck className="w-5 h-5 text-[#FFD400] shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-0.5">
                  <span className="text-xs text-white font-bold">Próximos passos de rastreamento:</span>
                  <p className="text-[11px] text-gray-400 leading-normal">
                    O código nacional dos Correios será gerado em nosso CD e enviado no seu e-mail (<b className="text-gray-300 font-semibold">{formData.email}</b>) e WhatsApp em até 48 horas úteis.
                  </p>
                </div>
              </div>

              {/* Interactive bottom CTA */}
              <div className="pt-2 w-full max-w-xs">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setStep(1);
                  }}
                  className="w-full bg-[#FFD400] hover:brightness-110 text-black font-black text-xs sm:text-sm py-3 px-6 rounded-xl active:scale-95 transition-all duration-200 shadow-md uppercase cursor-pointer"
                >
                  Voltar para a Loja
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Bottom Drawer Control buttons */}
        {step < 4 && (
          <div className="bg-[#05070a]/90 p-6 border-t border-white/10 backdrop-blur-md flex justify-between items-center gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="bg-white/5 hover:bg-white/10 text-white font-bold text-xs py-3.5 px-5 rounded-xl cursor-pointer active:scale-95 transition-all text-center border border-white/10 flex items-center gap-1.5"
              >
                Voltar
              </button>
            ) : (
              <div className="hidden sm:block text-white/35 text-[10px] font-mono select-none">
                🔐 CHECKOUT SEGURO SSL DE ALTA CRIPTOGRAFIA
              </div>
            )}

            <button
              type="button"
              onClick={nextStep}
              className="bg-gradient-to-r from-[#FFD400] to-[#E6BE00] hover:brightness-110 text-black font-black text-xs sm:text-sm py-3.5 px-6 rounded-xl transform active:scale-95 transition-all duration-200 hover:scale-[1.02] shadow-[0_0_20px_rgba(255,212,0,0.3)] flex-1 sm:flex-initial flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{step === 3 ? "CONFIRMAR E PAGAR AGORA" : "IR PARA O PRÓXIMO PASSO"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
