import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils";

const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function ContactSection({ settings }) {
  const openingHours = settings?.opening_hours || [];

  return (
    <section className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-rose-500 text-sm font-semibold tracking-widest uppercase mb-4 block">
              Contact
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Venez Nous <span className="text-rose-400">Visiter</span>
            </h2>

            <div className="space-y-6 mb-10">
              {settings?.address && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Adresse</p>
                    <p className="text-white text-lg">{settings.address}</p>
                  </div>
                </div>
              )}

              {settings?.phone && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Téléphone</p>
                    <a href={`tel:${settings.phone}`} className="text-white text-lg hover:text-amber-500 transition-colors">
                      {settings.phone}
                    </a>
                  </div>
                </div>
              )}

              {settings?.email && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Email</p>
                    <a href={`mailto:${settings.email}`} className="text-white text-lg hover:text-rose-400 transition-colors">
                      {settings.email}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {settings?.instagram_url && (
                <a 
                  href={settings.instagram_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-zinc-800 hover:bg-rose-500 rounded-xl flex items-center justify-center transition-colors group"
                >
                  <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              )}
              {settings?.facebook_url && (
                <a 
                  href={settings.facebook_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-zinc-800 hover:bg-rose-500 rounded-xl flex items-center justify-center transition-colors group"
                >
                  <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Opening Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Heures d'Ouverture</h3>
              </div>

              <div className="space-y-4 mb-8">
                {openingHours.length > 0 ? (
                  openingHours.map((schedule, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
                    >
                      <span className="text-gray-300 font-medium">{schedule.day}</span>
                      {schedule.is_open ? (
                        <span className="text-white">
                          {schedule.open_time} - {schedule.close_time}
                        </span>
                      ) : (
                        <span className="text-gray-500">Fermé</span>
                      )}
                    </div>
                  ))
                ) : (
                  dayNames.map((day, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
                    >
                      <span className="text-gray-300 font-medium">{day}</span>
                      <span className="text-white">
                        {index === 0 ? 'Fermé' : '09:00 - 19:00'}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <Link to={createPageUrl("Booking")}>
                <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-6 rounded-xl text-lg">
                  Réserver Maintenant
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}