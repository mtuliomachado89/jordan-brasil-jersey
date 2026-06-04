/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Lock, Truck, ShieldAlert, RefreshCw, BadgePercent } from "lucide-react";

export default function Warranty() {
  const guaranteeItems = [
    {
      id: "w1",
      title: "Pagamento 100% Seguro",
      description: "Suas transações são criptografadas com certificado SSL e intermediadas pelas plataformas de pagamentos mais robustas do mercado.",
      icon: Lock,
      iconColor: "text-emerald-400 bg-emerald-450/10 border border-emerald-400/10",
    },
    {
      id: "w2",
      title: "Código de Rastreamento",
      description: "Todos os envios possuem código de rastreio automático enviado via WhatsApp e e-mail com atualização em cada etapa.",
      icon: Truck,
      iconColor: "text-blue-400 bg-blue-450/10 border border-blue-400/10",
    },
    {
      id: "w3",
      title: "Garantia Total de Fábrica",
      description: "Garantia exclusiva contra qualquer tipo de dano de transporte ou costuras defeituosas. Oferecemos reembolsos ou reposição imediata.",
      icon: ShieldAlert,
      iconColor: "text-[#FFD400] bg-white/5 border border-[#FFD400]/10",
    },
    {
      id: "w4",
      title: "PIX Instantâneo",
      description: "Confirmação imediata do pagamento. Garanta o envio prioritário e a preparação acelerada do seu pedido.",
      icon: BadgePercent,
      iconColor: "text-purple-400 bg-purple-450/10 border border-purple-400/10",
    },
    {
      id: "w5",
      title: "Troca Rápida Sem Burocracia",
      description: "Não serviu ou deseja outro tamanho? Você tem até 7 dias corridos após o recebimento para solicitar sua troca facilitada gratuita.",
      icon: RefreshCw,
      iconColor: "text-teal-400 bg-teal-450/10 border border-teal-400/10",
    },
  ];

  return (
    <section className="bg-transparent py-16 sm:py-24 relative overflow-hidden text-white border-y border-white/10">
      
      {/* Decorative backdrop mesh */}
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-yellow-400/2 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Block: Visual Seal emblem (Lg: col-span-5) */}
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-6">
            
            {/* Guarantee Shield Emblem */}
            <div className="w-56 h-56 rounded-full border-4 border-[#FFD400] p-2 relative flex items-center justify-center bg-[#05070a] shadow-[0_0_50px_rgba(255,212,0,0.3)]">
              {/* Outer decorative stars wheel */}
              <div className="absolute inset-0 border-2 border-dashed border-[#FFD400]/30 rounded-full animate-spin-slow pointer-events-none" />
              
              <div className="text-center space-y-2 p-4">
                <span className="block text-[11px] font-mono font-black text-[#FFD400] uppercase tracking-widest">
                  SATISFAÇÃO
                </span>
                <span className="block text-5xl font-black text-white tracking-widest font-mono">
                  7
                </span>
                <span className="block text-sm font-black text-white uppercase tracking-tight leading-none font-sans">
                  DIAS DE <br />GARANTIA
                </span>
                <span className="block text-[9px] text-gray-500 font-bold uppercase tracking-widest pt-1">
                  CÓDIGO DE DEFESA
                </span>
              </div>
            </div>

            <div className="space-y-2 max-w-sm">
              <h3 className="text-2xl font-extrabold text-white uppercase tracking-tight font-sans">
                Compra 100% Segura
              </h3>
              <p className="text-xs text-white/50 leading-relaxed font-medium">
                Nós confiamos tanto na qualidade incrível do nosso material que garantimos risco zero para sua compra. Se você receber e não gostar, devolvemos todo o seu dinheiro sem questionamento.
              </p>
            </div>

            {/* Credit card brand logos */}
            <div className="flex flex-wrap justify-center gap-2 pt-2 grayscale opacity-45">
              <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-mono font-semibold tracking-wider text-white">VISA</div>
              <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-mono font-semibold tracking-wider text-white font-serif italic">MasterCard</div>
              <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-mono font-semibold tracking-wider text-white">ELO</div>
              <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-mono font-semibold tracking-wider text-white uppercase italic">Amex</div>
              <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-mono font-semibold tracking-wider text-white">PIX</div>
            </div>

          </div>

          {/* Right Block: Items Checklist (Lg: col-span-7) */}
          <div className="lg:col-span-7 space-y-5">
            {guaranteeItems.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  className="bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/10 hover:border-[#FFD400]/40 transition-colors flex space-x-4 items-start shadow-xl"
                >
                  <div className={`p-3 rounded-xl shrink-0 ${item.iconColor}`}>
                    <IconComp className="w-5 h-5 shrink-0" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-extrabold text-white uppercase tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-white/65 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
