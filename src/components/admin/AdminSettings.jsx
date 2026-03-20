import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Store, Clock, Globe, UserPlus, Mail } from 'lucide-react';
import { toast } from "sonner";

const defaultDays = [
  { day: 'Lundi', is_open: true, open_time: '09:00', close_time: '19:00' },
  { day: 'Mardi', is_open: true, open_time: '09:00', close_time: '19:00' },
  { day: 'Mercredi', is_open: true, open_time: '09:00', close_time: '19:00' },
  { day: 'Jeudi', is_open: true, open_time: '09:00', close_time: '19:00' },
  { day: 'Vendredi', is_open: true, open_time: '09:00', close_time: '19:00' },
  { day: 'Samedi', is_open: true, open_time: '09:00', close_time: '17:00' },
  { day: 'Dimanche', is_open: false, open_time: '09:00', close_time: '17:00' }
];

export default function AdminSettings() {
  const [formData, setFormData] = useState({
    shop_name: '',
    tagline: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    hero_image_url: '',
    logo_url: '',
    instagram_url: '',
    facebook_url: '',
    opening_hours: defaultDays
  });
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('admin');

  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['shopSettings-admin'],
    queryFn: async () => {
      const list = await apiClient.entities.ShopSettings.list();
      return list[0] || null;
    }
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        shop_name: settings.shop_name || '',
        tagline: settings.tagline || '',
        description: settings.description || '',
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || '',
        hero_image_url: settings.hero_image_url || '',
        logo_url: settings.logo_url || '',
        instagram_url: settings.instagram_url || '',
        facebook_url: settings.facebook_url || '',
        opening_hours: settings.opening_hours?.length > 0 ? settings.opening_hours : defaultDays
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (settings?.id) {
        return apiClient.entities.ShopSettings.update(settings.id, data);
      } else {
        return apiClient.entities.ShopSettings.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['shopSettings-admin']);
      queryClient.invalidateQueries(['shopSettings']);
      toast.success('Paramètres sauvegardés');
    }
  });

  const inviteMutation = useMutation({
    mutationFn: async ({ email, role }) => {
      return await apiClient.users.inviteUser(email, role);
    },
    onSuccess: () => {
      toast.success('Invitation envoyée avec succès');
      setInviteEmail('');
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'invitation: ' + error.message);
    }
  });

  const handleScheduleChange = (index, field, value) => {
    const newHours = [...formData.opening_hours];
    newHours[index] = { ...newHours[index], [field]: value };
    setFormData({ ...formData, opening_hours: newHours });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) {
      toast.error('Veuillez entrer un email');
      return;
    }
    inviteMutation.mutate({ email: inviteEmail, role: inviteRole });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Invite Admin */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <UserPlus className="w-5 h-5 text-amber-500" />
            Inviter un administrateur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="flex gap-4">
            <div className="flex-1">
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@exemple.com"
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <Button
              type="submit"
              disabled={inviteMutation.isPending}
              className="bg-amber-500 hover:bg-amber-600 text-black"
            >
              {inviteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Inviter
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shop Info */}
        <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Store className="w-5 h-5 text-amber-500" />
            Informations de la boutique
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Nom de la boutique</Label>
              <Input
                value={formData.shop_name}
                onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Mon Barbershop"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Slogan</Label>
              <Input
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="Votre style, notre passion"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="Décrivez votre barbershop..."
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Adresse</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="123 Rue Principale"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Téléphone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="(514) 555-0000"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Email</Label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="contact@barbershop.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Globe className="w-5 h-5 text-amber-500" />
            Images & Réseaux sociaux
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Image principale (Hero)</Label>
              <Input
                value={formData.hero_image_url}
                onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Logo</Label>
              <Input
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Instagram URL</Label>
              <Input
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Facebook URL</Label>
              <Input
                value={formData.facebook_url}
                onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opening Hours */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Clock className="w-5 h-5 text-amber-500" />
            Heures d'ouverture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {formData.opening_hours.map((schedule, index) => (
              <div 
                key={schedule.day}
                className="flex items-center gap-4 py-3 border-b border-zinc-800 last:border-0"
              >
                <div className="w-28">
                  <span className="text-white font-medium">{schedule.day}</span>
                </div>
                <Switch
                  checked={schedule.is_open}
                  onCheckedChange={(checked) => handleScheduleChange(index, 'is_open', checked)}
                />
                {schedule.is_open && (
                  <>
                    <Input
                      type="time"
                      value={schedule.open_time}
                      onChange={(e) => handleScheduleChange(index, 'open_time', e.target.value)}
                      className="w-32 bg-zinc-800 border-zinc-700 text-white"
                    />
                    <span className="text-gray-400">à</span>
                    <Input
                      type="time"
                      value={schedule.close_time}
                      onChange={(e) => handleScheduleChange(index, 'close_time', e.target.value)}
                      className="w-32 bg-zinc-800 border-zinc-700 text-white"
                    />
                  </>
                )}
                {!schedule.is_open && (
                  <span className="text-gray-500">Fermé</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saveMutation.isPending}
            className="bg-amber-500 hover:bg-amber-600 text-black px-8"
          >
            {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </form>
    </div>
  );
}