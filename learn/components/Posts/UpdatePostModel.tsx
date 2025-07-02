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
import { toast } from 'sonner';
import axiosClient from '@/lib/api/axiosClient';

interface Department {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  department: Department;
  departmentId: string;
  employees: any[];
  createdAt: string;
}

interface UpdatePostModalProps {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function UpdatePostModal({ post, open, onOpenChange, onSuccess }: UpdatePostModalProps) {
  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  useEffect(() => {
    if (post && open) {
      setTitle(post.title);
      setDepartmentId(post.departmentId);
      fetchDepartments();
    }
  }, [post, open]);

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
    
    if (!post || !title.trim() || !departmentId) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await axiosClient.put(`/posts/${post.id}`, {
        title: title.trim(),
        departmentId: parseInt(departmentId)
      });
      
      toast.success('Poste modifié avec succès');
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erreur lors de la modification du poste:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la modification du poste');
    } finally {
      setLoading(false);
    }
  };

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le poste</DialogTitle>
          <DialogDescription>
            Modifiez les informations du poste "{post.title}".
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
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading || loadingDepartments}>
              {loading ? 'Modification...' : 'Modifier le poste'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
