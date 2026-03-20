import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, Settings, Calendar, LogOut, Shield } from 'lucide-react';

import AdminServices from '@/components/admin/AdminServices';
import AdminTechnicians from '@/components/admin/AdminTechnicians';
import AdminAppointments from '@/components/admin/AdminAppointments';
import AdminSettings from '@/components/admin/AdminSettings';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await apiClient.auth.isAuthenticated();
      if (!isAuth) {
        apiClient.auth.redirectToLogin(window.location.href);
        return;
      }
      const currentUser = await apiClient.auth.me();
      if (currentUser?.role !== 'admin') {
        window.location.href = '/';
        return;
      }
      setUser(currentUser);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    apiClient.auth.logout('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Administration</h1>
                <p className="text-gray-400 text-sm">Bienvenue, {user?.full_name}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-zinc-700 hover:bg-zinc-800 text-gray-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-zinc-900 border border-zinc-800 p-1 mb-8">
            <TabsTrigger 
              value="appointments" 
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Rendez-vous
            </TabsTrigger>
            <TabsTrigger 
              value="services"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Services
            </TabsTrigger>
            <TabsTrigger 
              value="technicians"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Techniciennes
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <AdminAppointments />
          </TabsContent>

          <TabsContent value="services">
            <AdminServices />
          </TabsContent>

          <TabsContent value="technicians">
            <AdminTechnicians />
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}