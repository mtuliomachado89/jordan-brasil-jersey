/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import * as Icons from "lucide-react";
import { BENEFITS } from "../data";

export default function Benefits() {
  return (
    <section className="bg-transparent py-16 sm:py-24 relative overflow-hidden">
      {/* Decorative gradient flare */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="inline-block text-xs font-mono font-black text-[#FFD400] uppercase tracking-widest bg-white/5 py-1 px-3 rounded-full border border-white/10">
            Diferenciais de Elite
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white italic tracking-tight uppercase">
            Por que essa camisa está fazendo sucesso?
          </h2>
          <p className="text-sm sm:text-base text-white/60 leading-relaxed">
            Desenvolvido sob rígido controle de qualidade técnica, o manto que une o maior ícone do basquete mundial ao país com cinco estrelas no coração traz diferenciais mecânicos pensados para conforto e durabilidade superiores.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((b) => {
            // Dynamically select correct Lucide-React icons
            let IconComponent = Icons.Sparkles;
            if (b.id === "b1") IconComponent = Icons.Trophy;
            if (b.id === "b2") IconComponent = Icons.Wind;
            if (b.id === "b3") IconComponent = Icons.Flame;
            if (b.id === "b4") IconComponent = Icons.Percent;
            if (b.id === "b5") IconComponent = Icons.Gem;
            if (b.id === "b6") IconComponent = Icons.Truck;

            return (
              <div
                key={b.id}
                className="group relative bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-[#FFD400]/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between shadow-lg"
              >
                {/* Background light glow on hover */}
                <div className="absolute inset-0 bg-yellow-400/2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  {/* Icon section with yellow background highlight */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#05070a] text-[#FFD400] group-hover:text-black group-hover:bg-[#FFD400] border border-white/10 group-hover:shadow-[0_0_15px_rgba(255,212,0,0.3)] transition-all duration-300">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#FFD400] transition-colors uppercase font-sans tracking-tight">
                    {b.title}
                  </h3>
                  
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {b.description}
                  </p>
                </div>

                {/* Micro styling layout in bottom right */}
                <div className="mt-6 flex items-center justify-end">
                  <span className="text-[10px] text-gray-650 group-hover:text-[#FFD400]/40 uppercase tracking-widest font-mono font-bold transition-all">
                    ✓ PREMIUM
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
