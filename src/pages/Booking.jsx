import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

import ServiceSelector from '@/components/booking/ServiceSelector';
import TechnicianSelector from '@/components/booking/TechnicianSelector';
import DateTimeSelector from '@/components/booking/DateTimeSelector';
import ClientForm from '@/components/booking/ClientForm';
import BookingSummary from '@/components/booking/BookingSummary';

const steps = [
  { id: 1, title: 'Service' },
  { id: 2, title: 'Technicienne' },
  { id: 3, title: 'Date & Heure' },
  { id: 4, title: 'Confirmation' }
];

export default function Booking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
    send_confirmation: true,
    send_reminder: true,
    send_thank_you: true
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const queryClient = useQueryClient();

  // Check for pre-selected service from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('service');
    if (serviceId && services) {
      const preSelected = services.find(s => s.id === serviceId);
      if (preSelected) {
        setSelectedService(preSelected);
        setCurrentStep(2);
      }
    }
  }, []);

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => apiClient.entities.Service.filter({ is_active: true }, 'order')
  });

  const { data: technicians } = useQuery({
    queryKey: ['technicians'],
    queryFn: () => apiClient.entities.Technician.filter({ is_active: true }, 'order')
  });

  const { data: settings } = useQuery({
    queryKey: ['shopSettings'],
    queryFn: async () => {
      const list = await apiClient.entities.ShopSettings.list();
      return list[0] || null;
    }
  });

  const { data: appointments } = useQuery({
    queryKey: ['appointments', selectedTechnician?.id],
    queryFn: () => selectedTechnician 
      ? apiClient.entities.Appointment.filter({ technician_id: selectedTechnician.id })
      : Promise.resolve([]),
    enabled: !!selectedTechnician
  });

  const createAppointment = useMutation({
    mutationFn: async (data) => {
      const appointment = await apiClient.entities.Appointment.create(data);
      
      // Send confirmation email if client has email and wants notifications
      if (appointment.client_email && data.notification_preferences?.send_confirmation !== false) {
        try {
          await apiClient.functions.invoke('sendBookingNotifications', {
            appointment_id: appointment.id,
            notification_type: 'confirmation'
          });
        } catch (error) {
          console.error('Error sending confirmation email:', error);
        }
      }
      
      return appointment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      setBookingSuccess(true);
    }
  });

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!selectedService;
      case 2: return !!selectedTechnician;
      case 3: return !!selectedDate && !!selectedTime;
      case 4: return clientInfo.name && clientInfo.phone;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else if (canProceed()) {
      // Submit booking
      createAppointment.mutate({
        client_name: clientInfo.name,
        client_email: clientInfo.email,
        client_phone: clientInfo.phone,
        technician_id: selectedTechnician.id,
        technician_name: selectedTechnician.name,
        service_id: selectedService.id,
        service_name: selectedService.name,
        service_price: selectedService.price,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        notes: clientInfo.notes,
        status: 'confirmed',
        notification_preferences: {
          send_confirmation: clientInfo.send_confirmation,
          send_reminder: clientInfo.send_reminder,
          send_thank_you: clientInfo.send_thank_you
        },
        notifications_sent: {
          confirmation_sent: false,
          reminder_sent: false,
          thank_you_sent: false
        }
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Check className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Réservation Confirmée!
          </h1>
          <p className="text-gray-400 mb-8">
            Votre rendez-vous a été enregistré avec succès. {clientInfo.email && clientInfo.send_confirmation ? 'Un email de confirmation vous a été envoyé.' : ''} Nous avons hâte de vous accueillir!
          </p>
          <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 text-left mb-8">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Service:</span>
                <span className="text-white font-medium">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Technicienne:</span>
                <span className="text-white font-medium">{selectedTechnician?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date:</span>
                <span className="text-white font-medium">
                  {selectedDate && format(selectedDate, 'dd/MM/yyyy')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Heure:</span>
                <span className="text-white font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-zinc-800">
                <span className="text-gray-400">Total à payer:</span>
                <span className="text-rose-500 font-bold text-xl">${selectedService?.price}</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-rose-500 hover:bg-rose-600 text-white px-8"
          >
            Retour à l'accueil
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-rose-500" />
            <h1 className="text-2xl font-bold text-white">Réservation</h1>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                  className={cn(
                    "flex items-center gap-3 transition-colors",
                    step.id <= currentStep ? "cursor-pointer" : "cursor-default"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                    step.id === currentStep
                      ? "bg-rose-500 text-white"
                      : step.id < currentStep
                        ? "bg-green-500 text-white"
                        : "bg-zinc-800 text-zinc-500"
                  )}>
                    {step.id < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className={cn(
                    "hidden sm:block font-medium transition-colors",
                    step.id === currentStep ? "text-white" : "text-zinc-500"
                  )}>
                    {step.title}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-px mx-4 transition-colors",
                    step.id < currentStep ? "bg-green-500" : "bg-zinc-800"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && (
                  <ServiceSelector
                    services={services}
                    selectedService={selectedService}
                    onSelect={setSelectedService}
                  />
                )}
                {currentStep === 2 && (
                  <TechnicianSelector
                    technicians={technicians}
                    selectedTechnician={selectedTechnician}
                    onSelect={setSelectedTechnician}
                  />
                )}
                {currentStep === 3 && (
                  <DateTimeSelector
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onDateSelect={setSelectedDate}
                    onTimeSelect={setSelectedTime}
                    openingHours={settings?.opening_hours}
                    existingAppointments={appointments}
                    technicianSchedule={selectedTechnician?.schedule}
                  />
                )}
                {currentStep === 4 && (
                  <ClientForm
                    clientInfo={clientInfo}
                    setClientInfo={setClientInfo}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-800">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="border-zinc-700 hover:bg-zinc-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed() || createAppointment.isPending}
                className="bg-rose-500 hover:bg-rose-600 text-white px-8"
              >
                {createAppointment.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {currentStep === 4 ? 'Confirmer' : 'Suivant'}
                {currentStep < 4 && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="hidden lg:block">
            <BookingSummary
              service={selectedService}
              technician={selectedTechnician}
              date={selectedDate}
              time={selectedTime}
            />
          </div>
        </div>
      </div>
    </div>
  );
}