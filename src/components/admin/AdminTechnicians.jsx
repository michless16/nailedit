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
import { Plus, Pencil, Trash2, Loader2, User, Clock } from 'lucide-react';
import { toast } from "sonner";
import TechnicianScheduleEditor from './TechnicianScheduleEditor';

export default function AdminTechnicians() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    photo_url: '',
    is_active: true,
    order: 0,
    schedule: []
  });

  const queryClient = useQueryClient();

  const { data: technicians, isLoading } = useQuery({
    queryKey: ['technicians-admin'],
    queryFn: () => apiClient.entities.Technician.list('order')
  });

  const createMutation = useMutation({
    mutationFn: (data) => apiClient.entities.Technician.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['technicians-admin']);
      queryClient.invalidateQueries(['technicians']);
      toast.success('Technicienne ajoutée avec succès');
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => apiClient.entities.Technician.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['technicians-admin']);
      queryClient.invalidateQueries(['technicians']);
      toast.success('Technicienne mise à jour');
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiClient.entities.Technician.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['technicians-admin']);
      queryClient.invalidateQueries(['technicians']);
      toast.success('Technicienne supprimée');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      bio: '',
      photo_url: '',
      is_active: true,
      order: 0,
      schedule: []
    });
    setEditingTechnician(null);
    setIsOpen(false);
  };

  const handleEdit = (technician) => {
    setEditingTechnician(technician);
    setFormData({
      name: technician.name,
      title: technician.title || '',
      bio: technician.bio || '',
      photo_url: technician.photo_url || '',
      is_active: technician.is_active ?? true,
      order: technician.order || 0,
      schedule: technician.schedule || []
    });
    setIsOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTechnician) {
      updateMutation.mutate({ id: editingTechnician.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette technicienne ?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Techniciennes</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-rose-500 hover:bg-rose-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Technicienne
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTechnician ? 'Modifier la technicienne' : 'Nouvelle technicienne'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Nom *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Titre / Spécialité</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="Ex: Experte Manucure, Spécialiste Nail Art..."
                />
              </div>
              <div className="space-y-2">
                <Label>Biographie</Label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="Courte description..."
                />
              </div>
              <div className="space-y-2">
                <Label>URL de la photo</Label>
                <Input
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Technicienne active</Label>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>

              <div className="border-t border-zinc-700 pt-4">
                <TechnicianScheduleEditor
                  schedule={formData.schedule}
                  onChange={(schedule) => setFormData({ ...formData, schedule })}
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
                  {editingTechnician ? 'Mettre à jour' : 'Ajouter'}
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {technicians?.map((technician) => (
            <Card key={technician.id} className="bg-zinc-900 border-zinc-800 overflow-hidden">
              <div className="aspect-square overflow-hidden relative">
                {technician.photo_url ? (
                  <img
                    src={technician.photo_url}
                    alt={technician.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <User className="w-20 h-20 text-zinc-600" />
                  </div>
                )}
                {!technician.is_active && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-zinc-800/90 text-zinc-400 text-xs rounded">
                    Inactive
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white text-lg">{technician.name}</h3>
                <p className="text-rose-500 text-sm">{technician.title || 'Technicienne'}</p>
                {technician.bio && (
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">{technician.bio}</p>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(technician)}
                    className="flex-1 border-zinc-700 hover:bg-zinc-800"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(technician.id)}
                    className="border-red-900 hover:bg-red-900/20 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {technicians?.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              Aucune technicienne. Ajoutez votre première technicienne!
            </div>
          )}
        </div>
      )}
    </div>
  );
}