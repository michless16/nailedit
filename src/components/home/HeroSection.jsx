import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";

export default function HeroSection({ settings }) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={settings?.hero_image_url || "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1920&q=80"}
          alt="Barbershop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 border border-rose-500/20 rounded-full hidden lg:block" />
      <div className="absolute bottom-20 right-32 w-32 h-32 border border-rose-500/10 rounded-full hidden lg:block" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span className="text-rose-500 text-sm font-medium tracking-wide uppercase">
              Institut de Beauté
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            {settings?.shop_name || "Vos Ongles,"}
            <span className="block text-rose-400">Notre Passion</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl text-gray-300 mb-10 leading-relaxed max-w-xl"
          >
            {settings?.tagline || "Une expérience beauté haut de gamme où élégance et savoir-faire se rencontrent pour sublimer vos ongles."}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to={createPageUrl("Booking")}>
              <Button 
                size="lg" 
                className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-8 py-6 text-lg rounded-full group transition-all duration-300"
              >
                Prendre Rendez-vous
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to={createPageUrl("Services")}>
              <Button 
                size="lg" 
                className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-8 py-6 text-lg rounded-full"
              >
                Nos Services
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-gray-400 text-sm tracking-widest uppercase">Découvrir</span>
        <div className="w-px h-12 bg-gradient-to-b from-rose-500 to-transparent" />
      </motion.div>
    </section>
  );
}