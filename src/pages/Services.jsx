import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";

export default function Services() {
  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => apiClient.entities.Service.filter({ is_active: true }, 'order')
  });

  return (
    <div className="bg-black min-h-screen">
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=1920&q=80"
            alt="Services"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span className="text-rose-500 text-sm font-medium">Nos Prestations</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Nos <span className="text-rose-400">Services</span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Des soins d'exception pour sublimer vos ongles
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-zinc-900 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {services?.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-rose-500/50 transition-all duration-500"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-2/5 h-64 md:h-auto overflow-hidden">
                      <img
                        src={service.image_url || "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80"}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>

                    {/* Content */}
                    <div className="md:w-3/5 p-8 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-rose-400 transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                          {service.description || "Un soin professionnel pour magnifier vos ongles."}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <span className="text-3xl font-bold text-rose-500">
                            ${service.price}
                          </span>
                          <span className="flex items-center gap-2 text-gray-500">
                            <Clock className="w-5 h-5" />
                            {service.duration} min
                          </span>
                        </div>
                        
                        <Link to={createPageUrl("Booking") + `?service=${service.id}`}>
                          <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full group/btn">
                            Réserver
                            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Hover Border */}
                  <div className="absolute inset-0 border-2 border-rose-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && (!services || services.length === 0) && (
            <div className="text-center py-20">
              <Sparkles className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <p className="text-gray-400 text-xl">Aucun service disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-8 bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prête pour de beaux ongles ?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Réservez votre rendez-vous dès maintenant et laissez nos expertes prendre soin de vous.
          </p>
          <Link to={createPageUrl("Booking")}>
            <Button size="lg" className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-10 py-6 text-lg rounded-full">
              Prendre Rendez-vous
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}