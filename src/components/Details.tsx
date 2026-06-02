/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { DETAILED_FEATURES } from "../data";

export default function Details() {
  return (
    <section className="bg-transparent py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-4">
          <span className="text-xs font-mono font-bold text-[#FFD400] bg-white/5 py-1 px-3 rounded-full border border-white/10 uppercase tracking-widest inline-block">
            🔍 RAIO-X DO MANTO REVELADO
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white italic uppercase tracking-tight">
            VEJA NOS DETALHES
          </h2>
          <p className="text-sm sm:text-base text-white/60">
            Cada filamento, costura e estampa foi trabalhado meticulosamente para oferecer a mesma performance que os astros do esporte internacional desfrutam.
          </p>
        </div>

        {/* Alternated layout lists */}
        <div className="space-y-16 sm:space-y-24">
          {DETAILED_FEATURES.map((feat, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={feat.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
                  isEven ? "" : "lg:flex-row-reverse"
                }`}
              >
                
                {/* Image panel (Lg: col-span-6) */}
                <div
                  className={`lg:col-span-6 relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] shadow-2xl border border-white/10 group ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <img
                    src={feat.image}
                    alt={feat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 hover:rotate-1"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Text Spec panel (Lg: col-span-6) */}
                <div
                  className={`lg:col-span-6 space-y-6 ${
                    isEven ? "lg:order-2" : "lg:order-1 lg:pr-8"
                  }`}
                >
                  <div className="space-y-2">
                    <span className="text-xs text-[#FFD400] font-mono tracking-widest uppercase font-bold block">
                      DESTAQUE DE ACABAMENTO
                    </span>
                    <h3 className="text-2xl sm:text-3.5xl font-bold text-white tracking-tight uppercase leading-tight font-sans">
                      {feat.title}
                    </h3>
                  </div>

                  <p className="text-sm sm:text-base text-white/70 leading-relaxed font-normal">
                    {feat.description}
                  </p>

                  {/* Checklist matching specific bullet points */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {feat.items.map((bullet, bIndex) => (
                      <div
                        key={bIndex}
                        className="flex items-center space-x-2.5 bg-white/5 p-2.5 rounded-lg border border-white/10 shadow"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-300 font-medium">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Specific requirements verification boxes */}
                  {isEven ? (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center space-x-3 text-xs text-white/50 shadow">
                      <div className="flex -space-x-1 font-mono text-[9px] font-bold text-emerald-400 uppercase">
                        <span>✓ ACABAMENTOS</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-black/45 px-2 py-1 rounded text-[10px] text-gray-300 border border-white/5">✓ Escudo HD</span>
                        <span className="bg-black/45 px-2 py-1 rounded text-[10px] text-gray-300 border border-white/5">✓ Costuras Triplas</span>
                        <span className="bg-black/45 px-2 py-1 rounded text-[10px] text-gray-300 border border-white/5">✓ Dri-Mesh Oficial</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center space-x-3 text-xs text-white/50 shadow">
                      <div className="flex -space-x-1 font-mono text-[9px] font-bold text-emerald-400 uppercase">
                        <span>✓ TECNOLOGIA</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-black/45 px-2 py-1 rounded text-[10px] text-gray-300 border border-white/5">✓ Respirável Inteligente</span>
                        <span className="bg-black/45 px-2 py-1 rounded text-[10px] text-gray-300 border border-white/5">✓ Termorregulação</span>
                        <span className="bg-black/45 px-2 py-1 rounded text-[10px] text-gray-300 border border-white/5">✓ Tecido Ultra Leve</span>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
