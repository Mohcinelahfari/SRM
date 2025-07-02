"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import axiosClient from '@/lib/api/axiosClient';

interface Post {
  id: string;
  title: string;
  department: { name: string };
  employees: any[];
}

interface DeletePostModalProps {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function DeletePostModal({ post, open, onOpenChange, onSuccess }: DeletePostModalProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!post) return;

    setLoading(true);
    try {
      await axiosClient.delete(`/posts/${post.id}`);
      toast.success('Poste supprimé avec succès');
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erreur lors de la suppression du poste:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression du poste');
    } finally {
      setLoading(false);
    }
  };

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Supprimer le poste
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le poste <strong>"{post.title}"</strong> du département <strong>"{post.department.name}"</strong> ?
          </DialogDescription>
        </DialogHeader>
        
        {post.employees.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Attention : Ce poste a {post.employees.length} employé(s) assigné(s)
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  La suppression de ce poste affectera les employés qui y sont assignés.
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Suppression...' : 'Supprimer le poste'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
