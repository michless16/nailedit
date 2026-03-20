import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Star } from 'lucide-react';

export default function BarbersSection({ technicians }) {
  const displayTechnicians = technicians?.filter(t => t.is_active) || [];

  return (
    <section className="py-24 bg-zinc-900">
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
            L'équipe
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Nos Techniciennes
          </h2>
          <div className="w-24 h-1 bg-rose-500 mx-auto mb-6" />
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Des expertes passionnées dédiées à sublimer vos ongles
          </p>
        </motion.div>

        {/* Technicians Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTechnicians.map((technician, index) => (
            <motion.div
              key={technician.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative overflow-hidden rounded-2xl bg-zinc-800">
                {/* Photo */}
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={technician.photo_url || "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80"}
                    alt={technician.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-rose-500 text-rose-500" />
                    ))}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {technician.name}
                  </h3>
                  <p className="text-rose-400 font-medium mb-3">
                    {technician.title || "Technicienne Experte"}
                  </p>
                  <p className="text-gray-300 text-sm line-clamp-2">
                    {technician.bio || "Experte en nail art et soins des ongles, spécialisée en manucure française et designs créatifs."}
                  </p>
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-rose-500/50 rounded-tr-xl" />
              </div>
            </motion.div>
          ))}
        </div>

        {displayTechnicians.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Aucune technicienne disponible pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}