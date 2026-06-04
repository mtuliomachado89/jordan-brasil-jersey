/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Star, BadgeCheck, CheckCircle, ThumbsUp } from "lucide-react";
import { TESTIMONIALS } from "../data";

export default function Testimonials() {
  const [filterRating, setFilterRating] = useState<number | null>(null);

  // Filter reviews by rating stars
  const filteredReviews = filterRating
    ? TESTIMONIALS.filter((t) => t.rating === filterRating)
    : TESTIMONIALS;

  return (
    <section className="bg-transparent py-16 sm:py-24 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-mono font-bold text-[#FFD400] uppercase tracking-widest block animate-pulse">
            ⭐ AVALIAÇÕES DE CLIENTES REAIS
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white italic uppercase tracking-tight">
            Quem compra, recomenda.
          </h2>
          <p className="text-xs sm:text-sm text-white/50">
            Nossos clientes compartilham suas opiniões verdadeiras sobre o conforto, caimento do modelo e velocidade de entrega.
          </p>
        </div>

        {/* Dynamic score summary & interactive filters */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="text-center bg-black/60 p-4 rounded-xl border border-white/10 shrink-0 shadow">
              <span className="block text-3xl font-black text-[#FFD400]">4.9</span>
              <span className="text-[10px] text-white/30 font-mono tracking-widest block uppercase">DE 5 ESTRELAS</span>
            </div>
            <div>
              <div className="flex text-[#FFD400] space-x-0.5 pointer-events-none">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current text-[#FFD400]" />
                ))}
              </div>
              <span className="text-xs text-gray-300 font-medium block mt-1">
                Baseado em <b className="text-white">+1.500 avaliações</b> auditadas de compradores no Brasil.
              </span>
            </div>
          </div>

          {/* Filtering tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterRating(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterRating === null
                  ? "bg-[#FFD400] text-black font-extrabold shadow"
                  : "bg-black/45 text-[#fff]/50 hover:text-white border border-white/10"
              }`}
            >
              Exibir todas
            </button>
            {[5, 4].map((star) => (
              <button
                key={star}
                onClick={() => setFilterRating(star)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterRating === star
                    ? "bg-[#FFD400] text-black font-extrabold shadow"
                    : "bg-black/45 text-[#fff]/50 hover:text-white border border-white/10"
                }`}
              >
                <span>{star} estrelas</span>
                <Star className="w-3 h-3 fill-current" />
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((t) => (
            <div
              key={t.id}
              className="bg-white/5 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl flex flex-col justify-between hover:border-[#FFD400]/40 transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Score & verification */}
                <div className="flex items-center justify-between">
                  <div className="flex text-[#FFD400] space-x-0.5 pointer-events-none">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-[#FFD400]" />
                    ))}
                  </div>

                  <span className="inline-flex items-center space-x-1 text-emerald-450 text-[10px] sm:text-xs font-mono font-bold bg-emerald-400/5 px-2 py-1 rounded border border-emerald-450/20">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span>COMPRA VERIFICADA</span>
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-sm sm:text-base text-gray-200 font-medium italic leading-relaxed">
                  "{t.text}"
                </p>

                {/* Optional Review Image with predefined max size */}
                {t.reviewImage && (
                  <div className="mt-4">
                    <img
                      src={t.reviewImage}
                      alt={`Foto da avaliação de ${t.name}`}
                      className="max-h-52 max-w-full rounded-xl border border-white/10 object-cover shadow-2xl hover:scale-[1.02] transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>

              {/* Reviewer Meta info */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/5">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center font-black text-xs text-[#FFD400] relative">
                    {t.initials}
                    <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 rounded-full border border-black p-0.5">
                      <CheckCircle className="w-2.5 h-2.5 text-white fill-current animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-white block">
                      — {t.name}
                    </span>
                    <span className="text-[10px] text-[#fff]/40 font-mono tracking-wider block uppercase">
                      TAMANHO: {t.sizeBought} | ENVIADO EM {t.deliveryTime}
                    </span>
                  </div>
                </div>

                {/* Interactive Thumbs up */}
                <button className="flex items-center space-x-1 text-[11px] text-[#fff]/45 hover:text-[#FFD400] transition-colors bg-black/40 hover:bg-black/70 py-1 px-2.5 rounded-lg border border-white/10 cursor-pointer">
                  <ThumbsUp className="w-3 h-3" />
                  <span>Útil (18)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
