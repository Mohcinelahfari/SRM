"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import axiosClient from '@/lib/api/axiosClient';

interface Department {
  id: string;
  name: string;
}

interface CreatePostModalProps {
  onSuccess?: () => void;
}

export default function CreatePostModal({ onSuccess }: CreatePostModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  useEffect(() => {
    if (open) {
      fetchDepartments();
    }
  }, [open]);

  const fetchDepartments = async () => {
    setLoadingDepartments(true);
    try {
      const response = await axiosClient.get<Department[]>('/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des départements:', error);
      toast.error('Impossible de charger les départements');
    } finally {
      setLoadingDepartments(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !departmentId) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await axiosClient.post('/posts', {
        title: title.trim(),
        departmentId: parseInt(departmentId)
      });
      
      toast.success('Poste créé avec succès');
      setTitle('');
      setDepartmentId('');
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Erreur lors de la création du poste:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la création du poste');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDepartmentId('');
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouveau Poste
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau poste</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau poste à votre organisation. Renseignez le titre et sélectionnez le département.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre du poste</Label>
              <Input
                id="title"
                placeholder="Ex: Développeur Frontend"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Département</Label>
              <Select value={departmentId} onValueChange={setDepartmentId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un département" />
                </SelectTrigger>
                <SelectContent>
                  {loadingDepartments ? (
                    <SelectItem value="loading" disabled>
                      Chargement...
                    </SelectItem>
                  ) : (
                    departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading || loadingDepartments}>
              {loading ? 'Création...' : 'Créer le poste'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
