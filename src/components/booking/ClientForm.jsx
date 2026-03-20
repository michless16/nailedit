import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Phone, FileText, Bell } from 'lucide-react';

export default function ClientForm({ clientInfo, setClientInfo }) {
  const handleChange = (field, value) => {
    setClientInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">Vos informations</h3>
      
      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-300 flex items-center gap-2">
            <User className="w-4 h-4 text-rose-500" />
            Nom complet *
          </Label>
          <Input
            id="name"
            value={clientInfo.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Votre nom"
            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-amber-500 h-12"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-300 flex items-center gap-2">
            <Phone className="w-4 h-4 text-rose-500" />
            Téléphone *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={clientInfo.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="(514) 555-0000"
            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-amber-500 h-12"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
            <Mail className="w-4 h-4 text-rose-500" />
            Email (optionnel)
          </Label>
          <Input
            id="email"
            type="email"
            value={clientInfo.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="votre@email.com"
            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-amber-500 h-12"
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-gray-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-rose-500" />
            Notes (optionnel)
          </Label>
          <Textarea
            id="notes"
            value={clientInfo.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Des demandes particulières ?"
            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-rose-500 min-h-[100px]"
          />
        </div>

        {/* Notification Preferences */}
        <div className="space-y-3 pt-4 border-t border-zinc-800">
          <Label className="text-gray-300 flex items-center gap-2">
            <Bell className="w-4 h-4 text-rose-500" />
            Préférences de notification
          </Label>
          <p className="text-sm text-gray-500">Recevez des notifications par email</p>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="send_confirmation"
                checked={clientInfo.send_confirmation !== false}
                onCheckedChange={(checked) => handleChange('send_confirmation', checked)}
                className="border-zinc-700 data-[state=checked]:bg-rose-500"
              />
              <label htmlFor="send_confirmation" className="text-sm text-gray-300 cursor-pointer">
                Confirmation de réservation
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="send_reminder"
                checked={clientInfo.send_reminder !== false}
                onCheckedChange={(checked) => handleChange('send_reminder', checked)}
                className="border-zinc-700 data-[state=checked]:bg-rose-500"
              />
              <label htmlFor="send_reminder" className="text-sm text-gray-300 cursor-pointer">
                Rappel 24h avant le rendez-vous
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="send_thank_you"
                checked={clientInfo.send_thank_you !== false}
                onCheckedChange={(checked) => handleChange('send_thank_you', checked)}
                className="border-zinc-700 data-[state=checked]:bg-rose-500"
              />
              <label htmlFor="send_thank_you" className="text-sm text-gray-300 cursor-pointer">
                Message de remerciement après le service
              </label>
            </div>
          </div>

          {clientInfo.email ? (
            <p className="text-xs text-gray-500 pt-2">
              Les notifications seront envoyées à: <span className="text-rose-500">{clientInfo.email}</span>
            </p>
          ) : (
            <p className="text-xs text-amber-500 pt-2">
              ⚠️ Veuillez fournir une adresse email pour recevoir des notifications
            </p>
          )}
        </div>
      </div>
    </div>
  );
}