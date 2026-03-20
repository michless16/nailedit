import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, User, Phone, Mail, Scissors, Loader2, Filter, X, CalendarClock, Ban, Search } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from "sonner";
import { cn } from '@/lib/utils';
import AppointmentCalendar from './AppointmentCalendar';
import RescheduleDialog from './RescheduleDialog';

const statusConfig = {
  pending: { label: 'En attente', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' },
  confirmed: { label: 'Confirmé', color: 'bg-green-500/10 text-green-500 border-green-500/30' },
  cancelled: { label: 'Annulé', color: 'bg-red-500/10 text-red-500 border-red-500/30' },
  completed: { label: 'Terminé', color: 'bg-gray-500/10 text-gray-400 border-gray-500/30' }
};

export default function AdminAppointments() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments-admin'],
    queryFn: () => apiClient.entities.Appointment.list('-date')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => apiClient.entities.Appointment.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments-admin']);
      toast.success('Rendez-vous mis à jour');
    }
  });

  const handleStatusChange = (appointmentId, newStatus) => {
    updateMutation.mutate({ id: appointmentId, data: { status: newStatus } });
  };

  const handleCancel = (appointmentId) => {
    if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      updateMutation.mutate({ id: appointmentId, data: { status: 'cancelled' } });
    }
  };

  const handleReschedule = async (appointmentId, newData) => {
    await updateMutation.mutateAsync({ id: appointmentId, data: newData });
    toast.success('Rendez-vous reporté avec succès');
  };

  const filteredAppointments = appointments?.filter(apt => {
    const statusMatch = statusFilter === 'all' || apt.status === statusFilter;
    const clientMatch = !clientFilter || apt.client_name.toLowerCase().includes(clientFilter.toLowerCase());
    const serviceMatch = !serviceFilter || apt.service_name.toLowerCase().includes(serviceFilter.toLowerCase());
    const dateMatch = !selectedDate || apt.date === format(selectedDate, 'yyyy-MM-dd');
    
    return statusMatch && clientMatch && serviceMatch && dateMatch;
  });

  const getDateLabel = (dateStr) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Aujourd\'hui';
    if (isTomorrow(date)) return 'Demain';
    return format(date, 'EEEE d MMMM', { locale: fr });
  };

  // Grouper par date
  const groupedAppointments = filteredAppointments?.reduce((groups, apt) => {
    const date = apt.date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(apt);
    return groups;
  }, {});

  const sortedDates = groupedAppointments ? Object.keys(groupedAppointments).sort((a, b) => 
    new Date(b) - new Date(a)
  ) : [];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Rendez-vous</h2>
        
        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher un client..."
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="bg-zinc-900 border-zinc-700 pl-9 text-white"
            />
            {clientFilter && (
              <button
                onClick={() => setClientFilter('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher un service..."
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="bg-zinc-900 border-zinc-700 pl-9 text-white"
            />
            {serviceFilter && (
              <button
                onClick={() => setServiceFilter('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="all" className="text-white">Tous les statuts</SelectItem>
              <SelectItem value="pending" className="text-white">En attente</SelectItem>
              <SelectItem value="confirmed" className="text-white">Confirmés</SelectItem>
              <SelectItem value="completed" className="text-white">Terminés</SelectItem>
              <SelectItem value="cancelled" className="text-white">Annulés</SelectItem>
            </SelectContent>
          </Select>

          {selectedDate && (
            <Button
              variant="outline"
              onClick={() => setSelectedDate(null)}
              className="border-zinc-700 hover:bg-zinc-800"
            >
              <X className="w-4 h-4 mr-2" />
              Réinitialiser date
            </Button>
          )}
        </div>
      </div>

      {/* Calendar + List Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <AppointmentCalendar
            appointments={appointments}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
          ) : (
            <div className="space-y-8">
          {sortedDates.map(date => (
            <div key={date}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 capitalize">
                <Calendar className="w-5 h-5 text-rose-500" />
                {getDateLabel(date)}
                <span className="text-gray-500 text-sm font-normal">
                  ({groupedAppointments[date].length} RDV)
                </span>
              </h3>
              <div className="grid gap-3">
                {groupedAppointments[date]
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(apt => (
                    <Card key={apt.id} className="bg-zinc-900 border-zinc-800 p-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Time */}
                        <div className="flex items-center gap-2 md:w-24">
                          <Clock className="w-4 h-4 text-rose-500" />
                          <span className="text-white font-semibold text-lg">{apt.time}</span>
                        </div>

                        {/* Client Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-white font-medium">{apt.client_name}</span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {apt.client_phone}
                            </span>
                            {apt.client_email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {apt.client_email}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Service & Technician */}
                        <div className="text-sm">
                          <div className="flex items-center gap-2 text-white">
                            <Scissors className="w-4 h-4 text-rose-500" />
                            {apt.service_name}
                            <span className="text-rose-500 font-semibold">${apt.service_price}</span>
                          </div>
                          <div className="text-gray-400 mt-1">
                            avec {apt.technician_name}
                          </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex flex-col gap-2">
                          <Select 
                            value={apt.status} 
                            onValueChange={(value) => handleStatusChange(apt.id, value)}
                          >
                            <SelectTrigger className={cn(
                              "w-36 border font-medium",
                              statusConfig[apt.status]?.color
                            )}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                              <SelectItem value="pending" className="text-white">En attente</SelectItem>
                              <SelectItem value="confirmed" className="text-white">Confirmé</SelectItem>
                              <SelectItem value="completed" className="text-white">Terminé</SelectItem>
                              <SelectItem value="cancelled" className="text-white">Annulé</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setRescheduleAppointment(apt)}
                              className="flex-1 border-zinc-700 hover:bg-zinc-800 text-xs"
                            >
                              <CalendarClock className="w-3 h-3 mr-1" />
                              Reporter
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancel(apt.id)}
                              className="border-red-500/30 hover:bg-red-500/10 text-red-500 text-xs px-2"
                            >
                              <Ban className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {apt.notes && (
                        <div className="mt-3 pt-3 border-t border-zinc-800">
                          <p className="text-gray-400 text-sm">
                            <span className="text-gray-500">Note:</span> {apt.notes}
                          </p>
                        </div>
                      )}
                    </Card>
                  ))}
              </div>
            </div>
          ))}

          {filteredAppointments?.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              Aucun rendez-vous trouvé.
            </div>
          )}
            </div>
          )}
        </div>
      </div>

      {/* Reschedule Dialog */}
      <RescheduleDialog
        appointment={rescheduleAppointment}
        open={!!rescheduleAppointment}
        onOpenChange={(open) => !open && setRescheduleAppointment(null)}
        onReschedule={(newData) => handleReschedule(rescheduleAppointment.id, newData)}
      />
    </div>
  );
}