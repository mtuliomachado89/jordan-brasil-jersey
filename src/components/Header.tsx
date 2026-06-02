/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ShoppingBag, Lock, Flame } from "lucide-react";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onScrollToOrder: () => void;
}

export default function Header({ cartCount, onCartClick, onScrollToOrder }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [tickerStock, setTickerStock] = useState(27);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Simulate real-time stock levels decreasing periodically
    const timer = setInterval(() => {
      setTickerStock((prev) => {
        if (prev <= 8) return prev;
        const dec = Math.random() > 0.7 ? 1 : 0;
        return prev - dec;
      });
    }, 45000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#05070a]/90 border-b border-white/10 backdrop-blur-md py-3 shadow-2xl"
          : "bg-black/20 border-b border-white/5 backdrop-blur-sm py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo / Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-10 h-10 bg-[#FFD400] rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_15px_rgba(255,212,0,0.3)] hover:scale-105 transition-transform duration-200">
              <div className="w-6 h-6 bg-black" style={{ clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }}></div>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-extrabold text-sm sm:text-base tracking-widest text-white font-mono uppercase">
                  JORDAN <span className="text-[#FFD400]">X</span> BRASIL
                </span>
              </div>
              <span className="block text-[9px] text-gray-400 uppercase tracking-widest -mt-1 font-sans">
                EDIÇÃO LIMITADA 2026
              </span>
            </div>
          </div>

          {/* Center Info Ticker on Desktop */}
          <div className="hidden md:flex items-center space-x-2 text-xs text-[#FFD400]/90 bg-[#FFD400]/5 px-3 py-1.5 rounded-full border border-[#FFD400]/20 shadow-inner">
            <Flame className="w-3.5 h-3.5 text-[#FFD400] animate-pulse" />
            <span className="font-medium tracking-tight">
              ESTOQUE CRÍTICO: <b className="font-bold underline">{tickerStock} unidades</b> disponíveis
            </span>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-3">
            {/* Quick trust badge */}
            <div className="hidden lg:flex items-center space-x-1 text-[11px] text-gray-400 bg-white/5 py-1.5 px-3 rounded-lg border border-white/10">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Compra 100% Segura</span>
            </div>

            {/* CTA action button inside navbar */}
            <button
              onClick={onScrollToOrder}
              className="hidden sm:inline-flex items-center bg-[#FFD400] hover:brightness-110 text-black font-black px-4 py-2 rounded-lg text-xs tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,212,0,0.2)]"
            >
              GARANTIR MINHA CAMISA
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white transition-all duration-200 hover:scale-105 active:scale-95 group"
              aria-label="Abrir carrinho"
            >
              <ShoppingBag className="w-5 h-5 group-hover:text-[#FFD400] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FFD400] text-black font-black text-[10px] flex items-center justify-center rounded-full animate-bounce shadow-lg border-2 border-[#05070a]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
          
        </div>
      </div>
    </header>
  );
}
