/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AlertTriangle, Clock, TrendingUp, Sparkles, Flame } from "lucide-react";
import { PRODUCT_INFO } from "../data";

// Simulated live sales feed for high-conversion pressure
const SALES_FEED = [
  { name: "Thiago L.", city: "São Paulo/SP", time: "há 2 min", size: "G" },
  { name: "Carlos S.", city: "Rio de Janeiro/RJ", time: "há 4 min", size: "M" },
  { name: "Mateus V.", city: "Belo Horizonte/MG", time: "há 5 min", size: "GG" },
  { name: "Guilherme K.", city: "Curitiba/PR", time: "há 8 min", size: "G" },
  { name: "Bruno M.", city: "Porto Alegre/RS", time: "há 10 min", size: "XG" },
  { name: "Gabriel F.", city: "Brasília/DF", time: "há 12 min", size: "M" },
];

export default function Urgency() {
  const [stock, setStock] = useState(PRODUCT_INFO.stockLeft);
  const [activeFeedIndex, setActiveFeedIndex] = useState(0);

  useEffect(() => {
    // Slowly diminish stock level down to a bottom cap (e.g., 23)
    const stockTimer = setInterval(() => {
      setStock((prev) => {
        if (prev <= 23) return prev;
        const roll = Math.random();
        if (roll > 0.8) {
          return prev - 1;
        }
        return prev;
      });
    }, 25000);

    // Rotate sales feed
    const feedTimer = setInterval(() => {
      setActiveFeedIndex((prev) => (prev + 1) % SALES_FEED.length);
    }, 20000);

    return () => {
      clearInterval(stockTimer);
      clearInterval(feedTimer);
    };
  }, []);

  const progressPercent = (stock / 150) * 100; // Visual base level indicator
  const currentSale = SALES_FEED[activeFeedIndex];

  return (
    <section className="bg-transparent py-16 relative overflow-hidden border-b border-white/10">
      
      {/* Red ambient background caution glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-650/5 rounded-full blur-[125px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="bg-[#05070a] border border-red-550/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
          
          {/* Top highlight flashing beacon */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white font-mono font-black text-[10px] tracking-widest px-4 py-1.5 rounded-full uppercase shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center space-x-1.5 animate-pulse">
            <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping ring-2 ring-red-300" />
            <span>ATENÇÃO: ESTOQUE EM SEGUNDOS</span>
          </div>

          <div className="text-center space-y-6 pt-2">
            {/* Title with icon */}
            <div className="flex flex-col items-center space-y-2">
              <AlertTriangle className="w-10 h-10 text-red-500 animate-bounce" />
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight italic">
                ⚠️ Estoque extremamente limitado
              </h2>
            </div>

            {/* Paragraph copywriting */}
            <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-xl mx-auto font-medium">
              Devido à alta procura e viralização do lançamento nas redes de streetwear, novas reposições para o Brasil <b className="text-white underline font-bold">não possuem data prevista</b>. Garanta já a sua numeração oficial antes do esgotamento completo das cargas.
            </p>

            {/* Stock gauge dynamic bar */}
            <div className="space-y-3 max-w-lg mx-auto pt-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-white/40 font-medium">Capacidade do Lote Especial</span>
                <span className="text-red-400 font-bold font-mono tracking-wide flex items-center space-x-1">
                  <span>Restam apenas</span>
                  <span className="bg-red-600 text-white font-black px-2 py-0.5 rounded text-xs animate-pulse">
                    {stock}
                  </span>
                  <span>unidades</span>
                </span>
              </div>

              {/* Progress track */}
              <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-[1500ms] ease-out shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                  style={{ width: `${Math.max(12, progressPercent)}%` }}
                />
              </div>

              <span className="block text-[10px] sm:text-xs text-white/30 font-mono uppercase tracking-widest text-center">
                📊 ATUALIZADO EM TEMPO REAL PELO SISTEMA DE LOGÍSTICA
              </span>
            </div>

            {/* Live buying alerts ticker */}
            <div className="inline-flex items-center justify-center space-x-3.5 bg-white/5 p-3 rounded-2xl border border-white/10 max-w-md w-full mx-auto relative overflow-hidden shadow-lg">
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#FFD400]" />
              <Flame className="w-4 h-4 text-[#FFD400] shrink-0 fill-current" />
              <div className="text-left leading-tight">
                <span className="block text-[10px] text-gray-400 font-mono tracking-widest uppercase">VENDA RECENTE CONFIRMADA</span>
                <p className="text-xs text-white font-bold">
                  {currentSale.name} ({currentSale.city}) comprou tamanho <b>{currentSale.size}</b> • <span className="text-[#FFD400] font-mono">{currentSale.time}</span>
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
