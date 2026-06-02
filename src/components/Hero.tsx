/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Flame, Sparkles, ShieldCheck, Heart, AlertCircle, ShoppingCart } from "lucide-react";
import { PRODUCT_INFO, IMAGES } from "../data";
import { Size } from "../types";

interface HeroProps {
  onAddToCart: (size: Size, secondSize?: Size, quantity?: number) => void;
}

export default function Hero({ onAddToCart }: HeroProps) {
  const [offerType, setOfferType] = useState<"single" | "combo">("combo");
  const [selectedSize, setSelectedSize] = useState<Size>("M");
  const [selectedSize2, setSelectedSize2] = useState<Size>("G");
  const [minutes, setMinutes] = useState(14);
  const [seconds, setSeconds] = useState(59);
  const [activeUsers, setActiveUsers] = useState(142);
  const [activeImage, setActiveImage] = useState<string>(IMAGES.hero);

  const HERO_THUMBNAILS = [
    { id: "h1", src: IMAGES.hero, category: "MODELO ATLETISMO", title: "Veste tamanho G (1,82m - 82kg)" },
    { id: "h2", src: IMAGES.front, category: "FOTO FRONTAL", title: "Frente do Manto centralizado" },
    { id: "h3", src: IMAGES.back, category: "FOTO TRASEIRA", title: "Costas da Camisa 10 Lendária" },
    { id: "h4", src: IMAGES.detail, category: "DETALHE DO ESCUDO", title: "Escudo do Brasil & Jumpman" },
    { id: "h5", src: IMAGES.folded, category: "CAMISA DOBRADA", title: "Manto dobrado e gola reforçada" },
    { id: "h6", src: IMAGES.lifestyle, category: "FOTO LIFESTYLE", title: "Caimento e estilo de rua" },
  ];

  const activeImageLabel = HERO_THUMBNAILS.find(t => t.src === activeImage) || HERO_THUMBNAILS[0];

  // Expiration countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        } else if (minutes > 0) {
          setMinutes((prevMin) => prevMin - 1);
          return 59;
        } else {
          // Restart to give infinite high-converting pressure
          setMinutes(14);
          return 59;
        }
      });
    }, 1000);

    // Active users variations
    const usersTimer = setInterval(() => {
      setActiveUsers((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        const next = prev + delta;
        return next > 200 ? 190 : next < 80 ? 95 : next;
      });
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(usersTimer);
    };
  }, [minutes]);

  const handleCtaClick = () => {
    onAddToCart(selectedSize, offerType === "combo" ? selectedSize2 : undefined, offerType === "combo" ? 2 : 1);
  };

  return (
    <section className="relative overflow-hidden bg-transparent text-white pt-6 pb-16 lg:py-24">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-400/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LADO ESQUERDO: COPYWRITING & OFERTA */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#ffd400] to-[#ff9900] text-black text-[10px] font-black rounded tracking-widest uppercase">
                🔥 EDIÇÃO LIMITADA 2026
              </span>
              <span className="inline-flex items-center space-x-1.5 bg-white/5 border border-white/10 text-gray-300 text-[11px] px-3 py-1 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-[#FFD400] animate-pulse" />
                <span>{activeUsers} pessoas vendo agora</span>
              </span>
            </div>
 
            {/* headline principal */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-5xl sm:text-7xl font-extrabold leading-[0.9] tracking-tighter text-white uppercase select-none">
                O MANTO <br />
                QUE VOCÊ <br />
                <span className="text-[#FFD400] font-black relative drop-shadow-[0_0_15px_rgba(255,212,0,0.15)] block mt-2">RESPEITA!</span>
              </h1>
              <p className="text-[#FFD400] text-xs sm:text-sm tracking-widest font-extrabold uppercase font-mono flex items-center space-x-2 pt-2">
                <span>⚡ CO-CREATION JORDAN × BRASIL</span>
              </p>
            </div>

            {/* subheadline */}
            <p className="text-lg sm:text-2xl font-bold text-white/90 font-sans tracking-tight">
              A fusão perfeita entre o legado Jordan e a paixão pelo futebol brasileiro.
            </p>

            {/* texto de apoio */}
            <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-xl">
              Uma peça exclusiva para quem vive o futebol, o streetwear e a cultura de vanguarda. Engenharia têxtil respirável Dri-Mesh com acabamentos premium de alta durabilidade para você destacar o seu estilo com elegância.
            </p>

            {/* PROMO SELECTOR & OFFER CHOOSER */}
            <div className="space-y-4 max-w-lg">
              <span className="text-xs font-mono font-bold text-[#FFD400] block uppercase tracking-widest animate-pulse">
                ⚡ SELECIONE SUA OPÇÃO DE COMPRA:
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                {/* OFFER 1: COMBO SPECIAL (2 Jerseys) */}
                <button
                  type="button"
                  onClick={() => setOfferType("combo")}
                  className={`text-left p-4 rounded-2xl border flex flex-col justify-between relative overflow-hidden transition-all duration-300 pointer-events-auto cursor-pointer ${
                    offerType === "combo"
                      ? "bg-slate-900/90 border-[#FFD400] ring-1 ring-[#FFD400] shadow-[0_0_20px_rgba(255,212,0,0.15)] scale-[1.02]"
                      : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  {/* Badge */}
                  <span className="absolute top-0 right-0 bg-[#FFD400] text-black text-[9px] font-black px-2.5 py-0.5 rounded-bl-lg uppercase font-mono tracking-widest animate-bounce">
                    MELHOR COMBO
                  </span>

                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Leve 2 Mantos</span>
                    <h4 className="text-base font-black text-white uppercase mt-0.5">SUPER COMBO CAMPEÃO</h4>
                    <span className="text-[10px] text-emerald-400 font-bold block mt-1">✓ FRETE EXPRESSO GRÁTIS</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-baseline justify-between w-full">
                    <div>
                      <span className="text-[10px] text-white/40 block line-through">R$ 279,80</span>
                      <span className="text-xl font-black text-[#FFD400] font-mono">R$ 199,90</span>
                    </div>
                    <span className="text-[10px] text-emerald-450 font-bold underline font-mono">Manto sai a R$ 99,95!</span>
                  </div>
                </button>

                {/* OFFER 2: SINGLE UNIT */}
                <button
                  type="button"
                  onClick={() => setOfferType("single")}
                  className={`text-left p-4 rounded-2xl border flex flex-col justify-between relative overflow-hidden transition-all duration-300 pointer-events-auto cursor-pointer ${
                    offerType === "single"
                      ? "bg-slate-900/90 border-slate-700 ring-1 ring-slate-800 scale-[1.02]"
                      : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Leve 1 Manto</span>
                    <h4 className="text-base font-black text-white uppercase mt-0.5">UNIDADE INDIVIDUAL</h4>
                    <span className="text-[10px] text-slate-400 block mt-1">Ideal para presente único</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-baseline justify-between w-full">
                    <div>
                      <span className="text-[10px] text-white/40 block line-through">R$ 299,90</span>
                      <span className="text-xl font-black text-white/95 font-mono">R$ 139,90</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">R$ 139,90 cada</span>
                  </div>
                </button>

              </div>
            </div>

            {/* Countdown Urgent Banner */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl relative overflow-hidden backdrop-blur-sm max-w-lg">
              <div className="flex items-center justify-between text-xs font-mono font-medium text-gray-300">
                <span className="flex items-center gap-1.5 text-red-400 font-bold animate-pulse">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>PREÇOS EXCLUSIVOS POR:</span>
                </span>
                <span className="text-[#FFD400] font-black tracking-widest text-sm bg-black/45 px-2.5 py-1 rounded">
                  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </span>
              </div>
              <span className="text-[10px] text-emerald-450 block font-semibold mt-2">
                ✓ Compre com inteligência: Economize R$ 79,90 no Combo Campeão e parcele em até 12x sem juros!
              </span>
            </div>

            {/* SELETOR DE TAMANHO(S) */}
            <div className="space-y-4 max-w-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/70">
                  {offerType === "combo" ? "Escolha os tamanhos do seu Combo:" : "Escolha seu tamanho:"}
                </span>
              </div>

              {offerType === "combo" ? (
                <div className="space-y-3.5 bg-black/40 border border-white/5 p-4 rounded-2xl">
                  {/* Size Camisa 1 */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-[#FFD450] font-bold uppercase tracking-wider block">Camisa #1 - Tamanho:</span>
                    <div className="flex flex-wrap gap-2">
                      {(["P", "M", "G", "GG", "XG"] as Size[]).map((size) => (
                        <button
                          key={`c1-${size}`}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-200 border ${
                            selectedSize === size
                              ? "bg-[#FFD400] border-[#FFD400] text-black font-black scale-105 shadow-[0_0_10px_rgba(255,212,0,0.25)]"
                              : "bg-white/5 border-white/10 text-white hover:border-white/20"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Camisa 2 */}
                  <div className="space-y-1.5 border-t border-white/5 pt-2.5">
                    <span className="text-[11px] text-[#FFD450] font-bold uppercase tracking-wider block">Camisa #2 - Tamanho:</span>
                    <div className="flex flex-wrap gap-2">
                      {(["P", "M", "G", "GG", "XG"] as Size[]).map((size) => (
                        <button
                          key={`c2-${size}`}
                          type="button"
                          onClick={() => setSelectedSize2(size)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-200 border ${
                            selectedSize2 === size
                              ? "bg-[#FFD400] border-[#FFD400] text-black font-black scale-105 shadow-[0_0_10px_rgba(255,212,0,0.25)]"
                              : "bg-white/5 border-white/10 text-white hover:border-white/20"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2 sm:space-x-3">
                  {(["P", "M", "G", "GG", "XG"] as Size[]).map((size) => (
                    <button
                      key={`single-${size}`}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 sm:w-13 sm:h-13 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-200 border-2 ${
                        selectedSize === size
                          ? "bg-[#FFD400] border-[#FFD400] text-black scale-110 shadow-[0_0_15px_rgba(255,212,0,0.35)] btn-pulse"
                          : "bg-white/5 border-white/10 text-white hover:border-white/20"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* BOTÃO CTA PRINCIPAL */}
            <div className="pt-2 max-w-lg">
              <button
                onClick={handleCtaClick}
                className="w-full flex items-center justify-center space-x-3 bg-[#FFD400] hover:brightness-110 text-black font-black text-sm sm:text-lg tracking-wider py-4 sm:py-5 px-8 rounded-2xl transition-all duration-300 hover:scale-[1.03] btn-pulse group relative overflow-hidden cursor-pointer uppercase font-extrabold"
              >
                {/* Shiny reflex filter */}
                <div className="absolute inset-0 w-1/2 h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-shine" />
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-black group-hover:rotate-6 transition-transform" />
                <span>🛒 Garantir Meu Desconto Especial Agora</span>
              </button>
              
              {/* Trust elements below CTA */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] sm:text-xs text-white/40 text-center font-medium">
                <span className="flex items-center justify-center space-x-1 py-1 rounded-lg bg-white/5 border border-white/5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Design Exclusivo</span>
                </span>
                <span className="flex items-center justify-center space-x-1 py-1 rounded-lg bg-white/5 border border-white/5">
                  <Flame className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                  <span>Tecido Premium</span>
                </span>
                <span className="flex items-center justify-center space-x-1 py-1 rounded-lg bg-white/5 border border-white/5">
                  <Heart className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Envio Rápido</span>
                </span>
              </div>
            </div>

          </div>

          {/* LADO DIREITO: IMAGEM PRINCIPAL COM SOMBRAS E PROFUNDIDADE */}
          <div className="lg:col-span-5 relative flex flex-col items-center lg:items-end space-y-4">
            
            {/* Background glowing frame for image */}
            <div className="absolute inset-0 bg-yellow-400/10 rounded-full blur-3xl scale-75 -z-10 animate-pulse" />
            
            {/* Main Picture Wrapper */}
            <div className="relative max-w-sm sm:max-w-md w-full rounded-2xl overflow-hidden aspect-[3/4] shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-slate-800/80 group">
              <img
                src={activeImage}
                alt="Jogador vestindo Camisa Jordan x Brasil"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              {/* Visual overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80" />
              
              {/* On-image overlay widgets */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 border border-slate-800 backdrop-blur-md p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#FFD400] font-mono tracking-widest block uppercase font-black">
                    {activeImageLabel.category}
                  </span>
                  <span className="text-xs text-white font-bold">
                    {activeImageLabel.title}
                  </span>
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

            </div>

            {/* Selector de Angulos em Miniatura */}
            <div className="w-full max-w-sm sm:max-w-md grid grid-cols-6 gap-2 pt-1">
              {HERO_THUMBNAILS.map((thumb) => {
                const isActive = activeImage === thumb.src;
                return (
                  <button
                    key={thumb.id}
                    type="button"
                    onClick={() => setActiveImage(thumb.src)}
                    className={`relative aspect-[3/4] rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer hover:scale-[1.06] ${
                      isActive
                        ? "border-[#FFD400] ring-1 ring-[#FFD400] scale-105 shadow-[0_0_10px_rgba(255,212,0,0.25)]"
                        : "border-slate-800 hover:border-slate-700 hover:brightness-110"
                    }`}
                  >
                    <img
                      src={thumb.src}
                      alt={thumb.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className={`absolute inset-0 transition-colors ${isActive ? "bg-[#FFD400]/5" : "bg-black/35 hover:bg-transparent"}`} />
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
