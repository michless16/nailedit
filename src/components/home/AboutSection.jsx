import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Clock, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: "Excellence",
    description: "Des soins de qualité supérieure pour vos ongles"
  },
  {
    icon: Users,
    title: "Expertise",
    description: "Des techniciennes expérimentées et passionnées"
  },
  {
    icon: Clock,
    title: "Ponctualité",
    description: "Respect de votre temps précieux"
  },
  {
    icon: Sparkles,
    title: "Hygiène",
    description: "Matériel stérilisé et normes sanitaires strictes"
  }
];

export default function AboutSection({ settings }) {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80"
                alt="Salon de Manucure"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="absolute -bottom-8 -right-8 bg-rose-500 p-6 rounded-2xl text-white max-w-xs"
            >
              <p className="text-4xl font-bold mb-1">10+</p>
              <p className="font-semibold">Années d'expérience</p>
            </motion.div>

            {/* Decorative Frame */}
            <div className="absolute -top-4 -left-4 w-32 h-32 border-t-4 border-l-4 border-rose-500/30 rounded-tl-3xl" />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-rose-500 text-sm font-semibold tracking-widest uppercase mb-4 block">
              Notre Histoire
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              L'Art des Ongles
              <span className="text-rose-400"> Réinventé</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              {settings?.description || 
                "Depuis notre ouverture, nous nous engageons à offrir une expérience unique où élégance et bien-être se rencontrent. Notre équipe de techniciennes passionnées vous accueille dans un cadre raffiné pour sublimer vos ongles."}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}