/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Lock, FileText, HelpCircle, ShieldCheck, Mail, Phone, Flame } from "lucide-react";
import { PRODUCT_INFO } from "../data";
import { LegalTab } from "./LegalPagesModal";

interface FooterProps {
  onCtaClick: () => void;
  onLegalPageClick: (tab: LegalTab) => void;
}

export default function Footer({ onCtaClick, onLegalPageClick }: FooterProps) {
  return (
    <footer className="bg-transparent text-white relative">
      
      {/* 1. SEÇÃO CTA FINAL (Impacto de alta voltagem) */}
      <section className="relative overflow-hidden py-20 px-4 border-t border-white/10">
        
        {/* Background glowing sports light mock */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-400/2 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10 animate-fade-in-up">
          
          <div className="inline-flex items-center space-x-1.5 bg-red-650 text-white font-mono font-black text-[10px] tracking-widest px-3.5 py-1.5 rounded-full uppercase animate-pulse">
            <Flame className="w-4 h-4 fill-current text-white animate-bounce" />
            <span>ÚLTIMAS UNIDADES DO LOTE 2026</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl sm:text-6xl font-black italic tracking-tight uppercase leading-none">
              Não fique sem a sua.
            </h2>
            <p className="text-base sm:text-xl text-white/70 max-w-xl mx-auto font-medium">
              A edição mais desejada do momento pode esgotar a qualquer instante.
            </p>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 max-w-sm mx-auto flex flex-col items-center shadow-2xl">
            <span className="text-xs text-white/40 block line-through">De R$ 299,90</span>
            <div className="text-sm text-white/60 font-bold block mt-1">Por apenas:</div>
            <div className="text-4xl sm:text-5xl font-black text-[#FFD400] tracking-tight font-mono mt-0.5">
              R$ {PRODUCT_INFO.promoPrice.toFixed(2).replace(".", ",")}
            </div>
            <span className="text-[11px] text-emerald-450 font-mono block mt-1.5 font-bold">
              ✓ Frete Expresso Grátis Seguro incluído para todo o país
            </span>
          </div>

          {/* Botão gigante do CTA final */}
          <div className="max-w-lg mx-auto">
            <button
              onClick={onCtaClick}
              className="w-full bg-[#FFD400] hover:brightness-110 text-black font-black text-base sm:text-xl tracking-wider py-5 px-8 rounded-2xl transition-all duration-300 btn-pulse hover:scale-[1.03] shadow-[0_0_25px_rgba(255,212,0,0.4)] cursor-pointer group relative overflow-hidden uppercase font-extrabold"
            >
              {/* Shiny reflex */}
              <div className="absolute inset-0 w-1/3 h-full bg-white/25 transform -skew-x-12 -translate-x-full group-hover:animate-shine" />
              <span>🔥 Quero Garantir Minha Camisa</span>
            </button>

            {/* Quick stats label */}
            <span className="block text-[11px] text-white/30 font-mono mt-4 uppercase tracking-widest">
              🔒 PAGAMENTO PROTEGIDO POR PROTOCOLO SSL DE 128 BITS
            </span>
          </div>

        </div>
      </section>

      {/* 2. INFORMAÇÕES DE COMPRA / COPYRIGHT FOOTER */}
      <section className="bg-black/30 border-t border-white/10 py-12 px-4 text-xs font-medium text-gray-500 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1: Brand details */}
            <div className="space-y-3">
              <span className="font-extrabold text-sm tracking-widest text-white font-mono uppercase block">
                JORDAN <span className="text-[#FFD400]">X</span> BRASIL
              </span>
              <p className="text-xs text-white/40 leading-relaxed font-normal">
                Especialistas em streetwear urbano e colecionáveis importados de alta gama esportiva. Entrega premium e segura em todo o território nacional.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <span className="text-[11px] text-white font-mono uppercase tracking-widest font-black block">PÁGINAS LEGAIS</span>
              <ul className="space-y-1.5 font-normal text-gray-500 text-xs text-left">
                <li>
                  <button
                    onClick={(e) => { e.preventDefault(); onLegalPageClick("terms"); }}
                    className="hover:text-[#FFD400] transition-colors cursor-pointer text-left focus:outline-none"
                  >
                    Termos de Uso de Serviço
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => { e.preventDefault(); onLegalPageClick("privacy"); }}
                    className="hover:text-[#FFD400] transition-colors cursor-pointer text-left focus:outline-none"
                  >
                    Diretrizes de Privacidade
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => { e.preventDefault(); onLegalPageClick("refund"); }}
                    className="hover:text-[#FFD400] transition-colors cursor-pointer text-left focus:outline-none"
                  >
                    Políticas de Reembolsos e Trocas
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => { e.preventDefault(); onLegalPageClick("tracking"); }}
                    className="hover:text-[#FFD400] transition-colors cursor-pointer text-left focus:outline-none"
                  >
                    Rastreie Seu Pedido
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contacts */}
            <div className="space-y-3">
              <span className="text-[11px] text-white font-mono uppercase tracking-widest font-black block">FALAR CONOSCO</span>
              <ul className="space-y-2 font-normal text-gray-500 text-xs">
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>sac@manto-jordan-brasil.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <a href="https://wa.me/5531995044967?text=ol%C3%A1%20tenho%20uma%20d%C3%BAvida" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFD400] transition-colors">
                    +55 (31) 99504-4967
                  </a>
                </li>
                <li className="flex items-center space-x-2 text-emerald-450 font-bold">
                  <span>✓ Atendimento Das 08h às 18h</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Seals */}
            <div className="space-y-3">
              <span className="text-[11px] text-white font-mono uppercase tracking-widest font-black block">SEGURANÇA ATIVA</span>
              <div className="flex flex-wrap gap-2.5">
                <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-[10px] text-emerald-450 font-bold shadow">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>GOOGLE SAFE BROWSE</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-[10px] text-white/50 font-bold shadow">
                  <Lock className="w-4 h-4 shrink-0 text-gray-400" />
                  <span>CRIPTOGRAFIA SSL</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright line */}
          <div className="border-t border-white/5 mt-10 pt-8 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-600 font-normal">
            <p>© 2026 JORDAN × BRASIL BR e Outlets Associados. Todos os direitos reservados.</p>
            <p>CNPJ: 00.000.000/0001-00 • São Paulo, SP</p>
          </div>
        </div>
      </section>

    </footer>
  );
}
