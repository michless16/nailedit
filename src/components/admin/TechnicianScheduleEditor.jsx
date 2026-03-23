import React, { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from 'lucide-react';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const DEFAULT_SCHEDULE = DAYS.map((day) => ({
  day,
  is_open: day !== 'Dimanche',
  open_time: '09:00',
  close_time: '18:00'
}));

const TIME_OPTIONS = [];
for (let h = 7; h <= 21; h++) {
  for (let m of [0, 30]) {
    TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }
}

export default function TechnicianScheduleEditor({ schedule, onChange }) {
  const currentSchedule = (schedule && schedule.length > 0)
    ? DAYS.map(day => schedule.find(s => s.day === day) || { day, is_open: day !== 'Dimanche', open_time: '09:00', close_time: '18:00' })
    : DEFAULT_SCHEDULE;

  const updateDay = (index, field, value) => {
    const updated = [...currentSchedule];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-rose-500" />
        <h4 className="text-white font-semibold">Horaire de travail</h4>
      </div>
      {currentSchedule.map((daySchedule, index) => (
        <div key={daySchedule.day} className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
          <div className="w-24 flex-shrink-0">
            <span className={`text-sm font-medium ${daySchedule.is_open ? 'text-white' : 'text-zinc-500'}`}>
              {daySchedule.day}
            </span>
          </div>

          <Switch
            checked={daySchedule.is_open}
            onCheckedChange={(val) => updateDay(index, 'is_open', val)}
          />

          {daySchedule.is_open ? (
            <div className="flex items-center gap-2 flex-1">
              <Select
                value={daySchedule.open_time}
                onValueChange={(val) => updateDay(index, 'open_time', val)}
              >
                <SelectTrigger className="bg-zinc-700 border-zinc-600 h-8 text-sm w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 max-h-48">
                  {TIME_OPTIONS.map(t => (
                    <SelectItem key={t} value={t} className="text-white text-sm">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-zinc-400 text-sm">→</span>
              <Select
                value={daySchedule.close_time}
                onValueChange={(val) => updateDay(index, 'close_time', val)}
              >
                <SelectTrigger className="bg-zinc-700 border-zinc-600 h-8 text-sm w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 max-h-48">
                  {TIME_OPTIONS.map(t => (
                    <SelectItem key={t} value={t} className="text-white text-sm">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <span className="text-zinc-500 text-sm italic">Repos</span>
          )}
        </div>
      ))}
    </div>
  );
}