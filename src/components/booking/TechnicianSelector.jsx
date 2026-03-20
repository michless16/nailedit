import React from 'react';
import { Card } from "@/components/ui/card";
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function TechnicianSelector({ technicians, selectedTechnician, onSelect }) {
  if (!technicians || technicians.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Aucune technicienne disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Choisissez votre technicienne</h2>
      <p className="text-gray-400 mb-8">Sélectionnez la professionnelle qui prendra soin de vous</p>

      <div className="grid md:grid-cols-2 gap-6">
        {technicians.map((technician) => (
          <motion.div
            key={technician.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              onClick={() => onSelect(technician)}
              className={cn(
                "p-6 cursor-pointer transition-all bg-zinc-900 border-2",
                selectedTechnician?.id === technician.id
                  ? "border-rose-500 bg-rose-500/10"
                  : "border-zinc-800 hover:border-zinc-700"
              )}
            >
              <div className="flex items-start gap-4">
                {technician.photo_url ? (
                  <img
                    src={technician.photo_url}
                    alt={technician.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-rose-500/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-rose-400">
                      {technician.name.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-white text-lg">{technician.name}</h3>
                      {technician.title && (
                        <p className="text-rose-400 text-sm">{technician.title}</p>
                      )}
                    </div>
                    {selectedTechnician?.id === technician.id && (
                      <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {technician.bio && (
                    <p className="text-gray-400 text-sm line-clamp-2">{technician.bio}</p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}