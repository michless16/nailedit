import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

export default function RescheduleDialog({ appointment, open, onOpenChange, onReschedule }) {
  const [newDate, setNewDate] = useState(appointment ? new Date(appointment.date) : new Date());
  const [newTime, setNewTime] = useState(appointment?.time || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newDate || !newTime) return;
    
    setIsSubmitting(true);
    try {
      await onReschedule({
        date: format(newDate, 'yyyy-MM-dd'),
        time: newTime
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error rescheduling:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Reporter le rendez-vous</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current appointment info */}
          <div className="bg-zinc-800 rounded-lg p-3 text-sm">
            <p className="text-gray-400 mb-1">Rendez-vous actuel:</p>
            <p className="text-white font-medium">{appointment.client_name}</p>
            <p className="text-gray-400">
              {format(new Date(appointment.date), 'dd/MM/yyyy', { locale: fr })} à {appointment.time}
            </p>
          </div>

          {/* New Date */}
          <div className="space-y-2">
            <Label>Nouvelle date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700",
                    !newDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newDate ? format(newDate, 'PPP', { locale: fr }) : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800">
                <Calendar
                  mode="single"
                  selected={newDate}
                  onSelect={setNewDate}
                  locale={fr}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border-0"
                  classNames={{
                    day_selected: "bg-amber-500 text-black hover:bg-amber-600",
                    day_today: "bg-zinc-800 text-amber-500",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* New Time */}
          <div className="space-y-2">
            <Label>Nouvelle heure</Label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map(time => (
                <Button
                  key={time}
                  variant="outline"
                  size="sm"
                  onClick={() => setNewTime(time)}
                  className={cn(
                    "border-zinc-700",
                    newTime === time 
                      ? "bg-amber-500 text-black border-amber-500 hover:bg-amber-600" 
                      : "bg-zinc-800 hover:bg-zinc-700 text-white"
                  )}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-zinc-700 hover:bg-zinc-800"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!newDate || !newTime || isSubmitting}
            className="bg-amber-500 hover:bg-amber-600 text-black"
          >
            {isSubmitting ? 'En cours...' : 'Confirmer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}