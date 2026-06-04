/**
 * CheckoutModal.tsx — integrado com TriboPay via /api/checkout
 */

import React, { useState, useEffect } from "react";
import {
  X, Lock, ShieldCheck, Ticket, CreditCard, Sparkles,
  CheckCircle, Truck, ArrowRight, Copy, Loader2, AlertCircle,
} from "lucide-react";
import { Size, CartItem, CheckoutDetails } from "../types";
import { PRODUCT_INFO, IMAGES } from "../data";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSize: Size;
  secondSize?: Size;
  initialQty?: number;
  onUpdateCartCount: (count: number) => void;
}

interface CheckoutApiResponse {
  success: boolean;
  orderId?: string;
  transactionHash?: string;
  status?: string;
  pixCode?: string;
  pixQrCode?: string;
  pixExpiresAt?: string;
  approved?: boolean;
  error?: string;
}

export default function CheckoutModal({
  isOpen, onClose, selectedSize, secondSize, initialQty = 1, onUpdateCartCount,
}: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [cart, setCart] = useState<CartItem>({
    id: "j1",
    name: "Camisa Jordan x Brasil Edição Especial 2026",
    price: PRODUCT_INFO.originalPrice,
    promoPrice: PRODUCT_INFO.promoPrice,
    size: selectedSize,
    secondSize,
    quantity: initialQty,
    image: IMAGES.front,
  });

  useEffect(() => {
    if (isOpen) setCart(prev => ({ ...prev, size: selectedSize, secondSize, quantity: initialQty }));
  }, [selectedSize, secondSize, initialQty, isOpen]);

  const [formData, setFormData] = useState<CheckoutDetails>({
    fullName: "", email: "", phone: "", cpf: "",
    cep: "", street: "", number: "", complement: "",
    neighborhood: "", city: "", state: "",
    paymentMethod: "pix",
    cardNumber: "", cardName: "", cardExpiry: "", cardCvv: "", installments: "1",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<CheckoutApiResponse | null>(null);
  const [pixCountdown, setPixCountdown] = useState(299);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => { onUpdateCartCount(isOpen ? cart.quantity : 0); }, [cart.quantity, isOpen]);

  useEffect(() => {
    if (step === 4 && formData.paymentMethod === "pix" && pixCountdown > 0) {
      const timer = setInterval(() => setPixCountdown(p => p - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, formData.paymentMethod, pixCountdown]);

  if (!isOpen) return null;

  const isComboActive = cart.quantity >= 2;
  const numPairs = Math.floor(cart.quantity / 2);
  const numSingles = cart.quantity % 2;
  const subtotal = (numPairs * 199.90) + (numSingles * cart.promoPrice);
  const couponDiscount = couponApplied ? subtotal * discountPercent : 0;
  const methodDiscount = formData.paymentMethod === "pix" ? (subtotal - couponDiscount) * 0.05 : 0;
  const finalTotal = subtotal - couponDiscount - methodDiscount;

  const handleApplyCoupon = () => {
    const raw = couponCode.trim().toUpperCase();
    if (raw === "MANTO10") { setCouponApplied(true); setDiscountPercent(0.10); setFormErrors(p => ({ ...p, coupon: "" })); }
    else if (raw === "BRASIL5") { setCouponApplied(true); setDiscountPercent(0.05); setFormErrors(p => ({ ...p, coupon: "" })); }
    else setFormErrors(p => ({ ...p, coupon: "Cupom inválido!" }));
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setFormData(p => ({ ...p, cep: raw }));
    if (raw.length === 8) {
      try {
        const r = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
        const data = await r.json();
        if (!data.erro) setFormData(p => ({
          ...p,
          street: data.logradouro || p.street,
          neighborhood: data.bairro || p.neighborhood,
          city: data.localidade || p.city,
          state: data.uf || p.state,
        }));
      } catch {}
    }
  };

  const handleInputChange = (field: keyof CheckoutDetails, value: string) => {
    setFormData(p => ({ ...p, [field]: value }));
    if (formErrors[field]) setFormErrors(p => ({ ...p, [field]: "" }));
  };

  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = "Nome é obrigatório";
    if (!formData.email.includes("@")) errors.email = "E-mail inválido";
    if (formData.phone.replace(/\D/g, "").length < 10) errors.phone = "Telefone inválido";
    if (formData.cpf.replace(/\D/g, "").length < 11) errors.cpf = "CPF inválido";
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
      if (!formData.cardExpiry.includes("/")) errors.cardExpiry = "Validade incorreta";
      if (formData.cardCvv.length < 3) errors.cardCvv = "CVV inválido";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitPayment = async () => {
    setIsSubmitting(true);
    setApiError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, cart, finalTotal, subtotal, couponCode: couponApplied ? couponCode : null, couponDiscount, pixDiscount: methodDiscount }),
      });
      const data: CheckoutApiResponse = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Erro ao processar pagamento");
      setApiResponse(data);
      if (data.pixExpiresAt) {
        const diff = Math.floor((new Date(data.pixExpiresAt).getTime() - Date.now()) / 1000);
        setPixCountdown(Math.max(0, diff));
      }
      setStep(4);
    } catch (err: any) {
      setApiError(err.message || "Erro desconhecido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1) setStep(2);
    else if (step === 2) { if (validateStep2()) setStep(3); }
    else if (step === 3) { if (validateStep3()) submitPayment(); }
  };

  const prevStep = () => {
    if (step === 2) setStep(1);
    if (step === 3) { setStep(2); setApiError(null); }
  };

  const copyPixCode = () => {
    const code = apiResponse?.pixCode || "";
    if (code) { navigator.clipboard.writeText(code); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000); }
  };

  const formatMinSec = (s: number) => `${Math.floor(s / 60)}:${(s % 60 < 10 ? "0" : "") + (s % 60)}`;
  const pixCodeDisplay = apiResponse?.pixCode ? apiResponse.pixCode.slice(0, 38) + "..." : "Aguardando...";

  return (
    <div className="fixed inset-0 z-50 bg-[#05070a]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#05070a] w-full max-w-2xl rounded-3xl border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col relative my-8">

        {/* Header */}
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
            <button onClick={onClose} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress */}
        {step < 4 && (
          <div className="bg-black/20 px-6 py-3 border-b border-white/5 flex items-center justify-between text-[11px] font-mono tracking-wide">
            {["1. Carrinho", "2. Entrega", "3. Pagamento"].map((label, i) => (
              <React.Fragment key={label}>
                <span className={step >= i + 1 ? "text-[#FFD400] font-bold" : "text-gray-500"}>{label}</span>
                {i < 2 && <div className="h-0.5 w-12 bg-white/5 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[70vh]">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex space-x-4 items-center shadow-xl">
                <div className="w-20 h-20 bg-black/45 rounded-xl overflow-hidden border border-white/10 shrink-0">
                  <img src={cart.image} alt={cart.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#FFD400] font-mono tracking-widest font-black uppercase">JORDAN X BRASIL</span>
                  <h4 className="text-sm font-bold text-white uppercase truncate">{cart.name}</h4>
                  {cart.quantity === 1 ? (
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-gray-400 font-mono">Tamanho:</span>
                      <select value={cart.size} onChange={e => setCart(p => ({ ...p, size: e.target.value as Size }))} className="bg-black/60 border border-white/10 text-white text-xs rounded px-2 py-0.5 focus:outline-none focus:border-[#FFD400] cursor-pointer">
                        {(["P","M","G","GG","XG"] as Size[]).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[{label:"Camisa #1",key:"size"},{label:"Camisa #2",key:"secondSize"}].map(({label,key}) => (
                        <div key={key} className="flex flex-col bg-black/40 p-1.5 rounded border border-white/5">
                          <span className="text-[9px] text-gray-500 font-mono block mb-0.5">{label}</span>
                          <select value={(cart[key as keyof CartItem] as string) || "G"} onChange={e => setCart(p => ({ ...p, [key]: e.target.value as Size }))} className="bg-slate-900 border border-white/10 text-white text-[11px] rounded px-1.5 py-0.5 focus:outline-none focus:border-[#FFD400] font-bold cursor-pointer">
                            {(["P","M","G","GG","XG"] as Size[]).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2.5 bg-black/50 px-2 py-1 rounded-lg border border-white/10 select-none">
                  <button type="button" onClick={() => setCart(p => ({ ...p, quantity: Math.max(1, p.quantity - 1) }))} className="text-gray-400 hover:text-white font-extrabold text-xs px-1 cursor-pointer">-</button>
                  <span className="text-xs text-white font-black font-mono w-4 text-center">{cart.quantity}</span>
                  <button type="button" onClick={() => setCart(p => ({ ...p, quantity: Math.min(5, p.quantity + 1), secondSize: p.secondSize || "G" }))} className="text-gray-400 hover:text-white font-extrabold text-xs px-1 cursor-pointer">+</button>
                </div>
              </div>

              {cart.quantity === 1 ? (
                <button type="button" onClick={() => setCart(p => ({ ...p, quantity: 2, secondSize: p.secondSize || "G" }))} className="w-full bg-[#FFD400]/10 border border-dashed border-[#FFD400]/40 p-4 rounded-2xl flex items-center justify-between hover:bg-[#FFD400]/15 transition-all text-left group cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-5 h-5 text-[#FFD400] animate-pulse shrink-0" />
                    <div>
                      <span className="text-xs text-[#FFD400] font-black uppercase tracking-wider block">COMBO: 2 CAMISAS POR R$ 199,90 ➔</span>
                      <span className="text-[11px] text-gray-300">Leve a segunda por apenas R$ 60,00 a mais!</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-black bg-[#FFD400] px-3 py-1.5 rounded-lg shrink-0">ATIVAR</span>
                </button>
              ) : (
                <div className="w-full bg-emerald-950/15 border border-emerald-500/25 p-4 rounded-2xl flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-gray-300">✓ Combo ativado — <b className="text-white">R$ 99,95 por camisa</b>. Economia de <b className="text-[#FFD450]">R$ 79,90</b>!</span>
                </div>
              )}

              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3">
                <Ticket className="w-4 h-4 text-[#FFD400] shrink-0 animate-bounce" />
                <span className="text-xs text-gray-300 font-bold uppercase shrink-0">Cupom:</span>
                <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="MANTO10" disabled={couponApplied} className="flex-1 bg-black/55 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFD400] uppercase disabled:opacity-50 font-bold" />
                <button type="button" onClick={handleApplyCoupon} disabled={couponApplied} className="bg-[#FFD400] hover:brightness-110 disabled:bg-white/5 text-black font-extrabold text-xs px-3.5 py-1.5 rounded-lg cursor-pointer disabled:text-white/20">
                  {couponApplied ? "APLICADO" : "APLICAR"}
                </button>
              </div>
              {formErrors.coupon && <span className="text-[11px] text-red-400 font-bold block -mt-4">⚠ {formErrors.coupon}</span>}
              {couponApplied && <span className="text-[11px] text-emerald-400 font-bold block -mt-4">✓ {discountPercent * 100}% de desconto aplicado!</span>}

              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-2.5">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Subtotal:</span><span className="font-mono font-bold text-gray-300">R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                </div>
                {couponApplied && <div className="flex justify-between text-xs text-emerald-400"><span>Cupom ({discountPercent*100}%):</span><span className="font-mono font-bold">-R$ {couponDiscount.toFixed(2).replace(".", ",")}</span></div>}
                {formData.paymentMethod === "pix" && methodDiscount > 0 && <div className="flex justify-between text-xs text-emerald-400"><span>Desconto PIX (5%):</span><span className="font-mono font-bold">-R$ {methodDiscount.toFixed(2).replace(".", ",")}</span></div>}
                <div className="flex justify-between text-xs text-gray-400"><span>Frete:</span><span className="font-mono font-black text-emerald-400 text-[10px] uppercase tracking-widest">✓ GRÁTIS</span></div>
                <div className="border-t border-white/10 pt-2 flex justify-between items-baseline">
                  <span className="text-xs text-white font-extrabold uppercase">Total:</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#FFD400] font-mono">R$ {finalTotal.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-[#FFD400] block uppercase tracking-wider">📂 IDENTIFICAÇÃO & ENTREGA</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {label:"Nome Completo",field:"fullName",placeholder:"Rafael Machado Silva",type:"text"},
                  {label:"E-mail",field:"email",placeholder:"seuemail@exemplo.com",type:"email"},
                  {label:"WhatsApp",field:"phone",placeholder:"(11) 99999-9999",type:"tel"},
                  {label:"CPF",field:"cpf",placeholder:"000.000.000-00",type:"text"},
                ].map(({label,field,placeholder,type}) => (
                  <div key={field}>
                    <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">{label}</label>
                    <input type={type} value={formData[field as keyof CheckoutDetails]} onChange={e => handleInputChange(field as keyof CheckoutDetails, e.target.value)} placeholder={placeholder}
                      className={`w-full bg-black/55 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400] ${formErrors[field] ? "border-red-500" : "border-white/10"}`} />
                    {formErrors[field] && <span className="text-[10px] text-red-500 font-bold block mt-1">{formErrors[field]}</span>}
                  </div>
                ))}
              </div>
              <span className="block text-xs font-mono font-bold text-[#FFD400] uppercase tracking-wider px-2.5 py-1 bg-white/5 border border-white/10 rounded">🚚 ENDEREÇO DE ENTREGA</span>
              <div className="grid grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">CEP</label>
                  <input type="text" maxLength={8} value={formData.cep} onChange={handleCepChange} placeholder="01001000" className={`w-full bg-black/55 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400] font-mono ${formErrors.cep ? "border-red-500" : "border-white/10"}`} />
                  {formErrors.cep && <span className="text-[10px] text-red-500 font-bold block mt-1">{formErrors.cep}</span>}
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">Logradouro</label>
                  <input type="text" value={formData.street} onChange={e => handleInputChange("street", e.target.value)} placeholder="Rua das Acácias" className={`w-full bg-black/55 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400] ${formErrors.street ? "border-red-500" : "border-white/10"}`} />
                  {formErrors.street && <span className="text-[10px] text-red-500 font-bold block mt-1">{formErrors.street}</span>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">Número</label>
                  <input type="text" value={formData.number} onChange={e => handleInputChange("number", e.target.value)} placeholder="123" className={`w-full bg-black/55 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400] ${formErrors.number ? "border-red-500" : "border-white/10"}`} />
                  {formErrors.number && <span className="text-[10px] text-red-500 font-bold block mt-1">{formErrors.number}</span>}
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">Complemento</label>
                  <input type="text" value={formData.complement} onChange={e => handleInputChange("complement", e.target.value)} placeholder="Apto 101" className="w-full bg-black/55 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400]" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3.5">
                {[{label:"Bairro",field:"neighborhood",placeholder:"Centro"},{label:"Cidade",field:"city",placeholder:"São Paulo"},{label:"UF",field:"state",placeholder:"SP"}].map(({label,field,placeholder}) => (
                  <div key={field}>
                    <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">{label}</label>
                    <input type="text" maxLength={field==="state"?2:undefined} value={formData[field as keyof CheckoutDetails]} onChange={e => handleInputChange(field as keyof CheckoutDetails, e.target.value)} placeholder={placeholder} className="w-full bg-black/55 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => handleInputChange("paymentMethod","pix")} className={`p-4 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${formData.paymentMethod==="pix"?"bg-emerald-950/20 border-emerald-500 text-emerald-400 scale-[1.02]":"bg-[#05070a]/90 border-white/10 text-white/50 hover:text-white"}`}>
                  <span className="font-extrabold text-sm font-mono">⚡ PIX</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">✓ 5% DESCONTO</span>
                </button>
                <button type="button" onClick={() => handleInputChange("paymentMethod","credit_card")} className={`p-4 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${formData.paymentMethod==="credit_card"?"bg-yellow-950/20 border-[#FFD400] text-[#FFD400] scale-[1.02]":"bg-[#05070a]/90 border-white/10 text-white/50 hover:text-white"}`}>
                  <CreditCard className="w-5 h-5 shrink-0" />
                  <span className="font-extrabold text-sm uppercase">Cartão de Crédito</span>
                  <span className="text-[10px] text-[#FFD400] font-bold">ATÉ 12X SEM JUROS</span>
                </button>
              </div>

              {formData.paymentMethod === "pix" && (
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-center space-y-2">
                  <p className="text-xs text-gray-300">Ao confirmar, um QR code PIX real será gerado. O desconto de 5% já está incluso.</p>
                  <p className="text-2xl font-black text-[#FFD400] font-mono">R$ {finalTotal.toFixed(2).replace(".",",")}</p>
                </div>
              )}

              {formData.paymentMethod === "credit_card" && (
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-4">
                  <div>
                    <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">Número do Cartão</label>
                    <input type="text" maxLength={19} value={formData.cardNumber} onChange={e => handleInputChange("cardNumber", e.target.value.replace(/\D/g,"").replace(/(\d{4})(?=\d)/g,"$1 "))} placeholder="0000 0000 0000 0000" className={`w-full bg-black/55 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400] font-mono ${formErrors.cardNumber?"border-red-500":"border-white/10"}`} />
                    {formErrors.cardNumber && <span className="text-[10px] text-red-500 font-bold block mt-1">{formErrors.cardNumber}</span>}
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">Nome no Cartão</label>
                    <input type="text" value={formData.cardName} onChange={e => handleInputChange("cardName", e.target.value)} placeholder="RAFAEL M SILVA" className={`w-full bg-black/55 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400] uppercase ${formErrors.cardName?"border-red-500":"border-white/10"}`} />
                    {formErrors.cardName && <span className="text-[10px] text-red-500 font-bold block mt-1">{formErrors.cardName}</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">Validade (MM/AA)</label>
                      <input type="text" maxLength={5} placeholder="12/28" value={formData.cardExpiry} onChange={e => handleInputChange("cardExpiry", e.target.value)} className={`w-full bg-black/55 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400] font-mono ${formErrors.cardExpiry?"border-red-500":"border-white/10"}`} />
                      {formErrors.cardExpiry && <span className="text-[10px] text-red-500 font-bold block mt-1">{formErrors.cardExpiry}</span>}
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">CVV</label>
                      <input type="text" maxLength={4} placeholder="123" value={formData.cardCvv} onChange={e => handleInputChange("cardCvv", e.target.value.replace(/\D/g,""))} className={`w-full bg-black/55 border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD400] font-mono ${formErrors.cardCvv?"border-red-500":"border-white/10"}`} />
                      {formErrors.cardCvv && <span className="text-[10px] text-red-500 font-bold block mt-1">{formErrors.cardCvv}</span>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 font-bold uppercase mb-1">Parcelamento</label>
                    <select value={formData.installments} onChange={e => handleInputChange("installments", e.target.value)} className="w-full bg-black/55 border border-white/10 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#FFD400]">
                      {[1,2,3,4,6,10,12].map(n => <option key={n} value={String(n)}>{n}x de R$ {(finalTotal/n).toFixed(2).replace(".",",")} (sem juros)</option>)}
                    </select>
                  </div>
                </div>
              )}

              {apiError && (
                <div className="flex items-start gap-3 bg-red-950/30 border border-red-500/40 p-4 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300 font-medium">{apiError}</p>
                </div>
              )}

              <div className="flex justify-between items-center bg-[#05070a]/80 px-4 py-3 border border-white/10 rounded-xl text-[11px] text-gray-400">
                <span className="flex items-center space-x-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /><span>Transação Protegida SSL</span></span>
                <span>TriboPay ✓</span>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="flex flex-col items-center justify-center text-center space-y-6 py-6">
              {formData.paymentMethod === "pix" && apiResponse?.pixCode && (
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col items-center space-y-4 w-full">
                  <span className="text-xs font-bold text-[#FFD400] uppercase tracking-widest">⚡ PAGUE COM PIX AGORA</span>
                  <div className="bg-white p-3 rounded-xl">
                    {apiResponse.pixQrCode ? (
                      <img src={`data:image/png;base64,${apiResponse.pixQrCode}`} alt="QR Code PIX" className="w-40 h-40" />
                    ) : (
                      <div className="w-40 h-40 flex items-center justify-center text-gray-400 text-xs">QR indisponível</div>
                    )}
                  </div>
                  <span className="text-red-400 text-xs font-mono font-bold animate-pulse">⏳ Expira em: {formatMinSec(pixCountdown)}</span>
                  <div className="flex gap-2 w-full max-w-sm">
                    <input type="text" readOnly value={pixCodeDisplay} className="bg-black/55 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/60 focus:outline-none w-full font-mono text-center select-all" />
                    <button type="button" onClick={copyPixCode} className="bg-[#FFD400] hover:brightness-110 text-black font-extrabold text-xs px-3.5 py-2 rounded-lg flex items-center space-x-1 cursor-pointer">
                      <Copy className="w-3.5 h-3.5 shrink-0" /><span>{isCopied?"COPIADO":"COPIAR"}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400">Confirmação por e-mail em até 5 min após o pagamento.</p>
                </div>
              )}

              {formData.paymentMethod === "credit_card" && (
                <div className="relative">
                  <div className="absolute inset-0 w-24 h-24 bg-emerald-500/30 rounded-full blur-xl scale-125 animate-pulse" />
                  <div className="w-20 h-20 bg-emerald-500 text-slate-950 flex items-center justify-center rounded-full shadow-[0_0_25px_rgba(16,185,129,0.4)] relative">
                    <CheckCircle className="w-12 h-12 stroke-[3]" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <span className="text-emerald-400 text-xs font-mono font-black uppercase tracking-widest block">
                  {formData.paymentMethod==="pix" ? "PIX GERADO COM SUCESSO!" : "PAGAMENTO APROVADO!"}
                </span>
                <h3 className="text-2xl font-extrabold text-white uppercase">
                  {formData.paymentMethod==="credit_card" ? `Parabéns, ${formData.fullName.split(" ")[0]}!` : `Quase lá, ${formData.fullName.split(" ")[0]}!`}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-md mx-auto">
                  Pedido <b className="text-white font-mono">#{apiResponse?.orderId?.slice(-8).toUpperCase() || "—"}</b> registrado com sucesso.
                </p>
              </div>

              <div className="bg-white/5 w-full max-w-sm rounded-2xl border border-white/10 p-5 text-left space-y-3 text-xs text-gray-400">
                <div><span className="text-[10px] text-gray-500 block">DESTINATÁRIO:</span><span className="text-white font-bold">{formData.fullName}</span></div>
                <div><span className="text-[10px] text-gray-500 block">ENDEREÇO:</span><span className="text-white">{formData.street}, {formData.number} — {formData.city}/{formData.state}</span></div>
                <div className="border-t border-white/10 pt-3 flex justify-between items-baseline text-sm">
                  <span className="text-white font-bold uppercase text-xs">Total:</span>
                  <span className="text-[#FFD400] font-extrabold font-mono">R$ {finalTotal.toFixed(2).replace(".",",")}</span>
                </div>
              </div>

              <div className="bg-white/5 w-full border border-white/10 p-4 rounded-xl flex items-start space-x-3 text-left max-w-md">
                <Truck className="w-5 h-5 text-[#FFD400] shrink-0 mt-0.5 animate-pulse" />
                <p className="text-[11px] text-gray-400 leading-normal">
                  Código de rastreamento enviado para <b className="text-gray-300">{formData.email}</b> em até 48h úteis após confirmação do pagamento.
                </p>
              </div>

              <button type="button" onClick={() => { onClose(); setStep(1); setApiResponse(null); }} className="w-full max-w-xs bg-[#FFD400] hover:brightness-110 text-black font-black text-xs sm:text-sm py-3 px-6 rounded-xl active:scale-95 transition-all uppercase cursor-pointer">
                Voltar para a Loja
              </button>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        {step < 4 && (
          <div className="bg-[#05070a]/90 p-6 border-t border-white/10 flex justify-between items-center gap-3">
            {step > 1 ? (
              <button type="button" onClick={prevStep} disabled={isSubmitting} className="bg-white/5 hover:bg-white/10 text-white font-bold text-xs py-3.5 px-5 rounded-xl cursor-pointer active:scale-95 transition-all border border-white/10 disabled:opacity-50">
                Voltar
              </button>
            ) : (
              <div className="hidden sm:block text-white/35 text-[10px] font-mono select-none">🔐 CHECKOUT SEGURO SSL</div>
            )}
            <button type="button" onClick={nextStep} disabled={isSubmitting} className="bg-gradient-to-r from-[#FFD400] to-[#E6BE00] hover:brightness-110 text-black font-black text-xs sm:text-sm py-3.5 px-6 rounded-xl transform active:scale-95 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,212,0,0.3)] flex-1 sm:flex-initial flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70">
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>PROCESSANDO...</span></>
              ) : (
                <><span>{step === 3 ? "CONFIRMAR E PAGAR AGORA" : "IR PARA O PRÓXIMO PASSO"}</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
