import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function AppointmentCalendar({ appointments, onDateSelect, selectedDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState('month'); // 'day', 'week', 'month'

  const getAppointmentsForDate = (date) => {
    return appointments?.filter(apt => 
      isSameDay(parseISO(apt.date), date)
    ) || [];
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekStart = startOfWeek(selectedDate || new Date(), { locale: fr });
  const weekEnd = endOfWeek(selectedDate || new Date(), { locale: fr });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(selectedDate || new Date());
    const sortedAppointments = dayAppointments.sort((a, b) => a.time.localeCompare(b.time));

    return (
      <div className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-white">
            {format(selectedDate || new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
          </h3>
          <p className="text-gray-400 text-sm mt-1">{dayAppointments.length} rendez-vous</p>
        </div>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {sortedAppointments.map(apt => (
            <div key={apt.id} className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Clock className="w-4 h-4" />
                  {apt.time}
                </div>
                <div className="flex-1 text-white text-sm">{apt.client_name}</div>
              </div>
              <div className="text-gray-400 text-xs mt-1">{apt.service_name} - {apt.barber_name}</div>
            </div>
          ))}
          {dayAppointments.length === 0 && (
            <p className="text-center text-gray-500 py-8">Aucun rendez-vous</p>
          )}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    return (
      <div className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-white">
            Semaine du {format(weekStart, 'd MMM', { locale: fr })} au {format(weekEnd, 'd MMM', { locale: fr })}
          </h3>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {daysInWeek.map(day => {
            const dayAppointments = getAppointmentsForDate(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            
            return (
              <button
                key={day.toString()}
                onClick={() => onDateSelect(day)}
                className={cn(
                  "p-2 rounded-lg border transition-all",
                  isSelected 
                    ? "bg-amber-500 border-amber-500 text-black" 
                    : "bg-zinc-800 border-zinc-700 hover:border-amber-500/50 text-white"
                )}
              >
                <div className="text-xs font-medium mb-1">
                  {format(day, 'EEE', { locale: fr })}
                </div>
                <div className="text-lg font-bold mb-1">{format(day, 'd')}</div>
                {dayAppointments.length > 0 && (
                  <div className={cn(
                    "text-xs",
                    isSelected ? "text-black" : "text-amber-500"
                  )}>
                    {dayAppointments.length} RDV
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    return (
      <div className="p-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          locale={fr}
          className="rounded-md border-0"
          classNames={{
            months: "space-y-4",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center text-white",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 hover:bg-zinc-800 text-gray-400 hover:text-white",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-gray-300 rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-amber-500/10",
            day: cn(
              "h-9 w-9 p-0 font-normal hover:bg-zinc-800 rounded-md text-white",
              "aria-selected:bg-amber-500 aria-selected:text-black aria-selected:hover:bg-amber-600"
            ),
            day_selected: "bg-amber-500 text-black hover:bg-amber-600 font-bold",
            day_today: "bg-zinc-800 text-amber-500 font-bold",
            day_outside: "text-gray-600 opacity-50",
            day_disabled: "text-gray-700 opacity-30",
            day_hidden: "invisible",
          }}
          components={{
            Day: ({ date, ...props }) => {
              const dayAppointments = getAppointmentsForDate(date);
              return (
                <div className="relative">
                  <button {...props} className={props.className}>
                    {format(date, 'd')}
                  </button>
                  {dayAppointments.length > 0 && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    </div>
                  )}
                </div>
              );
            }
          }}
        />
      </div>
    );
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-white">Calendrier</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView('day')}
            className={cn(
              "text-xs",
              view === 'day' ? "bg-amber-500 text-black hover:bg-amber-600" : "text-gray-400 hover:text-white"
            )}
          >
            Jour
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView('week')}
            className={cn(
              "text-xs",
              view === 'week' ? "bg-amber-500 text-black hover:bg-amber-600" : "text-gray-400 hover:text-white"
            )}
          >
            Semaine
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView('month')}
            className={cn(
              "text-xs",
              view === 'month' ? "bg-amber-500 text-black hover:bg-amber-600" : "text-gray-400 hover:text-white"
            )}
          >
            Mois
          </Button>
        </div>
      </div>

      {/* Calendar Views */}
      {view === 'day' && renderDayView()}
      {view === 'week' && renderWeekView()}
      {view === 'month' && renderMonthView()}
    </Card>
  );
}