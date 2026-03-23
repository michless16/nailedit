import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ServiceSelector({ services, selectedService, onSelect }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white mb-4">Choisissez votre service</h3>
      <div className="grid gap-3">
        {services?.map((service) => (
          <motion.button
            key={service.id}
            onClick={() => onSelect(service)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
              "w-full p-4 rounded-xl border-2 text-left transition-all duration-300",
              selectedService?.id === service.id
                ? "border-rose-500 bg-rose-500/10"
                : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className={cn(
                    "font-semibold text-lg transition-colors",
                    selectedService?.id === service.id ? "text-rose-500" : "text-white"
                  )}>
                    {service.name}
                  </h4>
                  {selectedService?.id === service.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-black" />
                    </motion.div>
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-1">{service.description}</p>
              </div>
              <div className="text-right ml-4">
                <p className="text-2xl font-bold text-rose-500">${service.price}</p>
                <p className="text-gray-500 text-sm flex items-center justify-end gap-1">
                  <Clock className="w-3 h-3" />
                  {service.duration} min
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}