import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";

export default function ServicesPreview({ services }) {
  const displayServices = services?.slice(0, 4) || [];

  return (
    <section className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-rose-500 text-sm font-semibold tracking-widest uppercase mb-4 block">
            Ce que nous offrons
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Nos Services
          </h2>
          <div className="w-24 h-1 bg-rose-500 mx-auto" />
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {displayServices.map((service, index) => (
            <Link key={service.id} to={createPageUrl("Booking") + `?service=${service.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-rose-500/50 transition-all duration-500 cursor-pointer"
              >
              {/* Service Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={service.image_url || `https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80`}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Service Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-400 transition-colors">
                  {service.name}
                </h3>
                <p className="text-white text-sm mb-4 line-clamp-2">
                  {service.description || "Service professionnel de qualité"}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-rose-500 font-bold text-lg">
                      ${service.price}
                    </span>
                    <span className="flex items-center gap-1 text-white text-sm">
                      <Clock className="w-4 h-4" />
                      {service.duration} min
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 border-2 border-rose-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to={createPageUrl("Services")}>
            <Button 
              variant="outline" 
              size="lg"
              className="border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white rounded-full px-8 group"
            >
              Voir tous les services
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}