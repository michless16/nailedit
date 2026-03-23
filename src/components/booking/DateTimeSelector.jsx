import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Check, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { format, addDays, isSameDay, isToday, isBefore, startOfDay, addMonths, startOfMonth, endOfMonth, getDay, getDaysInMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

const DAYS_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

function generateTimeSlots(openTime, closeTime) {
  const slots = [];
  const [openH, openM] = openTime.split(':').map(Number);
  const [closeH, closeM] = closeTime.split(':').map(Number);
  let h = openH;
  let m = openM;
  while (h < closeH || (h === closeH && m < closeM)) {
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    m += 30;
    if (m >= 60) { m = 0; h++; }
  }
  return slots;
}

export default function DateTimeSelector({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  openingHours,
  existingAppointments,
  technicianSchedule
}) {
  const [monthOffset, setMonthOffset] = useState(0);

  const today = useMemo(() => startOfDay(new Date()), []);

  const currentMonth = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + monthOffset);
    return d;
  }, [monthOffset]);

  // Resolve schedule: technician's schedule takes priority over shop opening hours
  const getEffectiveSchedule = () => {
    if (technicianSchedule && technicianSchedule.length > 0) return technicianSchedule;
    if (openingHours && openingHours.length > 0) return openingHours;
    return null;
  };

  const isDayOpen = (date) => {
    const schedule = getEffectiveSchedule();
    if (!schedule) return date.getDay() !== 0;
    const dayName = DAYS_FR[date.getDay()];
    const daySchedule = schedule.find(s => s.day === dayName);
    return daySchedule?.is_open ?? (date.getDay() !== 0);
  };

  const isPastDate = (date) => isBefore(startOfDay(date), today);

  const getDaySchedule = (date) => {
    const schedule = getEffectiveSchedule();
    if (!schedule) return { open_time: '09:00', close_time: '18:00' };
    const dayName = DAYS_FR[date.getDay()];
    return schedule.find(s => s.day === dayName) || { open_time: '09:00', close_time: '18:00' };
  };

  const getAvailableSlots = () => {
    if (!selectedDate) return [];
    const daySchedule = getDaySchedule(selectedDate);
    const allSlots = generateTimeSlots(
      daySchedule.open_time || '09:00',
      daySchedule.close_time || '18:00'
    );
    const bookedTimes = existingAppointments
      ?.filter(apt => apt.date === format(selectedDate, 'yyyy-MM-dd') && apt.status !== 'cancelled')
      .map(apt => apt.time) || [];
    return allSlots.filter(slot => !bookedTimes.includes(slot));
  };

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = startOfMonth(currentMonth);
    const lastDay = endOfMonth(currentMonth);
    const startPad = getDay(firstDay); // 0=Sunday
    const days = [];

    // Pad before
    for (let i = 0; i < startPad; i++) {
      days.push(null);
    }

    // Days of month
    for (let d = 1; d <= getDaysInMonth(currentMonth); d++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
      days.push(date);
    }

    return days;
  }, [currentMonth]);

  const DAY_HEADERS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div>
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: fr })}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMonthOffset(m => Math.max(0, m - 1))}
              disabled={monthOffset === 0}
              className="border-zinc-700 hover:bg-zinc-800 text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMonthOffset(m => m + 1)}
              className="border-zinc-700 hover:bg-zinc-800 text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Technician schedule indicator */}
        {technicianSchedule && technicianSchedule.length > 0 && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
            <Clock className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <p className="text-rose-300 text-xs">
              Disponibilités selon l'horaire de la technicienne sélectionnée
            </p>
          </div>
        )}

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAY_HEADERS.map(d => (
            <div key={d} className="text-center text-zinc-500 text-xs font-medium py-2">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, i) => {
            if (!date) return <div key={`pad-${i}`} />;
            const isOpen = isDayOpen(date);
            const isPast = isPastDate(date);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isDisabled = !isOpen || isPast;
            const isTodayDate = isToday(date);

            return (
              <motion.button
                key={date.toISOString()}
                onClick={() => !isDisabled && onDateSelect(date)}
                disabled={isDisabled}
                whileHover={{ scale: isDisabled ? 1 : 1.05 }}
                whileTap={{ scale: isDisabled ? 1 : 0.95 }}
                className={cn(
                  "aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all duration-200 font-medium",
                  isSelected
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                    : isDisabled
                      ? "text-zinc-700 cursor-not-allowed"
                      : isTodayDate
                        ? "bg-zinc-800 text-rose-400 border border-rose-500/40 hover:bg-zinc-700"
                        : "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800"
                )}
              >
                {date.getDate()}
                {isTodayDate && (
                  <span className={cn("block w-1 h-1 rounded-full mt-0.5", isSelected ? "bg-white/60" : "bg-rose-500")} />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Sélectionné
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500/40 inline-block" /> Aujourd'hui
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-zinc-700 inline-block" /> Indisponible
          </span>
        </div>
      </div>

      {/* Time Selector */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-zinc-800 pt-6"
        >
          <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-500" />
            Choisissez une heure
          </h3>
          <p className="text-zinc-500 text-sm mb-4">
            {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })} — {getAvailableSlots().length} créneau(x) disponible(s)
          </p>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {getAvailableSlots().map((time) => (
              <motion.button
                key={time}
                onClick={() => onTimeSelect(time)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "py-3 px-2 rounded-lg font-medium text-sm transition-all duration-300 relative",
                  selectedTime === time
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                    : "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800"
                )}
              >
                {time}
                {selectedTime === time && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-2.5 h-2.5 text-white" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
          {getAvailableSlots().length === 0 && (
            <div className="text-center py-8 bg-zinc-900 rounded-xl border border-zinc-800">
              <Clock className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-gray-400">Aucun créneau disponible pour cette date.</p>
              <p className="text-gray-500 text-sm">Essayez une autre date.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}