/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Plus, Minus, HelpCircle, ArrowRight } from "lucide-react";
import { FAQ_ITEMS } from "../data";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Open first by default for better user engagement

  const toggleIndex = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-transparent py-16 sm:py-24 relative overflow-hidden">
      
      {/* Decorative light reflection */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16 space-y-4">
          <span className="text-xs font-mono font-bold text-[#FFD400] bg-white/5 py-1 px-3 rounded-full border border-white/10 uppercase tracking-widest inline-block">
            💬 TIRE SUAS DÚVIDAS RÁPIDO
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white italic uppercase tracking-tight">
            FAQ • PERGUNTAS FREQUENTES
          </h2>
          <p className="text-xs sm:text-sm text-white/50">
            Encontre respostas diretas para as principais dúvidas dos nossos clientes sobre o processo de compra e entrega do manto.
          </p>
        </div>

        {/* Collapsible Accordion Grid */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-[#FFD400] bg-white/10 shadow-[0_0_15px_rgba(255,212,0,0.1)]"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                {/* Trigger Button */}
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full flex items-center justify-between p-6 cursor-pointer select-none text-left"
                >
                  <div className="flex items-center space-x-4">
                    <HelpCircle className={`w-5 h-5 shrink-0 ${isOpen ? "text-[#FFD400]" : "text-gray-500"}`} />
                    <span className="text-sm sm:text-base font-extrabold text-white uppercase tracking-tight">
                      {item.question}
                    </span>
                  </div>

                  {/* Toggle Indicator */}
                  <div className={`p-1.5 rounded-lg bg-black/65 border border-white/10 text-white transition-transform duration-300 ${isOpen ? "rotate-180 text-[#FFD400]" : ""}`}>
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>

                {/* Content Panel */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100 border-t border-white/5 mt-0" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-6 bg-black/10">
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                      {item.answer}
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Additional support contact banner */}
        <div className="mt-12 bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 shadow-lg">
          <div>
            <span className="text-xs text-[#FFD400] font-mono tracking-widest uppercase font-bold text-[#FFD400]">Ainda com alguma dúvida?</span>
            <p className="text-sm text-gray-300 mt-1">Fale diretamente com nossa equipe de suporte pelo WhatsApp Oficial.</p>
          </div>
          <a
            href="https://wa.me/5531995044967?text=ol%C3%A1%20tenho%20uma%20d%C3%BAvida"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-450 text-black font-black text-xs px-5 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          >
            <span>SUPORTE VIA WHATSAPP</span>
            <ArrowRight className="w-3.5 h-3.5 text-black" />
          </a>
        </div>

      </div>
    </section>
  );
}
