/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Star, CheckCircle, Users, ThumbsUp, ShieldCheck } from "lucide-react";

export default function SocialProof() {
  const metrics = [
    {
      id: "m1",
      label: "Nota média",
      value: "4.9 / 5",
      subText: "★★★★★",
      icon: Star,
      iconColor: "text-yellow-400",
    },
    {
      id: "m2",
      label: "Manto garantidos",
      value: "+3.000",
      subText: "vendas realizadas",
      icon: Users,
      iconColor: "text-blue-400",
    },
    {
      id: "m3",
      label: "Satisfação total",
      value: "98%",
      subText: "dos clientes recomendam",
      icon: ThumbsUp,
      iconColor: "text-emerald-400",
    },
    {
      id: "m4",
      label: "Avaliações autênticas",
      value: "+1.500",
      subText: "comentários positivos",
      icon: CheckCircle,
      iconColor: "text-yellow-400",
    },
  ];

  return (
    <section className="bg-transparent py-10 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title and Top Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div className="text-center md:text-left space-y-2">
            <span className="text-xs text-[#FFD400] font-mono font-bold uppercase tracking-wider block">
              ⚡ PROVA SOCIAL COMPROVADA
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-white font-sans tracking-tight uppercase">
              Mais de 3.000 clientes já garantiram a sua
            </h2>
          </div>

          {/* Customer Avatar Cluster */}
          <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/10">
            <div className="flex -space-x-2.5 overflow-hidden">
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#05070a]" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80" alt="Client" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#05070a]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" alt="Client" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#05070a]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" alt="Client" />
              <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[#05070a]" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80" alt="Client" />
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FFD400] font-black text-black text-[10px] ring-2 ring-[#05070a]">
                +1K
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-xs text-white font-bold block">CLIENTES ULTRA SATISFEITOS</span>
              </div>
              <span className="block text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                VERIFICADOS EM TODO BRASIL
              </span>
            </div>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
          {metrics.map((m) => {
            const IconComponent = m.icon;
            return (
              <div
                key={m.id}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FFD400]/30 transition-all duration-300 rounded-2xl p-5 flex flex-col justify-between group shadow-lg"
              >
                <div className="flex items-center justify-between pointer-events-none">
                  <span className="text-xs text-gray-450 uppercase tracking-wider font-mono font-medium">
                    {m.label}
                  </span>
                  <div className={`p-2 rounded-xl bg-black/45 group-hover:scale-110 transition-transform ${m.iconColor}`}>
                    <IconComponent className="w-5 h-5 shrink-0" />
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <span className="text-2xl sm:text-4xl font-extrabold text-white block tracking-tight">
                    {m.value}
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#FFD400] tracking-wide font-bold uppercase block">
                    {m.subText}
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
