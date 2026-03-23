import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Clock, DollarSign, Loader2 } from 'lucide-react';
import { toast } from "sonner";

export default function AdminServices() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    image_url: '',
    is_active: true,
    order: 0
  });

  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery({
    queryKey: ['services-admin'],
    queryFn: () => apiClient.entities.Service.list('order')
  });

  const createMutation = useMutation({
    mutationFn: (data) => apiClient.entities.Service.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['services-admin']);
      queryClient.invalidateQueries(['services']);
      toast.success('Service créé avec succès');
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => apiClient.entities.Service.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['services-admin']);
      queryClient.invalidateQueries(['services']);
      toast.success('Service mis à jour');
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.entities.Service.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['services-admin']);
      queryClient.invalidateQueries(['services']);
      toast.success('Service supprimé');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      image_url: '',
      is_active: true,
      order: 0
    });
    setEditingService(null);
    setIsOpen(false);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price?.toString() || '',
      duration: service.duration?.toString() || '',
      image_url: service.image_url || '',
      is_active: service.is_active ?? true,
      order: service.order || 0
    });
    setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration)
    };

    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Services</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-rose-500 hover:bg-rose-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Service
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Modifier le service' : 'Nouveau service'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Nom du service *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prix ($) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-zinc-800 border-zinc-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Durée (min) *</Label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="bg-zinc-800 border-zinc-700"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>URL de l'image</Label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Service actif</Label>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1 border-zinc-700"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingService ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        </div>
      ) : (
        <div className="grid gap-4">
          {services?.map((service) => (
            <Card key={service.id} className="bg-zinc-900 border-zinc-800 p-4">
              <div className="flex items-center gap-4">
                {service.image_url && (
                  <img
                    src={service.image_url}
                    alt={service.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{service.name}</h3>
                    {!service.is_active && (
                      <span className="px-2 py-0.5 bg-zinc-700 text-zinc-400 text-xs rounded">
                        Inactif
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-1">{service.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-rose-500 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      {service.price}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      {service.duration} min
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(service)}
                    className="border-zinc-700 hover:bg-zinc-800"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(service.id)}
                    className="border-red-900 hover:bg-red-900/20 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {services?.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              Aucun service. Créez votre premier service!
            </div>
          )}
        </div>
      )}
    </div>
  );
}