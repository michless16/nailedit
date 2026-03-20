import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Sparkles, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function BookingSummary({ service, technician, date, time }) {
  if (!service && !technician && !date && !time) {
    return (
      <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
        <h3 className="text-lg font-semibold text-white mb-4">Résumé</h3>
        <p className="text-gray-400 text-sm">
          Sélectionnez vos options pour voir le résumé de votre réservation.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 sticky top-6"
    >
      <h3 className="text-lg font-semibold text-white mb-6">Résumé de votre réservation</h3>
      
      <div className="space-y-4">
        {service && (
          <div className="flex items-start gap-3 pb-4 border-b border-zinc-800">
            <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-rose-500" />
            </div>
            <div className="flex-1">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Service</p>
              <p className="text-white font-medium">{service.name}</p>
              <p className="text-gray-500 text-sm">{service.duration} minutes</p>
            </div>
          </div>
        )}

        {technician && (
          <div className="flex items-start gap-3 pb-4 border-b border-zinc-800">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={technician.photo_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"}
                alt={technician.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Technicienne</p>
              <p className="text-white font-medium">{technician.name}</p>
              <p className="text-gray-500 text-sm">{technician.title || "Experte"}</p>
            </div>
          </div>
        )}

        {date && (
          <div className="flex items-start gap-3 pb-4 border-b border-zinc-800">
            <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-rose-500" />
            </div>
            <div className="flex-1">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Date</p>
              <p className="text-white font-medium capitalize">
                {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
              </p>
            </div>
          </div>
        )}

        {time && (
          <div className="flex items-start gap-3 pb-4 border-b border-zinc-800">
            <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-rose-500" />
            </div>
            <div className="flex-1">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Heure</p>
              <p className="text-white font-medium">{time}</p>
            </div>
          </div>
        )}

        {service && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-gray-400">Total</span>
            <span className="text-2xl font-bold text-rose-500">${service.price}</span>
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs mt-6 text-center">
        * Paiement sur place uniquement
      </p>
    </motion.div>
  );
}