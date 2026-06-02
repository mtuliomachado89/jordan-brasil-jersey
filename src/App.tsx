/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SocialProof from "./components/SocialProof";
import Benefits from "./components/Benefits";
import Gallery from "./components/Gallery";
import Details from "./components/Details";
import Testimonials from "./components/Testimonials";
import Urgency from "./components/Urgency";
import Warranty from "./components/Warranty";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import CheckoutModal from "./components/CheckoutModal";
import { Size } from "./types";

export default function App() {
  const [selectedSize, setSelectedSize] = useState<Size>("M");
  const [cartCount, setCartCount] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);

  const handleScrollToHero = () => {
    if (heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAddToCart = (size: Size) => {
    setSelectedSize(size);
    setIsCheckoutOpen(true);
  };

  const handleCtaFinalClick = () => {
    // For maximum conversions, open checkout directly with their standard size choice
    setIsCheckoutOpen(true);
  };

  return (
    <div className="bg-[#05070a] bg-grid min-h-screen text-white font-sans antialiased overflow-x-hidden selection:bg-yellow-400 selection:text-slate-950">
      
      {/* 1. Transparent/glass Header with dynamic cart indicators and emergency alerts */}
      <Header
        cartCount={cartCount}
        onCartClick={() => setIsCheckoutOpen(true)}
        onScrollToOrder={handleScrollToHero}
      />

      {/* Hero Ref anchor */}
      <div ref={heroRef}>
        {/* 2. Hero Section: badge, title, subtitle, prices, custom size selectors and active sessions indicator */}
        <Hero onAddToCart={handleAddToCart} />
      </div>

      {/* 3. Social proof rating statistics */}
      <SocialProof />

      {/* 4. Fabric advantages cards with custom lucide icons */}
      <Benefits />

      {/* 5. Professional media gallery with magnifier lenses and full-screen lightboxes */}
      <Gallery />

      {/* 6. Interspaced macro description grids */}
      <Details />

      {/* 7. Real customer recommendations with customizable filters */}
      <Testimonials />

      {/* 8. Stock alert panels with decreasing indicators */}
      <Urgency />

      {/* 9. Satisfaction guarantee medals and SSL lock arrays */}
      <Warranty />

      {/* 10. Interactive Q&A Accordion */}
      <FAQ />

      {/* 11. Final CTA push and site information maps */}
      <Footer onCtaClick={handleCtaFinalClick} />

      {/* 12. Full-scale e-commerce purchase cart and wizard Checkout drawer */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedSize={selectedSize}
        onUpdateCartCount={setCartCount}
      />

    </div>
  );
}
