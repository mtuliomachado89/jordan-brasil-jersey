/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ZoomIn, X, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { GALLERY_ITEMS } from "../data";

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomMousePos, setZoomMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const activeItem = GALLERY_ITEMS[activeIndex];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomMousePos({ x, y });
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % GALLERY_ITEMS.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
  };

  return (
    <section className="bg-transparent py-16 sm:py-24 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-mono font-bold text-[#FFD400] uppercase tracking-widest block">
            📐 GALERIA DE OUTLET PREMIUM
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white italic uppercase tracking-tight">
            Galeria do Produto
          </h2>
          <p className="text-sm text-white/50">
            Navegue pelos detalhes reais de importação. Design estruturado com alta precisão urbana. toque nas miniaturas para ampliar.
          </p>
        </div>

        {/* Gallery Dynamic Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Showcase (Lg: col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#05070a] border border-white/10 cursor-zoom-in group select-none shadow-2xl"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onMouseMove={handleMouseMove}
              onClick={() => setIsLightboxOpen(true)}
            >
              {/* Image with zoom filter on hover */}
              <img
                src={activeItem.src}
                alt={activeItem.title}
                className={`w-full h-full object-cover transition-transform duration-200 ${
                  isHovering ? "scale-[2.2]" : "scale-100"
                }`}
                style={
                  isHovering
                    ? { transformOrigin: `${zoomMousePos.x}% ${zoomMousePos.y}%` }
                    : undefined
                }
                referrerPolicy="no-referrer"
              />

              {/* Overlay with subtle visual instructions */}
              <div className="absolute top-4 right-4 bg-[#05070a]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-white font-mono flex items-center space-x-1 shadow-lg pointer-events-none">
                <ZoomIn className="w-3.5 h-3.5 text-[#FFD400] animate-pulse" />
                <span>Passe o mouse para dar Zoom / Clique para ampliar</span>
              </div>

              {/* Banner detail footer */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 flex flex-col justify-end pointer-events-none">
                <span className="text-xs text-[#FFD400] font-mono font-bold uppercase tracking-widest">
                  {activeItem.category}
                </span>
                <h3 className="text-xl font-bold text-white uppercase">{activeItem.title}</h3>
                <p className="text-xs text-gray-300 limit-lines-2 mt-1">{activeItem.description}</p>
              </div>
            </div>
          </div>

          {/* Thumbnail Select Grid (Lg: col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-xl">
              <span className="text-xs font-mono font-bold text-white/40 block uppercase mb-4 tracking-wider">
                Fotos Oficiais do Catálogo ({GALLERY_ITEMS.length})
              </span>
              
              <div className="grid grid-cols-4 gap-3">
                {GALLERY_ITEMS.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveIndex(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden bg-black border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${
                      activeIndex === index
                        ? "border-[#FFD400] shadow-[0_0_15px_rgba(255,212,0,0.3)] scale-[1.03]"
                        : "border-white/10 hover:border-white/25"
                    }`}
                  >
                    <img
                      src={item.src}
                      alt={item.category}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    
                    {/* Badge selection */}
                    {activeIndex === index && (
                      <div className="absolute inset-0 bg-[#FFD400]/10 flex items-center justify-center">
                        <span className="bg-[#FFD400] text-black font-black text-[9px] px-1 rounded">
                          ATIVO
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Micro details panel */}
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 flex space-x-3.5 items-start shadow-xl">
              <Info className="w-5 h-5 text-[#FFD400] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs text-white font-bold block uppercase tracking-wide">
                  Diferenciação Estética Visível
                </span>
                <p className="text-xs text-white/50 leading-relaxed">
                  As costuras reforçadas evitam rasgos na prática de exercícios e as canaletas laterais elásticas permitem um caimento justo sem reter calor ou causar desconforto térmico.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#05070a]/98 backdrop-blur-xl flex flex-col justify-between p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top header */}
          <div className="flex items-center justify-between w-full max-w-7xl mx-auto py-2">
            <div className="text-left select-none">
              <span className="text-xs text-[#FFD400] font-mono uppercase tracking-widest font-black">
                {activeItem.category}
              </span>
              <h4 className="text-lg font-bold text-white">{activeItem.title}</h4>
            </div>
            {/* Close trigger */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="text-white hover:text-[#FFD400] p-2.5 rounded-full bg-black/60 border border-white/10 transition-colors cursor-pointer hover:rotate-90 duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main centered display */}
          <div className="flex-1 flex items-center justify-center relative w-full max-w-5xl mx-auto">
            {/* Previous trigger arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:-left-12 z-10 text-white hover:text-[#FFD400] p-3 sm:p-4 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 shadow-2xl transition-all cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Showcase Image container */}
            <div
              className="max-h-[70vh] sm:max-h-[75vh] max-w-full aspect-square bg-[#05070a] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeItem.src}
                alt={activeItem.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Next trigger arrow */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:-right-12 z-10 text-white hover:text-[#FFD400] p-3 sm:p-4 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 shadow-2xl transition-all cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Footer content */}
          <div className="w-full max-w-3xl mx-auto text-center space-y-2 pb-6 select-none" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs text-white/30 font-mono">
              Foto {activeIndex + 1} de {GALLERY_ITEMS.length}
            </span>
            <p className="text-sm text-gray-300 max-w-xl mx-auto">
              {activeItem.description}
            </p>
          </div>

        </div>
      )}

    </section>
  );
}
