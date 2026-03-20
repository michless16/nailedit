import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import HeroSection from '@/components/home/HeroSection';
import ServicesPreview from '@/components/home/ServicesPreview';
import BarbersSection from '@/components/home/BarbersSection';
import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';

export default function Home() {
  const { data: settings } = useQuery({
    queryKey: ['shopSettings'],
    queryFn: async () => {
      const list = await apiClient.entities.ShopSettings.list();
      return list[0] || null;
    }
  });

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => apiClient.entities.Service.filter({ is_active: true }, 'order')
  });

  const { data: technicians } = useQuery({
    queryKey: ['technicians'],
    queryFn: () => apiClient.entities.Technician.filter({ is_active: true }, 'order')
  });

  return (
    <div className="bg-black min-h-screen">
      <HeroSection settings={settings} />
      <ServicesPreview services={services} />
      <BarbersSection technicians={technicians} />
      <AboutSection settings={settings} />
      <ContactSection settings={settings} />
    </div>
  );
}