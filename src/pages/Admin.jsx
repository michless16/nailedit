import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Users, Settings, Calendar, LogOut, Shield, Loader2, AlertCircle } from 'lucide-react';

import AdminServices from '@/components/admin/AdminServices';
import AdminTechnicians from '@/components/admin/AdminTechnicians';
import AdminAppointments from '@/components/admin/AdminAppointments';
import AdminSettings from '@/components/admin/AdminSettings';

/**
 * Formulaire de connexion admin.
 */
function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await apiClient.auth.login(email, password);
      if (user.role !== 'admin') {
        setError('Accès refusé. Ce compte n\'a pas les droits administrateur.');
        await apiClient.auth.logout();
        return;
      }
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Administration</h1>
          <p className="text-gray-400">Connectez-vous pour accéder au panneau d'administration</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="admin@example.com"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Se connecter
          </Button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          <a href="/" className="text-rose-500 hover:text-rose-400">← Retour au site</a>
        </p>
      </div>
    </div>
  );
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await apiClient.auth.isAuthenticated();
        if (!isAuth) {
          setNeedsLogin(true);
          setLoading(false);
          return;
        }
        const currentUser = await apiClient.auth.me();
        if (currentUser?.role !== 'admin') {
          setNeedsLogin(true);
          setLoading(false);
          return;
        }
        setUser(currentUser);
        setLoading(false);
      } catch (err) {
        console.error('Auth check error:', err);
        setNeedsLogin(true);
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setNeedsLogin(false);
  };

  const handleLogout = async () => {
    await apiClient.auth.logout();
    setUser(null);
    setNeedsLogin(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (needsLogin) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
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
            <div className="flex items-center gap-3">
              <a href="/" className="text-gray-400 hover:text-white text-sm">← Retour au site</a>
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
